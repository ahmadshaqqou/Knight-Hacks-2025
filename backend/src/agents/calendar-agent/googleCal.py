import sys
import datetime
import os.path
import re
from dateutil import parser as dateutil_parser
import dateparser
import pytz
from tzlocal import get_localzone
from typing import Optional, List, Dict 

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
import google.generativeai as genai
from google.generativeai import types

# sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# from authentication.goauth import main

MODEL = "gemini-2.0-flash-001" 
SCOPES = [
    "https://www.googleapis.com/auth/calendar",
    "openid",
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile"
]


import os.path
import datetime as dt

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from google.oauth2 import id_token
from google.auth.transport import requests

SCOPES = [
    "https://www.googleapis.com/auth/calendar",
    "openid",
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile"
]

def get_calendar_service():
    creds = None

    #stores user creds into token.json
    if os.path.exists("token.json"):
        creds = Credentials.from_authorized_user_file("token.json", SCOPES)

    #if user access is expired or DNE let them login
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file("credentials.json", SCOPES)

            creds = flow.run_local_server(
                port=8080,
                access_type="offline",
                prompt="consent"
            )

            if creds.id_token:
                id_info = id_token.verify_oauth2_token(creds.id_token, requests.Request())
                print("User email:", id_info.get("email"))
                print("Email verified:", id_info.get("email_verified"))        

                #saves the new creds into this file
        with open("token.json", "w") as token:
            token.write(creds.to_json())

    return build("calendar", "v3", credentials=creds)

def get_user_timezone() -> str:
    """
    The user's timezone: 
    """
    try:
        return str(get_localzone())
    
    except Exception as e:
        print(f"Warning: Could not detect local time zone ({str(e)})")
        return "USA"

def create_event(service, tz: str):

    timezone = pytz.timezone(tz)
    start_time = timezone.localize(dt.datetime(2025, 10, 26, 9, 0, 0))
    end_time = start_time + dt.timedelta(hours=1)
    event = {
        'summary': 'Team Meeting',
        'location': 'Cyberlab',
        'description': 'Discuss how cooked we are',
        'start': {
            'dateTime': start_time.isoformat(),
            'timeZone': tz,
        },
        'end': {
            'dateTime': end_time.isoformat(),
            'timeZone': tz,
        },
        'recurrence': ['RRULE:FREQ=DAILY;COUNT=1'],
        'attendees': [
            {'email': 'example1@gmail.com'},
            {'email': 'example2@gmail.com'},
        ],
        'reminders': {
            'useDefault': False,
            'overrides': [
                {'method': 'email', 'minutes': 24 * 60},
                {'method': 'popup', 'minutes': 10},
            ],
        },
    }

    event = service.events().insert(calendarId='primary', body=event).execute()
    print("Event response:", event)

if __name__ == "__main__":
    service = get_calendar_service()
    timezone = get_user_timezone()
    create_event(service, timezone)

