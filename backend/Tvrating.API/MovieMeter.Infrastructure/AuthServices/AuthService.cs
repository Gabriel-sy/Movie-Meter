using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using MovieMeter.Core.Services;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace MovieMeter.Infrastructure.AuthServices;

public class AuthService : IAuthService
{
    private readonly IConfiguration _configuration;

    public AuthService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public string GenerateJwtToken(string email, string role)
    {
        var issuer = _configuration["JwtIssuer"];
        var audience = _configuration["JwtAudience"];
        var key = _configuration["JwtKey"];

        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        //Informações do usuário que tem o token
        var claims = new List<Claim>
        {
            new Claim("Name", email),
            new Claim(ClaimTypes.Role, role)
        };

        var token = new JwtSecurityToken(issuer: issuer,
            audience: audience,
            expires: DateTime.Now.AddHours(8),
            signingCredentials: credentials,
            claims: claims);

        var tokenHandler = new JwtSecurityTokenHandler();

        var stringToken = tokenHandler.WriteToken(token);

        return stringToken;
    }

    public string EncryptPassword(string password)
    {
        using (SHA256 sha256Hash = SHA256.Create())
        {
            byte[] bytes = sha256Hash.ComputeHash(Encoding.UTF8.GetBytes(password));

            //Converte byte array para string
            StringBuilder builder = new StringBuilder();

            for (var i = 0; i < bytes.Length; i++)
            {
                builder.Append(bytes[i].ToString("x2"));
            }

            return builder.ToString();
        }
    }
}
