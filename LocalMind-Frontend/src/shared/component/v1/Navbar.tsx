import React from "react";
import Artificialintelligence from "../../../assets/Artificial intelligence.png";
import { NavLink } from "react-router-dom";
const Navbar: React.FC = () => {
  return (
    <div className="fixed top-2 left-1/2 z-30 flex gap-x-50 items-center -translate-x-1/2 bg-zinc-900/40 backdrop-blur-md px-5 py-2 rounded-full border border-zinc-500/50 text-white">
      <div className="flex gap-x-4 items-center">
        <img src={Artificialintelligence} className="w-6 h-6" alt="" />
        <h1 className="uppercase font-Satoshi tracking-wider font-bold text-xl">
          LocalMind
        </h1>
      </div>
      <div className="flex gap-x-5 items-center">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "text-white line-through opacity-80" : "text-white"
          }>
          Home
        </NavLink>
        <NavLink
          to="/docs"
          className={({ isActive }) =>
            isActive ? "text-white line-through opacity-80" : "text-white"
          }>
          Docs
        </NavLink>
        <NavLink
          to="/models"
          className={({ isActive }) =>
            isActive ? "text-white line-through opacity-80" : "text-white"
          }>
          Models
        </NavLink>
        <NavLink
          to="/play-ground"
          className={({ isActive }) =>
            isActive ? "text-white line-through opacity-80" : "text-white"
          }>
          PlayGround
        </NavLink>
      </div>
    </div>
  );
};

export default Navbar;
