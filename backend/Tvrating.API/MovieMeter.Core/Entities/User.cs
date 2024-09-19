

namespace MovieMeter.Core.Entities;

public class User : BaseEntity
{
    protected User(){}
    
    public User(string name, string email, string password, string role)
    {
        Name = name;
        Email = email;
        Password = password;
        Shows = [];
        Role = role;
    }

    public string Name { get; private set; }
    public string Email { get; private set; }
    public string Password { get; private set; }
    public List<Show> Shows { get; private set; }
    public string Role { get; private set; }
    
}