const express = require('express');
const router = express.Router();
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  reorderTasks,
} = require('../controllers/task.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');
const {
  createTaskSchema,
  updateTaskSchema,
  reorderSchema,
} = require('../validations/task.validation');

// All task routes require authentication
router.use(authenticate);

/**
 * @route   GET /api/tasks
 * @desc    Get all tasks with pagination and filters
 * @access  Private
 */
router.get('/', getTasks);

/**
 * @route   POST /api/tasks
 * @desc    Create a new task
 * @access  Private
 */
router.post('/', validate(createTaskSchema), createTask);

/**
 * @route   PATCH /api/tasks/reorder
 * @desc    Bulk reorder tasks (Kanban DnD)
 * @access  Private
 */
router.patch('/reorder', validate(reorderSchema), reorderTasks);

/**
 * @route   GET /api/tasks/:id
 * @desc    Get single task by ID
 * @access  Private
 */
router.get('/:id', getTask);

/**
 * @route   PUT /api/tasks/:id
 * @desc    Update task
 * @access  Private
 */
router.put('/:id', validate(updateTaskSchema), updateTask);

/**
 * @route   DELETE /api/tasks/:id
 * @desc    Delete task (creator or admin only)
 * @access  Private
 */
router.delete('/:id', deleteTask);

module.exports = router;
