"""
Gallery routes
GET    /api/gallery               → public — list all photos (optional ?category=Wedding)
POST   /api/admin/gallery         → admin — upload photo to Supabase Storage
PUT    /api/admin/gallery/<id>    → admin — update alt/category
DELETE /api/admin/gallery/<id>    → admin — delete photo
"""
import os
import uuid
from flask import Blueprint, jsonify, request
from services.supabase_client import get_client, get_admin_client
from middleware.auth import require_admin

gallery_bp = Blueprint("gallery", __name__)

BUCKET = "gallery"
ALLOWED_EXTS = (".jpg", ".jpeg", ".png", ".webp", ".avif")


@gallery_bp.route("/api/gallery", methods=["GET"])
def get_gallery():
    """Returns gallery photos, optionally filtered by category."""
    try:
        sb = get_client()
        q = sb.table("gallery_photos").select("*").order("sort_order").order("created_at")
        category = request.args.get("category")
        if category and category != "All":
            q = q.eq("category", category)
        result = q.execute()
        return jsonify(result.data or [])
    except Exception as e:
        return jsonify([]), 200


@gallery_bp.route("/api/admin/gallery", methods=["POST"])
@require_admin
def upload_gallery_photo():
    """
    Upload a gallery photo.
    Form fields: file='photo', alt (str), category (str), sort_order (int)
    """
    if "photo" not in request.files:
        return jsonify({"error": "No photo file provided"}), 400

    file = request.files["photo"]
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in ALLOWED_EXTS:
        return jsonify({"error": f"Allowed formats: {', '.join(ALLOWED_EXTS)}"}), 400

    alt      = request.form.get("alt", "Gallery Photo")
    category = request.form.get("category", "Wedding")
    sort_ord = int(request.form.get("sort_order", 0))

    filename  = f"gallery/{uuid.uuid4()}{ext}"
    file_bytes = file.read()

    try:
        sb = get_admin_client()
        sb.storage.from_(BUCKET).upload(
            path=filename,
            file=file_bytes,
            file_options={"content-type": file.content_type or "image/jpeg"},
        )
        public_url = sb.storage.from_(BUCKET).get_public_url(filename)
        row = sb.table("gallery_photos").insert({
            "url": public_url,
            "alt": alt,
            "category": category,
            "sort_order": sort_ord,
        }).execute()
        return jsonify(row.data[0]), 201
    except Exception as e:
        print(f"!!! GALLERY UPLOAD ERROR: {str(e)}", flush=True)
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


@gallery_bp.route("/api/admin/gallery/<photo_id>", methods=["PUT"])
@require_admin
def update_gallery_photo(photo_id):
    """Update alt text or category of a photo."""
    body = request.get_json() or {}
    try:
        sb = get_admin_client()
        result = sb.table("gallery_photos").update({
            k: v for k, v in body.items() if k in ("alt", "category", "sort_order")
        }).eq("id", photo_id).execute()
        return jsonify(result.data[0] if result.data else {}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@gallery_bp.route("/api/admin/gallery/<photo_id>", methods=["DELETE"])
@require_admin
def delete_gallery_photo(photo_id):
    """Delete a gallery photo from DB (Storage file is left; clean up separately if needed)."""
    try:
        sb = get_admin_client()
        sb.table("gallery_photos").delete().eq("id", photo_id).execute()
        return jsonify({"ok": True}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
