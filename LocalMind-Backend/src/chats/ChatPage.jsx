import React, { useState } from 'react';
import ChatHeader from './ChatHeader';
import ChatList from './ChatList';
import ChatInput from './ChatInput';

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { id: 1, from: 'other', text: 'Hey — welcome to LocalMind!', time: '10:03 AM' },
    { id: 2, from: 'me', text: 'Thanks! I am ready to build the chat page.', time: '10:05 AM' },
    { id: 3, from: 'other', text: 'Great — check the design and mirror spacing precisely.', time: '10:07 AM' },
  ]);

  const [isTyping, setIsTyping] = useState(false);

  function sendMessage(text) {
    if (!text || !text.trim()) return;
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsg = { id: Date.now(), from: 'me', text: text.trim(), time };
    setMessages((m) => [...m, newMsg]);
    setIsTyping(false);
  }

  // optional: simulate other user typing (for demo)
  function simulateTyping() {
    setIsTyping(true);
    setTimeout(() => {
      const now = new Date();
      const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setMessages((m) => [...m, { id: Date.now(), from: 'other', text: 'Simulated reply from other.', time }]);
      setIsTyping(false);
    }, 1800);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-3xl h-[92vh] bg-white dark:bg-gray-800 rounded-2xl shadow-md flex flex-col overflow-hidden">
        <ChatHeader name="Alex Johnson" status="online" />
        <ChatList messages={messages} isTyping={isTyping} />
        <ChatInput onSend={(text) => { sendMessage(text); /* simulate other reply for demo */ simulateTyping(); }} />
      </div>
    </div>
  );
}
