using MovieMeter.Core.Entities;

namespace MovieMeter.Application.Models;

public class ReviewViewModel
{
    public ReviewViewModel(string userName, string review, string rating, int likes)
    {
        UserName = userName;
        Review = review;
        Rating = rating;
        Likes = likes;
    }

    public string UserName { get; set; }
    public string Review { get; set; }
    public string Rating { get; set; }
    public int Likes { get; set; }

    public static ReviewViewModel FromEntity(Review review)
    {
        return new ReviewViewModel(review.User.Name, review.ReviewText, review.Rating, review.Likes);
    }
}