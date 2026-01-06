import React from 'react'
import Breadcrumb from '../../../../../shared/component/v1/Breadcrumb'

const SettingsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#1E1E1E] text-white pt-20 px-6">
      <div className="max-w-6xl mx-auto">
        <Breadcrumb />
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Model Configuration</h1>
          <p className="text-gray-400">Configure AI models and API settings</p>
        </header>
        
        <div className="space-y-6">
          <div className="bg-zinc-900/50 rounded-lg p-6 border border-zinc-700">
            <h3 className="text-xl font-semibold mb-4">Local Models (Ollama)</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-zinc-800 rounded-lg">
                <div>
                  <h4 className="font-medium">LLaMA 2</h4>
                  <p className="text-sm text-gray-400">7B parameter model</p>
                </div>
                <span className="px-3 py-1 bg-green-600 text-xs rounded-full">Available</span>
              </div>
            </div>
          </div>
          
          <div className="bg-zinc-900/50 rounded-lg p-6 border border-zinc-700">
            <h3 className="text-xl font-semibold mb-4">Cloud Models</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-zinc-800 rounded-lg">
                <div>
                  <h4 className="font-medium">Google Gemini</h4>
                  <p className="text-sm text-gray-400">Configure API key</p>
                </div>
                <button className="px-4 py-2 bg-blue-600 text-sm rounded-lg hover:bg-blue-700">
                  Configure
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage