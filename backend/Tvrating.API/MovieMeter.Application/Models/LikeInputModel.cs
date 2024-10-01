namespace MovieMeter.Application.Models;

public class LikeInputModel
{
    public LikeInputModel(string reviewUserName, string reviewText, string rating, int likeAmount, 
        bool isLiked, int showId)
    {
        ReviewUserName = reviewUserName;
        ReviewText = reviewText;
        Rating = rating;
        LikeAmount = likeAmount;
        IsLiked = isLiked;
        ShowId = showId;
    }

    public int ShowId { get; set; }
    public string ReviewUserName { get; set; }
    public string LikeUserName { get; set; }
    public string ReviewText { get; set; }
    public string Rating { get; set; }
    public int LikeAmount { get; set; }
    public bool IsLiked { get; set; }
    
}