import React, { useState, useEffect } from 'react'
import ManualEntryForm from './ManualEntryForm'
import DatasetUpload from './DatasetUpload'
import TrainingSamplesList from './TrainingSamplesList'
import './TrainingDataPage.css'

interface Tab {
    id: string
    label: string
    icon: string
}

const tabs: Tab[] = [
    { id: 'manual', label: 'Manual Entry', icon: '✏️' },
    { id: 'upload', label: 'Upload Dataset', icon: '📁' },
    { id: 'list', label: 'View Samples', icon: '📋' }
]

const TrainingDataPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState('manual')
    const [stats, setStats] = useState<any>(null)
    const [refreshKey, setRefreshKey] = useState(0)

    useEffect(() => {
        fetchStats()
    }, [refreshKey])

    const fetchStats = async () => {
        try {
            const response = await fetch('/api/v1/training-samples/stats')
            const data = await response.json()
            if (data.success) {
                setStats(data.data)
            }
        } catch (error) {
            console.error('Failed to fetch stats:', error)
        }
    }

    const handleRefresh = () => {
        setRefreshKey(prev => prev + 1)
    }

    return (
        <div className="training-data-page">
            {/* Header */}
            <header className="training-header">
                <div className="header-content">
                    <div className="header-title">
                        <h1>🧠 AI Training Data Management</h1>
                        <p>Create, manage, and search training samples for AI fine-tuning</p>
                    </div>
                    {stats && (
                        <div className="stats-cards">
                            <div className="stat-card">
                                <span className="stat-value">{stats.total || 0}</span>
                                <span className="stat-label">Total Samples</span>
                            </div>
                            <div className="stat-card">
                                <span className="stat-value">{stats.activeCount || 0}</span>
                                <span className="stat-label">Active</span>
                            </div>
                            <div className="stat-card">
                                <span className="stat-value">{stats.bySource?.manual || 0}</span>
                                <span className="stat-label">Manual</span>
                            </div>
                            <div className="stat-card">
                                <span className="stat-value">{stats.bySource?.dataset || 0}</span>
                                <span className="stat-label">From Dataset</span>
                            </div>
                        </div>
                    )}
                </div>
            </header>

            {/* Tab Navigation */}
            <nav className="tab-navigation">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        <span className="tab-icon">{tab.icon}</span>
                        <span className="tab-label">{tab.label}</span>
                    </button>
                ))}
            </nav>

            {/* Content Area */}
            <main className="training-content">
                {activeTab === 'manual' && (
                    <ManualEntryForm onSuccess={handleRefresh} />
                )}
                {activeTab === 'upload' && (
                    <DatasetUpload onSuccess={handleRefresh} />
                )}
                {activeTab === 'list' && (
                    <TrainingSamplesList key={refreshKey} onRefresh={handleRefresh} />
                )}
            </main>
        </div>
    )
}

export default TrainingDataPage
