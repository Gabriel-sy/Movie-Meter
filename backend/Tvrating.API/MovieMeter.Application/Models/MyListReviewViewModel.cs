using MovieMeter.Core.Entities;

namespace MovieMeter.Application.Models;

public class MyListReviewViewModel
{
    public MyListReviewViewModel(int showId, string releaseDate, List<string> genres,
        decimal userRating, string posterPath, string overview, string? directorName,
        string originalTitle, string? userReview, int id)
    {
        ShowId = showId;
        ReleaseDate = releaseDate;
        Genres = genres;
        UserRating = userRating;
        PosterPath = posterPath;
        Overview = overview;
        DirectorName = directorName;
        OriginalTitle = originalTitle;
        UserReview = userReview;
        Id = id;
    }

    public int Id { get; set; }
    public int ShowId { get; set; }
    public string ReleaseDate { get; set; }
    public List<string> Genres { get; set; }
    public decimal UserRating { get; set; }
    public string PosterPath { get; set; }
    public string Overview { get; set; }
    public string? DirectorName { get; set; }
    public string OriginalTitle { get; set; }
    public string? UserReview { get; set; }

    public static MyListReviewViewModel FromEntity(Review review)
    {
        return new MyListReviewViewModel(review.ShowId, review.ReleaseDate, review.Genres, review.UserRating,
            review.PosterPath, review.Overview, review.DirectorName, review.OriginalTitle, review.UserReview,
            review.Id);
    }
}