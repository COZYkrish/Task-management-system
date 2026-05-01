/**
 * useSocket — manages WebSocket lifecycle, tied to auth state
 * Connects on login, dispatches real-time events to Redux
 */

import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentUser } from '../features/auth/authSlice';
import { taskCreated, taskUpdated, taskDeleted } from '../features/tasks/tasksSlice';
import { addNotification } from '../features/notifications/notificationsSlice';
import { connectSocket, disconnectSocket } from '../services/socket';
import toast from 'react-hot-toast';

export const useSocket = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!user) {
      disconnectSocket();
      return;
    }

    const socket = connectSocket(user.id);
    socketRef.current = socket;

    // ── Task Events ───────────────────────────────────────────
    socket.on('task:created', (task) => {
      dispatch(taskCreated(task));
    });

    socket.on('task:updated', (task) => {
      dispatch(taskUpdated(task));
    });

    socket.on('task:deleted', ({ id }) => {
      dispatch(taskDeleted({ id }));
    });

    // ── Notification Events ───────────────────────────────────
    socket.on('notification:new', (notification) => {
      dispatch(addNotification(notification));
      toast(notification.message, {
        icon: '🔔',
        style: {
          background: '#1e1e2e',
          color: '#fff',
          border: '1px solid rgba(139, 92, 246, 0.3)',
        },
      });
    });

    return () => {
      socket.off('task:created');
      socket.off('task:updated');
      socket.off('task:deleted');
      socket.off('notification:new');
    };
  }, [user, dispatch]);

  return socketRef.current;
};
