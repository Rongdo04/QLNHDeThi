using QLNganHangDeThi.Models;
using QLNganHangDeThi.Constants;

namespace QLNganHangDeThi.IServices {
    interface IAuthServices {
        ErorrType Register(string userName, string passWord, string confirmPassword);
        ErorrType Login(Account acc);
        ErorrType ChangePassWord(string userName, string passWord, string newPass);
        ErorrType ForgotPassword(string email);
        List<Account> DSAccounts();
    }
}
