/**
 * Todo Input Component
 * Input field with gradient border animation and add button
 */

import React, { useState } from 'react';
import { Plus, Loader2 } from 'lucide-react';

const TodoInput = ({ onAddTodo, loading }) => {
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  /**
   * Handle form submission
   * @param {Event} e - Form submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (inputValue.trim() && !loading) {
      await onAddTodo(inputValue.trim());
      setInputValue('');
    }
  };

  /**
   * Handle input change
   * @param {Event} e - Input change event
   */
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  return (
    <div className="w-full max-w-2xl relative">
      <form onSubmit={handleSubmit} className="relative">
        {/* Input container with gradient border animation */}
        <div className={`
          relative p-1 rounded-2xl transition-all duration-300
          ${isFocused 
            ? 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-gradient-border' 
            : 'bg-gradient-to-r from-gray-200 to-gray-300'
          }
        `}>
          {/* Inner input container */}
          <div className="bg-white rounded-xl p-6 flex items-center space-x-4 shadow-lg">
            {/* Input field */}
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="What needs to be done?"
              className="flex-1 text-lg font-medium text-gray-700 placeholder-gray-400 focus:outline-none bg-transparent"
              disabled={loading}
              maxLength={500}
            />
            
            {/* Add button */}
            <button
              type="submit"
              disabled={!inputValue.trim() || loading}
              className={`
                flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95
                ${inputValue.trim() && !loading
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:shadow-xl'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }
              `}
            >
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <Plus className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
        
        {/* Character count */}
        {inputValue.length > 0 && (
          <div className="text-right mt-2 text-sm text-gray-500">
            {inputValue.length}/500
          </div>
        )}
      </form>
      
      {/* Floating animation elements - properly positioned */}
      <div className="absolute top-2 left-2 w-4 h-4 bg-blue-400 rounded-full opacity-60 animate-ping pointer-events-none"></div>
      <div className="absolute bottom-2 right-2 w-3 h-3 bg-purple-400 rounded-full opacity-60 animate-ping pointer-events-none" style={{ animationDelay: '0.5s' }}></div>
    </div>
  );
};

export default TodoInput;
