/**
 * Todo Routes
 * Defines all API endpoints for Todo operations
 * Implements RESTful API design patterns
 */

import express from 'express';
import {
  getAllTodos,
  getTodoById,
  createTodo,
  updateTodo,
  toggleTodoComplete,
  deleteTodo,
  getTodoStats,
  deleteCompletedTodos
} from '../controllers/todoController.js';

// Create router instance
const router = express.Router();

/**
 * @route   GET /api/todos
 * @desc    Get all todos with optional pagination
 * @access  Public
 * @query   page, limit, sortBy, sortOrder
 */
router.get('/', getAllTodos);

/**
 * @route   GET /api/todos/stats
 * @desc    Get todo statistics (total, completed, pending)
 * @access  Public
 */
router.get('/stats', getTodoStats);

/**
 * @route   GET /api/todos/:id
 * @desc    Get a single todo by ID
 * @access  Public
 * @params  id - MongoDB ObjectId
 */
router.get('/:id', getTodoById);

/**
 * @route   POST /api/todos
 * @desc    Create a new todo
 * @access  Public
 * @body    { text: string }
 */
router.post('/', createTodo);

/**
 * @route   PUT /api/todos/:id
 * @desc    Update a todo by ID
 * @access  Public
 * @params  id - MongoDB ObjectId
 * @body    { text?: string, completed?: boolean }
 */
router.put('/:id', updateTodo);

/**
 * @route   PATCH /api/todos/:id/toggle
 * @desc    Toggle todo completion status
 * @access  Public
 * @params  id - MongoDB ObjectId
 */
router.patch('/:id/toggle', toggleTodoComplete);

/**
 * @route   DELETE /api/todos/completed
 * @desc    Delete all completed todos
 * @access  Public
 */
router.delete('/completed', deleteCompletedTodos);

/**
 * @route   DELETE /api/todos/:id
 * @desc    Delete a todo by ID
 * @access  Public
 * @params  id - MongoDB ObjectId
 */
router.delete('/:id', deleteTodo);

export default router;
