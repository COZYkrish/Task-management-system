/**
 * ActivityPage — global audit trail with metadata display
 */

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Avatar from '../components/ui/Avatar';
import { formatRelative } from '../utils/helpers';
import api from '../services/api';

const ACTION_ICONS = {
  created:        { emoji: '✨', label: 'created' },
  updated:        { emoji: '✏️',  label: 'updated' },
  status_changed: { emoji: '🔄', label: 'changed status of' },
  assigned:       { emoji: '👤', label: 'assigned' },
  deleted:        { emoji: '🗑️', label: 'deleted' },
};

function ActivityItem({ activity }) {
  const actionConfig = ACTION_ICONS[activity.action] || { emoji: '📌', label: activity.action };

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-start gap-4 py-4 border-b border-white/5 last:border-0"
    >
      <Avatar user={activity.user} size="sm" className="flex-shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-200 leading-relaxed">
          <span className="font-semibold text-white">{activity.user?.name}</span>
          {' '}
          <span className="text-gray-400">{actionConfig.label}</span>
          {activity.task && (
            <>
              {' '}
              <span className="text-primary-400 font-medium">{activity.task.title}</span>
            </>
          )}
        </p>

        {/* Metadata */}
        {activity.metadata && Object.keys(activity.metadata).length > 0 && (
          <div className="mt-1.5 flex flex-wrap gap-2">
            {activity.metadata.status && (
              <span className="text-xs px-2 py-0.5 rounded bg-white/5 text-gray-400">
                {activity.metadata.status.from} → {activity.metadata.status.to}
              </span>
            )}
            {activity.metadata.priority && (
              <span className="text-xs px-2 py-0.5 rounded bg-white/5 text-gray-400">
                Priority: {activity.metadata.priority.from} → {activity.metadata.priority.to}
              </span>
            )}
          </div>
        )}

        <p className="text-xs text-gray-600 mt-1">
          {actionConfig.emoji} {formatRelative(activity.createdAt)}
        </p>
      </div>
    </motion.div>
  );
}

export default function ActivityPage() {
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api
      .get('/activity?limit=100')
      .then((r) => setActivities(r.data.data))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-primary-500/10">
          <Activity size={20} className="text-primary-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Activity Feed</h1>
          <p className="text-gray-400 text-sm">Full audit trail of all task changes</p>
        </div>
      </div>

      <div className="glass-card px-6 py-2">
        {isLoading ? (
          <div className="space-y-4 py-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex gap-3">
                <div className="w-8 h-8 skeleton rounded-full flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 skeleton rounded w-3/4" />
                  <div className="h-3 skeleton rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : activities.length === 0 ? (
          <div className="py-16 text-center text-gray-500">
            <p className="text-3xl mb-2">📭</p>
            <p>No activity yet</p>
          </div>
        ) : (
          activities.map((a) => <ActivityItem key={a.id} activity={a} />)
        )}
      </div>
    </div>
  );
}
