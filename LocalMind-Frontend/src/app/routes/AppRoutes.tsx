import React from 'react'
import { Route, Routes } from 'react-router-dom'

import HomePage from '../../features/Dashboard/V1/Component/Pages/HomePage'
import LoginPage from '../../shared/component/V1/LoginPage'
import ContributorsPage from '../../features/Dashboard/contributors/ContributorsPage'

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Home Page */}
      <Route path="/" element={<HomePage />} />

      {/* Contributors Page */}
      <Route path="/contributors" element={<ContributorsPage />} />

      {/* Login Page */}
      <Route path="/login" element={<LoginPage />} />

      {/* Register Page (temporary using LoginPage) */}
      <Route path="/register" element={<LoginPage />} />

      {/* Forgot Password Page (temporary using LoginPage) */}
      <Route path="/forgot-password" element={<LoginPage />} />
    </Routes>
  )
}

export default AppRoutes