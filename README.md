# ZENTRAX RBAC — MERN Stack (v3.0)

Decoupled React + Node.js + MongoDB refactor of the original SQLite monolith.

## Project Structure

```
zentrax-mern/
├── client/                         # React.js frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── context/
│   │   │   └── AuthContext.js      # JWT auth state (login, logout, authFetch)
│   │   ├── hooks/
│   │   │   └── useApi.js           # Authenticated data-fetching hook
│   │   ├── components/
│   │   │   └── layout/
│   │   │       ├── DashboardLayout.js   # Shared sidebar + header shell
│   │   │       └── DashboardLayout.css
│   │   ├── pages/
│   │   │   ├── LandingPage.js      # Public marketing + contact form
│   │   │   ├── LoginPage.js        # Login with demo credential fill
│   │   │   ├── LoginPage.css
│   │   │   ├── AdminDashboard.js   # Stats, Projects, Managers, Clients, Feedback
│   │   │   ├── ManagerDashboard.js # Assigned projects, milestones, uploads
│   │   │   ├── ClientDashboard.js  # Project overview, photos, specs, feedback
│   │   │   └── NotFound.js
│   │   ├── App.js                  # react-router-dom v6 routes + ProtectedRoute
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
│
└── server/                         # Node.js / Express backend
    ├── config/
    │   └── db.js                   # Mongoose connect + auto-seed
    ├── models/
    │   ├── User.js                 # bcrypt hashing, toJSON strips password
    │   ├── Project.js
    │   ├── Milestone.js
    │   └── index.js                # Upload, Specification, Feedback, Favorite, Contact
    ├── middleware/
    │   └── auth.js                 # JWT requireAuth + requireRole
    ├── controllers/
    │   ├── authController.js       # login (bcrypt compare + JWT sign), me, logout
    │   ├── adminController.js      # Mongoose equivalents of all admin SQL queries
    │   ├── managerController.js
    │   ├── clientController.js
    │   └── contactController.js
    ├── routes/
    │   ├── authRoutes.js
    │   ├── adminRoutes.js
    │   ├── managerRoutes.js
    │   ├── clientRoutes.js
    │   └── contactRoutes.js
    ├── server.js                   # Express app with CORS configured for React dev
    ├── .env.example
    └── package.json
```

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB running locally (`mongod`) **or** a MongoDB Atlas URI

### 1. Server

```bash
cd server
cp .env.example .env        # Edit MONGO_URI and JWT_SECRET
npm install
npm run dev                 # http://localhost:5000
```

On first start, the DB seeds three demo users and a sample project automatically.

### 2. Client

```bash
cd client
npm install
npm start                   # http://localhost:3000
```

The `"proxy": "http://localhost:5000"` in `client/package.json` forwards all
`/api/*` calls to the Express server — no CORS config needed in development.

### Demo Credentials

| Role    | Email                 | Password    |
|---------|-----------------------|-------------|
| Admin   | admin@zentrax.com     | admin123    |
| Manager | manager@zentrax.com   | manager123  |
| Client  | client@zentrax.com    | client123   |

## Key Architecture Changes (SQLite → MongoDB)

| Area | Before | After |
|------|--------|-------|
| Database | SQLite (`sqlite3`) | MongoDB via **Mongoose** |
| Schema | `CREATE TABLE` DDL in `database.js` | Mongoose Schema files in `models/` |
| Queries | Callback-style `db.get/run/all` | `async/await` Mongoose methods |
| Auth token | In-memory session map | **JWT** (`jsonwebtoken`) |
| Passwords | Plain-text in DB | **bcrypt** hashed via `pre('save')` hook |
| Relationships | `JOIN` SQL | Mongoose `.populate()` |
| Auto-seed | `INSERT OR IGNORE` SQL | `config/db.js` async seed function |
| Frontend | Multi-page HTML + vanilla JS | **React 18** SPA with `react-router-dom` v6 |
| State | `localStorage` + global vars | `useState`, `useEffect`, `useContext` |
| API calls | Inline `fetch` in HTML `<script>` | `useApi` hook + `AuthContext.authFetch` |
| Routing | Server-side redirects | Client-side `<Routes>` + `<ProtectedRoute>` |

## Production Build

```bash
# Build React
cd client && npm run build

# Serve the build from Express (add to server.js):
# const path = require('path');
# app.use(express.static(path.join(__dirname, '../client/build')));
# app.get('*', (req, res) => res.sendFile(path.join(__dirname, '../client/build/index.html')));
```
