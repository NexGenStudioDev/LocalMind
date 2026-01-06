import React from 'react'
import Breadcrumb from '../../../../../shared/component/v1/Breadcrumb'

const APIPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#1E1E1E] text-white pt-20 px-6">
      <div className="max-w-6xl mx-auto">
        <Breadcrumb />
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">API Information</h1>
          <p className="text-gray-400">Manage API keys and view documentation</p>
        </header>
        
        <div className="space-y-6">
          <div className="bg-zinc-900/50 rounded-lg p-6 border border-zinc-700">
            <h3 className="text-xl font-semibold mb-4">API Keys</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-zinc-800 rounded-lg">
                <div>
                  <h4 className="font-medium">Production Key</h4>
                  <p className="text-sm text-gray-400 font-mono">lm_****************************</p>
                </div>
                <button className="px-4 py-2 bg-red-600 text-sm rounded-lg hover:bg-red-700">
                  Revoke
                </button>
              </div>
            </div>
            <button className="mt-4 px-4 py-2 bg-blue-600 text-sm rounded-lg hover:bg-blue-700">
              Generate New Key
            </button>
          </div>
          
          <div className="bg-zinc-900/50 rounded-lg p-6 border border-zinc-700">
            <h3 className="text-xl font-semibold mb-4">API Endpoints</h3>
            <div className="space-y-3">
              <div className="p-3 bg-zinc-800 rounded font-mono text-sm">
                <span className="text-green-400">POST</span> /api/v1/chat/send-message
              </div>
              <div className="p-3 bg-zinc-800 rounded font-mono text-sm">
                <span className="text-blue-400">GET</span> /api/v1/upload/files
              </div>
              <div className="p-3 bg-zinc-800 rounded font-mono text-sm">
                <span className="text-yellow-400">PUT</span> /api/v1/user/ai-config
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default APIPage