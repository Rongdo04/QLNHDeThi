using QLNganHangDeThi.Models;
using QLNganHangDeThi.Models.DTOs;
using QLNganHangDeThi.IServices;
using Microsoft.EntityFrameworkCore;

namespace QLNganHangDeThi.Services {
    public class CauHoiServices : ICauHoiServices {
        private readonly QuanLyDeThiContext _context;

        public CauHoiServices() {
            _context = new QuanLyDeThiContext();
        }

        // Hiển thị danh sách câu hỏi với thông tin liên quan
        public List<CauHoiDTOs> ShowCauHoi() {
            var query = from ch in _context.CauHois
                        join mh in _context.MonHocs on ch.MonHocId equals mh.MonHocId into monHocGroup
                        from mh in monHocGroup.DefaultIfEmpty() // Left join
                        join md in _context.MucDoKhos on ch.MucDoId equals md.MucDoId into mucDoGroup
                        from md in mucDoGroup.DefaultIfEmpty() // Left join
                        join lc in _context.LoaiCauHois on ch.LoaiId equals lc.LoaiId into loaiGroup
                        from lc in loaiGroup.DefaultIfEmpty() // Left join
                        join dt in _context.DeThis on ch.DeThiId equals dt.DeThiId into deThiGroup
                        from dt in deThiGroup.DefaultIfEmpty() // Left join for DeThi
                        select new CauHoiDTOs {
                            CauHoiId = ch.CauHoiId,
                            NoiDung = ch.NoiDung,
                            MonHoc = mh.TenMonHoc,
                            MucDo = md.CapDo,
                            Loai = lc.TenLoai,
                            DeThi = dt.DeThiId, 
                            DapAn = ch.DapAn,
                            Diem = ch.Diem
                        };

            return query.ToList();


        }

        // Lấy câu hỏi theo ID
        public CauHoi? GetCauHoiById(int cauHoiId) {
            var cauHoiTonTai = _context.CauHois.FirstOrDefault(x => x.CauHoiId == cauHoiId);
            return cauHoiTonTai;
        }

        // Thêm câu hỏi mới
        public string ThemCauHoi(CauHoiDTOs chDto) {
            try {
                // Check if the question already exists based on the given ID
                var cauHoiTonTai = _context.CauHois.FirstOrDefault(x => x.CauHoiId == chDto.CauHoiId);
                if (cauHoiTonTai != null) {
                    return "Câu hỏi đã tồn tại";
                }

                // Validate Loai, MonHoc, and MucDo existence in the database
                var loaiTonTai = _context.LoaiCauHois.FirstOrDefault(x => x.TenLoai == chDto.Loai);
                var monHocTonTai = _context.MonHocs.FirstOrDefault(x => x.TenMonHoc == chDto.MonHoc);
                var mucDoTonTai = _context.MucDoKhos.FirstOrDefault(x => x.CapDo == chDto.MucDo);
                var deThiTonTai = _context.DeThis.FirstOrDefault(x => x.DeThiId == chDto.DeThi);


                if (loaiTonTai == null || monHocTonTai == null || mucDoTonTai == null || deThiTonTai == null) {
                    return "Thông tin loại câu hỏi, môn học hoặc mức độ không hợp lệ";
                }

                // Map CauHoiDTOs properties to the CauHoi entity
                var cauHoi = new CauHoi {
                    CauHoiId = chDto.CauHoiId,
                    NoiDung = chDto.NoiDung,
                    MonHocId = monHocTonTai.MonHocId,
                    MucDoId = mucDoTonTai.MucDoId,
                    LoaiId = loaiTonTai.LoaiId,
                    DeThiId = deThiTonTai.DeThiId,
                    DapAn = chDto.DapAn,
                    Diem = chDto.Diem
                };

                // Add the new question to the database
                _context.CauHois.Add(cauHoi);
                _context.SaveChanges();

                return "Thêm câu hỏi thành công";
            } catch (Exception ex) {
                return $"Lỗi khi thêm câu hỏi: {ex.Message}";
            }
        }


        // Cập nhật câu hỏi
        public string SuaCauHoi(CauHoiDTOs chDTO) {
            try {
                // Find the question to update by ID
                var cauHoiCanSua = _context.CauHois.FirstOrDefault(x => x.CauHoiId == chDTO.CauHoiId);
                if (cauHoiCanSua == null) {
                    return "Không tìm thấy câu hỏi cần sửa";
                }

                // Get IDs based on names provided in the DTO
                var loaiTonTai = _context.LoaiCauHois.FirstOrDefault(x => x.TenLoai == chDTO.Loai);
                var monHocTonTai = _context.MonHocs.FirstOrDefault(x => x.TenMonHoc == chDTO.MonHoc);
                var mucDoTonTai = _context.MucDoKhos.FirstOrDefault(x => x.CapDo == chDTO.MucDo);
                var deThiTonTai = _context.DeThis.FirstOrDefault(x => x.DeThiId == chDTO.DeThi);


                // Check if all required data exists
                if (loaiTonTai == null || monHocTonTai == null || mucDoTonTai == null || deThiTonTai ==null) {
                    return "Thông tin loại câu hỏi, môn học hoặc mức độ không hợp lệ";
                }

                // Update the information
                cauHoiCanSua.NoiDung = chDTO.NoiDung;
                cauHoiCanSua.DapAn = chDTO.DapAn;
                cauHoiCanSua.Diem = chDTO.Diem;
                cauHoiCanSua.LoaiId = loaiTonTai.LoaiId;
                cauHoiCanSua.MonHocId = monHocTonTai.MonHocId;
                cauHoiCanSua.MucDoId = mucDoTonTai.MucDoId;
                cauHoiCanSua.MucDoId = mucDoTonTai.MucDoId;
                cauHoiCanSua.DeThiId = deThiTonTai.DeThiId;

                _context.SaveChanges();
                return "Cập nhật câu hỏi thành công";
            } catch (Exception ex) {
                return $"Lỗi khi cập nhật câu hỏi: {ex.Message}";
            }
        }


        // Xóa câu hỏi
        public string XoaCauHoi(int cauHoiId) {
            try {
                var cauHoiCanXoa = _context.CauHois.FirstOrDefault(x => x.CauHoiId == cauHoiId);
                if (cauHoiCanXoa == null) {
                    return "Không tìm thấy câu hỏi cần xóa";
                }
                _context.CauHois.Remove(cauHoiCanXoa);
                _context.SaveChanges();
                return "Xóa câu hỏi thành công";
            } catch (Exception ex) {
                return $"Lỗi khi xóa câu hỏi: {ex.Message}";
            }
        }

        // Tìm kiếm câu hỏi
        public List<CauHoi> TimKiemCauHoi(string tuKhoa, int? monHocId = null, int? mucDoId = null, int? loaiId = null) {
            var query = _context.CauHois
                .Include(c => c.MonHoc)
                .Include(c => c.MucDo)
                .Include(c => c.Loai)
                .AsQueryable();

            if (!string.IsNullOrEmpty(tuKhoa)) {
                query = query.Where(x => x.NoiDung.Contains(tuKhoa));
            }

            if (monHocId.HasValue) {
                query = query.Where(x => x.MonHocId == monHocId);
            }

            if (mucDoId.HasValue) {
                query = query.Where(x => x.MucDoId == mucDoId);
            }

            if (loaiId.HasValue) {
                query = query.Where(x => x.LoaiId == loaiId);
            }

            return query.ToList();
        }
    }
}