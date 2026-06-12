"""
Client Wishes API
POST   /api/wishes                    → add a wish (multipart)
GET    /api/wishes                    → list all wishes (?status=pending|sent)
GET    /api/wishes/today              → today's unsent wishes
GET    /api/wishes/upcoming           → next 7 days unsent wishes
PUT    /api/wishes/<id>/mark-sent     → mark as sent
DELETE /api/wishes/<id>               → delete wish + Cloudinary media
"""
import os
import uuid
import logging
from datetime import date, timedelta
from flask import Blueprint, jsonify, request
from services.supabase_client import get_client, get_admin_client
from middleware.auth import require_admin

log = logging.getLogger(__name__)
wishes_bp = Blueprint("wishes", __name__)

ALLOWED_TYPES = {
    "image/jpeg": "image", "image/png": "image", "image/webp": "image",
    "video/mp4": "video",  "video/webm": "video", "video/quicktime": "video",
}

# ─── Message templates ────────────────────────────────────────────────────────

def _generate_message(wish_type: str, client_name: str, spouse_name: str = "") -> str:
    if wish_type == "Wedding Anniversary":
        partner = f" & {spouse_name}" if spouse_name else ""
        return (
            f"Happy Anniversary {client_name}{partner}!\n"
            "Wishing you both a beautiful year ahead filled with love and joy. "
            "Here's a special memory from your big day!\n- Sushma Digitals Studio"
        )
    if wish_type == "Birthday":
        return (
            f"Happy Birthday {client_name}!\n"
            "Wishing you a wonderful day and a fantastic year ahead!\n"
            "- Sushma Digitals Studio"
        )
    if wish_type == "Half Saree":
        return (
            f"Warm wishes to {client_name} on this beautiful Half Saree ceremony! "
            "May this special day be filled with wonderful memories.\n"
            "- Sushma Digitals Studio"
        )
    if wish_type == "Dhoti":
        return (
            f"Warm wishes to {client_name} on this special Dhoti ceremony! "
            "Wishing you a day full of joy and blessings.\n"
            "- Sushma Digitals Studio"
        )
    return (
        f"Warm wishes to {client_name} on this special occasion! "
        "May this day be filled with beautiful memories.\n"
        "- Sushma Digitals Studio"
    )


# ─── Helpers ─────────────────────────────────────────────────────────────────

def _matches_date_range(wish_date_str: str, start: date, end: date) -> bool:
    try:
        d = date.fromisoformat(str(wish_date_str))
        # Compare only month+day within the range
        for delta in range((end - start).days + 1):
            check = start + timedelta(days=delta)
            if d.month == check.month and d.day == check.day:
                return True
        return False
    except Exception:
        return False


def _upload_to_cloudinary(file) -> tuple[str, str, str]:
    """Returns (media_url, media_type, public_id)."""
    from services.cloudinary_service import upload_media
    content_type = file.content_type or ""
    if content_type not in ALLOWED_TYPES:
        ext = os.path.splitext(file.filename)[1].lower()
        ext_map = {".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png",
                   ".webp": "image/webp", ".mp4": "video/mp4", ".webm": "video/webm",
                   ".mov": "video/quicktime"}
        content_type = ext_map.get(ext, "")
    if content_type not in ALLOWED_TYPES:
        raise ValueError(f"Unsupported file type: {content_type}")

    media_type = ALLOWED_TYPES[content_type]
    public_id  = f"wish_{uuid.uuid4().hex}"
    result     = upload_media(file.read(), public_id, resource_type=media_type)
    return result["url"], media_type, result["public_id"]


# ─── Routes ──────────────────────────────────────────────────────────────────

@wishes_bp.route("/api/wishes", methods=["GET", "POST", "OPTIONS"])
@require_admin
def wishes_handler():
    if request.method == "OPTIONS":
        return jsonify({"ok": True}), 200
        
    if request.method == "GET":
        status = request.args.get("status")  # "pending" | "sent"
        try:
            sb = get_admin_client()
            q  = sb.table("client_wishes").select("*").order("wish_date")
            if status == "pending":
                q = q.eq("is_sent", False)
            elif status == "sent":
                q = q.eq("is_sent", True)
            result = q.execute()
            return jsonify(result.data or [])
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    # Handle POST
    client_name  = request.form.get("client_name", "").strip()
    spouse_name  = request.form.get("spouse_name", "").strip()
    wa_number    = request.form.get("whatsapp_number", "").strip()
    wish_type    = request.form.get("wish_type", "Other").strip()
    wish_date    = request.form.get("wish_date", "").strip()
    wish_message = request.form.get("wish_message", "").strip()

    if not client_name or not wa_number or not wish_date:
        return jsonify({"error": "client_name, whatsapp_number, wish_date are required"}), 400

    # Normalise number
    wa_number = wa_number.lstrip("+")
    if not wa_number.startswith("91"):
        wa_number = "91" + wa_number

    # Auto-generate message if not provided
    if not wish_message:
        wish_message = _generate_message(wish_type, client_name, spouse_name)

    media_url = media_type = cloudinary_id = None
    if "media" in request.files and request.files["media"].filename:
        try:
            media_url, media_type, cloudinary_id = _upload_to_cloudinary(request.files["media"])
        except ValueError as e:
            return jsonify({"error": str(e)}), 400
        except Exception as e:
            log.error(f"[Wishes] Cloudinary upload error: {e}")
            return jsonify({"error": "Media upload failed"}), 500

    try:
        sb = get_admin_client()
        row = {
            "client_name":      client_name,
            "spouse_name":      spouse_name or None,
            "whatsapp_number":  wa_number,
            "wish_type":        wish_type,
            "wish_date":        wish_date,
            "wish_message":     wish_message,
            "media_url":        media_url,
            "media_type":       media_type,
            "cloudinary_id":    cloudinary_id,
            "is_sent":          False,
        }
        result = sb.table("client_wishes").insert(row).execute()
        return jsonify(result.data[0]), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@wishes_bp.route("/api/wishes/today", methods=["GET"])
@require_admin
def today_wishes():
    today = date.today()
    try:
        sb = get_admin_client()
        result = sb.table("client_wishes").select("*").eq("is_sent", False).execute()
        wishes = [
            w for w in (result.data or [])
            if w.get("wish_date") and _matches_date_range(w["wish_date"], today, today)
        ]
        return jsonify(wishes)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@wishes_bp.route("/api/wishes/upcoming", methods=["GET"])
@require_admin
def upcoming_wishes():
    today = date.today()
    end   = today + timedelta(days=7)
    try:
        sb = get_admin_client()
        result = sb.table("client_wishes").select("*").eq("is_sent", False).execute()
        wishes = [
            w for w in (result.data or [])
            if w.get("wish_date") and _matches_date_range(w["wish_date"], today, end)
        ]
        wishes.sort(key=lambda w: w.get("wish_date", ""))
        return jsonify(wishes)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@wishes_bp.route("/api/wishes/<wish_id>/mark-sent", methods=["PUT"])
@require_admin
def mark_sent(wish_id):
    try:
        sb = get_admin_client()
        result = sb.table("client_wishes").update({"is_sent": True}).eq("id", wish_id).execute()
        return jsonify(result.data[0] if result.data else {"ok": True})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@wishes_bp.route("/api/wishes/<wish_id>", methods=["DELETE"])
@require_admin
def delete_wish(wish_id):
    try:
        sb = get_admin_client()
        # Fetch to get cloudinary_id
        row = sb.table("client_wishes").select("cloudinary_id,media_type").eq("id", wish_id).execute()
        if row.data:
            cid = row.data[0].get("cloudinary_id")
            mtype = row.data[0].get("media_type", "image")
            if cid:
                try:
                    from services.cloudinary_service import delete_media
                    delete_media(cid, resource_type=mtype or "image")
                except Exception:
                    pass
        sb.table("client_wishes").delete().eq("id", wish_id).execute()
        return jsonify({"ok": True})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
