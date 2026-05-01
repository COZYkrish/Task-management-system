/**
 * Utility functions for TaskFlow Pro
 */

import { format, formatDistanceToNow, isPast, isToday, isTomorrow } from 'date-fns';

// ── Date Formatters ───────────────────────────────────────────

export const formatDate = (date) => {
  if (!date) return null;
  return format(new Date(date), 'MMM d, yyyy');
};

export const formatRelative = (date) => {
  if (!date) return null;
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

export const formatDueDate = (date) => {
  if (!date) return null;
  const d = new Date(date);
  if (isToday(d)) return 'Today';
  if (isTomorrow(d)) return 'Tomorrow';
  return format(d, 'MMM d');
};

export const isDueSoon = (date) => {
  if (!date) return false;
  const d = new Date(date);
  const threeDaysFromNow = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
  return d <= threeDaysFromNow && !isPast(d);
};

export const isOverdue = (date, status) => {
  if (!date || status === 'COMPLETED') return false;
  return isPast(new Date(date));
};

// ── Status / Priority Helpers ─────────────────────────────────

export const STATUS_CONFIG = {
  TODO: {
    label: 'To Do',
    color: 'text-gray-400',
    bg: 'bg-gray-500/10',
    border: 'border-gray-500/30',
    dot: 'bg-gray-400',
  },
  IN_PROGRESS: {
    label: 'In Progress',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    dot: 'bg-blue-400',
  },
  COMPLETED: {
    label: 'Completed',
    color: 'text-green-400',
    bg: 'bg-green-500/10',
    border: 'border-green-500/30',
    dot: 'bg-green-400',
  },
};

export const PRIORITY_CONFIG = {
  LOW: {
    label: 'Low',
    color: 'text-slate-400',
    bg: 'bg-slate-500/10',
    border: 'border-slate-500/20',
    icon: '↓',
  },
  MEDIUM: {
    label: 'Medium',
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/20',
    icon: '→',
  },
  HIGH: {
    label: 'High',
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
    icon: '↑',
  },
};

// ── Avatar helpers ────────────────────────────────────────────

export const getInitials = (name = '') => {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const getAvatarColor = (name = '') => {
  const colors = [
    'bg-violet-500',
    'bg-blue-500',
    'bg-emerald-500',
    'bg-pink-500',
    'bg-amber-500',
    'bg-cyan-500',
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
};

// ── Misc helpers ──────────────────────────────────────────────

export const truncate = (str, maxLength = 80) => {
  if (!str || str.length <= maxLength) return str;
  return str.slice(0, maxLength) + '…';
};

export const classNames = (...classes) => {
  return classes.filter(Boolean).join(' ');
};
