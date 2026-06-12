"""
Admin auth middleware.
Protects admin routes by checking Authorization: Bearer <ADMIN_SECRET>
"""
import os
from functools import wraps
from flask import request, jsonify


def require_admin(f):
    """Decorator that blocks requests without a valid admin token."""
    @wraps(f)
    def decorated(*args, **kwargs):
        if request.method == "OPTIONS":
            return f(*args, **kwargs)
            
        auth_header = request.headers.get("Authorization", "")
        expected = f"Bearer {os.environ.get('ADMIN_SECRET', '')}"
        if not auth_header or auth_header != expected:
            return jsonify({"error": "Unauthorized"}), 401
        return f(*args, **kwargs)
    return decorated
