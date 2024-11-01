using System;
using System.Collections.Generic;

namespace QLNganHangDeThi.Models;

public partial class MauDeThi
{
    public int MauDeId { get; set; }

    public int? MonHocId { get; set; }

    public int? TongSoCau { get; set; }

    public int? ThoiGianLamBai { get; set; }

    public DateTime? NgayTao { get; set; }

    public virtual ICollection<DeThi> DeThis { get; set; } = new List<DeThi>();

    public virtual MonHoc? MonHoc { get; set; }
}
