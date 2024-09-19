

namespace MovieMeter.Core.Services;

public interface IAuthService
{
    string GenerateJwtToken(string email, string role);
    string EncryptPassword(string password);
}