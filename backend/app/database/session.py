from collections.abc import Generator

from sqlalchemy.orm import Session

from app.database.database import SessionLocal


def get_db() -> Generator[Session, None, None]:
    """
    FastAPI dependency that yields a database session.

    The session is automatically closed when the request finishes,
    even if an exception occurs.

    Usage in a route:
        @router.get("/items")
        def list_items(db: Session = Depends(get_db)):
            ...
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
