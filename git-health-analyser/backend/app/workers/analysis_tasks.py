import asyncio
import logging
from datetime import datetime, timezone

from sqlalchemy import select

from app.core.analysis.pipeline import AnalysisPipeline
from app.db.session import async_session_factory
from app.models.analysis_report import AnalysisReport
from app.models.health_metric import HealthMetric
from app.models.repository import Repository
from app.workers.celery_app import celery_app

logger = logging.getLogger(__name__)


def _run_async(coro):
    """Run an async function from sync Celery task."""
    loop = asyncio.new_event_loop()
    try:
        return loop.run_until_complete(coro)
    finally:
        loop.close()


@celery_app.task(name="run_full_analysis", bind=True, max_retries=3)
def run_full_analysis_task(self, repo_id: str, owner: str, name: str, token: str):
    """Run full repository analysis as a Celery task."""
    logger.info(f"Starting analysis for {owner}/{name} (repo_id={repo_id})")

    try:
        _run_async(_run_analysis(repo_id, owner, name, token))
    except Exception as exc:
        logger.error(f"Analysis failed for {owner}/{name}: {exc}")
        _run_async(_mark_failed(repo_id))
        raise self.retry(exc=exc, countdown=60)


async def _run_analysis(repo_id: str, owner: str, name: str, token: str):
    """Async implementation of the analysis task."""
    async with async_session_factory() as db:
        # Update status to running
        result = await db.execute(select(Repository).where(Repository.id == repo_id))
        repo = result.scalar_one_or_none()
        if not repo:
            logger.error(f"Repository {repo_id} not found")
            return

        repo.analysis_status = "running"
        await db.commit()

        # Run analysis pipeline
        pipeline = AnalysisPipeline()
        analysis = await pipeline.run(owner, name, token)

        # Get previous score for delta calculation
        prev_result = await db.execute(
            select(AnalysisReport)
            .where(AnalysisReport.repository_id == repo_id)
            .order_by(AnalysisReport.created_at.desc())
            .limit(1)
        )
        prev_report = prev_result.scalar_one_or_none()
        previous_score = prev_report.health_score if prev_report else None
        score_delta = (analysis.health_score - previous_score) if previous_score is not None else None

        # Create analysis report
        report = AnalysisReport(
            repository_id=repo_id,
            health_score=analysis.health_score,
            grade=analysis.grade,
            dimension_scores=analysis.dimension_scores,
            risks=[r for r in analysis.risks],
            previous_score=previous_score,
            score_delta=score_delta,
            analysis_duration_seconds=analysis.duration_seconds,
            data_fetched_at=analysis.data_fetched_at,
        )
        db.add(report)
        await db.flush()

        # Store individual dimension metrics
        dimension_data = {
            "activity": analysis.commit_metrics,
            "contributors": analysis.contributor_metrics,
            "pr_process": analysis.pr_metrics,
            "issue_management": analysis.issue_metrics,
            "code_stability": analysis.commit_metrics,
            "knowledge_distribution": analysis.ownership_metrics,
            "cicd_reliability": analysis.cicd_metrics,
            "release_practice": analysis.release_metrics,
            "dependency_health": analysis.dependency_metrics,
            "documentation": analysis.documentation_metrics,
        }

        for dimension, raw_metrics in dimension_data.items():
            metric = HealthMetric(
                report_id=report.id,
                repository_id=repo_id,
                dimension=dimension,
                score=analysis.dimension_scores.get(dimension, 0),
                raw_metrics=raw_metrics,
            )
            db.add(metric)

        # Update repository status
        repo.analysis_status = "completed"
        repo.last_analyzed = datetime.now(timezone.utc)
        await db.commit()

        logger.info(f"Analysis complete for {owner}/{name}: score={analysis.health_score}")


async def _mark_failed(repo_id: str):
    """Mark repository analysis as failed."""
    async with async_session_factory() as db:
        result = await db.execute(select(Repository).where(Repository.id == repo_id))
        repo = result.scalar_one_or_none()
        if repo:
            repo.analysis_status = "failed"
            await db.commit()
