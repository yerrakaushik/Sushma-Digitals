"""
Clients routes — manage client database for WhatsApp wish automation
GET    /api/admin/clients               → list all clients
POST   /api/admin/clients               → add a client
PUT    /api/admin/clients/<id>          → update a client
DELETE /api/admin/clients/<id>          → delete a client
POST   /api/admin/clients/<id>/media    → upload wish photo/video
POST   /api/admin/clients/test/<id>     → send a test wish immediately
"""
import os
import uuid
from flask import Blueprint, jsonify, request
from services.supabase_client import get_client, get_admin_client
from middleware.auth import require_admin

clients_bp = Blueprint("clients", __name__)

MEDIA_BUCKET  = "wish-media"
ALLOWED_TYPES = {
    "image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp",
    "video/mp4": ".mp4",  "video/webm": ".webm", "video/quicktime": ".mov",
}


@clients_bp.route("/api/admin/clients", methods=["GET"])
@require_admin
def get_clients():
    try:
        sb = get_client()
        result = sb.table("client_wishes").select("*").order("client_name").execute()
        return jsonify(result.data or [])
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@clients_bp.route("/api/admin/clients", methods=["POST"])
@require_admin
def add_client():
    body = request.get_json() or {}
    if not body.get("name") or not body.get("phone"):
        return jsonify({"error": "name and phone are required"}), 400
    try:
        sb = get_admin_client()
        result = sb.table("clients").insert({
            "name":          body["name"],
            "phone":         body["phone"],
            "birthday":      body.get("birthday") or None,
            "anniversary":   body.get("anniversary") or None,
            "event_date":    body.get("event_date") or None,
            "wish_media_url": body.get("wish_media_url"),
            "notes":         body.get("notes", ""),
        }).execute()
        return jsonify(result.data[0]), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@clients_bp.route("/api/admin/clients/<client_id>", methods=["PUT"])
@require_admin
def update_client(client_id):
    body = request.get_json() or {}
    allowed = ("name", "phone", "birthday", "anniversary", "event_date", "wish_media_url", "notes")
    updates = {}
    for k in allowed:
        if k in body:
            updates[k] = body[k] or None if k in ("birthday", "anniversary", "event_date") else body[k]
    try:
        sb = get_admin_client()
        result = sb.table("clients").update(updates).eq("id", client_id).execute()
        return jsonify(result.data[0] if result.data else {}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@clients_bp.route("/api/admin/clients/<client_id>", methods=["DELETE"])
@require_admin
def delete_client(client_id):
    try:
        sb = get_admin_client()
        sb.table("client_wishes").delete().eq("id", client_id).execute()
        return jsonify({"ok": True}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@clients_bp.route("/api/admin/clients/<client_id>/media", methods=["POST"])
@require_admin
def upload_wish_media(client_id):
    """
    Upload a photo or video to use as the wish attachment for this client.
    Stores the file in Supabase Storage bucket 'wish-media'.
    Updates the client's wish_media_url in the database.
    """
    if "media" not in request.files:
        return jsonify({"error": "No media file provided"}), 400

    file = request.files["media"]
    content_type = file.content_type or ""

    # Try to infer content type from extension if not set
    if content_type not in ALLOWED_TYPES:
        ext = os.path.splitext(file.filename)[1].lower()
        ext_to_mime = {v: k for k, v in ALLOWED_TYPES.items()}
        content_type = ext_to_mime.get(ext, "")

    if content_type not in ALLOWED_TYPES:
        return jsonify({"error": f"Unsupported file type. Allowed: jpg, png, webp, mp4, webm, mov"}), 400

    ext = ALLOWED_TYPES[content_type]
    filename = f"clients/{client_id}/{uuid.uuid4()}{ext}"
    file_bytes = file.read()

    try:
        sb = get_admin_client()

        # Ensure bucket exists
        try:
            sb.storage.create_bucket(MEDIA_BUCKET, options={"public": True})
        except Exception:
            pass  # Already exists

        sb.storage.from_(MEDIA_BUCKET).upload(
            path=filename,
            file=file_bytes,
            file_options={"content-type": content_type},
        )
        public_url = sb.storage.from_(MEDIA_BUCKET).get_public_url(filename)

        # Update the client record
        sb.table("clients").update({"wish_media_url": public_url}).eq("id", client_id).execute()

        return jsonify({"wish_media_url": public_url}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@clients_bp.route("/api/admin/clients/test/<client_id>", methods=["POST"])
@require_admin
def test_wish(client_id):
    """Send a test wish to a specific client right now."""
    from services.wishes import _send_whatsapp, _birthday_message, _anniversary_message
    try:
        sb = get_client()
        result = sb.table("clients").select("*").eq("id", client_id).single().execute()
        client = result.data
        if not client:
            return jsonify({"error": "Client not found"}), 404

        body = request.get_json() or {}
        wish_type = body.get("type", "birthday")
        message   = _birthday_message(client["name"]) if wish_type == "birthday" else _anniversary_message(client["name"])
        media_url = client.get("wish_media_url")

        ok = _send_whatsapp(client["phone"], message, media_url)
        return jsonify({
            "ok": ok,
            "message": "WhatsApp message sent!" if ok else "WhatsApp API not configured yet — add WHATSAPP_PHONE_NUMBER_ID and WHATSAPP_ACCESS_TOKEN to .env"
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
