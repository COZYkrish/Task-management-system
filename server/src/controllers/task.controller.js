/**
 * Task Controller
 * CRUD operations with pagination, filtering, search, and real-time broadcasts
 */

const prisma = require('../config/db');
const { logActivity } = require('../services/activity.service');

// Helper: parse tags JSON string from DB
const parseTags = (task) => ({
  ...task,
  tags: task.tags ? JSON.parse(task.tags) : [],
});

/**
 * GET /api/tasks
 * Query params: status, priority, assigneeId, search, page, limit, sortBy, sortOrder
 */
const getTasks = async (req, res, next) => {
  try {
    const {
      status,
      priority,
      assigneeId,
      search,
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    // Build dynamic where clause
    const where = {};
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (assigneeId) where.assigneeId = assigneeId;
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
      ];
    }

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        skip,
        take,
        orderBy: { [sortBy]: sortOrder },
        include: {
          assignee: {
            select: { id: true, name: true, email: true, avatar: true },
          },
          creator: {
            select: { id: true, name: true, email: true, avatar: true },
          },
        },
      }),
      prisma.task.count({ where }),
    ]);

    res.json({
      success: true,
      data: {
        tasks: tasks.map(parseTags),
        pagination: {
          page: parseInt(page),
          limit: take,
          total,
          totalPages: Math.ceil(total / take),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/tasks/:id
 */
const getTask = async (req, res, next) => {
  try {
    const task = await prisma.task.findUnique({
      where: { id: req.params.id },
      include: {
        assignee: { select: { id: true, name: true, email: true, avatar: true } },
        creator: { select: { id: true, name: true, email: true, avatar: true } },
        activities: {
          orderBy: { createdAt: 'desc' },
          take: 10,
          include: {
            user: { select: { id: true, name: true, avatar: true } },
          },
        },
      },
    });

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }

    res.json({ success: true, data: parseTags(task) });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/tasks
 */
const createTask = async (req, res, next) => {
  try {
    const { tags, ...rest } = req.body;

    const task = await prisma.task.create({
      data: {
        ...rest,
        tags: JSON.stringify(tags || []),
        creatorId: req.user.id,
      },
      include: {
        assignee: { select: { id: true, name: true, email: true, avatar: true } },
        creator: { select: { id: true, name: true, email: true, avatar: true } },
      },
    });

    // Log activity
    await logActivity({
      taskId: task.id,
      userId: req.user.id,
      action: 'created',
      metadata: { title: task.title },
    });

    const parsed = parseTags(task);

    // Broadcast to all connected clients
    req.io?.emitTaskCreated(parsed);

    // Notify assignee if different from creator
    if (task.assigneeId && task.assigneeId !== req.user.id) {
      req.io?.notifyUser(task.assigneeId, {
        type: 'task_assigned',
        message: `You were assigned to "${task.title}"`,
        taskId: task.id,
      });
    }

    res.status(201).json({
      success: true,
      message: 'Task created successfully.',
      data: parsed,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/tasks/:id
 */
const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { tags, ...rest } = req.body;

    // Get original task for change tracking
    const original = await prisma.task.findUnique({ where: { id } });
    if (!original) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }

    const updateData = { ...rest };
    if (tags !== undefined) updateData.tags = JSON.stringify(tags);

    const task = await prisma.task.update({
      where: { id },
      data: updateData,
      include: {
        assignee: { select: { id: true, name: true, email: true, avatar: true } },
        creator: { select: { id: true, name: true, email: true, avatar: true } },
      },
    });

    // Determine what changed for activity log
    const changes = {};
    if (rest.status && rest.status !== original.status) {
      changes.status = { from: original.status, to: rest.status };
    }
    if (rest.assigneeId !== undefined && rest.assigneeId !== original.assigneeId) {
      changes.assignee = { from: original.assigneeId, to: rest.assigneeId };
    }
    if (rest.priority && rest.priority !== original.priority) {
      changes.priority = { from: original.priority, to: rest.priority };
    }

    const action = rest.status && rest.status !== original.status
      ? 'status_changed'
      : rest.assigneeId !== undefined && rest.assigneeId !== original.assigneeId
      ? 'assigned'
      : 'updated';

    await logActivity({
      taskId: id,
      userId: req.user.id,
      action,
      metadata: changes,
    });

    const parsed = parseTags(task);
    req.io?.emitTaskUpdated(parsed);

    // Notify new assignee
    if (
      changes.assignee?.to &&
      changes.assignee.to !== req.user.id
    ) {
      req.io?.notifyUser(changes.assignee.to, {
        type: 'task_assigned',
        message: `You were assigned to "${task.title}"`,
        taskId: task.id,
      });
    }

    res.json({
      success: true,
      message: 'Task updated successfully.',
      data: parsed,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/tasks/:id
 */
const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    const task = await prisma.task.findUnique({ where: { id } });
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }

    // Only creator or admin can delete
    if (task.creatorId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to delete this task.',
      });
    }

    await prisma.task.delete({ where: { id } });

    req.io?.emitTaskDeleted(id);

    res.json({ success: true, message: 'Task deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/tasks/reorder
 * Updates order and status for Kanban drag-and-drop
 */
const reorderTasks = async (req, res, next) => {
  try {
    const { tasks } = req.body;

    // Batch update all reordered tasks in a transaction
    await prisma.$transaction(
      tasks.map(({ id, order, status }) =>
        prisma.task.update({
          where: { id },
          data: { order, status },
        })
      )
    );

    res.json({ success: true, message: 'Tasks reordered.' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getTasks, getTask, createTask, updateTask, deleteTask, reorderTasks };
