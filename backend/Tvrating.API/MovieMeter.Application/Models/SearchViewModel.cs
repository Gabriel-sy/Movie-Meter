namespace MovieMeter.Application.Models;

public class SearchViewModel
{
    public SearchViewModel(int showId, string originalTitle, string translatedTitle, string releaseDate, string posterPath)
    {
        ShowId = showId;
        OriginalTitle = originalTitle;
        TranslatedTitle = translatedTitle;
        ReleaseDate = releaseDate;
        PosterPath = posterPath;
    }

    public int ShowId { get; set; }
    public string OriginalTitle { get; set; }
    public string TranslatedTitle { get; set; }
    public string ReleaseDate { get; set; }
    public string PosterPath { get; set; }

    public static SearchViewModel FromEntity(ShowInputModel model)
    {
        return new SearchViewModel(model.Id, model.Original_Title, model.Title
            ,model.Release_Date, model.Poster_Path);
    }
}