# Tender for Lawyers - Backend

This is the backend for the Tender for Lawyers application. It provides API endpoints for authentication using Google OAuth and other functionality.

## Setup

### Prerequisites

- Python 3.8 or higher
- pip (Python package manager)
- A Google Cloud Platform account with OAuth 2.0 credentials

### Installation

1. Create a virtual environment:

```bash
python -m venv venv
```

2. Activate the virtual environment:

- On Windows:
```bash
venv\Scripts\activate
```

- On macOS/Linux:
```bash
source venv/bin/activate
```

3. Install dependencies:

```bash
pip install -r requirements.txt
```

4. Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

5. Edit the `.env` file and add your environment variables:

```
MONGO_CONNNECTION_STRING= "your_mongo_connection_string"
GEMINI_API_KEY= "your_gemini_api_key"
SECRET_KEY= "your_secret_key_for_flask_sessions"
CLIENT_SECRETS_FILE= "credentials.json"
FRONTEND_URL= "http://localhost:3000"
```

### Setting up Google OAuth

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to "APIs & Services" > "Credentials"
4. Click "Create Credentials" > "OAuth client ID"
5. Select "Web application" as the application type
6. Add "http://localhost:5000/api/auth/authorize" as an authorized redirect URI
7. Download the JSON file and save it as `credentials.json` in the backend directory

## Running the Backend

Start the Flask server:

```bash
cd src
python app.py
```

The server will be available at http://localhost:5000.

## API Endpoints

### Authentication

- `GET /api/auth/login`: Redirects to Google OAuth login
- `GET /api/auth/authorize`: OAuth callback endpoint
- `GET /api/auth/logout`: Logs out the current user
- `GET /api/auth/user`: Returns the current user's information
- `POST /api/auth/verify-token`: Verifies an OAuth token

## Integration with Frontend

The frontend communicates with the backend through API calls. The authentication flow works as follows:

1. User clicks "Sign in with Google" on the frontend
2. Frontend redirects to `/api/auth/login` endpoint
3. Backend redirects to Google OAuth consent screen
4. User approves the consent
5. Google redirects back to `/api/auth/authorize` endpoint
6. Backend processes the OAuth response and redirects back to the frontend with a token
7. Frontend stores the token and includes it in subsequent API requests

## Using the Existing Google OAuth Implementation

This implementation leverages the existing `goauth.py` file in the `authentication` directory, which already has the necessary imports and SCOPES defined:

```python
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from google.oauth2 import id_token
from google.auth.transport import requests
```

The OAuth implementation uses the same SCOPES that are defined in the existing `goauth.py` file:

```python
SCOPES = [
    "https://www.googleapis.com/auth/calendar",
    "openid",
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile"
]