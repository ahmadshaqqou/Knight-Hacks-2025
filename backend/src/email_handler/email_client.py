import os
import base64
import json
import re
import time
from typing import List, Optional, Tuple

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from html import unescape

# If modifying SCOPES, delete token.json to reauthorize.
SCOPES = ['https://www.googleapis.com/auth/gmail.readonly']

def build_gmail_service(creds) -> 'googleapiclient.discovery.Resource':
    return build('gmail', 'v1', credentials=creds)


def get_messages(service, sender, start_date, max_results=5) -> Optional[str]:
    """Return the message ID of the most recent message in the user's INBOX (or None)."""
    results = service.users().messages().list(userId='me', q=f'from:{sender} after:{start_date}', labelIds=['INBOX'], maxResults=max_results).execute()
    messages = results.get('messages', [])
    if not messages:
        return None
    
    return messages


def get_message(service, msg_id: str) -> dict:
    """Fetch the message resource with format='full'."""
    return service.users().messages().get(userId='me', id=msg_id, format='full').execute()


def _b64_urlsafe_decode(data: str) -> bytes:
    """Decode Gmail's base64url string (handles missing padding)."""
    if not data:
        return b''
    data = data.replace('-', '+').replace('_', '/')
    # Add padding if necessary
    padding = len(data) % 4
    if padding:
        data += '=' * (4 - padding)
    return base64.b64decode(data)


def extract_headers(headers: List[dict]) -> dict:
    out = {}
    for h in headers:
        name = h.get('name', '').lower()
        out[name] = h.get('value', '')
    return out


def walk_parts_and_collect_text(parts: List[dict]) -> Tuple[str, str]:
    """
    Walk message parts recursively to collect text/plain and text/html contents.
    Returns (plain_text, html_text) where each is the concatenation of found parts.
    """
    plain_chunks = []
    html_chunks = []

    def walk(p):
        mime = p.get('mimeType', '')
        body = p.get('body', {})
        data = body.get('data')
        if data:
            try:
                raw_bytes = _b64_urlsafe_decode(data)
                try:
                    text = raw_bytes.decode('utf-8')
                except UnicodeDecodeError:
                    # fallback to latin-1 if weird encoding
                    text = raw_bytes.decode('latin-1', errors='replace')
            except Exception:
                text = ''
            if mime == 'text/plain':
                plain_chunks.append(text)
            elif mime == 'text/html':
                html_chunks.append(text)
            else:
                # some multipart types may contain nested parts; ignore binary attachments
                pass
        # Recurse into nested parts
        for child in p.get('parts', []) or []:
            walk(child)

    for part in parts or []:
        walk(part)

    return ('\n'.join(plain_chunks).strip(), '\n'.join(html_chunks).strip())


def get_message_body(message: dict) -> str:
    """Return message body as plain text if possible, or HTML if only HTML available, or the snippet."""
    payload = message.get('payload', {})
    mime_type = payload.get('mimeType', '')
    # If top-level body has data (rare for simple messages)
    top_body_data = payload.get('body', {}).get('data')
    if top_body_data:
        decoded = _b64_urlsafe_decode(top_body_data)
        try:
            return decoded.decode('utf-8', errors='replace')
        except Exception:
            return decoded.decode('latin-1', errors='replace')

    # Otherwise check parts recursively
    plain, html = walk_parts_and_collect_text(payload.get('parts', []))
    if plain:
        return plain
    if html:
        # Optionally strip HTML tags to make it more readable. Here we do a crude strip.
        text = _strip_html_tags(html)
        return text
    # As a final fallback, return the snippet
    return message.get('snippet', '')


def _strip_html_tags(html: str) -> str:
    """Basic HTML -> text. Not perfect, but good enough for terminal display."""
    # Unescape HTML entities first
    text = unescape(html)
    # Remove script/style blocks
    text = re.sub(r'(?is)<(script|style).*?>.*?</\1>', '', text)
    # Replace <br> and <p> with newlines
    text = re.sub(r'(?i)<\s*(br|br/|br\s*/)\s*>', '\n', text)
    text = re.sub(r'(?i)</p\s*>', '\n', text)
    # Remove remaining tags
    text = re.sub(r'<[^>]+>', '', text)
    # Collapse multiple newlines/spaces
    text = re.sub(r'\n\s*\n+', '\n\n', text)
    text = re.sub(r'[ \t]+', ' ', text)
    return text.strip()


def get_metadata(message: dict):
    headers_list = message.get('payload', {}).get('headers', [])
    return extract_headers(headers_list)
    
    


def email_client_runner(oauth, sender, start_date):
    try:
        creds = Credentials(**oauth)
    except Exception as e:
        print("Authentication failed:", str(e))
        return

    service = build_gmail_service(creds)
    message_list = get_messages(service, sender, start_date, max_results = 5)
    if message_list != None:
        if len(message_list) == 0:
            print("No messages found in INBOX.")
            return
    else:
        print("No messages found in Inbox")
        return

    i = 0
    response_dict = {"emails": []}
    try:
        for message in message_list:
            message_data = get_message(service, message['id'])
            print(f"MESSAGE {i}:\n{message}")
            headers = get_metadata(message_data)
            response_dict["emails"].append({
                "gmail_id" : message['id'],
                "subject" : headers.get('subject', '(no subject)'),
                "sender" : headers.get('from', '(unknown sender)'),
                "to": headers.get('to', '(unknown recipient)'),
                "date": headers.get('date', '(no date)'),
                "body_text" : get_message_body(message_data).strip()
            })
            i += 1
    except Exception as e:
        print("Failed to fetch the message:", str(e))
        return
    print(response_dict["emails"])
    print(f"SZ EMAIL: {len(message_list)}")
    return response_dict

