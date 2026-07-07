"""
PaperMind AI - User Document Model

Defines the MongoDB document structure for the ``users`` collection
and provides helper functions for serialising documents to API responses.
"""

from datetime import datetime, timezone


def create_user_document(
    name: str,
    email: str,
    hashed_password: str,
    role: str = "student",
) -> dict:
    """
    Build a user document ready for insertion into MongoDB.

    Args:
        name: The user's display name.
        email: The user's email address (will be stored lowercase).
        hashed_password: The bcrypt-hashed password.
        role: The user's role (admin or student).

    Returns:
        A dictionary matching the ``users`` collection schema.
    """
    now = datetime.now(timezone.utc)

    return {
        "name": name.strip(),
        "email": email.lower().strip(),
        "password": hashed_password,
        "role": role,
        "created_at": now,
        "updated_at": now,
    }


def user_document_to_response(user: dict) -> dict:
    """
    Convert a raw MongoDB user document into a safe response dictionary.

    Strips the hashed password and converts ``_id`` to a string.

    Args:
        user: The raw document from MongoDB.

    Returns:
        A sanitised dictionary safe for API responses.
    """
    return {
        "id": str(user["_id"]),
        "name": user["name"],
        "email": user["email"],
        "role": user.get("role", "student"),
        "created_at": user["created_at"].isoformat(),
        "updated_at": user["updated_at"].isoformat(),
    }
