/**
 * Todo Item Component
 * Individual todo item with edit, delete, and completion functionality
 */

import React, { useState } from 'react';
import { Check, Edit2, Trash2, Save, X } from 'lucide-react';

const TodoItem = ({ todo, onUpdate, onDelete, onToggleComplete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Handle edit mode toggle
   */
  const handleEditToggle = () => {
    if (isEditing) {
      setEditText(todo.text); // Reset to original text
    }
    setIsEditing(!isEditing);
  };

  /**
   * Handle save edit
   */
  const handleSaveEdit = async () => {
    if (editText.trim() && editText.trim() !== todo.text) {
      // Safety check for todo ID
      if (!todo.id) {
        console.error('Todo ID is undefined:', todo);
        return;
      }
      
      setIsLoading(true);
      try {
        await onUpdate(todo.id, { text: editText.trim() });
        setIsEditing(false);
      } catch (error) {
        console.error('Error updating todo:', error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsEditing(false);
    }
  };

  /**
   * Handle cancel edit
   */
  const handleCancelEdit = () => {
    setEditText(todo.text);
    setIsEditing(false);
  };

  /**
   * Handle key press in edit mode
   * @param {Event} e - Keyboard event
   */
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  /**
   * Handle delete with confirmation
   */
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      // Safety check for todo ID
      if (!todo.id) {
        console.error('Todo ID is undefined:', todo);
        return;
      }
      
      setIsLoading(true);
      try {
        await onDelete(todo.id);
      } catch (error) {
        console.error('Error deleting todo:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  /**
   * Handle toggle completion
   */
  const handleToggleComplete = async () => {
    // Safety check for todo ID
    if (!todo.id) {
      console.error('Todo ID is undefined:', todo);
      return;
    }
    
    setIsLoading(true);
    try {
      await onToggleComplete(todo.id);
    } catch (error) {
      console.error('Error toggling todo:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`
      group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1
      ${todo.completed ? 'opacity-75 bg-gradient-to-r from-green-50 to-blue-50' : 'bg-gradient-to-r from-white to-gray-50'}
      ${isLoading ? 'pointer-events-none opacity-50' : ''}
    `}>
      {/* Main content area with proper alignment */}
      <div className="todo-item">
        {/* Left side: Toggle button and content */}
        <div className="todo-left-section">
          {/* Completion checkmark */}
          <button
            onClick={handleToggleComplete}
            disabled={isLoading}
            className={`
              todo-toggle transition-all duration-300 transform hover:scale-110
              ${todo.completed
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
                : 'bg-white border-2 border-gray-300 text-gray-400 hover:border-blue-500 hover:text-blue-500'
              }
            `}
          >
            {todo.completed && <Check className="w-5 h-5" />}
          </button>

          {/* Todo content */}
          <div className="todo-text-content">
        {isEditing ? (
          // Edit mode
          <div className="space-y-4">
            <input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={handleKeyPress}
              className="w-full p-3 border-2 border-blue-300 rounded-xl focus:outline-none focus:border-blue-500 text-lg font-medium"
              autoFocus
              maxLength={500}
            />
            <div className="flex space-x-2">
              <button
                onClick={handleSaveEdit}
                disabled={isLoading || !editText.trim()}
                className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>Save</span>
              </button>
              <button
                onClick={handleCancelEdit}
                disabled={isLoading}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </button>
            </div>
          </div>
        ) : (
          // Display mode
          <div className="space-y-3">
            <p className={`
              text-lg font-medium leading-relaxed todo-text
              ${todo.completed ? 'line-through text-gray-500' : 'text-gray-800'}
            `}>
              {todo.text}
            </p>
            
            {/* Timestamp */}
            <p className="todo-timestamp">
              {new Date(todo.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        )}
          </div>
        </div>

        {/* Right side: Action buttons */}
        {!isEditing && (
          <div className="todo-right-section opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={handleEditToggle}
              disabled={isLoading}
              className="todo-action-button text-gray-400 hover:text-blue-500 hover:bg-blue-50"
              title="Edit todo"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleDelete}
              disabled={isLoading}
              className="todo-action-button text-gray-400 hover:text-red-500 hover:bg-red-50"
              title="Delete todo"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 rounded-2xl flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Decorative gradient border */}
      <div className={`
        absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none
        ${todo.completed 
          ? 'bg-gradient-to-r from-green-200 to-blue-200' 
          : 'bg-gradient-to-r from-blue-200 to-purple-200'
        }
      `} style={{ zIndex: -1 }}></div>
    </div>
  );
};

export default TodoItem;
