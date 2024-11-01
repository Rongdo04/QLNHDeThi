import React, { useState } from "react";
import { FiSearch, FiChevronDown, FiChevronUp } from "react-icons/fi";
import {
  FaGraduationCap,
  FaUniversity,
  FaUserGraduate,
  FaArrowLeft,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const HeDaoTao = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedSection, setExpandedSection] = useState(null);

  const educationLevels = [
    {
      id: "college",
      title: "Cao đẳng",
      icon: <FaGraduationCap className="text-2xl" />,
      programs: [
        {
          name: "Công nghệ Thông tin",
          duration: "3 năm",
          description:
            "Đào tạo thực tế trong hệ thống IT và ứng dụng phần mềm.",
          requirements: "Chứng chỉ hoàn thành trung học phổ thông",
        },
      ],
    },
    {
      id: "transfer-engineering",
      title: "Liên thông",
      icon: <FaUserGraduate className="text-2xl" />,
      programs: [
        {
          name: "Chuyển tiếp Kỹ thuật",
          duration: "2 năm",
          description:
            "Chương trình nâng cao cho sinh viên tốt nghiệp cao đẳng hoàn thành bằng đại học.",
          requirements: "Bằng cao đẳng trong lĩnh vực liên quan",
        },
      ],
    },
    {
      id: "bachelor",
      title: "Cử Nhân",
      icon: <FaUserGraduate className="text-2xl" />,
      programs: [
        {
          name: "Chương trình Cử nhân",
          duration: "4 năm",
          description: "Chương trình đại học trong các ngành khác nhau.",
          requirements: "Bằng tốt nghiệp trung học phổ thông",
        },
      ],
    },
    {
      id: "university",
      title: "Đại học",
      icon: <FaUniversity className="text-2xl" />,
      programs: [
        {
          name: "Khoa học Máy tính",
          duration: "4 năm",
          description:
            "Chương trình toàn diện bao gồm phát triển phần mềm và hệ thống máy tính.",
          requirements:
            "Bằng tốt nghiệp trung học phổ thông với nền tảng toán học vững chắc",
        },
        {
          name: "Quản trị Kinh doanh",
          duration: "4 năm",
          description:
            "Nghiên cứu các nguyên tắc và thực tiễn quản lý kinh doanh.",
          requirements: "Bằng tốt nghiệp trung học phổ thông với học lực tốt",
        },
      ],
    },
    {
      id: "masters",
      title: "Thạc Sĩ",
      icon: <FaUserGraduate className="text-2xl" />,
      programs: [
        {
          name: "Chương trình Thạc sĩ",
          duration: "2 năm",
          description:
            "Chương trình sau đại học cho kiến thức nâng cao và nghiên cứu.",
          requirements: "Bằng cử nhân trong lĩnh vực liên quan",
        },
      ],
    },
    {
      id: "doctorate",
      title: "Tiến Sĩ",
      icon: <FaUserGraduate className="text-2xl" />,
      programs: [
        {
          name: "Chương trình Tiến sĩ",
          duration: "3-5 năm",
          description:
            "Chương trình nghiên cứu dẫn đến bằng Ph.D. trong các lĩnh vực chuyên ngành.",
          requirements: "Bằng thạc sĩ trong lĩnh vực liên quan",
        },
      ],
    },
  ];

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredLevels = educationLevels
    .map((level) => ({
      ...level,
      programs: level.programs.filter(
        (program) =>
          program.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          program.description.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((level) => level.programs.length > 0);

  const toggleSection = (sectionId) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 font-bold text-gray-600 transition-all duration-300 hover:bg-gray-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-gray-400 active:bg-gray-300 mb-4"
            aria-label="Quay lại trang trước"
          >
            <FaArrowLeft className="transform transition-transform group-hover:-translate-x-1" />
            <span>Quay Lại</span>
          </button>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Chương trình
          </h1>

          <div className="relative max-w-xl mx-auto">
            <div className="relative">
              <input
                type="text"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Tìm kiếm chương trình..."
                value={searchQuery}
                onChange={handleSearch}
                aria-label="Tìm kiếm chương trình"
              />
              <FiSearch className="absolute right-3 top-3.5 text-gray-400 text-xl" />
            </div>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredLevels.map((level) => (
            <div
              key={level.id}
              className="bg-white rounded-xl shadow-md overflow-hidden transition-transform duration-300 hover:transform hover:scale-105"
            >
              <div
                className="p-6 cursor-pointer"
                onClick={() => toggleSection(level.id)}
                aria-expanded={expandedSection === level.id}
                role="button"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {level.icon}
                    <h2 className="text-xl font-semibold text-gray-900">
                      {level.title}
                    </h2>
                  </div>
                  {expandedSection === level.id ? (
                    <FiChevronUp className="text-gray-500" />
                  ) : (
                    <FiChevronDown className="text-gray-500" />
                  )}
                </div>
              </div>

              {expandedSection === level.id && (
                <div className="px-6 pb-6">
                  {level.programs.map((program, index) => (
                    <div
                      key={index}
                      className="mt-4 p-4 bg-gray-50 rounded-lg"
                      role="region"
                      aria-label={`Thông tin chương trình ${program.name}`}
                    >
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {program.name}
                      </h3>
                      <div className="text-sm text-gray-600 space-y-2">
                        <p>
                          <span className="font-medium">Thời gian:</span>{" "}
                          {program.duration}
                        </p>
                        <p>
                          <span className="font-medium">Mô tả:</span>{" "}
                          {program.description}
                        </p>
                        <p>
                          <span className="font-medium">Yêu cầu:</span>{" "}
                          {program.requirements}
                        </p>
                      </div>
                      <button
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                        aria-label={`Đăng ký chương trình ${program.name}`}
                      >
                        Đăng Ký
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeDaoTao;
