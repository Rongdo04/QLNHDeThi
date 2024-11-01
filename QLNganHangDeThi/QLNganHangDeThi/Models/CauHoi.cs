using System;
using System.Collections.Generic;

namespace QLNganHangDeThi.Models;

public partial class CauHoi
{
    public int CauHoiId { get; set; }

    public string NoiDung { get; set; } = null!;

    public int? MonHocId { get; set; }

    public int? MucDoId { get; set; }

    public int? LoaiId { get; set; }

    public string? DapAn { get; set; }

    public decimal? Diem { get; set; }

    public int? DeThiId { get; set; }

    public virtual DeThi? DeThi { get; set; }

    public virtual LoaiCauHoi? Loai { get; set; }

    public virtual MonHoc? MonHoc { get; set; }

    public virtual MucDoKho? MucDo { get; set; }
}
