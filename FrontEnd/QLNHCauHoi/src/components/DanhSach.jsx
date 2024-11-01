import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AiOutlineBook,
  AiOutlineQuestionCircle,
  AiOutlineFileText,
  AiOutlineBuild,
  AiOutlineAppstore,
  AiOutlineDashboard,
  AiOutlineLogout, // Import the logout icon
} from "react-icons/ai";

const DanhSach = () => {
  const [error, setError] = useState(null);
  const [activeItem, setActiveItem] = useState(null);
  const navigate = useNavigate();
  const menuItems = [
    {
      id: 1,
      title: "Câu Hỏi",
      icon: <AiOutlineQuestionCircle className="text-2xl" />,
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
      path: "/cau-hoi",
    },
    {
      id: 2,
      title: "Đề Thi",
      icon: <AiOutlineFileText className="text-2xl" />,
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173",
      path: "/de-thi",
    },
    {
      id: 3,
      title: "Hệ Đào Tạo",
      icon: <AiOutlineBuild className="text-2xl" />,
      image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655",
      path: "/he-dao-tao",
    },
    // {
    //   id: 4,
    //   title: "Hình Thức Thi",
    //   icon: <AiOutlineAppstore className="text-2xl" />,
    //   image: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d",
    //   path: "/hinh-thuc-thi",
    // },
    {
      id: 5,
      title: "Môn Học",
      icon: <AiOutlineBook className="text-2xl" />,
      image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6",
      path: "/mon-hoc",
    },
    // {
    //   id: 6,
    //   title: "Độ Khó",
    //   icon: <AiOutlineDashboard className="text-2xl" />,
    //   image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
    //   path: "/muc-do-kho",
    // },
  ];

  const handleMenuClick = (path) => {
    try {
      navigate(path);
    } catch (err) {
      setError(
        "An error occurred while processing your request. Please try again."
      );
      setTimeout(() => setError(null), 3000);
    }
  };

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear the token
    navigate("/login"); // Navigate to the login page
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 bg-[url('https://media.istockphoto.com/id/1023468010/fr/photo/retour-au-concept-de-l%C3%A9cole-pile-de-livres-sur-un-bureau-en-bois-en-face-de-la-biblioth%C3%A8que.webp?a=1&b=1&s=612x612&w=0&k=20&c=R8ts6jLSs8g3f15F615AIjsEFoTkcDC4U6T3NgCZwz4=')] ">
      {error && (
        <div
          className="fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300"
          role="alert"
        >
          {error}
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">
          Quản Lý Ngân Hàng Đề Thi
        </h1>

        <div className="mb-4 ">
          <button
            onClick={handleLogout}
            className="flex items-center text-white hover:text-red-800 focus:outline-none"
            aria-label="Logout"
          >
            <AiOutlineLogout className="mr-2" />
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2  gap-6">
          {menuItems.map((item) => (
            <div
              key={item.id}
              onClick={() => handleMenuClick(item.path)}
              className={`relative group bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                activeItem === item.id ? "ring-2 ring-blue-500" : ""
              }`}
              role="button"
              tabIndex="0"
              aria-label={item.title}
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-50 transition-all duration-300"></div>
              </div>

              <div className="p-6">
                <div className="flex items-center space-x-3 mb-2">
                  {item.icon}
                  <h2 className="text-xl font-semibold text-gray-800">
                    {item.title}
                  </h2>
                </div>
                <p className="text-gray-600 text-sm">
                  Click to explore {item.title.toLowerCase()} section
                </p>
              </div>

              <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DanhSach;
