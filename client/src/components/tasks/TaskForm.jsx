/**
 * TaskForm — reusable create/edit form with react-hook-form + Zod
 */

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { createTask, updateTask } from '../../features/tasks/tasksSlice';
import { selectCurrentUser } from '../../features/auth/authSlice';
import toast from 'react-hot-toast';

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().max(2000).optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'COMPLETED']),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
  dueDate: z.string().optional(),
  tags: z.string().optional(), // comma-separated string in form
});

export default function TaskForm({ task, onSuccess, onCancel }) {
  const dispatch = useDispatch();
  const isEditing = !!task;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: task?.title || '',
      description: task?.description || '',
      status: task?.status || 'TODO',
      priority: task?.priority || 'MEDIUM',
      dueDate: task?.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
      tags: task?.tags?.join(', ') || '',
    },
  });

  const onSubmit = async (values) => {
    const payload = {
      ...values,
      tags: values.tags
        ? values.tags.split(',').map((t) => t.trim()).filter(Boolean)
        : [],
      dueDate: values.dueDate || null,
      description: values.description || null,
    };

    try {
      if (isEditing) {
        await dispatch(updateTask({ id: task.id, ...payload })).unwrap();
        toast.success('Task updated!');
      } else {
        await dispatch(createTask(payload)).unwrap();
        toast.success('Task created!');
      }
      onSuccess?.();
    } catch (err) {
      toast.error(err || 'Something went wrong');
    }
  };

  const inputClass = `w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10
    text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2
    focus:ring-primary-500 focus:border-transparent transition-all`;

  const labelClass = 'block text-sm font-medium text-gray-300 mb-1.5';
  const errorClass = 'text-xs text-red-400 mt-1';

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Title */}
      <div>
        <label className={labelClass}>Title *</label>
        <input
          {...register('title')}
          placeholder="What needs to be done?"
          className={inputClass}
          autoFocus
        />
        {errors.title && <p className={errorClass}>{errors.title.message}</p>}
      </div>

      {/* Description */}
      <div>
        <label className={labelClass}>Description</label>
        <textarea
          {...register('description')}
          placeholder="Add more details..."
          rows={3}
          className={`${inputClass} resize-none`}
        />
      </div>

      {/* Status + Priority row */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Status</label>
          <select {...register('status')} className={inputClass}>
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Priority</label>
          <select {...register('priority')} className={inputClass}>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </div>
      </div>

      {/* Due Date */}
      <div>
        <label className={labelClass}>Due Date</label>
        <input
          type="date"
          {...register('dueDate')}
          className={`${inputClass} [color-scheme:dark]`}
        />
      </div>

      {/* Tags */}
      <div>
        <label className={labelClass}>Tags</label>
        <input
          {...register('tags')}
          placeholder="design, frontend, bug (comma-separated)"
          className={inputClass}
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="btn-ghost">
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary min-w-[100px]"
        >
          {isSubmitting
            ? 'Saving...'
            : isEditing
            ? 'Save Changes'
            : 'Create Task'}
        </button>
      </div>
    </form>
  );
}
