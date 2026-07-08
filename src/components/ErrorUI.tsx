/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AlertCircle, RotateCcw, X } from 'lucide-react';

interface ErrorUIProps {
  message: string;
  onRetry?: () => void;
  onDismiss?: () => void;
}

export const ErrorUI = ({ message, onRetry, onDismiss }: ErrorUIProps) => {
  return (
    <div className="mx-4 md:mx-12 my-6 p-4 rounded-lg bg-red-950/20 border border-red-900/40 text-red-200 flex items-start justify-between backdrop-blur-md animate-fade-in relative z-50">
      <div className="flex space-x-3">
        <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-medium text-sm text-red-300">Backend Connection Notice</p>
          <p className="text-xs text-red-200/80 leading-relaxed max-w-2xl">{message}</p>
          
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-2 flex items-center space-x-1.5 text-xs text-red-400 hover:text-red-300 font-semibold transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry Request</span>
            </button>
          )}
        </div>
      </div>
      
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="p-1 hover:bg-red-950/40 rounded-full text-red-400 hover:text-red-300 transition shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
