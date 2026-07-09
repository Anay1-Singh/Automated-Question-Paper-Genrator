"""
PaperMind AI - OTP Model

Defines the structure for OTP verification documents stored in the
``otp_verifications`` collection prior to user creation.
"""

from datetime import datetime, timedelta, timezone


def create_otp_document(
    name: str,
    email: str,
    hashed_password: str,
    otp: str,
    role: str = "teacher",
) -> dict:
    """
    Build an OTP verification document ready for insertion into MongoDB.

    Args:
        name: The display name of the signing-up user.
        email: The email address (will be stored lowercase).
        hashed_password: The bcrypt-hashed password (unverified stage).
        otp: The 6-digit OTP code string.
        role: The user's public signup role (teacher or student).

    Returns:
        A dictionary matching the ``otp_verifications`` collection schema.
    """
    now = datetime.now(timezone.utc)
    # Valid for 5 minutes
    expiry = now + timedelta(minutes=5)

    return {
        "name": name.strip(),
        "email": email.lower().strip(),
        "password": hashed_password,
        "otp": otp,
        "role": role,
        "attempts": 0,
        "created_at": now,
        "expires_at": expiry,
        "last_sent_at": now,
    }
