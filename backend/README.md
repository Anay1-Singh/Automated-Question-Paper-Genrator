# PaperMind AI — Backend API

> AI-powered Question Paper Generation Platform using Bloom's Taxonomy.

---

## Tech Stack

| Layer         | Technology                       |
|---------------|----------------------------------|
| Framework     | FastAPI                          |
| Server        | Uvicorn                          |
| Database      | PostgreSQL + SQLAlchemy 2.x      |
| Migrations    | Alembic                          |
| Config        | Pydantic Settings + dotenv       |
| Language      | Python 3.12+                     |

---

## Quick Start

### 1. Install PostgreSQL

Download and install PostgreSQL from [postgresql.org](https://www.postgresql.org/download/).

During installation, set a password for the `postgres` user (default: `password`).

### 2. Create the Database

Open **pgAdmin** or use `psql`:

```sql
CREATE DATABASE papermind;
```

### 3. Create a Virtual Environment

```bash
cd backend
python -m venv .venv
```

### 4. Activate the Virtual Environment

**Windows (PowerShell)**
```powershell
.\.venv\Scripts\Activate.ps1
```

**macOS / Linux**
```bash
source .venv/bin/activate
```

### 5. Install Dependencies

```bash
pip install -r requirements.txt
```

### 6. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your PostgreSQL credentials:

```env
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/papermind
```

### 7. Run the Development Server

```bash
uvicorn app.main:app --reload
```

The API will be available at **http://127.0.0.1:8000**.

### 8. Verify Database Connection

Visit **http://127.0.0.1:8000/db-test** — you should see:

```json
{"database": "connected"}
```

---

## Alembic Migrations

Alembic is configured and ready. When ORM models are added:

```bash
# Generate a new migration
alembic revision --autogenerate -m "description of change"

# Apply all pending migrations
alembic upgrade head

# Rollback one migration
alembic downgrade -1

# View migration history
alembic history
```

---

## API Endpoints

| Method | Path       | Description                       |
|--------|------------|-----------------------------------|
| GET    | `/`        | Welcome message                   |
| GET    | `/health`  | Health check                      |
| GET    | `/db-test` | Database connection verification  |
| GET    | `/docs`    | Swagger UI (interactive docs)     |
| GET    | `/redoc`   | ReDoc (alternative docs)          |

---

## Project Structure

```
backend/
│
├── app/
│   ├── api/            # Route handlers (auth, users, documents, papers)
│   ├── core/           # Configuration and shared settings
│   │   └── config.py   # Pydantic Settings — reads .env
│   ├── database/       # Database layer
│   │   ├── database.py # SQLAlchemy engine + session factory
│   │   ├── base.py     # Declarative Base for ORM models
│   │   └── session.py  # get_db() FastAPI dependency
│   ├── middleware/      # Custom middleware (logging, rate-limit)
│   ├── models/         # SQLAlchemy ORM models
│   ├── schemas/        # Pydantic request / response schemas
│   ├── services/       # Business logic (PDF parser, Bloom classifier)
│   ├── utils/          # Helpers (validators, formatters)
│   ├── __init__.py
│   └── main.py         # FastAPI application entry point
│
├── alembic/            # Alembic migration environment
│   ├── versions/       # Migration scripts
│   └── env.py          # Alembic config (reads DATABASE_URL)
│
├── tests/              # Pytest test suite
│
├── alembic.ini         # Alembic configuration
├── .env                # Local environment variables (git-ignored)
├── .env.example        # Template for .env
├── .gitignore
├── requirements.txt
└── README.md           # This file
```

---

## Future Roadmap

- **Authentication** — JWT-based login, signup, password reset
- **User Model** — ORM model with Alembic migration
- **Document Processing** — PDF/DOCX upload, parsing, topic extraction
- **Question Generation** — NLP pipeline (spaCy + Transformers) mapped to Bloom's Taxonomy
- **Analytics** — Cognitive distribution, difficulty calibration, compliance scoring
- **Export** — LaTeX, PDF, and DOCX question paper rendering

---

## License

Internal project — Delhi Technological University.
