/**
 * Todo Header Component
 * Displays the main heading with beautiful blue gradient styling
 */

import React from 'react';

const TodoHeader = () => {
  return (
    <div className="text-center">
      {/* Main heading with blue gradient */}
      <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 bg-clip-text text-transparent animate-pulse">
        Todo
      </h1>
      
      {/* Subtitle with subtle styling */}
      <p className="text-gray-600 text-lg font-medium mb-6">
        Organize your tasks with style
      </p>
      
      {/* Decorative elements */}
      <div className="flex justify-center items-center space-x-2">
        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>
    </div>
  );
};

export default TodoHeader;
