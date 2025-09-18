/**
 * Local Storage Service
 * Handles local storage operations for offline functionality
 * Provides fallback when API is unavailable
 */

const STORAGE_KEY = 'todoapp_todos';
const STATS_KEY = 'todoapp_stats';

/**
 * Get todos from local storage
 * @returns {Array} Array of todos
 */
export const getTodosFromStorage = () => {
  try {
    const todos = localStorage.getItem(STORAGE_KEY);
    return todos ? JSON.parse(todos) : [];
  } catch (error) {
    console.error('Error reading todos from localStorage:', error);
    return [];
  }
};

/**
 * Save todos to local storage
 * @param {Array} todos - Array of todos to save
 */
export const saveTodosToStorage = (todos) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    console.log('✅ Todos saved to localStorage');
  } catch (error) {
    console.error('Error saving todos to localStorage:', error);
  }
};

/**
 * Get statistics from local storage
 * @returns {Object} Statistics object
 */
export const getStatsFromStorage = () => {
  try {
    const stats = localStorage.getItem(STATS_KEY);
    return stats ? JSON.parse(stats) : { total: 0, completed: 0, pending: 0 };
  } catch (error) {
    console.error('Error reading stats from localStorage:', error);
    return { total: 0, completed: 0, pending: 0 };
  }
};

/**
 * Save statistics to local storage
 * @param {Object} stats - Statistics object to save
 */
export const saveStatsToStorage = (stats) => {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
    console.log('✅ Stats saved to localStorage');
  } catch (error) {
    console.error('Error saving stats to localStorage:', error);
  }
};

/**
 * Calculate statistics from todos array
 * @param {Array} todos - Array of todos
 * @returns {Object} Calculated statistics
 */
export const calculateStats = (todos) => {
  const total = todos.length;
  const completed = todos.filter(todo => todo.completed).length;
  const pending = total - completed;
  
  return { total, completed, pending };
};

/**
 * Add a todo to local storage
 * @param {Object} todo - Todo object to add
 */
export const addTodoToStorage = (todo) => {
  try {
    const todos = getTodosFromStorage();
    const newTodo = {
      ...todo,
      id: todo.id || `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: todo.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    todos.push(newTodo);
    saveTodosToStorage(todos);
    
    // Update stats
    const stats = calculateStats(todos);
    saveStatsToStorage(stats);
    
    return newTodo;
  } catch (error) {
    console.error('Error adding todo to localStorage:', error);
    throw error;
  }
};

/**
 * Update a todo in local storage
 * @param {string} id - Todo ID
 * @param {Object} updateData - Update data
 */
export const updateTodoInStorage = (id, updateData) => {
  try {
    const todos = getTodosFromStorage();
    // Try to find todo by id or _id
    const index = todos.findIndex(todo => 
      todo.id === id || todo._id === id
    );
    
    if (index !== -1) {
      todos[index] = {
        ...todos[index],
        ...updateData,
        id: todos[index].id || todos[index]._id, // Ensure id is set
        updatedAt: new Date().toISOString()
      };
      
      saveTodosToStorage(todos);
      
      // Update stats
      const stats = calculateStats(todos);
      saveStatsToStorage(stats);
      
      return todos[index];
    }
    
    throw new Error('Todo not found in localStorage');
  } catch (error) {
    console.error('Error updating todo in localStorage:', error);
    throw error;
  }
};

/**
 * Delete a todo from local storage
 * @param {string} id - Todo ID
 */
export const deleteTodoFromStorage = (id) => {
  try {
    const todos = getTodosFromStorage();
    // Try to find and delete todo by id or _id
    const filteredTodos = todos.filter(todo => 
      todo.id !== id && todo._id !== id
    );
    
    if (filteredTodos.length !== todos.length) {
      saveTodosToStorage(filteredTodos);
      
      // Update stats
      const stats = calculateStats(filteredTodos);
      saveStatsToStorage(stats);
      
      return true;
    }
    
    throw new Error('Todo not found in localStorage');
  } catch (error) {
    console.error('Error deleting todo from localStorage:', error);
    throw error;
  }
};

/**
 * Clear all todos from local storage
 */
export const clearTodosFromStorage = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STATS_KEY);
    console.log('✅ Todos cleared from localStorage');
  } catch (error) {
    console.error('Error clearing todos from localStorage:', error);
  }
};

/**
 * Sync todos with local storage (for offline-first approach)
 * @param {Array} todos - Array of todos from API
 */
export const syncTodosWithStorage = (todos) => {
  try {
    saveTodosToStorage(todos);
    const stats = calculateStats(todos);
    saveStatsToStorage(stats);
    console.log('✅ Todos synced with localStorage');
  } catch (error) {
    console.error('Error syncing todos with localStorage:', error);
  }
};
