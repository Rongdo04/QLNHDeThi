import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token"); // Kiểm tra token trong localStorage

  if (!token) {
    // Nếu không có token, chuyển hướng về trang đăng nhập
    return <Navigate to="/" />;
  }

  // Nếu có token, render component yêu cầu
  return children;
};

export default ProtectedRoute;
