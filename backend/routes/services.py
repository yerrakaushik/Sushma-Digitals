"""
Service Pricing routes
GET /api/services                              → public — all packages
PUT /api/admin/services/<service_id>/<pkg>    → admin — update a price
POST /api/admin/services/seed                 → admin — seed default prices
"""
from flask import Blueprint, jsonify, request
from services.supabase_client import get_client, get_admin_client
from middleware.auth import require_admin

services_bp = Blueprint("services", __name__)

# Default seed data — matches frontend Services.jsx
DEFAULT_PACKAGES = [
    # Wedding
    {"service_id": "wedding", "name": "Silver",   "price": "\u20b925,000", "note": "Ideal for intimate ceremonies",         "sort_order": 0},
    {"service_id": "wedding", "name": "Gold",     "price": "\u20b955,000", "note": "Full wedding day \u2014 most popular \u2605",    "sort_order": 1},
    {"service_id": "wedding", "name": "Platinum", "price": "\u20b995,000", "note": "Multi-day luxury coverage",            "sort_order": 2},
    # Pre-Wedding
    {"service_id": "prewedding", "name": "Essentials", "price": "\u20b915,000", "note": "Half-day single location",        "sort_order": 0},
    {"service_id": "prewedding", "name": "Signature",  "price": "\u20b928,000", "note": "Full day with multiple looks",    "sort_order": 1},
    {"service_id": "prewedding", "name": "Cinematic",  "price": "\u20b945,000", "note": "Travel + video included",        "sort_order": 2},
    # Birthday
    {"service_id": "birthday", "name": "Joy",         "price": "\u20b910,000", "note": "3-hour coverage",                  "sort_order": 0},
    {"service_id": "birthday", "name": "Celebration", "price": "\u20b918,000", "note": "6-hour full event",               "sort_order": 1},
    {"service_id": "birthday", "name": "Grand",       "price": "\u20b930,000", "note": "Photography + video reel",        "sort_order": 2},
    # Corporate
    {"service_id": "corporate", "name": "Half Day", "price": "\u20b912,000", "note": "Up to 4 hours",                     "sort_order": 0},
    {"service_id": "corporate", "name": "Full Day", "price": "\u20b922,000", "note": "Up to 8 hours",                     "sort_order": 1},
    {"service_id": "corporate", "name": "Premium",  "price": "\u20b940,000", "note": "Photography + video + drone",      "sort_order": 2},
    # Baby Shower
    {"service_id": "babyshower", "name": "Gentle",  "price": "\u20b99,000",  "note": "3-hour event coverage",             "sort_order": 0},
    {"service_id": "babyshower", "name": "Cherish", "price": "\u20b916,000", "note": "5-hour full event",                 "sort_order": 1},
    {"service_id": "babyshower", "name": "Treasure","price": "\u20b925,000", "note": "Photography + video highlight",    "sort_order": 2},
]


@services_bp.route("/api/services", methods=["GET"])
def get_services():
    """Returns all service packages grouped by service_id."""
    try:
        sb = get_client()
        result = sb.table("service_packages").select("*").order("service_id").order("sort_order").execute()
        # Group by service_id
        grouped: dict = {}
        for row in (result.data or []):
            sid = row["service_id"]
            grouped.setdefault(sid, []).append(row)
        return jsonify(grouped)
    except Exception as e:
        return jsonify({}), 200


@services_bp.route("/api/admin/services/<service_id>/<package_name>", methods=["PUT"])
@require_admin
def update_price_legacy(service_id, package_name):
    """Update price/note for a specific service + package combination (Legacy name-based)."""
    body = request.get_json() or {}
    allowed = ("price", "note")
    updates = {k: v for k, v in body.items() if k in allowed}
    if not updates:
        return jsonify({"error": "No valid fields to update"}), 400
    try:
        sb = get_admin_client()
        result = (
            sb.table("service_packages")
            .update(updates)
            .eq("service_id", service_id)
            .eq("name", package_name)
            .execute()
        )
        return jsonify(result.data[0] if result.data else {}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@services_bp.route("/api/admin/services/<int:pkg_id>", methods=["PUT"])
@require_admin
def update_service_by_id(pkg_id):
    """Modern ID-based update for service packages."""
    body = request.get_json() or {}
    allowed = ("name", "price", "note", "sort_order")
    updates = {k: v for k, v in body.items() if k in allowed}
    if not updates:
        return jsonify({"error": "No valid fields to update"}), 400
    try:
        sb = get_admin_client()
        result = sb.table("service_packages").update(updates).eq("id", pkg_id).execute()
        return jsonify(result.data[0] if result.data else {}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@services_bp.route("/api/admin/services", methods=["POST"])
@require_admin
def add_service_package():
    """Add a new service category or a new package to an existing category."""
    body = request.get_json() or {}
    required = ("service_id", "name", "price")
    if not all(k in body for k in required):
        return jsonify({"error": f"Missing required fields: {required}"}), 400
    
    try:
        sb = get_admin_client()
        # Check if we should insert multiple or single
        # For simplicity, we just insert one row
        row = {
            "service_id": body["service_id"],
            "name": body["name"],
            "price": body["price"],
            "note": body.get("note", ""),
            "sort_order": body.get("sort_order", 0)
        }
        result = sb.table("service_packages").insert(row).execute()
        return jsonify(result.data[0] if result.data else {}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@services_bp.route("/api/admin/services/<service_id>", methods=["DELETE"])
@require_admin
def delete_service(service_id):
    """Delete an entire service category or a specific package if name is provided in query."""
    package_name = request.args.get("package")
    try:
        sb = get_admin_client()
        query = sb.table("service_packages").delete().eq("service_id", service_id)
        if package_name:
            query = query.eq("name", package_name)
        
        result = query.execute()
        return jsonify({"ok": True, "deleted": len(result.data or [])}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@services_bp.route("/api/admin/services/seed", methods=["POST"])
@require_admin
def seed_services():
    """Seed the service_packages table with default prices. Safe to run multiple times (upsert)."""
    try:
        sb = get_admin_client()
        # Delete existing and re-insert
        sb.table("service_packages").delete().neq("service_id", "").execute()
        sb.table("service_packages").insert(DEFAULT_PACKAGES).execute()
        return jsonify({"ok": True, "seeded": len(DEFAULT_PACKAGES)}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
