namespace MovieMeter.Core.Entities;

public class Review : BaseEntity
{
    protected Review()
    {
        
    }
    public Review(int showId, string releaseDate, List<string> genres, 
        decimal userRating, string posterPath, string overview, 
        string directorName, User user, int userId, string originalTitle, 
        string userReview) : base()
    {
        ShowId = showId;
        ReleaseDate = releaseDate;
        Genres = genres;
        UserRating = userRating;
        PosterPath = posterPath;
        Overview = overview;
        DirectorName = directorName;
        User = user;
        UserId = userId;
        OriginalTitle = originalTitle;
        UserReview = userReview;
        LikeAmount = 0;
        LikeNames = [];
        IsLiked = false;

    }

    public int ShowId { get; private set; }
    public string ReleaseDate { get; private set; }
    public List<string> Genres { get; private set; }
    public decimal UserRating { get; private set; }
    public string PosterPath { get; private set; }
    public string Overview { get; private set; }
    public string? DirectorName { get; private set; }
    public User User { get; private set; }
    public int UserId { get; private set; }
    public string OriginalTitle { get; private set; }
    public string? UserReview { get; private set; }
    public int LikeAmount { get; private set; }
    public List<string> LikeNames { get; private set; }
    public bool IsLiked { get; private set; }

    public void UpdateRating(decimal rating)
    {
        UserRating = rating;
    }

    public void UpdateReviewText(string reviewText)
    {
        UserReview = reviewText;
    }

    public void UpdateLikeAmount(bool isLiked, string userName)
    {
        LikeAmount = isLiked ? LikeAmount + 1 : LikeAmount - 1;
        LikeNames.Add(userName);
        IsLiked = isLiked;
    }

    public void RemoveLikeName(string name)
    {
        LikeNames.RemoveAll(n => n == name);
    }
}