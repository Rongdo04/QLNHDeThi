import { useEffect, useState } from "react";
import {
  FaSpinner,
  FaPrint,
  FaTimes,
  FaArrowLeft,
  FaPlus,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import deThiApi from "../../api/deThiApi";
import tasksApi from "../../api/tasksApi";

const DeThi = () => {
  const navigate = useNavigate();

  const [selectedExam, setSelectedExam] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paperSize, setPaperSize] = useState("A4");
  const [showModal, setShowModal] = useState(false);
  const [showAddExamForm, setShowAddExamForm] = useState(false); // State for add exam form
  const [examTemplates, setExamTemplates] = useState([]);
  const [examQuestions, setExamQuestions] = useState([]);
  const [allQuestions, setAllQuestions] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [examDetails, setExamDetails] = useState({
    tenMonHoc: "",
    tenLop: "",
    thoiGianLamBai: "",
    tenHeDaoTao: "",
  });

  useEffect(() => {
    const fetchExams = async () => {
      setLoading(true);
      try {
        const response = await deThiApi.getAllDeThi(); // Fetch exams
        setExamTemplates(response);
      } catch (error) {
        console.error("Failed to fetch exams:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchQuestions = async () => {
      setLoading(true);
      try {
        const response = await tasksApi.getAll(); // Fetch all questions
        setAllQuestions(response); // Store all questions
      } catch (error) {
        console.error("Failed to fetch questions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
    fetchQuestions(); // Fetch questions on component mount
  }, []);

  const handleAddExam = async () => {
    // Logic to add a new exam
    try {
      await deThiApi.add(examDetails);
      // Refresh exam list
      const response = await deThiApi.getAllDeThi();
      setExamTemplates(response);
      closeModal();
    } catch (error) {
      console.error("Failed to add exam:", error);
    }
  };

  const handleUpdateExam = async () => {
    // Logic to update the exam
    try {
      await deThiApi.updateName(selectedExam.deThiId, examDetails);
      // Refresh exam list
      const response = await deThiApi.getAllDeThi();
      setExamTemplates(response);
      closeModal();
    } catch (error) {
      console.error("Failed to update exam:", error);
    }
  };

  const handleDeleteExam = async (examId) => {
    // Logic to delete the exam
    if (window.confirm("Are you sure you want to delete this exam?")) {
      try {
        await deThiApi.delete(examId);
        // Refresh exam list
        const response = await deThiApi.getAllDeThi();
        setExamTemplates(response);
      } catch (error) {
        console.error("Failed to delete exam:", error);
      }
    }
  };

  const handleExamClick = async (exam) => {
    setLoading(true);
    setSelectedExam(exam);
    setShowModal(true);

    // Filter questions for the selected exam
    const filteredQuestions = allQuestions.filter(
      (question) => question.deThi === exam.deThiId // Match question's deThi with selected exam's id
    );
    setExamQuestions(filteredQuestions); // Set filtered questions

    setLoading(false);
  };

  const handlePrint = () => {
    window.print();
  };

  const closeModal = () => {
    setShowModal(false);
    setShowAddExamForm(false); // Close add exam form
    setSelectedExam(null);
    setExamQuestions([]);
  };

  const openEditModal = (exam) => {
    setExamDetails(exam);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleAddExamButtonClick = () => {
    setShowAddExamForm(true); // Show add exam form
    setExamDetails({
      // Reset form fields
      tenMonHoc: "",
      tenLop: "",
      thoiGianLamBai: "",
      tenHeDaoTao: "",
    });
    setShowModal(true); // Open modal
  };
  const handleEditClick = (exam, e) => {
    e.stopPropagation();
    setIsEditing(true);
    setExamDetails({
      tenMonHoc: exam.tenMonHoc,
      tenLop: exam.tenLop,
      thoiGianLamBai: exam.thoiGianLamBai,
      tenHeDaoTao: exam.tenHeDaoTao,
    });
    setSelectedExam(exam);
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 font-bold text-gray-600 transition-all duration-300 hover:bg-gray-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-gray-400 active:bg-gray-300 mb-4"
          aria-label="Go back to previous page"
        >
          <FaArrowLeft className="transform transition-transform group-hover:-translate-x-1" />
          <span>Quay Lại</span>
        </button>
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Đề Thi</h1>
        <button
          onClick={handleAddExamButtonClick} // Use the new function
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors mb-4"
          aria-label="Add new exam"
        >
          <FaPlus />
          <span>Thêm Đề Thi</span>
        </button>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {examTemplates.map((exam) => (
            <div
              key={exam.deThiId}
              className="bg-white rounded-xl shadow-lg p-6 transition-transform duration-300 hover:scale-105 cursor-pointer"
              onClick={() => handleExamClick(exam)}
              role="button"
              tabIndex={0}
              aria-label={`View details of ${exam.tenMonHoc}`}
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Đề thi {exam.deThiId}
              </h2>
              <p className="text-gray-600">
                {exam.tenLop} - {exam.tenMonHoc}
              </p>
              <div className="flex justify-between mt-4">
                <button
                  onClick={(e) => handleEditClick(exam, e)}
                  className="text-blue-600 hover:underline"
                >
                  Sửa
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent modal from opening
                    handleDeleteExam(exam.deThiId);
                  }}
                  className="text-red-600 hover:underline"
                >
                  Xóa
                </button>
              </div>
            </div>
          ))}
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div
              className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              role="dialog"
              aria-modal="true"
            >
              {loading ? (
                <div className="flex items-center justify-center p-8">
                  <FaSpinner className="animate-spin text-4xl text-blue-600" />
                </div>
              ) : showAddExamForm ? ( // Check if the add exam form should be shown
                <div className="p-6 ">
                  <div className=" flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">
                      Thêm Đề Thi
                    </h2>
                    <button
                      onClick={closeModal}
                      className="text-gray-500 hover:text-gray-700"
                      aria-label="Close modal"
                    >
                      <FaTimes size={24} />
                    </button>
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault(); // Prevent default form submission
                      handleAddExam();
                    }}
                  >
                    <div className="space-y-4">
                      <select
                        value={examDetails.tenMonHoc}
                        onChange={(e) =>
                          setExamDetails({
                            ...examDetails,
                            tenMonHoc: e.target.value,
                          })
                        }
                        className="border p-2 rounded-lg w-full"
                        required
                      >
                        <option value="" disabled hidden>
                          Chọn Môn Học
                        </option>
                        <option value="Lập trình cơ bản">
                          Lập trình cơ bản
                        </option>
                        <option value="Cơ sở dữ liệu">Cơ sở dữ liệu</option>
                        <option value="Mạng máy tính">Mạng máy tính</option>
                        <option value="Kỹ thuật lập trình">
                          Kỹ thuật lập trình
                        </option>
                        <option value="Toán học">Toán học</option>
                        <option value="Vật lý">Vật lý</option>
                        <option value="Hóa học">Hóa học</option>
                        <option value="Sinh học">Sinh học</option>
                        <option value="Ngữ văn">Ngữ văn</option>
                        <option value="Địa lý">Địa lý</option>
                        <option value="Lịch sử">Lịch sử</option>
                        <option value="Tin học">Tin học</option>
                        <option value="Tiếng Anh">Tiếng Anh</option>
                        <option value="Giáo dục công dân">
                          Giáo dục công dân
                        </option>
                      </select>

                      <select
                        value={examDetails.tenLop}
                        onChange={(e) =>
                          setExamDetails({
                            ...examDetails,
                            tenLop: e.target.value,
                          })
                        }
                        className="border p-2 rounded-lg w-full"
                        required
                      >
                        <option value="" disabled hidden>
                          Chọn Lớp
                        </option>
                        <option value="Lớp A1">Lớp A1</option>
                        <option value="Lớp B1">Lớp B1</option>
                        <option value="Lớp C2">Lớp C2</option>
                        <option value="Lớp D3">Lớp D3</option>
                        <option value="Lớp E4">Lớp E4</option>
                        <option value="Lớp F5">Lớp F5</option>
                        <option value="Lớp G6">Lớp G6</option>
                        <option value="Lớp H7">Lớp H7</option>
                        <option value="Lớp I8">Lớp I8</option>
                      </select>

                      <select
                        value={examDetails.thoiGianLamBai}
                        onChange={(e) =>
                          setExamDetails({
                            ...examDetails,
                            thoiGianLamBai: e.target.value,
                          })
                        }
                        className="border p-2 rounded-lg w-full"
                        required
                      >
                        <option value="" disabled hidden>
                          Chọn Thời gian làm bài
                        </option>
                        <option value="30">30 phút</option>
                        <option value="45">45 phút</option>
                        <option value="60">60 phút</option>
                        <option value="90">90 phút</option>
                        <option value="120">120 phút</option>
                        <option value="150">150 phút</option>
                        <option value="180">180 phút</option>
                      </select>
                      <select
                        value={examDetails.tenHeDaoTao}
                        onChange={(e) =>
                          setExamDetails({
                            ...examDetails,
                            tenHeDaoTao: e.target.value,
                          })
                        }
                        className="border p-2 rounded-lg w-full"
                        required
                      >
                        <option value="" disabled hidden>
                          Chọn Hệ Đào Tạo
                        </option>
                        <option value="Đại học">Đại học</option>
                        <option value="Vấn Đáp">Cao đẳng</option>
                        <option value="Liên thông">Liên thông</option>
                        <option value="Cử nhân">Cử nhân</option>
                        <option value="Thạc sĩ">Thạc sĩ</option>
                        <option value="Tiến sĩ">Tiến sĩ</option>
                      </select>

                      <button
                        onClick={handleAddExam}
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Thêm Đề Thi
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                      {selectedExam?.tenMonHoc}
                    </h2>
                    <button
                      onClick={closeModal}
                      className="text-gray-500 hover:text-gray-700"
                      aria-label="Close modal"
                    >
                      <FaTimes size={24} />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="font-semibold">Lớp:</p>
                        <p>{selectedExam?.tenLop}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="font-semibold">Môn Học:</p>
                        <p>{selectedExam?.tenMonHoc}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="font-semibold">Thời gian:</p>
                        <p>{selectedExam?.thoiGianLamBai}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="font-semibold">Hệ Đào Tạo: </p>
                        <p>{selectedExam?.tenHeDaoTao}</p>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="font-semibold mb-2">Sample Questions:</p>
                      <ul className="list-disc pl-4 space-y-2">
                        {examQuestions.map((question) => (
                          <li key={question.cauHoiId}>{question.noiDung}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex items-center space-x-4 mt-6">
                      <select
                        value={paperSize}
                        onChange={(e) => setPaperSize(e.target.value)}
                        className="border rounded-lg px-4 py-2"
                        aria-label="Select paper size"
                      >
                        <option value="A4">A4 Size</option>
                        <option value="A5">A5 Size</option>
                      </select>

                      <button
                        onClick={handlePrint}
                        className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        aria-label="Print exam"
                      >
                        <FaPrint />
                        <span>Print</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeThi;
