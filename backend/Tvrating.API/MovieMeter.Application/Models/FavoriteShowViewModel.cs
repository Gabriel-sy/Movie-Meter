using MovieMeter.Core.Entities;

namespace MovieMeter.Application.Models;

public class FavoriteShowViewModel
{
    public FavoriteShowViewModel(string originalTitle, string posterPath)
    {
        OriginalTitle = originalTitle;
        PosterPath = posterPath;
    }

    public string OriginalTitle { get; set; }
    public string PosterPath { get; set; }

    public static FavoriteShowViewModel FromEntity(FavoriteShow favoriteShow)
    {
        return new FavoriteShowViewModel(favoriteShow.OriginalTitle, favoriteShow.PosterPath);
    }
}