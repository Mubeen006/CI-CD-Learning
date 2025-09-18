/**
 * Todo Model
 * Defines the schema and model for Todo documents in MongoDB
 */

import mongoose from 'mongoose';
import { config } from '../config/config.js';

/**
 * Todo Schema Definition
 * Defines the structure and validation rules for Todo documents
 */
const todoSchema = new mongoose.Schema({
  // Todo text content - required field with validation
  text: {
    type: String,
    required: [true, 'Todo text is required'],
    trim: true, // Remove whitespace from beginning and end
    minlength: [1, 'Todo text must be at least 1 character long'],
    maxlength: [500, 'Todo text cannot exceed 500 characters']
  },
  
  // Completion status - defaults to false
  completed: {
    type: Boolean,
    default: false
  },
  
  // Creation timestamp - automatically set
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  // Last update timestamp - automatically updated
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  // Schema options
  timestamps: true, // Automatically manage createdAt and updatedAt
  versionKey: false // Disable __v field
});

/**
 * Pre-save middleware
 * Updates the updatedAt field before saving
 */
todoSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

/**
 * Pre-update middleware
 * Updates the updatedAt field before updating
 */
todoSchema.pre(['updateOne', 'findOneAndUpdate'], function(next) {
  this.set({ updatedAt: new Date() });
  next();
});

/**
 * Instance method to toggle completion status
 * @returns {Promise<Document>} Updated todo document
 */
todoSchema.methods.toggleComplete = function() {
  this.completed = !this.completed;
  return this.save();
};

/**
 * Static method to get todo statistics
 * @returns {Promise<Object>} Statistics object with counts
 */
todoSchema.statics.getStats = async function() {
  try {
    const total = await this.countDocuments();
    const completed = await this.countDocuments({ completed: true });
    const pending = total - completed;
    
    return {
      total,
      completed,
      pending
    };
  } catch (error) {
    throw new Error('Failed to get todo statistics');
  }
};

/**
 * Static method to get todos with pagination
 * @param {Object} options - Pagination options
 * @param {number} options.page - Page number (default: 1)
 * @param {number} options.limit - Items per page (default: 10)
 * @param {string} options.sortBy - Sort field (default: 'createdAt')
 * @param {string} options.sortOrder - Sort order 'asc' or 'desc' (default: 'desc')
 * @returns {Promise<Object>} Paginated todos and metadata
 */
todoSchema.statics.getPaginatedTodos = async function(options = {}) {
  const {
    page = 1,
    limit = 10,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = options;
  
  const skip = (page - 1) * limit;
  const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };
  
  try {
    const todos = await this.find()
      .sort(sort)
      .skip(skip)
      .limit(limit);
    
    const total = await this.countDocuments();
    const totalPages = Math.ceil(total / limit);
    
    return {
      todos,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    };
  } catch (error) {
    throw new Error('Failed to get paginated todos');
  }
};

// Create and export the Todo model with custom collection name from config
const Todo = mongoose.model('Todo', todoSchema, config.database.collectionName);

export default Todo;
