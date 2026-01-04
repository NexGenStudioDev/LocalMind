import React from 'react'
import { Route, Routes } from 'react-router-dom'
import HomePage from '../../features/Dashboard/V1/Component/Pages/HomePage'





const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Homepage */}
      <Route path="/" element={<HomePage />} />

      {/* Chat Page */}

    </Routes>
  )
}

export default AppRoutes
