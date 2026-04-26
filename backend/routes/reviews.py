import logging
from flask import Blueprint, jsonify, request
from services.supabase_client import get_client, get_admin_client

log = logging.getLogger(__name__)
reviews_bp = Blueprint("reviews", __name__)

@reviews_bp.route("/api/reviews", methods=["GET"])
def list_reviews():
    try:
        sb = get_client()
        result = sb.table("reviews").select("*").eq("approved", True).order("created_at", desc=True).execute()
        return jsonify(result.data or [])
    except Exception as e:
        log.error(f"[Reviews] Fetch error: {e}")
        return jsonify({"error": str(e)}), 500

@reviews_bp.route("/api/reviews", methods=["POST"])
def submit_review():
    body = request.get_json() or {}
    name   = body.get("name", "").strip()
    text   = body.get("text", "").strip()
    rating = body.get("rating")

    if not name or not text or not rating:
        return jsonify({"error": "Missing required fields"}), 400

    try:
        sb = get_client()
        # Auto-approve for now or keep it False for admin moderation?
        # Let's default to False so the user feels it's a real system.
        result = sb.table("reviews").insert({
            "name": name,
            "text": text,
            "rating": rating,
            "approved": True  # Setting to True for immediate results as requested
        }).execute()
        return jsonify(result.data[0]), 201
    except Exception as e:
        log.error(f"[Reviews] Submit error: {e}")
        return jsonify({"error": str(e)}), 500
