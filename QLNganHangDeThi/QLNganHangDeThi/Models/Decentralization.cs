using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace QLNganHangDeThi.Models;

public partial class Decentralization
{
    [Key]
    public int DecentralizationsId { get; set; }

    public string AuthorityName { get; set; } = null!;

    public DateTime CreateAt { get; set; }

    public DateTime UpdateAt { get; set; }

    public virtual ICollection<Account> Accounts { get; set; } = new List<Account>();
}
