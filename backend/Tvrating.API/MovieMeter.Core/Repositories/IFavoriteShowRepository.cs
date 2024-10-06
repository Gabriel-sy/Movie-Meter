using MovieMeter.Core.Entities;

namespace MovieMeter.Core.Repositories;

public interface IFavoriteShowRepository
{
    Task<FavoriteShow> AddFavoriteShow(FavoriteShow favoriteShow);
    Task<List<FavoriteShow>> FindFavoriteShowsByUserName(string userName);
    Task<FavoriteShow> DeleteFavoriteShow(FavoriteShow favoriteShow);
    Task<FavoriteShow?> FindFavoriteShowByUserName(string userName);
}