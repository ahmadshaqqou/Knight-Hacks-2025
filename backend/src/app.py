from flask import Flask, request, jsonify, session, redirect, url_for
from flask_cors import CORS
import os
import json
from datetime import datetime, timedelta
from dotenv import load_dotenv
from authentication.goauth import SCOPES
import os.path
from email_handler.email_client import email_client_runner
import tempfile
import werkzeug
from util.ocr import extract_text_from_pdf, extract_text_from_pdf_bytes

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow, Flow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

from util.db import *
# Load environment variables
load_dotenv()

# No security
os.environ['OAUTHLIB_RELAX_TOKEN_SCOPE'] = '1'
os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'

app = Flask(__name__)
app.secret_key = os.environ.get("SECRET_KEY") or os.urandom(24)
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
app.config['SESSION_COOKIE_SECURE'] = True
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(days=7)

# Enable CORS
CORS(app, supports_credentials=True, origins=["http://localhost:3000","http://localhost:5000","http://localhost:6767"], expose_headers=["Content-Type", "Authorization"])

# OAuth Configuration
CLIENT_SECRETS_FILE = os.environ.get("CLIENT_SECRETS_FILE") or "credentials.json"
FRONTEND_URL = os.environ.get("FRONTEND_URL") or "http://localhost:3000"

@app.route('/')
def index():
    return jsonify({"message": "Tender for Lawyers API"})

@app.route('/api/auth/login')
def login():
    # Create flow instance to manage the OAuth 2.0 Authorization Grant Flow
    flow = Flow.from_client_secrets_file(
        CLIENT_SECRETS_FILE,
        scopes=SCOPES,
        redirect_uri=url_for('authorize', _external=True)
    )
    
    # Generate URL for request to Google's OAuth 2.0 server
    authorization_url, state = flow.authorization_url(
        access_type='offline',
        include_granted_scopes='true',
        prompt='consent'
    )
    
    # Store the state in the session for later validation
    session['state'] = state
    
    # Redirect to Google's OAuth 2.0 server
    return redirect(authorization_url)

@app.route('/api/auth/authorize')
def authorize():
    # Verify state parameter
    state = session.get('state')
    if not state or state != request.args.get('state'):
        return jsonify({"error": "Invalid state parameter"}), 401
    
    # Create flow instance with the stored state
    flow = Flow.from_client_secrets_file(
        CLIENT_SECRETS_FILE,
        scopes=SCOPES,
        state=state,
        redirect_uri=url_for('authorize', _external=True)
    )
    
    # Use the authorization server's response to fetch the OAuth 2.0 tokens
    flow.fetch_token(authorization_response=request.url)
    
    # Store credentials in session
    credentials = flow.credentials
    session['credentials'] = {
        'token': credentials.token,
        'refresh_token': credentials.refresh_token,
        'token_uri': credentials.token_uri,
        'client_id': credentials.client_id,
        'client_secret': credentials.client_secret,
        'scopes': credentials.scopes,
        'id_token': credentials.id_token
    }
    
    # Get user info from ID token
    if credentials.id_token:
        id_info = id_token.verify_oauth2_token(
            credentials.id_token, 
            google_requests.Request()
        )
        session['user'] = {
            'id': id_info.get('sub'),
            'email': id_info.get('email'),
            'name': id_info.get('name'),
            'picture': id_info.get('picture')
        }

    session_user = session['user']
    lawyer = get_lawyer(session_user['email'])
    if lawyer is None:
        create_lawyer(session_user['email'], session_user['name'], session_user['picture'])

    # Redirect to frontend with token
    return redirect(f"{FRONTEND_URL}?token={credentials.token}")

@app.route('/api/auth/logout')
def logout():
    # Clear session
    session.clear()
    return jsonify({"message": "Logged out successfully"})

@app.route('/api/auth/user')
def get_user():
    # Check if user is in session
    session_user = session.get('user')
    if session_user:
        user = get_lawyer(session_user['email'])
        if user is None:
            return jsonify({"error": "User does not exist in the database"}), 401
        user['_id'] = str(user['_id'])
        for i in range(len(user['cases'])):
            user['cases'][i] = str(user['cases'][i])
        return jsonify(user)
    return jsonify({"error": "Not authenticated"}), 401

@app.route('/api/auth/credentials')
def get_credentials():
    credentials = session.get('credentials')
    if credentials:
        return credentials
    return None

@app.route('/api/email')
def get_emails():
    sender = 'mailer-daemon@googlemail.com'
    start_date = '12/5/2024'
    credentials = get_credentials()
    return jsonify(email_client_runner(credentials, sender, start_date))

@app.route('/api/auth/verify-token', methods=['POST'])
def verify_token():
    data = request.get_json()
    token = data.get('token')
    
    if not token:
        return jsonify({"valid": False, "error": "No token provided"}), 400
    
    try:
        # Get credentials from session
        credentials_data = session.get('credentials')
        if not credentials_data:
            return jsonify({"valid": False, "error": "No credentials in session"}), 401
        
        # Create credentials object
        credentials = Credentials(
            token=token,
            refresh_token=credentials_data.get('refresh_token'),
            token_uri=credentials_data.get('token_uri'),
            client_id=credentials_data.get('client_id'),
            client_secret=credentials_data.get('client_secret'),
            scopes=credentials_data.get('scopes')
        )
        
        # Verify token by making a simple API request
        service = build("oauth2", "v2", credentials=credentials)
        user_info = service.userinfo().get().execute()
        
        return jsonify({"valid": True, "user": user_info})
    
    except Exception as e:
        print(f"Token verification error: {str(e)}")
        return jsonify({"valid": False, "error": str(e)}), 401
    
@app.route('/api/cases')
def api_get_cases():
    session_user = session.get('user')
    if session_user is None:
        return jsonify({"error": "Not authenticated"}), 401
    user = get_lawyer(session_user['email'])
    if user is None:
        return jsonify({"error": "User does not exist in the database"}), 401
    cases = get_cases(user['_id'])
    return jsonify(cases)

@app.route('/api/cases', methods=['POST'])
def api_create_case():
    data = request.json
    if not data["case_name"] or not data["case_summary"] or not data["client_name"] or not data["client_email"]:
        return jsonify({"error": "Bad request JSON"}), 400
    session_user = session.get('user')
    if session_user is None:
        return jsonify({"error": "Not authenticated"}), 401
    user = get_lawyer(session_user['email'])
    if user is None:
        return jsonify({"error": "User does not exist in the database"}), 401
    create_case(user['_id'], data["case_name"], data["case_summary"], data["client_name"], data["client_email"])
    cases = get_cases(user['_id'])
    for case in cases:
        case['_id'] = str(case['_id'])
        case['user_id'] = str(case['user_id'])
    return jsonify(cases)


@app.route('/api/ocr/extract', methods=['POST'])
def extract_text_from_pdf_endpoint():
    """
    Extract text from a PDF file using OCR.
    
    Request:
        - multipart/form-data with 'file' field containing the PDF file
        
    Response:
        - JSON with 'text' field containing the extracted text
    """
    try:
        print("OCR extract endpoint called")
        
        # Check if the request has a file part
        if 'file' not in request.files:
            print("No file part in request")
            return jsonify({"error": "No file part"}), 400
        
        file = request.files['file']
        print(f"Received file: {file.filename}")
        
        # Check if the file is empty
        if file.filename == '':
            print("Empty filename")
            return jsonify({"error": "No file selected"}), 400
        
        # Check if the file is a PDF
        if not file.filename.lower().endswith('.pdf'):
            print(f"Not a PDF file: {file.filename}")
            return jsonify({"error": "File must be a PDF"}), 400
        
        # Create a temporary file with a proper name
        fd, temp_path = tempfile.mkstemp(suffix='.pdf')
        os.close(fd)
        file.save(temp_path)
        
        print(f"Saved file to temporary path: {temp_path}")
        
        # Extract text from the PDF
        text = extract_text_from_pdf(temp_path)
        
        # Clean up
        os.remove(temp_path)
        print(f"Removed temporary file: {temp_path}")
        
        print(f"Extracted text length: {len(text)}")
        
        return jsonify({
            "text": text,
            "filename": file.filename,
            "success": True
        })
    
    except Exception as e:
        error_message = f"Error extracting text from PDF: {str(e)}"
        print(error_message)
        return jsonify({
            "error": error_message,
            "success": False
        }), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=6767)