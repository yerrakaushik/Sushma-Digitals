"""
Albums / Design Portfolio API
Admin uploads design photos; public can view but NOT download.
Cloudinary is used for storage with transformation URLs.

GET    /api/albums                    → list all albums
POST   /api/admin/albums              → create album
DELETE /api/admin/albums/<id>         → delete album + all its photos

GET    /api/albums/<album_id>/photos  → list photos in album
POST   /api/admin/albums/<id>/photos  → upload photo to album
DELETE /api/admin/albums/<album_id>/photos/<photo_id>  → delete photo
"""
import uuid
import logging
from flask import Blueprint, jsonify, request
from services.supabase_client import get_client, get_admin_client
from middleware.auth import require_admin

log = logging.getLogger(__name__)
albums_bp = Blueprint("albums", __name__)

ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp"}


def _upload_design_photo(file) -> dict:
    """Upload to Cloudinary under sushma_digitals/albums folder."""
    from services.cloudinary_service import upload_media
    content_type = file.content_type or ""
    if content_type not in ALLOWED_IMAGE_TYPES:
        raise ValueError("Only JPEG, PNG, WebP images are allowed")
    public_id = f"album_{uuid.uuid4().hex}"
    result = upload_media(file.read(), public_id, resource_type="image")
    return result


# ─── Albums ──────────────────────────────────────────────────────────────────

@albums_bp.route("/api/albums", methods=["GET"])
def list_albums():
    try:
        sb = get_client()
        result = sb.table("albums").select("*").order("created_at", desc=True).execute()
        return jsonify(result.data or [])
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@albums_bp.route("/api/admin/albums", methods=["POST"])
@require_admin
def create_album():
    body = request.get_json() or {}
    name = body.get("name", "").strip()
    if not name:
        return jsonify({"error": "Album name is required"}), 400
    try:
        sb = get_admin_client()
        result = sb.table("albums").insert({
            "name":        name,
            "description": body.get("description", ""),
            "cover_url":   body.get("cover_url"),
        }).execute()
        return jsonify(result.data[0]), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@albums_bp.route("/api/admin/albums/<album_id>", methods=["DELETE"])
@require_admin
def delete_album(album_id):
    try:
        sb = get_admin_client()
        # Delete all photos first
        photos = sb.table("album_photos").select("cloudinary_id").eq("album_id", album_id).execute()
        for p in (photos.data or []):
            if p.get("cloudinary_id"):
                try:
                    from services.cloudinary_service import delete_media
                    delete_media(p["cloudinary_id"])
                except Exception:
                    pass
        sb.table("album_photos").delete().eq("album_id", album_id).execute()
        sb.table("albums").delete().eq("id", album_id).execute()
        return jsonify({"ok": True})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ─── Album Photos ─────────────────────────────────────────────────────────────

@albums_bp.route("/api/albums/<album_id>/photos", methods=["GET"])
def list_album_photos(album_id):
    try:
        sb = get_client()
        result = (
            sb.table("album_photos")
            .select("id,album_id,url,caption,sort_order,created_at")
            .eq("album_id", album_id)
            .order("sort_order")
            .execute()
        )
        return jsonify(result.data or [])
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@albums_bp.route("/api/admin/albums/<album_id>/photos", methods=["POST"])
@require_admin
def upload_album_photo(album_id):
    if "photo" not in request.files or not request.files["photo"].filename:
        return jsonify({"error": "No photo file provided"}), 400
    try:
        result = _upload_design_photo(request.files["photo"])
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        log.error(f"[Albums] Cloudinary upload error: {e}")
        return jsonify({"error": "Upload failed"}), 500

    caption    = request.form.get("caption", "")
    sort_order = int(request.form.get("sort_order", 0))

    try:
        sb = get_admin_client()
        row = sb.table("album_photos").insert({
            "album_id":      album_id,
            "url":           result["url"],
            "cloudinary_id": result["public_id"],
            "caption":       caption,
            "sort_order":    sort_order,
        }).execute()

        # Update album cover if it's the first photo
        album = sb.table("albums").select("cover_url").eq("id", album_id).execute()
        if album.data and not album.data[0].get("cover_url"):
            sb.table("albums").update({"cover_url": result["url"]}).eq("id", album_id).execute()

        return jsonify(row.data[0]), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@albums_bp.route("/api/admin/albums/<album_id>/photos/<photo_id>", methods=["DELETE"])
@require_admin
def delete_album_photo(album_id, photo_id):
    try:
        sb = get_admin_client()
        row = sb.table("album_photos").select("cloudinary_id").eq("id", photo_id).execute()
        if row.data and row.data[0].get("cloudinary_id"):
            try:
                from services.cloudinary_service import delete_media
                delete_media(row.data[0]["cloudinary_id"])
            except Exception:
                pass
        sb.table("album_photos").delete().eq("id", photo_id).execute()
        return jsonify({"ok": True})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
