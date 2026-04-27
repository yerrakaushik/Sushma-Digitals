
import os
from dotenv import load_dotenv
load_dotenv()

from services.supabase_client import get_client

try:
    sb = get_client()
    print("Testing hero_slideshow table...")
    result = sb.table("hero_slideshow").select("*").order("created_at").execute()
    print("Success! Data:", result.data)
except Exception as e:
    print("Caught Exception:", str(e))
