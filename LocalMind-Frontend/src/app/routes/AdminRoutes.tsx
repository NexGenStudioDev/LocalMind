import React from 'react'
import { Route, Routes } from 'react-router-dom'
import AdminDashboard from '../../features/Admin/V1/Component/Pages/AdminDashboard'

const AdminRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
    </Routes>
  )
}

export default AdminRoutes
