from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    """
    Declarative base for all ORM models.

    Every model in app/models/ should inherit from this class.
    Alembic's env.py imports Base.metadata to auto-detect tables.

    Usage:
        from app.database.base import Base

        class User(Base):
            __tablename__ = "users"
            ...
    """
    pass


# ── Model Imports ─────────────────────────────────────────────
# Import all ORM models here so that Base.metadata is fully
# populated before Alembic or create_all() inspects it.
from app.models.user import User  # noqa: F401
#   from app.models.document import Document    # noqa: F401
#   from app.models.paper import QuestionPaper  # noqa: F401
#   from app.models.question import Question    # noqa: F401
