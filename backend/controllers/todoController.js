/**
 * Todo Controller
 * Handles all business logic for Todo operations
 * Implements CRUD operations and additional functionality
 */

import Todo from '../models/Todo.js';

/**
 * Get all todos with optional pagination
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getAllTodos = async (req, res) => {
  try {
    // Extract query parameters for pagination
    const { page = 1, limit = 50, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    
    // Convert string parameters to appropriate types
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    
    // Validate pagination parameters
    if (pageNum < 1 || limitNum < 1 || limitNum > 100) {
      return res.status(400).json({
        success: false,
        message: 'Invalid pagination parameters. Page must be >= 1, limit must be between 1-100'
      });
    }
    
    // Get paginated todos using static method
    const result = await Todo.getPaginatedTodos({
      page: pageNum,
      limit: limitNum,
      sortBy,
      sortOrder
    });
    
    res.status(200).json({
      success: true,
      message: 'Todos retrieved successfully',
      data: result.todos,
      pagination: result.pagination
    });
    
  } catch (error) {
    console.error('Error getting todos:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while retrieving todos',
      error: error.message
    });
  }
};

/**
 * Get a single todo by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getTodoById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate MongoDB ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid todo ID format'
      });
    }
    
    // Find todo by ID
    const todo = await Todo.findById(id);
    
    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Todo retrieved successfully',
      data: todo
    });
    
  } catch (error) {
    console.error('Error getting todo by ID:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while retrieving todo',
      error: error.message
    });
  }
};

/**
 * Create a new todo
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const createTodo = async (req, res) => {
  try {
    const { text } = req.body;
    
    // Validate required fields
    if (!text || text.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Todo text is required and cannot be empty'
      });
    }
    
    // Validate text length
    if (text.length > 500) {
      return res.status(400).json({
        success: false,
        message: 'Todo text cannot exceed 500 characters'
      });
    }
    
    // Create new todo
    const newTodo = new Todo({
      text: text.trim()
    });
    
    // Save to database
    const savedTodo = await newTodo.save();
    
    res.status(201).json({
      success: true,
      message: 'Todo created successfully',
      data: savedTodo
    });
    
  } catch (error) {
    console.error('Error creating todo:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Internal server error while creating todo',
      error: error.message
    });
  }
};

/**
 * Update a todo by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { text, completed } = req.body;
    
    // Validate MongoDB ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid todo ID format'
      });
    }
    
    // Build update object with only provided fields
    const updateData = {};
    if (text !== undefined) {
      if (!text || text.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Todo text cannot be empty'
        });
      }
      if (text.length > 500) {
        return res.status(400).json({
          success: false,
          message: 'Todo text cannot exceed 500 characters'
        });
      }
      updateData.text = text.trim();
    }
    if (completed !== undefined) {
      updateData.completed = Boolean(completed);
    }
    
    // If no valid fields to update
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid fields provided for update'
      });
    }
    
    // Find and update todo
    const updatedTodo = await Todo.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!updatedTodo) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Todo updated successfully',
      data: updatedTodo
    });
    
  } catch (error) {
    console.error('Error updating todo:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Internal server error while updating todo',
      error: error.message
    });
  }
};

/**
 * Toggle todo completion status
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const toggleTodoComplete = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate MongoDB ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid todo ID format'
      });
    }
    
    // Find todo and toggle completion
    const todo = await Todo.findById(id);
    
    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found'
      });
    }
    
    // Use instance method to toggle completion
    const updatedTodo = await todo.toggleComplete();
    
    res.status(200).json({
      success: true,
      message: `Todo marked as ${updatedTodo.completed ? 'completed' : 'pending'}`,
      data: updatedTodo
    });
    
  } catch (error) {
    console.error('Error toggling todo completion:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while toggling todo completion',
      error: error.message
    });
  }
};

/**
 * Delete a todo by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate MongoDB ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid todo ID format'
      });
    }
    
    // Find and delete todo
    const deletedTodo = await Todo.findByIdAndDelete(id);
    
    if (!deletedTodo) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Todo deleted successfully',
      data: deletedTodo
    });
    
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while deleting todo',
      error: error.message
    });
  }
};

/**
 * Get todo statistics
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getTodoStats = async (req, res) => {
  try {
    // Get statistics using static method
    const stats = await Todo.getStats();
    
    res.status(200).json({
      success: true,
      message: 'Todo statistics retrieved successfully',
      data: stats
    });
    
  } catch (error) {
    console.error('Error getting todo statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while retrieving statistics',
      error: error.message
    });
  }
};

/**
 * Delete all completed todos
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const deleteCompletedTodos = async (req, res) => {
  try {
    // Delete all completed todos
    const result = await Todo.deleteMany({ completed: true });
    
    res.status(200).json({
      success: true,
      message: `${result.deletedCount} completed todos deleted successfully`,
      data: { deletedCount: result.deletedCount }
    });
    
  } catch (error) {
    console.error('Error deleting completed todos:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while deleting completed todos',
      error: error.message
    });
  }
};
