"""
Run this script ONCE to create all database tables in Supabase.
Usage: python setup_db.py
"""
import os
import requests
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.environ["SUPABASE_URL"]
SERVICE_KEY  = os.environ["SUPABASE_SERVICE_KEY"]

HEADERS = {
    "apikey":        SERVICE_KEY,
    "Authorization": f"Bearer {SERVICE_KEY}",
    "Content-Type":  "application/json",
}

# Each statement is run separately so errors are easy to spot
STATEMENTS = [
    # hero_settings
    """CREATE TABLE IF NOT EXISTS hero_settings (
        id          INT PRIMARY KEY DEFAULT 1,
        video_url   TEXT,
        updated_at  TIMESTAMPTZ DEFAULT now()
    )""",
    "INSERT INTO hero_settings (id, video_url) VALUES (1, NULL) ON CONFLICT (id) DO NOTHING",

    # gallery_photos
    """CREATE TABLE IF NOT EXISTS gallery_photos (
        id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        url         TEXT NOT NULL,
        alt         TEXT,
        category    TEXT DEFAULT 'Wedding',
        sort_order  INT DEFAULT 0,
        created_at  TIMESTAMPTZ DEFAULT now()
    )""",

    # youtube_videos
    """CREATE TABLE IF NOT EXISTS youtube_videos (
        id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        youtube_id  TEXT NOT NULL,
        title       TEXT,
        description TEXT,
        tag         TEXT DEFAULT 'Wedding Film',
        sort_order  INT DEFAULT 0,
        created_at  TIMESTAMPTZ DEFAULT now()
    )""",

    # service_packages
    """CREATE TABLE IF NOT EXISTS service_packages (
        id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        service_id  TEXT NOT NULL,
        name        TEXT NOT NULL,
        price       TEXT NOT NULL,
        note        TEXT,
        sort_order  INT DEFAULT 0
    )""",

    # RLS
    "ALTER TABLE hero_settings    ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE gallery_photos   ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE youtube_videos   ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE service_packages ENABLE ROW LEVEL SECURITY",

    # Public read policies
    'CREATE POLICY IF NOT EXISTS "Public read hero"     ON hero_settings    FOR SELECT USING (true)',
    'CREATE POLICY IF NOT EXISTS "Public read gallery"  ON gallery_photos   FOR SELECT USING (true)',
    'CREATE POLICY IF NOT EXISTS "Public read videos"   ON youtube_videos   FOR SELECT USING (true)',
    'CREATE POLICY IF NOT EXISTS "Public read services" ON service_packages FOR SELECT USING (true)',
]


def run_sql(statement: str) -> bool:
    """Execute a single SQL statement via Supabase RPC."""
    resp = requests.post(
        f"{SUPABASE_URL}/rest/v1/rpc/exec_sql",
        headers=HEADERS,
        json={"sql": statement},
    )
    if resp.status_code in (200, 204):
        print(f"  ✅ OK")
        return True
    else:
        # Try alternate endpoint style
        print(f"  ⚠️  RPC not available: {resp.status_code} — {resp.text[:80]}")
        return False


if __name__ == "__main__":
    print(f"\nConnecting to: {SUPABASE_URL}\n")

    # Try using supabase-py directly with raw execute
    try:
        from supabase import create_client
        sb = create_client(SUPABASE_URL, SERVICE_KEY)
        print("Supabase client connected ✅\n")

        for i, stmt in enumerate(STATEMENTS, 1):
            short = stmt.strip()[:60].replace('\n', ' ')
            print(f"[{i}/{len(STATEMENTS)}] {short}...")
            try:
                # Use postgrest execute for DDL via the postgres connection
                result = sb.rpc("query", {"sql": stmt}).execute()
                print("  ✅ OK")
            except Exception as e:
                err = str(e)
                if "already exists" in err or "already been" in err:
                    print(f"  ⏭️  Already exists (OK)")
                elif "undefined" in err or "does not exist" in err.lower() and "rpc" in err.lower():
                    print(f"  ℹ️  RPC not set up — use Supabase dashboard SQL editor instead")
                    print(f"     Error: {err[:100]}")
                else:
                    print(f"  ❌ Error: {err[:100]}")

    except Exception as e:
        print(f"Connection failed: {e}")
        raise

    print("\n✅ Done! Check your Supabase dashboard → Table Editor to verify tables were created.")
    print("\nNext step: Run the Flask server and POST /api/admin/services/seed to populate pricing.\n")
