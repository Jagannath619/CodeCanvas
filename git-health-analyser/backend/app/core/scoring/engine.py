DEFAULT_WEIGHTS = {
    "activity": 0.15,
    "contributors": 0.12,
    "pr_process": 0.12,
    "issue_management": 0.10,
    "code_stability": 0.10,
    "knowledge_distribution": 0.10,
    "cicd_reliability": 0.10,
    "release_practice": 0.08,
    "dependency_health": 0.08,
    "documentation": 0.05,
}


class ScoringEngine:
    """Compute composite health score from analysis metrics."""

    def __init__(self, weights: dict | None = None):
        self.weights = weights or DEFAULT_WEIGHTS

    def compute(self, **metrics) -> tuple[float, dict]:
        dimension_scores = {
            "activity": self._score_activity(metrics.get("commit_metrics", {})),
            "contributors": self._score_contributors(metrics.get("contributor_metrics", {})),
            "pr_process": self._score_prs(metrics.get("pr_metrics", {})),
            "issue_management": self._score_issues(metrics.get("issue_metrics", {})),
            "code_stability": self._score_stability(metrics.get("churn_metrics", {})),
            "knowledge_distribution": self._score_knowledge(metrics.get("ownership_metrics", {})),
            "cicd_reliability": self._score_cicd(metrics.get("cicd_metrics", {})),
            "release_practice": self._score_releases(metrics.get("release_metrics", {})),
            "dependency_health": self._score_dependencies(metrics.get("dependency_metrics", {})),
            "documentation": self._score_docs(metrics.get("documentation_metrics", {})),
        }

        health_score = sum(
            dimension_scores[dim] * self.weights[dim]
            for dim in dimension_scores
        )

        return round(health_score, 1), {k: round(v, 1) for k, v in dimension_scores.items()}

    def grade(self, score: float) -> str:
        if score >= 90:
            return "A+"
        if score >= 80:
            return "A"
        if score >= 70:
            return "B"
        if score >= 60:
            return "C"
        if score >= 40:
            return "D"
        return "F"

    def _score_activity(self, m: dict) -> float:
        recency = self._normalize_recency(m.get("days_since_last_commit", 365))
        frequency = min(m.get("commits_per_week_avg", 0) / 10 * 100, 100)
        trend = m.get("velocity_trend_score", 50)
        consistency = m.get("consistency_score", 50)
        return recency * 0.3 + frequency * 0.3 + trend * 0.2 + consistency * 0.2

    def _score_contributors(self, m: dict) -> float:
        active = min(m.get("active_contributors_30d", 0) / 8 * 100, 100)
        evenness = m.get("contribution_evenness", 50)
        growth = m.get("contributor_growth_score", 50)
        return active * 0.4 + evenness * 0.3 + growth * 0.3

    def _score_prs(self, m: dict) -> float:
        review_time = self._normalize_hours(m.get("avg_time_to_first_review_hours", 168), 4, 72)
        merge_time = self._normalize_hours(m.get("avg_time_to_merge_hours", 336), 8, 168)
        stale = max(0, 100 - m.get("stale_pr_percentage", 0) * 5)
        depth = min(m.get("avg_comments_per_pr", 0) / 3 * 100, 100)
        return review_time * 0.3 + merge_time * 0.3 + stale * 0.2 + depth * 0.2

    def _score_issues(self, m: dict) -> float:
        close_rate = m.get("close_rate_percentage", 0)
        responsiveness = self._normalize_hours(m.get("avg_first_response_hours", 168), 2, 48)
        stale = max(0, 100 - m.get("stale_issue_percentage", 0) * 3)
        backlog = m.get("backlog_trend_score", 50)
        return close_rate * 0.3 + responsiveness * 0.3 + stale * 0.2 + backlog * 0.2

    def _score_stability(self, m: dict) -> float:
        # Using commit size as a proxy for churn
        avg_size = m.get("commit_size_avg", 0)
        churn_score = max(0, 100 - avg_size / 10)
        consistency = m.get("consistency_score", 50)
        return churn_score * 0.6 + consistency * 0.4

    def _score_knowledge(self, m: dict) -> float:
        bf = m.get("bus_factor", 0)
        bf_map = {0: 0, 1: 15, 2: 45, 3: 70, 4: 85}
        bf_score = bf_map.get(bf, 100)
        shared = m.get("shared_ownership_percentage", 0)
        orphan = max(0, 100 - m.get("orphan_file_percentage", 0) * 3)
        return bf_score * 0.5 + shared * 0.3 + orphan * 0.2

    def _score_cicd(self, m: dict) -> float:
        success = m.get("build_success_rate", 0)
        duration = m.get("duration_trend_score", 50)
        coverage = m.get("workflow_coverage_score", 0)
        return success * 0.5 + duration * 0.25 + coverage * 0.25

    def _score_releases(self, m: dict) -> float:
        cadence = m.get("release_regularity_score", 0)
        frequency = min(m.get("releases_per_month", 0) / 2 * 100, 100)
        hotfix = max(0, 100 - m.get("hotfix_percentage", 0) * 2)
        return cadence * 0.4 + frequency * 0.3 + hotfix * 0.3

    def _score_dependencies(self, m: dict) -> float:
        freshness = m.get("dependency_freshness_score", 50)
        vuln = max(0, 100 - m.get("vulnerability_count", 0) * 15)
        license_risk = m.get("license_risk_score", 100)
        return freshness * 0.4 + vuln * 0.4 + license_risk * 0.2

    def _score_docs(self, m: dict) -> float:
        return float(m.get("documentation_score", 0))

    @staticmethod
    def _normalize_recency(days: int) -> float:
        if days <= 0:
            return 100
        if days >= 365:
            return 0
        return max(0, 100 - (days / 365) * 100)

    @staticmethod
    def _normalize_hours(hours: float, ideal: float, bad: float) -> float:
        if hours <= ideal:
            return 100
        if hours >= bad:
            return 0
        return 100 - ((hours - ideal) / (bad - ideal)) * 100
