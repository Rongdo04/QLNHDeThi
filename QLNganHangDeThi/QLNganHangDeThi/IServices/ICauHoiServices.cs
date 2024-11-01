using QLNganHangDeThi.Models;
using QLNganHangDeThi.Models.DTOs;

namespace QLNganHangDeThi.IServices {
    interface ICauHoiServices {
        public List<CauHoiDTOs> ShowCauHoi();
        public CauHoi? GetCauHoiById(int cauHoiId);
        public string ThemCauHoi(CauHoiDTOs ch);
        string SuaCauHoi(CauHoiDTOs ch);
        string XoaCauHoi(int cauHoiId);
        List<CauHoi> TimKiemCauHoi(string tuKhoa, int? monHocId = null, int? mucDoId = null, int? loaiId = null);


    }
}
