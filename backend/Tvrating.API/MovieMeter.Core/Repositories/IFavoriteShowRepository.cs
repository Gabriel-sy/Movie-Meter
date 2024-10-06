using MovieMeter.Core.Entities;

namespace MovieMeter.Core.Repositories;

public interface IFavoriteShowRepository
{
    Task<FavoriteShow> AddFavoriteShow(FavoriteShow favoriteShow);
}