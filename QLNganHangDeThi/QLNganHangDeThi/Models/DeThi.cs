using System;
using System.Collections.Generic;

namespace QLNganHangDeThi.Models;

public partial class DeThi
{
    public int DeThiId { get; set; }

    public int? MauDeId { get; set; }

    public DateTime? NgayThi { get; set; }

    public string? TenLop { get; set; }

    public DateTime? NgayTaoDe { get; set; }

    

    public virtual ICollection<CauHoi> CauHois { get; set; } = new List<CauHoi>();

    public virtual MauDeThi? MauDe { get; set; }
}
