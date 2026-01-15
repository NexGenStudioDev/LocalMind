import React from 'react'
import { Route, Routes } from 'react-router-dom'
import HomePage from '../../features/Dashboard/V1/Component/Pages/HomePage'
import SignUp from '../../features/Auth/SignUp'
import LoginPage from '../../shared/component/v1/LoginPage'
import ForgotPwd from '../../shared/component/v1/ForgotPwd'
import ResetPassword from '../../shared/component/v1/ResetPassword'

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
