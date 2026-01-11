import React from 'react'
import { Route, Routes } from 'react-router-dom'
import HomePage from '../../features/Dashboard/V1/Component/Pages/HomePage'
import LoginPage from '../../shared/component/v1/LoginPage'
import ForgotPwd from '../../shared/component/v1/ForgotPwd'
import ResetPassword from '../../shared/component/v1/ResetPassword'

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Homepage */}
      <Route path="/" element={<HomePage />} />

      {/* Sign Up / Login Page */}
      <Route path="/login" element={<LoginPage />} />

      {/* Register Page - TODO: Create dedicated RegisterPage component */}
      <Route path="/register" element={<LoginPage />} />

      {/* Forgot Password Page */}
      <Route path="/forgot-password" element={<ForgotPwd />} />

      {/* Reset Password Page */}
      <Route path="/reset-password/:token" element={<ResetPassword />} />

      {/* Chat Page */}
    </Routes>
  )
}

export default AppRoutes
