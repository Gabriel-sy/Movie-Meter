using MovieMeter.Core.Entities;

namespace MovieMeter.Application.Models;

public class SimpleReviewViewModel
{
    public SimpleReviewViewModel(string userRating, string userReview, string userName, 
        int likeAmount, List<string> likeNames, bool isLiked)
    {
        UserRating = userRating;
        UserReview = userReview;
        UserName = userName;
        LikeAmount = likeAmount;
        LikeNames = likeNames;
        IsLiked = isLiked;
    }

    public string UserRating { get; set; }
    public string UserReview { get; set; }
    public string UserName { get; set; }
    public int LikeAmount { get; private set; }
    public List<string> LikeNames { get; private set; }
    public bool IsLiked { get; private set; }

    public static SimpleReviewViewModel FromEntity(Review review)
    {
        return new SimpleReviewViewModel(review.UserRating, review.UserReview ?? "",
            review.User.Name, review.LikeAmount, review.LikeNames, review.IsLiked);
    }
}