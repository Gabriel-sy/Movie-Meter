using MovieMeter.Core.Entities;

namespace MovieMeter.Application.Models;

public class UserViewModel
{
    public UserViewModel(string name, string email, List<ReviewViewModel>? reviews,
        byte[]? profilePicture, string? biography, int totalLikes)
    {
        Name = name;
        Email = email;
        Reviews = reviews ?? null;
        ProfilePicture = profilePicture ?? null;
        Biography = biography ?? null;
        TotalLikes = totalLikes;
    }

    public string Name { get; set; }
    public string Email { get; set; }
    public byte[]? ProfilePicture { get; set; }
    public int TotalLikes { get; set; }
    public string? Biography { get; set; }
    public List<ReviewViewModel>? Reviews { get; set; }

    public static UserViewModel FromEntity(User user)
    {
        return new UserViewModel(user.Name, user.Email, user.Reviews
            .Select(u => ReviewViewModel.FromEntity(u)).ToList(), user.ProfilePicture,
            user.Biography, user.TotalLikes);
    }
}