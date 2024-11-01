using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Security.Claims;
using System.Security.Cryptography;
using QLNganHangDeThi.Models;
using QLNganHangDeThi.Services;
using QLNganHangDeThi.IServices;
using QLNganHangDeThi.Constants;
using Microsoft.AspNetCore.Identity;
using System.Net.Mail;
using MimeKit;
using MailKit.Security;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase {

    IAuthServices services = new AuthServices
        ();

    private readonly IConfiguration _config;
    private readonly QuanLyDeThiContext _context;
    
    public AuthController(IConfiguration config) {
        _config = config;
        _context = new QuanLyDeThiContext();


    }
    [HttpPost("forgot-password")]
    public IActionResult ForgotPassword([FromBody] ForgotPasswordRequest request) {
        var user = _context.Account.FirstOrDefault(x => x.Email == request.email);
        if (user == null) {
            return BadRequest("User not found");
        }
        user.ResetPasswordToken = CreateToken(request.email, true);
        user.ResetPasswordTokenExpiry = DateTime.Now.AddHours(1);
        var smtpClient = new SmtpClient("smtp.gmail.com") {
            Port = 587,
            Credentials = new NetworkCredential("danghienxk@gmail.com", "ajrz dtdl kmkm hxvn"),
            EnableSsl = true,
            UseDefaultCredentials = false
        };

        var mailMessage = new MailMessage {
            From = new MailAddress(request.email),
            Subject = "Password Reset",
            IsBodyHtml = true,
            Body = $"<a href=\"http://127.0.0.1:5500/reset-password.html?token={user.ResetPasswordToken}\">Reset Password</a>",
        };
        mailMessage.To.Add(request.email);
        smtpClient.Send(mailMessage);
        _context.SaveChanges();
        return Ok("You may reset password now");
    }
    [HttpPost("reset-password")]
    public IActionResult ResetPassword([FromBody] ResetPasswordRequest req) {
        var user = _context.Account.FirstOrDefault(x => x.ResetPasswordToken == req.Token);
        if (user == null || user.ResetPasswordTokenExpiry < DateTime.Now) {
            return BadRequest("Invalid Token");
        }


        string newPassword = BCrypt.Net.BCrypt.HashPassword(req.Password);
        user.Password = newPassword;
        user.ResetPasswordToken = null;
        user.ResetPasswordTokenExpiry = null;
        _context.SaveChanges();
        return Ok("Password successfully reset");
    }
    [HttpPost("Register")]
    public IActionResult Register([FromBody] RegisterRequest acc) {
        // Xử lý thông tin đăng ký tài khoản ở đây
        var registrationResult = services.Register(acc.userName, acc.password, acc.confirmPassword);

        if (registrationResult == ErorrType.ThanhCong) {
            return Ok();
        } else if (registrationResult == ErorrType.TaiKhoanDaTonTai) {
            return BadRequest("TK da ton tai");
        } else {
            return BadRequest();

        }
    }
   
    [HttpPut("ChangePassword")]
    public IActionResult UpdatePass([FromBody] ChangePasswordRequest changePasswordRequest) {
        var decent = _context.Decentralization.Where(x => x.AuthorityName.ToLower() == "user").Any();
        if (decent) {
            var update = services.ChangePassWord(changePasswordRequest.Username, changePasswordRequest.OldPassword, changePasswordRequest.NewPassword);
            if (update == ErorrType.ThanhCong) {
                return Ok(update);
            } else {
                return BadRequest(update);
            }
        }
        return BadRequest();

    }
    
    [HttpGet("DS")]
    public IActionResult GetPasswords() {
        var accounts = services.DSAccounts();
        return Ok(accounts);
    }
    [HttpPost("login")]
    public ActionResult<object> Authenticate([FromBody] Account acc) {
        var loginResponse = new LoginResponse { };
        var login = services.Login(acc);
        var roles = _context.Decentralization.Where(x => x.DecentralizationsId == acc.DecentralizationsId).Select(x => x.AuthorityName);
        foreach (var role in roles) {
            loginResponse.Role = role;
        }


        // if credentials are valid
        if (login == ErorrType.AdminLogin) {

            string token = CreateToken(acc.UserName);

            loginResponse.Token = token;
            loginResponse.responseMsg = new HttpResponseMessage() {
                StatusCode = HttpStatusCode.OK
            };
            return Ok(loginResponse);
        } else if (login == ErorrType.UserLogin) {
            var status = _context.Account.FirstOrDefault(x => x.UserName == acc.UserName);
            if (status.Status != null) {
                loginResponse.status = status.Status;

            }

            string token = CreateToken(acc.UserName);

            loginResponse.Token = token;
            loginResponse.responseMsg = new HttpResponseMessage() {
                StatusCode = HttpStatusCode.OK
            };
            return Ok(loginResponse);
        } else {
            return Unauthorized("fail to login");
        }
    }
    /*[HttpPost("verifyToken")]
    public ActionResult VerifyToken([FromBody] string token) {
        try {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = System.Text.Encoding.UTF8.GetBytes(_config.GetSection("AppSettings:Token").Value);

            var tokenValidationParameters = new TokenValidationParameters {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuer = false,
                ValidateAudience = false,
                ValidateLifetime = true,
                ClockSkew = TimeSpan.Zero
            };

            var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out var validatedToken);

            // Extract the username claim from the token
            var usernameClaim = principal.Claims.FirstOrDefault(x => x.Type == "username");
            if (usernameClaim == null) {
                return BadRequest(new {
                    IsValid = false,
                    Message = "Token không hợp lệ"
                });
            }

            // Fetch the user account from the database using the UserName from the token
            var user = _context.Account.FirstOrDefault(x => x.UserName == usernameClaim.Value);
            if (user == null) {
                return BadRequest(new {
                    IsValid = false,
                    Message = "Người dùng không tồn tại"
                });
            }

            // Fetch the user's role from Decentralization table
            var role = _context.Decentralization
                .Where(x => x.DecentralizationsId == user.DecentralizationsId)
                .Select(x => x.AuthorityName)
                .FirstOrDefault();

            // Return success response with user details
            return Ok(new {
                IsValid = true,
                Message = "Token hợp lệ",
                User = new {
                    Username = user.UserName,
                    Role = role,
                    Status = user.Status,
                    DecentralizationId = user.DecentralizationsId
                }
            });
        } catch (SecurityTokenExpiredException) {
            return BadRequest(new {
                IsValid = false,
                Message = "Token đã hết hạn"
            });
        } catch (Exception ex) {
            return BadRequest(new {
                IsValid = false,
                Message = $"Lỗi xác thực token: {ex.Message}"
            });
        }
    }*/


    [HttpPost]
    private string CreateToken(string username, bool isResetPasswordToken = false) {
        List<Claim> claims = new()
            {
            //list of Claims - we only checking username - more claims can be added.
            new Claim("username", Convert.ToString(username)),

        };
        if (isResetPasswordToken) {
            claims.Add(new Claim("resetPasswordToken", "true"));
        }
        var key = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(_config.GetSection("AppSettings:Token").Value));
        var cred = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);
        var token = new JwtSecurityToken(
            claims: claims,
            expires: DateTime.Now.AddHours(2),
            signingCredentials: cred
        );
        var jwt = new JwtSecurityTokenHandler().WriteToken(token);

        return jwt;
    }


}
