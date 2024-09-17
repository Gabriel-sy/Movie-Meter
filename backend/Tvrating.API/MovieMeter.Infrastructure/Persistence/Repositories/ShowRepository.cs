using Microsoft.EntityFrameworkCore;
using Microsoft.VisualBasic.CompilerServices;
using MovieMeter.Application.Models;
using MovieMeter.Core.Entities;
using MovieMeter.Core.Repositories;

namespace MovieMeter.Infrastructure.Persistence.Repositories;

public class ShowRepository : IShowRepository
{
    private readonly MovieMeterDbContext _context;

    public ShowRepository(MovieMeterDbContext context)
    {
        _context = context;
    }

    public async Task<List<Show>> GetAll()
    {
        var shows = await _context.Shows
            .Where(p => !p.IsDeleted)
            .ToListAsync();

        return shows;
    }

    public async Task SaveShow(Show show)
    {
        await _context.Shows.AddAsync(show);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteShow(Show show)
    {
        show.SetAsDeleted();
        _context.Shows.Update(show);
        await _context.SaveChangesAsync();
    }

    public async Task EditShowRating(Show show, string rating)
    {
        show.UpdateRating(rating);

        _context.Shows.Update(show);
        await _context.SaveChangesAsync();
    }

    public async Task<Show?> GetById(int id)
    {
        var show = await _context.Shows.SingleOrDefaultAsync(s => s.Id == id && !s.IsDeleted);
        return show;
    }
}