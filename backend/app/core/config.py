"""
PaperMind AI - Application Configuration

Loads and validates all environment variables using Pydantic Settings.
Values are read from a .env file or system environment variables.
"""

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Application settings loaded from environment variables.

    Attributes:
        MONGODB_URI: MongoDB Atlas connection string.
        DATABASE_NAME: Name of the MongoDB database.
        JWT_SECRET: Secret key used for signing JWT tokens.
        JWT_ALGORITHM: Algorithm used for JWT encoding/decoding.
        ACCESS_TOKEN_EXPIRE_MINUTES: Token expiry duration in minutes.
        CORS_ORIGINS: Comma-separated list of allowed CORS origins.
        UPLOAD_DIRECTORY: Directory path for storing uploaded files.
        GEMINI_API_KEY: Google Gemini API key used by centralized AI services.
        GEMINI_MODEL: Gemini model name used for document intelligence.
        RESEND_API_KEY: API key for the Resend email delivery service.
    """

    ENVIRONMENT: str = "development"

    MONGODB_URI: str
    DATABASE_NAME: str = "papermind"

    JWT_SECRET: str
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    CORS_ORIGINS: list[str] = ["http://localhost:5173"]

    UPLOAD_DIRECTORY: str = "uploads"

    GEMINI_API_KEY: str | None = None
    GEMINI_MODEL: str = "gemini-2.5-flash"

    # Resend Email Delivery
    RESEND_API_KEY: str

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )


# Singleton settings instance — import this wherever config is needed.
settings = Settings()
