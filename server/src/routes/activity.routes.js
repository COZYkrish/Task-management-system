const express = require('express');
const router = express.Router();
const { getActivity, getTaskActivityLog } = require('../controllers/activity.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.use(authenticate);

/**
 * @route GET /api/activity
 * @desc  Global activity feed
 * @access Private
 */
router.get('/', getActivity);

/**
 * @route GET /api/activity/task/:taskId
 * @desc  Activity log for a specific task
 * @access Private
 */
router.get('/task/:taskId', getTaskActivityLog);

module.exports = router;
