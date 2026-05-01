/**
 * DashboardPage — overview stats, quick-add, recent activity
 */

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CheckSquare, Clock, AlertCircle, TrendingUp,
  Plus, ArrowRight, Activity,
} from 'lucide-react';
import { fetchTasks, selectAllTasks, selectTasksLoading, createTask } from '../features/tasks/tasksSlice';
import { selectCurrentUser } from '../features/auth/authSlice';
import TaskCard from '../components/tasks/TaskCard';
import TaskModal from '../components/tasks/TaskModal';
import Modal from '../components/ui/Modal';
import TaskForm from '../components/tasks/TaskForm';
import { isOverdue, isDueSoon, formatRelative } from '../utils/helpers';
import api from '../services/api';

function StatCard({ icon: Icon, label, value, color, trend }) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="glass-card p-5 relative overflow-hidden"
    >
      <div className={`absolute top-0 right-0 w-24 h-24 rounded-full ${color}/5
                       blur-2xl -translate-y-1/2 translate-x-1/2`} />
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-400 mb-1">{label}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
          {trend && <p className="text-xs text-gray-500 mt-1">{trend}</p>}
        </div>
        <div className={`p-2.5 rounded-xl ${color}/10`}>
          <Icon size={20} className={color} />
        </div>
      </div>
    </motion.div>
  );
}

export default function DashboardPage() {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const tasks = useSelector(selectAllTasks);
  const isLoading = useSelector(selectTasksLoading);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activity, setActivity] = useState([]);

  useEffect(() => {
    dispatch(fetchTasks({ limit: 50 }));
    // Fetch activity feed
    api.get('/activity?limit=10').then((r) => setActivity(r.data.data)).catch(() => {});
  }, [dispatch]);

  const todo = tasks.filter((t) => t.status === 'TODO');
  const inProgress = tasks.filter((t) => t.status === 'IN_PROGRESS');
  const completed = tasks.filter((t) => t.status === 'COMPLETED');
  const overdue = tasks.filter((t) => isOverdue(t.dueDate, t.status));
  const dueSoon = tasks.filter((t) => isDueSoon(t.dueDate));

  const stats = [
    { icon: CheckSquare, label: 'Total Tasks',   value: tasks.length,       color: 'text-primary-400' },
    { icon: Clock,       label: 'In Progress',   value: inProgress.length,  color: 'text-blue-400' },
    { icon: TrendingUp,  label: 'Completed',     value: completed.length,   color: 'text-green-400' },
    { icon: AlertCircle, label: 'Overdue',       value: overdue.length,     color: 'text-red-400' },
  ];

  const recentTasks = [...tasks]
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 5);

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'},{' '}
            <span className="text-gradient">{user?.name?.split(' ')[0]} 👋</span>
          </h1>
          <p className="text-gray-400 text-sm mt-0.5">
            {dueSoon.length > 0
              ? `You have ${dueSoon.length} task${dueSoon.length > 1 ? 's' : ''} due soon`
              : "Here's what's happening today"}
          </p>
        </div>
        <button
          id="create-task-btn"
          onClick={() => setShowCreateModal(true)}
          className="btn-primary gap-2"
        >
          <Plus size={16} />
          New Task
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <StatCard {...stat} />
          </motion.div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-300">Overall Progress</h2>
          <span className="text-sm font-bold text-white">
            {tasks.length > 0 ? Math.round((completed.length / tasks.length) * 100) : 0}%
          </span>
        </div>
        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${tasks.length > 0 ? (completed.length / tasks.length) * 100 : 0}%` }}
            transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-primary-600 to-violet-400 rounded-full"
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>{completed.length} completed</span>
          <span>{todo.length + inProgress.length} remaining</span>
        </div>
      </div>

      {/* Two-column: Recent tasks + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent tasks */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-200">Recent Tasks</h2>
            <Link
              to="/tasks"
              className="text-xs text-primary-400 hover:text-primary-300 flex items-center gap-1 transition-colors"
            >
              View all <ArrowRight size={13} />
            </Link>
          </div>
          <div className="space-y-2.5">
            {isLoading ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="h-24 skeleton rounded-xl" />
              ))
            ) : recentTasks.length === 0 ? (
              <div className="glass-card p-8 text-center">
                <p className="text-gray-500 text-sm">No tasks yet. Create your first task!</p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="btn-primary mt-3 mx-auto"
                >
                  <Plus size={14} /> Create Task
                </button>
              </div>
            ) : (
              recentTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onClick={setSelectedTask}
                />
              ))
            )}
          </div>
        </div>

        {/* Activity feed */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Activity size={16} className="text-primary-400" />
            <h2 className="font-semibold text-gray-200">Activity Feed</h2>
          </div>
          <div className="glass-card divide-y divide-white/5 overflow-hidden">
            {activity.length === 0 ? (
              <div className="p-5 text-center text-gray-500 text-sm">No activity yet</div>
            ) : (
              activity.map((a) => (
                <div key={a.id} className="px-4 py-3 hover:bg-white/3 transition-colors">
                  <p className="text-xs text-gray-300 leading-relaxed">
                    <span className="font-medium text-white">{a.user?.name}</span>{' '}
                    <span className="text-gray-400">{a.action.replace('_', ' ')}</span>
                    {a.task && (
                      <>
                        {' "'}
                        <span className="text-primary-400">{a.task.title}</span>
                        {'"'}
                      </>
                    )}
                  </p>
                  <p className="text-xs text-gray-600 mt-0.5">{formatRelative(a.createdAt)}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {selectedTask && (
        <TaskModal task={selectedTask} onClose={() => setSelectedTask(null)} />
      )}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Task"
      >
        <TaskForm
          onSuccess={() => setShowCreateModal(false)}
          onCancel={() => setShowCreateModal(false)}
        />
      </Modal>
    </div>
  );
}
