using MovieMeter.Core.Entities;

namespace MovieMeter.Application.Models;

public class UserViewModel
{
    public UserViewModel(string name, string email, List<Show> shows)
    {
        Name = name;
        Email = email;
        Shows = shows;
    }

    public string Name { get; set; }
    public string Email { get; set; }
    public List<Show> Shows { get; set; }

    public static UserViewModel FromEntity(User user)
    {
        return new UserViewModel(user.Name, user.Email, user.Shows);
    }
}