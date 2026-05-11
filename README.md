# 🎯 AI Job Tracker

> A full-stack web application for tracking job applications with AI-powered follow-up suggestions powered by Claude API.

![Python](https://img.shields.io/badge/Python-3.11-3776AB?style=flat-square&logo=python&logoColor=white)
![Django](https://img.shields.io/badge/Django-5.x-092E20?style=flat-square&logo=django&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-3-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square&logo=docker&logoColor=white)
![Playwright](https://img.shields.io/badge/Playwright-E2E-45ba4b?style=flat-square&logo=playwright&logoColor=white)

---

## 🔗 Live Demo

| Service | URL |
|---|---|
| **Frontend** | https://job-tracker-alpha-tan.vercel.app |
| **API** | https://job-tracker-production-e6d8.up.railway.app/api/ |

---

## ✨ Features

- **JWT Authentication** — Secure register/login with access + refresh tokens
- **Job Application CRUD** — Add, edit, delete, and track job applications
- **Status Tracking** — Applied → Interviewing → Offered / Rejected
- **Dashboard & Charts** — Visual overview of your application pipeline
- **AI Follow-up Suggestions** — Claude API generates professional follow-up emails
- **Search & Filter** — Filter by status, search by company or position
- **Component Library** — Storybook with documented UI components
- **E2E Tests** — 18 Playwright tests covering all major flows
- **CI/CD** — GitHub Actions workflow

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Backend** | Python, Django 5.x, Django REST Framework |
| **Authentication** | JWT (djangorestframework-simplejwt) |
| **Frontend** | React 18, TypeScript, Tailwind CSS v3 |
| **UI Components** | shadcn/ui + Storybook |
| **Charts** | Recharts |
| **AI** | Anthropic Claude API |
| **Database** | PostgreSQL |
| **Infrastructure** | Docker, Docker Compose, Gunicorn |
| **Testing** | Playwright (E2E), Django TestCase |
| **Deploy** | Railway (Backend), Vercel (Frontend) |
| **CI/CD** | GitHub Actions |

---

## 🏗️ Project Structure

```
job-tracker/
├── backend/                    # Django REST API
│   ├── accounts/               # JWT Auth (register, login, profile)
│   ├── jobs/                   # Job applications CRUD + AI suggest
│   │   ├── models.py           # JobApplication model
│   │   ├── views.py            # CRUD + Stats + Claude AI
│   │   ├── serializers.py      # DRF serializers
│   │   └── tests.py            # Unit + API tests
│   ├── core/                   # Django settings
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── requirements.txt
├── frontend/                   # React + TypeScript
│   ├── src/
│   │   ├── api/                # Axios API calls
│   │   ├── components/ui/      # Reusable components
│   │   ├── hooks/              # useAuth, useJobs
│   │   ├── pages/              # Login, Register, Dashboard, Jobs
│   │   └── types/              # TypeScript types
│   └── .storybook/             # Storybook config
├── playwright-tests/           # E2E Tests
│   ├── tests/
│   │   ├── pages/              # Page Object Models
│   │   ├── fixtures/           # Auth helpers
│   │   ├── auth.spec.ts
│   │   ├── dashboard.spec.ts
│   │   └── jobs.spec.ts
│   └── playwright.config.ts
└── .github/workflows/          # GitHub Actions CI/CD
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register/` | Create account |
| `POST` | `/api/auth/login/` | Get JWT tokens |
| `POST` | `/api/auth/refresh/` | Refresh access token |
| `GET` | `/api/auth/profile/` | Get current user |
| `GET` | `/api/jobs/` | List all jobs (paginated) |
| `POST` | `/api/jobs/` | Create job application |
| `GET` | `/api/jobs/{id}/` | Get job detail |
| `PATCH` | `/api/jobs/{id}/` | Update job |
| `DELETE` | `/api/jobs/{id}/` | Delete job |
| `GET` | `/api/jobs/stats/` | Dashboard statistics |
| `POST` | `/api/jobs/{id}/ai-suggest/` | Claude AI follow-up |

---

## ⚙️ Local Setup

### Prerequisites
- Docker & Docker Compose
- Node.js 20+

### 1. Clone the repository

```bash
git clone https://github.com/Chatrudee/job-tracker.git
cd job-tracker
```

### 2. Start the backend

```bash
cd backend
cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY

docker compose up -d
docker compose run --rm web python manage.py makemigrations jobs
docker compose run --rm web python manage.py migrate
```

### 3. Start the frontend

```bash
cd frontend
cp .env.local.example .env.local
# VITE_API_URL=http://localhost:8000

npm install
npm run dev
```

Open `http://localhost:5173`

### 4. Run Storybook

```bash
cd frontend
npm run storybook
```

Open `http://localhost:6006`

### 5. Run E2E tests

```bash
cd playwright-tests
npm install
npm test
```

---

## 🧪 Testing

```bash
# Backend unit tests
docker compose run --rm web python manage.py test

# E2E tests (requires frontend + backend running)
cd playwright-tests
npm test

# View test report
npm run test:report
```

**Test coverage:**
- 15 Django unit tests (models, API endpoints, permissions)
- 18 Playwright E2E tests (auth, dashboard, job CRUD)

---

## 🤖 AI Feature

The AI suggest feature sends job details to **Claude API** and returns a professional follow-up email:

```
Input:  Company, Position, Status, Days since applied, Notes
Output: Email subject + Professional email body
```

To enable: Add `ANTHROPIC_API_KEY` to your `.env` file.

---

## 🚀 Deployment

| Service | Platform | URL |
|---|---|---|
| Backend + PostgreSQL | Railway | https://job-tracker-production-e6d8.up.railway.app |
| Frontend | Vercel | https://job-tracker-alpha-tan.vercel.app |

---

## 👩‍💻 Author

**Chatrudee** — [GitHub](https://github.com/Chatrudee)
