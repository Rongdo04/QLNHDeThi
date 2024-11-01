using QLNganHangDeThi.Models;
using QLNganHangDeThi.Models.DTOs;

namespace QLNganHangDeThi.IServices {
    
        public interface IDeThiServices {
            // Hiển thị danh sách tất cả các đề thi
            public List<DeThiDTOs> ShowDeThi();

            // Lấy thông tin chi tiết của đề thi dựa trên ID
            DeThi? GetDeThiById(int deThiId);

        // Thêm đề thi mới
            public string ThemDeThi(DeThiDTOs deThiDTO);

            // Cập nhật thông tin đề thi
            string SuaDeThi(DeThiDTOs deThiDTO);

            // Xóa đề thi
            string XoaDeThi(int deThiId);

            // Tìm kiếm đề thi dựa trên các tiêu chí
            List<DeThi> TimKiemDeThi(DateTime? ngayThi, string? tenLop = null, string? tenMonHoc = null);
        }
    
}
