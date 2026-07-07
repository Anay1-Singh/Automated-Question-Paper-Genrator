"""
PaperMind AI - Authentication Service

Contains all business logic for user registration and login.
Route handlers delegate to these functions to keep the API layer thin.
"""

import asyncio
from datetime import datetime, timedelta, timezone
import logging
import secrets

from fastapi import HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.security import create_access_token, hash_password, verify_password
from app.models.otp import create_otp_document
from app.models.user import create_user_document, user_document_to_response

logger = logging.getLogger(__name__)

# =====================================================
# Collection name constants
# =====================================================

USERS_COLLECTION = "users"
OTP_COLLECTION = "otp_verifications"


# =====================================================
# Index Management
# =====================================================

async def ensure_indexes(db: AsyncIOMotorDatabase) -> None:
    """
    Create required indexes on the ``users`` and ``otp_verifications`` collections.

    Creates unique indexes on ``email`` to prevent duplicates and speed up lookups.
    This is idempotent — calling it multiple times is safe.
    """
    collection = db[USERS_COLLECTION]
    await collection.create_index("email", unique=True)
    logger.info("Ensured unique index on users.email")

    otp_col = db[OTP_COLLECTION]
    await otp_col.create_index("email", unique=True)
    logger.info("Ensured unique index on otp_verifications.email")


# =====================================================
# Helpers
# =====================================================

async def get_user_by_email(
    db: AsyncIOMotorDatabase,
    email: str,
) -> dict | None:
    """
    Find a single user document by email address.

    Args:
        db: The Motor database instance.
        email: The email to search for (case-insensitive).

    Returns:
        The user document dict, or None if not found.
    """
    return await db[USERS_COLLECTION].find_one(
        {"email": email.lower().strip()}
    )


async def check_existing_user(
    db: AsyncIOMotorDatabase,
    email: str,
) -> bool:
    """
    Check whether a user with the given email already exists.

    Args:
        db: The Motor database instance.
        email: The email to check.

    Returns:
        True if a user exists, False otherwise.
    """
    user = await get_user_by_email(db, email)
    return user is not None


# =====================================================
# Registration
# =====================================================

async def register_user(
    db: AsyncIOMotorDatabase,
    name: str,
    email: str,
    password: str,
) -> dict:
    """
    Register a new user in the ``users`` collection.

    Workflow:
        1. Check if the email is already taken → 409 Conflict.
        2. Hash the password with bcrypt.
        3. Build the user document and insert it into MongoDB.
        4. Return the sanitised user data (no password).

    Args:
        db: The Motor database instance.
        name: Display name from the signup form.
        email: Email address from the signup form.
        password: Plain-text password from the signup form.

    Returns:
        A sanitised user dictionary suitable for the API response.

    Raises:
        HTTPException 409: If the email is already registered.
    """
    # 1. Duplicate check
    if await check_existing_user(db, email):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A user with this email already exists.",
        )

    # 2. Hash the password
    hashed = hash_password(password)

    # 3. Build and insert the document
    user_doc = create_user_document(
        name=name,
        email=email,
        hashed_password=hashed,
    )

    result = await db[USERS_COLLECTION].insert_one(user_doc)
    user_doc["_id"] = result.inserted_id

    logger.info("User registered: %s", email.lower())

    # 4. Return safe response
    return user_document_to_response(user_doc)


# =====================================================
# Login
# =====================================================

async def login_user(
    db: AsyncIOMotorDatabase,
    email: str,
    password: str,
) -> dict:
    """
    Authenticate a user and return a JWT token.

    Workflow:
        1. Look up the user by email → 401 if not found.
        2. Verify the password against the stored hash → 401 if wrong.
        3. Generate a JWT access token with the email as subject.
        4. Return the token, token type, and sanitised user data.

    Args:
        db: The Motor database instance.
        email: Email address from the login form.
        password: Plain-text password from the login form.

    Returns:
        A dictionary containing ``access_token``, ``token_type``, and ``user``.

    Raises:
        HTTPException 401: If credentials are invalid.
    """
    # 1. Find the user
    user = await get_user_by_email(db, email)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    # 2. Verify the password
    if not verify_password(password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    # 3. Generate JWT
    access_token = create_access_token(
        data={"sub": user["email"], "role": user.get("role", "student")}
    )

    logger.info("User logged in: %s", user["email"])

    # 4. Return token + user
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user_document_to_response(user),
    }


# =====================================================
# OTP Service Functions
# =====================================================

def generate_otp() -> str:
    """Generate a random 6-digit numeric OTP code."""
    return f"{secrets.randbelow(900000) + 100000}"


async def cleanup_expired_otps(db: AsyncIOMotorDatabase) -> None:
    """Remove all expired OTP records from the collection."""
    try:
        now = datetime.now(timezone.utc)
        result = await db[OTP_COLLECTION].delete_many(
            {"expires_at": {"$lt": now}}
        )
        if result.deleted_count > 0:
            logger.info("Cleaned up %d expired OTP records", result.deleted_count)
    except Exception as exc:
        logger.error("Failed to clean up expired OTPs: %s", exc)


async def send_otp_code(
    db: AsyncIOMotorDatabase,
    name: str,
    email: str,
    password: str,
    role: str = "student",
) -> dict:
    """
    Generate and save a new OTP, and dispatch a verification email.

    Checks for existing registered users, enforces the 60s resend cooldown,
    hashes the password, and upserts the verification record.
    """
    email_clean = email.lower().strip()

    # 1. Check duplicate user in users
    if await check_existing_user(db, email_clean):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A user with this email already exists.",
        )

    # 2. Check if there is already an OTP record to enforce cooldown
    existing_otp = await db[OTP_COLLECTION].find_one({"email": email_clean})
    if existing_otp:
        now = datetime.now(timezone.utc)
        last_sent = existing_otp["last_sent_at"].replace(tzinfo=timezone.utc)
        elapsed = (now - last_sent).total_seconds()
        if elapsed < 60:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail=f"Please wait {int(60 - elapsed)} seconds before requesting another code.",
            )

    # 3. Generate OTP and hash password
    otp = generate_otp()
    hashed = hash_password(password)

    # 4. Create document
    otp_doc = create_otp_document(
        name=name,
        email=email_clean,
        hashed_password=hashed,
        otp=otp,
        role=role,
    )

    # 5. Upsert OTP document
    await db[OTP_COLLECTION].replace_one(
        {"email": email_clean},
        otp_doc,
        upsert=True,
    )

    # 6. Send email (async to avoid blocking)
    try:
        from app.services.email_service import send_verification_email
        await send_verification_email(email_clean, name, otp)
    except Exception as exc:
        logger.error("Failed to send verification email during signup: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to send verification email: {str(exc)}",
        ) from exc

    return {"message": "Verification OTP sent successfully."}


async def verify_otp_code(
    db: AsyncIOMotorDatabase,
    email: str,
    otp_code: str,
) -> dict:
    """
    Validate the OTP, create the user, and return a JWT access token.

    Handles attempts tracking (max 5), expiry, user duplication, and OTP cleanup.
    """
    email_clean = email.lower().strip()
    otp_record = await db[OTP_COLLECTION].find_one({"email": email_clean})

    if not otp_record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Verification record not found. Please sign up again.",
        )

    now = datetime.now(timezone.utc)

    # 1. Check attempts
    if otp_record["attempts"] >= 5:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many failed verification attempts. Please register again.",
        )

    # 2. Check expiry
    expires_at = otp_record["expires_at"].replace(tzinfo=timezone.utc)
    if now > expires_at:
        raise HTTPException(
            status_code=status.HTTP_410_GONE,
            detail="The verification code has expired. Please request a new OTP.",
        )

    # 3. Check OTP matching
    if otp_record["otp"] != otp_code:
        new_attempts = otp_record["attempts"] + 1
        await db[OTP_COLLECTION].update_one(
            {"email": email_clean},
            {"$set": {"attempts": new_attempts}}
        )
        if new_attempts >= 5:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Too many failed verification attempts. Please register again.",
            )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid verification code. {5 - new_attempts} attempts remaining.",
        )

    # 4. Valid OTP → Create user account
    if await check_existing_user(db, email_clean):
        # Clean up OTP record anyway
        await db[OTP_COLLECTION].delete_one({"email": email_clean})
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A user with this email already exists.",
        )

    # Insert user
    user_doc = create_user_document(
        name=otp_record["name"],
        email=otp_record["email"],
        hashed_password=otp_record["password"],
        role=otp_record.get("role", "student"),
    )
    user_doc["created_at"] = otp_record.get("created_at", now)
    user_doc["updated_at"] = now

    result = await db[USERS_COLLECTION].insert_one(user_doc)
    user_doc["_id"] = result.inserted_id

    # 5. Delete OTP record
    await db[OTP_COLLECTION].delete_one({"email": email_clean})

    # 6. Generate JWT token
    access_token = create_access_token(
        data={"sub": user_doc["email"], "role": user_doc.get("role", "student")}
    )

    # Trigger background cleanup of other expired OTPs
    asyncio.create_task(cleanup_expired_otps(db))

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user_document_to_response(user_doc),
    }


async def resend_otp_code(
    db: AsyncIOMotorDatabase,
    email: str,
) -> dict:
    """
    Regenerate the OTP and reset expiry for an existing verification record.
    """
    email_clean = email.lower().strip()
    otp_record = await db[OTP_COLLECTION].find_one({"email": email_clean})

    if not otp_record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Verification record not found. Please sign up first.",
        )

    now = datetime.now(timezone.utc)
    last_sent = otp_record["last_sent_at"].replace(tzinfo=timezone.utc)
    elapsed = (now - last_sent).total_seconds()

    if elapsed < 60:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=f"Please wait {int(60 - elapsed)} seconds before requesting another code.",
        )

    # Generate new OTP
    otp = generate_otp()
    expiry = now + timedelta(minutes=5)

    # Update OTP record
    await db[OTP_COLLECTION].update_one(
        {"email": email_clean},
        {
            "$set": {
                "otp": otp,
                "attempts": 0,
                "expires_at": expiry,
                "last_sent_at": now,
            }
        }
    )

    # Send new email
    try:
        from app.services.email_service import send_verification_email
        await send_verification_email(email_clean, otp_record["name"], otp)
    except Exception as exc:
        logger.error("Failed to resend verification email: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to resend verification email: {str(exc)}",
        ) from exc

    return {"message": "Verification OTP resent successfully."}
