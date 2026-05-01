/**
 * Activity Service
 * Creates audit trail entries for all task mutations
 */

const prisma = require('../config/db');

/**
 * Log an activity event
 * @param {Object} params
 * @param {string} params.taskId - The task being acted on
 * @param {string} params.userId - The user performing the action
 * @param {string} params.action - Action type (e.g. "created", "status_changed")
 * @param {Object} params.metadata - Additional context (e.g. { from: "TODO", to: "IN_PROGRESS" })
 */
const logActivity = async ({ taskId, userId, action, metadata = {} }) => {
  try {
    await prisma.activityLog.create({
      data: {
        taskId,
        userId,
        action,
        metadata: JSON.stringify(metadata),
      },
    });
  } catch (error) {
    // Non-critical: log the error but don't fail the request
    console.error('[Activity] Failed to log activity:', error.message);
  }
};

/**
 * Get activity feed for a specific task
 */
const getTaskActivity = async (taskId, limit = 20) => {
  return prisma.activityLog.findMany({
    where: { taskId },
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: {
      user: {
        select: { id: true, name: true, email: true, avatar: true },
      },
    },
  });
};

/**
 * Get global activity feed (all tasks)
 */
const getGlobalActivity = async (limit = 50) => {
  return prisma.activityLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: {
      user: {
        select: { id: true, name: true, email: true, avatar: true },
      },
      task: {
        select: { id: true, title: true },
      },
    },
  });
};

module.exports = { logActivity, getTaskActivity, getGlobalActivity };
