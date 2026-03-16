from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_repository
from app.db.session import get_db
from app.models.health_metric import HealthMetric
from app.models.analysis_report import AnalysisReport
from app.models.repository import Repository
from app.schemas.health import (
    CommitAnalyticsResponse,
    ContributorAnalyticsResponse,
    PRAnalyticsResponse,
    IssueAnalyticsResponse,
    CICDAnalyticsResponse,
    RiskAlert,
    RiskListResponse,
)

router = APIRouter(tags=["Analytics"])


async def _get_latest_metric(db: AsyncSession, repo_id, dimension: str) -> dict:
    """Get the latest metric for a dimension from the most recent report."""
    result = await db.execute(
        select(HealthMetric)
        .where(HealthMetric.repository_id == repo_id, HealthMetric.dimension == dimension)
        .order_by(HealthMetric.created_at.desc())
        .limit(1)
    )
    metric = result.scalar_one_or_none()
    return metric.raw_metrics if metric else {}


@router.get("/repos/{owner}/{name}/commits", response_model=CommitAnalyticsResponse)
async def get_commit_analytics(
    repo: Repository = Depends(get_repository),
    db: AsyncSession = Depends(get_db),
):
    metrics = await _get_latest_metric(db, repo.id, "activity")
    return CommitAnalyticsResponse(repository=repo.full_name, metrics=metrics)


@router.get("/repos/{owner}/{name}/contributors", response_model=ContributorAnalyticsResponse)
async def get_contributor_analytics(
    repo: Repository = Depends(get_repository),
    db: AsyncSession = Depends(get_db),
):
    metrics = await _get_latest_metric(db, repo.id, "contributors")
    return ContributorAnalyticsResponse(repository=repo.full_name, metrics=metrics)


@router.get("/repos/{owner}/{name}/pull-requests", response_model=PRAnalyticsResponse)
async def get_pr_analytics(
    repo: Repository = Depends(get_repository),
    db: AsyncSession = Depends(get_db),
):
    metrics = await _get_latest_metric(db, repo.id, "pr_process")
    return PRAnalyticsResponse(repository=repo.full_name, metrics=metrics)


@router.get("/repos/{owner}/{name}/issues", response_model=IssueAnalyticsResponse)
async def get_issue_analytics(
    repo: Repository = Depends(get_repository),
    db: AsyncSession = Depends(get_db),
):
    metrics = await _get_latest_metric(db, repo.id, "issue_management")
    return IssueAnalyticsResponse(repository=repo.full_name, metrics=metrics)


@router.get("/repos/{owner}/{name}/cicd", response_model=CICDAnalyticsResponse)
async def get_cicd_analytics(
    repo: Repository = Depends(get_repository),
    db: AsyncSession = Depends(get_db),
):
    metrics = await _get_latest_metric(db, repo.id, "cicd_reliability")
    return CICDAnalyticsResponse(repository=repo.full_name, metrics=metrics)


@router.get("/repos/{owner}/{name}/risks", response_model=RiskListResponse)
async def get_risks(
    repo: Repository = Depends(get_repository),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(AnalysisReport)
        .where(AnalysisReport.repository_id == repo.id)
        .order_by(AnalysisReport.created_at.desc())
        .limit(1)
    )
    report = result.scalar_one_or_none()
    risks = [RiskAlert(**r) for r in (report.risks if report else [])]
    return RiskListResponse(repository=repo.full_name, risks=risks, total=len(risks))
