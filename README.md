# PaperMind AI - AI-Powered Question Paper Generator

PaperMind AI is a production-grade question paper generation platform. It automatically processes uploaded study materials to generate structured, balanced, and curriculum-aligned exam papers mapped against Bloom's Taxonomy cognitive dimensions and custom difficulty calibrations. It also features separate role-based dashboards for Teachers (Admin) and Students.

---

## Tech Stack

### Frontend
- React 18+ (Vite)
- JavaScript (JSX)
- Tailwind CSS
- React Router DOM
- Axios
- Lucide React (icons)

### Backend
- FastAPI (framework)
- Uvicorn (application server)
- MongoDB Atlas (Motor Asyncio)
- bcrypt (password hashing)
- PyJWT (JWT token generation and verification)
- Email (SMTP for OTP Verification)

---

## Features

### Role-Based Access System
- Two Distinct Roles: Admin (Teacher) and Student.
- Admin dashboard features an indigo/blue theme with access to document uploading, paper generation, and question banks.
- Student dashboard features a teal/emerald theme with access to study notes uploading, AI summaries, and study focus tools.
- Role selection during Signup.
- Development mode quick-login bypass for testing.

### Frontend Portal
- Landing Page: Clean SaaS landing page showcasing the application.
- Authentication Module: Signup and Login forms with Email OTP verification.
- Protected Routes: Guards dashboard routes from unauthenticated access using JWT stored in local storage.
- Interactive Dashboard: Collapsible navigation sidebar, responsive top navbar.
- Admin (Teacher) Tools:
  - Generate Paper: Advanced form for setting marks, difficulty distribution, Bloom's focus, and question types.
  - Question Bank: Detailed question cards with color-coded badges for difficulty and Bloom's level.
  - History: Data tables summarizing generated papers.
  - Analytics: Dashboards showing usage, difficulty distributions, and recent activity.
- Student Tools:
  - Upload Notes: Drag and drop interface for study materials.
  - My Summaries: AI-generated summaries of uploaded notes.
  - Important Topics: Key concepts extracted from study materials with vocabulary and a preview concept map.
  - Study Focus: Personalized study recommendations, prep time estimation, and revision tips.

### Backend API
- Database: MongoDB Atlas integration using Motor for async operations.
- Email OTP Verification: Account creation requires a secure 6-digit OTP sent via email.
- Password Hashing: Secure password encryption using bcrypt.
- JWT Session Tokens: Secure token creation and decoding via PyJWT containing user ID, email, and role.
- Authentication Controller: Signup, Login, Send OTP, Verify OTP, and user profile retrieval endpoints.

---

## Project Structure

Automated Question Paper Genrator Using Blooms Taxonomy/
  Frontend/
    src/
      components/
        admin/        # Admin-specific dashboard components
        student/      # Student-specific dashboard components
        auth/         # Login, Signup, VerifyOTP
        dashboard/    # Shared dashboard layout components
      pages/          # Main route pages (AdminDashboard, StudentDashboard, etc.)
      routes/         # AppRoutes routing managers and RoleGuard
      utils/          # API request client (Axios)
      App.jsx
      main.jsx
    package.json
    vite.config.js

  backend/
    app/
      api/            # API routers and endpoints
      core/           # Configuration settings and security
      database/       # MongoDB connection management
      models/         # Database models (User, OTP, Document)
      schemas/        # Pydantic schema validation structures
      services/       # Business logic (Auth, Email, Documents)
      __init__.py
      main.py         # FastAPI startup and route registration
    requirements.txt
    README.md         # Backend-specific instructions

  README.md           # This file

---

## Installation and Setup

### Prerequisites
- Node.js (v18+)
- Python (v3.12+)
- MongoDB Atlas cluster (or local MongoDB)
- SMTP Email credentials for OTP

---

### Backend Setup

1. Navigate to the backend folder:
   cd backend

2. Create and activate a Python virtual environment:
   python -m venv .venv
   # Windows (PowerShell)
   .\.venv\Scripts\Activate.ps1
   # macOS/Linux
   source .venv/bin/activate

3. Install required packages:
   pip install -r requirements.txt

4. Create your local environment configuration file:
   cp .env.example .env

5. Open .env and set your active MongoDB database URL, JWT Secret, and Email Settings:
   MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/papermind
   DATABASE_NAME=papermind
   SECRET_KEY=your-secure-secret-key
   SMTP_SERVER=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USERNAME=your-email@gmail.com
   SMTP_PASSWORD=your-app-password
   FROM_EMAIL=your-email@gmail.com

6. Run the development server:
   uvicorn app.main:app --reload

The backend API will run on http://127.0.0.1:8000. Interactive Swagger docs can be accessed at http://127.0.0.1:8000/docs.

---

### Frontend Setup

1. Navigate to the Frontend folder:
   cd ../Frontend

2. Install npm dependencies:
   npm install

3. Start the Vite local server:
   npm run dev

The frontend portal will start on http://localhost:5173.

---

## API Endpoints

| Method | Endpoint | Authorization | Description |
|--------|----------|---------------|-------------|
| GET    | / | Public | Root welcome JSON |
| POST   | /api/v1/auth/send-otp | Public | Sends OTP to email for signup |
| POST   | /api/v1/auth/verify-otp | Public | Verifies OTP and creates user |
| POST   | /api/v1/auth/login | Public | User login, returns JWT token |
| GET    | /api/v1/auth/me | Bearer Token | Retrieves profile details of the current user |
