/**
 * User Controller
 * Profile management and user listing (Admin)
 */

const prisma = require('../config/db');

const SAFE_USER_FIELDS = {
  id: true,
  name: true,
  email: true,
  role: true,
  avatar: true,
  createdAt: true,
  updatedAt: true,
};

/**
 * GET /api/users/me
 */
const getMe = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: SAFE_USER_FIELDS,
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/users/me
 */
const updateMe = async (req, res, next) => {
  try {
    const { name, avatar } = req.body;

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: { name, avatar },
      select: SAFE_USER_FIELDS,
    });

    res.json({
      success: true,
      message: 'Profile updated.',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/users
 * Admin only — list all users
 */
const getUsers = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: SAFE_USER_FIELDS,
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};

module.exports = { getMe, updateMe, getUsers };
