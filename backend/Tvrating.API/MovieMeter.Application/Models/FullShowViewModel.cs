namespace MovieMeter.Application.Models;

public class FullShowViewModel
{
    public FullShowViewModel(int showId, string originalTitle, string translatedTitle, 
        string releaseDate, List<string> genreNames, double voteAverage, string mediaType, 
        string posterPath, decimal? userRating, string overview, string directorName, 
        string? userReview, List<Person> cast)
    {
        ShowId = showId;
        OriginalTitle = originalTitle;
        TranslatedTitle = translatedTitle;
        ReleaseDate = releaseDate;
        GenreNames = genreNames;
        VoteAverage = voteAverage;
        MediaType = mediaType;
        PosterPath = posterPath;
        UserRating = userRating;
        Overview = overview;
        DirectorName = directorName;
        UserReview = userReview;
        Cast = cast;
    }

    public int ShowId { get; set; }
    public string OriginalTitle { get; set; }
    public string TranslatedTitle { get; set; }
    public string ReleaseDate { get; set; }
    public List<string> GenreNames { get; set; }
    public double VoteAverage { get; set; }
    public string MediaType { get; set; }
    public string PosterPath { get; set; }
    public decimal? UserRating { get; set; }
    public string Overview { get; set; }
    public string DirectorName { get; set; }
    public string? UserReview { get; set; }
    public List<Person> Cast { get; set; }

    public static FullShowViewModel FromEntity(ShowInputModel model, 
        string directorName, List<Person> cast, List<string> genreNames,
        decimal? userRating, string? userReview)
    {
        return new FullShowViewModel(model.Id, model.Original_Title, model.Title,
            model.Release_Date, genreNames, model.Vote_Average, model.Media_Type,
            model.Poster_Path, userRating, model.Overview, directorName, userReview,
            cast);
    }
}