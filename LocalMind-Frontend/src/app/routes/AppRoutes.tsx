import React from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "../../features/Dashboard/V1/Component/Pages/HomePage";
import ChatPage from "../../pages/chat/ChatPage"; // ✅ Add ChatPage import

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Homepage */}
      <Route path="/" element={<HomePage />} />

      {/* Chat Page */}
      <Route path="/chat" element={<ChatPage />} />  {/* ✅ New route */}
    </Routes>
  );
};

export default AppRoutes;
