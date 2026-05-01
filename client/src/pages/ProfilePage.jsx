/**
 * ProfilePage — user profile with stats
 */

import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { Shield, Mail, Calendar, CheckSquare, User } from 'lucide-react';
import { selectCurrentUser, fetchMe } from '../features/auth/authSlice';
import { selectAllTasks } from '../features/tasks/tasksSlice';
import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';
import { formatDate } from '../utils/helpers';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const tasks = useSelector(selectAllTasks);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [isSaving, setIsSaving] = useState(false);

  const myTasks = tasks.filter((t) => t.assigneeId === user?.id || t.creatorId === user?.id);
  const completed = myTasks.filter((t) => t.status === 'COMPLETED');

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await api.put('/users/me', { name });
      await dispatch(fetchMe());
      toast.success('Profile updated!');
      setIsEditing(false);
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-6">Profile</h1>

      {/* Profile card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 mb-6"
      >
        <div className="flex items-start gap-5">
          <Avatar user={user} size="xl" />
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <div className="flex items-center gap-2 mb-2">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-field flex-1"
                  autoFocus
                />
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="btn-primary py-2"
                >
                  {isSaving ? 'Saving…' : 'Save'}
                </button>
                <button
                  onClick={() => { setIsEditing(false); setName(user?.name || ''); }}
                  className="btn-ghost py-2"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl font-bold text-white">{user?.name}</h2>
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-xs text-gray-500 hover:text-primary-400 transition-colors"
                >
                  Edit
                </button>
              </div>
            )}

            <div className="flex flex-wrap gap-2 mb-3">
              <Badge variant={user?.role === 'ADMIN' ? 'primary' : 'default'}>
                <Shield size={10} />
                {user?.role}
              </Badge>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Mail size={14} />
                {user?.email}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Calendar size={14} />
                Member since {formatDate(user?.createdAt)}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass-card p-5 text-center">
          <p className="text-3xl font-bold text-primary-400">{myTasks.length}</p>
          <p className="text-sm text-gray-400 mt-1 flex items-center justify-center gap-1.5">
            <CheckSquare size={14} /> Total Tasks
          </p>
        </div>
        <div className="glass-card p-5 text-center">
          <p className="text-3xl font-bold text-green-400">{completed.length}</p>
          <p className="text-sm text-gray-400 mt-1 flex items-center justify-center gap-1.5">
            <User size={14} /> Completed
          </p>
        </div>
      </div>
    </div>
  );
}
