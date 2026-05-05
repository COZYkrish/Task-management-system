# 🎯 TaskFlow Pro — Advanced Task Management System

> **Enterprise-grade, full-stack Task Management Application** — Production-ready with real-time collaboration, Kanban boards, and comprehensive audit trails.

<div align="center">

![TaskFlow Pro](https://img.shields.io/badge/version-1.0.0-brightgreen) ![Node](https://img.shields.io/badge/Node.js-v18+-green) ![React](https://img.shields.io/badge/React-19-blue) ![Prisma](https://img.shields.io/badge/Prisma-v5-blueviolet) ![SQLite](https://img.shields.io/badge/Database-SQLite-003B57) ![Socket.IO](https://img.shields.io/badge/WebSocket-Socket.IO-010101)

**[🏠 Features](#-features)** • **[🎯 Workflow](#-complete-workflow-diagram)** • **[🏗️ Architecture](#-architecture)** • **[🚀 Getting Started](#-getting-started)** • **[📚 API Docs](#-api-documentation)** • **[🔐 Security](#-security-features)**

</div>

---

## ✨ Features

### 🔐 Authentication & Authorization
- **JWT Token Management** — Dual-token system with 15-minute access + 7-day refresh tokens
- **HttpOnly Cookies** — Secure token storage, CSRF-protected
- **Role-Based Access Control (RBAC)** — Admin and User roles with granular permissions
- **Password Security** — bcryptjs hashing with salt rounds
- **Automatic Token Rotation** — Seamless refresh on backend via middleware

### 📋 Task Management
- **Full CRUD Operations** — Create, read, update, delete tasks with complete validation
- **Advanced Filtering** — Filter by status (TODO/IN_PROGRESS/COMPLETED), priority (LOW/MEDIUM/HIGH), assignee
- **Pagination & Sorting** — Efficient data loading with cursor-based pagination
- **Search Functionality** — Full-text search across task titles and descriptions
- **Bulk Operations** — Update multiple tasks simultaneously
- **Task Metadata** — Tags, due dates, priorities, descriptions with rich formatting

### 🎯 Kanban Board
- **Drag & Drop Interface** — Smooth animations using @dnd-kit library
- **Cross-Column Moves** — Move tasks between TODO → IN_PROGRESS → COMPLETED
- **Real-Time Sync** — WebSocket updates reflect changes across all connected clients instantly
- **Persistent Ordering** — Custom sort order maintained in database
- **Visual State Management** — Status badges, priority indicators, assignee avatars

### ⚡ Real-Time Features
- **WebSocket Broadcasting** — Socket.io enables instant updates across all connected users
- **Live Task Updates** — Changes visible to all team members without page refresh
- **Connection Management** — Automatic reconnection with exponential backoff
- **Presence Indicators** — See who's online and actively working

### 🔔 Notifications
- **Task Assignment Alerts** — Notify users when assigned to a task
- **Status Change Notifications** — Real-time updates when task status changes
- **Activity Mentions** — Notifications when referenced in comments (future enhancement)
- **Toast System** — Non-intrusive in-app notifications with dismiss options
- **Notification History** — Access past notifications in dedicated panel

### 📊 Activity Logging & Audit Trail
- **Complete Audit Trail** — Every action logged with timestamp and user info
- **Metadata Tracking** — Before/after values for all changes
- **Action Types** — Created, Updated, Status Changed, Assigned, Deleted
- **User Attribution** — Every activity linked to specific user
- **Compliance Ready** — Full history for audits and compliance requirements

### 🌙 UI/UX
- **Dark Mode Design** — Glassmorphism effects with electric violet primary palette
- **Tailwind CSS v3** — Utility-first CSS with custom theme
- **Framer Motion Animations** — Smooth transitions and micro-interactions
- **Responsive Design** — Mobile-first approach, works on all devices
- **Accessibility** — WCAG 2.1 compliant, keyboard navigation support
- **Loading States** — Skeleton screens and spinners for better UX

### 📱 Responsive & Mobile
- **Mobile-First Design** — Optimized for small screens first
- **Slide-In Sidebar** — Collapsible navigation on mobile
- **Touch-Friendly Interactions** — Large tap targets, swipe support
- **Adaptive Layouts** — Responsive cards, modals, and forms

### 🛡️ Security
- **Helmet.js** — HTTP headers security
- **CORS Protection** — Configured origin whitelist
- **Rate Limiting** — API endpoints protected against brute force
- **Input Validation** — Joi (server) + Zod + React Hook Form (client)
- **SQL Injection Prevention** — Prisma ORM parameterized queries
- **XSS Protection** — React's built-in XSS protection + DOMPurify
- **CSRF Tokens** — Token validation on state-changing operations

---

## 🎯 Complete Workflow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         TASKFLOW PRO - USER WORKFLOW                        │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────────┐
│   USER LAUNCH    │
└────────┬─────────┘
         │
         ▼
┌──────────────────────────────┐      ┌──────────────────────────┐
│   1️⃣  AUTHENTICATION FLOW   │      │  2️⃣  INITIALIZATION      │
├──────────────────────────────┤      ├──────────────────────────┤
│ • User visits app            │      │ • Redux store setup      │
│ • Check localStorage token   │      │ • Socket.io connection   │
│ • If no token → Register     │      │ • Load initial tasks     │
│ • Email + Password input     │      │ • Fetch user profile     │
│ • Bcrypt verification        │      │ • Subscribe to updates   │
│ • JWT tokens issued          │      │ • Load notifications     │
│ • Stored as HttpOnly cookies │      │ • Initialize theme       │
│ • Redirect to Dashboard      │      │ • Permission check       │
└──────────────────────────────┘      └──────────────────────────┘
         │                                       │
         └───────────────────┬───────────────────┘
                             ▼
                    ┌────────────────────────┐
                    │  3️⃣  DASHBOARD VIEW  │
                    ├────────────────────────┤
                    │ ┌──────────────────┐   │
                    │ │ Recent Tasks     │   │
                    │ │ Activity Stream  │   │
                    │ │ Quick Stats      │   │
                    │ │ Notifications    │   │
                    │ └──────────────────┘   │
                    └────────────────────────┘
                             │
            ┌────────────────┼────────────────┐
            │                │                │
            ▼                ▼                ▼
    ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
    │  VIEW KANBAN     │  │  VIEW ALL TASKS  │  │  VIEW ACTIVITY   │
    │  BOARD           │  │  IN LIST FORMAT  │  │  LOG             │
    └────────┬─────────┘  └────────┬─────────┘  └────────┬─────────┘
             │                     │                     │
             ▼                     ▼                     ▼
    ┌──────────────────────────────────────────────────────────────┐
    │         4️⃣  TASK INTERACTION FLOWS                          │
    ├──────────────────────────────────────────────────────────────┤
    │                                                              │
    │  CREATE NEW TASK                                            │
    │  ├─ Click "New Task" button                                 │
    │  ├─ Fill form: Title, Description, Priority, Due Date      │
    │  ├─ Validate with Zod schema                               │
    │  ├─ POST /api/tasks (with JWT auth)                        │
    │  ├─ Server validates with Joi                              │
    │  ├─ Create in database via Prisma                          │
    │  ├─ Emit Socket event: task:created                        │
    │  ├─ All clients receive update                             │
    │  └─ Redux state updates automatically                      │
    │                                                              │
    │  VIEW TASK DETAILS                                          │
    │  ├─ Click on task card                                      │
    │  ├─ Modal opens with full details                           │
    │  ├─ GET /api/tasks/:id                                      │
    │  ├─ Display form with all properties                        │
    │  ├─ Show activity history for this task                     │
    │  └─ Display assigned user info                              │
    │                                                              │
    │  UPDATE TASK                                                │
    │  ├─ Edit any field (title, desc, priority, etc)            │
    │  ├─ Validate all inputs                                     │
    │  ├─ PATCH /api/tasks/:id                                    │
    │  ├─ Prisma updates database                                 │
    │  ├─ Emit Socket: task:updated with metadata                │
    │  ├─ Log activity: "updated"                                 │
    │  ├─ Broadcast to all connected clients                      │
    │  └─ Toast notification: "Task updated"                      │
    │                                                              │
    │  ASSIGN TASK TO USER                                        │
    │  ├─ Click "Assign" in task details                          │
    │  ├─ Select user from dropdown                               │
    │  ├─ PATCH /api/tasks/:id with assigneeId                   │
    │  ├─ Update database                                         │
    │  ├─ Emit Socket: task:assigned                              │
    │  ├─ Notify assignee (Socket notification)                   │
    │  ├─ Log activity: "assigned"                                │
    │  └─ Redux updates local state                               │
    │                                                              │
    │  CHANGE TASK STATUS (Kanban Drag & Drop)                    │
    │  ├─ Drag task from TODO → IN_PROGRESS                       │
    │  ├─ @dnd-kit handles drag interaction                       │
    │  ├─ Optimistic UI update (instant visual feedback)          │
    │  ├─ PATCH /api/tasks/:id with new status                   │
    │  ├─ Server validates status transition                      │
    │  ├─ Update task.status in database                          │
    │  ├─ Emit Socket: task:status_changed                        │
    │  ├─ Log activity with before/after status                   │
    │  ├─ Send notification to assignee                           │
    │  └─ Redux + WebSocket sync all clients                      │
    │                                                              │
    │  DELETE TASK                                                │
    │  ├─ Click delete button in task menu                        │
    │  ├─ Confirmation dialog appears                             │
    │  ├─ DELETE /api/tasks/:id                                   │
    │  ├─ Soft delete or hard delete (configurable)               │
    │  ├─ Emit Socket: task:deleted                               │
    │  ├─ Remove from Redux state                                 │
    │  ├─ Log activity: "deleted"                                 │
    │  └─ Update all client views                                 │
    │                                                              │
    │  FILTER & SEARCH TASKS                                      │
    │  ├─ Use filter sidebar                                      │
    │  ├─ Select: Status, Priority, Assignee                      │
    │  ├─ Enter search query                                      │
    │  ├─ GET /api/tasks?status=&priority=&search=                │
    │  ├─ Server applies filters with Prisma                      │
    │  ├─ Return paginated results                                │
    │  ├─ Update Redux with filtered tasks                        │
    │  └─ Client displays filtered list                           │
    │                                                              │
    └──────────────────────────────────────────────────────────────┘
             │
             ▼
    ┌──────────────────────────────────────────────┐
    │  5️⃣  REAL-TIME SYNCHRONIZATION             │
    ├──────────────────────────────────────────────┤
    │                                              │
    │  SOCKET.IO EVENT FLOW:                       │
    │  ┌────────────────────────────────────────┐  │
    │  │ Client A: Updates task status          │  │
    │  │ ↓                                       │  │
    │  │ PATCH /api/tasks/123                   │  │
    │  │ ↓                                       │  │
    │  │ Server processes (validate + save)     │  │
    │  │ ↓                                       │  │
    │  │ emit('task:status_changed', {          │  │
    │  │   taskId, oldStatus, newStatus,        │  │
    │  │   updatedAt, updatedBy                 │  │
    │  │ })                                      │  │
    │  │ ↓                                       │  │
    │  │ Socket broadcasts to ALL clients       │  │
    │  │ ↓                                       │  │
    │  │ Client A: Redux dispatches action      │  │
    │  │ Client B: Redux dispatches action      │  │
    │  │ Client C: Redux dispatches action      │  │
    │  │ ↓                                       │  │
    │  │ All UI's re-render with new state      │  │
    │  │ ↓                                       │  │
    │  │ Toast notifications appear             │  │
    │  │ Kanban board updates visually          │  │
    │  │ Activity log refreshes                 │  │
    │  └────────────────────────────────────────┘  │
    └──────────────────────────────────────────────┘
             │
             ▼
    ┌──────────────────────────────────────────────┐
    │  6️⃣  ACTIVITY LOG & AUDIT TRAIL            │
    ├──────────────────────────────────────────────┤
    │                                              │
    │  Every action creates ActivityLog entry:    │
    │                                              │
    │  CREATE                                      │
    │  ├─ userId: "user-123"                       │
    │  ├─ taskId: "task-456"                       │
    │  ├─ action: "created"                        │
    │  ├─ metadata: { title, priority, ... }       │
    │  └─ createdAt: timestamp                     │
    │                                              │
    │  UPDATE                                      │
    │  ├─ action: "updated"                        │
    │  ├─ metadata: {                              │
    │  │   changedFields: {                        │
    │  │     status: { from, to },                 │
    │  │     priority: { from, to }                │
    │  │   }                                       │
    │  │ }                                         │
    │  └─ userId: "user-789"                       │
    │                                              │
    │  ASSIGNED                                    │
    │  ├─ action: "assigned"                       │
    │  ├─ metadata: {                              │
    │  │   assignedTo: "user-999",                 │
    │  │   assignedBy: "user-123",                 │
    │  │   notificationSent: true                  │
    │  │ }                                         │
    │  └─ Shows complete change history            │
    │                                              │
    │  GET /api/activity/task/:taskId              │
    │  Returns full timeline with user avatars     │
    │                                              │
    └──────────────────────────────────────────────┘
             │
             ▼
    ┌──────────────────────────────────────────────┐
    │  7️⃣  NOTIFICATIONS PANEL                    │
    ├──────────────────────────────────────────────┤
    │                                              │
    │  Socket Events Trigger Notifications:        │
    │                                              │
    │  task:assigned                               │
    │  ├─ "You've been assigned: Build API"        │
    │  ├─ Shows assignee avatar                    │
    │  ├─ Click to navigate to task                │
    │  └─ Mark as read                             │
    │                                              │
    │  task:status_changed (if assigned to me)     │
    │  ├─ "Task status: In Progress → Completed"   │
    │  ├─ Shows task name                          │
    │  └─ Auto-dismiss in 5 seconds                │
    │                                              │
    │  notification:new                            │
    │  ├─ Toast in bottom right                    │
    │  ├─ Notification bell badge updates          │
    │  ├─ Add to notification history              │
    │  └─ Store in Redux state                     │
    │                                              │
    └──────────────────────────────────────────────┘
             │
             ▼
    ┌──────────────────────────────────────────────┐
    │  8️⃣  USER PROFILE & SETTINGS               │
    ├──────────────────────────────────────────────┤
    │                                              │
    │  View Profile                                │
    │  ├─ GET /api/users/me                        │
    │  ├─ Display name, email, avatar              │
    │  ├─ Show assigned tasks count                │
    │  ├─ Display activity history                 │
    │  └─ Edit profile picture                     │
    │                                              │
    │  Update Settings                             │
    │  ├─ Change password (bcrypt hash)            │
    │  ├─ Update profile info                      │
    │  ├─ Notification preferences                 │
    │  ├─ Theme preference (dark/light)            │
    │  └─ API call: PATCH /api/users/:id           │
    │                                              │
    │  Logout                                      │
    │  ├─ Clear Redux state                        │
    │  ├─ Remove tokens from localStorage          │
    │  ├─ Close Socket.io connection               │
    │  ├─ DELETE /api/auth/logout                  │
    │  └─ Redirect to login                        │
    │                                              │
    └──────────────────────────────────────────────┘
             │
             ▼
    ┌──────────────────────────────────────────────┐
    │  Backend Validation & Security              │
    ├──────────────────────────────────────────────┤
    │                                              │
    │  1. Authentication Middleware                │
    │     ├─ Check JWT token                       │
    │     ├─ Verify signature                      │
    │     ├─ Attach user to req.user               │
    │     └─ Return 401 if invalid                 │
    │                                              │
    │  2. Authorization Middleware                 │
    │     ├─ Check user role                       │
    │     ├─ Verify resource ownership             │
    │     └─ Return 403 if unauthorized            │
    │                                              │
    │  3. Input Validation (Joi)                   │
    │     ├─ Validate request body                 │
    │     ├─ Check data types & constraints        │
    │     ├─ Sanitize inputs                       │
    │     └─ Return 400 with error details         │
    │                                              │
    │  4. Database Operations (Prisma)             │
    │     ├─ Parameterized queries                 │
    │     ├─ Prevent SQL injection                 │
    │     ├─ Type-safe operations                  │
    │     └─ Automatic timestamps                  │
    │                                              │
    │  5. Error Handling                           │
    │     ├─ Centralized error handler             │
    │     ├─ Proper HTTP status codes              │
    │     ├─ Log errors securely                   │
    │     └─ Don't expose sensitive info           │
    │                                              │
    └──────────────────────────────────────────────┘

```

---

## 🏗️ Architecture

### System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                     TASKFLOW PRO - SYSTEM DESIGN                     │
└─────────────────────────────────────────────────────────────────────┘

                            🌐 FRONTEND (React)
                                    │
                    ┌───────────────┼───────────────┐
                    ▼               ▼               ▼
            ┌────────────────┐ ┌──────────┐ ┌─────────────┐
            │  Pages Layer   │ │Component │ │ Redux Store │
            ├────────────────┤ │  Layer   │ └─────────────┘
            │ • Login        │ └──────────┘       │
            │ • Dashboard    │                    │
            │ • Tasks        │   ┌─────────────┐  │
            │ • Kanban       │   │ React Router│  │
            │ • Activity     │   └─────────────┘  │
            │ • Profile      │                    │
            └────────┬───────┘                    │
                     │ API Calls                  │
                     │ (Axios)                    │
                     │                            │
                ┌────┴────┐                       │
                │          │                      │
        ┌───────▼────┐ ┌───▼──────────┐          │
        │  REST API  │ │  Socket.IO   │          │
        │  Endpoints │ │ WebSocket    │◄─────────┘
        └───────┬────┘ └───┬──────────┘  (Real-time updates)
                │           │
                └─────┬─────┘
                      │
          HTTP/HTTPS │ & WebSocket
          (TCP Layer)
                      │
        ┌─────────────▼──────────────┐
        │    🖥️ BACKEND (Express.js)  │
        └─────────────┬──────────────┘
                      │
        ┌─────────────┴──────────────────────┐
        │                                    │
    ┌───▼────────────┐        ┌──────────────▼──────┐
    │   API Routes   │        │   Socket.IO Handler │
    ├────────────────┤        ├─────────────────────┤
    │ /api/auth/*    │        │ • Connection mgmt   │
    │ /api/tasks/*   │        │ • Event broadcasting│
    │ /api/users/*   │        │ • Room management   │
    │ /api/activity/*│        │ • Disconnect logic  │
    └───┬────────────┘        └─────────────────────┘
        │
    ┌───▼──────────────────────┐
    │  Middleware Stack        │
    ├──────────────────────────┤
    │ • Helmet (Security)      │
    │ • CORS                   │
    │ • Rate Limiting          │
    │ • Authentication         │
    │ • Authorization (RBAC)   │
    │ • Validation (Joi)       │
    │ • Error Handling         │
    └───┬──────────────────────┘
        │
    ┌───▼─────────────────┐
    │  Controllers        │
    ├─────────────────────┤
    │ • authController    │
    │ • taskController    │
    │ • userController    │
    │ • activityController│
    └───┬─────────────────┘
        │
    ┌───▼──────────────────────────┐
    │  Services Layer              │
    ├──────────────────────────────┤
    │ • authService (JWT, bcrypt)  │
    │ • taskService (CRUD logic)   │
    │ • userService (User ops)     │
    │ • activityService (Logging)  │
    └───┬──────────────────────────┘
        │
    ┌───▼──────────────────────────────┐
    │  ORM Layer (Prisma Client)       │
    ├──────────────────────────────────┤
    │ Type-safe database queries       │
    │ Automatic migrations             │
    │ Connection pooling               │
    └───┬──────────────────────────────┘
        │
    ┌───▼──────────────────────────────┐
    │  📁 Database (SQLite / PostgreSQL)│
    ├──────────────────────────────────┤
    │ ┌──────────────────────────────┐ │
    │ │ Users Table                  │ │
    │ ├──────────────────────────────┤ │
    │ │ • id (UUID)                  │ │
    │ │ • name, email, password      │ │
    │ │ • role, avatar, refreshToken │ │
    │ │ • createdAt, updatedAt       │ │
    │ └──────────────────────────────┘ │
    │                                  │
    │ ┌──────────────────────────────┐ │
    │ │ Tasks Table                  │ │
    │ ├──────────────────────────────┤ │
    │ │ • id, title, description     │ │
    │ │ • status, priority, tags     │ │
    │ │ • dueDate, order (Kanban)    │ │
    │ │ • assigneeId, creatorId (FK) │ │
    │ │ • createdAt, updatedAt       │ │
    │ └──────────────────────────────┘ │
    │                                  │
    │ ┌──────────────────────────────┐ │
    │ │ ActivityLog Table            │ │
    │ ├──────────────────────────────┤ │
    │ │ • id                         │ │
    │ │ • action (created/updated)   │ │
    │ │ • metadata (JSON changes)    │ │
    │ │ • taskId, userId (FK)        │ │
    │ │ • createdAt                  │ │
    │ └──────────────────────────────┘ │
    └──────────────────────────────────┘

```

### Directory Structure

```
task-management-system/
├── 📁 client/                      # React 18 Frontend Application
│   ├── 📄 package.json             # Dependencies & scripts
│   ├── 📄 vite.config.js           # Build configuration
│   ├── 📄 tailwind.config.js       # Tailwind CSS theme
│   ├── 📄 postcss.config.js        # PostCSS processors
│   ├── 📄 index.html               # Entry HTML
│   ├── 📁 src/
│   │   ├── 📄 main.jsx             # React DOM render
│   │   ├── 📄 App.jsx              # Root component
│   │   ├── 📄 App.css              # Global styles
│   │   ├── 📄 index.css            # Tailwind imports
│   │   │
│   │   ├── 📁 pages/               # Page components (routed)
│   │   │   ├── LoginPage.jsx       # Authentication form
│   │   │   ├── RegisterPage.jsx    # User registration
│   │   │   ├── DashboardPage.jsx   # Main dashboard view
│   │   │   ├── TasksPage.jsx       # Tasks list view
│   │   │   ├── KanbanPage.jsx      # Kanban board view
│   │   │   ├── ActivityPage.jsx    # Activity log view
│   │   │   └── ProfilePage.jsx     # User profile
│   │   │
│   │   ├── 📁 components/          # Reusable UI components
│   │   │   ├── 📁 auth/            # Authentication components
│   │   │   ├── 📁 layout/          # Layout components
│   │   │   │   ├── AppLayout.jsx   # Main layout wrapper
│   │   │   │   ├── Navbar.jsx      # Top navigation bar
│   │   │   │   └── Sidebar.jsx     # Side navigation
│   │   │   ├── 📁 tasks/           # Task-related components
│   │   │   │   ├── TaskCard.jsx    # Task display card
│   │   │   │   ├── TaskForm.jsx    # Task create/edit form
│   │   │   │   └── TaskModal.jsx   # Task modal dialog
│   │   │   ├── 📁 kanban/          # Kanban board components
│   │   │   │   └── KanbanBoard.jsx # Drag-drop board
│   │   │   ├── 📁 notifications/   # Notification components
│   │   │   └── 📁 ui/              # Generic UI components
│   │   │       ├── Modal.jsx       # Modal dialog
│   │   │       ├── Badge.jsx       # Badge component
│   │   │       └── Avatar.jsx      # User avatar
│   │   │
│   │   ├── 📁 features/            # Redux feature slices
│   │   │   ├── 📁 auth/
│   │   │   │   └── authSlice.js    # Auth state & actions
│   │   │   ├── 📁 tasks/
│   │   │   │   └── tasksSlice.js   # Tasks state & actions
│   │   │   ├── 📁 notifications/
│   │   │   │   └── notificationsSlice.js
│   │   │   └── 📁 activity/        # Activity state
│   │   │
│   │   ├── 📁 store/               # Redux configuration
│   │   │   └── index.js            # Store setup
│   │   │
│   │   ├── 📁 services/            # API & WebSocket services
│   │   │   ├── api.js              # Axios instance & endpoints
│   │   │   └── socket.js           # Socket.io connection
│   │   │
│   │   ├── 📁 hooks/               # Custom React hooks
│   │   │   └── useSocket.js        # Socket event listener hook
│   │   │
│   │   ├── 📁 utils/               # Utility functions
│   │   │   └── helpers.js          # Helper functions
│   │   │
│   │   └── 📁 assets/              # Images, fonts, etc
│   │
│   └── 📁 public/                  # Static assets
│
└── 📁 server/                      # Node.js Backend Application
    ├── 📄 package.json             # Dependencies & scripts
    ├── 📄 .env.example             # Environment variables template
    ├── 📄 .gitignore               # Git ignore rules
    │
    ├── 📁 prisma/                  # Database schema & migrations
    │   ├── 📄 schema.prisma        # Database models
    │   └── 📄 seed.js              # Database seeding script
    │
    └── 📁 src/
        ├── 📄 app.js               # Express app setup
        ├── 📄 server.js            # Server start (HTTP + Socket.IO)
        │
        ├── 📁 config/              # Configuration files
        │   ├── 📄 db.js            # Prisma client instance
        │   └── 📄 socket.js        # Socket.io configuration
        │
        ├── 📁 routes/              # API route handlers
        │   ├── 📄 auth.routes.js   # /api/auth endpoints
        │   ├── 📄 task.routes.js   # /api/tasks endpoints
        │   ├── 📄 user.routes.js   # /api/users endpoints
        │   └── 📄 activity.routes.js # /api/activity endpoints
        │
        ├── 📁 controllers/         # Route controllers (business logic)
        │   ├── 📄 auth.controller.js
        │   ├── 📄 task.controller.js
        │   ├── 📄 user.controller.js
        │   └── 📄 activity.controller.js
        │
        ├── 📁 services/            # Business logic services
        │   ├── 📄 auth.service.js
        │   └── 📄 task.service.js
        │
        ├── 📁 middleware/          # Express middleware
        │   ├── 📄 auth.middleware.js    # JWT verification
        │   ├── 📄 role.middleware.js    # RBAC check
        │   ├── 📄 validate.middleware.js # Request validation
        │   └── 📄 errorHandler.js  # Global error handler
        │
        └── 📁 validations/         # Joi validation schemas
            ├── 📄 auth.validation.js
            └── 📄 task.validation.js
```

### Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend Framework** | React 18 | UI library with hooks |
| **Build Tool** | Vite | Fast ES module bundler |
| **Styling** | Tailwind CSS v3 | Utility-first CSS |
| **Animations** | Framer Motion | Smooth component animations |
| **Drag & Drop** | @dnd-kit | Modern, accessible drag-drop |
| **State Management** | Redux Toolkit | Global state management |
| **Routing** | React Router v7 | Client-side routing |
| **Form Handling** | React Hook Form | Efficient form management |
| **Validation (Client)** | Zod | TypeScript-first validation |
| **HTTP Client** | Axios | Promise-based HTTP client |
| **Real-Time** | Socket.io Client | WebSocket client |
| **Notifications** | React Hot Toast | Toast notifications |
| **Icons** | Lucide React | Modern icon library |
| **Date Handling** | date-fns | Date utility library |
| **Linting** | ESLint | Code quality checker |
| **Runtime** | Node.js v18+ | JavaScript runtime |
| **Backend Framework** | Express.js | Web application framework |
| **Database** | SQLite / PostgreSQL | SQL database |
| **ORM** | Prisma v5 | Type-safe ORM |
| **Password Hashing** | bcryptjs | Secure password hashing |
| **Authentication** | JWT (jsonwebtoken) | Token-based auth |
| **Real-Time** | Socket.io | WebSocket library |
| **Validation (Server)** | Joi | Schema validation |
| **Security** | Helmet.js | HTTP headers security |
| **CORS** | cors | Cross-origin resource sharing |
| **Rate Limiting** | express-rate-limit | API rate limiting |
| **Cookie Parsing** | cookie-parser | HTTP cookie parsing |
| **Logging** | Morgan | HTTP request logger |
| **Utilities** | UUID | Generate unique IDs |
| **Dev Tools** | Nodemon | Auto-reload server |
| **Automation** | PostCSS, Autoprefixer | CSS processing |

---

## 🚀 Getting Started

### 📋 Prerequisites

Ensure you have the following installed on your system:

- **Node.js** — v18.0.0 or higher (download from [nodejs.org](https://nodejs.org))
- **npm** — v9.0.0+ (comes with Node.js) or **yarn** v3.0+
- **Git** — for version control (optional but recommended)
- **SQLite** — included with Prisma, no separate installation needed
- **Text Editor** — VS Code, WebStorm, or any code editor

Check your versions:
```bash
node --version      # Should be >= v18.0.0
npm --version       # Should be >= v9.0.0
git --version       # Optional
```

---

## 📥 Installation & Setup

### Step 1️⃣ — Clone Repository

```bash
# Navigate to your desired directory
cd ~/projects

# Clone the repository
git clone https://github.com/yourusername/task-management-system.git
cd task-management-system

# Explore project structure
ls -la
```

### Step 2️⃣ — Install Server Dependencies

```bash
cd server

# Install all backend dependencies
npm install

# What gets installed:
# • Express.js — Web framework
# • Prisma — ORM for database
# • Socket.io — WebSocket library
# • JWT libraries — Authentication
# • Joi — Schema validation
# • Security packages (Helmet, CORS, etc)

# Verify installation
npm list

# Check specific packages
npm list express prisma socket.io
```

### Step 3️⃣ — Install Client Dependencies

```bash
cd ../client

# Install all frontend dependencies
npm install

# What gets installed:
# • React 19 — UI library
# • Vite — Build tool
# • Redux Toolkit — State management
# • React Router — Routing
# • Tailwind CSS — Styling
# • @dnd-kit — Drag and drop
# • Socket.io-client — WebSocket client
# • Zod — Schema validation
# • Framer Motion — Animations

npm list
```

### Step 4️⃣ — Database Setup

```bash
cd server

# ─── Option A: Create from Schema (Recommended) ───────────────
# This creates dev.db and applies all migrations
npx prisma db push

# ─── Option B: Run Migrations (if migrations folder exists) ───
npx prisma migrate dev --name init

# ─── View Database (opens GUI) ───────────────────────────────
npx prisma studio

# ─── Seed Database with Demo Data ────────────────────────────
node prisma/seed.js

# ─── Verify Database Setup ──────────────────────────────────
# Check if dev.db file was created
ls -la prisma/dev.db
```

### Step 5️⃣ — Environment Configuration

Create a `.env` file in the server directory:

```bash
cd server

# Create .env file from example
cp .env.example .env

# Edit .env with your settings:
cat > .env << EOF
# Database
DATABASE_URL="file:./dev.db"

# Server
NODE_ENV="development"
PORT=5000
CLIENT_URL="http://localhost:5173"

# JWT Tokens
JWT_SECRET="your-super-secret-jwt-key-min-32-chars-long-change-this-in-production"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-min-32-chars-long-change-this"
JWT_EXPIRY="15m"
JWT_REFRESH_EXPIRY="7d"

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS
ALLOWED_ORIGINS="http://localhost:5173,http://localhost:3000"

# Environment
NODE_ENV="development"
EOF
```

### Step 6️⃣ — Start Development Servers

**Terminal 1 — Start Backend Server:**

```bash
cd server

# Option A: Development (with auto-reload using nodemon)
npm run dev
# Server will be available at: http://localhost:5000

# Option B: Production
npm start

# You should see:
# ✅ Server is running on http://localhost:5000
# ✅ Socket.io listening
# ✅ Prisma client ready
```

**Terminal 2 — Start Frontend Development Server:**

```bash
cd client

# Start Vite dev server with hot module replacement
npm run dev

# You should see:
# ➜  Local:   http://localhost:5173/
# ➜  press h + enter to show help

# App will auto-reload when you save files
```

### Step 7️⃣ — Verify Installation

Open your browser and navigate to:

```
http://localhost:5173
```

You should see:
- 🎨 TaskFlow Pro login page
- 🌙 Dark mode interface
- 📱 Responsive design
- ✨ Smooth animations

### Step 8️⃣ — Login with Demo Credentials

| Role | Email | Password | Access Level |
|---|---|---|---|
| 👑 Admin | admin@taskflow.com | Admin@1234 | Full system access, user management |
| 👤 User | demo@taskflow.com | User@1234 | Create/manage own tasks |

**First Login Steps:**
1. Click "Login" button
2. Enter email: `admin@taskflow.com`
3. Enter password: `Admin@1234`
4. Click "Sign In"
5. Dashboard loads with initial data

---

## 🛠️ Development Workflow

### Common Development Commands

#### Backend Commands
```bash
cd server

# Development
npm run dev              # Start with auto-reload
npm start               # Start production server

# Database
npm run db:migrate      # Create new migration
npm run db:push         # Apply schema to database
npm run db:seed         # Populate with demo data
npm run db:studio       # Open Prisma Studio GUI
npm run db:reset        # Reset database (⚠️ deletes all data)

# Useful for debugging
npm run setup           # Fresh database setup
```

#### Frontend Commands
```bash
cd client

# Development
npm run dev             # Start Vite dev server
npm run build           # Build for production
npm run preview         # Preview production build

# Code Quality
npm run lint            # Run ESLint
npm run lint:fix        # Fix linting issues
```

### Useful Development Tools

#### 🗄️ Prisma Studio
```bash
cd server
npx prisma studio
# Opens browser GUI at http://localhost:5555
# View/edit database records visually
```

#### 🐛 Browser DevTools
- **React DevTools** — Inspect component tree, props, state
- **Redux DevTools** — Time-travel debugging
- **Network Tab** — Monitor API calls and WebSocket events

#### 📝 Logging & Debugging
```javascript
// Frontend - Redux debugging
import { useDispatch, useSelector } from 'react-redux';
const state = useSelector(state => state);
console.log('Redux State:', state);

// Backend - Request logging
// Morgan middleware logs all HTTP requests
// Enable in production for monitoring
```

---

## 📚 API Documentation

### 🔐 Authentication Endpoints

#### Register New User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}

Response: 201 Created
{
  "message": "User registered successfully",
  "user": {
    "id": "uuid-xxx",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "USER"
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@taskflow.com",
  "password": "Admin@1234"
}

Response: 200 OK
{
  "message": "Login successful",
  "tokens": {
    "accessToken": "eyJhbGc...",  // 15 minutes validity
    "refreshToken": "eyJhbGc..."  // 7 days validity
  },
  "user": {
    "id": "uuid-xxx",
    "name": "Admin User",
    "email": "admin@taskflow.com",
    "role": "ADMIN"
  }
}

Cookies Set:
- accessToken (HttpOnly, Secure)
- refreshToken (HttpOnly, Secure)
```

#### Refresh Token
```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGc..."
}

Response: 200 OK
{
  "accessToken": "eyJhbGc...",  // New token
  "refreshToken": "eyJhbGc..."  // New refresh token
}
```

#### Logout
```http
POST /api/auth/logout
Authorization: Bearer <accessToken>

Response: 200 OK
{
  "message": "Logged out successfully"
}
```

### 📋 Task Endpoints

#### Get All Tasks (Paginated & Filterable)
```http
GET /api/tasks?page=1&limit=10&status=TODO&priority=HIGH&search=API
Authorization: Bearer <accessToken>

Query Parameters:
- page (number) — Page number (default: 1)
- limit (number) — Items per page (default: 10)
- status (string) — Filter: TODO | IN_PROGRESS | COMPLETED
- priority (string) — Filter: LOW | MEDIUM | HIGH
- search (string) — Search in title and description
- sortBy (string) — Sort field: createdAt | priority | dueDate
- sortOrder (string) — asc | desc

Response: 200 OK
{
  "data": [
    {
      "id": "task-uuid",
      "title": "Build API",
      "description": "Create REST endpoints",
      "status": "IN_PROGRESS",
      "priority": "HIGH",
      "dueDate": "2025-12-31",
      "tags": ["backend", "api"],
      "assignee": {
        "id": "user-uuid",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "creator": {
        "id": "user-uuid",
        "name": "Admin"
      },
      "createdAt": "2025-05-01T10:00:00Z",
      "updatedAt": "2025-05-02T15:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "totalPages": 5
  }
}
```

#### Create Task
```http
POST /api/tasks
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "title": "Design Dashboard",
  "description": "Create mockups for dashboard",
  "priority": "MEDIUM",
  "dueDate": "2025-12-31",
  "tags": ["design", "ui"],
  "assigneeId": "user-uuid"  // Optional
}

Response: 201 Created
{
  "id": "task-uuid",
  "title": "Design Dashboard",
  "status": "TODO",
  "priority": "MEDIUM",
  "createdAt": "2025-05-05T10:00:00Z",
  ...
}
```

#### Get Task Details
```http
GET /api/tasks/:taskId
Authorization: Bearer <accessToken>

Response: 200 OK
{
  "task": {
    "id": "task-uuid",
    "title": "Build API",
    ...
  },
  "activities": [
    {
      "id": "activity-uuid",
      "action": "created",
      "metadata": { /* changes */ },
      "user": { "name": "Admin", "email": "admin@taskflow.com" },
      "createdAt": "2025-05-01T10:00:00Z"
    }
  ]
}
```

#### Update Task
```http
PATCH /api/tasks/:taskId
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "title": "Build API v2",
  "status": "IN_PROGRESS",
  "priority": "HIGH",
  "dueDate": "2025-12-15",
  "assigneeId": "user-uuid"
}

Response: 200 OK
{
  "message": "Task updated",
  "task": { /* updated task */ }
}
```

#### Delete Task
```http
DELETE /api/tasks/:taskId
Authorization: Bearer <accessToken>

Response: 204 No Content
```

#### Reorder Kanban Tasks (Bulk)
```http
PATCH /api/tasks/reorder
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "tasks": [
    { "id": "task-1", "status": "TODO", "order": 0 },
    { "id": "task-2", "status": "TODO", "order": 1 },
    { "id": "task-3", "status": "IN_PROGRESS", "order": 0 }
  ]
}

Response: 200 OK
{
  "message": "Tasks reordered",
  "updatedCount": 3
}
```

### 👤 User Endpoints

#### Get Current User Profile
```http
GET /api/users/me
Authorization: Bearer <accessToken>

Response: 200 OK
{
  "id": "user-uuid",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "USER",
  "avatar": "https://...",
  "createdAt": "2025-01-15T08:00:00Z"
}
```

#### Update Profile
```http
PATCH /api/users/me
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "name": "Jane Doe",
  "avatar": "https://avatar-url.jpg"
}

Response: 200 OK
{
  "message": "Profile updated",
  "user": { /* updated user */ }
}
```

#### Get All Users (Admin Only)
```http
GET /api/users
Authorization: Bearer <adminToken>

Response: 200 OK
{
  "data": [
    { "id": "uuid-1", "name": "Admin", "email": "admin@taskflow.com", "role": "ADMIN" },
    { "id": "uuid-2", "name": "John", "email": "john@taskflow.com", "role": "USER" }
  ]
}
```

### 📊 Activity Endpoints

#### Global Activity Feed
```http
GET /api/activity?page=1&limit=20
Authorization: Bearer <accessToken>

Response: 200 OK
{
  "data": [
    {
      "id": "activity-uuid",
      "action": "created",
      "task": { "id": "task-uuid", "title": "Build API" },
      "user": { "name": "Admin", "avatar": "..." },
      "metadata": { "title": "Build API", "priority": "HIGH" },
      "createdAt": "2025-05-05T10:00:00Z"
    }
  ]
}
```

#### Task Activity History
```http
GET /api/activity/task/:taskId
Authorization: Bearer <accessToken>

Response: 200 OK
{
  "task": { "id": "task-uuid", "title": "Build API" },
  "activities": [
    {
      "action": "created",
      "metadata": { /* ... */ },
      "user": { "name": "Admin" },
      "createdAt": "2025-05-01T10:00:00Z"
    },
    {
      "action": "status_changed",
      "metadata": { "from": "TODO", "to": "IN_PROGRESS" },
      "user": { "name": "John" },
      "createdAt": "2025-05-02T15:30:00Z"
    }
  ]
}
```

---

## 🔌 WebSocket Events (Real-Time)

### Socket.io Connection

```javascript
// Client connects
import io from 'socket.io-client';

const socket = io('http://localhost:5000', {
  auth: {
    token: localStorage.getItem('accessToken')
  }
});

socket.on('connect', () => {
  console.log('Connected to server');
});
```

### Task Events

#### Task Created
```javascript
// Server sends when new task is created
socket.on('task:created', (data) => {
  {
    taskId: 'uuid',
    title: 'New Task',
    createdBy: { id: 'uuid', name: 'John' },
    timestamp: '2025-05-05T10:00:00Z'
  }
});
```

#### Task Updated
```javascript
socket.on('task:updated', (data) => {
  {
    taskId: 'uuid',
    changes: {
      title: { from: 'Old Title', to: 'New Title' },
      priority: { from: 'LOW', to: 'HIGH' }
    },
    updatedBy: { name: 'John' },
    timestamp: '2025-05-05T11:00:00Z'
  }
});
```

#### Task Status Changed
```javascript
socket.on('task:status_changed', (data) => {
  {
    taskId: 'uuid',
    oldStatus: 'TODO',
    newStatus: 'IN_PROGRESS',
    changedBy: { name: 'John' },
    timestamp: '2025-05-05T12:00:00Z'
  }
});
```

#### Task Assigned
```javascript
socket.on('task:assigned', (data) => {
  {
    taskId: 'uuid',
    taskTitle: 'Build API',
    assignedTo: { id: 'uuid', name: 'Jane', email: 'jane@example.com' },
    assignedBy: { name: 'Admin' },
    timestamp: '2025-05-05T13:00:00Z'
  }
});
```

#### Task Deleted
```javascript
socket.on('task:deleted', (data) => {
  {
    taskId: 'uuid',
    title: 'Deleted Task',
    deletedBy: { name: 'Admin' },
    timestamp: '2025-05-05T14:00:00Z'
  }
});
```

### Notification Events

```javascript
socket.on('notification:new', (data) => {
  {
    type: 'task_assigned',  // or status_changed
    title: 'You have been assigned',
    message: 'Build API component',
    taskId: 'uuid',
    timestamp: '2025-05-05T15:00:00Z'
  }
});
```

---

## 🔐 Security Features

### 🛡️ Authentication & Authorization

#### JWT Token Strategy
- **Access Token** — 15-minute expiry, stored in HttpOnly cookie
- **Refresh Token** — 7-day expiry, stored in HttpOnly cookie
- **Automatic Rotation** — New tokens issued on refresh
- **Secure Storage** — HttpOnly + Secure flags prevent XSS access

```javascript
// Token structure (decoded)
{
  "id": "user-uuid",
  "email": "user@example.com",
  "role": "USER",
  "iat": 1620000000,
  "exp": 1620900000
}
```

#### Role-Based Access Control (RBAC)

| Feature | Admin | User |
|---------|-------|------|
| Create tasks | ✅ | ✅ |
| Edit own tasks | ✅ | ✅ |
| Edit others' tasks | ✅ | ❌ |
| Delete tasks | ✅ | ❌ |
| View all users | ✅ | ❌ |
| Manage roles | ✅ | ❌ |
| View all activity | ✅ | ✅ (own only) |

### 🔒 Data Protection

#### Password Security
```javascript
// Passwords are:
// • Hashed with bcryptjs (salt rounds: 12)
// • Never stored in plain text
// • Compared securely on login
// • Always transmitted over HTTPS

// Example hash: $2b$12$...extremely-long-hash...
```

#### SQL Injection Prevention
```javascript
// Prisma ORM prevents SQL injection via parameterized queries
// ✅ Safe
const user = await prisma.user.findUnique({
  where: { email: userInput }
});

// ❌ Unsafe (would be vulnerable in raw SQL)
// const user = await db.query(`SELECT * FROM users WHERE email = '${userInput}'`);
```

#### XSS Protection
```javascript
// React automatically escapes JSX content
// ✅ Safe
<div>{userProvidedContent}</div>  // Automatically escaped

// Content in task descriptions is sanitized
// Use react-dom/server's renderToString safely
```

### 🌐 Network Security

#### CORS (Cross-Origin Resource Sharing)
```javascript
// Only allows requests from trusted origins
cors({
  origin: ['http://localhost:5173', 'https://taskflow.app'],
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE']
})
```

#### Rate Limiting
```javascript
// Prevents brute force attacks
// • 100 requests per 15 minutes per IP
// • Different limits for auth endpoints
// • Configurable via .env

rateLimit({
  windowMs: 900000,      // 15 minutes
  max: 100,              // max requests
  message: 'Too many requests'
})
```

#### Helmet.js Headers
```javascript
// Automatically sets security headers:
// • Content-Security-Policy
// • X-Frame-Options
// • X-Content-Type-Options
// • X-XSS-Protection
// • Referrer-Policy
// • Strict-Transport-Security (HSTS)
```

### ✅ Input Validation

#### Server-Side Validation (Joi)
```javascript
// Every API request validated with Joi schemas
const schema = Joi.object({
  title: Joi.string().required().max(200),
  priority: Joi.string().valid('LOW', 'MEDIUM', 'HIGH'),
  dueDate: Joi.date().iso()
});

// Returns 400 Bad Request if validation fails
```

#### Client-Side Validation (Zod + React Hook Form)
```javascript
// Form data validated before sending
const taskSchema = z.object({
  title: z.string().min(3).max(200),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH'])
});

// Provides instant feedback to user
```

### 📝 Audit Logging

Every action is logged with:
- 👤 User who performed the action
- 🔍 What action was performed
- 📊 Before/after values
- ⏰ Exact timestamp
- 📍 IP address (server-side)

This enables:
- 🔎 **Compliance audits** — Full history of changes
- 🚨 **Security investigation** — Trace suspicious activity
- 📈 **Analytics** — Understand usage patterns
- 🔄 **Undo capability** — Restore previous states if needed

---

## 🐛 Troubleshooting

### Common Issues & Solutions

#### ❌ "Port 5000 already in use"
```bash
# Find process using port 5000
netstat -ano | findstr :5000  # Windows
lsof -i :5000                  # Mac/Linux

# Kill the process (Windows)
taskkill /PID <PID> /F

# Or change PORT in .env
PORT=5001
```

#### ❌ "Cannot find module 'prisma'"
```bash
cd server
npm install
npx prisma generate  # Generate Prisma client
```

#### ❌ "Database connection error"
```bash
# Verify DATABASE_URL in .env
# Reset database if corrupted
cd server
npm run db:reset   # ⚠️ Deletes all data

# Recreate with seed data
npm run db:seed
```

#### ❌ "CORS error: Origin not allowed"
```javascript
// Update CORS settings in server/.env
CLIENT_URL="http://localhost:5173"

// Or in src/app.js
cors({
  origin: process.env.CLIENT_URL,
  credentials: true
})
```

#### ❌ "Token expired / 401 Unauthorized"
```javascript
// Clear cookies and local storage
localStorage.clear();
// Tokens are automatically refreshed by middleware
// If still failing, re-login
```

---

## 📦 Deployment

### Deploy to Production

#### Vercel (Frontend)
```bash
# 1. Push to GitHub
git push origin main

# 2. Connect to Vercel
# Go to vercel.com → New Project
# Select your GitHub repo
# Environment: Set VITE_API_URL=https://your-api.com

# 3. Deploy (automatic on push)
```

#### Heroku / Railway (Backend)
```bash
# 1. Create Procfile
echo "web: node src/app.js" > Procfile

# 2. Set environment variables
# PORT, DATABASE_URL (use PostgreSQL), JWT_SECRET, etc

# 3. Deploy
git push heroku main
```

#### Environment Variables for Production
```env
NODE_ENV=production
CLIENT_URL=https://yourfrontend.com
DATABASE_URL=postgresql://user:pass@host:5432/taskflow  # PostgreSQL
JWT_SECRET=your-very-long-random-secret-key-min-32-chars
JWT_REFRESH_SECRET=another-very-long-random-secret-key
PORT=5000
```

---

## 🤝 Contributing

We welcome contributions! Here's how:

1. **Fork** the repository
2. **Create feature branch** — `git checkout -b feature/amazing-feature`
3. **Commit changes** — `git commit -m 'Add amazing feature'`
4. **Push branch** — `git push origin feature/amazing-feature`
5. **Open Pull Request** — Describe your changes

### Code Style
- Use ESLint for consistency
- Follow existing patterns
- Add comments for complex logic
- Test features before submitting

---

## 📄 License

This project is licensed under the **MIT License** — see [LICENSE](LICENSE) file for details.

---

## 📞 Support

Need help? 

- 📖 **Documentation** — Check this README
- 🐛 **Issues** — Report bugs on GitHub Issues
- 💬 **Discussions** — Start a GitHub Discussion
- 📧 **Email** — contact@taskflow.app

---

## 🙌 Acknowledgments

Built with ❤️ using:
- [React](https://react.dev) — UI library
- [Express](https://expressjs.com) — Backend framework
- [Prisma](https://prisma.io) — Database ORM
- [Socket.io](https://socket.io) — Real-time communication
- [Tailwind CSS](https://tailwindcss.com) — Styling
- [Framer Motion](https://www.framer.com/motion/) — Animations

---

<div align="center">

### 🎉 Thank You for Using TaskFlow Pro!

Made with 💜 by the TaskFlow Team

[⭐ Star on GitHub](https://github.com/yourusername/task-management-system) | [🐦 Follow on Twitter](https://twitter.com/taskflow) | [💼 LinkedIn](https://linkedin.com/company/taskflow)

</div>

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