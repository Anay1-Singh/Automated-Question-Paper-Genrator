# Automated Question Paper Generator Using Bloom's Taxonomy

A full-stack web application that automates the creation of academically structured question papers by applying Bloom's Taxonomy cognitive levels. Educators can upload course material, configure cognitive distribution weights, set difficulty ratios, and generate complete examination blueprints in seconds.

---

## Table of Contents

- [Overview](#overview)
- [Bloom's Taxonomy Integration](#blooms-taxonomy-integration)
- [Project Structure](#project-structure)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Pages and Routes](#pages-and-routes)
- [Getting Started](#getting-started)
- [Development Scripts](#development-scripts)
- [Design Principles](#design-principles)
- [Folder Reference](#folder-reference)
- [Future Roadmap](#future-roadmap)

---

## Overview

Traditional question paper creation is time-consuming and inconsistent. Faculty must manually ensure that questions span different cognitive levels, maintain appropriate difficulty distributions, and align with the prescribed syllabus. This application solves all three problems simultaneously.

The system presents a structured dashboard where educators specify course details, upload reference material such as a syllabus PDF or lecture notes, configure how many questions should fall under each Bloom's Taxonomy level, set difficulty ratios, and then generate a complete question paper. The output includes a marks-calibrated question sheet and a compliance score representing how well the generated paper aligns with the configured cognitive blueprint.

This version is a fully functional frontend prototype. The entire user interface, navigation, state management, file upload simulation, and paper generation workflow are operational without a backend server. A backend integration layer can be connected at a later stage.

---

## Bloom's Taxonomy Integration

Bloom's Taxonomy is an educational framework that classifies learning objectives into six hierarchical cognitive levels. Each level represents a distinct depth of understanding, from basic recall to original creation.

The six levels used in this application are:

- L1 - Remembering: The ability to recall facts, definitions, and foundational concepts from memory.
- L2 - Understanding: The ability to interpret, summarize, and explain the meaning of information.
- L3 - Applying: The ability to use known procedures and techniques in new situations.
- L4 - Analyzing: The ability to break down complex information, compare components, and identify relationships.
- L5 - Evaluating: The ability to make judgments, defend positions, and critique solutions.
- L6 - Creating: The ability to synthesize information to design, produce, or formulate original work.

When generating a question paper, the educator assigns percentage weights to each level. The weights must sum to exactly 100 percent. The system uses these weights to determine how questions are distributed across the paper, ensuring every generated exam is cognitively balanced and aligned with intended learning outcomes.

---

## Project Structure

```
Automated Question Paper Generator Using Blooms Taxonomy/
├── frontend/                         Next.js application (all UI and logic)
│   ├── src/
│   │   ├── app/                      Next.js App Router pages
│   │   │   ├── (auth)/               Route group for authentication pages
│   │   │   │   ├── layout.jsx        Shared auth layout with particle background
│   │   │   │   ├── login/            Login page (white theme)
│   │   │   │   └── signup/           Signup page (black theme)
│   │   │   ├── dashboard/            All dashboard sub-routes
│   │   │   │   ├── page.jsx          Main dashboard overview
│   │   │   │   ├── generate-paper/   Question paper generation wizard
│   │   │   │   ├── documents/        Syllabus document manager
│   │   │   │   ├── question-papers/  Generated paper catalog
│   │   │   │   ├── bank/             Question bank library
│   │   │   │   ├── analytics/        Usage and taxonomy analytics
│   │   │   │   ├── blooms/           Bloom's Taxonomy reference
│   │   │   │   ├── profile/          User profile settings
│   │   │   │   └── settings/         Application settings
│   │   │   ├── layout.js             Root application layout
│   │   │   ├── page.js               Landing page
│   │   │   └── globals.css           Global CSS reset and base styles
│   │   ├── components/
│   │   │   ├── auth/                 Authentication UI components
│   │   │   │   ├── AuthCard.jsx      Centered card wrapper for auth pages
│   │   │   │   ├── GoogleButton.jsx  Google OAuth button
│   │   │   │   ├── InputField.jsx    Themed text input component
│   │   │   │   ├── Logo.jsx          Application logo mark
│   │   │   │   ├── ParticleBackground.jsx  Canvas particle animation
│   │   │   │   ├── PasswordField.jsx Password input with show/hide toggle
│   │   │   │   └── ThemeTransition.jsx  Theme context provider
│   │   │   ├── dashboard/            Dashboard UI components
│   │   │   │   ├── ActivityTimeline.jsx  Recent activity feed
│   │   │   │   ├── BloomChart.jsx    Bloom's level distribution chart
│   │   │   │   ├── DashboardLayout.jsx   Sidebar and content wrapper
│   │   │   │   ├── DifficultyChart.jsx   Difficulty ratio visualization
│   │   │   │   ├── DocumentList.jsx      Recent documents widget
│   │   │   │   ├── PageHeader.jsx        Dashboard welcome header
│   │   │   │   ├── PaperTable.jsx        Recent papers table
│   │   │   │   ├── QuickActions.jsx      Navigation shortcut buttons
│   │   │   │   ├── SearchBar.jsx         Global search input
│   │   │   │   ├── Sidebar.jsx           Left navigation sidebar
│   │   │   │   ├── StatsCard.jsx         Metric cards with sparklines
│   │   │   │   ├── SuggestionCard.jsx    AI suggestion panel
│   │   │   │   └── TopNavbar.jsx         Top navigation bar
│   │   │   ├── common/               Shared UI primitives
│   │   │   │   ├── Button.jsx        Animated button with variants
│   │   │   │   └── Card.jsx          Container card component
│   │   │   └── layout/               Site-level layout components
│   │   │       ├── Navbar.jsx        Landing page top navigation
│   │   │       └── Footer.jsx        Landing page footer
│   │   ├── sections/                 Landing page section components
│   │   │   ├── Hero.jsx              Hero with animated product demo
│   │   │   ├── Features.jsx          Feature highlights grid
│   │   │   ├── Benefits.jsx          Benefits and value propositions
│   │   │   ├── BloomTaxonomy.jsx     Visual Bloom's Taxonomy explainer
│   │   │   ├── HowItWorks.jsx        Three-step process walkthrough
│   │   │   ├── Screenshots.jsx       Product screenshot showcase
│   │   │   ├── Trust.jsx             Trust and institution indicators
│   │   │   ├── FAQ.jsx               Frequently asked questions
│   │   │   └── CTA.jsx               Call-to-action section
│   │   ├── lib/
│   │   │   └── store.js              Reactive singleton state store
│   │   ├── constants/                Static data and navigation config
│   │   ├── hooks/                    Custom React hooks
│   │   ├── utils/                    Utility functions (cn, etc.)
│   │   └── styles/                   Additional stylesheets
│   ├── package.json
│   └── next.config.mjs
└── backend/                          Backend directory (reserved for API layer)
```

---

## Tech Stack

**Frontend Framework**: Next.js 16 with the App Router and Turbopack for fast development builds.

**UI Library**: React 19 with functional components and hooks throughout.

**Styling**: Tailwind CSS v4 for utility-based styling with a custom dark theme. Colors follow a zinc-based neutral palette with blue accents.

**Animation**: Framer Motion for page transitions, micro-interactions, and component entrance animations. Authentication pages use a canvas-based particle network animation built with native browser APIs.

**Icons**: Lucide React for a consistent, clean icon set across all UI surfaces.

**State Management**: A custom lightweight singleton store at `src/lib/store.js` using a publish-subscribe reactive pattern. No external state library is required. State persists across client-side route navigation without localStorage or cookies.

**Routing**: Next.js file-based routing with the App Router. The `(auth)` route group isolates the authentication layout from the main application layout.

**HTTP Client**: Axios is installed and available for future backend API integration.

---

## Features

**Landing Page**

A complete marketing site with nine sections: a hero with animated product demo, a Bloom's Taxonomy visual explainer, feature highlights, a three-step how-it-works walkthrough, a screenshot carousel, trust indicators, a collapsible FAQ, and a call-to-action. The top navigation and hero buttons route directly to signup and login.

**Authentication Pages**

Two visually distinct pages share a persistent canvas particle background that keeps running during transitions. The signup page is pure black with white accents. The login page is pure white with black accents. Both include email/password fields, a Google OAuth button, and cross-links. Submitting either form redirects to the dashboard.

**Dashboard Overview**

Four statistics cards display total question papers, questions generated, documents uploaded, and Bloom's accuracy. All values update in real time as the user interacts with the application. A recent papers table, AI suggestion panel, two cognitive distribution charts, a documents widget, and a quick-actions panel complete the overview.

**Generate Question Paper**

A structured two-column form where the educator enters course details, selects a parsed syllabus document (or uploads one inline), configures question counts per format, adjusts six Bloom's level sliders, and sets difficulty ratios. The generate button is disabled until the cognitive weights total exactly 100 percent. On submission, a cinematic overlay shows progressive status messages and a progress bar. The new paper is added to the store and the page redirects to the papers catalog.

**Documents Manager**

A drag-and-drop upload zone with visual feedback on hover and drop. Uploaded files enter a "Parsing" state with a spinning indicator, then transition to "Parsed" after 1.8 seconds with a generated question count. Filtering by file type and real-time search by filename are both functional. Deleting a document removes it from all views including the dashboard widget and document count card.

**Question Papers Catalog**

A three-column card grid with course code, title, subject, marks, and cognitive compliance per card. Preview, Download, Share, and Delete buttons are all wired and provide immediate visual feedback via a toast notification. Search filters the grid in real time across title, code, and subject fields.

**Question Bank Library**

A searchable, filterable list of individual questions organized by Bloom's level, subject, and format. The Add Custom Question button opens a modal with a full form. Submitting adds the new question to the top of the list. Deleting removes the item immediately.

**Sidebar Navigation**

A fixed left sidebar shows all dashboard routes with active-state highlighting using a blue left border. The user card at the bottom shows name and email. The logout button navigates back to the login page.

---

## Pages and Routes

| Route | Description |
|---|---|
| `/` | Landing page with marketing content |
| `/login` | Login form with white theme |
| `/signup` | Registration form with black theme |
| `/dashboard` | Overview with stats, charts, and recent activity |
| `/dashboard/generate-paper` | Question paper generation wizard |
| `/dashboard/documents` | Syllabus document upload and manager |
| `/dashboard/question-papers` | Generated papers catalog with download |
| `/dashboard/bank` | Question bank with custom question adding |
| `/dashboard/analytics` | Analytics and cognitive distribution charts |
| `/dashboard/blooms` | Bloom's Taxonomy reference and level details |
| `/dashboard/profile` | User profile information |
| `/dashboard/settings` | Application settings and preferences |

---

## Getting Started

### Prerequisites

- Node.js version 18 or higher
- npm version 9 or higher

### Installation

Clone the repository:

```bash
git clone https://github.com/Anay1-Singh/automated-question-paper-genrator-.git
cd automated-question-paper-genrator-
```

Install frontend dependencies:

```bash
cd frontend
npm install
```

### Running the Development Server

```bash
cd frontend
npm run dev
```

The application starts at `http://localhost:3000`. Open that address in any browser to view the landing page.

---

## Development Scripts

All commands are run from inside the `frontend/` directory.

| Command | Description |
|---|---|
| `npm run dev` | Starts the Turbopack development server at localhost:3000 |
| `npm run build` | Creates an optimized production build |
| `npm run start` | Starts the production server after a build |
| `npm run lint` | Runs ESLint across all source files |

---

## Design Principles

The interface follows a minimal, dark-first visual language:

- Backgrounds use pure black (#000000), near-black (#09090B), and zinc-950 for depth layering.
- Primary text is white. Secondary labels use zinc-400. Placeholder and tertiary text use zinc-500 through zinc-600.
- Borders default to zinc-800, with zinc-900 for subtle dividers and zinc-700 on hover.
- Blue-500 serves as the sole accent color for active states, icons, and call-to-action buttons.
- Typography uses the system font stack with tight letter-spacing and semibold weights for headings.
- Interactive elements animate with 150ms transitions on hover and active states.
- Glassmorphism, neon glows, and oversized gradients are deliberately avoided.

The authentication pages intentionally diverge from the dashboard aesthetic. They use a live canvas animation as the full-page background, with the form card inverting between white and black depending on the route.

---

## Folder Reference

| Path | Purpose |
|---|---|
| `src/app/(auth)/` | Route group isolating authentication layout |
| `src/app/dashboard/` | All dashboard route pages |
| `src/components/auth/` | Components exclusive to login and signup |
| `src/components/dashboard/` | Components exclusive to the dashboard |
| `src/components/common/` | Shared primitives used across all pages |
| `src/components/layout/` | Site-wide Navbar and Footer |
| `src/sections/` | Landing page section components |
| `src/lib/store.js` | Singleton reactive state store |
| `src/constants/` | Navigation links and static configuration |
| `src/utils/` | Utility functions including the cn class merger |

---

## Future Roadmap

- Backend API server using Python with FastAPI or Flask, providing endpoints for document parsing, question generation, and paper export.
- Integration with a large language model API for real semantic question generation from uploaded syllabus content.
- PDF export that renders the generated question paper as a properly formatted examination sheet complete with answer keys and marking rubrics.
- User authentication using JWT tokens with persistent server-side sessions.
- Database storage for documents, generated papers, and question banks using PostgreSQL or MongoDB.
- Multi-user institutional accounts with role-based access control for faculty and administrators.
- Historical analytics reporting Bloom's compliance trends across semesters and departments.
- Bulk paper generation with batch processing for multiple courses simultaneously.
