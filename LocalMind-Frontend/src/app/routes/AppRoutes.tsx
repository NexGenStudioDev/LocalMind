import React from 'react'
import { Route, Routes } from 'react-router-dom'
import HomePage from '../../features/Dashboard/V1/Component/Pages/HomePage'
import LoginPage from '../../shared/component/v1/LoginPage'
import Agents from "../../features/Dashboard/V1/Component/Pages/Agents";


const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Homepage */}
      <Route path="/" element={<HomePage />} />

      {/* Sign Up / Login Page */}
      <Route path="/login" element={<LoginPage />} />

      {/* Register Page - TODO: Create dedicated RegisterPage component */}
      <Route path="/register" element={<LoginPage />} />

      {/* Forgot Password Page - TODO: Create ForgotPasswordPage component */}
      <Route path="/forgot-password" element={<LoginPage />} />
      {/* Agents Page */}
      <Route path="/agents" element={<Agents />} />


      {/* Chat Page */}
    </Routes>
  )
}

export default AppRoutes
