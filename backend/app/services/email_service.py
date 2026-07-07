"""
PaperMind AI - Email Service

Handles sending transactional emails via SMTP.
Runs synchronous SMTP connections in a background thread to prevent
blocking the FastAPI async event loop.
"""

import asyncio
import logging
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from app.core.config import settings

logger = logging.getLogger(__name__)


def _send_smtp_email(to_email: str, subject: str, text_body: str, html_body: str) -> None:
    """
    Synchronous helper to connect to SMTP, authenticate, and send the email.
    Should be run in a separate thread.
    """
    message = MIMEMultipart("alternative")
    message["Subject"] = subject
    message["From"] = f"PaperMind AI <{settings.SMTP_EMAIL}>"
    message["To"] = to_email

    # Attach both text and HTML versions
    part1 = MIMEText(text_body, "plain")
    part2 = MIMEText(html_body, "html")
    message.attach(part1)
    message.attach(part2)

    try:
        # Connect to SMTP server using TLS
        with smtplib.SMTP(settings.SMTP_SERVER, settings.SMTP_PORT, timeout=10) as server:
            server.starttls()
            server.login(settings.SMTP_EMAIL, settings.SMTP_APP_PASSWORD)
            server.sendmail(settings.SMTP_EMAIL, to_email, message.as_string())
        logger.info("Email sent successfully to %s", to_email)
    except Exception as exc:
        logger.error("Failed to send SMTP email to %s: %s", to_email, exc)
        raise RuntimeError(f"Email delivery failed: {exc}") from exc


async def send_verification_email(email: str, name: str, otp: str) -> None:
    """
    Dispatch an OTP verification email to the user.

    Uses asyncio.to_thread to run smtplib in a background thread pool.
    """
    subject = "PaperMind AI Verification Code"

    # Exact plain-text fallback format requested
    text_body = (
        f"Hello {name},\n\n"
        "Welcome to PaperMind AI.\n\n"
        "Your verification code is:\n\n"
        f"{otp}\n\n"
        "This code will expire in 5 minutes.\n\n"
        "If you did not request this verification, simply ignore this email.\n\n"
        "Regards,\n"
        "PaperMind AI Team"
    )

    # Sleek dark/blue professional HTML body
    html_body = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            body {{
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                background-color: #09090b;
                color: #e4e4e7;
                margin: 0;
                padding: 0;
            }}
            .container {{
                max-width: 600px;
                margin: 40px auto;
                background-color: #18181b;
                border: 1px border #27272a;
                border-radius: 16px;
                padding: 40px;
                box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.5);
            }}
            .header {{
                text-align: center;
                margin-bottom: 30px;
            }}
            .logo {{
                font-size: 24px;
                font-weight: bold;
                color: #ffffff;
            }}
            .logo-blue {{
                color: #2563eb;
            }}
            .content {{
                line-height: 1.6;
                font-size: 16px;
                color: #d4d4d8;
            }}
            .code-box {{
                background-color: #09090b;
                border: 1px solid #27272a;
                border-radius: 12px;
                padding: 24px;
                text-align: center;
                margin: 30px 0;
            }}
            .otp-code {{
                font-size: 36px;
                font-weight: 800;
                letter-spacing: 6px;
                color: #3b82f6;
                font-family: monospace;
            }}
            .footer {{
                margin-top: 40px;
                border-top: 1px solid #27272a;
                padding-top: 20px;
                font-size: 12px;
                color: #71717a;
                text-align: center;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">PaperMind<span class="logo-blue">.ai</span></div>
            </div>
            <div class="content">
                <p>Hello <strong>{name}</strong>,</p>
                <p>Welcome to PaperMind AI.</p>
                <p>Use the following verification code to complete your registration:</p>
                <div class="code-box">
                    <div class="otp-code">{otp}</div>
                </div>
                <p>This code is valid for <strong>5 minutes</strong> and can only be used once.</p>
                <p style="font-size: 14px; color: #71717a;">If you did not request this verification, simply ignore this email.</p>
            </div>
            <div class="footer">
                <p>Regards,<br><strong>PaperMind AI Team</strong></p>
                <p style="font-size: 10px; margin-top: 20px;">&copy; 2026 PaperMind.ai. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    """

    # Run blocking SMTP code in thread pool
    await asyncio.to_thread(
        _send_smtp_email,
        to_email=email,
        subject=subject,
        text_body=text_body,
        html_body=html_body,
    )
