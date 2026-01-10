import React, { useState } from 'react'

const DatasetUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setStatus(null)
    }
  }

  const handleSubmit = async () => {
    if (!file) return

    if (isUploading) return

    setIsUploading(true)
    setStatus(null)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/v1/training-datasets/upload', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        setStatus({ type: 'success', message: 'Dataset uploaded successfully!' })
        setFile(null)
      } else {
        setStatus({ type: 'error', message: 'Failed to upload dataset. Please try again.' })
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'Network error. Please check your connection.' })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="p-6 bg-gray-900 rounded-lg border border-gray-800 text-white max-w-lg mx-auto mt-10">
      <h2 className="text-xl font-semibold mb-4">Upload Training Data</h2>

      <div className="flex flex-col gap-4">
        <input
          type="file"
          onChange={handleFileChange}
          disabled={isUploading}
          className="block w-full text-sm text-gray-400
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-indigo-600 file:text-white
            hover:file:bg-indigo-700
            disabled:opacity-50 disabled:cursor-not-allowed"
        />

        {status && (
          <div
            className={`p-3 rounded text-sm ${
              status.type === 'success'
                ? 'bg-green-900/50 text-green-300'
                : 'bg-red-900/50 text-red-300'
            }`}
          >
            {status.message}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={!file || isUploading}
          className={`px-4 py-2 rounded font-medium transition-colors
            ${
              !file || isUploading
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }
          `}
        >
          {isUploading ? 'Uploading...' : 'Submit Dataset'}
        </button>
      </div>
    </div>
  )
}

export default DatasetUpload
