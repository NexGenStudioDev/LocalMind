import React from 'react'
import { Route, Routes } from 'react-router-dom'
import HomePage from '../../features/Dashboard/V1/Component/Pages/HomePage'
import SignUp from '../../features/Auth/SignUp'
import LoginPage from '../../shared/component/v1/LoginPage'
import ForgotPassword from '../../features/Auth/ForgotPassword'
import ResetPassword from '../../features/Auth/ResetPassword'

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Homepage */}
      <Route path="/" element={<HomePage />} />

      {/* Auth Pages */}
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

      {/* Legacy Redirects or Placeholders from Upstream */}
      <Route path="/register" element={<SignUp />} />
    </Routes>
  )
}

export default AppRoutes
