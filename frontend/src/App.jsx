/**
 * Main App Component
 * Beautiful Todo Application with gradient styling and animations
 * Implements offline-first approach with localStorage fallback
 */

import React from 'react';
import { useTodos } from './hooks/useTodos';
import TodoHeader from './components/TodoHeader';
import TodoInput from './components/TodoInput';
import TodoList from './components/TodoList';
import TodoStats from './components/TodoStats';
import ErrorAlert from './components/ErrorAlert';

const App = () => {
  // Custom hook for todo management
  const {
    todos,
    stats,
    loading,
    error,
    isOnline,
    addTodo,
    updateTodo,
    toggleTodoComplete,
    deleteTodo,
    deleteCompletedTodos,
    clearError
  } = useTodos();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative">
      {/* Background decorative elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full opacity-10 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Main container */}
      <div className="relative z-10 min-h-screen flex flex-col">
        <div className="flex-1 container mx-auto px-6 py-12 max-w-6xl">
          {/* Header */}
          <div className="text-center mb-12">
            <TodoHeader />
          </div>
          
          {/* Input section */}
          <div className="flex justify-center mb-12">
            <TodoInput 
              onAddTodo={addTodo}
              loading={loading}
            />
          </div>
          
          {/* Todo list */}
          <div className="flex justify-center mb-12">
            <TodoList
              todos={todos}
              loading={loading}
              onUpdate={updateTodo}
              onDelete={deleteTodo}
              onToggleComplete={toggleTodoComplete}
              onDeleteCompleted={deleteCompletedTodos}
            />
          </div>
          
          {/* Statistics */}
          <div className="flex justify-center">
            <TodoStats
              stats={stats}
              isOnline={isOnline}
            />
          </div>
        </div>
      </div>
      
      {/* Error alert */}
      <ErrorAlert
        error={error}
        onClose={clearError}
      />
    </div>
  );
};

export default App;
