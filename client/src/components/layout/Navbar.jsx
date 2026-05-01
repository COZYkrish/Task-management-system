/**
 * Navbar — top bar with search, notifications, and profile
 */

import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Bell, Search, Menu, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { selectCurrentUser } from '../../features/auth/authSlice';
import {
  selectNotifications,
  selectUnreadCount,
  markAllRead,
} from '../../features/notifications/notificationsSlice';
import { setFilter } from '../../features/tasks/tasksSlice';
import Avatar from '../ui/Avatar';
import { formatRelative } from '../../utils/helpers';

function NotificationPanel({ notifications, onMarkAll, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.95 }}
      transition={{ duration: 0.15 }}
      className="absolute right-0 top-full mt-2 w-80 bg-gray-900 border border-white/10
                 rounded-xl shadow-2xl z-50 overflow-hidden"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <h3 className="font-semibold text-sm text-white">Notifications</h3>
        <button
          onClick={onMarkAll}
          className="text-xs text-primary-400 hover:text-primary-300 transition-colors"
        >
          Mark all read
        </button>
      </div>
      <div className="max-h-72 overflow-y-auto scrollbar-hide">
        {notifications.length === 0 ? (
          <div className="py-8 text-center text-gray-500 text-sm">
            No notifications yet
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              className={`px-4 py-3 border-b border-white/5 hover:bg-white/5 transition-colors
                ${!n.read ? 'bg-primary-500/5' : ''}`}
            >
              <div className="flex items-start gap-2.5">
                <span className="text-lg mt-0.5">
                  {n.type === 'task_assigned' ? '📋' : '🔔'}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-200 leading-snug">{n.message}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {formatRelative(n.createdAt)}
                  </p>
                </div>
                {!n.read && (
                  <span className="w-2 h-2 rounded-full bg-primary-500 flex-shrink-0 mt-1" />
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
}

export default function Navbar({ onMenuToggle }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectCurrentUser);
  const notifications = useSelector(selectNotifications);
  const unreadCount = useSelector(selectUnreadCount);
  const [showNotifs, setShowNotifs] = useState(false);
  const [searchVal, setSearchVal] = useState('');

  const handleSearch = (e) => {
    const val = e.target.value;
    setSearchVal(val);
    dispatch(setFilter({ search: val }));
    if (val && location.pathname !== '/tasks') {
      navigate('/tasks');
    }
  };

  return (
    <header className="h-16 flex items-center px-4 md:px-6 border-b border-white/5
                        bg-gray-900/50 backdrop-blur-md flex-shrink-0">
      {/* Mobile menu */}
      <button
        onClick={onMenuToggle}
        className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10
                   transition-colors mr-3"
      >
        <Menu size={20} />
      </button>

      {/* Logo (mobile) */}
      <div className="md:hidden flex items-center gap-2 mr-4">
        <div className="w-7 h-7 rounded-lg bg-primary-600 flex items-center justify-center">
          <Zap size={14} className="text-white" />
        </div>
        <span className="font-bold text-white text-base">
          Task<span className="text-gradient">Flow</span>
        </span>
      </div>

      {/* Search */}
      <div className="relative flex-1 max-w-sm hidden sm:block">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          type="search"
          placeholder="Search tasks..."
          value={searchVal}
          onChange={handleSearch}
          className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded-lg
                     text-sm text-white placeholder-gray-500
                     focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                     transition-all"
        />
      </div>

      <div className="flex-1" />

      {/* Right actions */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <div className="relative">
          <button
            id="notifications-btn"
            onClick={() => setShowNotifs((v) => !v)}
            className="relative p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10
                       transition-colors"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-primary-500
                               text-white text-xs flex items-center justify-center font-bold">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {showNotifs && (
              <NotificationPanel
                notifications={notifications}
                onMarkAll={() => {
                  dispatch(markAllRead());
                  setShowNotifs(false);
                }}
                onClose={() => setShowNotifs(false)}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Avatar */}
        <Avatar user={user} size="sm" className="cursor-pointer" />
      </div>
    </header>
  );
}
