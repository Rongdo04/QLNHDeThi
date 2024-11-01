using System;
using System.Collections.Generic;

namespace QLNganHangDeThi.Models;

public partial class HeDaoTao
{
    public int HeDtid { get; set; }

    public string TenHeDt { get; set; } = null!;

    public virtual ICollection<MonHoc> MonHocs { get; set; } = new List<MonHoc>();
}
