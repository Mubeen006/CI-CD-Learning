/**
 * Todo List Component
 * Displays all todos with beautiful styling and animations
 */

import React from 'react';
import TodoItem from './TodoItem';
import { Loader2, CheckCircle, Circle, Trash2 } from 'lucide-react';

const TodoList = ({ 
  todos, 
  loading, 
  onUpdate, 
  onDelete, 
  onToggleComplete, 
  onDeleteCompleted 
}) => {
  // Filter todos based on completion status
  const completedTodos = todos.filter(todo => todo.completed);
  const pendingTodos = todos.filter(todo => !todo.completed);

  /**
   * Handle delete all completed todos
   */
  const handleDeleteCompleted = () => {
    if (completedTodos.length > 0) {
      if (window.confirm(`Are you sure you want to delete ${completedTodos.length} completed todo(s)?`)) {
        onDeleteCompleted();
      }
    }
  };

  if (loading && todos.length === 0) {
    return (
      <div className="w-full max-w-4xl px-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
            <p className="text-gray-600 text-lg">Loading your todos...</p>
          </div>
        </div>
      </div>
    );
  }

  if (todos.length === 0) {
    return (
      <div className="w-full max-w-4xl px-6">
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-blue-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-700 mb-2">No todos yet!</h3>
          <p className="text-gray-500 text-lg">Add your first todo above to get started.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl space-y-8 px-6">
      {/* Pending todos section */}
      {pendingTodos.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center space-x-3 mb-6">
            <Circle className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl font-bold text-gray-700">
              Pending Tasks ({pendingTodos.length})
            </h2>
          </div>
          
          <div className="space-y-6">
            {pendingTodos.map((todo, index) => (
              <div
                key={todo.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <TodoItem
                  todo={todo}
                  onUpdate={onUpdate}
                  onDelete={onDelete}
                  onToggleComplete={onToggleComplete}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Completed todos section */}
      {completedTodos.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-6 h-6 text-green-500" />
              <h2 className="text-xl font-bold text-gray-700">
                Completed Tasks ({completedTodos.length})
              </h2>
            </div>
            
            {completedTodos.length > 0 && (
              <button
                onClick={handleDeleteCompleted}
                className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                title="Delete all completed todos"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear Completed</span>
              </button>
            )}
          </div>
          
          <div className="space-y-6">
            {completedTodos.map((todo, index) => (
              <div
                key={todo.id}
                className="animate-fade-in"
                style={{ animationDelay: `${(pendingTodos.length + index) * 0.1}s` }}
              >
                <TodoItem
                  todo={todo}
                  onUpdate={onUpdate}
                  onDelete={onDelete}
                  onToggleComplete={onToggleComplete}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Loading overlay for individual operations */}
      {loading && todos.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 shadow-xl">
            <div className="flex items-center space-x-3">
              <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
              <span className="text-gray-700 font-medium">Processing...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoList;
