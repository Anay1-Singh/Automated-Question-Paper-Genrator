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

    # SMTP Configuration
    SMTP_EMAIL: str
    SMTP_APP_PASSWORD: str
    SMTP_SERVER: str = "smtp.gmail.com"
    SMTP_PORT: int = 587

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
    )


# Singleton settings instance — import this wherever config is needed.
settings = Settings()
