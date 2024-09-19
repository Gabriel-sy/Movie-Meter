namespace MovieMeter.Application.Models;

public class LoginViewModel
{
    public LoginViewModel(string name, string token)
    {
        Name = name;
        Token = token;
    }

    public string Name { get; set; }
    public string Token { get; set; }
}