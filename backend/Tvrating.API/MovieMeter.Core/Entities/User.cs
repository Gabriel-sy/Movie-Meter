
namespace MovieMeter.Core.Entities;

public class User : BaseEntity
{
    protected User(){}
    
    public User(string name, string email, string password, List<Show> shows, string role)
    {
        Name = name;
        Email = email;
        Password = password;
        Shows = shows;
        Role = role;
    }

    public string Name { get; private set; }
    public string Email { get; private set; }
    public string Password { get; private set; }
    public List<Show> Shows { get; private set; }
    public string Role { get; private set; }
}