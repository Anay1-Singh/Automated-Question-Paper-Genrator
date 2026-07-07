"""
PaperMind AI - MongoDB Connection Manager

Manages the async MongoDB connection lifecycle using Motor (AsyncIOMotorClient).
Provides helper functions to connect, disconnect, and retrieve the database instance.
"""

import logging

from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase

from app.core.config import settings

logger = logging.getLogger(__name__)

# =====================================================
# Module-level state for the MongoDB client & database.
# These are populated on application startup via lifespan.
# =====================================================

_client: AsyncIOMotorClient | None = None
_database: AsyncIOMotorDatabase | None = None


async def connect_to_mongo() -> None:
    """
    Initialise the Motor async client and verify connectivity
    by issuing a ping command to MongoDB Atlas.

    Raises:
        ConnectionError: If the ping to MongoDB Atlas fails.
    """
    global _client, _database

    logger.info("Connecting to MongoDB Atlas...")

    _client = AsyncIOMotorClient(
        settings.MONGODB_URI,
        serverSelectionTimeoutMS=5000,
    )

    # Verify the connection is live.
    try:
        await _client.admin.command("ping")
        logger.info("Successfully connected to MongoDB Atlas.")
    except Exception as exc:
        logger.error("Failed to connect to MongoDB Atlas: %s", exc)
        raise ConnectionError(
            f"Could not connect to MongoDB Atlas: {exc}"
        ) from exc

    _database = _client[settings.DATABASE_NAME]
    logger.info("Using database: %s", settings.DATABASE_NAME)


async def close_mongo() -> None:
    """
    Gracefully close the Motor client connection.
    """
    global _client, _database

    if _client is not None:
        _client.close()
        logger.info("MongoDB connection closed.")

    _client = None
    _database = None


def get_database() -> AsyncIOMotorDatabase:
    """
    Return the current database instance.

    This function is intended to be used as a FastAPI dependency
    so that route handlers receive the database without importing
    module-level state directly.

    Returns:
        The AsyncIOMotorDatabase instance for the configured database.

    Raises:
        RuntimeError: If called before the connection has been established.
    """
    if _database is None:
        raise RuntimeError(
            "Database is not initialised. "
            "Ensure connect_to_mongo() has been called during app startup."
        )
    return _database
