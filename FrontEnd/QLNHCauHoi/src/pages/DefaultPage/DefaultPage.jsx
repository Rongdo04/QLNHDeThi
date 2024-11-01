import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaHome,
} from "react-icons/fa";
// const navigate = useNavigate(); // Khởi tạo hook useNavigate

// const handleBackToHome = () => {
//   navigate("/"); // Chuyển hướng về trang chính
// };
const DefaultPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="pt-24 pb-16">
        <section className="error-section relative overflow-hidden">
          <div className="container mx-auto px-6 py-16 text-center">
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
              <img
                src="https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b"
                alt="404 Error"
                className="w-64 h-64 object-cover rounded-lg shadow-xl mb-8"
              />
              <h1 className="text-8xl font-bold text-blue-600 mb-4 animate-bounce">
                404
              </h1>
              <h2 className="text-3xl font-semibold text-gray-800 mb-4">
                Page Not Found
              </h2>
              <p className="text-lg text-gray-600 mb-8 max-w-md">
                The page you are looking for might have been removed, had its
                name changed, or is temporarily unavailable.
              </p>
              <button className="flex items-center space-x-2 bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition duration-300 transform hover:scale-105">
                <FaHome className="text-xl" />
                <span>Back to Home</span>
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default DefaultPage;
