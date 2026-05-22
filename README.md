<div align="center">
  <h1>🩸 Blood Donor Match</h1>
  <p>
    <strong>A public platform connecting blood donors with recipients in critical situations.</strong>
  </p>
  <p>
    <img src="https://img.shields.io/badge/React-18-61DAFB?logo=react" alt="React 18" />
    <img src="https://img.shields.io/badge/Node.js-20-339933?logo=node.js" alt="Node.js 20" />
    <img src="https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql" alt="PostgreSQL 16" />
    <img src="https://img.shields.io/badge/license-MIT-blue" alt="MIT License" />
  </p>
</div>

---

## 📋 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Docker Setup (Recommended)](#docker-setup-recommended)
  - [Local Setup](#local-setup)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [Database Schema](#-database-schema)
- [Project Structure](#-project-structure)
- [Deployment](#-deployment)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)

---

## 📖 About

Blood Donor Match is a full-stack web application that fast-tracks the blood donation process by connecting **donors** directly with **recipients**. In critical situations where every minute counts, this platform eliminates intermediaries and helps recipients find eligible donors in their city instantly.

Donors register with their details and eligibility information. Recipients search by blood group and location to find nearby donors who are eligible to donate. The full address stays private until contact is made — the platform simply facilitates the connection.

---

## ✨ Features

### For Donors

- **Eligibility-Guided Registration** — Validates age (18–60), disease history, and tattoo guidelines before registration.
- **Profile Management** — Update your details anytime. Blood group is recorded as final after registration.
- **Donation Tracking** — Update your last donation date. You are automatically hidden from searches during the 6-month cooldown period.
- **Account Security** — Password-protected account ensures only you can modify your donor profile.

### For Recipients

- **Smart Search** — Search by blood group and city. Results show only eligible donors (cooldown respected).
- **Auto-Fallback** — No donors in your city? Results automatically expand nationwide.
- **Anonymous Contact** — Recipients see only name, phone, and last donation date. Full address stays private.
- **No Middleman** — Contact donors directly. The blood donation process happens independently of the app.

### General

- **India-Centric** — Pre-populated dropdowns for all major Indian cities and states.
- **Seed Data** — Comes with 45 synthetic donors across 15 Indian cities for testing and demonstration.
- **Responsive Design** — Works on desktop and mobile devices.

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18, React Router 6 | Single-page application with client-side routing |
| **Backend** | Node.js, Express 4 | RESTful API server |
| **Database** | PostgreSQL 16 | Relational data storage |
| **Authentication** | bcrypt + JWT | Password hashing and stateless tokens |
| **Containerization** | Docker, Docker Compose | Consistent development and deployment environments |
| **Reverse Proxy** | Nginx | Serves frontend build and proxies API requests (Docker) |

---

## 🚀 Getting Started

### Prerequisites

| Dependency | Version | Installation |
|-----------|---------|-------------|
| Node.js | ≥ 18.x | [nodejs.org](https://nodejs.org/) |
| npm | ≥ 9.x | Ships with Node.js |
| PostgreSQL | ≥ 14.x | [postgresql.org](https://www.postgresql.org/download/) |
| Docker & Docker Compose | Latest | [docker.com](https://www.docker.com/products/docker-desktop/) *(optional — only for Docker setup)* |

### Docker Setup (Recommended)

The fastest way to get everything running:

```bash
# Clone the repository
git clone https://github.com/gsathvik228/blood-donor-match.git
cd blood-donor-match

# Start all services
docker-compose up --build
```

This starts three containers:
- **PostgreSQL 16** on port `5432` — schema and seed data applied automatically
- **Backend API** on port `5000`
- **Frontend** on port `3000` (served by Nginx, API proxied to backend)

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Local Setup

#### 1. Database

```bash
# Connect to PostgreSQL and create the database
psql -U postgres -c "CREATE DATABASE blood_donor_db;"

# Apply schema
psql -U postgres -d blood_donor_db -f backend/db/init.sql

# (Optional) Load seed data
psql -U postgres -d blood_donor_db -f backend/db/seed.sql
```

#### 2. Backend

```bash
cd backend

# Configure environment
cp .env.example .env
# Edit .env if your PostgreSQL credentials differ

# Install dependencies
npm install

# Start the server (http://localhost:5000)
npm start
```

#### 3. Frontend

Open a **new terminal**:

```bash
cd frontend

# Install dependencies
npm install

# Start the dev server (http://localhost:3000)
npm start
```

The frontend proxies API requests to `http://localhost:5000` via the `"proxy"` field in `package.json`.

---

## 🔐 Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `DB_HOST` | `localhost` | PostgreSQL host |
| `DB_PORT` | `5432` | PostgreSQL port |
| `DB_USER` | `postgres` | PostgreSQL user |
| `DB_PASSWORD` | `postgres` | PostgreSQL password |
| `DB_NAME` | `blood_donor_db` | PostgreSQL database name |
| `PORT` | `5000` | Backend API server port |
| `JWT_SECRET` | `blood-donor-secret-key-change-in-production` | Secret key for JWT signing (**change in production**) |

---

## 📡 API Reference

All endpoints return JSON. Responses follow a consistent format:

```json
{
  "success": true | false,
  "errors": ["..."],      // present on failure
  "data": { ... }          // present on success
}
```

### Authentication

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/auth/register` | No | Create a user account |
| `POST` | `/api/auth/login` | No | Sign in and receive a JWT |

**POST /api/auth/register**

```json
// Request
{ "phone": "+91 9876543210", "password": "yourpassword" }

// Response 201
{ "success": true, "token": "jwt...", "user": { "id": 1, "phone": "...", "donor_id": null } }
```

**POST /api/auth/login**

```json
// Request
{ "phone": "+91 9876543210", "password": "yourpassword" }

// Response 200
{ "success": true, "token": "jwt...", "user": { "id": 1, "phone": "...", "donor_id": 1 }, "donor": { ... } }
```

### Donors

All donor endpoints require a valid JWT in the `Authorization` header:

```
Authorization: Bearer <token>
```

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/donors/register` | Register as a blood donor |
| `GET` | `/api/donors/me` | Get your own donor profile |
| `PUT` | `/api/donors/me` | Update your donor profile |
| `GET` | `/api/donors/search?blood_group=A%2B&city=Mumbai` | Search for eligible donors |

> **Note:** `%2B` is the URL-encoded form of `+` (e.g., `A+`).

**POST /api/donors/register**

```json
// Request
{
  "name": "John Doe",
  "blood_group": "O+",
  "age": 28,
  "email": "john@example.com",
  "city": "Mumbai",
  "state": "Maharashtra",
  "full_address": "12, Lotus Apartments, Andheri West",
  "tattoo_date": "2020-06-10"     // optional
}

// Response 201
{ "success": true, "donor": { "id": 1, "name": "...", "blood_group": "O+", ... } }
```

### Donor Eligibility

- Age must be between **18 and 60** years
- No history of **blood-related diseases**
- Tattoos must have been administered **at least one year ago**
- Blood group is **final** and cannot be changed after registration
- Donors are **automatically hidden** from search during the 6-month cooldown period after their last donation

---

## 🗄️ Database Schema

### `donors`

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | `SERIAL` | `PRIMARY KEY` |
| `name` | `VARCHAR(100)` | `NOT NULL` |
| `blood_group` | `VARCHAR(3)` | `NOT NULL`, `CHECK` (A+, A-, B+, B-, AB+, AB-, O+, O-) |
| `age` | `INT` | `NOT NULL`, `CHECK (18..60)` |
| `phone` | `VARCHAR(20)` | `NOT NULL`, `UNIQUE` |
| `email` | `VARCHAR(100)` | `NOT NULL` |
| `city` | `VARCHAR(100)` | `NOT NULL` |
| `state` | `VARCHAR(100)` | `NOT NULL` |
| `full_address` | `TEXT` | `NOT NULL` |
| `last_donation_date` | `DATE` | — |
| `has_diseases` | `BOOLEAN` | `DEFAULT FALSE` |
| `tattoo_date` | `DATE` | — |
| `created_at` | `TIMESTAMP` | `DEFAULT NOW()` |
| `updated_at` | `TIMESTAMP` | `DEFAULT NOW()` |

### `users`

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | `SERIAL` | `PRIMARY KEY` |
| `donor_id` | `INTEGER` | `UNIQUE`, `REFERENCES donors(id) ON DELETE CASCADE` |
| `phone` | `VARCHAR(20)` | `UNIQUE`, `NOT NULL` |
| `password_hash` | `VARCHAR(255)` | `NOT NULL` |
| `created_at` | `TIMESTAMP` | `DEFAULT NOW()` |

---

## 📁 Project Structure

```text
blood-donor-proj/
├── docker-compose.yml
├── .gitignore
├── README.md
│
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   ├── .env.example
│   ├── db/
│   │   ├── init.sql              # Schema definition
│   │   └── seed.sql              # Sample data (45 donors)
│   └── src/
│       ├── index.js              # Express server entry point
│       ├── config/
│       │   └── db.js             # PostgreSQL connection pool
│       ├── middleware/
│       │   ├── auth.js           # JWT token generation & verification
│       │   └── validation.js     # Request body validation
│       └── routes/
│           ├── auth.js           # POST /register, POST /login
│           └── donors.js         # Donor CRUD & search endpoints
│
└── frontend/
    ├── Dockerfile
    ├── nginx.conf                # Nginx config for production build
    ├── package.json
    ├── public/
    │   └── index.html
    └── src/
        ├── index.js              # React DOM entry point
        ├── App.js                # Root component with routing
        ├── AuthContext.js        # Global authentication state
        ├── constants.js          # Indian cities, states, blood groups
        ├── components/
        │   ├── Home.js           # Landing page
        │   ├── SignInSignUp.js   # Combined auth page
        │   ├── DonorRegister.js  # Donor registration form
        │   ├── DonorSearch.js    # Search donors interface
        │   ├── DonorUpdate.js    # Profile management
        │   └── ProtectedRoute.js # Auth guard wrapper
        └── styles/
            └── App.css           # Application styles
```

---

## 🌐 Deployment

### Deploying to Render

1. Push this repository to GitHub.
2. Create an account at [render.com](https://render.com).
3. Create a **PostgreSQL** database — note the connection string.
4. Create a **Web Service**:
   - Connect your GitHub repo.
   - Root directory: `backend`
   - Build command: `npm install`
   - Start command: `node src/index.js`
   - Add environment variables from the [Environment Variables](#-environment-variables) section.
5. Create a **Static Site**:
   - Connect your GitHub repo.
   - Root directory: `frontend`
   - Build command: `npm install && npm run build`
   - Publish directory: `build`
   - Add a rewrite rule for client-side routing: source `/*` → destination `/index.html`
6. Update the frontend's `package.json` `"proxy"` field (or set `REACT_APP_API_URL`) to point to your backend service URL.

### Deploying to Railway

1. Push the repository to GitHub.
2. Create an account at [railway.app](https://railway.app).
3. Click **New Project** → **Deploy from GitHub repo**.
4. Add a **PostgreSQL** database plugin — Railway automatically injects connection variables.
5. Set the start command to `cd backend && node src/index.js`.
6. Railway auto-detects the frontend; configure the build and publish directories in the frontend service settings.

### Production Considerations

- **Change the JWT secret** — set `JWT_SECRET` to a strong, random value.
- **Use environment variables** — never commit secrets to version control.
- **Enable HTTPS** — most platforms handle SSL termination automatically.
- **Database backups** — configure automated backups for the PostgreSQL database.

---

## 🗺️ Roadmap

- [ ] Email verification during sign-up
- [ ] Forgot password / reset password flow
- [ ] Admin dashboard for monitoring
- [ ] Donor eligibility expiry notifications
- [ ] In-app messaging between donors and recipients
- [ ] Blood request history for recipients
- [ ] Rate limiting and abuse prevention
- [ ] Unit and integration test suite

---

## 🤝 Contributing

Contributions are welcome! To get started:

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "Add your feature"`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a pull request.

Please ensure your code follows the existing style conventions.

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <sub>Built with ❤️ to save lives. Every donation counts.</sub>
</div>
