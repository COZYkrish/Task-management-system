/**
 * TasksPage — paginated, filterable task list
 */

import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Filter, X, Search } from 'lucide-react';
import {
  fetchTasks,
  selectAllTasks,
  selectTasksLoading,
  selectPagination,
  selectFilters,
  setFilter,
  clearFilters,
} from '../features/tasks/tasksSlice';
import TaskCard from '../components/tasks/TaskCard';
import TaskModal from '../components/tasks/TaskModal';
import Modal from '../components/ui/Modal';
import TaskForm from '../components/tasks/TaskForm';

function FilterBar({ filters, onFilterChange, onClear }) {
  const hasActiveFilters = filters.status || filters.priority || filters.search;

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Search */}
      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          type="search"
          placeholder="Search tasks…"
          value={filters.search}
          onChange={(e) => onFilterChange({ search: e.target.value })}
          className="pl-8 pr-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm
                     text-white placeholder-gray-500 focus:outline-none focus:ring-2
                     focus:ring-primary-500 w-48"
        />
      </div>

      {/* Status filter */}
      <select
        value={filters.status}
        onChange={(e) => onFilterChange({ status: e.target.value })}
        className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-300
                   focus:outline-none focus:ring-2 focus:ring-primary-500"
      >
        <option value="">All Status</option>
        <option value="TODO">To Do</option>
        <option value="IN_PROGRESS">In Progress</option>
        <option value="COMPLETED">Completed</option>
      </select>

      {/* Priority filter */}
      <select
        value={filters.priority}
        onChange={(e) => onFilterChange({ priority: e.target.value })}
        className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-300
                   focus:outline-none focus:ring-2 focus:ring-primary-500"
      >
        <option value="">All Priority</option>
        <option value="HIGH">High</option>
        <option value="MEDIUM">Medium</option>
        <option value="LOW">Low</option>
      </select>

      {/* Sort */}
      <select
        value={`${filters.sortBy}-${filters.sortOrder}`}
        onChange={(e) => {
          const [sortBy, sortOrder] = e.target.value.split('-');
          onFilterChange({ sortBy, sortOrder });
        }}
        className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-300
                   focus:outline-none focus:ring-2 focus:ring-primary-500"
      >
        <option value="createdAt-desc">Newest first</option>
        <option value="createdAt-asc">Oldest first</option>
        <option value="dueDate-asc">Due soonest</option>
        <option value="priority-desc">Priority</option>
      </select>

      {/* Clear filters */}
      {hasActiveFilters && (
        <button
          onClick={onClear}
          className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white
                     px-2.5 py-2 rounded-lg hover:bg-white/10 transition-colors"
        >
          <X size={13} /> Clear
        </button>
      )}
    </div>
  );
}

export default function TasksPage() {
  const dispatch = useDispatch();
  const tasks = useSelector(selectAllTasks);
  const isLoading = useSelector(selectTasksLoading);
  const pagination = useSelector(selectPagination);
  const filters = useSelector(selectFilters);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showCreate, setShowCreate] = useState(false);

  const loadTasks = useCallback(() => {
    dispatch(fetchTasks({
      status: filters.status || undefined,
      priority: filters.priority || undefined,
      search: filters.search || undefined,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
      page: pagination.page,
      limit: pagination.limit,
    }));
  }, [dispatch, filters, pagination.page, pagination.limit]);

  useEffect(() => {
    const timer = setTimeout(loadTasks, 300); // Debounce search
    return () => clearTimeout(timer);
  }, [loadTasks]);

  const handleFilterChange = (update) => {
    dispatch(setFilter({ ...update }));
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">All Tasks</h1>
          <p className="text-gray-400 text-sm mt-0.5">
            {pagination.total} task{pagination.total !== 1 ? 's' : ''} total
          </p>
        </div>
        <button
          id="tasks-add-btn"
          onClick={() => setShowCreate(true)}
          className="btn-primary"
        >
          <Plus size={16} /> New Task
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <FilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          onClear={() => dispatch(clearFilters())}
        />
      </div>

      {/* Task grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-40 skeleton rounded-xl" />
          ))}
        </div>
      ) : tasks.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card p-12 text-center"
        >
          <p className="text-4xl mb-3">📋</p>
          <p className="text-gray-400 font-medium mb-1">No tasks found</p>
          <p className="text-gray-600 text-sm mb-4">
            {filters.search || filters.status || filters.priority
              ? 'Try adjusting your filters'
              : 'Create your first task to get started'}
          </p>
          <button onClick={() => setShowCreate(true)} className="btn-primary mx-auto">
            <Plus size={14} /> Create Task
          </button>
        </motion.div>
      ) : (
        <AnimatePresence mode="popLayout">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} onClick={setSelectedTask} />
            ))}
          </div>
        </AnimatePresence>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button
            disabled={pagination.page <= 1}
            onClick={() => dispatch(setFilter({ page: pagination.page - 1 }))}
            className="btn-ghost disabled:opacity-40"
          >
            ← Previous
          </button>
          <span className="text-sm text-gray-400">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <button
            disabled={pagination.page >= pagination.totalPages}
            onClick={() => dispatch(setFilter({ page: pagination.page + 1 }))}
            className="btn-ghost disabled:opacity-40"
          >
            Next →
          </button>
        </div>
      )}

      {/* Modals */}
      {selectedTask && (
        <TaskModal task={selectedTask} onClose={() => setSelectedTask(null)} />
      )}
      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Create Task">
        <TaskForm
          onSuccess={() => setShowCreate(false)}
          onCancel={() => setShowCreate(false)}
        />
      </Modal>
    </div>
  );
}
