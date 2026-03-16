from datetime import datetime

from sqlalchemy import BigInteger, Boolean, DateTime, ForeignKey, Integer, String, Text, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin, UUIDMixin


class Contributor(UUIDMixin, TimestampMixin, Base):
    __tablename__ = "contributors"
    __table_args__ = (UniqueConstraint("repository_id", "github_login"),)

    repository_id: Mapped[str] = mapped_column(UUID(as_uuid=True), ForeignKey("repositories.id", ondelete="CASCADE"), nullable=False)
    github_login: Mapped[str] = mapped_column(String(255), nullable=False)
    github_id: Mapped[int | None] = mapped_column(BigInteger)
    avatar_url: Mapped[str | None] = mapped_column(Text)
    total_commits: Mapped[int] = mapped_column(Integer, default=0)
    total_prs: Mapped[int] = mapped_column(Integer, default=0)
    total_reviews: Mapped[int] = mapped_column(Integer, default=0)
    lines_added: Mapped[int] = mapped_column(BigInteger, default=0)
    lines_deleted: Mapped[int] = mapped_column(BigInteger, default=0)
    first_commit_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    last_commit_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    repository = relationship("Repository", back_populates="contributors")
