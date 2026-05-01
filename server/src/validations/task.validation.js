/**
 * Task Validation Schemas (Joi)
 */

const Joi = require('joi');

const VALID_STATUSES = ['TODO', 'IN_PROGRESS', 'COMPLETED'];
const VALID_PRIORITIES = ['LOW', 'MEDIUM', 'HIGH'];

const createTaskSchema = Joi.object({
  title: Joi.string().min(1).max(200).required().messages({
    'string.empty': 'Task title cannot be empty',
    'any.required': 'Task title is required',
  }),
  description: Joi.string().max(2000).allow('', null),
  status: Joi.string().valid(...VALID_STATUSES).default('TODO'),
  priority: Joi.string().valid(...VALID_PRIORITIES).default('MEDIUM'),
  dueDate: Joi.date().iso().allow(null),
  tags: Joi.array().items(Joi.string().max(30)).max(10).default([]),
  assigneeId: Joi.string().uuid().allow(null),
});

const updateTaskSchema = Joi.object({
  title: Joi.string().min(1).max(200),
  description: Joi.string().max(2000).allow('', null),
  status: Joi.string().valid(...VALID_STATUSES),
  priority: Joi.string().valid(...VALID_PRIORITIES),
  dueDate: Joi.date().iso().allow(null),
  tags: Joi.array().items(Joi.string().max(30)).max(10),
  assigneeId: Joi.string().uuid().allow(null),
  order: Joi.number().integer().min(0),
}).min(1).messages({
  'object.min': 'At least one field must be provided for update',
});

const reorderSchema = Joi.object({
  tasks: Joi.array().items(
    Joi.object({
      id: Joi.string().uuid().required(),
      order: Joi.number().integer().min(0).required(),
      status: Joi.string().valid(...VALID_STATUSES).required(),
    })
  ).min(1).required(),
});

module.exports = { createTaskSchema, updateTaskSchema, reorderSchema };
