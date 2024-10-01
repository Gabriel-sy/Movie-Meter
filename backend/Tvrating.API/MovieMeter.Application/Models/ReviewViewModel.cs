using MovieMeter.Core.Entities;

namespace MovieMeter.Application.Models;

public class ReviewViewModel
{
    public ReviewViewModel(int id, int showId, string releaseDate, 
        List<string> genres, string userRating, string posterPath, 
        string overview, string directorName, string originalTitle, 
        string userReview, int likeAmount, List<string> likeNames,
        bool isLiked, string userName)
    {
        Id = id;
        ShowId = showId;
        ReleaseDate = releaseDate;
        Genres = genres;
        UserRating = userRating;
        PosterPath = posterPath;
        Overview = overview;
        DirectorName = directorName;
        OriginalTitle = originalTitle;
        UserReview = userReview;
        LikeAmount = likeAmount;
        LikeNames = likeNames;
        IsLiked = isLiked;
        UserName = userName;
    }

    public int Id { get; set; }
    public int ShowId { get; set; }
    public string ReleaseDate { get; set; }
    public List<string> Genres { get; set; }
    public string UserRating { get; set; }
    public string PosterPath { get; set; }
    public string Overview { get; set; }
    public string DirectorName { get; set; }
    public string OriginalTitle { get; set; }
    public string? UserReview { get; set; }
    public string? UserName { get; set; }
    public int LikeAmount { get; private set; }
    public List<string> LikeNames { get; private set; }
    public bool IsLiked { get; private set; }

    public static ReviewViewModel FromEntity(Review review)
    {
        return new ReviewViewModel(review.Id, review.ShowId, review.ReleaseDate, review.Genres,
            review.UserRating, review.PosterPath, review.Overview, review.DirectorName, review.OriginalTitle
            , review.UserReview, review.LikeAmount, review.LikeNames, review.IsLiked, review.User.Name);
    }
}