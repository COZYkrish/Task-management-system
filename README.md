# TaskFlow Pro

> A production-grade, full-stack Task Management SaaS — built like a real startup product.

![TaskFlow Pro](https://img.shields.io/badge/version-1.0.0-brightgreen) ![Node](https://img.shields.io/badge/Node.js-v18+-green) ![React](https://img.shields.io/badge/React-18-blue) ![Prisma](https://img.shields.io/badge/Prisma-v5-blueviolet)

---

## ✨ Features

- 🔐 **JWT Authentication** — Access (15min) + Refresh (7d) token rotation with HttpOnly cookies
- 📋 **Full Task CRUD** — Create, read, update, delete with pagination, search, and multi-filter
- 🎯 **Kanban Board** — Drag-and-drop with @dnd-kit, cross-column moves, real-time sync
- ⚡ **Real-Time Updates** — Socket.io broadcasts task changes to all connected clients
- 🔔 **Live Notifications** — Assignment and status change alerts via WebSocket
- 📊 **Activity Log** — Full audit trail of every task mutation with metadata diffs
- 🌙 **Dark Mode** — Glassmorphism design with electric violet primary palette
- 📱 **Fully Responsive** — Mobile-first, slide-in sidebar, touch-friendly
- 🛡️ **RBAC** — Admin/User roles with protected routes on both ends
- 🚀 **Production-Ready** — Helmet, CORS, rate limiting, error handling, Zod + Joi validation

---

## 🏗️ Architecture

```
task-management-system/
├── client/          # React 18 + Vite + Tailwind CSS + Framer Motion
└── server/          # Node.js + Express + Prisma ORM (SQLite/PostgreSQL)
```

### Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS v3, Framer Motion |
| Drag & Drop | @dnd-kit/core, @dnd-kit/sortable |
| State | Redux Toolkit |
| Backend | Node.js, Express.js |
| Database | SQLite (dev) / PostgreSQL (prod) via Prisma ORM |
| Auth | JWT (bcrypt + refresh tokens) |
| Real-time | Socket.io |
| Validation | Joi (server), Zod + react-hook-form (client) |
| Security | Helmet, CORS, express-rate-limit |

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- npm or yarn

### 1. Clone & Install

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Setup Database

```bash
cd server

# Push schema to SQLite (creates dev.db automatically)
.\node_modules\.bin\prisma db push

# Seed with demo data
node prisma/seed.js
```

### 3. Start Development Servers

**Terminal 1 — Backend:**
```bash
cd server
node src/app.js
# Server runs on http://localhost:5000
```

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
# App runs on http://localhost:5173
```

### 4. Login

Open `http://localhost:5173` in your browser.

| Role | Email | Password |
|---|---|---|
| Admin | admin@taskflow.com | Admin@1234 |
| User  | demo@taskflow.com  | User@1234  |

---

## 📡 API Reference

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new account |
| POST | `/api/auth/login` | Login, returns tokens |
| POST | `/api/auth/refresh` | Rotate refresh token |
| POST | `/api/auth/logout` | Invalidate session |

### Tasks
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/tasks` | List tasks (paginated, filterable) |
| POST | `/api/tasks` | Create task |
| GET | `/api/tasks/:id` | Get task + activity |
| PUT | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |
| PATCH | `/api/tasks/reorder` | Kanban bulk reorder |

### Users
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/users/me` | Get own profile |
| PUT | `/api/users/me` | Update profile |
| GET | `/api/users` | List all users (Admin) |

### Activity
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/activity` | Global activity feed |
| GET | `/api/activity/task/:id` | Per-task history |

---

## 📊 Database Schema

```
User ──── Task (as creator)
      └── Task (as assignee)
      └── ActivityLog

Task ──── ActivityLog
```

SQLite is used for development (zero setup). Switch to PostgreSQL by updating `.env`:
```
DATABASE_URL="postgresql://user:password@localhost:5432/taskflow"
```

---

## ⚡ WebSocket Events

| Event (Server → Client) | Trigger |
|---|---|
| `task:created` | New task added |
| `task:updated` | Any task field changed |
| `task:deleted` | Task removed |
| `notification:new` | User-targeted alert (assignment, etc.) |

---

## 🛡️ Security

- Passwords hashed with bcrypt (12 salt rounds)
- JWT access tokens expire in 15 minutes
- Refresh tokens stored in HttpOnly cookies (7 days)
- Refresh token rotation with reuse detection
- Helmet.js HTTP security headers
- CORS with explicit origin whitelist
- Rate limiting: 20 auth req/15min, 300 general req/15min
- Input validation with Joi (server) and Zod (client)

---

## 🗂️ Project Structure

```
server/
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.js            # Demo data seeder
└── src/
    ├── config/
    │   ├── db.js           # Prisma singleton
    │   └── socket.js       # Socket.io setup
    ├── controllers/        # Request handlers
    ├── middleware/         # Auth, RBAC, validation, errors
    ├── routes/             # Express route definitions
    ├── services/           # Business logic
    ├── validations/        # Joi schemas
    └── app.js              # Entry point

client/
└── src/
    ├── components/
    │   ├── auth/           # Auth forms
    │   ├── kanban/         # Drag-and-drop board
    │   ├── layout/         # Sidebar, Navbar, AppLayout
    │   ├── tasks/          # TaskCard, TaskForm, TaskModal
    │   └── ui/             # Avatar, Badge, Modal
    ├── features/
    │   ├── auth/           # authSlice.js
    │   ├── tasks/          # tasksSlice.js
    │   └── notifications/  # notificationsSlice.js
    ├── hooks/              # useSocket.js
    ├── pages/              # Dashboard, Kanban, Tasks, Activity, Profile
    ├── services/           # api.js (axios), socket.js
    ├── store/              # Redux store
    └── utils/              # helpers.js
```

---

## 🔧 Environment Variables

```env
# server/.env
DATABASE_URL="file:./dev.db"
PORT=5000
NODE_ENV=development
JWT_ACCESS_SECRET=your_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d
CLIENT_URL=http://localhost:5173
```

---

## 🚀 Production Upgrade Path

1. **Database**: Change `DATABASE_URL` to PostgreSQL connection string
2. **Email**: Add Nodemailer/SendGrid for assignment notifications
3. **File uploads**: Add Multer + S3 for task attachments
4. **Docker**: Add `docker-compose.yml` for containerized deployment
5. **Auth**: Add OAuth2 (Google/GitHub) via Passport.js

---

*Built with ❤️ by KRISH* 