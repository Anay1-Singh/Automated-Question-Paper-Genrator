# PaperMind AI - Frontend Portal

The frontend interface for PaperMind AI, a production-grade question paper generation platform. It provides role-based access for Teachers (Admin) and Students, offering tailored dashboards for uploading study materials, managing question banks, and generating customized exam papers.

## Tech Stack

- React 18+ (Vite)
- JavaScript (JSX)
- Tailwind CSS
- React Router DOM
- Axios (API Client)
- Lucide React (Icons)

## Features

- **Role-Based Dashboards**: Distinct interfaces for Teachers (Admin) and Students.
- **Authentication Flow**: Secure login and signup flows with email OTP verification.
- **Teacher Tools**: Interfaces for generating papers based on Bloom's Taxonomy, managing question banks, uploading documents, and viewing analytics.
- **Student Tools**: Interfaces for uploading study notes, viewing AI-generated summaries, tracking study focus areas, and revising important topics.
- **Responsive UI**: Fully responsive design with a modern, dark-themed aesthetic.

## Configuration

The frontend uses environment variables for configuration. Create the appropriate `.env` files based on your environment.

### Local Development (.env.local)

```env
VITE_API_URL=http://localhost:8000
```

### Production (.env / Vercel Dashboard)

```env
VITE_API_URL=https://automated-question-paper-genrator.onrender.com
```

## Installation and Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`.

3. **Production Build**:
   ```bash
   npm run build
   ```
   Deploy the `dist/` folder to your static hosting provider (e.g., Vercel, Netlify).
