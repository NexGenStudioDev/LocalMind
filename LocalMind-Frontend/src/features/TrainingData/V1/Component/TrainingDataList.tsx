import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { Search, Trash2, Tag, Calendar, FileText, AlertCircle, Loader2 } from 'lucide-react'

interface TrainingSample {
  _id: string
  question: string
  answerTemplate: {
    answer: string
  }
  type: string
  tags: string[]
  sourceType: string
  createdAt: string
}

/**
 * TrainingDataList - Displays a searchable list of training samples.
 */
const TrainingDataList: React.FC = () => {
  const [samples, setSamples] = useState<TrainingSample[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [isSemanticSearch, setIsSemanticSearch] = useState(false)

  const fetchSamples = useCallback(async () => {
    setLoading(true)
    try {
      const params: Record<string, string> = {}
      if (filterType !== 'all') params.type = filterType

      const response = await axios.get('http://localhost:5000/api/v1/training-samples', { params })
      setSamples(response.data.data)
      setError(null)
    } catch (err: unknown) {
      console.error('Error fetching samples:', err)
      setError('Failed to load training data. Is the backend server running?')
    } finally {
      setLoading(false)
    }
  }, [filterType])

  const handleSemanticSearch = async () => {
    if (!searchQuery.trim()) {
      fetchSamples()
      setIsSemanticSearch(false)
      return
    }

    setLoading(true)
    setIsSemanticSearch(true)
    try {
      const response = await axios.post('http://localhost:5000/api/v1/training-samples/search', {
        query: searchQuery,
        topK: 10,
      })
      setSamples(response.data.data)
      setError(null)
    } catch (err: unknown) {
      console.error('Semantic search error:', err)
      setError('Semantic search failed. Make sure MongoDB Atlas Vector Search is configured.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!isSemanticSearch) {
      fetchSamples()
    }
  }, [fetchSamples, isSemanticSearch])

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this sample?')) return

    try {
      await axios.delete(`http://localhost:5000/api/v1/training-samples/${id}`)
      setSamples(prev => prev.filter(s => s._id !== id))
    } catch (err: unknown) {
      console.error('Delete error:', err)
      alert('Failed to delete sample')
    }
  }

  // Filter samples based on search query (only if not using semantic search)
  const filteredSamples = isSemanticSearch
    ? samples
    : samples.filter(
        sample =>
          sample.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          sample.answerTemplate.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
          sample.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )

  return (
    <div className="space-y-6">
      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
            <input
              type="text"
              placeholder="Search by question, answer, or tags..."
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value)
                if (isSemanticSearch && e.target.value === '') {
                  setIsSemanticSearch(false)
                }
              }}
              onKeyDown={e => e.key === 'Enter' && handleSemanticSearch()}
              className="w-full bg-black border border-zinc-800 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
          <button
            onClick={handleSemanticSearch}
            disabled={loading || !searchQuery.trim()}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              isSemanticSearch
                ? 'bg-blue-600 text-white'
                : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {loading && isSemanticSearch ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              'Semantic Search'
            )}
          </button>
        </div>
        <select
          value={filterType}
          onChange={e => {
            setFilterType(e.target.value)
            setIsSemanticSearch(false)
          }}
          className="bg-black border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
        >
          <option value="all">All Types</option>
          <option value="faq">FAQ</option>
          <option value="documentation">Documentation</option>
          <option value="conversation">Conversation</option>
          <option value="code">Code</option>
        </select>
      </div>

      {/* Search Mode Indicator */}
      {isSemanticSearch && !loading && (
        <div className="flex items-center gap-2 text-blue-400 text-sm bg-blue-500/10 px-3 py-1 rounded-full w-fit">
          <CheckCircle2 size={14} />
          Showing semantic search results for "{searchQuery}"
          <button
            onClick={() => {
              setIsSemanticSearch(false)
              setSearchQuery('')
            }}
            className="ml-2 hover:underline text-zinc-400"
          >
            Clear
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
          <Loader2 className="animate-spin mb-4" size={40} />
          <p>Loading training samples...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-900/20 border border-red-500/50 text-red-400 px-6 py-8 rounded-xl text-center">
          <AlertCircle className="mx-auto mb-4" size={40} />
          <p className="text-lg font-medium mb-2">Oops! Something went wrong</p>
          <p className="text-sm opacity-80">{error}</p>
          <button
            onClick={fetchSamples}
            className="mt-4 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredSamples.length === 0 && (
        <div className="text-center py-20 border-2 border-dashed border-zinc-800 rounded-2xl">
          <FileText className="mx-auto mb-4 text-zinc-700" size={48} />
          <p className="text-zinc-500">No training samples found.</p>
          {searchQuery && (
            <p className="text-zinc-600 text-sm mt-1">Try adjusting your search or filters.</p>
          )}
        </div>
      )}

      {/* Samples List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredSamples.map(sample => (
          <div
            key={sample._id}
            className="group bg-black border border-zinc-800 hover:border-zinc-700 rounded-xl p-5 transition-all"
          >
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span
                    className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                      sample.type === 'faq'
                        ? 'bg-blue-500/20 text-blue-400'
                        : sample.type === 'code'
                        ? 'bg-purple-500/20 text-purple-400'
                        : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    {sample.type}
                  </span>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-zinc-800 text-zinc-500">
                    {sample.sourceType}
                  </span>
                </div>
                <h4 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                  {sample.question}
                </h4>
                <p className="text-zinc-400 text-sm line-clamp-2 mb-4">
                  {sample.answerTemplate.answer}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500">
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    {new Date(sample.createdAt).toLocaleDateString()}
                  </div>
                  {sample.tags.length > 0 && (
                    <div className="flex items-center gap-1">
                      <Tag size={14} />
                      {sample.tags.join(', ')}
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={() => handleDelete(sample._id)}
                className="p-2 text-zinc-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                title="Delete Sample"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TrainingDataList
