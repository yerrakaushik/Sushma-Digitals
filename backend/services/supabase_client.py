"""
Supabase client singleton.
Initialized from environment variables — set SUPABASE_URL and SUPABASE_KEY in .env
"""
import os
from supabase import create_client, Client

_client: Client | None = None
_admin_client: Client | None = None


def get_client() -> Client:
    """Returns anonymous Supabase client (for reads)."""
    global _client
    if _client is None:
        url = os.environ.get("SUPABASE_URL")
        key = os.environ.get("SUPABASE_KEY")
        if not url or not key:
            raise RuntimeError("SUPABASE_URL and SUPABASE_KEY must be set in .env")
        _client = create_client(url, key)
    return _client


def get_admin_client() -> Client:
    """Returns service-role Supabase client (for uploads and admin writes)."""
    global _admin_client
    if _admin_client is None:
        url = os.environ.get("SUPABASE_URL")
        key = os.environ.get("SUPABASE_SERVICE_KEY")
        if not url or not key:
            raise RuntimeError("SUPABASE_URL and SUPABASE_SERVICE_KEY must be set in .env")
        _admin_client = create_client(url, key)
    return _admin_client
