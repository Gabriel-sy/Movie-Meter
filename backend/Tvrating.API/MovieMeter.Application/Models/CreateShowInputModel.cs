using MovieMeter.Core.Entities;
using MovieMeter.Core.Services;

namespace MovieMeter.Application.Models;

public class CreateShowInputModel
{
    public string ShowId { get; private set; }
    public string Title { get; private set; }
    public string ReleaseDate { get; private set; }
    public int[] Genres { get; private set; }
    public string UserRating { get; private set; }
    public string PublicRating { get; private set; }
    public string MediaType { get; private set; }
    public string PosterPath { get; private set; }
    public string Overview { get; private set; }
    public string DirectorName { get; private set; }

    public Show FromEntity()
    {

        return new Show(ShowId, Title, ReleaseDate, ConvertGenre.Convert(Genres), UserRating
            ,PublicRating, MediaType, PosterPath, Overview, DirectorName);
    }
}