/**
 * Error Alert Component
 * Displays error messages with beautiful styling
 */

import React from 'react';
import { AlertCircle, X } from 'lucide-react';

const ErrorAlert = ({ error, onClose }) => {
  if (!error) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 shadow-lg max-w-md">
        <div className="flex items-start space-x-3">
          {/* Error icon */}
          <div className="flex-shrink-0">
            <AlertCircle className="w-6 h-6 text-red-500" />
          </div>
          
          {/* Error message */}
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-red-800 mb-1">
              Error
            </h4>
            <p className="text-sm text-red-700">
              {error}
            </p>
          </div>
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="flex-shrink-0 p-1 text-red-400 hover:text-red-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorAlert;
