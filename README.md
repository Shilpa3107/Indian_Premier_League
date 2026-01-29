# IPL Data Platform 🏏

A full-stack data platform for Indian Premier League insights, built for the internship assignment.

## Tech Stack
- **Frontend**: React, Vite, TypeScript, Recharts, Lucide React, Framer Motion
- **Backend**: Node.js, Express, TypeScript, Prisma ORM
- **Database**: PostgreSQL
- **Documentation**: Swagger/OpenAPI

## Features
- **Dashboard**: High-level statistical overview with interactive charts showing team performance and win distribution.
- **Squads**: Detailed team-to-player exploration with search and filtering.
- **Standings**: Full 2022 season results table with net run rate (NRR) indicators.
- **API**: Modern RESTful APIs with pagination, status checks, and self-documenting Swagger UI.

## Local Setup

### Prerequisites
- Node.js (v18+)
- PostgreSQL running locally

### Backend Setup
1. Navigate to `backend/`
2. Install dependencies: `npm install`
3. Configure `.env`:
   ```env
   DATABASE_URL="postgresql://postgres:PASSWORD@localhost:5432/ipl_db?schema=public"
   PORT=3001
   ```
4. Run migrations: `npx prisma migrate dev --name init`
5. Seed data: `npx ts-node src/seed.ts`
6. Start dev server: `npm run dev`

### Frontend Setup
1. Navigate to `frontend/`
2. Install dependencies: `npm install`
3. Start dev server: `npm run dev -- --port 3000`

## API Documentation
Once the backend is running, visit:
`http://localhost:3001/api-docs`

## Screenshots
*(Add your screenshots here)*

## Deployment
- **Backend**: Can be deployed to Railway, Render, or any Node.js host with a PostgreSQL add-on.
- **Frontend**: Optimized for Vercel or Netlify.
