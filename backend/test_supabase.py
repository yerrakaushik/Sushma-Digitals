import os
from supabase import create_client
from dotenv import load_dotenv

load_dotenv()

url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_KEY")

print(f"Connecting to {url}...")
try:
    sb = create_client(url, key)
    print("Client created.")
    res = sb.table("hero_settings").select("*").execute()
    print(f"Result: {res.data}")
except Exception as e:
    print(f"Error: {e}")
