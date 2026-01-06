import React, { useState } from 'react'
import axios from 'axios'
import { Save, AlertCircle, CheckCircle2 } from 'lucide-react'

interface ManualEntryFormProps {
  onSuccess: () => void
}

/**
 * ManualEntryForm - Form to manually add a training sample.
 * Includes validation and handles the API call to the backend.
 */
const ManualEntryForm: React.FC<ManualEntryFormProps> = ({ onSuccess }) => {
  // Form state
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    type: 'faq',
    tags: '',
    sourceType: 'manual',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Prepare the payload
      // Note: The backend expects answerTemplate as an object
      const payload = {
        ...formData,
        tags: formData.tags
          .split(',')
          .map(tag => tag.trim())
          .filter(tag => tag !== ''),
        answerTemplate: {
          answer: formData.answer,
        },
      }

      // API call to our new backend endpoint
      await axios.post('http://localhost:5000/api/v1/training-samples', payload)

      setSuccess(true)
      setTimeout(() => {
        onSuccess()
      }, 1500)
    } catch (err: unknown) {
      console.error('Error saving training sample:', err)
      const errorMessage = axios.isAxiosError(err)
        ? err.response?.data?.message
        : 'Failed to save training sample. Is the backend running?'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Question Field */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-zinc-400 mb-2">Question / Prompt</label>
          <textarea
            name="question"
            value={formData.question}
            onChange={handleChange}
            required
            rows={3}
            className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
            placeholder="e.g., How do I reset my password?"
          />
        </div>

        {/* Answer Field */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-zinc-400 mb-2">Answer / Response</label>
          <textarea
            name="answer"
            value={formData.answer}
            onChange={handleChange}
            required
            rows={5}
            className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
            placeholder="Provide the detailed answer here..."
          />
        </div>

        {/* Type Selection */}
        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-2">Data Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
          >
            <option value="faq">FAQ</option>
            <option value="documentation">Documentation</option>
            <option value="conversation">Conversation</option>
            <option value="code">Code Snippet</option>
          </select>
        </div>

        {/* Tags Field */}
        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-2">
            Tags (comma separated)
          </label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
            placeholder="auth, security, password"
          />
        </div>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="bg-red-900/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg flex items-center gap-3">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-900/20 border border-green-500/50 text-green-400 px-4 py-3 rounded-lg flex items-center gap-3">
          <CheckCircle2 size={20} />
          Sample saved successfully! Redirecting...
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end gap-4 pt-4">
        <button
          type="button"
          onClick={onSuccess}
          className="px-6 py-2 rounded-lg border border-zinc-800 text-zinc-400 hover:bg-zinc-800 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading || success}
          className="flex items-center gap-2 px-8 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {loading ? (
            'Saving...'
          ) : (
            <>
              <Save size={20} />
              Save Entry
            </>
          )}
        </button>
      </div>
    </form>
  )
}

export default ManualEntryForm
