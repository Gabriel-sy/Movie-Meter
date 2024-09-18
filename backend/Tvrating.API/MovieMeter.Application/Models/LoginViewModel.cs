namespace MovieMeter.Application.Models;

public class LoginViewModel
{
    public LoginViewModel(string email, string token)
    {
        Email = email;
        Token = token;
    }

    public string Email { get; set; }
    public string Token { get; set; }
}