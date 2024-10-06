using System.Text.Json.Serialization;

namespace MovieMeter.Core.Entities;

public class FavoriteShow : BaseEntity
{
    protected FavoriteShow(){}

    public FavoriteShow(string originalTitle, string posterPath, User user, int userId)
    {
        OriginalTitle = originalTitle;
        PosterPath = posterPath;
        User = user;
        UserId = userId;
    }

    public string OriginalTitle { get; private set; }
    public string PosterPath { get; private set; }
    [JsonIgnore]
    public User User { get; private set; }
    public int UserId { get; private set; }
}