using Microsoft.AspNetCore.Mvc;
using QLNganHangDeThi.Models;
using QLNganHangDeThi.IServices;
using QLNganHangDeThi.Services;
using QLNganHangDeThi.Models.DTOs;

namespace QLNganHangDeThi.Controllers {
    [Route("api/[controller]")]
    [ApiController]
    public class CauHoiController : ControllerBase {
        private readonly ICauHoiServices _cauHoiServices;
        private readonly QuanLyDeThiContext _context;
        public CauHoiController(QuanLyDeThiContext context) {
            _context = context;
            _cauHoiServices = new CauHoiServices();
        }

        // Lấy danh sách câu hỏi
        [HttpGet("DSCauHoi")]
        public IActionResult GetCauHoiList() {
            var res = _cauHoiServices.ShowCauHoi();
            return Ok(res);
        }

        // Lấy câu hỏi theo ID
        [HttpGet("GetCauHoi/{id}")]
        public IActionResult GetCauHoiById(int id) {
            var res = _cauHoiServices.GetCauHoiById(id);
            if (res == null) {
                return NotFound("Câu hỏi không tồn tại.");
            }
            return Ok(res);
        }

        // Thêm câu hỏi mới
        [HttpPost("ThemCauHoi")]
        public IActionResult AddCauHoi([FromBody] CauHoiDTOs ch) {
            var res = _cauHoiServices.ThemCauHoi(ch);
            if (res == "Thêm câu hỏi thành công") {
                return Ok(res);
            }
            return BadRequest(res);
        }

        // Cập nhật câu hỏi
        [HttpPut("SuaCauHoi")]
        public IActionResult UpdateCauHoi([FromBody] CauHoiDTOs ch) {
            var res = _cauHoiServices.SuaCauHoi(ch);
            if (res == "Cập nhật câu hỏi thành công") {
                return Ok(res);
            }
            return BadRequest(res);
        }

        // Xóa câu hỏi
        [HttpDelete("XoaCauHoi/{id}")]
        public IActionResult DeleteCauHoi(int id) {
            var res = _cauHoiServices.XoaCauHoi(id);
            if (res == "Xóa câu hỏi thành công") {
                return Ok(res);
            }
            return BadRequest(res);
        }

        // Tìm kiếm câu hỏi
        [HttpGet("TimKiemCauHoi")]
        public IActionResult SearchCauHoi(string tuKhoa, int? monHocId = null, int? mucDoId = null, int? loaiId = null) {
            var res = _cauHoiServices.TimKiemCauHoi(tuKhoa, monHocId, mucDoId, loaiId);
            return Ok(res);
        }
    }
}
