from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_repository
from app.db.session import get_db
from app.models.analysis_report import AnalysisReport
from app.models.repository import Repository
from app.schemas.health import (
    DimensionScore,
    HealthHistoryItem,
    HealthHistoryResponse,
    HealthScoreResponse,
    KeyMetrics,
    RiskAlert,
)

router = APIRouter(tags=["Health Score"])

DIMENSION_LABELS = {
    (90, 101): "Excellent",
    (80, 90): "Healthy",
    (70, 80): "Good",
    (60, 70): "Fair",
    (40, 60): "At Risk",
    (0, 40): "Critical",
}


def get_label(score: float) -> str:
    for (low, high), label in DIMENSION_LABELS.items():
        if low <= score < high:
            return label
    return "Unknown"


@router.get("/repos/{owner}/{name}/health", response_model=HealthScoreResponse)
async def get_health_score(
    repo: Repository = Depends(get_repository),
    db: AsyncSession = Depends(get_db),
):
    """Get latest health score with all dimensions."""
    result = await db.execute(
        select(AnalysisReport)
        .where(AnalysisReport.repository_id == repo.id)
        .order_by(AnalysisReport.created_at.desc())
        .limit(1)
    )
    report = result.scalar_one_or_none()

    if not report:
        return HealthScoreResponse(
            repository=repo.full_name,
            health_score=0,
            grade="F",
            trend="stable",
            dimensions={},
            top_risks=[],
            key_metrics=KeyMetrics(),
        )

    dimensions = {}
    for dim, score in (report.dimension_scores or {}).items():
        dimensions[dim] = DimensionScore(score=score, label=get_label(score))

    # Determine trend
    trend = "stable"
    if report.score_delta and report.score_delta > 5:
        trend = "improving"
    elif report.score_delta and report.score_delta < -5:
        trend = "declining"

    risks = [RiskAlert(**r) for r in (report.risks or [])[:5]]

    return HealthScoreResponse(
        repository=repo.full_name,
        health_score=report.health_score,
        grade=report.grade,
        trend=trend,
        score_delta=report.score_delta,
        analyzed_at=report.created_at,
        dimensions=dimensions,
        top_risks=risks,
        key_metrics=KeyMetrics(),  # Would be populated from health_metrics
    )


@router.get("/repos/{owner}/{name}/health/history", response_model=HealthHistoryResponse)
async def get_health_history(
    repo: Repository = Depends(get_repository),
    db: AsyncSession = Depends(get_db),
):
    """Get health score history."""
    result = await db.execute(
        select(AnalysisReport)
        .where(AnalysisReport.repository_id == repo.id)
        .order_by(AnalysisReport.created_at.desc())
        .limit(50)
    )
    reports = result.scalars().all()

    history = [
        HealthHistoryItem(
            health_score=r.health_score,
            grade=r.grade,
            analyzed_at=r.created_at,
            score_delta=r.score_delta,
        )
        for r in reports
    ]

    return HealthHistoryResponse(repository=repo.full_name, history=history)
