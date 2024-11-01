import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DanhSach from "./components/DanhSach";
import LoginPage from "./pages/LoginPage/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import CauHoi from "./components/subcomponents/CauHoi";
import DeThi from "./components/subcomponents/DeThi";
import HeDaoTao from "./components/subcomponents/HeDaoTao";
import MonHoc from "./components/subcomponents/MonHoc";
import HinhThucThi from "./components/subcomponents/HinhThucThi";
import MucDoKho from "./components/subcomponents/MucDoKho";
import DefaultPage from "./pages/DefaultPage/DefaultPage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/cau-hoi" element={<CauHoi />} />
        <Route path="/de-thi" element={<DeThi />} />
        <Route path="/he-dao-tao" element={<HeDaoTao />} />
        <Route path="/hinh-thuc-thi" element={<HinhThucThi />} />
        <Route path="/mon-hoc" element={<MonHoc />} />
        <Route path="/muc-do-kho" element={<MucDoKho />} />

        {/* Bảo vệ route DanhSach */}
        <Route
          path="/danhsach"
          element={
            <ProtectedRoute>
              <DanhSach />
            </ProtectedRoute>
          }
        />

        {/* Route mặc định cho các đường dẫn không xác định */}
        <Route path="*" element={<LoginPage />} />
      </Routes>
    </Router>
  );
};

export default App;
