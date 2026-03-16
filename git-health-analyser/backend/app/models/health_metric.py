from sqlalchemy import Float, ForeignKey, String
from sqlalchemy.dialects.postgresql import JSON, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin, UUIDMixin


class HealthMetric(UUIDMixin, TimestampMixin, Base):
    __tablename__ = "health_metrics"

    report_id: Mapped[str] = mapped_column(UUID(as_uuid=True), ForeignKey("analysis_reports.id", ondelete="CASCADE"), nullable=False)
    repository_id: Mapped[str] = mapped_column(UUID(as_uuid=True), ForeignKey("repositories.id", ondelete="CASCADE"), nullable=False)
    dimension: Mapped[str] = mapped_column(String(50), nullable=False)
    score: Mapped[float] = mapped_column(Float, nullable=False)
    raw_metrics: Mapped[dict] = mapped_column(JSON, nullable=False)

    report = relationship("AnalysisReport", back_populates="health_metrics")
    repository = relationship("Repository", back_populates="health_metrics")
