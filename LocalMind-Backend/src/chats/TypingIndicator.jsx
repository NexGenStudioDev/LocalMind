import React from 'react';

export default function TypingIndicator() {
  return (
    <div className="bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg max-w-[22%]">
      <div className="flex items-center gap-1">
        <span className="w-2 h-2 rounded-full animate-pulse bg-gray-400 dark:bg-gray-300" />
        <span className="w-2 h-2 rounded-full animate-pulse bg-gray-400 dark:bg-gray-300 delay-150" />
        <span className="w-2 h-2 rounded-full animate-pulse bg-gray-400 dark:bg-gray-300 delay-300" />
      </div>
    </div>
  );
}
