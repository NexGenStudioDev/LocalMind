import React from 'react'
import Breadcrumb from '../../../../../shared/component/v1/Breadcrumb'

const DocumentsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#1E1E1E] text-white pt-20 px-6">
      <div className="max-w-6xl mx-auto">
        <Breadcrumb />
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Document Upload & RAG</h1>
          <p className="text-gray-400">Upload documents and train your AI with custom data</p>
        </header>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-zinc-900/50 rounded-lg p-6 border border-zinc-700">
            <h3 className="text-xl font-semibold mb-4">Upload Documents</h3>
            <div className="border-2 border-dashed border-zinc-600 rounded-lg p-8 text-center">
              <p className="text-gray-400 mb-4">Drag & drop files here or click to browse</p>
              <p className="text-sm text-gray-500">Supported: Excel, CSV, PDF, TXT</p>
            </div>
          </div>
          
          <div className="bg-zinc-900/50 rounded-lg p-6 border border-zinc-700">
            <h3 className="text-xl font-semibold mb-4">Uploaded Files</h3>
            <div className="text-center py-8">
              <p className="text-gray-400">No files uploaded yet</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DocumentsPage