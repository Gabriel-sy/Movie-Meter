namespace MovieMeter.Application.Models;

public class CreateFavShowInputModel
{
    public CreateFavShowInputModel(string originalTitle, string posterPath, string userName)
    {
        OriginalTitle = originalTitle;
        PosterPath = posterPath;
        UserName = userName;
    }

    public string OriginalTitle { get; set; }
    public string PosterPath { get; set; }
    public string UserName { get; set; }
}