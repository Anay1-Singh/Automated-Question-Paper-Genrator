"""
PaperMind AI - Authentication Schemas

Pydantic v2 models for request validation and response serialisation
across all authentication endpoints.
"""

from datetime import datetime

from pydantic import BaseModel, EmailStr, Field


# =====================================================
# Request Schemas
# =====================================================

class SignupRequest(BaseModel):
    """Schema for the ``POST /api/auth/signup`` request body."""

    name: str = Field(
        ...,
        min_length=3,
        max_length=100,
        description="User's display name.",
        examples=["John Doe"],
    )
    email: EmailStr = Field(
        ...,
        description="User's email address.",
        examples=["john@example.com"],
    )
    password: str = Field(
        ...,
        min_length=8,
        description="Password (minimum 8 characters).",
        examples=["SecureP@ss1"],
    )
    role: str = Field(
        default="student",
        description="User's role (admin or student).",
        examples=["student", "admin"],
    )


class LoginRequest(BaseModel):
    """Schema for the ``POST /api/auth/login`` request body."""

    email: EmailStr = Field(
        ...,
        description="Registered email address.",
        examples=["john@example.com"],
    )
    password: str = Field(
        ...,
        min_length=8,
        description="Account password.",
        examples=["SecureP@ss1"],
    )


# =====================================================
# Response Schemas
# =====================================================

class UserResponse(BaseModel):
    """Sanitised user data returned in API responses (no password)."""

    id: str = Field(..., description="MongoDB document ID.")
    name: str = Field(..., description="User's display name.")
    email: str = Field(..., description="User's email address.")
    role: str = Field(default="student", description="User's role.")
    created_at: str = Field(..., description="ISO-8601 creation timestamp.")
    updated_at: str = Field(..., description="ISO-8601 last-update timestamp.")


class TokenResponse(BaseModel):
    """Response schema for the ``POST /api/auth/login`` endpoint."""

    access_token: str = Field(..., description="JWT access token.")
    token_type: str = Field(default="bearer", description="Token type.")
    user: UserResponse = Field(..., description="Authenticated user details.")


class SignupResponse(BaseModel):
    """Response schema for the ``POST /api/auth/signup`` endpoint."""

    message: str = Field(..., description="Success message.")
    user: UserResponse = Field(..., description="Newly created user details.")


# =====================================================
# OTP Schemas
# =====================================================

class VerifyOtpRequest(BaseModel):
    """Schema for the ``POST /api/auth/verify-otp`` request body."""

    email: EmailStr = Field(
        ...,
        description="Registered email address.",
        examples=["john@example.com"],
    )
    otp: str = Field(
        ...,
        min_length=6,
        max_length=6,
        pattern=r"^\d{6}$",
        description="Six-digit numeric OTP code.",
        examples=["123456"],
    )


class ResendOtpRequest(BaseModel):
    """Schema for the ``POST /api/auth/resend-otp`` request body."""

    email: EmailStr = Field(
        ...,
        description="Registered email address.",
        examples=["john@example.com"],
    )


class MessageResponse(BaseModel):
    """Generic message response schema."""

    message: str = Field(..., description="Details of the operation result.")

