namespace MovieMeter.Core.Entities;

public class Review : BaseEntity
{
    protected Review(){}
    
    public Review(Show show, int showId, User user, int userId, string reviewText, int likes
    , string rating) : base()
    {
        Show = show;
        ShowId = showId;
        User = user;
        UserId = userId;
        ReviewText = reviewText;
        Likes = likes;
        Rating = rating;
    }

    public Show Show { get; private set; }
    public int ShowId { get; private set; }
    public User User { get; private set; }
    public int UserId { get; private set; }
    public string ReviewText { get; private set; }
    public string Rating { get; private set; }
    public int Likes { get; private set; }
}