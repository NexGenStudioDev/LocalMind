import React from 'react'
import Breadcrumb from '../../../../../shared/component/v1/Breadcrumb'

const ChatPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#1E1E1E] text-white pt-20 px-6">
      <div className="max-w-6xl mx-auto">
        <Breadcrumb />
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Chat Interface</h1>
          <p className="text-gray-400">Interact with AI models in real-time</p>
        </header>
        
        <div className="bg-zinc-900/50 rounded-lg p-6 border border-zinc-700">
          <div className="text-center py-20">
            <h3 className="text-xl mb-4">Chat Interface Coming Soon</h3>
            <p className="text-gray-400">Real-time AI chat system will be available here</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatPage