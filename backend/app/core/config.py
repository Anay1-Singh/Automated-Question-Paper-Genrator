from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Central configuration loaded from environment variables.

    Values are read from the .env file at the backend root.
    Every field listed here becomes available as a typed attribute
    on the singleton returned by get_settings().
    """

    # ── Application ──────────────────────────────
    app_name: str = "PaperMind AI"
    app_env: str = "development"
    debug: bool = True

    # ── Database ──────────────────────────────────
    database_url: str = "postgresql://postgres:password@localhost:5432/papermind"

    # ── Authentication (future) ──────────────────
    jwt_secret: str = "change-this-to-a-secure-random-string"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 30

    # ── File Storage ─────────────────────────────
    upload_dir: str = "./uploads"

    # ── AI / NLP (future) ────────────────────────
    ai_model_name: str = "bert-base-uncased"

    # ── CORS ─────────────────────────────────────
    frontend_url: str = "http://localhost:5173"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


# Cached singleton so .env is only read once per process
_settings: Settings | None = None


def get_settings() -> Settings:
    """Return the application settings singleton."""
    global _settings
    if _settings is None:
        _settings = Settings()
    return _settings
