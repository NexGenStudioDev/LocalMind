import React, { useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';
import TypingIndicator from './TypingIndicator';

export default function ChatList({ messages = [], isTyping = false }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    // Smoothly scroll to bottom
    container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <main ref={containerRef} className="flex-1 overflow-y-auto px-4 py-6 space-y-4 scroll-smooth">
      <div className="flex flex-col gap-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400">
            <p>No messages yet.</p>
            <p>Start a conversation with your friends.</p>
          </div>
        ) : (
          messages.map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))
        )}
        {isTyping && (
          <div className="flex justify-start">
            <TypingIndicator />
          </div>
        )}
      </div>
    </main>
  );
}