import uuid

from fastapi import Cookie, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security.auth import verify_session_token
from app.db.session import get_db
from app.models.repository import Repository
from app.models.user import User


async def get_current_user(
    session_token: str | None = Cookie(default=None, alias="session"),
    db: AsyncSession = Depends(get_db),
) -> User:
    """Extract and validate current user from session cookie."""
    if not session_token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")

    user_id = verify_session_token(session_token)
    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid session")

    result = await db.execute(select(User).where(User.id == uuid.UUID(user_id)))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")

    return user


async def get_repository(
    owner: str,
    name: str,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
) -> Repository:
    """Resolve owner/name to a Repository owned by the current user."""
    result = await db.execute(
        select(Repository).where(
            Repository.owner == owner,
            Repository.name == name,
            Repository.user_id == user.id,
        )
    )
    repo = result.scalar_one_or_none()
    if not repo:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Repository not found")
    return repo
