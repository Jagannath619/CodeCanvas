from datetime import datetime

from sqlalchemy import DateTime, Float, ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import JSON, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin, UUIDMixin


class AnalysisReport(UUIDMixin, TimestampMixin, Base):
    __tablename__ = "analysis_reports"

    repository_id: Mapped[str] = mapped_column(UUID(as_uuid=True), ForeignKey("repositories.id", ondelete="CASCADE"), nullable=False)
    health_score: Mapped[float] = mapped_column(Float, nullable=False)
    grade: Mapped[str] = mapped_column(String(2), nullable=False)
    dimension_scores: Mapped[dict] = mapped_column(JSON, nullable=False)
    risks: Mapped[list] = mapped_column(JSON, default=list)
    summary: Mapped[str | None] = mapped_column(Text)
    previous_score: Mapped[float | None] = mapped_column(Float)
    score_delta: Mapped[float | None] = mapped_column(Float)
    analysis_duration_seconds: Mapped[float | None] = mapped_column(Float)
    data_fetched_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))

    repository = relationship("Repository", back_populates="analysis_reports")
    health_metrics = relationship("HealthMetric", back_populates="report", cascade="all, delete-orphan")
