import React from 'react'
import { Route, Routes } from 'react-router-dom'
import HomePage from '../../features/Dashboard/V1/Component/Pages/HomePage'
import SignUp from '../../features/Auth/SignUp'

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Homepage */}
      <Route path="/" element={<HomePage />} />

      {/* Auth Pages */}
      <Route path="/signup" element={<SignUp />} />

      {/* Chat Page */}
    </Routes>
  )
}

export default AppRoutes
