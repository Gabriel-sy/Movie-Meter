using MovieMeter.Core.Entities;

namespace MovieMeter.Application.Models;

public class UserViewModel
{
    public UserViewModel(string name, string email, List<ReviewViewModel>? shows,
        byte[]? profilePicture, string? biography)
    {
        Name = name;
        Email = email;
        Shows = shows ?? null;
        ProfilePicture = profilePicture ?? null;
        Biography = biography ?? null;
    }

    public string Name { get; set; }
    public string Email { get; set; }
    public byte[]? ProfilePicture { get; set; }
    public string? Biography { get; set; }
    public List<ReviewViewModel>? Shows { get; set; }

    public static UserViewModel FromEntity(User user)
    {
        return new UserViewModel(user.Name, user.Email, user.Shows
            .Select(u => ReviewViewModel.FromEntity(u)).ToList(), user.ProfilePicture,
            user.Biography);
    }
}