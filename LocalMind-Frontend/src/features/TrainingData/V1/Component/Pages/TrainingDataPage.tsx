import React, { useState } from 'react'
import { Database, Upload, Plus, List } from 'lucide-react'
import ManualEntryForm from '../ManualEntryForm'
import DatasetUpload from '../DatasetUpload'
import TrainingDataList from '../TrainingDataList'

/**
 * TrainingDataPage - Main dashboard for managing AI training data.
 * This page allows users to switch between manual entry, bulk upload, and viewing existing data.
 *
 * @author 3rd Year CS Student
 */
const TrainingDataPage: React.FC = () => {
  // State to manage active tab
  const [activeTab, setActiveTab] = useState<'list' | 'manual' | 'upload'>('list')

  return (
    <div className="min-h-screen bg-black text-white pt-24 px-6 pb-12">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <Database className="text-blue-500" size={36} />
            Training Data Management
          </h1>
          <p className="text-zinc-400 text-lg">
            Manage your AI's knowledge base by adding manual entries or uploading datasets.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-8 border-b border-zinc-800 pb-4">
          <button
            onClick={() => setActiveTab('list')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              activeTab === 'list'
                ? 'bg-blue-600 text-white'
                : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'
            }`}
          >
            <List size={20} />
            View All Data
          </button>
          <button
            onClick={() => setActiveTab('manual')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              activeTab === 'manual'
                ? 'bg-blue-600 text-white'
                : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'
            }`}
          >
            <Plus size={20} />
            Manual Entry
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              activeTab === 'upload'
                ? 'bg-blue-600 text-white'
                : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'
            }`}
          >
            <Upload size={20} />
            Upload Dataset
          </button>
        </div>

        {/* Content Area */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 backdrop-blur-sm">
          {activeTab === 'list' && <TrainingDataList />}
          {activeTab === 'manual' && <ManualEntryForm onSuccess={() => setActiveTab('list')} />}
          {activeTab === 'upload' && <DatasetUpload onSuccess={() => setActiveTab('list')} />}
        </div>
      </div>
    </div>
  )
}

export default TrainingDataPage
