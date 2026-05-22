# Blood Donor Match

A public web application that connects blood donors with recipients in critical situations. Built with React, Node.js/Express, and PostgreSQL.

## Features

- **Donor Registration** — Users can register as blood donors with eligibility checks (age 18–60, no disease history, tattoo guidelines).
- **Smart Search** — Recipients search by blood group and city. If no exact match is found, results expand nationwide automatically.
- **6-Month Cooldown** — Donors who donated within the last 6 months are hidden from search results automatically.
- **Authentication** — Sign up and sign in with phone number and password. Donor registration and search require a logged-in account.
- **Profile Management** — Donors can update their details (except blood group, which is permanent) and their last donation date.
- **Privacy** — Full address is kept anonymous. Recipients only see name, phone, and last donation date.
- **India-Focused** — Pre-populated with major Indian cities and states as dropdowns. Comes with 45 synthetic donors across 15 cities.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router 6 |
| Backend | Node.js, Express 4 |
| Database | PostgreSQL 16 |
| Auth | bcrypt + JWT |
| Deployment | Docker / Docker Compose |

## Getting Started

### Option 1: Docker (Recommended)

```bash
docker-compose up --build
```

This starts PostgreSQL, the backend API on port 5000, and the frontend on port 3000. The database schema and seed data are applied automatically.

### Option 2: Local Development

**Prerequisites:** Node.js 18+ and PostgreSQL 16 installed.

1. Create the database:

```bash
psql -U postgres -c "CREATE DATABASE blood_donor_db;"
psql -U postgres -d blood_donor_db -f backend/db/init.sql
psql -U postgres -d blood_donor_db -f backend/db/seed.sql
```

2. Start the backend:

```bash
cd backend
cp .env.example .env
# Edit .env if your PostgreSQL credentials differ
npm install
npm start
```

3. Start the frontend (in a separate terminal):

```bash
cd frontend
npm install
npm start
```

4. Open http://localhost:3000

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create a user account (phone + password) |
| POST | `/api/auth/login` | Sign in, returns JWT token |

### Donors (all require JWT except /register)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/donors/register` | Register as a donor (linked to your account) |
| GET | `/api/donors/me` | Get your own donor profile |
| PUT | `/api/donors/me` | Update your donor details (not blood group) |
| GET | `/api/donors/search?blood_group=X&city=Y` | Search for eligible donors |

### Eligibility Criteria

- Age must be between 18 and 60 years
- No history of blood-related diseases
- Tattoos must have been administered at least one year ago
- Donors cannot donate within 6 months of their last donation
- Blood group is recorded as final and cannot be changed

## Project Structure

```
blood-donor-proj/
├── docker-compose.yml         # One-command deployment
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   ├── .env.example
│   ├── db/
│   │   ├── init.sql           # Database schema
│   │   └── seed.sql           # 45 synthetic Indian donors
│   └── src/
│       ├── index.js            # Express server
│       ├── config/db.js        # PostgreSQL connection pool
│       ├── middleware/
│       │   ├── auth.js         # JWT generation & verification
│       │   └── validation.js   # Request validation
│       └── routes/
│           ├── auth.js         # Sign up / sign in
│           └── donors.js       # Donor CRUD & search
└── frontend/
    ├── Dockerfile + nginx.conf
    ├── package.json
    └── src/
        ├── App.js
        ├── AuthContext.js       # Global auth state
        ├── constants.js         # Indian cities, states, blood groups
        └── components/
            ├── Home.js
            ├── SignInSignUp.js
            ├── DonorRegister.js
            ├── DonorSearch.js
            ├── DonorUpdate.js
            └── ProtectedRoute.js
```

## Deployment

This project is ready to deploy on platforms like [Render](https://render.com) or [Railway](https://railway.app):

1. Push the repo to GitHub
2. Connect your GitHub repository to the platform
3. Create a PostgreSQL database (platform-managed)
4. Deploy the backend as a web service (start command: `cd backend && npm start`)
5. Deploy the frontend as a static site (build command: `cd frontend && npm install && npm run build`, publish dir: `frontend/build`)
6. Set the `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` environment variables on the backend service
7. For the frontend, set the API proxy to point to your backend URL

## License

MIT
