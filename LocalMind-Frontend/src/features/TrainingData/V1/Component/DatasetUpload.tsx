import React, { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import axios from 'axios'
import { Upload, FileText, X, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'

interface DatasetUploadProps {
  onSuccess: () => void
}

/**
 * DatasetUpload - Component for bulk uploading training data files.
 * Supports PDF, CSV, XLSX, JSON, TXT, and MD.
 */
const DatasetUpload: React.FC<DatasetUploadProps> = ({ onSuccess }) => {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [progress, setProgress] = useState(0)

  // Handle file drop
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0])
      setError(null)
      setSuccess(false)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/json': ['.json'],
      'text/plain': ['.txt'],
      'text/markdown': ['.md'],
    },
    multiple: false,
  })

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    setError(null)
    setProgress(0)

    const formData = new FormData()
    formData.append('dataset', file)

    try {
      // 1. Upload the file
      const response = await axios.post(
        'http://localhost:5000/api/v1/training-datasets/upload',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: progressEvent => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / (progressEvent.total || 100)
            )
            setProgress(percentCompleted)
          },
        }
      )

      const datasetId = response.data.data._id

      // 2. Trigger processing
      await axios.post(`http://localhost:5000/api/v1/training-datasets/${datasetId}/process`)

      setSuccess(true)
      setTimeout(() => {
        onSuccess()
      }, 2000)
    } catch (err: unknown) {
      console.error('Upload error:', err)
      const errorMessage = axios.isAxiosError(err)
        ? err.response?.data?.message
        : 'Failed to upload dataset. Please check file format and size.'
      setError(errorMessage)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="text-center max-w-md mx-auto">
        <h3 className="text-xl font-semibold mb-2">Bulk Upload Datasets</h3>
        <p className="text-zinc-400 text-sm">
          Upload your documents and we'll automatically parse them into training samples with
          embeddings.
        </p>
      </div>

      {/* Dropzone */}
      {!file ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${
            isDragActive
              ? 'border-blue-500 bg-blue-500/5'
              : 'border-zinc-800 hover:border-zinc-700 bg-black'
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center">
              <Upload className="text-zinc-400" size={32} />
            </div>
            <div>
              <p className="text-lg font-medium">Click or drag file to upload</p>
              <p className="text-zinc-500 text-sm mt-1">
                Supports PDF, CSV, Excel, JSON, TXT, Markdown
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-black border border-zinc-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
                <FileText className="text-blue-500" size={24} />
              </div>
              <div>
                <p className="font-medium truncate max-w-[200px]">{file.name}</p>
                <p className="text-zinc-500 text-xs">{(file.size / 1024).toFixed(2)} KB</p>
              </div>
            </div>
            {!uploading && (
              <button
                onClick={() => setFile(null)}
                className="p-2 hover:bg-zinc-800 rounded-full text-zinc-500 transition-colors"
              >
                <X size={20} />
              </button>
            )}
          </div>

          {/* Progress Bar */}
          {uploading && (
            <div className="mb-6">
              <div className="flex justify-between text-xs text-zinc-400 mb-2">
                <span>{progress < 100 ? 'Uploading...' : 'Processing...'}</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-blue-600 h-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Status Messages */}
          {error && (
            <div className="mb-6 bg-red-900/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg flex items-center gap-3 text-sm">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 bg-green-900/20 border border-green-500/50 text-green-400 px-4 py-3 rounded-lg flex items-center gap-3 text-sm">
              <CheckCircle2 size={18} />
              Dataset uploaded and processing started!
            </div>
          )}

          {/* Action Button */}
          <button
            onClick={handleUpload}
            disabled={uploading || success}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {uploading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                {progress < 100 ? 'Uploading File...' : 'Parsing Content...'}
              </>
            ) : (
              <>
                <Upload size={20} />
                Start Import
              </>
            )}
          </button>
        </div>
      )}

      {/* Info Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-zinc-900/30 border border-zinc-800 rounded-xl">
          <p className="text-xs font-bold text-zinc-500 uppercase mb-2">Structured</p>
          <p className="text-sm text-zinc-300">
            CSV, Excel, and JSON files are parsed row-by-row into individual samples.
          </p>
        </div>
        <div className="p-4 bg-zinc-900/30 border border-zinc-800 rounded-xl">
          <p className="text-xs font-bold text-zinc-500 uppercase mb-2">Unstructured</p>
          <p className="text-sm text-zinc-300">
            PDF, TXT, and MD files are split into meaningful chunks automatically.
          </p>
        </div>
        <div className="p-4 bg-zinc-900/30 border border-zinc-800 rounded-xl">
          <p className="text-xs font-bold text-zinc-500 uppercase mb-2">Embeddings</p>
          <p className="text-sm text-zinc-300">
            Vector embeddings are generated for every sample for semantic search.
          </p>
        </div>
      </div>
    </div>
  )
}

export default DatasetUpload
