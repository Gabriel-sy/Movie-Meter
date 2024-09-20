using MovieMeter.Core.Entities;

namespace MovieMeter.Application.Models;

public class UserViewModel
{
    public UserViewModel(string name, string email, List<ShowViewModel> shows)
    {
        Name = name;
        Email = email;
        Shows = shows;
    }

    public string Name { get; set; }
    public string Email { get; set; }
    public List<ShowViewModel> Shows { get; set; }

    public static UserViewModel FromEntity(User user)
    {
        return new UserViewModel(user.Name, user.Email, user.Shows
            .Select(u => ShowViewModel.FromEntity(u)).ToList());
    }
}