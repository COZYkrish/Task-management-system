/**
 * TaskCard — Animated task card for list and Kanban views
 */

import { motion } from 'framer-motion';
import { Calendar, Flag, Tag, User, Clock } from 'lucide-react';
import Avatar from '../ui/Avatar';
import Badge from '../ui/Badge';
import {
  STATUS_CONFIG,
  PRIORITY_CONFIG,
  formatDueDate,
  isOverdue,
  isDueSoon,
  truncate,
} from '../../utils/helpers';

const priorityVariantMap = {
  LOW: 'default',
  MEDIUM: 'warning',
  HIGH: 'danger',
};

const statusVariantMap = {
  TODO: 'default',
  IN_PROGRESS: 'blue',
  COMPLETED: 'success',
};

export default function TaskCard({ task, onClick, isDragging = false }) {
  const overdue = isOverdue(task.dueDate, task.status);
  const dueSoon = isDueSoon(task.dueDate);
  const priority = PRIORITY_CONFIG[task.priority];
  const status = STATUS_CONFIG[task.status];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      onClick={() => onClick?.(task)}
      className={`
        glass-card p-4 cursor-pointer group
        transition-all duration-200
        hover:border-primary-500/30 hover:shadow-glow
        ${isDragging ? 'opacity-60 rotate-2 shadow-2xl' : ''}
      `}
    >
      {/* Priority indicator bar */}
      <div
        className={`absolute top-0 left-0 w-1 h-full rounded-l-xl
          ${task.priority === 'HIGH' ? 'bg-red-500' :
            task.priority === 'MEDIUM' ? 'bg-yellow-500' : 'bg-slate-600'}`}
      />

      <div className="pl-2">
        {/* Header: status + priority badges */}
        <div className="flex items-center gap-2 mb-2.5 flex-wrap">
          <Badge variant={statusVariantMap[task.status]}>
            <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
            {status.label}
          </Badge>
          <Badge variant={priorityVariantMap[task.priority]}>
            {priority.icon} {priority.label}
          </Badge>
        </div>

        {/* Title */}
        <h3 className={`text-sm font-semibold mb-1.5 leading-snug
          ${task.status === 'COMPLETED' ? 'line-through text-gray-500' : 'text-white'}
          group-hover:text-primary-300 transition-colors`}>
          {task.title}
        </h3>

        {/* Description snippet */}
        {task.description && (
          <p className="text-xs text-gray-500 mb-3 leading-relaxed">
            {truncate(task.description, 90)}
          </p>
        )}

        {/* Tags */}
        {task.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {task.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs
                           bg-primary-500/10 text-primary-400"
              >
                <Tag size={9} />
                {tag}
              </span>
            ))}
            {task.tags.length > 3 && (
              <span className="text-xs text-gray-500">+{task.tags.length - 3}</span>
            )}
          </div>
        )}

        {/* Footer: due date + assignee */}
        <div className="flex items-center justify-between">
          {task.dueDate ? (
            <span
              className={`flex items-center gap-1 text-xs font-medium
                ${overdue ? 'text-red-400' :
                  dueSoon ? 'text-yellow-400' : 'text-gray-500'}`}
            >
              {overdue ? <Clock size={11} /> : <Calendar size={11} />}
              {overdue ? `Overdue · ${formatDueDate(task.dueDate)}` : formatDueDate(task.dueDate)}
            </span>
          ) : (
            <span />
          )}

          {task.assignee ? (
            <Avatar user={task.assignee} size="xs" />
          ) : (
            <User size={14} className="text-gray-600" />
          )}
        </div>
      </div>
    </motion.div>
  );
}
