# 🧠 PaperMind AI — Backend

> AI-Powered Question Paper Generator using Bloom's Taxonomy.

Production-grade FastAPI backend designed with clean architecture, async MongoDB connectivity, and a modular folder structure ready for authentication, AI-driven question generation, and document processing.

---

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Tech Stack](#-tech-stack)
- [Folder Structure](#-folder-structure)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [MongoDB Atlas Setup](#-mongodb-atlas-setup)
- [Running the Server](#-running-the-server)
- [API Endpoints](#-api-endpoints)
- [Architecture Decisions](#-architecture-decisions)
- [Future Roadmap](#-future-roadmap)

---

## 🚀 Project Overview

PaperMind AI automates the creation of question papers aligned to **Bloom's Taxonomy** cognitive levels (Remember, Understand, Apply, Analyze, Evaluate, Create). Educators can upload syllabus documents and instantly generate balanced, taxonomy-mapped assessments.

This repository contains the **backend API** built with FastAPI and MongoDB Atlas.

---

## 🛠 Tech Stack

| Layer            | Technology                        |
| ---------------- | --------------------------------- |
| Framework        | FastAPI                           |
| Language         | Python 3.12+                      |
| Database         | MongoDB Atlas                     |
| Async DB Driver  | Motor (AsyncIOMotorClient)        |
| Sync DB Driver   | PyMongo (utilities & migrations)  |
| Auth (prepared)  | JWT (python-jose) + bcrypt        |
| Config           | Pydantic Settings + python-dotenv |
| Deployment       | Render                            |

---

## 📁 Folder Structure

```
backend/
├── app/
│   ├── api/            # Route handlers (feature-based routers)
│   ├── core/           # App-wide configuration (settings, security)
│   │   ├── __init__.py
│   │   └── config.py   # Pydantic Settings — loads .env
│   ├── database/       # Database connection & helpers
│   │   ├── __init__.py
│   │   └── mongodb.py  # Motor async connection manager
│   ├── middleware/      # Custom middleware (rate-limiting, logging, etc.)
│   ├── models/          # MongoDB document models (ODM-style)
│   ├── schemas/         # Pydantic request / response schemas
│   ├── services/        # Business logic layer
│   ├── utils/           # Shared helper functions
│   ├── __init__.py
│   └── main.py          # FastAPI app factory & lifespan
│
├── .env.example         # Environment variable template
├── .gitignore           # Git ignore rules
├── requirements.txt     # Python dependencies
└── README.md            # This file
```

---

## ⚙ Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd "Automated Question Paper Genrator Using Blooms Taxonomy/backend"
```

### 2. Create a virtual environment

```bash
python -m venv .venv
```

### 3. Activate the virtual environment

**Windows (PowerShell):**
```powershell
.\.venv\Scripts\Activate.ps1
```

**macOS / Linux:**
```bash
source .venv/bin/activate
```

### 4. Install dependencies

```bash
pip install -r requirements.txt
```

---

## 🔐 Environment Variables

Copy the example file and fill in your values:

```bash
cp .env.example .env
```

| Variable                      | Description                              | Default               |
| ----------------------------- | ---------------------------------------- | --------------------- |
| `MONGODB_URI`                 | MongoDB Atlas connection string          | *(required)*          |
| `DATABASE_NAME`               | MongoDB database name                    | `papermind`           |
| `JWT_SECRET`                  | Secret key for JWT token signing         | *(required)*          |
| `JWT_ALGORITHM`               | JWT signing algorithm                    | `HS256`               |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Token expiry in minutes                  | `60`                  |
| `CORS_ORIGINS`                | Allowed frontend origins (comma-separated) | `http://localhost:5173` |
| `UPLOAD_DIRECTORY`            | File upload storage path                 | `uploads`             |

---

## 🌐 MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/) and create a free cluster.
2. Create a database user with **read/write** privileges.
3. Whitelist your IP address (or use `0.0.0.0/0` for development).
4. Get your connection string — it looks like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Paste the connection string into your `.env` file as `MONGODB_URI`.

---

## 🏃 Running the Server

```bash
uvicorn app.main:app --reload
```

The server will start at **http://localhost:8000**.

| URL                        | Description        |
| -------------------------- | ------------------ |
| `http://localhost:8000`     | Root status        |
| `http://localhost:8000/docs`   | Swagger UI      |
| `http://localhost:8000/redoc`  | ReDoc UI        |
| `http://localhost:8000/health` | Health check    |
| `http://localhost:8000/db-test`| DB connectivity |

---

## 📡 API Endpoints

### Status & Health

| Method | Endpoint   | Description                  | Response |
| ------ | ---------- | ---------------------------- | -------- |
| GET    | `/`        | API running confirmation     | `200`    |
| GET    | `/health`  | Lightweight health check     | `200`    |
| GET    | `/db-test` | MongoDB Atlas ping test      | `200` / `503` |

---

## 🏗 Architecture Decisions

### Why Motor instead of PyMongo?

FastAPI is an **async** framework built on Starlette and ASGI. Using a synchronous database driver (PyMongo) inside async route handlers would block the event loop, killing concurrency. **Motor** wraps PyMongo in a non-blocking async interface, ensuring database operations never stall request processing.

### Why Pydantic Settings?

Environment variables are validated at startup with full type coercion. If `MONGODB_URI` is missing, the application fails fast with a clear error — no silent `None` values leaking into production.

### Why Lifespan instead of `@app.on_event`?

FastAPI's `on_event("startup")` and `on_event("shutdown")` decorators are **deprecated** in favour of the `lifespan` async context manager. The lifespan approach is cleaner, supports shared state via the yielded context, and is the officially recommended pattern.

---

## 🗺 Future Roadmap

- [ ] **Authentication** — JWT-based signup, login, and protected routes.
- [ ] **User Management** — MongoDB Users collection with bcrypt-hashed passwords.
- [ ] **Document Upload** — PDF/DOCX upload, text extraction, and storage.
- [ ] **AI Question Generation** — LLM-powered generation mapped to Bloom's Taxonomy levels.
- [ ] **Question Paper Builder** — Customisable templates with marks, sections, and time allocation.
- [ ] **Analytics Dashboard** — Bloom's level distribution charts and usage statistics.
- [ ] **Rate Limiting & Security** — Request throttling, input sanitisation, and OWASP best practices.
- [ ] **Deployment** — Render deployment with CI/CD pipeline.

---

## 📄 License

This project is part of the **PaperMind AI** platform.

---

*Built with ❤️ using FastAPI, MongoDB Atlas, and Python.*
