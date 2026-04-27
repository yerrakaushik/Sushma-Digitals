"""
Sushma Digitals — Flask Backend
"""
import os
import logging
from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()
logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")

app = Flask(__name__)

CORS(app, resources={r"/api/*": {"origins": [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://localhost:3001",
    "https://sushmadigitals.vercel.app",
    os.environ.get("FRONTEND_URL", "*") # Allow environment-defined URL or fallback to all in prod
]}})

# ─── Blueprints ───────────────────────────────────────────────────────────────
from routes.hero     import hero_bp
from routes.gallery  import gallery_bp
from routes.videos   import videos_bp
from routes.services import services_bp
from routes.clients  import clients_bp
from routes.wishes   import wishes_bp
from routes.albums   import albums_bp
from routes.reviews  import reviews_bp

app.register_blueprint(hero_bp)
app.register_blueprint(gallery_bp)
app.register_blueprint(videos_bp)
app.register_blueprint(services_bp)
app.register_blueprint(clients_bp)
app.register_blueprint(wishes_bp)
app.register_blueprint(albums_bp)
app.register_blueprint(reviews_bp)

# ─── Global Error Handler for debugging ───
@app.errorhandler(Exception)
def handle_exception(e):
    print(f"!!! GLOBAL ERROR: {str(e)}", flush=True)
    import traceback
    traceback.print_exc()
    return jsonify({"error": "Internal Server Error", "details": str(e)}), 500

# ─── Health check ─────────────────────────────────────────────────────────────
@app.route("/health", methods=["GET"])
def health_check():
    try:
        from services.supabase_client import get_client
        get_client().table("gallery_photos").select("count", count="exact").limit(1).execute()
        return jsonify({"status": "healthy", "service": "Sushma Digitals Backend", "database": "connected"}), 200
    except Exception as e:
        return jsonify({"status": "error", "service": "Sushma Digitals Backend", "database": str(e)}), 500

# ─── Start scheduler ─────────────────────────────────────────────────────────
# ─── Start scheduler (Production Ready) ──────────────────────────────────────
from scheduler import start_scheduler
scheduler = start_scheduler()

if __name__ == "__main__":

    port = int(os.environ.get("PORT", 5000))
    try:
        app.run(host='0.0.0.0', port=port, debug=True, use_reloader=False)
    finally:
        scheduler.shutdown()
