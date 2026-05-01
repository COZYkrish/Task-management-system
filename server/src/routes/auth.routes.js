const express = require('express');
const router = express.Router();
const { register, login, refresh, logout } = require('../controllers/auth.controller');
const { validate } = require('../middleware/validate.middleware');
const { registerSchema, loginSchema } = require('../validations/auth.validation');

/**
 * @route POST /api/auth/register
 * @desc  Register a new user
 * @access Public
 */
router.post('/register', validate(registerSchema), register);

/**
 * @route POST /api/auth/login
 * @desc  Login with email/password
 * @access Public
 */
router.post('/login', validate(loginSchema), login);

/**
 * @route POST /api/auth/refresh
 * @desc  Rotate refresh token and get new access token
 * @access Public (requires valid refresh token cookie)
 */
router.post('/refresh', refresh);

/**
 * @route POST /api/auth/logout
 * @desc  Invalidate refresh token
 * @access Public
 */
router.post('/logout', logout);

module.exports = router;
