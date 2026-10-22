# PaisaPilot AI 🚀
> **Track smarter. Spend better. Save faster.**  
> *AI-Powered Personal Finance Coach — Phase 1: Complete MERN Foundation + Google Auth + RBAC*

---

## 📌 Executive Overview

**PaisaPilot AI** is an intelligent personal finance co-pilot designed to streamline cashflow management, expense tracking, and savings automation with AI guidance.

**Phase 1 establishes the enterprise-grade foundation:**
- **Strict 4-Layer Frontend Architecture** in React + Vite + Redux Toolkit + Tailwind CSS.
- **Strict 5-Tier Backend Architecture** using the Repository Pattern in Node.js + Express.js + Mongoose.
- **Genuine Google Identity Services (GIS)** Sign-In with server-side token verification using `google-auth-library`.
- **Role-Based Access Control (RBAC)** supporting `client` and `admin` roles, backed by an uncompromisable server-side allowlist.
- **HttpOnly, Secure Cookie Sessions** preventing XSS token theft (no JWTs or tokens in `localStorage` or Redux).
- **Graceful Persistence Isolation**: Clean health monitoring and safe fallback behavior when MongoDB is not connected.
- **Prepared for Phase 2**: Bundled with `recharts` for financial charts and `papaparse` for bank CSV parsing.

---

## 🏛️ System Architecture

### 1. Backend 5-Tier Repository Pattern
```
HTTP Request
     │
     ▼
[ Routes ] ──────────── Attaches auth, RBAC, and Zod validation middleware
     │
     ▼
[ Controllers ] ────── Extracts validated params, coordinates services, sends responses
     │                  (Controllers NEVER import or query Mongoose models directly)
     ▼
[ Services ] ───────── Enforces business rules, Google token verification, dynamic role syncing
     │
     ▼
[ Repositories ] ───── Encapsulates all Mongoose queries and persistence operations
     │
     ▼
[ Models / MongoDB ] ── Schema definitions, constraints, indexes, timestamps
```

### 2. Frontend 4-Layer Architecture
```
[ Layer 1: UI ] ────── Reusable cards, buttons, badges, layouts, forms, and pages
     │                 (Zero direct axios requests or auth decisions in UI)
     ▼
[ Layer 2: Hooks ] ─── Custom hooks (useAuth) coordinating UI interactions and Redux actions
     │
     ▼
[ Layer 3: Services ]  Centralized Axios client with withCredentials: true and authService
     │
     ▼
[ Layer 4: Redux ] ─── Redux Toolkit store (authSlice, authThunks)
                       Stores ONLY: safe user profile, role, session status, non-sensitive errors.
                       NEVER stores JWTs, secrets, or Google tokens.
```

---

## 📁 Repository Structure

```
paisapilot/
├── client/                               # Frontend (React 18 + Vite + Tailwind CSS)
│   ├── public/
│   │   └── robots.txt
│   ├── src/
│   │   ├── app/
│   │   │   ├── hooks.js                  # Typed-free useAppDispatch & useAppSelector
│   │   │   └── store.js                  # Redux Toolkit store configuration
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   │   └── GoogleSignInButton.jsx# Official Google Identity Services integration
│   │   │   ├── navigation/
│   │   │   │   ├── Navbar.jsx            # Branding, live status pill, UserMenu
│   │   │   │   ├── Sidebar.jsx           # Responsive client and admin sidebar
│   │   │   │   └── UserMenu.jsx          # Profile dropdown and functional logout
│   │   │   └── ui/
│   │   │       ├── Alert.jsx             # Accessible status alerts
│   │   │       ├── Badge.jsx             # Role tags & Demo Data badges
│   │   │       ├── Button.jsx            # Reusable button with loading states
│   │   │       ├── Card.jsx              # 16px radius cards with subtle borders
│   │   │       ├── LoadingSpinner.jsx    # Accessible loading spinner
│   │   │       └── StatCard.jsx          # Financial KPI metric cards
│   │   ├── features/
│   │   │   └── auth/
│   │   │       ├── authSlice.js          # User, role, status reducers
│   │   │       └── authThunks.js         # initializeAuth, loginWithGoogle, logout
│   │   ├── hooks/
│   │   │   └── useAuth.js                # Unified hook coordinating auth state
│   │   ├── layouts/
│   │   │   ├── AdminLayout.jsx           # Admin console layout
│   │   │   ├── AuthLayout.jsx            # Authentication page layout
│   │   │   └── ClientLayout.jsx          # Client finance dashboard layout
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   │   └── AdminDashboardPage.jsx# Protected admin overview and user directory
│   │   │   ├── auth/
│   │   │   │   └── LoginPage.jsx         # Google Sign-In, branding, system status
│   │   │   ├── client/
│   │   │   │   └── DashboardPage.jsx     # Net worth, Recharts demo, demo transactions
│   │   │   └── NotFoundPage.jsx          # 404 handler
│   │   ├── routes/
│   │   │   ├── ProtectedRoute.jsx        # Enforces active session; redirects to /login
│   │   │   └── RoleRoute.jsx             # Enforces role === 'admin'; 403 guard
│   │   ├── services/
│   │   │   ├── apiClient.js              # Centralized Axios with credentials
│   │   │   └── authService.js            # API request handlers
│   │   ├── utils/
│   │   │   └── formatters.js             # Currency (₹ INR) and date formatting
│   │   ├── App.jsx                       # Master router
│   │   ├── index.css                     # Design tokens (#F7F7F2, #174B38)
│   │   └── main.jsx                      # App entry point
│   ├── .env.example                      # Client environment variables template
│   ├── index.html                        # Google Identity Services script & fonts
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js                    # Vite dev server on port 5173
│
├── server/                               # Backend (Node.js + Express.js + Mongoose)
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js               # MongoDB connection and status diagnostics
│   │   │   └── env.js                    # Environment parsing and ADMIN_EMAILS check
│   │   ├── controllers/
│   │   │   └── authController.js         # HTTP handlers (Zero direct model queries)
│   │   ├── middleware/
│   │   │   ├── authenticate.js           # Verifies HttpOnly JWT session cookie
│   │   │   ├── authorize.js              # Enforces RBAC with instant revocation check
│   │   │   ├── csrf.js                   # CSRF origin & custom header verification
│   │   │   ├── errorHandler.js           # Centralized error handler
│   │   │   ├── notFound.js               # 404 route handler
│   │   │   └── validate.js               # Zod request validation
│   │   ├── models/
│   │   │   └── User.js                   # Mongoose schema, validation, indexes
│   │   ├── repositories/
│   │   │   └── userRepository.js         # Dedicated database query operations
│   │   ├── routes/
│   │   │   ├── adminRoutes.js            # GET /api/admin/overview
│   │   │   ├── authRoutes.js             # POST /api/auth/google, /me, /logout
│   │   │   └── healthRoutes.js           # GET /api/health
│   │   ├── services/
│   │   │   └── authService.js            # Google token verification and provisioning
│   │   ├── tests/
│   │   │   └── test_endpoints.js         # Automated backend test suite
│   │   ├── utils/
│   │   │   └── token.js                  # JWT generation and cookie handlers
│   │   ├── app.js                        # Express app setup and middleware chain
│   │   └── server.js                     # Server entry point on port 5000
│   ├── .env.example                      # Server environment variables template
│   └── package.json
│
├── .gitignore
├── package.json                          # Root development orchestrator
└── README.md
```

---

## 🔒 Security Specifications

1. **HttpOnly Cookie Sessions**:
   - The session JWT is stored in an `HttpOnly`, `SameSite=Lax`, `Secure` (in production) cookie.
   - It cannot be read or stolen by JavaScript, protecting against XSS attacks.
   - Client Redux store only holds safe user metadata (`id`, `name`, `email`, `role`, `picture`).

2. **Server-Side Google Verification**:
   - The client receives an ID token directly from Google Identity Services.
   - The backend validates the signature, audience (`GOOGLE_CLIENT_ID`), issuer (`accounts.google.com`), and expiry using `google-auth-library`.
   - Client-supplied names, emails, and roles are never trusted.

3. **Strict RBAC & Instant Revocation**:
   - Any new authenticated Google account defaults to the `client` role.
   - The `admin` role is granted exclusively if the verified email is listed in the server-side `ADMIN_EMAILS` environment variable.
   - On every request to an admin endpoint, the backend checks the current allowlist. If an admin email is removed, their admin privileges are instantly revoked without waiting for token expiry.

4. **CSRF Defense**:
   - Enforces Origin and Referer verification on state-changing methods (`POST`, `PUT`, `DELETE`).
   - Requires custom request header (`X-Requested-With: XMLHttpRequest`), which cannot be sent by simple cross-site HTML forms.

5. **Rate Limiting & Input Validation**:
   - `express-rate-limit` guards the `/api/auth/google` endpoint against credential stuffing and brute force.
   - Zod schema validates incoming request payloads.

---

## ⚙️ Environment Variables

### Server Configuration (`server/.env`)

Copy `server/.env.example` to `server/.env`:
```bash
PORT=5000
CLIENT_URL=http://localhost:5173
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/paisapilot?retryWrites=true&w=majority
GOOGLE_CLIENT_ID=your-google-oauth-client-id.apps.googleusercontent.com
JWT_SECRET=your-random-32-char-secret-key-at-least-32-chars
ADMIN_EMAILS=admin@paisapilot.ai,deeps@paisapilot.ai
NODE_ENV=development
```

| Variable | Required | Description |
|---|---|---|
| `PORT` | Optional (default: `5000`) | Port on which the Express server listens |
| `CLIENT_URL` | Required | Allowed CORS origin for the Vite frontend (`http://localhost:5173`) |
| `MONGODB_URI` | Required for persistent users | MongoDB Atlas connection string |
| `GOOGLE_CLIENT_ID` | Required for Google Auth | OAuth 2.0 Web Client ID from Google Cloud Console |
| `JWT_SECRET` | Required in production | Secret key used to sign session cookies |
| `ADMIN_EMAILS` | Optional | Comma-separated allowlist of emails granted the `admin` role |
| `NODE_ENV` | Optional | `development` or `production` |

### Client Configuration (`client/.env`)

Copy `client/.env.example` to `client/.env`:
```bash
VITE_API_BASE_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your-google-oauth-client-id.apps.googleusercontent.com
```

| Variable | Required | Description |
|---|---|---|
| `VITE_API_BASE_URL` | Required | URL to the backend API (`http://localhost:5000/api`) |
| `VITE_GOOGLE_CLIENT_ID` | Required for Google Auth | Must match `GOOGLE_CLIENT_ID` configured on the server |

---

## 🛠️ Step-by-Step Google OAuth & MongoDB Setup

### Obtaining Google OAuth Client ID:
1. Navigate to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project named `PaisaPilot AI`.
3. Go to **APIs & Services > Credentials**.
4. Configure the **OAuth Consent Screen**:
   - User Type: **External**
   - App Name: `PaisaPilot AI`
   - User support email & Developer contact email.
5. Create Credentials > **OAuth client ID**:
   - Application type: **Web application**
   - Name: `PaisaPilot Web Client`
   - **Authorized JavaScript origins**: `http://localhost:5173`
   - **Authorized redirect URIs**: `http://localhost:5173`
6. Copy the generated **Client ID** into both `server/.env` and `client/.env`.

### Obtaining MongoDB Atlas Connection String:
1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/atlas).
2. Create a database user with read/write access.
3. In **Network Access**, add your IP or `0.0.0.0/0` (for development).
4. Click **Connect > Drivers > Node.js** and copy the URI into `server/.env` (`MONGODB_URI`).

---

## 🚀 Running the Project

### 1. Install all dependencies:
```bash
npm run install:all
```
*(or run `npm.cmd install` in root, `client`, and `server`)*

### 2. Run both Frontend and Backend concurrently:
```bash
npm run dev
```

- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000/api](http://localhost:5000/api)
- **Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

### 3. Individual run commands:
- Run server only: `npm run dev:server`
- Run client only: `npm run dev:client`
- Build client bundle: `npm run build`
- Run backend verification suite: `npm run test:server`

---

## ✅ Verification Results

The automated test suite (`server/src/tests/test_endpoints.js`) validates all architectural and security requirements:

| # | Check / Test Case | Result |
|---|---|---|
| 1 | Controller does not import or query Mongoose models directly | **PASS** |
| 2 | `GET /api/health` reports server uptime & MongoDB connection status | **PASS** |
| 3 | Unauthenticated `GET /api/auth/me` is rejected with `401 Unauthorized` | **PASS** |
| 4 | Unauthenticated `GET /api/admin/overview` is rejected with `401 Unauthorized` | **PASS** |
| 5 | Invalid / empty Google credential in `POST /api/auth/google` rejected (`400`/`401`) | **PASS** |
| 6 | Authenticated `client` accessing admin route is rejected with `403 Forbidden` | **PASS** |
| 7 | Authenticated `client` successfully restores session via `GET /api/auth/me` | **PASS** |
| 8 | Authorized `admin` email access to `GET /api/admin/overview` succeeds with metrics | **PASS** |
| 9 | `POST /api/auth/logout` clears `HttpOnly` session cookie (`Max-Age=0`) | **PASS** |
| 10| Frontend production build passes with `vite build` | **PASS** |
