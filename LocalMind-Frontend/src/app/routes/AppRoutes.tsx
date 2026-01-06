import React from 'react'
import { Route, Routes } from 'react-router-dom'
import HomePage from '../../features/Dashboard/V1/Component/Pages/HomePage'
import LoginPage from '../../shared/component/v1/LoginPage'
import ChatPage from '../../features/Dashboard/V1/Component/Pages/ChatPage'
import DocumentsPage from '../../features/Dashboard/V1/Component/Pages/DocumentsPage'
import SettingsPage from '../../features/Dashboard/V1/Component/Pages/SettingsPage'
import APIPage from '../../features/Dashboard/V1/Component/Pages/APIPage'

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Homepage */}
      <Route path="/" element={<HomePage />} />

      {/* Main Application Pages */}
      <Route path="/chat" element={<ChatPage />} />
      <Route path="/documents" element={<DocumentsPage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/api" element={<APIPage />} />

      {/* Authentication Pages */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<LoginPage />} />
      <Route path="/forgot-password" element={<LoginPage />} />
    </Routes>
  )
}

export default AppRoutes
