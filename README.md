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