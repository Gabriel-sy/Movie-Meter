using Microsoft.EntityFrameworkCore;
using MovieMeter.Core.Entities;
using MovieMeter.Core.Repositories;

namespace MovieMeter.Infrastructure.Persistence.Repositories;

public class FavoriteShowRepository : IFavoriteShowRepository
{
    private readonly MovieMeterDbContext _context;

    public FavoriteShowRepository(MovieMeterDbContext context)
    {
        _context = context;
    }

    public async Task<FavoriteShow> AddFavoriteShow(FavoriteShow favoriteShow)
    {
        await _context.FavoriteShows.AddAsync(favoriteShow);
        await _context.SaveChangesAsync();
        
        return favoriteShow;
    }

    public async Task<List<FavoriteShow>> FindFavoriteShowsByUserName(string userName)
    {
        var result = await _context.FavoriteShows
            .Where(f => f.User.Name == userName && !f.IsDeleted)
            .ToListAsync();

        return result;
    }
    
    

    public async Task<FavoriteShow> DeleteFavoriteShow(FavoriteShow favoriteShow)
    {
        favoriteShow.SetAsDeleted();

        _context.Update(favoriteShow);
        await _context.SaveChangesAsync();

        return favoriteShow;
    }

    public async Task<FavoriteShow?> FindFavoriteShowByUserName(string userName)
    {
        var result = await _context.FavoriteShows
            .SingleOrDefaultAsync(f => f.User.Name == userName
                                       && !f.IsDeleted);

        return result;
    }
}