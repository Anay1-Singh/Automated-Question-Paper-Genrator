"""
PaperMind AI - Security Utilities

Provides password hashing/verification using bcrypt
and JWT token creation/decoding using python-jose.
"""

from datetime import datetime, timedelta, timezone

import bcrypt
from jose import ExpiredSignatureError, JWTError, jwt

from app.core.config import settings


# =====================================================
# Password Hashing (bcrypt)
# =====================================================

def hash_password(plain_password: str) -> str:
    """
    Hash a plain-text password using bcrypt.

    Args:
        plain_password: The raw password string from the user.

    Returns:
        The bcrypt-hashed password string.
    """
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(plain_password.encode("utf-8"), salt)
    return hashed.decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a plain-text password against a stored bcrypt hash.

    Args:
        plain_password: The raw password string from the login request.
        hashed_password: The bcrypt hash stored in MongoDB.

    Returns:
        True if the password matches, False otherwise.
    """
    return bcrypt.checkpw(
        plain_password.encode("utf-8"),
        hashed_password.encode("utf-8"),
    )


# =====================================================
# JWT Token Management
# =====================================================

def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    """
    Create a signed JWT access token.

    Args:
        data: The payload dictionary to encode into the token.
              Typically contains ``{"sub": user_email}``.
        expires_delta: Optional custom expiry duration.
                       Defaults to ACCESS_TOKEN_EXPIRE_MINUTES from config.

    Returns:
        The encoded JWT string.
    """
    to_encode = data.copy()

    if expires_delta is not None:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )

    to_encode.update({"exp": expire})

    return jwt.encode(
        to_encode,
        settings.JWT_SECRET,
        algorithm=settings.JWT_ALGORITHM,
    )


def decode_access_token(token: str) -> dict | None:
    """
    Decode and validate a JWT access token.

    Args:
        token: The encoded JWT string.

    Returns:
        The decoded payload dictionary if the token is valid,
        or None if the token is expired or invalid.
    """
    try:
        payload = jwt.decode(
            token,
            settings.JWT_SECRET,
            algorithms=[settings.JWT_ALGORITHM],
        )
        return payload
    except ExpiredSignatureError:
        return None
    except JWTError:
        return None
