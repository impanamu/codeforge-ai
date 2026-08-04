import secrets
from urllib.parse import urlencode

import httpx
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.jwt import create_access_token
from app.core.security import hash_password
from app.dependencies.db import get_db
from app.models.user import User

router = APIRouter(prefix="/auth", tags=["OAuth"])


# ─── helpers ────────────────────────────────────────────────────────

def _get_or_create_user(db: Session, email: str, full_name: str) -> User:
    """Find an existing user by email or create a new OAuth user."""
    user = db.query(User).filter(User.email == email).first()
    if user:
        return user

    # Create a new user with a random (unusable) password so the NOT-NULL
    # constraint on password_hash is satisfied. OAuth users log in via token
    # only; they never use the password_hash field directly.
    new_user = User(
        email=email,
        full_name=full_name or email.split("@")[0],
        password_hash=hash_password(secrets.token_urlsafe(32)),
        is_active=True,
        is_superuser=False,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


def _make_frontend_redirect(token: str) -> RedirectResponse:
    """Redirect to the frontend with the JWT in the URL fragment."""
    url = f"{settings.FRONTEND_URL}/auth/callback#token={token}"
    return RedirectResponse(url=url, status_code=302)


# ─── Google ─────────────────────────────────────────────────────────

GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth"
GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token"
GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo"


@router.get("/google", summary="Redirect to Google OAuth consent page")
def google_login():
    if not settings.GOOGLE_CLIENT_ID:
        raise HTTPException(503, "Google OAuth is not configured on this server.")

    params = {
        "client_id": settings.GOOGLE_CLIENT_ID,
        "redirect_uri": settings.GOOGLE_REDIRECT_URI,
        "response_type": "code",
        "scope": "openid email profile",
        "access_type": "offline",
        "prompt": "select_account",
    }
    return RedirectResponse(url=f"{GOOGLE_AUTH_URL}?{urlencode(params)}", status_code=302)


@router.get("/google/callback", summary="Handle Google OAuth callback")
def google_callback(code: str = None, error: str = None, db: Session = Depends(get_db)):
    if error or not code:
        return RedirectResponse(
            url=f"{settings.FRONTEND_URL}/login?error=google_denied", status_code=302
        )

    # Exchange code for access token
    with httpx.Client() as client:
        token_resp = client.post(
            GOOGLE_TOKEN_URL,
            data={
                "client_id": settings.GOOGLE_CLIENT_ID,
                "client_secret": settings.GOOGLE_CLIENT_SECRET,
                "code": code,
                "grant_type": "authorization_code",
                "redirect_uri": settings.GOOGLE_REDIRECT_URI,
            },
        )
        if token_resp.status_code != 200:
            raise HTTPException(400, "Failed to exchange Google auth code.")
        access_token = token_resp.json().get("access_token")

        # Fetch user info
        info_resp = client.get(
            GOOGLE_USERINFO_URL,
            headers={"Authorization": f"Bearer {access_token}"},
        )
        if info_resp.status_code != 200:
            raise HTTPException(400, "Failed to fetch Google user info.")
        info = info_resp.json()

    email = info.get("email")
    if not email:
        raise HTTPException(400, "Google did not return an email address.")

    user = _get_or_create_user(db, email=email, full_name=info.get("name", ""))
    jwt = create_access_token(subject=user.email)
    return _make_frontend_redirect(jwt)


# ─── GitHub ─────────────────────────────────────────────────────────

GITHUB_AUTH_URL = "https://github.com/login/oauth/authorize"
GITHUB_TOKEN_URL = "https://github.com/login/oauth/access_token"
GITHUB_USER_URL = "https://api.github.com/user"
GITHUB_EMAILS_URL = "https://api.github.com/user/emails"


@router.get("/github", summary="Redirect to GitHub OAuth consent page")
def github_login():
    if not settings.GITHUB_CLIENT_ID:
        raise HTTPException(503, "GitHub OAuth is not configured on this server.")

    params = {
        "client_id": settings.GITHUB_CLIENT_ID,
        "redirect_uri": settings.GITHUB_REDIRECT_URI,
        "scope": "user:email read:user",
    }
    return RedirectResponse(url=f"{GITHUB_AUTH_URL}?{urlencode(params)}", status_code=302)


@router.get("/github/callback", summary="Handle GitHub OAuth callback")
def github_callback(code: str = None, error: str = None, db: Session = Depends(get_db)):
    if error or not code:
        return RedirectResponse(
            url=f"{settings.FRONTEND_URL}/login?error=github_denied", status_code=302
        )

    headers = {"Accept": "application/json"}

    with httpx.Client() as client:
        # Exchange code for access token
        token_resp = client.post(
            GITHUB_TOKEN_URL,
            data={
                "client_id": settings.GITHUB_CLIENT_ID,
                "client_secret": settings.GITHUB_CLIENT_SECRET,
                "code": code,
                "redirect_uri": settings.GITHUB_REDIRECT_URI,
            },
            headers=headers,
        )
        if token_resp.status_code != 200:
            raise HTTPException(400, "Failed to exchange GitHub auth code.")

        token_data = token_resp.json()
        access_token = token_data.get("access_token")
        if not access_token:
            raise HTTPException(400, f"GitHub token error: {token_data.get('error_description', 'unknown')}")

        auth_header = {"Authorization": f"Bearer {access_token}"}

        # Fetch user profile
        user_resp = client.get(GITHUB_USER_URL, headers={**headers, **auth_header})
        user_data = user_resp.json()

        # GitHub may not expose email publicly — fall back to the emails endpoint
        email = user_data.get("email")
        if not email:
            emails_resp = client.get(GITHUB_EMAILS_URL, headers={**headers, **auth_header})
            emails = emails_resp.json() if emails_resp.status_code == 200 else []
            primary = next(
                (e for e in emails if e.get("primary") and e.get("verified")), None
            )
            email = primary["email"] if primary else None

    if not email:
        raise HTTPException(400, "GitHub did not return a verified email address. Make sure your GitHub email is public or verified.")

    full_name = user_data.get("name") or user_data.get("login", "")
    user = _get_or_create_user(db, email=email, full_name=full_name)
    jwt = create_access_token(subject=user.email)
    return _make_frontend_redirect(jwt)
