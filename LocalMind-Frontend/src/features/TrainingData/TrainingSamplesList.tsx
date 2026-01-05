import React, { useState, useEffect } from 'react'

interface TrainingSamplesListProps {
    onRefresh: () => void
}

interface TrainingSample {
    _id: string
    question: string
    type: 'qa' | 'snippet' | 'doc' | 'faq' | 'other'
    answerTemplate: {
        greeting?: string
        answer: string
        sections?: { title: string; content: string }[]
        suggestions?: string[]
    }
    codeSnippet?: string
    sourceType: 'manual' | 'dataset'
    tags: string[]
    language: string
    isActive: boolean
    createdAt: string
}

interface SearchResult {
    sample: TrainingSample
    similarity: number
}

const TrainingSamplesList: React.FC<TrainingSamplesListProps> = ({ onRefresh }) => {
    const [samples, setSamples] = useState<TrainingSample[]>([])
    const [loading, setLoading] = useState(true)
    const [searchMode, setSearchMode] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [searchResults, setSearchResults] = useState<SearchResult[]>([])
    const [searching, setSearching] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

    // Filters
    const [filters, setFilters] = useState({
        type: '',
        sourceType: '',
        isActive: ''
    })

    useEffect(() => {
        fetchSamples()
    }, [filters])

    const fetchSamples = async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams()
            if (filters.type) params.append('type', filters.type)
            if (filters.sourceType) params.append('sourceType', filters.sourceType)
            if (filters.isActive) params.append('isActive', filters.isActive)

            const response = await fetch(`/api/v1/training-samples?${params.toString()}`)
            const data = await response.json()

            if (data.success) {
                setSamples(data.data || [])
            }
        } catch (error) {
            console.error('Failed to fetch samples:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSearch = async () => {
        if (!searchQuery.trim()) return

        setSearching(true)
        setSearchMode(true)
        setMessage(null)

        try {
            const response = await fetch('/api/v1/training-samples/search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query: searchQuery,
                    topK: 10,
                    filters: filters.type ? { type: filters.type } : {}
                })
            })

            const data = await response.json()

            if (data.success) {
                setSearchResults(data.data || [])
                if (data.data.length === 0) {
                    setMessage({ type: 'error', text: 'No similar samples found' })
                }
            } else {
                setMessage({ type: 'error', text: data.message || 'Search failed' })
            }
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'Search failed' })
        } finally {
            setSearching(false)
        }
    }

    const clearSearch = () => {
        setSearchMode(false)
        setSearchQuery('')
        setSearchResults([])
        setMessage(null)
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this sample?')) return

        try {
            const response = await fetch(`/api/v1/training-samples/${id}`, {
                method: 'DELETE'
            })

            const data = await response.json()

            if (data.success) {
                setMessage({ type: 'success', text: 'Sample deleted successfully!' })
                await fetchSamples()
                onRefresh()
            } else {
                setMessage({ type: 'error', text: data.message || 'Failed to delete sample' })
            }
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'Failed to delete sample' })
        }
    }

    const handleToggleActive = async (id: string, currentStatus: boolean) => {
        try {
            const response = await fetch(`/api/v1/training-samples/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isActive: !currentStatus })
            })

            const data = await response.json()

            if (data.success) {
                await fetchSamples()
                onRefresh()
            } else {
                setMessage({ type: 'error', text: data.message || 'Failed to update sample' })
            }
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'Failed to update sample' })
        }
    }

    const getTypeIcon = (type: string): string => {
        const icons: Record<string, string> = {
            qa: '❓',
            snippet: '💻',
            doc: '📄',
            faq: '📋',
            other: '📌'
        }
        return icons[type] || '📝'
    }

    const formatDate = (dateString: string): string => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        })
    }

    const displaySamples = searchMode ? searchResults.map(r => r.sample) : samples

    return (
        <div className="samples-list-container">
            <div className="list-header">
                <h2 className="form-title">📋 Training Samples</h2>

                {/* Search Bar */}
                <div className="search-bar">
                    <input
                        type="text"
                        className="form-input search-input"
                        placeholder="Search by semantic similarity..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSearch()}
                    />
                    <button
                        className="btn btn-primary"
                        onClick={handleSearch}
                        disabled={searching || !searchQuery.trim()}
                    >
                        {searching ? <span className="loading-spinner"></span> : '🔍 Search'}
                    </button>
                    {searchMode && (
                        <button className="btn btn-secondary" onClick={clearSearch}>
                            ✕ Clear
                        </button>
                    )}
                </div>
            </div>

            {/* Filters */}
            <div className="filters-bar">
                <select
                    className="form-select filter-select"
                    value={filters.type}
                    onChange={e => setFilters({ ...filters, type: e.target.value })}
                >
                    <option value="">All Types</option>
                    <option value="qa">Q&A</option>
                    <option value="snippet">Snippet</option>
                    <option value="doc">Documentation</option>
                    <option value="faq">FAQ</option>
                    <option value="other">Other</option>
                </select>

                <select
                    className="form-select filter-select"
                    value={filters.sourceType}
                    onChange={e => setFilters({ ...filters, sourceType: e.target.value })}
                >
                    <option value="">All Sources</option>
                    <option value="manual">Manual</option>
                    <option value="dataset">Dataset</option>
                </select>

                <select
                    className="form-select filter-select"
                    value={filters.isActive}
                    onChange={e => setFilters({ ...filters, isActive: e.target.value })}
                >
                    <option value="">All Status</option>
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                </select>

                <span className="results-count">
                    {displaySamples.length} {searchMode ? 'results' : 'samples'}
                </span>
            </div>

            {message && (
                <div className={`alert alert-${message.type}`}>
                    {message.type === 'success' ? '✅' : '❌'} {message.text}
                </div>
            )}

            {/* Samples Grid */}
            {loading ? (
                <div className="loading-container">
                    <div className="loading-spinner large"></div>
                    <p>Loading samples...</p>
                </div>
            ) : displaySamples.length > 0 ? (
                <div className="samples-grid">
                    {(searchMode ? searchResults : samples.map(s => ({ sample: s, similarity: 0 }))).map(({ sample, similarity }) => (
                        <div
                            key={sample._id}
                            className={`sample-card ${!sample.isActive ? 'inactive' : ''}`}
                        >
                            <div className="sample-header">
                                <span className="sample-question">
                                    {getTypeIcon(sample.type)} {sample.question}
                                </span>
                                <div className="sample-badges">
                                    <span className="badge badge-type">{sample.type}</span>
                                    <span className="badge badge-source">{sample.sourceType}</span>
                                    {searchMode && similarity > 0 && (
                                        <span className="badge badge-similarity">
                                            {(similarity * 100).toFixed(1)}% match
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="sample-answer">
                                {sample.answerTemplate.greeting && (
                                    <em>{sample.answerTemplate.greeting}</em>
                                )}
                                <p>{sample.answerTemplate.answer}</p>
                            </div>

                            {sample.codeSnippet && (
                                <div className="code-preview">
                                    <code>{sample.codeSnippet.slice(0, 150)}...</code>
                                </div>
                            )}

                            <div className="sample-footer">
                                <div className="sample-tags">
                                    {sample.tags.slice(0, 3).map((tag, idx) => (
                                        <span key={idx} className="tag">{tag}</span>
                                    ))}
                                    {sample.tags.length > 3 && (
                                        <span className="tag">+{sample.tags.length - 3}</span>
                                    )}
                                </div>
                                <div className="sample-meta">
                                    <span className="language-badge">{sample.language}</span>
                                    <span className="date">{formatDate(sample.createdAt)}</span>
                                </div>
                            </div>

                            <div className="sample-actions">
                                <button
                                    className={`btn btn-small ${sample.isActive ? 'btn-secondary' : 'btn-primary'}`}
                                    onClick={() => handleToggleActive(sample._id, sample.isActive)}
                                >
                                    {sample.isActive ? '⏸️ Deactivate' : '▶️ Activate'}
                                </button>
                                <button
                                    className="btn btn-small btn-danger"
                                    onClick={() => handleDelete(sample._id)}
                                >
                                    🗑️ Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="empty-state">
                    <div className="empty-icon">📭</div>
                    <p>No training samples found</p>
                    <p className="upload-hint">
                        {searchMode
                            ? 'Try a different search query'
                            : 'Create a manual sample or upload a dataset to get started'
                        }
                    </p>
                </div>
            )}

            <style>{`
                .samples-list-container {
                    max-width: 1200px;
                }

                .list-header {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                    margin-bottom: 1.5rem;
                }

                .search-bar {
                    display: flex;
                    gap: 0.75rem;
                }

                .search-input {
                    flex: 1;
                    max-width: 400px;
                }

                .filters-bar {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    flex-wrap: wrap;
                    margin-bottom: 1.5rem;
                    padding: 1rem;
                    background: rgba(255, 255, 255, 0.02);
                    border-radius: 10px;
                }

                .filter-select {
                    min-width: 140px;
                }

                .results-count {
                    margin-left: auto;
                    font-size: 0.875rem;
                    color: #9ca3af;
                }

                .samples-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
                    gap: 1.25rem;
                }

                .sample-card.inactive {
                    opacity: 0.6;
                    border-color: rgba(239, 68, 68, 0.3);
                }

                .sample-answer {
                    color: #9ca3af;
                    font-size: 0.875rem;
                    max-height: 80px;
                    overflow: hidden;
                    margin: 0.75rem 0;
                }

                .sample-answer em {
                    color: #a78bfa;
                    display: block;
                    margin-bottom: 0.25rem;
                }

                .sample-answer p {
                    margin: 0;
                    line-height: 1.5;
                }

                .code-preview {
                    background: rgba(0, 0, 0, 0.3);
                    padding: 0.5rem 0.75rem;
                    border-radius: 6px;
                    font-family: monospace;
                    font-size: 0.75rem;
                    color: #22c55e;
                    margin-bottom: 0.75rem;
                    overflow: hidden;
                }

                .sample-footer {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding-top: 0.75rem;
                    border-top: 1px solid rgba(255, 255, 255, 0.05);
                }

                .sample-meta {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.75rem;
                    color: #6b7280;
                }

                .language-badge {
                    background: rgba(59, 130, 246, 0.2);
                    color: #60a5fa;
                    padding: 0.125rem 0.375rem;
                    border-radius: 4px;
                    text-transform: uppercase;
                    font-size: 0.625rem;
                    font-weight: 600;
                }

                .badge-similarity {
                    background: rgba(34, 197, 94, 0.2);
                    color: #22c55e;
                }

                .sample-actions {
                    display: flex;
                    gap: 0.5rem;
                    margin-top: 0.75rem;
                }

                .loading-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding: 4rem 2rem;
                    color: #9ca3af;
                }

                .loading-spinner.large {
                    width: 40px;
                    height: 40px;
                    margin-bottom: 1rem;
                }
            `}</style>
        </div>
    )
}

export default TrainingSamplesList
