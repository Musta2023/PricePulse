# PricePulse - Elite Price Tracker (Vercel & Docker Ready) 🚀

PricePulse is a professional-grade web application designed to track and visualize price fluctuations for e-commerce products in real-time. It features a modern dashboard, secure JWT authentication, and a simulated price engine for live demonstrations.

---

## 🏗️ Project Architecture

This project follows a modern **Split Monorepo** architecture, optimized for both local development and high-performance cloud deployment.

- **`/frontend`**: React 19 application powered by **Vite**, **Tailwind CSS**, and **TanStack Query**.
- **`/backend`**: Node.js & Express API with **TypeScript** and **Prisma ORM**.
- **`/api`**: Vercel-specific serverless entry point for production deployment.
- **`/prisma`**: Unified database schema managed by Prisma.

---

## 🛠️ Technical Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, Lucide React, React Hot Toast.
- **Backend:** Node.js, Express, TypeScript, Prisma ORM.
- **Database:** PostgreSQL (Compatible with Docker & Cloud providers like Supabase/Neon).
- **Security:** JWT (JSON Web Tokens) with 24h expiration, Bcrypt password hashing, Helmet.js for header security.
- **DevOps:** Docker & Docker Compose (Containerization), Nginx (Reverse Proxy), Vercel (Production Hosting).

---

## 🚀 Deployment Guide (Vercel)

PricePulse is pre-configured for **Vercel** deployment with zero-config for the API and static frontend.

1. **Import the repository** into Vercel.
2. **Environment Variables**: Add `DATABASE_URL` and `JWT_SECRET` in the Vercel Dashboard.
3. **Build Settings**:
   - Build Command: `npm run build`
   - Output Directory: `frontend/dist`
4. **Deploy**: Vercel will automatically handle the serverless functions in `/api` and serve the frontend.

---

## 🐳 Local Development (Docker)

Launch the entire ecosystem (Frontend, Backend, PostgreSQL) with a single command:

```bash
docker-compose up --build
```

**Access URLs:**
- **Dashboard:** [http://localhost:8081](http://localhost:8081)
- **API Health:** [http://localhost:3010/health](http://localhost:3010/health)

---

## 🧪 Quality Assurance

- **Unit Tests**: Logic verification for price fluctuation algorithms.
- **Integration Tests**: End-to-end API verification.
- **E2E Tests**: Full user flow testing using Playwright.

```bash
# Run backend tests
cd backend && npm test

# Run frontend E2E
cd frontend && npm run test:e2e
```

---

## 📬 API Endpoints

- `POST /api/auth/register` : Create new user account.
- `POST /api/auth/login` : Authenticate and receive JWT.
- `GET /api/products` : Retrieve user-specific tracked products.
- `POST /api/products` : Start tracking a new product URL.

---

*PricePulse was developed to demonstrate mastery of full-stack architecture, secure authentication, and modern deployment pipelines.*
