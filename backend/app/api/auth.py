"""
PaperMind AI - Authentication Routes

Provides ``POST /api/auth/signup`` and ``POST /api/auth/login`` endpoints.
All business logic is delegated to :mod:`app.services.auth_service`.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.security import decode_access_token
from app.database.mongodb import get_database
from app.models.user import user_document_to_response
from app.schemas.auth import (
    LoginRequest,
    SignupRequest,
    TokenResponse,
    UserResponse,
    VerifyOtpRequest,
    ResendOtpRequest,
    MessageResponse,
)
from app.services.auth_service import (
    get_user_by_email,
    login_user,
    register_user,
    send_otp_code,
    verify_otp_code,
    resend_otp_code,
)

router = APIRouter(
    prefix="/api/auth",
    tags=["Authentication"],
)


# =====================================================
# POST /api/auth/signup & POST /api/auth/send-otp
# =====================================================

@router.post(
    "/signup",
    response_model=MessageResponse,
    status_code=200,
    summary="Register a new user (Initiates OTP verification)",
    description=(
        "Validates signup details and triggers sending a 6-digit OTP verification code. "
        "Returns 200 on success, or 409 if the email is already registered."
    ),
    responses={
        200: {
            "description": "Verification OTP sent successfully.",
            "content": {
                "application/json": {
                    "example": {
                        "message": "Verification OTP sent successfully."
                    }
                }
            },
        },
        409: {
            "description": "Email already registered.",
            "content": {
                "application/json": {
                    "example": {
                        "detail": "A user with this email already exists."
                    }
                }
            },
        },
    },
)
async def signup(
    payload: SignupRequest,
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> MessageResponse:
    """Initiate registration flow and send verification OTP."""
    result = await send_otp_code(
        db=db,
        name=payload.name,
        email=payload.email,
        password=payload.password,
        role=payload.role,
    )
    return MessageResponse(**result)


@router.post(
    "/send-otp",
    response_model=MessageResponse,
    status_code=200,
    summary="Send verification OTP",
    description="Generates and sends a new verification OTP to the user's email.",
    responses={
        200: {
            "description": "Verification OTP sent successfully.",
            "content": {
                "application/json": {
                    "example": {
                        "message": "Verification OTP sent successfully."
                    }
                }
            },
        },
        409: {
            "description": "Email already registered.",
            "content": {
                "application/json": {
                    "example": {
                        "detail": "A user with this email already exists."
                    }
                }
            },
        },
    },
)
async def send_otp(
    payload: SignupRequest,
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> MessageResponse:
    """Send a verification OTP to the user's email address."""
    result = await send_otp_code(
        db=db,
        name=payload.name,
        email=payload.email,
        password=payload.password,
        role=payload.role,
    )
    return MessageResponse(**result)


# =====================================================
# POST /api/auth/login
# =====================================================

@router.post(
    "/login",
    response_model=TokenResponse,
    summary="Login and obtain a JWT token",
    description=(
        "Authenticates a user with email and password. "
        "Returns a JWT access token on success, "
        "or 401 if credentials are invalid."
    ),
    responses={
        200: {
            "description": "Login successful.",
            "content": {
                "application/json": {
                    "example": {
                        "access_token": "eyJhbGciOiJIUzI1NiIs...",
                        "token_type": "bearer",
                        "user": {
                            "id": "668f1a2b3c4d5e6f7a8b9c0d",
                            "name": "John Doe",
                            "email": "john@example.com",
                            "created_at": "2026-07-04T15:30:00+00:00",
                            "updated_at": "2026-07-04T15:30:00+00:00",
                        },
                    }
                }
            },
        },
        401: {
            "description": "Invalid credentials.",
            "content": {
                "application/json": {
                    "example": {
                        "detail": "Invalid email or password."
                    }
                }
            },
        },
    },
)
async def login(
    payload: LoginRequest,
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> TokenResponse:
    """Authenticate a user and return a JWT access token."""
    result = await login_user(
        db=db,
        email=payload.email,
        password=payload.password,
    )

    return TokenResponse(**result)


# =====================================================
# Security Dependencies
# =====================================================

security_scheme = HTTPBearer(auto_error=False)


async def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(security_scheme),
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> dict:
    """
    Dependency to validate the JWT token in the Authorization header
    and return the corresponding user document from the database.
    """
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated. Missing token.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    token = credentials.credentials
    payload = decode_access_token(token)
    if not payload or "sub" not in payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token.",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    email = payload["sub"]
    user = await get_user_by_email(db, email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found.",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    return user_document_to_response(user)


# =====================================================
# GET /api/auth/me
# =====================================================

@router.get(
    "/me",
    response_model=UserResponse,
    summary="Get current user details",
    description="Decodes the JWT token and returns the current user profile.",
    responses={
        200: {
            "description": "User details retrieved successfully.",
            "content": {
                "application/json": {
                    "example": {
                        "id": "668f1a2b3c4d5e6f7a8b9c0d",
                        "name": "John Doe",
                        "email": "john@example.com",
                        "created_at": "2026-07-04T15:30:00+00:00",
                        "updated_at": "2026-07-04T15:30:00+00:00",
                    }
                }
            },
        },
        401: {
            "description": "Missing, invalid, or expired token.",
            "content": {
                "application/json": {
                    "example": {
                        "detail": "Invalid or expired token."
                    }
                }
            },
        },
    },
)
async def get_me(
    current_user: dict = Depends(get_current_user),
) -> dict:
    """Returns the details of the currently authenticated user."""
    return current_user


# =====================================================
# POST /api/auth/verify-otp
# =====================================================

@router.post(
    "/verify-otp",
    response_model=TokenResponse,
    summary="Verify registration OTP",
    description=(
        "Verifies the 6-digit OTP code sent to the email. "
        "On success, creates the user account in MongoDB and returns a JWT access token."
    ),
    responses={
        200: {
            "description": "OTP verified successfully. Account created.",
            "content": {
                "application/json": {
                    "example": {
                        "access_token": "eyJhbGciOiJIUzI1NiIs...",
                        "token_type": "bearer",
                        "user": {
                            "id": "668f1a2b3c4d5e6f7a8b9c0d",
                            "name": "John Doe",
                            "email": "john@example.com",
                            "created_at": "2026-07-04T15:30:00+00:00",
                            "updated_at": "2026-07-04T15:30:00+00:00",
                        },
                    }
                }
            },
        },
        400: {
            "description": "Invalid OTP code.",
            "content": {
                "application/json": {
                    "example": {
                        "detail": "Invalid verification code. 4 attempts remaining."
                    }
                }
            },
        },
        404: {
            "description": "Verification record not found.",
            "content": {
                "application/json": {
                    "example": {
                        "detail": "Verification record not found. Please sign up again."
                    }
                }
            },
        },
        410: {
            "description": "OTP expired.",
            "content": {
                "application/json": {
                    "example": {
                        "detail": "The verification code has expired. Please request a new OTP."
                    }
                }
            },
        },
        429: {
            "description": "Too many failed attempts.",
            "content": {
                "application/json": {
                    "example": {
                        "detail": "Too many failed verification attempts. Please register again."
                    }
                }
            },
        },
    },
)
async def verify_otp(
    payload: VerifyOtpRequest,
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> TokenResponse:
    """Verify registration OTP and activate user account."""
    result = await verify_otp_code(
        db=db,
        email=payload.email,
        otp_code=payload.otp,
    )
    return TokenResponse(**result)


# =====================================================
# POST /api/auth/resend-otp
# =====================================================

@router.post(
    "/resend-otp",
    response_model=MessageResponse,
    summary="Resend verification OTP",
    description="Regenerates and resends a verification OTP after checking the 60s cooldown.",
    responses={
        200: {
            "description": "Verification OTP resent successfully.",
            "content": {
                "application/json": {
                    "example": {
                        "message": "Verification OTP resent successfully."
                    }
                }
            },
        },
        429: {
            "description": "Resend requested before cooldown expired.",
            "content": {
                "application/json": {
                    "example": {
                        "detail": "Please wait 45 seconds before requesting another code."
                    }
                }
            },
        },
        404: {
            "description": "No active registration record found.",
            "content": {
                "application/json": {
                    "example": {
                        "detail": "Verification record not found. Please sign up first."
                    }
                }
            },
        },
    },
)
async def resend_otp(
    payload: ResendOtpRequest,
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> MessageResponse:
    """Resend a new verification OTP to the user."""
    result = await resend_otp_code(
        db=db,
        email=payload.email,
    )
    return MessageResponse(**result)
