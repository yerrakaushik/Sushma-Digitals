"""
CallMeBot WhatsApp Notification Service
Sends a notification to the ADMIN's WhatsApp with a wa.me click-to-chat link.
Admin taps the link → WhatsApp opens with pre-typed message → hits Send.
100% free, no WhatsApp API needed.
"""
import os
import logging
import urllib.parse
import requests

log = logging.getLogger(__name__)


def _build_wame_link(whatsapp_number: str, message: str) -> str:
    """Build a wa.me click-to-chat URL with URL-encoded message."""
    number = whatsapp_number.strip().lstrip("+")
    if not number.startswith("91"):
        number = "91" + number
    encoded = urllib.parse.quote(message)
    return f"https://wa.me/{number}?text={encoded}"


def send_whatsapp_notification(wish: dict) -> bool:
    """
    Send a WhatsApp notification to the admin via CallMeBot.
    The notification contains a wa.me link so admin can tap and send the wish.
    """
    phone   = os.environ.get("CALLMEBOT_PHONE", "")
    apikey  = os.environ.get("CALLMEBOT_APIKEY", "")
    admin_wa = os.environ.get("ADMIN_WHATSAPP", "")

    if not phone or not apikey:
        log.warning("[CallMeBot] CALLMEBOT_PHONE or CALLMEBOT_APIKEY not set — skipping")
        return False

    client_name  = wish.get("client_name", "Client")
    spouse_name  = wish.get("spouse_name", "")
    wish_type    = wish.get("wish_type", "")
    wish_message = wish.get("wish_message", "")
    client_wa    = wish.get("whatsapp_number", "")

    # Build the wa.me link for the client
    wame_link = _build_wame_link(client_wa, wish_message) if client_wa else ""

    # Build the admin notification text
    lines = [
        "📸 *Sushma Digitals Reminder*",
        f"Today is *{client_name}*'s *{wish_type}*!",
    ]
    if spouse_name and wish_type == "Wedding Anniversary":
        lines[1] = f"Today is *{client_name}* & *{spouse_name}*'s *{wish_type}*!"

    if wame_link:
        lines.append(f"Tap to send wish:\n{wame_link}")

    notification_text = "\n".join(lines)

    # Call CallMeBot API
    url = "https://api.callmebot.com/whatsapp.php"
    params = {
        "phone":  phone,
        "text":   notification_text,
        "apikey": apikey,
    }

    try:
        resp = requests.get(url, params=params, timeout=15)
        if resp.status_code == 200 and "Message queued" in resp.text:
            log.info(f"[CallMeBot] Notification sent for {client_name} ({wish_type})")
            return True
        else:
            log.error(f"[CallMeBot] Failed ({resp.status_code}): {resp.text[:200]}")
            return False
    except Exception as e:
        log.error(f"[CallMeBot] Exception: {e}")
        return False
