/**
 * Auth Middleware
 * Verifies JWT access token on protected routes
 */

const { verifyAccessToken } = require('../services/auth.service');

const authenticate = (req, res, next) => {
  try {
    // Support both Authorization header and cookie
    const authHeader = req.headers.authorization;
    const token =
      (authHeader && authHeader.startsWith('Bearer ')
        ? authHeader.slice(7)
        : null) || req.cookies?.accessToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required. Please login.',
      });
    }

    const decoded = verifyAccessToken(token);
    req.user = decoded; // { id, email, role }
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Access token expired. Please refresh.',
        code: 'TOKEN_EXPIRED',
      });
    }
    return res.status(401).json({
      success: false,
      message: 'Invalid access token.',
    });
  }
};

module.exports = { authenticate };
