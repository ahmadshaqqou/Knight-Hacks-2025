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

def main():
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

    try:
        service = build("calendar", "v3", credentials=creds)

        now = dt.datetime.now(tz=dt.timezone.utc).isoformat()

        events_result = (
            service.events()
                .list(
                    calendarId="primary",
                    timeMin=now,
                    maxResults=10,
                    singleEvents=True,
                    orderBy="startTime",
                )
                .execute()
        )
        events = events_result.get("items", [])

        if not events:
            print("No upcoming events found")
            return
        
        for event in events:
            start = event["start"].get("dateTime", event["start"].get("date"))
            print(start, event["summary"])
    
    except HttpError as error:
        print(f"An error occurred: {error}")

if __name__ == "__main__":
    main()