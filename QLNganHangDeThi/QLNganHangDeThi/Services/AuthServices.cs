using QLNganHangDeThi.Constants;
using QLNganHangDeThi.IServices;
using QLNganHangDeThi.Models;
using Microsoft.AspNetCore.Identity;
namespace QLNganHangDeThi.Services {
    public class AuthServices : IAuthServices {
        private readonly QuanLyDeThiContext _context;
        private readonly IConfiguration _config;
        public AuthServices() {
            _context = new QuanLyDeThiContext();
           
        }

        public List<Account> DSAccounts() {
            var accounts = _context.Account.ToList();
            return accounts;
        }
        public ErorrType Login(Account acc) {
            // Check if username or password is empty
            if (string.IsNullOrEmpty(acc.UserName) || string.IsNullOrEmpty(acc.Password)) {
                return ErorrType.KhongDuocDeTrong;
            }

            // Fetch the user by username
            var user = _context.Account.FirstOrDefault(x => x.UserName == acc.UserName);

            // If no user is found, return failure
            if (user == null) {
                return ErorrType.ThatBai;
            }

            // Verify the password using BCrypt (catching potential errors)
            try {
                // If password doesn't match, return failure
                if (!BCrypt.Net.BCrypt.Verify(acc.Password, user.Password)) {
                    return ErorrType.ThatBai;
                }
            } catch (Exception ex) {
                // Log the exception for debugging (you can replace with proper logging)
                Console.WriteLine("Error during password verification: " + ex.Message);
                return ErorrType.ThatBai;
            }

            // Retrieve user roles
            var userRoles = _context.Decentralization
                                    .Where(ur => ur.DecentralizationsId == user.DecentralizationsId)
                                    .Select(ur => ur.AuthorityName.ToLower())
                                    .ToList();

            // Assign the decentralization ID to the account
            acc.DecentralizationsId = user.DecentralizationsId;

            // Check roles and return appropriate login type
            if (userRoles.Contains("admin")) {
                return ErorrType.AdminLogin;
            } else if (userRoles.Contains("user")) {
                return ErorrType.UserLogin;
            }

            // If no valid role is found, return failure
            return ErorrType.ThatBai;
        }

        public ErorrType ForgotPassword(string email) {
            return ErorrType.ThatBai;
        }

        public ErorrType Register(string userName, string passWord, string confirmPassword) {
            var taiKhoanHienTai = _context.Account.FirstOrDefault(x => x.UserName.Equals(userName));
            var roleUser = _context.Decentralization.FirstOrDefault(x => x.AuthorityName.ToLower().Equals("user"));
            if (passWord == confirmPassword) {
                if (taiKhoanHienTai != null) {
                    return ErorrType.TaiKhoanDaTonTai;
                } else {
                    string hashedPassword = BCrypt.Net.BCrypt.HashPassword(passWord);
                    Account acc = new Account() {

                        UserName = userName,
                        Password = hashedPassword,
                        CreateAt = DateTime.Now,

                    };
                    if (roleUser != null) {
                        acc.DecentralizationsId = roleUser.DecentralizationsId;
                    }
                    _context.Account.Add(acc);
                    _context.SaveChanges();
                    return ErorrType.ThanhCong;
                }
            } else {
                return ErorrType.ThatBai;
            }
        }






        ErorrType IAuthServices.ChangePassWord(string userName, string passWord, string newPass) {
            var user = _context.Account.FirstOrDefault(x => x.UserName == userName);
            if (user == null) {
                return ErorrType.TaiKhoanKhongTonTai;
            }
            if (BCrypt.Net.BCrypt.Verify(passWord, user.Password)) {
                // Mật khẩu đã băm và trùng khớp
                user.Password = BCrypt.Net.BCrypt.HashPassword(newPass); // Băm mật khẩu mới
                user.UpdateAt = DateTime.Now;
                _context.SaveChanges();
                return ErorrType.ThanhCong;
            } else {
                return ErorrType.ThatBai;
            }
        }
       /* private string HashPassword(string password) {
            string salt = BCrypt.Net.BCrypt.GenerateSalt(12);
            password = password + _config.GetSection("JwtConfig:Secret").ToString();
            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(password, salt);

            return hashedPassword;
        }
        private bool VerifyPassword(string password, string hashedPassword) {

            password = password + _config.GetSection("JwtConfig:Secret").ToString();
            return BCrypt.Net.BCrypt.Verify(password, hashedPassword);
        }
*/
    }
}
