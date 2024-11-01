using Microsoft.AspNetCore.Mvc;
using QLNganHangDeThi.IServices;
using QLNganHangDeThi.Models;
using QLNganHangDeThi.Models.DTOs;
using QLNganHangDeThi.Services;

using System;

namespace QLNganHangDeThi.Controllers {
    [Route("api/[controller]")]
    [ApiController]
    public class DeThiController : ControllerBase {
        private readonly IDeThiServices _deThiService;
        private readonly QuanLyDeThiContext _context;
        public DeThiController(QuanLyDeThiContext context) {
            _context = context;
            _deThiService = new DeThiServices(context);
        }

        // GET: api/DeThi
        [HttpGet("DSDeThi")]
        public ActionResult<IEnumerable<DeThiDTOs>> GetAllDeThis() {
            var deThis = _deThiService.ShowDeThi();
            return Ok(deThis);
        }

        // GET: api/DeThi/{id}
        [HttpGet("{id}")]
        public ActionResult<DeThiDTOs> GetDeThiById(int id) {
            var deThi = _deThiService.GetDeThiById(id);
            if (deThi == null) return NotFound("Đề thi không tồn tại.");
            return Ok(deThi);
        }

        // POST: api/DeThi
        [HttpPost]
        public ActionResult<string> CreateDeThi([FromBody] DeThiDTOs deThiDTO) {
            var result = _deThiService.ThemDeThi(deThiDTO);
            if (result.Contains("thành công")) return Ok(result);
            return BadRequest(result);
        }

        // PUT: api/DeThi/{id}
        [HttpPut("{id}")]
        public ActionResult<string> UpdateDeThi(int id, [FromBody] DeThiDTOs deThiDTO) {
            deThiDTO.DeThiId = id; // Đảm bảo ID được cập nhật đúng
            var result = _deThiService.SuaDeThi(deThiDTO);
            if (result.Contains("thành công")) return Ok(result);
            return NotFound(result);
        }

        // DELETE: api/DeThi/{id}
        [HttpDelete("{id}")]
        public ActionResult<string> DeleteDeThi(int id) {
            var result = _deThiService.XoaDeThi(id);
            if (result.Contains("thành công")) return Ok(result);
            return NotFound(result);
        }

        // GET: api/DeThi/search
        [HttpGet("search")]
        public ActionResult<IEnumerable<DeThiDTOs>> SearchDeThi(DateTime? ngayThi, string? tenLop = null, string? tenMonHoc = null) {
            var results = _deThiService.TimKiemDeThi(ngayThi, tenLop, tenMonHoc);
            return Ok(results);
        }
    }
}
