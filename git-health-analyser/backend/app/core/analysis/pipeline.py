import asyncio
import logging
import time
from dataclasses import dataclass, field
from datetime import datetime, timezone

from app.core.github.client import GitHubClient
from app.core.analysis.commits import CommitAnalyzer
from app.core.analysis.contributors import ContributorAnalyzer
from app.core.analysis.pull_requests import PullRequestAnalyzer
from app.core.analysis.issues import IssueAnalyzer
from app.core.analysis.cicd import CICDAnalyzer
from app.core.analysis.ownership import OwnershipAnalyzer
from app.core.analysis.releases import ReleaseAnalyzer
from app.core.analysis.dependencies import DependencyAnalyzer
from app.core.analysis.documentation import DocumentationAnalyzer
from app.core.scoring.engine import ScoringEngine
from app.core.scoring.risk_detector import RiskDetector

logger = logging.getLogger(__name__)


@dataclass
class AnalysisResult:
    commit_metrics: dict = field(default_factory=dict)
    contributor_metrics: dict = field(default_factory=dict)
    pr_metrics: dict = field(default_factory=dict)
    issue_metrics: dict = field(default_factory=dict)
    cicd_metrics: dict = field(default_factory=dict)
    ownership_metrics: dict = field(default_factory=dict)
    release_metrics: dict = field(default_factory=dict)
    dependency_metrics: dict = field(default_factory=dict)
    documentation_metrics: dict = field(default_factory=dict)
    health_score: float = 0.0
    grade: str = "F"
    dimension_scores: dict = field(default_factory=dict)
    risks: list = field(default_factory=list)
    duration_seconds: float = 0.0
    data_fetched_at: datetime | None = None


class AnalysisPipeline:
    """Orchestrates full repository analysis."""

    def __init__(self):
        self.commit_analyzer = CommitAnalyzer()
        self.contributor_analyzer = ContributorAnalyzer()
        self.pr_analyzer = PullRequestAnalyzer()
        self.issue_analyzer = IssueAnalyzer()
        self.cicd_analyzer = CICDAnalyzer()
        self.ownership_analyzer = OwnershipAnalyzer()
        self.release_analyzer = ReleaseAnalyzer()
        self.dependency_analyzer = DependencyAnalyzer()
        self.documentation_analyzer = DocumentationAnalyzer()
        self.scoring_engine = ScoringEngine()
        self.risk_detector = RiskDetector()

    async def run(self, owner: str, repo: str, token: str) -> AnalysisResult:
        """Run complete analysis pipeline."""
        start = time.time()
        client = GitHubClient(token)

        try:
            # Phase 1: Fetch data concurrently
            logger.info(f"Fetching data for {owner}/{repo}")
            raw_commits, raw_prs, raw_issues, raw_workflows, raw_releases, repo_contents = (
                await asyncio.gather(
                    client.fetch_commits(owner, repo),
                    client.fetch_pull_requests(owner, repo),
                    client.fetch_issues(owner, repo),
                    client.fetch_workflows(owner, repo),
                    client.fetch_releases(owner, repo),
                    client.fetch_repo_contents(owner, repo),
                    return_exceptions=True,
                )
            )

            # Handle exceptions from gather
            raw_commits = raw_commits if isinstance(raw_commits, list) else []
            raw_prs = raw_prs if isinstance(raw_prs, list) else []
            raw_issues = raw_issues if isinstance(raw_issues, list) else []
            raw_workflows = raw_workflows if isinstance(raw_workflows, list) else []
            raw_releases = raw_releases if isinstance(raw_releases, list) else []
            repo_contents = repo_contents if isinstance(repo_contents, list) else []

            data_fetched_at = datetime.now(timezone.utc)

            # Fetch workflow runs for each workflow
            workflow_runs = {}
            for wf in raw_workflows:
                wf_id = wf.get("id")
                if wf_id:
                    try:
                        runs = await client.fetch_workflow_runs(owner, repo, wf_id)
                        workflow_runs[wf_id] = runs
                    except Exception:
                        workflow_runs[wf_id] = []

            # Phase 2: Run analysis engines
            logger.info(f"Analyzing {owner}/{repo}")
            commit_metrics = self.commit_analyzer.analyze(raw_commits)
            contributor_metrics = self.contributor_analyzer.analyze(raw_commits, raw_prs)
            pr_metrics = self.pr_analyzer.analyze(raw_prs)
            issue_metrics = self.issue_analyzer.analyze(raw_issues)
            cicd_metrics = self.cicd_analyzer.analyze(raw_workflows, workflow_runs)
            ownership_metrics = self.ownership_analyzer.analyze(raw_commits)
            release_metrics = self.release_analyzer.analyze(raw_releases, raw_commits)

            file_names = [f.get("name", "") if isinstance(f, dict) else str(f) for f in repo_contents]
            dependency_metrics = self.dependency_analyzer.analyze(repo_contents)
            documentation_metrics = self.documentation_analyzer.analyze(file_names)

            # Phase 3: Compute health score
            health_score, dimension_scores = self.scoring_engine.compute(
                commit_metrics=commit_metrics,
                contributor_metrics=contributor_metrics,
                pr_metrics=pr_metrics,
                issue_metrics=issue_metrics,
                churn_metrics=commit_metrics,  # reuse commit data for churn
                ownership_metrics=ownership_metrics,
                cicd_metrics=cicd_metrics,
                release_metrics=release_metrics,
                dependency_metrics=dependency_metrics,
                documentation_metrics=documentation_metrics,
            )
            grade = self.scoring_engine.grade(health_score)

            # Phase 4: Detect risks
            all_metrics = {
                "commit": commit_metrics,
                "contributor": contributor_metrics,
                "pr": pr_metrics,
                "issue": issue_metrics,
                "ownership": ownership_metrics,
                "cicd": cicd_metrics,
                "dependency": dependency_metrics,
                "documentation": documentation_metrics,
                "release": release_metrics,
            }
            risks = self.risk_detector.detect_risks(all_metrics)

            duration = time.time() - start
            logger.info(f"Analysis complete for {owner}/{repo}: score={health_score}, grade={grade}")

            return AnalysisResult(
                commit_metrics=commit_metrics,
                contributor_metrics=contributor_metrics,
                pr_metrics=pr_metrics,
                issue_metrics=issue_metrics,
                cicd_metrics=cicd_metrics,
                ownership_metrics=ownership_metrics,
                release_metrics=release_metrics,
                dependency_metrics=dependency_metrics,
                documentation_metrics=documentation_metrics,
                health_score=health_score,
                grade=grade,
                dimension_scores=dimension_scores,
                risks=risks,
                duration_seconds=round(duration, 2),
                data_fetched_at=data_fetched_at,
            )
        finally:
            await client.close()
