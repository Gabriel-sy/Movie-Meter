namespace MovieMeter.Core.Entities;

public class Show : BaseEntity
{
    protected Show()
    {
        
    }
    public Show(string showId, string title, string releaseDate, List<string> genres, string userRating, 
        string publicRating, string mediaType, string posterPath, string overview, 
        string directorName) : base()
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
    }

    public string ShowId { get; private set; }
    public string Title { get; private set; }
    public string ReleaseDate { get; private set; }
    public List<string> Genres { get; private set; }
    public string UserRating { get; private set; }
    public string PublicRating { get; private set; }
    public string MediaType { get; private set; }
    public string PosterPath { get; private set; }
    public string Overview { get; private set; }
    public string DirectorName { get; private set; }

    public void UpdateRating(string rating)
    {
        UserRating = rating;
    }
}