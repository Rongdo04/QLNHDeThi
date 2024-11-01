using System;
using System.Collections.Generic;

namespace QLNganHangDeThi.Models;

public partial class MonHoc
{
    public int MonHocId { get; set; }

    public string TenMonHoc { get; set; } = null!;

    public int? HeDtid { get; set; }

    public virtual ICollection<CauHoi> CauHois { get; set; } = new List<CauHoi>();

    public virtual HeDaoTao? HeDt { get; set; }

    public virtual ICollection<MauDeThi> MauDeThis { get; set; } = new List<MauDeThi>();
}
