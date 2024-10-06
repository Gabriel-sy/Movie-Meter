using MovieMeter.Core.Entities;
using MovieMeter.Core.Repositories;

namespace MovieMeter.Infrastructure.Persistence.Repositories;

public class FavoriteShowRepository : IFavoriteShowRepository
{
    public async Task<FavoriteShow> AddFavoriteShow(FavoriteShow favoriteShow)
    {
        return favoriteShow;
    }
}