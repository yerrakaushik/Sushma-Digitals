"""
WhatsApp Automation — Birthday & Anniversary Wishes
====================================================
Uses Meta WhatsApp Business Cloud API (no Twilio needed).

Setup:
1. Go to developers.facebook.com → create an app → WhatsApp product
2. Add your father's WhatsApp Business number
3. Copy: Phone Number ID & Permanent Access Token
4. Add WHATSAPP_PHONE_NUMBER_ID and WHATSAPP_ACCESS_TOKEN to backend/.env

Scheduler runs daily at 9:00 AM IST.
"""
import os
import logging
from datetime import date
from zoneinfo import ZoneInfo

import requests
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger

from services.supabase_client import get_client

log = logging.getLogger(__name__)
IST = ZoneInfo("Asia/Kolkata")

WA_API_URL = "https://graph.facebook.com/v19.0/{phone_number_id}/messages"


# ─── WhatsApp Business API sender ────────────────────────────────────────────
def _send_whatsapp(to_number: str, message: str, media_url: str | None = None) -> bool:
    """
    Send a WhatsApp message via Meta Business Cloud API.
    - If media_url is an image → sends image + caption
    - If media_url is a video → sends video + caption
    - If no media_url       → sends plain text
    Returns True on success.
    """
    phone_number_id  = os.environ.get("WHATSAPP_PHONE_NUMBER_ID")
    access_token     = os.environ.get("WHATSAPP_ACCESS_TOKEN")

    if not phone_number_id or not access_token:
        log.warning("WhatsApp Business API credentials not configured — skipping send")
        return False

    # Normalise phone — must be full international format without '+'
    to = to_number.strip().lstrip("+")
    if not to.startswith("91"):
        to = "91" + to

    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type":  "application/json",
    }

    # Build payload based on whether we have media
    if media_url:
        ext = media_url.lower().split("?")[0].rsplit(".", 1)[-1]
        is_video = ext in ("mp4", "webm", "mov", "avi")
        media_type = "video" if is_video else "image"

        payload = {
            "messaging_product": "whatsapp",
            "to": to,
            "type": media_type,
            media_type: {
                "link": media_url,
                "caption": message,
            },
        }
    else:
        payload = {
            "messaging_product": "whatsapp",
            "to": to,
            "type": "text",
            "text": {"body": message, "preview_url": False},
        }

    url = WA_API_URL.format(phone_number_id=phone_number_id)
    resp = requests.post(url, json=payload, headers=headers, timeout=10)

    if resp.status_code == 200:
        log.info(f"WhatsApp sent to {to}")
        return True
    else:
        log.error(f"WhatsApp API error {resp.status_code}: {resp.text[:150]}")
        return False


# ─── Message builders ─────────────────────────────────────────────────────────
def _birthday_message(name: str) -> str:
    return (
        f"🎂 *Happy Birthday, {name}!* 🎉\n\n"
        "Wishing you a wonderful day filled with joy and beautiful moments!\n\n"
        "📸 *Sushma Digitals Studio* — We'd love to capture your celebrations.\n"
        "Reply to book a birthday shoot! 💫"
    )

def _anniversary_message(name: str) -> str:
    return (
        f"💍 *Happy Anniversary, {name}!* 🥂\n\n"
        "Congratulations on another beautiful year together!\n\n"
        "📸 *Sushma Digitals Studio* — Let us create timeless memories for you.\n"
        "Reply to book a special anniversary shoot! ✨"
    )


# ─── Daily job ────────────────────────────────────────────────────────────────
def send_daily_wishes():
    """Runs every morning — sends wishes to matching clients."""
    today = date.today()
    month, day = today.month, today.day
    log.info(f"[Wishes] Running for {today} (month={month}, day={day})")

    try:
        sb = get_client()
        result = sb.table("clients").select("*").execute()
        clients = result.data or []
    except Exception as e:
        log.error(f"[Wishes] Failed to fetch clients: {e}")
        return

    sent = 0
    for client in clients:
        phone = client.get("phone", "")
        name  = client.get("name", "Friend")
        if not phone:
            continue

        media_url = client.get("wish_media_url") or client.get("wish_image_url")

        # Birthday check
        bday = client.get("birthday")
        if bday:
            try:
                bday_date = date.fromisoformat(str(bday))
                if bday_date.month == month and bday_date.day == day:
                    if _send_whatsapp(phone, _birthday_message(name), media_url):
                        sent += 1
            except Exception as e:
                log.warning(f"[Wishes] Birthday error for {name}: {e}")

        # Anniversary check
        anniv = client.get("anniversary")
        if anniv:
            try:
                anniv_date = date.fromisoformat(str(anniv))
                if anniv_date.month == month and anniv_date.day == day:
                    if _send_whatsapp(phone, _anniversary_message(name), media_url):
                        sent += 1
            except Exception as e:
                log.warning(f"[Wishes] Anniversary error for {name}: {e}")

    log.info(f"[Wishes] Done. Sent {sent} message(s) today.")


# ─── Start scheduler ──────────────────────────────────────────────────────────
def start_scheduler():
    scheduler = BackgroundScheduler(timezone=IST)
    scheduler.add_job(
        send_daily_wishes,
        trigger=CronTrigger(hour=9, minute=0, timezone=IST),
        id="daily_wishes",
        replace_existing=True,
    )
    scheduler.start()
    log.info("[Scheduler] Daily wishes job scheduled at 9:00 AM IST")
    return scheduler
