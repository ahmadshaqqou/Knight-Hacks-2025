from flask import Flask, request, jsonify, session, redirect, url_for
from flask_cors import CORS
import os
import json
from datetime import datetime, timedelta
from dotenv import load_dotenv
from authentication.goauth import SCOPES
import os.path

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow, Flow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

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
    
    print(credentials)
    
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
    user = session.get('user')
    if user:
        return jsonify(user)
    return jsonify({"error": "Not authenticated"}), 401

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

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=6767)