from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.core.config import get_settings

settings = get_settings()

# ── SQLAlchemy Engine ─────────────────────────────────────────
# create_engine manages a connection pool under the hood.
# pool_pre_ping ensures stale connections are recycled before use.
engine = create_engine(
    settings.database_url,
    pool_pre_ping=True,
    pool_size=10,
    max_overflow=20,
    echo=settings.debug,  # SQL logging mirrors the app debug flag
)

# ── Session Factory ───────────────────────────────────────────
# Each call to SessionLocal() produces an independent database session.
# autocommit=False / autoflush=False gives explicit transaction control.
SessionLocal = sessionmaker(
    bind=engine,
    autocommit=False,
    autoflush=False,
)
