import React from 'react'
import Artificialintelligence from '../../../assets/Artificial intelligence.png'
import { NavLink, useLocation } from 'react-router-dom'

const Navbar: React.FC = () => {
  const location = useLocation()
  const isAppRoute = ['/chat', '/documents', '/settings', '/api'].includes(location.pathname)

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
      isActive 
        ? 'bg-blue-600 text-white shadow-lg' 
        : 'text-gray-300 hover:text-white hover:bg-zinc-700/50'
    }`

  const publicNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? 'text-white border-b-2 border-blue-500' : 'text-gray-300 hover:text-white'

  return (
    <div className="fixed top-2 left-1/2 z-30 flex gap-x-8 items-center justify-between -translate-x-1/2 bg-zinc-900/40 backdrop-blur-md px-6 py-3 rounded-full border border-zinc-500/50 text-white min-w-fit">
      <div className="flex gap-x-4 items-center">
        <img src={Artificialintelligence} className="w-6 h-6" alt="LocalMind logo" />
        <NavLink to="/" className="uppercase font-Satoshi tracking-wider font-bold text-xl hover:text-blue-400 transition-colors">
          LocalMind
        </NavLink>
      </div>

      <div className="flex gap-x-2 items-center">
        {isAppRoute ? (
          // App Navigation (when user is in main app sections)
          <>
            <NavLink to="/chat" className={navLinkClass}>
              💬 Chat
            </NavLink>
            <NavLink to="/documents" className={navLinkClass}>
              📚 Documents
            </NavLink>
            <NavLink to="/settings" className={navLinkClass}>
              ⚙️ Settings
            </NavLink>
            <NavLink to="/api" className={navLinkClass}>
              🔌 API
            </NavLink>
          </>
        ) : (
          // Public Navigation (for homepage, etc.)
          <>
            <NavLink to="/" className={publicNavLinkClass}>
              Home
            </NavLink>
            <NavLink to="/chat" className={publicNavLinkClass}>
              Chat
            </NavLink>
            <NavLink to="/documents" className={publicNavLinkClass}>
              Documents
            </NavLink>
            <NavLink to="/settings" className={publicNavLinkClass}>
              Settings
            </NavLink>
          </>
        )}
      </div>

      <NavLink
        to="/login"
        className={({ isActive }) =>
          `px-6 py-2 rounded-full font-medium transition-all duration-200 whitespace-nowrap ${
            isActive
              ? 'bg-blue-700 text-white shadow-lg'
              : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg'
          }`
        }
      >
        Sign Up
      </NavLink>
    </div>
  )
}

export default Navbar
