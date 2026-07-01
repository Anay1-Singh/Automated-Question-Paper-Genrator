# PaperMind AI - AI-Powered Question Paper Generator

PaperMind AI is a university-level question paper generation platform. It automatically processes uploaded study materials (textbooks, notes, and syllabi) to generate structured, balanced, and curriculum-aligned exam papers mapped against Bloom's Taxonomy cognitive dimensions and custom difficulty calibrations.

---

## Tech Stack

### Frontend
- React 18+ (Vite)
- JavaScript (JSX)
- Tailwind CSS (v4)
- Framer Motion (animations)
- React Router DOM (routing and route guards)
- Lucide React (icons)

### Backend
- FastAPI (framework)
- Uvicorn (application server)
- PostgreSQL (database)
- SQLAlchemy 2.x (ORM)
- Alembic (database migrations)
- bcrypt (password hashing)
- PyJWT (JWT token generation and verification)

---

## Features

### Frontend Portal
- Landing Page: Clean SaaS landing page showcasing integration support for Blackboard Learn, Canvas LMS, Moodle LMS, D2L Brightspace, and QTI standard compliance.
- Authentication Module: Animated Signup and Login forms with form-level input validation and error feedback.
- Protected Routes: Guards the dashboard route from unauthenticated access using local storage token verification.
- Interactive Dashboard: Collapsible navigation sidebar, responsive top navbar, and user profile management.
- KPI Statistics: Dynamic count-ups for uploaded materials, generated question papers, and total question bank capacity.
- Data Visualizations: SVG-based concentric Bloom's Taxonomy compliance rings and animated vertical difficulty calibration bars (Easy, Medium, Hard).
- Material Management: Interactive document tables and generated blueprints displaying processing statuses, with simulated uploading and deletion.

### Backend API
- Database Session Lifecycle: FastAPI dependency injection providing connection sessions, with connection pool recycling (pre-ping) configured via SQLAlchemy.
- Password Hashing: Secure password encryption using bcrypt.
- JWT Session Tokens: Secure token creation and decoding via PyJWT.
- Authentication Controller: Signup, login, and user profile retrieval endpoints.
- Health Monitoring: lightweight health endpoints and automatic Swagger/ReDoc OpenAPI schema generation.

---

## Project Structure

```
Automated Question Paper Genrator Using Blooms Taxonomy/
│
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/           # Login, Signup, inputs, OAuth buttons
│   │   │   ├── dashboard/      # Sidebar, TopNavbar, Stats, Charts, Tables
│   │   │   └── ...             # Landing page components
│   │   ├── pages/              # Landing, Login, Signup, Dashboard pages
│   │   ├── routes/             # AppRoutes routing managers and ProtectedRoute
│   │   ├── utils/              # api.js API request client
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── app/
│   │   ├── api/                # API routers and endpoints
│   │   ├── core/               # Configuration settings class (Pydantic)
│   │   ├── database/           # Engine, declarative Base, session generators
│   │   ├── models/             # SQLAlchemy User model definitions
│   │   ├── schemas/            # Pydantic schema validation structures
│   │   ├── utils/              # security.py encryption and token helpers
│   │   ├── __init__.py
│   │   └── main.py             # FastAPI startup and route registration
│   ├── alembic/                # Database migrations revisions and env.py
│   ├── requirements.txt
│   ├── alembic.ini
│   └── README.md
│
└── README.md                   # This file
```

---

## Installation and Setup

### Prerequisites
- Node.js (v18+)
- Python (v3.12+)
- PostgreSQL server

---

### Backend Setup

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```

2. Create and activate a Python virtual environment:
   ```bash
   python -m venv .venv
   # Windows (PowerShell)
   .\.venv\Scripts\Activate.ps1
   # macOS/Linux
   source .venv/bin/activate
   ```

3. Install required packages:
   ```bash
   pip install -r requirements.txt
   ```

4. Create your local environment configuration file:
   ```bash
   cp .env.example .env
   ```

5. Open `.env` and set your active PostgreSQL database URL:
   ```env
   DATABASE_URL=postgresql://username:password@localhost:5432/papermind
   ```

6. Initialize and run database migrations to create the users table:
   ```bash
   alembic upgrade head
   ```

7. Run the development server:
   ```bash
   uvicorn app.main:app --reload
   ```

The backend API will run on http://127.0.0.1:8000. Interactive Swagger docs can be accessed at http://127.0.0.1:8000/docs.

---

### Frontend Setup

1. Navigate to the Frontend folder:
   ```bash
   cd ../Frontend
   ```

2. Install npm dependencies:
   ```bash
   npm install
   ```

3. Start the Vite local server:
   ```bash
   npm run dev
   ```

The frontend portal will start on http://localhost:5173.

---

## API Endpoints

| Method | Endpoint | Authorization | Description |
|--------|----------|---------------|-------------|
| GET    | `/` | Public | Root welcome JSON |
| GET    | `/health` | Public | API health check |
| GET    | `/db-test` | Public | Database connection check |
| POST   | `/api/v1/auth/signup` | Public | User signup |
| POST   | `/api/v1/auth/login` | Public | User login, returns JWT token |
| GET    | `/api/v1/auth/me` | Bearer Token | Retrieves profile details of the current user |
