/**
 * Todo Statistics Component
 * Displays statistics about todos with beautiful styling
 */

import React from 'react';
import { CheckCircle, Circle, BarChart3, Wifi, WifiOff } from 'lucide-react';

const TodoStats = ({ stats, isOnline }) => {
  const { total, completed, pending } = stats;
  
  // Calculate completion percentage
  const completionPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="w-full max-w-4xl px-6">
      {/* Main stats container */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 shadow-lg border border-blue-100">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">Todo Statistics</h3>
          </div>
          
          {/* Online/Offline indicator */}
          <div className={`
            flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium
            ${isOnline 
              ? 'bg-green-100 text-green-700' 
              : 'bg-orange-100 text-orange-700'
            }
          `}>
            {isOnline ? (
              <Wifi className="w-4 h-4" />
            ) : (
              <WifiOff className="w-4 h-4" />
            )}
            <span>{isOnline ? 'Online' : 'Offline'}</span>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Total todos */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-gray-700">Total</h4>
            </div>
            <p className="text-3xl font-bold text-blue-600 mb-2">{total}</p>
            <p className="text-sm text-gray-500">All todos</p>
          </div>

          {/* Completed todos */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-gray-700">Completed</h4>
            </div>
            <p className="text-3xl font-bold text-green-600 mb-2">{completed}</p>
            <p className="text-sm text-gray-500">Finished tasks</p>
          </div>

          {/* Pending todos */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <Circle className="w-5 h-5 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-gray-700">Pending</h4>
            </div>
            <p className="text-3xl font-bold text-orange-600 mb-2">{pending}</p>
            <p className="text-sm text-gray-500">Remaining tasks</p>
          </div>
        </div>

        {/* Progress bar */}
        {total > 0 && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Progress</span>
              <span className="text-sm font-bold text-blue-600">{completionPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Motivational message */}
        {total > 0 && (
          <div className="mt-8 text-center">
            {completionPercentage === 100 ? (
              <p className="text-green-600 font-semibold text-lg">
                🎉 Congratulations! All tasks completed!
              </p>
            ) : completionPercentage >= 75 ? (
              <p className="text-blue-600 font-semibold">
                🔥 Great progress! You're almost there!
              </p>
            ) : completionPercentage >= 50 ? (
              <p className="text-purple-600 font-semibold">
                💪 Keep going! You're doing great!
              </p>
            ) : completionPercentage >= 25 ? (
              <p className="text-orange-600 font-semibold">
                🚀 Good start! Keep the momentum going!
              </p>
            ) : (
              <p className="text-gray-600 font-semibold">
                🌟 Every journey begins with a single step!
              </p>
            )}
          </div>
        )}

        {/* Offline mode notice */}
        {!isOnline && (
          <div className="mt-6 p-4 bg-orange-100 border border-orange-200 rounded-xl">
            <div className="flex items-center space-x-2">
              <WifiOff className="w-5 h-5 text-orange-600" />
              <p className="text-orange-700 font-medium">
                You're currently offline. Changes will sync when you're back online.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TodoStats;
