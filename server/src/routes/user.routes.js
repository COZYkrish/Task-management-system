const express = require('express');
const router = express.Router();
const { getMe, updateMe, getUsers } = require('../controllers/user.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');

router.use(authenticate);

/**
 * @route GET /api/users/me
 * @desc  Get current user profile
 * @access Private
 */
router.get('/me', getMe);

/**
 * @route PUT /api/users/me
 * @desc  Update current user profile
 * @access Private
 */
router.put('/me', updateMe);

/**
 * @route GET /api/users
 * @desc  List all users (Admin only)
 * @access Private - Admin
 */
router.get('/', authorize('ADMIN'), getUsers);

module.exports = router;
