

namespace MovieMeter.Core.Entities;

public class User : BaseEntity
{
    protected User(){}
    
    public User(string name, string email, string password, string role, byte[]? profilePicture,
        string? biography)
    {
        Name = name;
        Email = email;
        Password = password;
        Shows = [];
        TotalLikes = 0;
        Role = role;
        ProfilePicture = profilePicture ?? null;
        Biography = biography ?? null;
    }

    public string Name { get; private set; }
    public string? Biography { get; private set; }
    public byte[]? ProfilePicture { get; private set; }
    public string Email { get; private set; }
    public string Password { get; private set; }
    public int? TotalLikes { get; private set; }
    public List<Review> Shows { get; private set; }
    public string Role { get; private set; }

    public void SetBiography(string biography)
    {
        Biography = biography;
    }

    public void SetName(string name)
    {
        Name = name;
    }

    public void UpdateTotalLikes(bool isLiked)
    {
        TotalLikes = isLiked ? TotalLikes + 1 : TotalLikes - 1;
    }

    public void AddProfilePicture(byte[] picture)
    {
        ProfilePicture = picture;
    }
}