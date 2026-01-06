import React from 'react'
import { Route, Routes } from 'react-router-dom'
import HomePage from '../../features/Dashboard/V1/Component/Pages/HomePage'
import LoginPage from '../../shared/component/v1/LoginPage'
import ContributorsPage from "../pages/Contributors"; 

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

      {/* Chat Page */}

      {/* Contributors page*/}
      <Route path="/contributors" element={<ContributorsPage />} />
    </Routes>
  )
}

export default AppRoutes
