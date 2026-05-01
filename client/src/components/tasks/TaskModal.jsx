/**
 * TaskModal — Full task detail view with edit and activity log
 */

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { deleteTask, setSelectedTask } from '../../features/tasks/tasksSlice';
import Modal from '../ui/Modal';
import TaskForm from './TaskForm';
import Avatar from '../ui/Avatar';
import Badge from '../ui/Badge';
import {
  STATUS_CONFIG,
  PRIORITY_CONFIG,
  formatDate,
  formatRelative,
  isOverdue,
} from '../../utils/helpers';
import { Pencil, Trash2, Calendar, User, Activity } from 'lucide-react';
import toast from 'react-hot-toast';

export default function TaskModal({ task, onClose }) {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!task) return null;

  const status = STATUS_CONFIG[task.status];
  const priority = PRIORITY_CONFIG[task.priority];
  const overdue = isOverdue(task.dueDate, task.status);

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${task.title}"? This cannot be undone.`)) return;
    setIsDeleting(true);
    try {
      await dispatch(deleteTask(task.id)).unwrap();
      toast.success('Task deleted');
      onClose();
    } catch (err) {
      toast.error(err || 'Failed to delete task');
      setIsDeleting(false);
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={isEditing ? 'Edit Task' : undefined}
      size="lg"
    >
      {isEditing ? (
        <TaskForm
          task={task}
          onSuccess={() => setIsEditing(false)}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <div className="space-y-5">
          {/* Title */}
          <div>
            <div className="flex items-start justify-between gap-4 mb-3">
              <h2 className={`text-xl font-bold leading-tight
                ${task.status === 'COMPLETED' ? 'line-through text-gray-400' : 'text-white'}`}>
                {task.title}
              </h2>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn-ghost px-3 py-2"
                  title="Edit task"
                >
                  <Pencil size={15} />
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="btn-danger px-3 py-2"
                  title="Delete task"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>

            {/* Badges row */}
            <div className="flex flex-wrap gap-2">
              <Badge variant={task.status === 'COMPLETED' ? 'success' : task.status === 'IN_PROGRESS' ? 'blue' : 'default'}>
                <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                {status.label}
              </Badge>
              <Badge variant={task.priority === 'HIGH' ? 'danger' : task.priority === 'MEDIUM' ? 'warning' : 'default'}>
                {priority.icon} {priority.label} Priority
              </Badge>
            </div>
          </div>

          {/* Description */}
          {task.description && (
            <div>
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Description
              </h4>
              <p className="text-gray-300 text-sm leading-relaxed bg-white/3 rounded-lg p-3 border border-white/5">
                {task.description}
              </p>
            </div>
          )}

          {/* Meta grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Due Date */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-white/3 border border-white/5">
              <Calendar size={16} className={overdue ? 'text-red-400' : 'text-gray-400'} />
              <div>
                <p className="text-xs text-gray-500">Due Date</p>
                <p className={`text-sm font-medium ${overdue ? 'text-red-400' : 'text-gray-200'}`}>
                  {task.dueDate ? formatDate(task.dueDate) : '—'}
                </p>
              </div>
            </div>

            {/* Assignee */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-white/3 border border-white/5">
              <User size={16} className="text-gray-400" />
              <div className="flex items-center gap-2 min-w-0">
                {task.assignee ? (
                  <>
                    <Avatar user={task.assignee} size="xs" />
                    <div className="min-w-0">
                      <p className="text-xs text-gray-500">Assignee</p>
                      <p className="text-sm font-medium text-gray-200 truncate">
                        {task.assignee.name}
                      </p>
                    </div>
                  </>
                ) : (
                  <div>
                    <p className="text-xs text-gray-500">Assignee</p>
                    <p className="text-sm text-gray-500">Unassigned</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tags */}
          {task.tags?.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Tags</h4>
              <div className="flex flex-wrap gap-1.5">
                {task.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 rounded-md text-xs bg-primary-500/10 text-primary-400
                               border border-primary-500/20"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Activity */}
          {task.activities?.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Activity size={12} />
                Activity
              </h4>
              <div className="space-y-2 max-h-40 overflow-y-auto scrollbar-hide">
                {task.activities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-2.5 text-xs">
                    <Avatar user={activity.user} size="xs" className="flex-shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <span className="text-gray-300 font-medium">{activity.user.name}</span>
                      <span className="text-gray-500"> {activity.action.replace('_', ' ')}</span>
                      <span className="text-gray-600 ml-1">· {formatRelative(activity.createdAt)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer timestamps */}
          <div className="text-xs text-gray-600 pt-2 border-t border-white/5 flex justify-between">
            <span>Created {formatRelative(task.createdAt)}</span>
            <span>Updated {formatRelative(task.updatedAt)}</span>
          </div>
        </div>
      )}
    </Modal>
  );
}
