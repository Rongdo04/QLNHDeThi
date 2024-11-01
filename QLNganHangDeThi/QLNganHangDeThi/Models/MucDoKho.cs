using System;
using System.Collections.Generic;

namespace QLNganHangDeThi.Models;

public partial class MucDoKho
{
    public int MucDoId { get; set; }

    public string CapDo { get; set; } = null!;

    public string? MoTa { get; set; }

    public virtual ICollection<CauHoi> CauHois { get; set; } = new List<CauHoi>();
}
