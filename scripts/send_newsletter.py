#!/usr/bin/env python3
"""
VibeZodiac Daily Horoscope Newsletter
- Reads subscribers from Supabase newsletter_subscribers table
- Fetches today's horoscopes from Supabase daily_horoscopes table
- Sends via Zoho Mail SMTP (same pattern as outreach script)
- Logs all sends to newsletter_log.csv
- Skips already-sent emails for today on re-run
"""

import smtplib
import time
import csv
import os
import random
import json
import sys
import urllib.request
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime, date

# ─── CONFIGURATION ────────────────────────────────────────────
ZOHO_EMAIL    = os.environ.get('ZOHO_EMAIL', 'contact@vibezodiac.com')
ZOHO_PASSWORD = os.environ.get('ZOHO_PASSWORD', '')
SMTP_HOST     = "smtppro.zoho.com"
SMTP_PORT     = 465

SUPABASE_URL  = os.environ.get('SUPABASE_URL', 'https://ywovuuomfblorpdwbyks.supabase.co')
SUPABASE_KEY  = os.environ.get('SUPABASE_KEY', '')

LOG_FILE      = "newsletter_log.csv"
DELAY_MIN     = 3
DELAY_MAX     = 8
BATCH_SIZE    = 100
# ──────────────────────────────────────────────────────────────


from datetime import timezone, timedelta
EST = timezone(timedelta(hours=-5))
TODAY = datetime.now(EST).strftime('%Y-%m-%d')


ZODIAC_ORDER = [
    'Aries','Taurus','Gemini','Cancer','Leo','Virgo',
    'Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'
]

ZODIAC_SYMBOLS = {
    'Aries':'♈','Taurus':'♉','Gemini':'♊','Cancer':'♋',
    'Leo':'♌','Virgo':'♍','Libra':'♎','Scorpio':'♏',
    'Sagittarius':'♐','Capricorn':'♑','Aquarius':'♒','Pisces':'♓'
}


# ─── SUPABASE ─────────────────────────────────────────────────

def supabase_get(endpoint):
    url = f"{SUPABASE_URL}/rest/v1/{endpoint}"
    req = urllib.request.Request(url)
    req.add_header('apikey', SUPABASE_KEY)
    req.add_header('Authorization', f'Bearer {SUPABASE_KEY}')
    req.add_header('Content-Type', 'application/json')
    with urllib.request.urlopen(req) as res:
        return json.loads(res.read())


def fetch_horoscopes():
    endpoint = (
        f"daily_horoscopes?horoscope_date=eq.{TODAY}"
        f"&select=*,zodiac_signs(name,symbol,element)"
    )
    data = supabase_get(endpoint)
    return sorted(
        data,
        key=lambda h: ZODIAC_ORDER.index(h['zodiac_signs']['name'])
        if h['zodiac_signs']['name'] in ZODIAC_ORDER else 99
    )


def fetch_subscribers():
    endpoint = (
        "newsletter_subscribers"
        "?is_active=eq.true"
        "&select=email,unsubscribe_token"
        "&order=subscribed_at.asc"
    )
    return supabase_get(endpoint)


# ─── EMAIL ────────────────────────────────────────────────────

def get_email_subject():
    date_formatted = datetime.now().strftime('%A, %B %d, %Y')
    return f"Your Daily Horoscope - {date_formatted}"


def get_email_body(horoscopes, unsubscribe_token):
    date_formatted = datetime.now().strftime('%A, %B %d, %Y')

    zodiac_sections = ""
    for h in horoscopes:
        sign_name = h['zodiac_signs']['name']
        symbol = ZODIAC_SYMBOLS.get(sign_name, '')
        element = h['zodiac_signs'].get('element', '')

        zodiac_sections += f"""
        <div style="margin-bottom:28px;padding:20px 24px;background:#f9f8ff;
                    border-radius:12px;border-left:4px solid #6b5aed">
          <h3 style="margin:0 0 4px;color:#1a1035;font-size:18px;
                     font-family:Georgia,serif">
            {symbol} {sign_name}
            <span style="font-size:12px;color:#9ca3af;font-weight:normal;
                         margin-left:8px">{element} sign</span>
          </h3>
          <p style="color:#374151;line-height:1.75;margin:12px 0;font-size:15px">
            {h.get('todays_focus', '')}
          </p>
          <table style="width:100%;border-collapse:collapse;font-size:14px;
                        margin-top:12px">
            <tr style="border-bottom:1px solid #e9e7ff">
              <td style="padding:7px 8px 7px 0;color:#7c6bd6;width:80px;
                         white-space:nowrap">Love</td>
              <td style="padding:7px 0;color:#4b5563;line-height:1.6">
                {h.get('love_forecast', '')}</td>
            </tr>
            <tr style="border-bottom:1px solid #e9e7ff">
              <td style="padding:7px 8px 7px 0;color:#7c6bd6;
                         white-space:nowrap">Career</td>
              <td style="padding:7px 0;color:#4b5563;line-height:1.6">
                {h.get('career_forecast', '')}</td>
            </tr>
            <tr style="border-bottom:1px solid #e9e7ff">
              <td style="padding:7px 8px 7px 0;color:#7c6bd6;
                         white-space:nowrap">Finance</td>
              <td style="padding:7px 0;color:#4b5563;line-height:1.6">
                {h.get('finance_forecast', '')}</td>
            </tr>
            <tr>
              <td style="padding:7px 8px 7px 0;color:#7c6bd6;
                         white-space:nowrap">Health</td>
              <td style="padding:7px 0;color:#4b5563;line-height:1.6">
                {h.get('health_forecast', '')}</td>
            </tr>
          </table>
          <div style="margin-top:14px">
            <span style="background:#ede9fe;color:#5b21b6;padding:4px 12px;
                         border-radius:20px;font-size:12px;display:inline-block;
                         margin:2px">
              Lucky color: {h.get('lucky_color', '')}
            </span>
            <span style="background:#ede9fe;color:#5b21b6;padding:4px 12px;
                         border-radius:20px;font-size:12px;display:inline-block;
                         margin:2px">
              Lucky number: {h.get('lucky_number', '')}
            </span>
            <span style="background:#ede9fe;color:#5b21b6;padding:4px 12px;
                         border-radius:20px;font-size:12px;display:inline-block;
                         margin:2px">
              Lucky time: {h.get('lucky_time', '')}
            </span>
            <span style="background:#fef3c7;color:#92400e;padding:4px 12px;
                         border-radius:20px;font-size:12px;display:inline-block;
                         margin:2px">
              Rating: {h.get('overall_rating', '')}/5
            </span>
          </div>
        </div>"""

    unsubscribe_url = (
        f"https://vibezodiac.com/api/newsletter/unsubscribe"
        f"?token={unsubscribe_token}"
    )

    return f"""\
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
</head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:Georgia,serif">
  <div style="max-width:600px;margin:0 auto;padding:24px 16px">

    <a href="https://vibezodiac.com" target="_blank"
       style="display:block;text-decoration:none">
      <img src="https://vibezodiac.com/vibezodiac-wheel.png"
           alt="VibeZodiac"
           style="width:100%;max-height:120px;object-fit:cover;
                  border-radius:12px 12px 0 0;display:block"/>
      <div style="background:#6b5aed;text-align:center;
                  padding:14px 20px 18px">
        <div style="color:white;font-size:22px;font-family:Georgia,serif">
          VibeZodiac
        </div>
        <div style="color:rgba(255,255,255,0.75);font-size:12px;margin:4px 0 0">
          Daily Cosmic Guidance
        </div>
      </div>
    </a>

    <div style="background:#1a1035;text-align:center;padding:16px;
                margin-bottom:24px">
      <p style="color:#a78bfa;margin:0;font-size:18px">{date_formatted}</p>
      <p style="color:#6b7280;margin:6px 0 0;font-size:13px">
        Today's horoscopes for all 12 signs
      </p>
    </div>

    <div style="background:#ffffff;border-radius:16px;padding:28px 24px;
                box-shadow:0 2px 12px rgba(0,0,0,0.06)">
      <p style="color:#374151;font-size:15px;line-height:1.75;
                margin:0 0 24px;text-align:center">
        The cosmos has messages for you today. Find your sign below
        and embrace the energy the universe has in store.
      </p>

      {zodiac_sections}

      <div style="text-align:center;margin:32px 0 8px;padding:24px;
                  background:#f9f8ff;border-radius:12px">
        <p style="color:#374151;margin:0 0 16px;font-size:15px">
          Want your personalized Kundli or compatibility reading?
        </p>
        <a href="https://vibezodiac.com"
           style="background:#6B4EFF;color:#fff;padding:14px 32px;
                  border-radius:28px;text-decoration:none;
                  font-weight:bold;font-size:15px;display:inline-block">
          Visit VibeZodiac.com
        </a>
      </div>
    </div>

    <div style="text-align:center;margin-top:24px;padding:16px">
      <p style="color:#9ca3af;font-size:12px;margin:0">
        (c) 2026 VibeZodiac.com - For entertainment purposes only
      </p>
      <p style="margin:8px 0 0">
        <a href="{unsubscribe_url}"
           style="color:#9ca3af;font-size:12px;text-decoration:underline">
          Unsubscribe from daily horoscopes
        </a>
      </p>
    </div>
  </div>
</body>
</html>"""


# ─── LOGGING ──────────────────────────────────────────────────

def get_already_sent_today():
    sent = set()
    if not os.path.exists(LOG_FILE):
        return sent
    with open(LOG_FILE, 'r') as f:
        for i, row in enumerate(csv.reader(f)):
            if i == 0:
                continue
            if len(row) >= 3 and row[2] == 'sent' and row[0].startswith(TODAY):
                sent.add(row[1].strip().lower())
    return sent


def log_result(email, status, error=''):
    file_exists = os.path.exists(LOG_FILE)
    with open(LOG_FILE, 'a', newline='') as f:
        writer = csv.writer(f)
        if not file_exists:
            writer.writerow(['timestamp', 'email', 'status', 'error'])
        writer.writerow([
            datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            email, status, error
        ])


def print_summary():
    if not os.path.exists(LOG_FILE):
        return
    today_sent = today_failed = total_sent = 0
    with open(LOG_FILE, 'r') as f:
        for i, row in enumerate(csv.reader(f)):
            if i == 0:
                continue
            if len(row) >= 3:
                if row[2] == 'sent':
                    total_sent += 1
                    if row[0].startswith(TODAY):
                        today_sent += 1
                elif row[2] == 'failed' and row[0].startswith(TODAY):
                    today_failed += 1
    print(f"\n  Today     : {today_sent} sent, {today_failed} failed")
    print(f"  All time  : {total_sent} total sent")


# ─── MAIN SEND ────────────────────────────────────────────────

def send_newsletter(subscribers, horoscopes):
    already_sent = get_already_sent_today()
    to_send = [
        s for s in subscribers
        if s['email'].lower() not in already_sent
    ]

    if not to_send:
        print("  All subscribers already received today's newsletter.")
        print_summary()
        return

    total = min(len(to_send), BATCH_SIZE)
    avg_delay = (DELAY_MIN + DELAY_MAX) / 2
    est_minutes = round((total * avg_delay) / 60, 1)

    print(f"\n{'='*65}")
    print(f"  VibeZodiac Newsletter — {datetime.now().strftime('%Y-%m-%d %H:%M')}")
    print(f"  Date           : {TODAY}")
    print(f"  Horoscopes     : {len(horoscopes)} signs")
    print(f"  Subscribers    : {len(subscribers)} total")
    print(f"  Sending        : {total} this run")
    print(f"  Already sent   : {len(already_sent)} today")
    print(f"  Est. duration  : ~{est_minutes} minutes")
    print(f"{'='*65}\n")

    # Single persistent connection — same pattern as outreach script
    try:
        print("  Connecting to Zoho SMTP...")
        server = smtplib.SMTP_SSL(SMTP_HOST, SMTP_PORT)
        server.login(ZOHO_EMAIL, ZOHO_PASSWORD)
        print("  Connected!\n")
    except Exception as e:
        print(f"  SMTP connection failed: {e}")
        return

    sent_count = 0
    failed_count = 0

    print(f"  {'#':<5} {'STATUS':<8} {'EMAIL':<45} TIME")
    print(f"  {'-'*5} {'-'*8} {'-'*45} {'-'*8}")

    for i, sub in enumerate(to_send[:BATCH_SIZE]):
        email = sub['email']
        token = sub.get('unsubscribe_token', '')

        try:
            msg = MIMEMultipart('alternative')
            msg['From']     = f"VibeZodiac <{ZOHO_EMAIL}>"
            msg['To']       = email
            msg['Subject']  = get_email_subject()
            msg['Reply-To'] = ZOHO_EMAIL
            msg.attach(MIMEText(get_email_body(horoscopes, token), 'html'))

            server.sendmail(ZOHO_EMAIL, email, msg.as_string())
            sent_count += 1
            log_result(email, 'sent')
            now = datetime.now().strftime('%H:%M:%S')
            print(f"  {i+1:<5} OK      {email:<45} {now}")

        except Exception as e:
            failed_count += 1
            log_result(email, 'failed', str(e))
            now = datetime.now().strftime('%H:%M:%S')
            print(f"  {i+1:<5} FAIL    {email:<45} {now}  [{e}]")

        if i < total - 1:
            delay = random.randint(DELAY_MIN, DELAY_MAX)
            time.sleep(delay)

    try:
        server.quit()
    except:
        pass

    print(f"\n{'='*65}")
    print(f"  Sent this run  : {sent_count}")
    print(f"  Failed         : {failed_count}")
    print_summary()
    print(f"{'='*65}\n")


# ─── ENTRY POINT ──────────────────────────────────────────────

if __name__ == '__main__':
    print("\n  VibeZodiac Daily Newsletter Script")
    print(f"  Date: {TODAY}\n")

    auto_mode = '--auto' in sys.argv

    print("  Fetching today's horoscopes from Supabase...")
    try:
        horoscopes = fetch_horoscopes()
        print(f"  Found {len(horoscopes)} horoscopes for {TODAY}")
    except Exception as e:
        print(f"  ERROR fetching horoscopes: {e}")
        sys.exit(1)

    if not horoscopes:
        print(f"  No horoscopes found for {TODAY}.")
        sys.exit(1)

    print("\n  Fetching active subscribers from Supabase...")
    try:
        subscribers = fetch_subscribers()
        print(f"  Found {len(subscribers)} active subscribers")
    except Exception as e:
        print(f"  ERROR fetching subscribers: {e}")
        sys.exit(1)

    if not subscribers:
        print("  No active subscribers found.")
        sys.exit(0)

    print(f"\n  Ready to send to {len(subscribers)} subscribers")

    if not auto_mode:
        input("  Press ENTER to start, or Ctrl+C to cancel...\n")

    send_newsletter(subscribers, horoscopes)