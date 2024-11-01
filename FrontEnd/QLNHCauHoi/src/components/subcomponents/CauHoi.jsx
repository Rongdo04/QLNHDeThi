import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaSearch, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import tasksApi from "../../api/tasksApi";
import deThiApi from "../../api/deThiApi";

const CauHoi = () => {
  const [exams, setExams] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [newQuestion, setNewQuestion] = useState({
    noiDung: "",
    mucDo: "",
    monHoc: "",
    loai: "",
    dapAn: "",
    deThi: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  // Fetch data from API on component load
  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await deThiApi.getAllDeThi(); // Fetch the list of exams
        setExams(response);
      } catch (error) {
        console.error("Failed to fetch exams:", error);
      }
    };
    fetchExams();
  }, []);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await tasksApi.getAll();
        setQuestions(response); // Adjust this if data structure is different
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  const handleSearch = (e) => setSearchTerm(e.target.value);
  const handleChange = (field, value) => {
    setNewQuestion((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddQuestion = async () => {
    const newErrors = {};
    for (const field in newQuestion) {
      if (!newQuestion[field]) newErrors[field] = `Không được để trống`;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await tasksApi.add(newQuestion);

      if (response && response.cauHoiId) {
        // Optimistically update the questions list with the new question if response is as expected
        setQuestions((prev) => [...prev, response]);
      } else {
        // Fallback: re-fetch if response data does not match the expected format
        const updatedList = await tasksApi.getAll();
        setQuestions(updatedList);
      }

      setNewQuestion({
        noiDung: "",
        mucDo: "",
        monHoc: "",
        loai: "",
        dapAn: "",
        deThi: " ",
      });
      setErrors({});
    } catch (error) {
      console.error("Failed to add question:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const confirmed = window.confirm(
        "Bạn có chắc chắn muốn xóa câu hỏi này không?"
      );
      if (!confirmed) {
        return; // Nếu người dùng không xác nhận, dừng thực hiện
      }
      // Gọi API để xóa câu hỏi

      const response = await tasksApi.delete(id);

      // Kiểm tra phản hồi từ API
      if (response && response.message) {
        // Nếu có thông điệp từ API, hiển thị cho người dùng
        alert(response.message); // Hoặc sử dụng một phương thức hiển thị khác
      }

      // Cập nhật trạng thái danh sách câu hỏi sau khi xóa
      setQuestions((prevQuestions) =>
        prevQuestions.filter((q) => q.cauHoiId !== id)
      );
    } catch (error) {
      console.error("Failed to delete question:", error);
      alert("Không thể xóa câu hỏi trong đề thi"); // Hiển thị thông báo lỗi cho người dùng
    }
  };

  const handleEdit = (question) => {
    setEditingQuestion(question.cauHoiId);
    setNewQuestion(question);
  };

  const handleSaveEdit = async () => {
    const newErrors = {};
    for (const field in newQuestion) {
      if (!newQuestion[field]) newErrors[field] = `Không được để trống`;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      // Send updated question data to API
      const updatedQuestion = { ...newQuestion, id: editingQuestion };
      const response = await tasksApi.updateName(updatedQuestion);

      // Check if response contains the updated data
      if (response && response.cauHoiId) {
        // Update the questions list in state with the new question data
        setQuestions((prevQuestions) =>
          prevQuestions.map((q) =>
            q.cauHoiId === editingQuestion ? response : q
          )
        );
      } else {
        // Fallback: Re-fetch the entire list in case of unexpected response
        const updatedList = await tasksApi.getAll();
        setQuestions(updatedList);
      }

      // Clear editing state
      setEditingQuestion(null);
      setNewQuestion({
        noiDung: "",
        mucDo: "",
        monHoc: "",
        loai: "",
        dapAn: "",
        deThi: " ",
      });
      setErrors({});
    } catch (error) {
      console.error("Failed to update question:", error);
    }
  };

  const filteredQuestions = questions.filter((question) => {
    return question.noiDung.toLowerCase().includes(searchTerm.toLowerCase());
  });
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 font-bold text-gray-600 transition-all duration-300 hover:bg-gray-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-gray-400 active:bg-gray-300 mb-4"
          aria-label="Go back to previous page"
        >
          <FaArrowLeft className="transform transition-transform group-hover:-translate-x-1" />
          <span>Quay Lại</span>
        </button>
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Câu Hỏi</h1>

        {/* Thanh tìm kiếm */}
        <div className="mb-8 flex items-center">
          <input
            type="text"
            placeholder="Tìm kiếm câu hỏi..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 border-gray-300"
          />
          <FaSearch className="ml-2 text-gray-500" />
        </div>

        {/* Form thêm hoặc sửa câu hỏi */}
        <div className="bg-gray-100 p-4 rounded-lg mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            {editingQuestion ? "Sửa Câu Hỏi" : "Thêm Câu Hỏi Mới"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Môn học
              </label>
              <select
                value={newQuestion.monHoc}
                onChange={(e) => handleChange("monHoc", e.target.value)} // Ensure to update the correct property
                className={`w-full p-2 border rounded-lg ${
                  errors.subject ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="" disabled>
                  Chọn môn học
                </option>
                <option value="Lập trình cơ bản">Lập trình cơ bản</option>
                <option value="Cơ sở dữ liệu">Cơ sở dữ liệu</option>
                <option value="Mạng máy tính">Mạng máy tính</option>
                <option value="Kỹ thuật lập trình">Kỹ thuật lập trình</option>
                <option value="Toán học">Toán học</option>
                <option value="Vật lý">Vật lý</option>
                <option value="Hóa học">Hóa học</option>
                <option value="Sinh học">Sinh học</option>
                <option value="Ngữ văn">Ngữ văn</option>
                <option value="Địa lý">Địa lý</option>
                <option value="Lịch sử">Lịch sử</option>
                <option value="Tin học">Tin học</option>
                <option value="Tiếng Anh">Tiếng Anh</option>
                <option value="Giáo dục công dân">Giáo dục công dân</option>
              </select>
              {errors.monHoc && (
                <p className="text-red-500 text-sm">{errors.monHoc}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Loại Hình
              </label>
              <select
                value={newQuestion.loai}
                onChange={(e) => handleChange("loai", e.target.value)} // Ensure to update the correct property
                className={`w-full p-2 border rounded-lg ${
                  errors.loai ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="" disabled>
                  Chọn Loại Hình
                </option>
                <option value="Tự Luận">Tự Luận</option>
                <option value="Vấn Đáp">Vấn Đáp</option>
              </select>
              {errors.loai && (
                <p className="text-red-500 text-sm">{errors.loai}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Mức độ khó
              </label>

              <select
                value={newQuestion.mucDo}
                onChange={(e) => handleChange("mucDo", e.target.value)}
                className={`w-full p-2 border rounded-lg ${
                  errors.mucDo ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="" disabled>
                  Chọn mức độ khó
                </option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
              </select>

              {errors.mucDo && (
                <p className="text-red-500 text-sm">{errors.mucDo}</p>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Đề Thi
                </label>
                <select
                  value={newQuestion.deThi}
                  onChange={(e) => handleChange("deThi", e.target.value)}
                  className={`w-full p-2 border rounded-lg ${
                    errors.deThi ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="" disabled>
                    Chọn đề thi
                  </option>
                  {exams.map((q) => (
                    <option key={q.cauHoiId} value={q.deThiId}>
                      Đề {q.deThiId}
                    </option>
                  ))}
                </select>
                {errors.deThi && (
                  <p className="text-red-500 text-sm">{errors.deThi}</p>
                )}
              </div>

              {/* Other fields such as monHoc, loai, mucDo, noiDung, dapAn */}
              {/* Insert the remaining fields and components as you have them */}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Câu hỏi
              </label>
              <textarea
                value={newQuestion.noiDung}
                onChange={(e) => handleChange("noiDung", e.target.value)}
                className={`w-full p-2 border rounded-lg ${
                  errors.noiDung ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Nhập câu hỏi"
              />
              {errors.noiDung && (
                <p className="text-red-500 text-sm">{errors.noiDung}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Đáp án
              </label>
              <textarea
                value={newQuestion.dapAn}
                onChange={(e) => handleChange("dapAn", e.target.value)}
                className={`w-full p-2 border rounded-lg ${
                  errors.dapAn ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Nhập đáp án"
              />
              {errors.dapAn && (
                <p className="text-red-500 text-sm">{errors.dapAn}</p>
              )}
            </div>
          </div>

          <button
            onClick={editingQuestion ? handleSaveEdit : handleAddQuestion}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
          >
            {editingQuestion ? "Lưu Câu Hỏi" : "Thêm Câu Hỏi"}
          </button>
        </div>

        {/* Bảng câu hỏi */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Câu hỏi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Môn học
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Loại Hình
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mức độ khó
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Đáp án
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredQuestions.map((question) => (
                <tr key={question.cauHoiId}>
                  <td className="px-6 py-4">{question.noiDung}</td>
                  <td className="px-6 py-4">{question.monHoc}</td>
                  <td className="px-6 py-4">{question.loai}</td>
                  <td className="px-6 py-4">{question.mucDo}</td>
                  <td className="px-6 py-4">{question.dapAn}</td>
                  <td className="px-6 py-4 flex space-x-2">
                    <button
                      onClick={() => handleEdit(question)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(question.cauHoiId)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CauHoi;
