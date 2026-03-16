from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # App
    app_name: str = "GitHub Health Analyzer"
    debug: bool = False
    secret_key: str = "change-me-in-production"
    encryption_key: str = "change-me-32-byte-base64-key-here"
    allowed_origins: list[str] = ["http://localhost:3000"]

    # Database
    database_url: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/ghanalyzer"

    # Redis
    redis_url: str = "redis://localhost:6379/0"

    # GitHub OAuth
    github_client_id: str = ""
    github_client_secret: str = ""
    github_redirect_uri: str = "http://localhost:8000/api/v1/auth/github/callback"
    github_webhook_secret: str = ""

    # Frontend
    frontend_url: str = "http://localhost:3000"

    # Sentry (optional)
    sentry_dsn: str = ""

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


settings = Settings()
