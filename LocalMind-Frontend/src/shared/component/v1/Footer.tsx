import React from 'react'
import { Link } from 'react-router-dom'

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-white py-8 px-4 md:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Brand + Description */}
        <div>
          <h3 className="text-xl font-bold">LocalMind</h3>
          <p className="mt-2 text-sm text-gray-300">
            Your Data. Your AI. No Compromises.
          </p>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col space-y-2 text-sm">
          <Link to="/" className="hover:underline">
            Home
          </Link>
          <Link to="/privacy-policy" className="hover:underline">
            Privacy Policy
          </Link>
          <Link to="/terms-conditions" className="hover:underline">
            Terms & Conditions
          </Link>
          <Link to="/docs" className="hover:underline">
            Docs
          </Link>
        </div>

        {/* Social / Info */}
        <div className="text-sm text-gray-300">
          <p>Built with ❤️ by NexGenStudioDev</p>
          <p className="mt-1">No tracking. No data capture.</p>
        </div>
      </div>

      <hr className="border-gray-800 my-6" />

      <p className="text-center text-xs text-gray-500">
        &copy; {currentYear} LocalMind. All rights reserved.
      </p>
    </footer>
  )
}

export default Footer
