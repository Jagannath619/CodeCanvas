from urllib.parse import urlencode

import httpx
from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import RedirectResponse
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.core.security.auth import create_session_token
from app.core.security.encryption import encrypt_token
from app.db.session import get_db
from app.models.user import User
from app.schemas.auth import UserResponse
from app.api.deps import get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.get("/github")
async def github_login():
    """Initiate GitHub OAuth flow."""
    params = {
        "client_id": settings.github_client_id,
        "redirect_uri": settings.github_redirect_uri,
        "scope": "repo read:org read:user",
    }
    return RedirectResponse(f"https://github.com/login/oauth/authorize?{urlencode(params)}")


@router.get("/github/callback")
async def github_callback(code: str, db: AsyncSession = Depends(get_db)):
    """Handle GitHub OAuth callback."""
    # Exchange code for access token
    async with httpx.AsyncClient() as client:
        token_response = await client.post(
            "https://github.com/login/oauth/access_token",
            json={
                "client_id": settings.github_client_id,
                "client_secret": settings.github_client_secret,
                "code": code,
            },
            headers={"Accept": "application/json"},
        )
        token_data = token_response.json()

    access_token = token_data.get("access_token")
    if not access_token:
        raise HTTPException(status_code=400, detail="Failed to get access token from GitHub")

    # Fetch user info
    async with httpx.AsyncClient() as client:
        user_response = await client.get(
            "https://api.github.com/user",
            headers={"Authorization": f"Bearer {access_token}"},
        )
        user_info = user_response.json()

    github_id = user_info["id"]
    github_login = user_info["login"]

    # Upsert user
    result = await db.execute(select(User).where(User.github_id == github_id))
    user = result.scalar_one_or_none()

    encrypted_token = encrypt_token(access_token)

    if user:
        user.access_token = encrypted_token
        user.display_name = user_info.get("name")
        user.avatar_url = user_info.get("avatar_url")
    else:
        user = User(
            github_id=github_id,
            github_login=github_login,
            display_name=user_info.get("name"),
            avatar_url=user_info.get("avatar_url"),
            access_token=encrypted_token,
        )
        db.add(user)

    await db.flush()

    # Create session
    session_token = create_session_token(str(user.id))
    response = RedirectResponse(settings.frontend_url + "/dashboard")
    response.set_cookie(
        "session",
        session_token,
        httponly=True,
        secure=not settings.debug,
        samesite="lax",
        max_age=60 * 60 * 24 * 7,  # 1 week
    )
    return response


@router.post("/logout")
async def logout():
    """Clear session cookie."""
    response = RedirectResponse(settings.frontend_url)
    response.delete_cookie("session")
    return response


@router.get("/me", response_model=UserResponse)
async def get_me(user: User = Depends(get_current_user)):
    """Get current authenticated user."""
    return UserResponse(
        id=str(user.id),
        github_login=user.github_login,
        display_name=user.display_name,
        avatar_url=user.avatar_url,
    )
