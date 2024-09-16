using Microsoft.EntityFrameworkCore;
using Tvrating.Application.Models;
using Tvrating.Core.Entities;
using Tvrating.Core.Repositories;

namespace Tvrating.Infrastructure.Persistence.Repositories;

public class ShowRepository : IShowRepository
{
    private readonly TvratingDbContext _context;

    public ShowRepository(TvratingDbContext context)
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
}