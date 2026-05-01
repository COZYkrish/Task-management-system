/**
 * App.jsx — Root router with protected routes and auth initialization
 */

import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import {
  fetchMe,
  selectIsAuthenticated,
  selectIsInitialized,
  selectAccessToken,
} from './features/auth/authSlice';
import { useSocket } from './hooks/useSocket';

// Layouts
import AppLayout from './components/layout/AppLayout';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import KanbanPage from './pages/KanbanPage';
import TasksPage from './pages/TasksPage';
import ActivityPage from './pages/ActivityPage';
import ProfilePage from './pages/ProfilePage';

// ── Protected Route wrapper ───────────────────────────────────
function ProtectedRoute({ children }) {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isInitialized = useSelector(selectIsInitialized);

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
          <p className="text-gray-500 text-sm">Loading TaskFlow…</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

// ── Public Route (redirect if logged in) ─────────────────────
function PublicRoute({ children }) {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isInitialized = useSelector(selectIsInitialized);

  if (!isInitialized) return null;
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
}

// ── Socket initializer (hooks must be in component) ──────────
function SocketInit() {
  useSocket();
  return null;
}

// ── App ───────────────────────────────────────────────────────
export default function App() {
  const dispatch = useDispatch();
  const accessToken = useSelector(selectAccessToken);

  // On mount: try to restore session via /users/me
  useEffect(() => {
    if (accessToken) {
      dispatch(fetchMe());
    } else {
      // Mark initialized so routes don't hang
      dispatch({ type: 'auth/fetchMe/rejected' });
    }
  }, []);

  return (
    <BrowserRouter>
      <SocketInit />

      {/* Toast notifications */}
      <Toaster
        position="top-right"
        gutter={8}
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1e1e2e',
            color: '#e2e8f0',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '10px',
            fontSize: '14px',
          },
          success: { iconTheme: { primary: '#8b5cf6', secondary: '#fff' } },
        }}
      />

      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

        {/* Protected routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="kanban"    element={<KanbanPage />} />
          <Route path="tasks"     element={<TasksPage />} />
          <Route path="activity"  element={<ActivityPage />} />
          <Route path="profile"   element={<ProfilePage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
