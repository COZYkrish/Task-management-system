/**
 * KanbanPage — full-screen Kanban board
 */

import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { fetchTasks } from '../features/tasks/tasksSlice';
import KanbanBoard from '../components/kanban/KanbanBoard';
import Modal from '../components/ui/Modal';
import TaskForm from '../components/tasks/TaskForm';

export default function KanbanPage() {
  const dispatch = useDispatch();
  const [showCreate, setShowCreate] = useState(false);
  const [defaultStatus, setDefaultStatus] = useState('TODO');

  useEffect(() => {
    dispatch(fetchTasks({ limit: 100 }));
  }, [dispatch]);

  const handleAddTask = (status) => {
    setDefaultStatus(status);
    setShowCreate(true);
  };

  return (
    <div className="p-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-white">Kanban Board</h1>
          <p className="text-gray-400 text-sm mt-0.5">Drag tasks between columns to update status</p>
        </div>
        <button
          id="kanban-add-task"
          onClick={() => setShowCreate(true)}
          className="btn-primary"
        >
          <Plus size={16} />
          Add Task
        </button>
      </div>

      {/* Board */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-1 overflow-hidden"
      >
        <KanbanBoard onAddTask={handleAddTask} />
      </motion.div>

      <Modal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        title="Create Task"
      >
        <TaskForm
          task={defaultStatus !== 'TODO' ? { status: defaultStatus } : undefined}
          onSuccess={() => setShowCreate(false)}
          onCancel={() => setShowCreate(false)}
        />
      </Modal>
    </div>
  );
}
