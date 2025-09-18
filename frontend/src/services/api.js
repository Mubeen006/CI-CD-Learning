/**
 * API Service
 * Handles all HTTP requests to the backend API
 * Provides centralized API communication with error handling
 */

import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor for logging and authentication
 */
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

/**
 * Response interceptor for error handling
 */
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ API Response Error:', error.response?.data || error.message);
    
    // Handle different error types
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      const message = data?.message || 'An error occurred';
      
      switch (status) {
        case 400:
          throw new Error(`Bad Request: ${message}`);
        case 404:
          throw new Error(`Not Found: ${message}`);
        case 500:
          throw new Error(`Server Error: ${message}`);
        default:
          throw new Error(`Error ${status}: ${message}`);
      }
    } else if (error.request) {
      // Network error
      throw new Error('Network Error: Unable to connect to server');
    } else {
      // Other error
      throw new Error(`Request Error: ${error.message}`);
    }
  }
);

/**
 * Todo API Service
 * Contains all methods for todo operations
 */
export const todoAPI = {
  /**
   * Get all todos with optional pagination
   * @param {Object} params - Query parameters
   * @returns {Promise<Array>} Array of todos
   */
  getAllTodos: async (params = {}) => {
    try {
      const response = await api.get('/todos', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching todos:', error);
      throw error;
    }
  },

  /**
   * Get a single todo by ID
   * @param {string} id - Todo ID
   * @returns {Promise<Object>} Todo object
   */
  getTodoById: async (id) => {
    try {
      const response = await api.get(`/todos/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching todo:', error);
      throw error;
    }
  },

  /**
   * Create a new todo
   * @param {Object} todoData - Todo data
   * @param {string} todoData.text - Todo text
   * @returns {Promise<Object>} Created todo
   */
  createTodo: async (todoData) => {
    try {
      console.log('Creating todo with data:', todoData);
      const response = await api.post('/todos', todoData);
      console.log('Create todo response:', response);
      console.log('Response data:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating todo:', error);
      throw error;
    }
  },

  /**
   * Update a todo
   * @param {string} id - Todo ID
   * @param {Object} updateData - Update data
   * @returns {Promise<Object>} Updated todo
   */
  updateTodo: async (id, updateData) => {
    try {
      const response = await api.put(`/todos/${id}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Error updating todo:', error);
      throw error;
    }
  },

  /**
   * Toggle todo completion status
   * @param {string} id - Todo ID
   * @returns {Promise<Object>} Updated todo
   */
  toggleTodoComplete: async (id) => {
    try {
      const response = await api.patch(`/todos/${id}/toggle`);
      return response.data;
    } catch (error) {
      console.error('Error toggling todo:', error);
      throw error;
    }
  },

  /**
   * Delete a todo
   * @param {string} id - Todo ID
   * @returns {Promise<Object>} Deletion result
   */
  deleteTodo: async (id) => {
    try {
      const response = await api.delete(`/todos/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting todo:', error);
      throw error;
    }
  },

  /**
   * Get todo statistics
   * @returns {Promise<Object>} Statistics object
   */
  getTodoStats: async () => {
    try {
      const response = await api.get('/todos/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching stats:', error);
      throw error;
    }
  },

  /**
   * Delete all completed todos
   * @returns {Promise<Object>} Deletion result
   */
  deleteCompletedTodos: async () => {
    try {
      const response = await api.delete('/todos/completed');
      return response.data;
    } catch (error) {
      console.error('Error deleting completed todos:', error);
      throw error;
    }
  },
};

export default api;
