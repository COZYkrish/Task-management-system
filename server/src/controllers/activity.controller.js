/**
 * Activity Controller
 * Returns audit trail for tasks and global feed
 */

const { getTaskActivity, getGlobalActivity } = require('../services/activity.service');

/**
 * GET /api/activity
 * Global activity feed
 */
const getActivity = async (req, res, next) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 50, 100);
    const activities = await getGlobalActivity(limit);

    const parsed = activities.map((a) => ({
      ...a,
      metadata: JSON.parse(a.metadata || '{}'),
    }));

    res.json({ success: true, data: parsed });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/activity/task/:taskId
 * Activity for a specific task
 */
const getTaskActivityLog = async (req, res, next) => {
  try {
    const activities = await getTaskActivity(req.params.taskId);

    const parsed = activities.map((a) => ({
      ...a,
      metadata: JSON.parse(a.metadata || '{}'),
    }));

    res.json({ success: true, data: parsed });
  } catch (error) {
    next(error);
  }
};

module.exports = { getActivity, getTaskActivityLog };
