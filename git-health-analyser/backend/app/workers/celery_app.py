from celery import Celery

from app.config import settings

celery_app = Celery(
    "github_health_analyzer",
    broker=settings.redis_url,
    backend=settings.redis_url,
)

celery_app.conf.update(
    task_serializer="json",
    result_serializer="json",
    accept_content=["json"],
    timezone="UTC",
    enable_utc=True,
    task_track_started=True,
    task_acks_late=True,
    worker_prefetch_multiplier=1,
    task_soft_time_limit=600,  # 10 minutes
    task_time_limit=900,  # 15 minutes
)

celery_app.autodiscover_tasks(["app.workers"])
