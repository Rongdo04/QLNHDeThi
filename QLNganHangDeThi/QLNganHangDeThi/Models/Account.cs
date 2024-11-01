using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace QLNganHangDeThi.Models;

public partial class Account
{
    [Key]
    public int AccountsId { get; set; }

    public string? UserName { get; set; }

    public string? Avatar { get; set; }

    public string? Email { get; set; }

    public string Password { get; set; } = null!;

    public string? Status { get; set; }

    public int DecentralizationsId { get; set; }

    public string? ResetPasswordToken { get; set; }

    public DateTime? ResetPasswordTokenExpiry { get; set; }

    public DateTime? CreateAt { get; set; }

    public DateTime? UpdateAt { get; set; }

    public virtual Decentralization Decentralizations { get; set; } = null!;
}
