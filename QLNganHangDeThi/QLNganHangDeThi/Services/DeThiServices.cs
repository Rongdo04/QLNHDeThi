using QLNganHangDeThi.Models;
using QLNganHangDeThi.Models.DTOs;
using QLNganHangDeThi.IServices;
using Microsoft.EntityFrameworkCore;

namespace QLNganHangDeThi.Services {
    public class DeThiServices : IDeThiServices {
        private readonly QuanLyDeThiContext _context;

        public DeThiServices(QuanLyDeThiContext context) {
            _context = context;
        }

        // Hiển thị danh sách đề thi với thông tin liên quan
        public List<DeThiDTOs> ShowDeThi() {
            var query = from dt in _context.DeThis
                        join md in _context.MauDeThis on dt.MauDeId equals md.MauDeId into mauDeGroup
                        from md in mauDeGroup.DefaultIfEmpty() // Left join
                        join mh in _context.MonHocs on md.MonHocId equals mh.MonHocId into monHocGroup
                        from mh in monHocGroup.DefaultIfEmpty() // Left join
                        join ht in _context.HeDaoTaos on mh.HeDtid equals ht.HeDtid into heDaoTaoGroup
                        from ht in heDaoTaoGroup.DefaultIfEmpty() // Left join
                        select new DeThiDTOs {
                            DeThiId = dt.DeThiId,  // Thêm DeThiId vào DTO
                            NgayThi = dt.NgayThi,
                            TenLop = dt.TenLop,
                            TenMonHoc = mh.TenMonHoc,
                            ThoiGianLamBai = md.ThoiGianLamBai,
                            TenHeDaoTao = ht.TenHeDt
                        };

            return query.ToList();
        }

        // Lấy đề thi theo ID
        public DeThiDTOs? GetDeThiById(int deThiId) {
            var deThi = _context.DeThis.FirstOrDefault(x => x.DeThiId == deThiId);
            if (deThi == null) return null;

            var mauDe = _context.MauDeThis.FirstOrDefault(m => m.MauDeId == deThi.MauDeId);
            var monHoc = mauDe != null ? _context.MonHocs.FirstOrDefault(mh => mh.MonHocId == mauDe.MonHocId) : null;

            return new DeThiDTOs {
                DeThiId = deThi.DeThiId,
                NgayThi = deThi.NgayThi,
                TenLop = deThi.TenLop,
                TenMonHoc = monHoc?.TenMonHoc,
                TongSoCau = mauDe?.TongSoCau,
                ThoiGianLamBai = mauDe?.ThoiGianLamBai,
                TenHeDaoTao = monHoc?.HeDtid != null ? _context.HeDaoTaos.FirstOrDefault(ht => ht.HeDtid == monHoc.HeDtid)?.TenHeDt : null
            };
        }

        // Thêm đề thi mới
        public string ThemDeThi(DeThiDTOs deThiDTO) {
            try {
                // Kiểm tra xem đề thi đã tồn tại chưa dựa trên ID
                var deThiTonTai = _context.DeThis.FirstOrDefault(x => x.DeThiId == deThiDTO.DeThiId);
                if (deThiTonTai != null) {
                    return "Đề thi đã tồn tại";
                }

                // Kiểm tra xem môn học có tồn tại không
                var monHocTonTai = _context.MonHocs.FirstOrDefault(x => x.TenMonHoc == deThiDTO.TenMonHoc);
                if (monHocTonTai == null) {
                    return "Thông tin môn học không hợp lệ";
                }

                // Kiểm tra xem mẫu đề thi có tồn tại không
                var mauDeTonTai = _context.MauDeThis.FirstOrDefault(x => x.MonHocId == monHocTonTai.MonHocId);
                if (mauDeTonTai == null) {
                    return "Thông tin mẫu đề không hợp lệ";
                }

                // Tạo đối tượng DeThi mới
                var deThi = new DeThi {
                    NgayThi = deThiDTO.NgayThi,
                    TenLop = deThiDTO.TenLop,
                    MauDeId = mauDeTonTai.MauDeId,
                    NgayTaoDe = DateTime.Now, // Hoặc bạn có thể sử dụng giá trị nào khác nếu cần
                };
                _context.DeThis.Add(deThi);
                _context.SaveChanges();

                return "Thêm đề thi thành công";
            } catch (Exception ex) {
                return $"Lỗi khi thêm đề thi: {ex.Message}";
            }
        }


        // Cập nhật đề thi
        public string SuaDeThi(DeThiDTOs deThiDTO) {
            try {
                // Tìm đề thi cần sửa theo ID
                var deThiCanSua = _context.DeThis.FirstOrDefault(x => x.DeThiId == deThiDTO.DeThiId);
                if (deThiCanSua == null) {
                    return "Không tìm thấy đề thi cần sửa";
                }

                // Kiểm tra thông tin MauDeThi và cập nhật nếu cần
                var mauDeTonTai = _context.MauDeThis.FirstOrDefault(x => x.MonHoc.TenMonHoc == deThiDTO.TenMonHoc);
                if (mauDeTonTai == null) {
                    return "Thông tin mẫu đề hoặc môn học không hợp lệ";
                }

                // Cập nhật thông tin đề thi
                deThiCanSua.NgayThi = deThiDTO.NgayThi;
                deThiCanSua.TenLop = deThiDTO.TenLop;
                deThiCanSua.MauDeId = mauDeTonTai.MauDeId;

                _context.SaveChanges();
                return "Cập nhật đề thi thành công";
            } catch (Exception ex) {
                return $"Lỗi khi cập nhật đề thi: {ex.Message}";
            }
        }

        // Xóa đề thi
        public string XoaDeThi(int deThiId) {
            try {
                var deThiCanXoa = _context.DeThis.FirstOrDefault(x => x.DeThiId == deThiId);
                if (deThiCanXoa == null) {
                    return "Không tìm thấy đề thi cần xóa";
                }
                _context.DeThis.Remove(deThiCanXoa);
                _context.SaveChanges();
                return "Xóa đề thi thành công";
            } catch (Exception ex) {
                return $"Lỗi khi xóa đề thi: {ex.Message}";
            }
        }

        DeThi? IDeThiServices.GetDeThiById(int deThiId) {
            throw new NotImplementedException();
        }

        public List<DeThi> TimKiemDeThi(DateTime? ngayThi, string? tenLop = null, string? tenMonHoc = null) {
            throw new NotImplementedException();
        }

        // Tìm kiếm đề thi
        /* public List<DeThiDTOs> TimKiemDeThi(DateTime? ngayThi, string? tenLop = null, string? tenMonHoc = null) {
             var query = _context.DeThis.AsQueryable();

             if (ngayThi.HasValue) {
                 query = query.Where(x => x.NgayThi.Date == ngayThi.Value.Date);
             }

             if (!string.IsNullOrEmpty(tenLop)) {
                 query = query.Where(x => x.TenLop.Contains(tenLop));
             }

             if (!string.IsNullOrEmpty(tenMonHoc)) {
                 query = query.Include(d => d.MauDeId)
                              .ThenInclude(m => m.MonHoc)
                              .Where(x => x.MauDeId != null && x.MauDe.MonHoc.TenMonHoc.Contains(tenMonHoc));
             }

             return query.Select(dt => new DeThiDTOs {
                 DeThiId = dt.DeThiId,
                 NgayThi = dt.NgayThi,
                 TenLop = dt.TenLop,
                 TenMonHoc = dt.MauDe.MonHoc.TenMonHoc,
                 TongSoCau = dt.MauDe.TongSoCau,
                 ThoiGianLamBai = dt.MauDe.ThoiGianLamBai
             }).ToList();
         }*/
    }
}
