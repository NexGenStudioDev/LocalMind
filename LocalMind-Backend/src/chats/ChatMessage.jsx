import React from 'react';
import clsx from 'clsx';

export default function ChatMessage({ message }) {
  const isMe = message.from === 'me';

  return (
    <div className={clsx('flex items-end', isMe ? 'justify-end' : 'justify-start')}>
      <div className={clsx(
        'inline-block px-4 py-2 rounded-lg break-words max-w-[72%] shadow-sm',
        isMe ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-none'
      )}>
        <div className="text-sm leading-6">{message.text}</div>
        <div className={clsx('text-[10px] mt-1', isMe ? 'text-gray-100/80' : 'text-gray-500')}>{message.time}</div>
      </div>
    </div>
  );
}
