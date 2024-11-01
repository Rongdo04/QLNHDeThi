namespace QLNganHangDeThi.Models.DTOs {
    public class CauHoiDTOs {
        public int CauHoiId { get; set; }
        public string NoiDung { get; set; }
        public string? MonHoc { get; set; } 
        public string? MucDo { get; set; }  
        public string? Loai { get; set; } 
        public int? DeThi { get; set; }    
       
        public string? DapAn { get; set; }
        public decimal? Diem { get; set; }
    }
}
