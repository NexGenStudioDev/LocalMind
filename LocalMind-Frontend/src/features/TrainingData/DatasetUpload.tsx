import React, { useState, useRef } from 'react'

interface DatasetUploadProps {
    onSuccess: () => void
}

interface Dataset {
    _id: string
    originalName: string
    fileType: string
    sizeInBytes: number
    status: 'uploaded' | 'processing' | 'completed' | 'failed'
    totalSamplesGenerated: number
    errorMessage?: string
    createdAt: string
}

interface PreviewData {
    preview: any[]
    totalRows: number
}

const DatasetUpload: React.FC<DatasetUploadProps> = ({ onSuccess }) => {
    const [uploading, setUploading] = useState(false)
    const [processing, setProcessing] = useState<string | null>(null)
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
    const [datasets, setDatasets] = useState<Dataset[]>([])
    const [preview, setPreview] = useState<{ datasetId: string; data: PreviewData } | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    React.useEffect(() => {
        fetchDatasets()
    }, [])

    const fetchDatasets = async () => {
        try {
            const response = await fetch('/api/v1/training-datasets')
            const data = await response.json()
            if (data.success) {
                setDatasets(data.data || [])
            }
        } catch (error) {
            console.error('Failed to fetch datasets:', error)
        }
    }

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setUploading(true)
        setMessage(null)

        try {
            const formData = new FormData()
            formData.append('file', file)

            const response = await fetch('/api/v1/training-datasets/upload', {
                method: 'POST',
                body: formData
            })

            const data = await response.json()

            if (data.success) {
                setMessage({ type: 'success', text: `Dataset "${file.name}" uploaded successfully!` })
                await fetchDatasets()
                onSuccess()
            } else {
                setMessage({ type: 'error', text: data.message || 'Failed to upload dataset' })
            }
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'An error occurred during upload' })
        } finally {
            setUploading(false)
            if (fileInputRef.current) {
                fileInputRef.current.value = ''
            }
        }
    }

    const handlePreview = async (datasetId: string) => {
        try {
            const response = await fetch(`/api/v1/training-datasets/${datasetId}/preview?limit=5`)
            const data = await response.json()
            if (data.success) {
                setPreview({ datasetId, data: data.data })
            } else {
                setMessage({ type: 'error', text: data.message || 'Failed to preview dataset' })
            }
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'Failed to preview dataset' })
        }
    }

    const handleProcess = async (datasetId: string) => {
        setProcessing(datasetId)
        setMessage(null)

        try {
            const response = await fetch(`/api/v1/training-datasets/${datasetId}/process`, {
                method: 'POST'
            })

            const data = await response.json()

            if (data.success) {
                setMessage({
                    type: 'success',
                    text: `Dataset processed successfully! ${data.data.samplesCreated} samples created.`
                })
                await fetchDatasets()
                onSuccess()
            } else {
                setMessage({ type: 'error', text: data.message || 'Failed to process dataset' })
            }
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'An error occurred during processing' })
        } finally {
            setProcessing(null)
        }
    }

    const handleDelete = async (datasetId: string) => {
        if (!confirm('Are you sure you want to delete this dataset?')) return

        try {
            const response = await fetch(`/api/v1/training-datasets/${datasetId}`, {
                method: 'DELETE'
            })

            const data = await response.json()

            if (data.success) {
                setMessage({ type: 'success', text: 'Dataset deleted successfully!' })
                await fetchDatasets()
                setPreview(null)
                onSuccess()
            } else {
                setMessage({ type: 'error', text: data.message || 'Failed to delete dataset' })
            }
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'Failed to delete dataset' })
        }
    }

    const formatFileSize = (bytes: number): string => {
        if (bytes < 1024) return `${bytes} B`
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    }

    const getStatusBadge = (status: string) => {
        const statusClasses: Record<string, string> = {
            uploaded: 'badge-uploaded',
            processing: 'badge-processing',
            completed: 'badge-completed',
            failed: 'badge-failed'
        }
        return <span className={`badge ${statusClasses[status] || ''}`}>{status}</span>
    }

    const getFileIcon = (fileType: string): string => {
        const icons: Record<string, string> = {
            pdf: '📄',
            csv: '📊',
            excel: '📗',
            json: '📋',
            txt: '📝',
            md: '📑'
        }
        return icons[fileType] || '📁'
    }

    return (
        <div className="dataset-upload-container">
            <h2 className="form-title">📁 Upload Dataset</h2>

            {message && (
                <div className={`alert alert-${message.type}`}>
                    {message.type === 'success' ? '✅' : '❌'} {message.text}
                </div>
            )}

            {/* Upload Area */}
            <div
                className="upload-area"
                onClick={() => fileInputRef.current?.click()}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    className="upload-input"
                    accept=".csv,.xls,.xlsx,.json,.txt,.md,.pdf"
                    onChange={handleFileSelect}
                    disabled={uploading}
                />
                {uploading ? (
                    <>
                        <div className="loading-spinner large"></div>
                        <p className="upload-text">Uploading...</p>
                    </>
                ) : (
                    <>
                        <div className="upload-icon">📤</div>
                        <p className="upload-text">
                            <strong>Click to upload</strong> or drag and drop
                        </p>
                        <p className="upload-hint">
                            Supported formats: PDF, CSV, Excel, JSON, TXT, Markdown
                        </p>
                    </>
                )}
            </div>

            {/* Datasets List */}
            {datasets.length > 0 && (
                <div className="datasets-list">
                    <h3 className="section-title">📋 Uploaded Datasets</h3>

                    <div className="datasets-grid">
                        {datasets.map(dataset => (
                            <div key={dataset._id} className="dataset-card">
                                <div className="dataset-header">
                                    <span className="file-icon">{getFileIcon(dataset.fileType)}</span>
                                    <div className="dataset-info">
                                        <span className="dataset-name">{dataset.originalName}</span>
                                        <span className="dataset-meta">
                                            {formatFileSize(dataset.sizeInBytes)} • {dataset.fileType.toUpperCase()}
                                        </span>
                                    </div>
                                    {getStatusBadge(dataset.status)}
                                </div>

                                {dataset.status === 'completed' && (
                                    <div className="dataset-stats">
                                        <span className="stat-item">
                                            ✅ {dataset.totalSamplesGenerated} samples generated
                                        </span>
                                    </div>
                                )}

                                {dataset.status === 'failed' && dataset.errorMessage && (
                                    <div className="dataset-error">
                                        ❌ {dataset.errorMessage}
                                    </div>
                                )}

                                <div className="dataset-actions">
                                    {dataset.status === 'uploaded' && (
                                        <>
                                            <button
                                                className="btn btn-small btn-secondary"
                                                onClick={() => handlePreview(dataset._id)}
                                            >
                                                👁️ Preview
                                            </button>
                                            <button
                                                className="btn btn-small btn-primary"
                                                onClick={() => handleProcess(dataset._id)}
                                                disabled={processing === dataset._id}
                                            >
                                                {processing === dataset._id ? (
                                                    <><span className="loading-spinner"></span> Processing...</>
                                                ) : (
                                                    '⚡ Process'
                                                )}
                                            </button>
                                        </>
                                    )}
                                    <button
                                        className="btn btn-small btn-danger"
                                        onClick={() => handleDelete(dataset._id)}
                                    >
                                        🗑️ Delete
                                    </button>
                                </div>

                                {/* Preview Section */}
                                {preview?.datasetId === dataset._id && (
                                    <div className="preview-section">
                                        <div className="preview-header">
                                            <span>Preview ({preview.data.totalRows} total rows)</span>
                                            <button
                                                className="btn-close"
                                                onClick={() => setPreview(null)}
                                            >
                                                ✕
                                            </button>
                                        </div>
                                        <div className="preview-content">
                                            {preview.data.preview.map((row, idx) => (
                                                <div key={idx} className="preview-row">
                                                    <strong>Q:</strong> {row.question || JSON.stringify(row).slice(0, 100)}
                                                    {row.answer && (
                                                        <>
                                                            <br />
                                                            <strong>A:</strong> {row.answer.slice(0, 150)}...
                                                        </>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {datasets.length === 0 && (
                <div className="empty-state">
                    <div className="empty-icon">📂</div>
                    <p>No datasets uploaded yet</p>
                    <p className="upload-hint">Upload a file to get started</p>
                </div>
            )}

            <style>{`
                .dataset-upload-container {
                    max-width: 900px;
                }
                
                .section-title {
                    font-size: 1.125rem;
                    font-weight: 600;
                    margin: 2rem 0 1rem;
                    color: #e0e0e0;
                }
                
                .datasets-grid {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }
                
                .dataset-card {
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 12px;
                    padding: 1.25rem;
                }
                
                .dataset-header {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }
                
                .file-icon {
                    font-size: 2rem;
                }
                
                .dataset-info {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                }
                
                .dataset-name {
                    font-weight: 600;
                    color: #e0e0e0;
                }
                
                .dataset-meta {
                    font-size: 0.8125rem;
                    color: #9ca3af;
                }
                
                .badge-uploaded { background: rgba(59, 130, 246, 0.2); color: #60a5fa; }
                .badge-processing { background: rgba(251, 191, 36, 0.2); color: #fbbf24; }
                .badge-completed { background: rgba(34, 197, 94, 0.2); color: #22c55e; }
                .badge-failed { background: rgba(239, 68, 68, 0.2); color: #ef4444; }
                
                .dataset-stats {
                    margin-top: 0.75rem;
                    font-size: 0.875rem;
                    color: #22c55e;
                }
                
                .dataset-error {
                    margin-top: 0.75rem;
                    font-size: 0.875rem;
                    color: #ef4444;
                    background: rgba(239, 68, 68, 0.1);
                    padding: 0.5rem;
                    border-radius: 6px;
                }
                
                .dataset-actions {
                    display: flex;
                    gap: 0.5rem;
                    margin-top: 1rem;
                    padding-top: 1rem;
                    border-top: 1px solid rgba(255, 255, 255, 0.05);
                }
                
                .preview-section {
                    margin-top: 1rem;
                    background: rgba(0, 0, 0, 0.2);
                    border-radius: 8px;
                    overflow: hidden;
                }
                
                .preview-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0.75rem 1rem;
                    background: rgba(139, 92, 246, 0.1);
                    font-size: 0.875rem;
                    color: #a78bfa;
                }
                
                .btn-close {
                    background: none;
                    border: none;
                    color: #9ca3af;
                    cursor: pointer;
                    font-size: 1rem;
                }
                
                .preview-content {
                    padding: 1rem;
                    max-height: 300px;
                    overflow-y: auto;
                }
                
                .preview-row {
                    font-size: 0.8125rem;
                    color: #9ca3af;
                    padding: 0.75rem;
                    background: rgba(255, 255, 255, 0.02);
                    border-radius: 6px;
                    margin-bottom: 0.5rem;
                }
                
                .preview-row strong {
                    color: #e0e0e0;
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

export default DatasetUpload
