using MovieMeter.Core.Entities;

namespace MovieMeter.Application.Models;

public class CreateUserInputModel
{
    public string Name { get; set; }
    public string Email { get; set; }
    public string Password { get; set; }

    public User FromEntity()
    {
        return new User(Name, Email, Password, "user", null);
    }
}