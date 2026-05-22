# Blood Donor Match

A full-stack web application that connects blood donors with recipients in critical situations. Built with React, Node.js/Express, and PostgreSQL.

## Features

- **Donor registration** with eligibility validation (age 18-60, disease history, tattoo guidelines)
- **Smart search** — find donors by blood group and city; results expand nationwide if no local match
- **6-month cooldown** — donors are hidden from searches during the waiting period after donation
- **Authentication** — phone + password sign up/sign in; donor profiles are private to each user
- **Profile management** — update details anytime; blood group is permanent after registration
- **Privacy** — only name, phone, and last donation date are visible to recipients
- **India-focused** — pre-populated dropdowns for Indian cities and states; 45 synthetic seed donors

## Tech Stack

- **Frontend:** React 18, React Router 6
- **Backend:** Node.js, Express 4
- **Database:** PostgreSQL 16
- **Auth:** bcrypt + JWT
- **Deployment:** Docker Compose

## Quick Start

### Docker

```bash
git clone https://github.com/gsathvik228/blood-donor-match.git
cd blood-donor-match
docker-compose up --build
```

Open [http://localhost:3000](http://localhost:3000).

### Local

**Prerequisites:** Node.js 18+, PostgreSQL 16

```bash
# Database
psql -U postgres -c "CREATE DATABASE blood_donor_db;"
psql -U postgres -d blood_donor_db -f backend/db/init.sql
psql -U postgres -d blood_donor_db -f backend/db/seed.sql

# Backend (terminal 1)
cd backend
cp .env.example .env
npm install
npm start

# Frontend (terminal 2)
cd frontend
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `DB_HOST` | localhost | PostgreSQL host |
| `DB_PORT` | 5432 | PostgreSQL port |
| `DB_USER` | postgres | PostgreSQL user |
| `DB_PASSWORD` | postgres | PostgreSQL password |
| `DB_NAME` | blood_donor_db | Database name |
| `PORT` | 5000 | API server port |
| `JWT_SECRET` | *(built-in default)* | Change in production |

## API Overview

All endpoints return JSON. Authenticated endpoints require `Authorization: Bearer <token>`.

### Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create account (phone + password) |
| POST | `/api/auth/login` | Sign in, returns JWT |

### Donors (require auth)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/donors/register` | Register as donor (linked to your account) |
| GET | `/api/donors/me` | Get your donor profile |
| PUT | `/api/donors/me` | Update your profile |
| GET | `/api/donors/search?blood_group=A%2B&city=Mumbai` | Search eligible donors |

## Project Structure

```
backend/
├── db/init.sql, seed.sql
├── src/
│   ├── index.js
│   ├── config/db.js
│   ├── middleware/auth.js, validation.js
│   └── routes/auth.js, donors.js
frontend/
└── src/
    ├── App.js, AuthContext.js, constants.js
    ├── components/ (7 components)
    └── styles/App.css
```

## Deployment

Deploy on [Render](https://render.com) or [Railway](https://railway.app):

1. Push the repo to GitHub
2. Create a PostgreSQL database on the platform
3. Deploy `backend/` as a web service (start: `node src/index.js`)
4. Deploy `frontend/` as a static site (build: `npm run build`, publish: `build`)
5. Set environment variables on the backend service

## License

MIT
