import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

export default function Input({ label, error, id, className = '', ...props }: InputProps) {
  const inputId = id || label.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="text-sm font-medium text-gray-200">
        {label}
      </label>
      <input
        id={inputId}
        className={`
          w-full px-4 py-2.5 rounded-lg
          bg-[#1a1a1a] border border-gray-800
          text-white placeholder-gray-500
          focus:outline-none focus:ring-1 focus:ring-gray-600 focus:border-gray-600
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-all duration-200
          ${error ? 'border-red-500 focus:ring-red-500' : ''}
          ${className}
        `}
        {...props}
      />
      {error && <span className="text-xs text-red-400">{error}</span>}
    </div>
  )
}
