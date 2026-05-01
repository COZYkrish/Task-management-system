/**
 * KanbanBoard — Drag-and-drop Kanban with @dnd-kit
 * Supports cross-column moves and reordering within columns
 */

import { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

import {
  selectKanbanColumns,
  taskUpdated,
  reorderTasks,
  updateTask,
} from '../../features/tasks/tasksSlice';
import TaskCard from '../tasks/TaskCard';
import TaskModal from '../tasks/TaskModal';
import { STATUS_CONFIG } from '../../utils/helpers';

// ── Sortable Task wrapper ─────────────────────────────────────

function SortableTask({ task, onCardClick }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: task.id, data: { task } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="relative">
      <TaskCard task={task} onClick={onCardClick} isDragging={isDragging} />
    </div>
  );
}

// ── Column component ──────────────────────────────────────────

function KanbanColumn({ status, tasks, onCardClick, onAddTask }) {
  const config = STATUS_CONFIG[status];
  const colorMap = {
    TODO: 'border-gray-600/30',
    IN_PROGRESS: 'border-blue-500/30',
    COMPLETED: 'border-green-500/30',
  };
  const dotMap = {
    TODO: 'bg-gray-400',
    IN_PROGRESS: 'bg-blue-400',
    COMPLETED: 'bg-green-400',
  };

  return (
    <div className={`flex flex-col min-h-[200px] w-full min-w-[280px] max-w-[320px]
                     bg-white/3 rounded-xl border ${colorMap[status]} p-4`}>
      {/* Column header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${dotMap[status]}`} />
          <h3 className="font-semibold text-sm text-gray-200">{config.label}</h3>
          <span className="px-1.5 py-0.5 rounded text-xs bg-white/5 text-gray-400 font-mono">
            {tasks.length}
          </span>
        </div>
        <button
          onClick={() => onAddTask(status)}
          className="p-1 rounded text-gray-500 hover:text-primary-400 hover:bg-primary-500/10
                     transition-colors"
          title={`Add task to ${config.label}`}
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Drop zone */}
      <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-2.5 flex-1">
          {tasks.map((task) => (
            <SortableTask key={task.id} task={task} onCardClick={onCardClick} />
          ))}
          {tasks.length === 0 && (
            <div className="flex flex-col items-center justify-center py-10 text-gray-600 text-xs">
              <span className="text-2xl mb-2">📭</span>
              <span>No tasks here</span>
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
}

// ── Main Board ────────────────────────────────────────────────

export default function KanbanBoard({ onAddTask }) {
  const dispatch = useDispatch();
  const columns = useSelector(selectKanbanColumns);
  const [activeTask, setActiveTask] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const handleDragStart = ({ active }) => {
    setActiveTask(active.data.current?.task || null);
  };

  const handleDragEnd = useCallback(
    ({ active, over }) => {
      setActiveTask(null);
      if (!over || active.id === over.id) return;

      const activeTask = Object.values(columns)
        .flat()
        .find((t) => t.id === active.id);
      const overTask = Object.values(columns)
        .flat()
        .find((t) => t.id === over.id);

      if (!activeTask) return;

      const targetStatus = overTask?.status || over.id;

      // If moving to a different column, update status
      if (activeTask.status !== targetStatus && ['TODO', 'IN_PROGRESS', 'COMPLETED'].includes(targetStatus)) {
        dispatch(
          updateTask({ id: activeTask.id, status: targetStatus })
        );
        return;
      }

      // Same column reorder
      const column = columns[activeTask.status];
      const oldIdx = column.findIndex((t) => t.id === active.id);
      const newIdx = column.findIndex((t) => t.id === over.id);
      if (oldIdx === -1 || newIdx === -1) return;

      const reordered = arrayMove(column, oldIdx, newIdx);
      const updates = reordered.map((t, i) => ({
        id: t.id,
        order: i,
        status: t.status,
      }));

      dispatch(reorderTasks(updates));
    },
    [columns, dispatch]
  );

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide min-h-[500px]">
          {(['TODO', 'IN_PROGRESS', 'COMPLETED']).map((status) => (
            <KanbanColumn
              key={status}
              status={status}
              tasks={columns[status] || []}
              onCardClick={setSelectedTask}
              onAddTask={onAddTask}
            />
          ))}
        </div>

        {/* Drag overlay */}
        <DragOverlay dropAnimation={{ duration: 150 }}>
          {activeTask ? <TaskCard task={activeTask} isDragging /> : null}
        </DragOverlay>
      </DndContext>

      {/* Task detail modal */}
      {selectedTask && (
        <TaskModal task={selectedTask} onClose={() => setSelectedTask(null)} />
      )}
    </>
  );
}
