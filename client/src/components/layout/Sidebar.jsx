/**
 * Sidebar — main navigation with route highlighting and collapse support
 */

import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Kanban,
  CheckSquare,
  Activity,
  Settings,
  LogOut,
  Zap,
} from 'lucide-react';
import { selectCurrentUser, logoutUser } from '../../features/auth/authSlice';
import Avatar from '../ui/Avatar';

const NAV_ITEMS = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/kanban',    icon: Kanban,           label: 'Kanban Board' },
  { to: '/tasks',     icon: CheckSquare,      label: 'All Tasks' },
  { to: '/activity',  icon: Activity,         label: 'Activity' },
];

export default function Sidebar() {
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);

  const handleLogout = () => dispatch(logoutUser());

  return (
    <aside className="hidden md:flex flex-col w-60 flex-shrink-0 bg-gray-900/80 backdrop-blur-md
                       border-r border-white/5 h-full">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/5">
        <Link to="/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center
                          shadow-glow flex-shrink-0">
            <Zap size={16} className="text-white" />
          </div>
          <span className="font-bold text-white text-lg tracking-tight">
            Task<span className="text-gradient">Flow</span>
          </span>
        </Link>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => {
          const isActive = location.pathname === to;
          return (
            <Link key={to} to={to}>
              <motion.div
                className={`nav-item ${isActive ? 'active' : ''}`}
                whileTap={{ scale: 0.97 }}
              >
                <Icon size={18} className={isActive ? 'text-primary-400' : ''} />
                <span>{label}</span>
                {isActive && (
                  <motion.div
                    layoutId="active-nav"
                    className="absolute inset-0 bg-primary-600/10 rounded-lg border border-primary-500/20 -z-10"
                  />
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* User profile footer */}
      <div className="px-3 pb-4 space-y-1 border-t border-white/5 pt-3">
        <Link to="/profile">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5
                          transition-colors cursor-pointer">
            <Avatar user={user} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-white truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 truncate">{user?.role}</p>
            </div>
          </div>
        </Link>
        <button
          onClick={handleLogout}
          className="nav-item w-full text-red-400 hover:text-red-300 hover:bg-red-500/10"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
