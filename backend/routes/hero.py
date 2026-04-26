"""
Hero routes
GET  /api/hero          → public — returns current hero video URL
POST /api/admin/hero    → admin — upload new video to Supabase Storage
"""
import os
import uuid
from flask import Blueprint, jsonify, request
from services.supabase_client import get_client, get_admin_client
from middleware.auth import require_admin

hero_bp = Blueprint("hero", __name__)

BUCKET = "hero-video"


@hero_bp.route("/api/hero", methods=["GET"])
def get_hero():
    """Returns the current hero video URL stored in hero_settings table."""
    try:
        sb = get_client()
        result = sb.table("hero_settings").select("video_url").eq("id", 1).single().execute()
        return jsonify({"video_url": result.data.get("video_url") if result.data else None})
    except Exception as e:
        return jsonify({"video_url": None, "error": str(e)}), 200


@hero_bp.route("/api/admin/hero", methods=["POST"])
@require_admin
def upload_hero_video():
    """
    Upload a new hero video.
    Expects multipart/form-data with file field 'video'.
    Uploads to Supabase Storage bucket 'hero-video', stores public URL in hero_settings.
    """
    if "video" not in request.files:
        return jsonify({"error": "No video file provided"}), 400

    file = request.files["video"]
    if file.filename == "":
        return jsonify({"error": "Empty filename"}), 400

    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in (".mp4", ".webm", ".mov"):
        return jsonify({"error": "Only .mp4, .webm, .mov are allowed"}), 400

    filename = f"hero-{uuid.uuid4()}{ext}"
    file_bytes = file.read()

    try:
        sb = get_admin_client()
        # Upload to Supabase Storage
        upload_response = sb.storage.from_(BUCKET).upload(
            path=filename,
            file=file_bytes,
            file_options={"content-type": file.content_type or "video/mp4"},
        )
        
        # Check if upload was successful (some versions return error in dict)
        if isinstance(upload_response, dict) and upload_response.get("error"):
            return jsonify({"error": f"Supabase Storage Error: {upload_response['error']}. Make sure the bucket '{BUCKET}' exists."}), 400

        # Get public URL
        public_url = sb.storage.from_(BUCKET).get_public_url(filename)

        # Upsert hero_settings row (always id=1)
        sb.table("hero_settings").upsert({"id": 1, "video_url": public_url}).execute()

        return jsonify({"video_url": public_url}), 200
    except Exception as e:
        error_msg = str(e)
        if "400" in error_msg or "bucket" in error_msg.lower():
            return jsonify({"error": f"Upload failed. Please ensure the storage bucket '{BUCKET}' is created in your Supabase dashboard and is set to PUBLIC."}), 400
        return jsonify({"error": f"Server Error: {error_msg}"}), 500


@hero_bp.route("/api/admin/hero", methods=["DELETE"])
@require_admin
def clear_hero_video():
    """Remove the hero video (fall back to slideshow)."""
    try:
        sb = get_admin_client()
        sb.table("hero_settings").upsert({"id": 1, "video_url": None}).execute()
        return jsonify({"ok": True}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
