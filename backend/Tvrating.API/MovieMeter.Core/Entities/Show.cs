namespace MovieMeter.Core.Entities;

public class Show : BaseEntity
{
    protected Show()
    {
        
    }
    public Show(int showId, string title, string releaseDate, List<string> genres, string userRating, 
        decimal publicRating, string mediaType, string posterPath, string overview, 
        string directorName, User user, int userId, string originalTitle, string userReview) : base()
    {
        ShowId = showId;
        Title = title;
        ReleaseDate = releaseDate;
        Genres = genres;
        UserRating = userRating;
        PublicRating = publicRating;
        MediaType = mediaType;
        PosterPath = posterPath;
        Overview = overview;
        DirectorName = directorName;
        User = user;
        UserId = userId;
        OriginalTitle = originalTitle;
        UserReview = userReview;
        ShowReviews = [];
    }

    public int ShowId { get; private set; }
    public string Title { get; private set; }
    public string ReleaseDate { get; private set; }
    public List<string> Genres { get; private set; }
    public string UserRating { get; private set; }
    public decimal PublicRating { get; private set; }
    public string MediaType { get; private set; }
    public string PosterPath { get; private set; }
    public string Overview { get; private set; }
    public string? DirectorName { get; private set; }
    public User User { get; private set; }
    public int UserId { get; private set; }
    public string OriginalTitle { get; private set; }
    public string? UserReview { get; private set; }
    public List<Review> ShowReviews { get; private set; }

    public void UpdateRating(string rating)
    {
        UserRating = rating;
    }

    public void UpdateReview(string review)
    {
        UserReview = review;
    }

    public void AddReview(Review review)
    {
        ShowReviews.Add(review);
    }
}