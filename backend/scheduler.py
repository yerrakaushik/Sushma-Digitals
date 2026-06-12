"""
APScheduler — Daily 9 AM IST job to check client_wishes and notify admin via CallMeBot.
"""
import logging
from datetime import date
from zoneinfo import ZoneInfo

from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger

log = logging.getLogger(__name__)
IST = ZoneInfo("Asia/Kolkata")


def check_and_notify():
    """
    Runs every day at 9:00 AM IST.
    Finds all client_wishes where today matches wish_date (month+day) and is_sent=false.
    Sends a CallMeBot notification to admin for each.
    Does NOT auto-mark as sent — admin does that after sending.
    """
    from services.supabase_client import get_admin_client
    from services.callmebot import send_whatsapp_notification

    today = date.today()
    month, day = today.month, today.day
    log.info(f"[Scheduler] Checking wishes for {today} (month={month}, day={day})")

    try:
        sb = get_admin_client()
        result = (
            sb.table("client_wishes")
            .select("*")
            .eq("is_sent", False)
            .execute()
        )
        all_wishes = result.data or []
    except Exception as e:
        log.error(f"[Scheduler] Failed to fetch wishes: {e}")
        return

    # Filter by month+day in Python (Supabase anon key may not support EXTRACT)
    todays_wishes = [
        w for w in all_wishes
        if w.get("wish_date") and _matches_today(w["wish_date"], month, day)
    ]

    log.info(f"[Scheduler] Found {len(todays_wishes)} wish(es) for today")

    for wish in todays_wishes:
        try:
            send_wish_via_whatsapp(wish)
        except Exception as e:
            log.error(f"[Scheduler] Error notifying for wish {wish.get('id')}: {e}")

def send_wish_via_whatsapp(wish):
    import requests
    import os
    try:
        response = requests.post(
            f"{os.getenv('WHATSAPP_SERVICE_URL', 'http://localhost:3001')}/send",
            json={
                "whatsapp_number": wish["whatsapp_number"],
                "wish_message": wish["wish_message"],
                "media_url": wish.get("media_url"),
                "media_type": wish.get("media_type"),
                "client_name": wish["client_name"]
            },
            headers={
                "x-api-key": os.getenv("WHATSAPP_SERVICE_SECRET", "sushma_digitals_secret_12345"),
                "Content-Type": "application/json"
            },
            timeout=30
        )
        if response.status_code == 200:
            # Mark wish as sent in Supabase
            from services.supabase_client import get_admin_client
            get_admin_client().table("client_wishes").update({"is_sent": True}).eq("id", wish["id"]).execute()
            log.info(f"Wish sent to {wish['client_name']}")
        else:
            log.error(f"Failed to send wish: {response.text}")
    except Exception as e:
        log.error(f"WhatsApp service error: {str(e)}")


def _matches_today(wish_date_str: str, month: int, day: int) -> bool:
    try:
        d = date.fromisoformat(str(wish_date_str))
        return d.month == month and d.day == day
    except Exception:
        return False


def start_scheduler():
    scheduler = BackgroundScheduler(timezone=IST)
    scheduler.add_job(
        check_and_notify,
        trigger=CronTrigger(hour=9, minute=0, timezone=IST),
        id="daily_wish_check",
        replace_existing=True,
    )
    scheduler.start()
    log.info("[Scheduler] Daily wish check scheduled at 9:00 AM IST")
    return scheduler
