from datetime import datetime

from pydantic import BaseModel, Field


class AnalyzeRequest(BaseModel):
    repository_url: str = Field(..., description="GitHub repository URL or owner/name")
    depth: str = Field(default="full", description="Analysis depth: quick or full")
    include_dependencies: bool = True


class AnalyzeResponse(BaseModel):
    analysis_id: str
    repository: str
    status: str
    estimated_duration_seconds: int = 120
    status_url: str


class RepoResponse(BaseModel):
    id: str
    owner: str
    name: str
    full_name: str
    description: str | None = None
    language: str | None = None
    stars_count: int = 0
    forks_count: int = 0
    is_private: bool = False
    last_analyzed: datetime | None = None
    analysis_status: str = "pending"
    health_score: float | None = None
    grade: str | None = None

    model_config = {"from_attributes": True}


class RepoListResponse(BaseModel):
    repositories: list[RepoResponse]
    total: int
