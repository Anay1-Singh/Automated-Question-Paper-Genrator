# PaperMind AI - Backend API

The core backend service for PaperMind AI. This API handles authentication, document processing, AI-driven question generation, and role management. Built with FastAPI and powered by MongoDB Atlas.

## Tech Stack

- FastAPI (Python 3.12+)
- Uvicorn (ASGI Web Server)
- MongoDB Atlas (Motor Asyncio)
- bcrypt (Password Hashing)
- PyJWT (JWT Session Tokens)
- SMTP (Email OTP Verification)

## Features

- **Asynchronous Architecture**: Fully async API endpoints ensuring high performance.
- **Secure Authentication**: Email OTP verification for signups, bcrypt password hashing, and JWT-based session management.
- **Role-Based Access Control (RBAC)**: Distinct permissions for Admin (Teacher) and Student users.
- **Database Integration**: Seamless integration with MongoDB Atlas for storing users, documents, and generated papers.
- **API Documentation**: Automatic Swagger/ReDoc OpenAPI schema generation.

## Configuration

Create a `.env` file in the root of the `backend` directory with the following variables:

```env
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/papermind
DATABASE_NAME=papermind
SECRET_KEY=your-secure-secret-key
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
FROM_EMAIL=your-email@gmail.com
```

## Installation and Setup

1. **Create Virtual Environment**:
   ```bash
   python -m venv .venv
   ```

2. **Activate Virtual Environment**:
   - Windows:
     ```bash
     .\.venv\Scripts\Activate.ps1
     ```
   - macOS / Linux:
     ```bash
     source .venv/bin/activate
     ```

3. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Run Development Server**:
   ```bash
   uvicorn app.main:app --reload
   ```
   The API will be available at `http://127.0.0.1:8000`.

## API Documentation

Once the server is running, you can access the interactive API documentation:
- **Swagger UI**: `http://127.0.0.1:8000/docs`
- **ReDoc**: `http://127.0.0.1:8000/redoc`
