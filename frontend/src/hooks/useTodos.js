/**
 * Custom Hook for Todo Management
 * Provides centralized state management for todos
 * Handles both API calls and localStorage fallback
 */

import { useState, useEffect, useCallback } from 'react';
import { todoAPI } from '../services/api';
import {
  getTodosFromStorage,
  saveTodosToStorage,
  getStatsFromStorage,
  saveStatsToStorage,
  calculateStats,
  addTodoToStorage,
  updateTodoInStorage,
  deleteTodoFromStorage,
  syncTodosWithStorage
} from '../services/localStorage';

/**
 * Custom hook for managing todos
 * @returns {Object} Todo management functions and state
 */
export const useTodos = () => {
  // State management
  const [todos, setTodos] = useState([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  /**
   * Handle online/offline status changes
   */
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  /**
   * Load todos from API or localStorage
   */
  const loadTodos = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      if (isOnline) {
        // Try to fetch from API
        const response = await todoAPI.getAllTodos();
        const todosData = response.data || [];
        const statsData = response.pagination ? calculateStats(todosData) : await getStatsFromAPI();
        
        // Convert MongoDB _id to id for consistency
        const todosWithId = todosData.map(todo => ({
          ...todo,
          id: todo._id || todo.id
        }));
        
        // Ensure all todos have valid IDs
        const validTodos = todosWithId.filter(todo => todo.id && todo.id !== 'undefined');
        setTodos(validTodos);
        setStats(calculateStats(validTodos));
        
        // Sync with localStorage
        syncTodosWithStorage(todosData);
      } else {
        // Use localStorage when offline
        const todosData = getTodosFromStorage();
        const statsData = getStatsFromStorage();
        
        // Convert MongoDB _id to id for consistency
        const todosWithId = todosData.map(todo => ({
          ...todo,
          id: todo._id || todo.id
        }));
        
        // Ensure all todos have valid IDs
        const validTodos = todosWithId.filter(todo => todo.id && todo.id !== 'undefined');
        setTodos(validTodos);
        setStats(calculateStats(validTodos));
      }
    } catch (error) {
      console.error('Error loading todos:', error);
      
      // Fallback to localStorage
      const todosData = getTodosFromStorage();
      const statsData = getStatsFromStorage();
      
      // Convert MongoDB _id to id for consistency
      const todosWithId = todosData.map(todo => ({
        ...todo,
        id: todo._id || todo.id
      }));
      
      // Ensure all todos have valid IDs
      const validTodos = todosWithId.filter(todo => todo.id && todo.id !== 'undefined');
      setTodos(validTodos);
      setStats(calculateStats(validTodos));
      setError('Using offline data. Some features may be limited.');
    } finally {
      setLoading(false);
    }
  }, [isOnline]);

  /**
   * Get stats from API
   */
  const getStatsFromAPI = async () => {
    try {
      const response = await todoAPI.getTodoStats();
      return response.data;
    } catch (error) {
      console.error('Error fetching stats:', error);
      return calculateStats(todos);
    }
  };

  /**
   * Add a new todo
   * @param {string} text - Todo text
   */
  const addTodo = useCallback(async (text) => {
    if (!text.trim()) {
      setError('Todo text cannot be empty');
      return;
    }

    setError(null);

    try {
      if (isOnline) {
        // Try API first
        const response = await todoAPI.createTodo({ text: text.trim() });
        
        // Extract the todo object from the response
        const newTodo = response.data;
        
        // Convert MongoDB _id to id for consistency
        if (newTodo._id && !newTodo.id) {
          newTodo.id = newTodo._id;
        }
        
        // Ensure the new todo has a valid ID
        if (!newTodo.id) {
          console.error('API returned todo without ID:', newTodo);
          console.error('Full response object:', response);
          throw new Error('Invalid todo response from server');
        }
        
        setTodos(prev => {
          const updated = [...prev, newTodo];
          const newStats = calculateStats(updated);
          setStats(newStats);
          return updated;
        });
        
        // Update localStorage
        addTodoToStorage(newTodo);
      } else {
        // Use localStorage when offline
        const newTodo = addTodoToStorage({
          text: text.trim(),
          completed: false
        });
        
        // Convert MongoDB _id to id for consistency (if it exists)
        if (newTodo._id && !newTodo.id) {
          newTodo.id = newTodo._id;
        }
        
        // Ensure the new todo has a valid ID
        if (!newTodo.id) {
          console.error('addTodoToStorage returned todo without ID:', newTodo);
          throw new Error('Failed to create todo with valid ID');
        }
        
        setTodos(prev => {
          const updated = [...prev, newTodo];
          const newStats = calculateStats(updated);
          setStats(newStats);
          return updated;
        });
      }
    } catch (error) {
      console.error('Error adding todo:', error);
      setError('Failed to add todo. Please try again.');
    }
  }, [isOnline]);

  /**
   * Update a todo
   * @param {string} id - Todo ID
   * @param {Object} updateData - Update data
   */
  const updateTodo = useCallback(async (id, updateData) => {
    setError(null);

    try {
      if (isOnline) {
        // Try API first
        const response = await todoAPI.updateTodo(id, updateData);
        const updatedTodo = response.data;
        
        // Convert MongoDB _id to id for consistency
        if (updatedTodo._id && !updatedTodo.id) {
          updatedTodo.id = updatedTodo._id;
        }
        
        setTodos(prev => {
          const updated = prev.map(todo => 
            todo.id === id ? updatedTodo : todo
          );
          const newStats = calculateStats(updated);
          setStats(newStats);
          return updated;
        });
        
        // Update localStorage (if todo exists in localStorage)
        try {
          updateTodoInStorage(id, updateData);
        } catch (error) {
          // If todo doesn't exist in localStorage, add it
          console.log('Todo not found in localStorage, adding it:', updatedTodo);
          addTodoToStorage(updatedTodo);
        }
      } else {
        // Use localStorage when offline
        const updatedTodo = updateTodoInStorage(id, updateData);
        
        setTodos(prev => {
          const updated = prev.map(todo => 
            todo.id === id ? updatedTodo : todo
          );
          const newStats = calculateStats(updated);
          setStats(newStats);
          return updated;
        });
      }
    } catch (error) {
      console.error('Error updating todo:', error);
      setError('Failed to update todo. Please try again.');
    }
  }, [isOnline]);

  /**
   * Toggle todo completion status
   * @param {string} id - Todo ID
   */
  const toggleTodoComplete = useCallback(async (id) => {
    setError(null);

    try {
      if (isOnline) {
        // Try API first
        const response = await todoAPI.toggleTodoComplete(id);
        const updatedTodo = response.data;
        
        // Convert MongoDB _id to id for consistency
        if (updatedTodo._id && !updatedTodo.id) {
          updatedTodo.id = updatedTodo._id;
        }
        
        setTodos(prev => {
          const updated = prev.map(todo => 
            todo.id === id ? updatedTodo : todo
          );
          const newStats = calculateStats(updated);
          setStats(newStats);
          return updated;
        });
        
        // Update localStorage (if todo exists in localStorage)
        const todo = todos.find(t => t.id === id);
        if (todo) {
          try {
            updateTodoInStorage(id, { completed: !todo.completed });
          } catch (error) {
            // If todo doesn't exist in localStorage, add it
            console.log('Todo not found in localStorage, adding it:', todo);
            addTodoToStorage(updatedTodo);
          }
        }
      } else {
        // Use localStorage when offline
        const todo = todos.find(t => t.id === id);
        if (todo) {
          const updatedTodo = updateTodoInStorage(id, { completed: !todo.completed });
          
          setTodos(prev => {
            const updated = prev.map(t => 
              t.id === id ? updatedTodo : t
            );
            const newStats = calculateStats(updated);
            setStats(newStats);
            return updated;
          });
        }
      }
    } catch (error) {
      console.error('Error toggling todo:', error);
      setError('Failed to toggle todo. Please try again.');
    }
  }, [isOnline, todos]);

  /**
   * Delete a todo
   * @param {string} id - Todo ID
   */
  const deleteTodo = useCallback(async (id) => {
    setError(null);

    try {
      if (isOnline) {
        // Try API first
        await todoAPI.deleteTodo(id);
        
        setTodos(prev => {
          const updated = prev.filter(todo => todo.id !== id);
          const newStats = calculateStats(updated);
          setStats(newStats);
          return updated;
        });
        
        // Update localStorage (if todo exists in localStorage)
        try {
          deleteTodoFromStorage(id);
        } catch (error) {
          // If todo doesn't exist in localStorage, that's okay
          console.log('Todo not found in localStorage for deletion, continuing...');
        }
      } else {
        // Use localStorage when offline
        deleteTodoFromStorage(id);
        
        setTodos(prev => {
          const updated = prev.filter(todo => todo.id !== id);
          const newStats = calculateStats(updated);
          setStats(newStats);
          return updated;
        });
      }
    } catch (error) {
      console.error('Error deleting todo:', error);
      setError('Failed to delete todo. Please try again.');
    }
  }, [isOnline]);

  /**
   * Delete all completed todos
   */
  const deleteCompletedTodos = useCallback(async () => {
    setError(null);

    try {
      if (isOnline) {
        // Try API first
        const response = await todoAPI.deleteCompletedTodos();
        console.log('Delete completed todos response:', response);
        
        setTodos(prev => {
          const updated = prev.filter(todo => !todo.completed);
          const newStats = calculateStats(updated);
          setStats(newStats);
          return updated;
        });
        
        // Update localStorage
        const remainingTodos = todos.filter(todo => !todo.completed);
        saveTodosToStorage(remainingTodos);
        const newStats = calculateStats(remainingTodos);
        saveStatsToStorage(newStats);
      } else {
        // Use localStorage when offline
        const remainingTodos = todos.filter(todo => !todo.completed);
        saveTodosToStorage(remainingTodos);
        const newStats = calculateStats(remainingTodos);
        saveStatsToStorage(newStats);
        
        setTodos(remainingTodos);
        setStats(newStats);
      }
    } catch (error) {
      console.error('Error deleting completed todos:', error);
      setError('Failed to delete completed todos. Please try again.');
    }
  }, [isOnline, todos]);

  /**
   * Clear error message
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Load todos on mount and when online status changes
  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  return {
    // State
    todos,
    stats,
    loading,
    error,
    isOnline,
    
    // Actions
    addTodo,
    updateTodo,
    toggleTodoComplete,
    deleteTodo,
    deleteCompletedTodos,
    loadTodos,
    clearError
  };
};
