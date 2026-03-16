from datetime import datetime

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, Text, UniqueConstraint
from sqlalchemy.dialects.postgresql import JSON, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin, UUIDMixin


class Issue(UUIDMixin, TimestampMixin, Base):
    __tablename__ = "issues"
    __table_args__ = (UniqueConstraint("repository_id", "github_number"),)

    repository_id: Mapped[str] = mapped_column(UUID(as_uuid=True), ForeignKey("repositories.id", ondelete="CASCADE"), nullable=False)
    github_number: Mapped[int] = mapped_column(Integer, nullable=False)
    title: Mapped[str | None] = mapped_column(Text)
    state: Mapped[str] = mapped_column(String(20), nullable=False)
    author_login: Mapped[str | None] = mapped_column(String(255))
    created_at_gh: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    closed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    first_response_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    comments_count: Mapped[int] = mapped_column(Integer, default=0)
    labels: Mapped[dict | None] = mapped_column(JSON, default=list)
    is_stale: Mapped[bool] = mapped_column(Boolean, default=False)

    repository = relationship("Repository", back_populates="issues")
