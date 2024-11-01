import React, { useState, useEffect } from "react";
import { FiSearch, FiX, FiChevronLeft, FiPlus, FiTrash2 } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const MonHoc = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [subjects, setSubjects] = useState([
    {
      id: 1,
      name: "Toán",
      description: "Advanced calculus and algebra concepts",
      materials: ["Textbook", "Practice Problems", "Formula Sheet"],
      details:
        "Comprehensive study of mathematical principles and applications",
    },
    {
      id: 2,
      name: "Lý",
      description: "Classical mechanics and modern physics",
      materials: ["Lab Manual", "Equipment Guide", "Research Papers"],
      details: "Exploration of physical laws and their practical applications",
    },
    {
      id: 3,
      name: "Hóa",
      description: "Organic and inorganic chemistry fundamentals",
      materials: ["Chemical Chart", "Safety Guidelines", "Experiment Notes"],
      details: "Study of chemical compounds and reactions",
    },
    {
      id: 4,
      name: "Lập Trình cơ bản",
      description: "Organic and inorganic chemistry fundamentals",
      materials: ["Chemical Chart", "Safety Guidelines", "Experiment Notes"],
      details: "Study of chemical compounds and reactions",
    },
    {
      id: 5,
      name: "Cơ sở dữ liệu",
      description: "Organic and inorganic chemistry fundamentals",
      materials: ["Chemical Chart", "Safety Guidelines", "Experiment Notes"],
      details: "Study of chemical compounds and reactions",
    },
    {
      id: 6,
      name: "Mạng Máy tính",
      description: "Organic and inorganic chemistry fundamentals",
      materials: ["Chemical Chart", "Safety Guidelines", "Experiment Notes"],
      details: "Study of chemical compounds and reactions",
    },
    {
      id: 7,
      name: "Kỹ Thuật Lập Trình",
      description: "Organic and inorganic chemistry fundamentals",
      materials: ["Chemical Chart", "Safety Guidelines", "Experiment Notes"],
      details: "Study of chemical compounds and reactions",
    },
    {
      id: 8,
      name: "Sinh học",
      description: "Organic and inorganic chemistry fundamentals",
      materials: ["Chemical Chart", "Safety Guidelines", "Experiment Notes"],
      details: "Study of chemical compounds and reactions",
    },
    {
      id: 9,
      name: "Văn học",
      description: "Organic and inorganic chemistry fundamentals",
      materials: ["Chemical Chart", "Safety Guidelines", "Experiment Notes"],
      details: "Study of chemical compounds and reactions",
    },
    {
      id: 10,
      name: "Địa lý",
      description: "Organic and inorganic chemistry fundamentals",
      materials: ["Chemical Chart", "Safety Guidelines", "Experiment Notes"],
      details: "Study of chemical compounds and reactions",
    },
    {
      id: 11,
      name: "Lịch sử",
      description: "Organic and inorganic chemistry fundamentals",
      materials: ["Chemical Chart", "Safety Guidelines", "Experiment Notes"],
      details: "Study of chemical compounds and reactions",
    },
    {
      id: 12,
      name: "Tin Học",
      description: "Organic and inorganic chemistry fundamentals",
      materials: ["Chemical Chart", "Safety Guidelines", "Experiment Notes"],
      details: "Study of chemical compounds and reactions",
    },
    {
      id: 13,
      name: "Tiếng Anh",
      description: "Organic and inorganic chemistry fundamentals",
      materials: ["Chemical Chart", "Safety Guidelines", "Experiment Notes"],
      details: "Study of chemical compounds and reactions",
    },
    {
      id: 14,
      name: "Giáo dục công dân",
      description: "Organic and inorganic chemistry fundamentals",
      materials: ["Chemical Chart", "Safety Guidelines", "Experiment Notes"],
      details: "Study of chemical compounds and reactions",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();
  const filteredSubjects = subjects.filter((subject) =>
    subject.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddSubject = () => {
    const newSubject = {
      id: subjects.length + 1,
      name: `New Subject ${subjects.length + 1}`,
      description: "Add description here",
      materials: [],
      details: "Add detailed information here",
    };
    setSubjects([...subjects, newSubject]);
  };

  const handleRemoveSubject = (id) => {
    setSubjects(subjects.filter((subject) => subject.id !== id));
    if (activeTab === id) setActiveTab(0);
  };

  const handleBack = () => {
    // Implement back navigation logic here
    navigate(-1);
    console.log("Back button clicked");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg">
        <div className="p-6">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={handleBack}
              className="group flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 font-bold text-gray-600 transition-all duration-300 hover:bg-gray-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-gray-400 active:bg-gray-300 mb-4"
              aria-label="Quay lại trang trước"
            >
              <FaArrowLeft className="transform transition-transform group-hover:-translate-x-1" />
              <span>Quay Lại</span>
            </button>

            {/* Search Input */}
            <div className="relative w-full max-w-md mx-4">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search subjects..."
                className="w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Search subjects"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear search"
                >
                  <FiX className="w-5 h-5" />
                </button>
              )}
            </div>

            <button
              onClick={handleAddSubject}
              className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              aria-label="Add new subject"
            >
              <FiPlus className="w-5 h-5 mr-2" />
              Add Subject
            </button>
          </div>

          {/* Tabs Navigation */}
          <div className="border-b border-gray-200 mb-6">
            <div className="flex flex-wrap gap-2">
              {filteredSubjects.map((subject) => (
                <button
                  key={subject.id}
                  onClick={() => setActiveTab(subject.id)}
                  className={`relative px-4 py-2 rounded-t-lg transition-colors ${
                    activeTab === subject.id
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                  aria-selected={activeTab === subject.id}
                  role="tab"
                >
                  <span className="flex items-center">
                    {subject.name}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveSubject(subject.id);
                      }}
                      className="ml-2 text-gray-400 hover:text-red-500"
                      aria-label={`Remove ${subject.name}`}
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </span>
                  {activeTab === subject.id && (
                    <motion.div
                      className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"
                      layoutId="activeTab"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Content Section */}
          <AnimatePresence mode="wait">
            {filteredSubjects.map(
              (subject) =>
                activeTab === subject.id && (
                  <motion.div
                    key={subject.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        {subject.name}
                      </h2>
                      <p className="text-gray-600 mb-4">
                        {subject.description}
                      </p>

                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          Materials
                        </h3>
                        <ul className="list-disc list-inside text-gray-600">
                          {subject.materials.map((material, index) => (
                            <li key={index}>{material}</li>
                          ))}
                        </ul>
                      </div>

                      <button
                        onClick={() => setExpanded(!expanded)}
                        className="text-blue-500 hover:text-blue-600 font-medium"
                        aria-expanded={expanded}
                      >
                        {expanded ? "Show Less" : "Show More"}
                      </button>

                      <AnimatePresence>
                        {expanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="mt-4 text-gray-600"
                          >
                            {subject.details}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default MonHoc;
