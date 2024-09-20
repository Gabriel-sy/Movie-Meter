using MovieMeter.Core.Entities;

namespace MovieMeter.Application.Models;

public class ShowViewModel
{
    public ShowViewModel(int id, int showId, string title, string releaseDate, List<string> genres, string userRating, 
        decimal publicRating, string mediaType, string posterPath, 
        string overview, string directorName, string originalTitle)
    {
        Id = id;
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
        OriginalTitle = originalTitle;
    }

    public int Id { get; set; }
    public int ShowId { get; set; }
    public string Title { get; set; }
    public string ReleaseDate { get; set; }
    public List<string> Genres { get; set; }
    public string UserRating { get; set; }
    public decimal PublicRating { get; set; }
    public string MediaType { get; set; }
    public string PosterPath { get; set; }
    public string Overview { get; set; }
    public string DirectorName { get; set; }
    public string OriginalTitle { get; set; }

    public static ShowViewModel FromEntity(Show show)
    {
        return new ShowViewModel(show.Id, show.ShowId, show.Title, show.ReleaseDate, show.Genres, show.UserRating,
        show.PublicRating, show.MediaType, show.PosterPath, show.Overview, show.DirectorName, show.OriginalTitle);
    }
}