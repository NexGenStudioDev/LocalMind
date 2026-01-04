import React, { useState } from 'react';
import { FiSmile, FiPaperclip, FiCamera, FiSend } from 'react-icons/fi';

export default function ChatInput({ onSend }) {
  const [text, setText] = useState('');

  function handleSend() {
    const t = text.trim();
    if (!t) return;
    onSend(t);
    setText('');
  }

  return (
    <footer className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <div className="flex items-center gap-3">
        <button className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition" aria-label="Emoji">
          <FiSmile className="w-5 h-5 text-gray-700 dark:text-gray-200" />
        </button>

        <div className="flex-1">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            placeholder="Type a message..."
            className="w-full px-4 py-2 rounded-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500"
            aria-label="Message input"
          />
        </div>

        <button className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition" aria-label="Attach">
          <FiPaperclip className="w-5 h-5 text-gray-700 dark:text-gray-200" />
        </button>

        <button className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition" aria-label="Camera">
          <FiCamera className="w-5 h-5 text-gray-700 dark:text-gray-200" />
        </button>

        <button
          onClick={handleSend}
          disabled={!text.trim()}
          aria-label="Send message"
          className={`p-2 rounded-full transition ${text.trim() ? 'bg-blue-600 text-white hover:scale-105' : 'bg-blue-600/40 text-white opacity-60 cursor-not-allowed'}`}
        >
          <FiSend className="w-5 h-5" />
        </button>
      </div>
    </footer>
  );
}
