import Joi from 'joi';
import { AppError } from '../utils/appError.js';

const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      const message = error.details.map(detail => detail.message).join(', ');
      return next(new AppError(message, 400));
    }
    next();
  };
};

// Auth validation schemas
export const registerSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('user', 'admin').optional()
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

// Task validation schemas
export const createTaskSchema = Joi.object({
  title: Joi.string().max(200).required(),
  description: Joi.string().max(1000).optional(),
  status: Joi.string().valid('todo', 'in-progress', 'completed').default('todo'),
  priority: Joi.string().valid('low', 'medium', 'high').default('medium'),
  dueDate: Joi.date().optional(),
  assignedTo: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
  tags: Joi.array().items(Joi.string()).optional(),
  estimatedHours: Joi.number().min(0).optional()
});

export const updateTaskSchema = Joi.object({
  title: Joi.string().max(200).optional(),
  description: Joi.string().max(1000).optional(),
  status: Joi.string().valid('todo', 'in-progress', 'completed').optional(),
  priority: Joi.string().valid('low', 'medium', 'high').optional(),
  dueDate: Joi.date().optional(),
  assignedTo: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
  tags: Joi.array().items(Joi.string()).optional(),
  estimatedHours: Joi.number().min(0).optional(),
  actualHours: Joi.number().min(0).optional()
});

// User validation schemas
export const updateUserSchema = Joi.object({
  username: Joi.string().min(3).max(30).optional(),
  email: Joi.string().email().optional(),
  role: Joi.string().valid('user', 'admin').optional(),
  profile: Joi.object({
    firstName: Joi.string().max(50).optional(),
    lastName: Joi.string().max(50).optional(),
    avatar: Joi.string().uri().optional()
  }).optional(),
  isActive: Joi.boolean().optional()
});

export const validateRegister = validateRequest(registerSchema);
export const validateLogin = validateRequest(loginSchema);
export const validateCreateTask = validateRequest(createTaskSchema);
export const validateUpdateTask = validateRequest(updateTaskSchema);
export const validateUpdateUser = validateRequest(updateUserSchema);