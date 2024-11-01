using System;
using System.Collections.Generic;

namespace QLNganHangDeThi.Models;

public partial class LoaiCauHoi
{
    public int LoaiId { get; set; }

    public string TenLoai { get; set; } = null!;

    public virtual ICollection<CauHoi> CauHois { get; set; } = new List<CauHoi>();
}
