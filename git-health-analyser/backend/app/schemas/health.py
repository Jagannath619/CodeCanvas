from datetime import datetime

from pydantic import BaseModel


class DimensionScore(BaseModel):
    score: float
    label: str


class RiskAlert(BaseModel):
    severity: str  # critical, warning, info
    category: str
    message: str
    recommendation: str


class KeyMetrics(BaseModel):
    commits_per_week: float = 0
    active_contributors_30d: int = 0
    avg_pr_merge_hours: float = 0
    avg_issue_close_days: float = 0
    ci_success_rate: float = 0
    bus_factor: int = 0


class HealthScoreResponse(BaseModel):
    repository: str
    health_score: float
    grade: str
    trend: str  # improving, stable, declining
    score_delta: float | None = None
    analyzed_at: datetime | None = None
    dimensions: dict[str, DimensionScore]
    top_risks: list[RiskAlert]
    key_metrics: KeyMetrics


class HealthHistoryItem(BaseModel):
    health_score: float
    grade: str
    analyzed_at: datetime
    score_delta: float | None = None


class HealthHistoryResponse(BaseModel):
    repository: str
    history: list[HealthHistoryItem]


class CommitAnalyticsResponse(BaseModel):
    repository: str
    metrics: dict


class ContributorAnalyticsResponse(BaseModel):
    repository: str
    metrics: dict


class PRAnalyticsResponse(BaseModel):
    repository: str
    metrics: dict


class IssueAnalyticsResponse(BaseModel):
    repository: str
    metrics: dict


class CICDAnalyticsResponse(BaseModel):
    repository: str
    metrics: dict


class RiskListResponse(BaseModel):
    repository: str
    risks: list[RiskAlert]
    total: int
