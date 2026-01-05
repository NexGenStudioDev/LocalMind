import React, { useState } from 'react'

interface ManualEntryFormProps {
    onSuccess: () => void
}

const ManualEntryForm: React.FC<ManualEntryFormProps> = ({ onSuccess }) => {
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

    const [formData, setFormData] = useState({
        question: '',
        type: 'qa',
        answer: '',
        greeting: '',
        codeSnippet: '',
        tags: '',
        language: 'en',
        isActive: true
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setMessage(null)

        try {
            const payload = {
                question: formData.question,
                type: formData.type,
                answerTemplate: {
                    greeting: formData.greeting || undefined,
                    answer: formData.answer,
                    sections: [],
                    suggestions: []
                },
                codeSnippet: formData.codeSnippet || undefined,
                tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : [],
                language: formData.language
            }

            const response = await fetch('/api/v1/training-samples', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })

            const data = await response.json()

            if (data.success) {
                setMessage({ type: 'success', text: 'Training sample created successfully!' })
                setFormData({
                    question: '',
                    type: 'qa',
                    answer: '',
                    greeting: '',
                    codeSnippet: '',
                    tags: '',
                    language: 'en',
                    isActive: true
                })
                onSuccess()
            } else {
                setMessage({ type: 'error', text: data.message || 'Failed to create sample' })
            }
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'An error occurred' })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="form-container">
            <h2 className="form-title">✏️ Create Training Sample</h2>

            {message && (
                <div className={`alert alert-${message.type}`}>
                    {message.type === 'success' ? '✅' : '❌'} {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="form-grid">
                    <div className="form-group full-width">
                        <label className="form-label">
                            Question <span className="required">*</span>
                        </label>
                        <input
                            type="text"
                            className="form-input"
                            value={formData.question}
                            onChange={e => setFormData({ ...formData, question: e.target.value })}
                            placeholder="Enter the question or prompt..."
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Type</label>
                        <select
                            className="form-select"
                            value={formData.type}
                            onChange={e => setFormData({ ...formData, type: e.target.value })}
                        >
                            <option value="qa">Q&A</option>
                            <option value="snippet">Code Snippet</option>
                            <option value="doc">Documentation</option>
                            <option value="faq">FAQ</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Language</label>
                        <select
                            className="form-select"
                            value={formData.language}
                            onChange={e => setFormData({ ...formData, language: e.target.value })}
                        >
                            <option value="en">English</option>
                            <option value="es">Spanish</option>
                            <option value="fr">French</option>
                            <option value="de">German</option>
                            <option value="hi">Hindi</option>
                        </select>
                    </div>

                    <div className="form-group full-width">
                        <label className="form-label">Greeting (Optional)</label>
                        <input
                            type="text"
                            className="form-input"
                            value={formData.greeting}
                            onChange={e => setFormData({ ...formData, greeting: e.target.value })}
                            placeholder="Optional greeting message..."
                        />
                    </div>

                    <div className="form-group full-width">
                        <label className="form-label">
                            Answer <span className="required">*</span>
                        </label>
                        <textarea
                            className="form-textarea"
                            value={formData.answer}
                            onChange={e => setFormData({ ...formData, answer: e.target.value })}
                            placeholder="Enter the answer or response..."
                            rows={5}
                            required
                        />
                    </div>

                    <div className="form-group full-width">
                        <label className="form-label">Code Snippet (Optional)</label>
                        <textarea
                            className="form-textarea"
                            value={formData.codeSnippet}
                            onChange={e => setFormData({ ...formData, codeSnippet: e.target.value })}
                            placeholder="// Optional code snippet..."
                            rows={4}
                            style={{ fontFamily: 'monospace' }}
                        />
                    </div>

                    <div className="form-group full-width">
                        <label className="form-label">Tags (comma-separated)</label>
                        <input
                            type="text"
                            className="form-input"
                            value={formData.tags}
                            onChange={e => setFormData({ ...formData, tags: e.target.value })}
                            placeholder="javascript, react, frontend..."
                        />
                    </div>
                </div>

                <div className="form-actions">
                    <button type="button" className="btn btn-secondary" onClick={() => setFormData({
                        question: '', type: 'qa', answer: '', greeting: '', codeSnippet: '', tags: '', language: 'en', isActive: true
                    })}>
                        Clear
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? <><span className="loading-spinner"></span> Creating...</> : '💾 Create Sample'}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default ManualEntryForm
