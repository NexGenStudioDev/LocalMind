import React from 'react'
import Artificialintelligence from '../../../assets/Artificial intelligence.png'
import { NavLink } from 'react-router-dom'

const Navbar: React.FC = () => {
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  isActive
    ? 'text-blue-400 font-semibold underline underline-offset-8'
    : 'text-white hover:text-blue-300 transition-colors'

  return (
    <div className="fixed top-2 left-1/2 z-30 flex gap-x-50 items-center justify-between -translate-x-1/2 bg-zinc-900/40 backdrop-blur-md px-5 py-2 rounded-full border border-zinc-500/50 text-white">
      <div className="flex gap-x-4 items-center">
        <img src={Artificialintelligence} className="w-6 h-6" alt="LocalMind logo" />
        <h1 className="uppercase font-Satoshi tracking-wider font-bold text-xl">LocalMind</h1>
      </div>

      <div className="flex gap-x-5 items-center">
        <NavLink to="/" className={navLinkClass}>
          Home
        </NavLink>
        <NavLink to="/docs" className={navLinkClass}>
          Docs
        </NavLink>
        <NavLink to="/models" className={navLinkClass}>
          Models
        </NavLink>
        <NavLink to="/play-ground" className={navLinkClass}>
          PlayGround
        </NavLink>
      </div>

      <NavLink
        to="/login"
        className={({ isActive }) =>
          isActive
            ? 'bg-blue-600 text-white px-8 py-1.5 rounded-full font-medium transition-colors hover:bg-blue-700 whitespace-nowrap'
            : 'bg-blue-500 text-white px-8 py-1.5 rounded-full font-medium transition-colors hover:bg-blue-600 whitespace-nowrap'
        }
      >
        Sign Up
      </NavLink>
    </div>
  )
}

export default Navbar
