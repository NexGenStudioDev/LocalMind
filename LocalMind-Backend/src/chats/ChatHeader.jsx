import React from 'react';
import { FiArrowLeft, FiPhone, FiVideo, FiMoreVertical } from 'react-icons/fi';

export default function ChatHeader({ name = 'User', status = 'online' }) {
  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-3">
        <button className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition" aria-label="Back">
          <FiArrowLeft className="w-5 h-5 text-gray-700 dark:text-gray-200" />
        </button>
        <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=2563EB&color=fff`} alt={`${name} avatar`}
             className="w-10 h-10 rounded-full object-cover" />
        <div>
          <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">{name}</div>
          <div className="text-xs text-green-500 dark:text-green-400">{status === 'online' ? 'Online' : status}</div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition" aria-label="Voice call">
          <FiPhone className="w-5 h-5 text-gray-700 dark:text-gray-200" />
        </button>
        <button className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition" aria-label="Video call">
          <FiVideo className="w-5 h-5 text-gray-700 dark:text-gray-200" />
        </button>
        <button className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition" aria-label="More">
          <FiMoreVertical className="w-5 h-5 text-gray-700 dark:text-gray-200" />
        </button>
      </div>
    </header>
  );
}
