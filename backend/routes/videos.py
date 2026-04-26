"""
YouTube Videos routes
GET    /api/videos              → public — list all videos
POST   /api/admin/videos        → admin — add a video
PUT    /api/admin/videos/<id>   → admin — update a video
DELETE /api/admin/videos/<id>   → admin — remove a video
"""
from flask import Blueprint, jsonify, request
from services.supabase_client import get_client, get_admin_client
from middleware.auth import require_admin

videos_bp = Blueprint("videos", __name__)


@videos_bp.route("/api/videos", methods=["GET"])
def get_videos():
    """Returns all YouTube videos ordered by sort_order."""
    try:
        sb = get_client()
        result = sb.table("youtube_videos").select("*").order("sort_order").order("created_at").execute()
        return jsonify(result.data or [])
    except Exception as e:
        return jsonify([]), 200


@videos_bp.route("/api/admin/videos", methods=["POST"])
@require_admin
def add_video():
    """
    Add a new YouTube video.
    Body: { youtube_id, title, description, tag, sort_order }
    """
    body = request.get_json() or {}
    if not body.get("youtube_id"):
        return jsonify({"error": "youtube_id is required"}), 400
    try:
        sb = get_admin_client()
        result = sb.table("youtube_videos").insert({
            "youtube_id":  body["youtube_id"],
            "title":       body.get("title", ""),
            "description": body.get("description", ""),
            "tag":         body.get("tag", "Wedding Film"),
            "sort_order":  int(body.get("sort_order", 0)),
        }).execute()
        return jsonify(result.data[0]), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@videos_bp.route("/api/admin/videos/<video_id>", methods=["PUT"])
@require_admin
def update_video(video_id):
    """Update a YouTube video entry."""
    body = request.get_json() or {}
    allowed = ("youtube_id", "title", "description", "tag", "sort_order")
    try:
        sb = get_admin_client()
        result = sb.table("youtube_videos").update({
            k: v for k, v in body.items() if k in allowed
        }).eq("id", video_id).execute()
        return jsonify(result.data[0] if result.data else {}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@videos_bp.route("/api/admin/videos/<video_id>", methods=["DELETE"])
@require_admin
def delete_video(video_id):
    """Delete a YouTube video entry."""
    try:
        sb = get_admin_client()
        sb.table("youtube_videos").delete().eq("id", video_id).execute()
        return jsonify({"ok": True}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
