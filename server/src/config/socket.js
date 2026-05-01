/**
 * Socket.io configuration and event management
 * Handles real-time task updates and user notifications
 */

const socketHandler = (io) => {
  // Track online users: userId -> socketId
  const onlineUsers = new Map();

  io.on('connection', (socket) => {
    console.log(`[Socket] Client connected: ${socket.id}`);

    // User joins with their userId to enable targeted notifications
    socket.on('user:join', (userId) => {
      onlineUsers.set(userId, socket.id);
      socket.join(`user:${userId}`); // Personal room for notifications
      console.log(`[Socket] User ${userId} joined`);
    });

    // Join a project/workspace room for collaborative updates
    socket.on('room:join', (roomId) => {
      socket.join(`room:${roomId}`);
    });

    socket.on('room:leave', (roomId) => {
      socket.leave(`room:${roomId}`);
    });

    socket.on('disconnect', () => {
      // Clean up user from online map
      for (const [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
          break;
        }
      }
      console.log(`[Socket] Client disconnected: ${socket.id}`);
    });
  });

  // Helper: emit task events to all connected clients
  io.emitTaskCreated = (task) => io.emit('task:created', task);
  io.emitTaskUpdated = (task) => io.emit('task:updated', task);
  io.emitTaskDeleted = (taskId) => io.emit('task:deleted', { id: taskId });

  // Helper: send notification to specific user
  io.notifyUser = (userId, notification) => {
    io.to(`user:${userId}`).emit('notification:new', notification);
  };

  return io;
};

module.exports = socketHandler;
