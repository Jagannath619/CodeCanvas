import re

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user, get_repository
from app.core.security.encryption import decrypt_token
from app.db.session import get_db
from app.models.repository import Repository
from app.models.user import User
from app.schemas.repos import AnalyzeRequest, AnalyzeResponse, RepoListResponse, RepoResponse
from app.workers.analysis_tasks import run_full_analysis_task

router = APIRouter(prefix="/repos", tags=["Repositories"])


def parse_repo_url(url_or_name: str) -> tuple[str, str]:
    """Parse owner/name from a GitHub URL or owner/name string."""
    # Handle full URL
    match = re.match(r"(?:https?://)?(?:www\.)?github\.com/([^/]+)/([^/]+?)(?:\.git)?/?$", url_or_name)
    if match:
        return match.group(1), match.group(2)
    # Handle owner/name
    match = re.match(r"^([^/]+)/([^/]+)$", url_or_name)
    if match:
        return match.group(1), match.group(2)
    raise ValueError(f"Invalid repository: {url_or_name}")


@router.post("/analyze", response_model=AnalyzeResponse, status_code=status.HTTP_202_ACCEPTED)
async def analyze_repo(
    request: AnalyzeRequest,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Trigger analysis for a GitHub repository."""
    try:
        owner, name = parse_repo_url(request.repository_url)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    # Check if repo already tracked
    result = await db.execute(
        select(Repository).where(
            Repository.owner == owner,
            Repository.name == name,
            Repository.user_id == user.id,
        )
    )
    repo = result.scalar_one_or_none()

    if not repo:
        # Create new repo record
        repo = Repository(
            user_id=user.id,
            github_id=0,  # Will be updated during analysis
            owner=owner,
            name=name,
            full_name=f"{owner}/{name}",
            analysis_status="queued",
        )
        db.add(repo)
        await db.flush()

    repo.analysis_status = "queued"
    await db.flush()

    # Queue analysis task
    token = decrypt_token(user.access_token)
    run_full_analysis_task.delay(str(repo.id), owner, name, token)

    return AnalyzeResponse(
        analysis_id=str(repo.id),
        repository=f"{owner}/{name}",
        status="queued",
        estimated_duration_seconds=120,
        status_url=f"/api/v1/repos/{owner}/{name}/status",
    )


@router.get("", response_model=RepoListResponse)
async def list_repos(
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """List all tracked repositories for the current user."""
    result = await db.execute(
        select(Repository).where(Repository.user_id == user.id).order_by(Repository.updated_at.desc())
    )
    repos = result.scalars().all()

    return RepoListResponse(
        repositories=[
            RepoResponse(
                id=str(r.id),
                owner=r.owner,
                name=r.name,
                full_name=r.full_name,
                description=r.description,
                language=r.language,
                stars_count=r.stars_count,
                forks_count=r.forks_count,
                is_private=r.is_private,
                last_analyzed=r.last_analyzed,
                analysis_status=r.analysis_status,
            )
            for r in repos
        ],
        total=len(repos),
    )


@router.get("/{owner}/{name}", response_model=RepoResponse)
async def get_repo(repo: Repository = Depends(get_repository)):
    """Get repository details."""
    return RepoResponse(
        id=str(repo.id),
        owner=repo.owner,
        name=repo.name,
        full_name=repo.full_name,
        description=repo.description,
        language=repo.language,
        stars_count=repo.stars_count,
        forks_count=repo.forks_count,
        is_private=repo.is_private,
        last_analyzed=repo.last_analyzed,
        analysis_status=repo.analysis_status,
    )


@router.get("/{owner}/{name}/status")
async def get_analysis_status(repo: Repository = Depends(get_repository)):
    """Get current analysis job status."""
    return {
        "repository": repo.full_name,
        "status": repo.analysis_status,
        "last_analyzed": repo.last_analyzed.isoformat() if repo.last_analyzed else None,
    }


@router.delete("/{owner}/{name}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_repo(
    repo: Repository = Depends(get_repository),
    db: AsyncSession = Depends(get_db),
):
    """Remove repository from tracking."""
    await db.delete(repo)
