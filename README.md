# RupeeWise AI 🚀
> **Turn Today's Choices Into Tomorrow's Freedom.**  
> *AI-Powered Financial Intelligence, Action Engine & Administration Platform*

---

## 📌 Executive Overview

**RupeeWise AI** (formerly PaisaPilot AI) is an intelligent personal finance and wealth orchestration platform built for high-impact financial clarity.

### Complete 5-Phase Implementation Status:
1. **Phase 1: Foundation & Authentication**
   - React + Vite + Redux Toolkit + Tailwind CSS frontend architecture.
   - Node.js + Express.js + Mongoose 5-tier repository architecture.
   - Genuine Google OAuth token verification (`google-auth-library`) with HttpOnly cookie sessions (`paisapilot_token`).
   - Server-enforced Role-Based Access Control (`client` and `admin`).
2. **Phase 2: Public Landing Page & Dashboard Shell**
   - High-conversion public landing page matching reference design aesthetics.
   - Client dashboard with greeting, metrics, and live financial charts.
3. **Phase 3: Transactions Engine & Persistence**
   - MongoDB persistence for Income & Expense records with categories, dates, and payment methods.
   - Strict multi-tenant user scoping (`{ userId: req.user.id }`).
   - Real-time monthly aggregations, cashflow calculations, and category breakdowns.
4. **Phase 4: AI Money Action Engine & Intelligence**
   - Deterministic **RupeeWise Financial Rules Engine** grounded in user transactions with optional Gemini provider support.
   - Interactive AI Money Coach chat with suggested prompts.
   - Personalized Spending Insights, micro-expense leakage detection, and recurring debit alerts.
   - Explainable Financial Wellness Score (0–100).
   - What-If Financial Simulator with dynamic reduction sliders and timeline projections.
   - Savings Goals management with live progress tracking and contributions.
   - Category Budgets with adherence status (`safe`, `warning`, `exceeded`).
5. **Phase 5: Admin Console, Security Hardening & Hackathon Readiness**
   - Full Administrative Console matching the RupeeWise dark teal & warm ivory theme.
   - Database aggregates: total users, active users (30d), total transactions, gross income/expense volume.
   - Paginated user directory with search by name/email and role filtering.
   - Administrative role management with self-demotion guards and last-administrator protection.
   - Non-sensitive system activity audit trail (`role_changed`, `user_login`, `transaction_created`).
   - System runtime diagnostics and persistence health monitoring.

---

## 🏛️ System Architecture

### 1. Backend 5-Tier Repository Pattern
```
HTTP Request
     │
     ▼
[ Routes ] ──────────── Attaches auth, RBAC, and CSRF verification middleware
     │
     ▼
[ Controllers ] ────── Extracts validated params, coordinates services, sends responses
     │                  (Controllers NEVER import or query Mongoose models directly)
     ▼
[ Services ] ───────── Domain logic: Financial analysis, AI rules engine, What-If simulation
     │
     ▼
[ Repositories ] ───── Encapsulates all Mongoose queries and persistence operations
     │
     ▼
[ Models / MongoDB ] ── User, Transaction, Goal, Budget, ActionRecommendation, ActivityLog
```

### 2. Frontend 4-Layer Architecture
```
[ Layer 1: UI ] ────── Reusable cards, widgets, sliders, charts, and layouts
     │                 (Zero direct axios requests or auth decisions in UI)
     ▼
[ Layer 2: Hooks ] ─── Custom hooks (useAuth, useAppSelector, useAppDispatch)
     │
     ▼
[ Layer 3: Services ]  Axios client with withCredentials: true and custom CSRF headers
     │
     ▼
[ Layer 4: Redux ] ─── Redux Toolkit store (authSlice, transactionSlice, aiSlice)
```

---

## 📁 Repository Structure

```
rupeewise/
├── client/                               # Frontend (React 18 + Vite + Tailwind CSS)
│   ├── src/
│   │   ├── app/                          # Redux Toolkit store & typed hooks
│   │   ├── components/
│   │   │   ├── admin/                    # AdminSidebar & control components
│   │   │   ├── dashboard/                # MetricCards, AI Coach Widget, What-If Simulator, Goals
│   │   │   ├── landing/                  # Navbar, Hero, Features, Showcase, Reviews, Footer
│   │   │   ├── transactions/             # AddTransactionModal, TransactionTable, Filters
│   │   │   └── ui/                       # Reusable UI primitives (Card, Badge, Button, Modal)
│   │   ├── features/                     # Redux slices & thunks (auth, transactions, ai)
│   │   ├── hooks/                        # useAuth custom hook
│   │   ├── layouts/                      # ClientLayout, AdminLayout, AuthLayout
│   │   ├── pages/                        # LandingPage, DashboardPage, TransactionsPage, AICoachPage, AdminDashboardPage
│   │   └── services/                     # apiClient, authService, transactionService, aiService, goalService, budgetService, adminService
│   ├── .env.example
│   └── package.json
├── server/                               # Backend (Node.js + Express.js + Mongoose)
│   ├── src/
│   │   ├── config/                       # env, database, constants
│   │   ├── controllers/                  # auth, transaction, ai, goal, budget, admin
│   │   ├── middleware/                   # authenticate, authorize, csrf, errorHandler, notFound
│   │   ├── models/                       # User, Transaction, Goal, Budget, ActionRecommendation, ActivityLog
│   │   ├── repositories/                 # user, transaction, goal, budget, recommendation, activityLog
│   │   ├── routes/                       # auth, transaction, ai, goal, budget, admin
│   │   ├── services/                     # auth, transaction, financialAnalysis, actionEngine, simulator, aiProvider, goal, budget, admin
│   │   └── tests/                        # 4 automated test suites (43 test assertions)
│   ├── .env.example
│   └── package.json
└── package.json                          # Root concurrently scripts
```

---

## ⚙️ Environment Variables

### Server Configuration (`server/.env`)
```bash
PORT=5000
CLIENT_URL=http://localhost:5173
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/rupeewise?retryWrites=true&w=majority
GOOGLE_CLIENT_ID=your-google-oauth-client-id.apps.googleusercontent.com
JWT_SECRET=super-secure-random-secret-key-at-least-32-chars
ADMIN_EMAILS=admin@rupeewise.ai,deepsandilya01@gmail.com
NODE_ENV=development

# Optional AI Provider (if omitted, RupeeWise Financial Rules Engine operates deterministically)
GEMINI_API_KEY=your-gemini-api-key-optional
```

### Client Configuration (`client/.env`)
```bash
VITE_API_BASE_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your-google-oauth-client-id.apps.googleusercontent.com
```

---

## 🚀 Running the Project

### 1. Install all dependencies:
```bash
npm.cmd run install:all
```

### 2. Run both Frontend and Backend concurrently:
```bash
npm.cmd run dev
```
- **Frontend App**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000/api](http://localhost:5000/api)
- **API Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

### 3. Production Build:
```bash
npm.cmd run build
```

---

## 🧪 Comprehensive Test Suite (43 / 43 Passed)

Execute all 4 automated test suites against MongoDB Atlas:
```bash
npm.cmd test
```

| Suite | File | Tests | Focus Area | Status |
|---|---|---|---|---|
| **Auth & Security** | `server/src/tests/test_endpoints.js` | 13 | Session cookies, CORS, Google token validation, allowlist dynamic revocation | **PASS** |
| **Transactions Engine** | `server/src/tests/test_transactions.js` | 10 | Transaction CRUD, multi-tenant data isolation, summaries, categories | **PASS** |
| **AI Action Engine** | `server/src/tests/test_ai_engine.js` | 10 | Grounded insights, recommendations, What-If simulator, goals, budgets | **PASS** |
| **Admin & Audit** | `server/src/tests/test_phase5_admin.js` | 10 | Admin aggregates, user directory search, self-demotion guards, audit log | **PASS** |

---

