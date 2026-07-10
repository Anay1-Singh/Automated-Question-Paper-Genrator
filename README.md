# PaperMind AI - AI-Powered Question Paper Generator

PaperMind AI is a professional, production-grade assessment generation platform. It automatically processes uploaded study materials, textbooks, and notes to generate structured, balanced, and curriculum-aligned examinations. These examinations are mapped directly against the cognitive dimensions of Bloom's Taxonomy and calibrated to custom difficulty distributions. The platform features role-based dashboards for Teachers and Students, alongside a hidden administrative role reserved for system management.

---

## Tech Stack

### Frontend
- React 18+ (Vite)
- JavaScript (JSX)
- Tailwind CSS
- React Router DOM
- Axios
- Lucide React

### Backend
- FastAPI (framework)
- Uvicorn (application server)
- MongoDB Atlas (database cluster accessed via Motor async driver)
- bcrypt (secure password hashing)
- PyJWT (JSON Web Token generation and validation)
- SMTP (email dispatch for OTP verification)
- Google Gemini API (official google-genai SDK for document intelligence)
- ReportLab (PDF template generation)

---

## Features

### Role-Based Access Control
- Public Roles: Distinct dashboards for Teachers and Students.
- Administrative Role: System admin accounts can be provisioned in MongoDB to access administrative statistics and diagnostic features.
- Dynamic Theming: The Teacher dashboard is styled with an indigo and blue palette, while the Student dashboard uses a teal and emerald theme.
- Route Protection: Protected routes verify JWT presence and decode the user role to guard against unauthorized access.
- Development Bypass: Quick login bypass options are available for testing in development environments.

### Document Processing Pipeline
- Text Extraction: Automated parsing and extraction of text from uploaded documents.
- Cleaning and Normalization: Advanced text normalization that preserves academic headings, removes page numbers, merges broken paragraph line-wraps, and eliminates recurring headers/footers.
- Multilingual Support: Automatic language detection using script and stopword signals to support English and Hindi documents.
- Sentence-Aware Chunking: Split documents into configurable context chunks (800 to 1200 words) while keeping paragraph and sentence boundaries intact.
- Cognitive Analysis: Extract keywords, key phrases, and high-level topics dynamically.
- Document Summarization: AI-generated summaries mapping the core context of the study material.

### AI Question Paper Generation
- Advanced Configuration: Form controls for setting total marks, question count, instructions, and target formats.
- Cognitive Calibration: Map exam questions to Bloom's Taxonomy levels (Remember, Understand, Apply, Analyze, Evaluate, Create).
- Difficulty Tuning: Allocate percentages for Easy, Medium, and Hard questions.
- Multiple Question Formats: Support for Multiple Choice Questions (MCQ), Short Answer, Long Answer, True/False, Fill in the Blank, and Case Studies.
- Individual Question Regeneration: Teachers can regenerate a single question from the source document context with custom instructions, without altering the rest of the generated paper.
- Question Bank and History: Retain generated questions in a searchable list with color-coded classification badges.

### Professional PDF Exporting
- Question Paper PDFs: Stream print-ready PDFs formatted with institutional headers, course codes, exam dates, instructions, duration, and correct marks alignment.
- Answer Key PDFs: Stream companion faculty-only PDFs displaying correct answers, rationales, Bloom's levels, difficulty classifications, and AI confidence scores.

### Student Study Tools
- Study Summaries: Retrieve AI-generated summaries of uploaded materials.
- Concept Mapping: View extracted key vocabularies, definitions, and concepts.
- Preparation Analytics: Receive preparation time estimations, study recommendations, and targeted revision tips.

---

## Project Structure

```
Automated Question Paper Genrator Using Blooms Taxonomy/
├── Frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── auth/            # Auth forms (Login, Signup, OTP)
│   │   │   ├── dashboard/       # Shared layout components
│   │   │   ├── student/         # Student-specific panels (Upload, Summaries, Focus)
│   │   │   ├── teacher/         # Teacher-specific panels (Generate, Question Bank, History, Analytics)
│   │   │   ├── CTA.jsx          # Call-to-action sections
│   │   │   ├── FAQ.jsx          # Frequently asked questions Accordion
│   │   │   ├── Features.jsx     # Landing page features grid
│   │   │   ├── Footer.jsx       # Landing page footer
│   │   │   ├── Hero.jsx         # Landing page hero header
│   │   │   ├── HowItWorks.jsx   # Visual steps guide
│   │   │   ├── Navbar.jsx       # Top navigation bar
│   │   │   ├── Pricing.jsx      # Pricing card layout
│   │   │   ├── Stats.jsx        # Platform metrics
│   │   │   └── Trusted.jsx      # Institutional trust badges
│   │   ├── pages/
│   │   │   ├── ForgotPassword.jsx
│   │   │   ├── Landing.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── StudentDashboard.jsx
│   │   │   ├── SystemAdminDashboard.jsx
│   │   │   ├── TeacherDashboard.jsx
│   │   │   └── VerifyOTP.jsx
│   │   ├── routes/
│   │   │   └── AppRoutes.jsx    # Application routing and RoleGuard
│   │   ├── utils/
│   │   │   └── api.js           # API request client and PDF downloader
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── app/
│   │   ├── api/                 # API routers and endpoints
│   │   │   ├── ai.py            # Diagnostic AI routes
│   │   │   ├── auth.py          # Authentication and profile endpoints
│   │   │   ├── documents.py     # Document management endpoints
│   │   │   └── papers.py        # Question paper endpoints
│   │   ├── core/                # System configuration and settings
│   │   │   └── config.py        # Pydantic settings loading from .env
│   │   ├── database/            # MongoDB client setup
│   │   │   └── mongodb.py       # Motor async connections
│   │   ├── models/              # Database record models
│   │   │   ├── document.py
│   │   │   ├── otp.py
│   │   │   ├── paper.py
│   │   │   └── user.py
│   │   ├── schemas/             # Pydantic request and response schemas
│   │   │   ├── auth.py
│   │   │   ├── document.py
│   │   │   └── paper_schema.py
│   │   ├── services/            # Core business logic handlers
│   │   │   ├── auth_service.py
│   │   │   ├── document_processing_service.py
│   │   │   ├── document_service.py
│   │   │   ├── email_service.py
│   │   │   ├── gemini_service.py
│   │   │   ├── paper_service.py
│   │   │   ├── pdf_service.py
│   │   │   └── prompts.py
│   │   ├── utils/
│   │   ├── main.py              # FastAPI entrypoint and lifespan management
│   │   └── __init__.py
│   ├── requirements.txt
│   └── .env.example
│
├── README.md
└── .gitignore
```

---

## API Endpoints

### Status and Diagnostics

| Method | Endpoint | Authorization | Description |
|:---|:---|:---|:---|
| GET | `/` | Public | Confirms that the backend API is running. |
| GET | `/health` | Public | Basic health status check for load balancers. |
| GET | `/db-test` | Public | Pings MongoDB Atlas to verify database connection. |
| GET | `/api/ai/health` | Public | Verifies connectivity to the Google Gemini API (Dev mode only). |

### Authentication and Accounts

| Method | Endpoint | Authorization | Description |
|:---|:---|:---|:---|
| POST | `/api/v1/auth/send-otp` | Public | Generates and sends a 6-digit verification code to the email. |
| POST | `/api/v1/auth/verify-otp` | Public | Verifies the OTP and provisions a new user account. |
| POST | `/api/v1/auth/login` | Public | Authenticates credentials and returns a signed JWT. |
| GET | `/api/v1/auth/me` | Bearer Token | Retrieves the active user profile data. |

### Document Management

| Method | Endpoint | Authorization | Description |
|:---|:---|:---|:---|
| POST | `/api/documents/upload` | Bearer Token | Uploads a syllabus or study notes file. Parses text, detects language, chunks the content, and extracts metadata. |
| GET | `/api/documents` | Bearer Token | Lists all uploaded documents owned by the active user. |
| GET | `/api/documents/{document_id}` | Bearer Token | Retrieves full details of a specific document. |
| GET | `/api/documents/{document_id}/summary` | Bearer Token | Retrieves the AI-generated summary of the document. |
| GET | `/api/documents/{document_id}/topics` | Bearer Token | Retrieves extracted topics and keywords. |
| GET | `/api/documents/{document_id}/statistics` | Bearer Token | Retrieves character, word, page, and paragraph counts. |
| DELETE | `/api/documents/{document_id}` | Bearer Token | Deletes a document record and its associated file on disk. |

### Question Paper Management

| Method | Endpoint | Authorization | Description |
|:---|:---|:---|:---|
| POST | `/api/papers/generate` | Bearer Token | Triggers Gemini to generate a question paper matching the configuration. |
| GET | `/api/papers` | Bearer Token | Lists all generated papers owned by the active teacher. |
| GET | `/api/papers/{paper_id}` | Bearer Token | Retrieves the configuration and questions of a specific paper. |
| PUT | `/api/papers/{paper_id}` | Bearer Token | Updates editable fields or modifies the question list. |
| DELETE | `/api/papers/{paper_id}` | Bearer Token | Deletes a generated paper record. |
| GET | `/api/papers/{paper_id}/answers` | Bearer Token | Retrieves the answer key and explanations for teacher review. |
| GET | `/api/papers/{paper_id}/pdf` | Bearer Token | Streams the formatted question paper as a PDF (Supports query filters for Department, Course Code, Semester, Exam Type, Duration, Date, and Instructions). |
| GET | `/api/papers/{paper_id}/answers/pdf` | Bearer Token | Streams the faculty answer key as a PDF (Supports the same metadata query filters). |
| POST | `/api/papers/{paper_id}/questions/{question_id}/regenerate` | Bearer Token | Regenerates a single question using custom guidelines. |

---

## Database Configuration

The application configures MongoDB indexes automatically during startup to optimize queries:
- `users`: Unique index on the `email` field.
- `otps`: Index on the `email` field, and a Time-To-Live (TTL) index on the `created_at` field (automatically purging records after expiration).
- `documents`: Indexes on `user_id` and `status` to filter and process user uploads.
- `papers`: Indexes on `teacher_id` and `document_id` to speed up teacher dashboard lookups.

---

## Installation and Setup

### Prerequisites
- Node.js (v18 or higher)
- Python (v3.12 or higher)
- MongoDB Atlas cluster or a local MongoDB database instance
- SMTP credentials (such as Google App Passwords) for sending OTP emails

### Backend Configuration

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Establish a Python virtual environment:
   ```bash
   python -m venv .venv
   ```

3. Activate the virtual environment:
   - Windows (PowerShell):
     ```powershell
     .\.venv\Scripts\Activate.ps1
     ```
   - macOS / Linux:
     ```bash
     source .venv/bin/activate
     ```

4. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```

5. Create an environment file from the template:
   ```bash
   cp .env.example .env
   ```

6. Configure the variables inside `.env`:
   - `MONGODB_URI`: Your MongoDB connection string.
   - `DATABASE_NAME`: Database name (Defaults to `papermind`).
   - `JWT_SECRET`: A secure string to sign JWTs.
   - `JWT_ALGORITHM`: The algorithm used to sign JWTs (Defaults to `HS256`).
   - `ACCESS_TOKEN_EXPIRE_MINUTES`: Session duration in minutes (Defaults to `60`).
   - `CORS_ORIGINS`: Allowed origins, e.g., `http://localhost:5173`.
   - `GEMINI_API_KEY`: Your Google AI Studio API key.
   - `GEMINI_MODEL`: The model used for generation (Defaults to `gemini-2.5-flash`).
   - `SMTP_EMAIL`: The dispatch email address.
   - `SMTP_APP_PASSWORD`: The password/app password for SMTP authentication.
   - `SMTP_SERVER`: The SMTP host (Defaults to `smtp.gmail.com`).
   - `SMTP_PORT`: The SMTP port (Defaults to `587`).

7. Run the development server:
   ```bash
   uvicorn app.main:app --reload
   ```

The backend API will run on `http://127.0.0.1:8000`. The interactive API documentation is accessible at `http://127.0.0.1:8000/docs`.

### Frontend Configuration

1. Navigate to the Frontend directory:
   ```bash
   cd Frontend
   ```

2. Install the node package dependencies:
   ```bash
   npm install
   ```

3. Start the Vite local server:
   ```bash
   npm run dev
   ```

The frontend application will start on `http://localhost:5173`.

---

## Production Deployment

### Backend
The backend can be built and deployed using any service supporting ASGI servers (e.g., Uvicorn). Ensure that the production environment variables match those configured in your `.env` file. Do not run with `--reload` in production.
```bash
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

### Frontend
To compile the static production build of the frontend, run:
```bash
npm run build
```
Deploy the resulting contents of the `dist/` directory to static hosting services (e.g., Netlify, Vercel, or AWS S3).

## Deployment Configuration

The frontend uses environment variables to configure its API backend URL. Set the following environment variable according to your environment:

**Development** (in `.env.local`):
```env
VITE_API_URL=http://localhost:8000
```

**Production** (in Vercel/Netlify Dashboard):
```env
VITE_API_URL=https://automated-question-paper-genrator.onrender.com
```
