using Microsoft.EntityFrameworkCore;

namespace MovieMeter.Core.Services;

public static class PaginationHelper
{
    public static async Task<PagedList<T>> CreateAsync<T>
        (IQueryable<T> source, int pageNumber, int pageSize) where T : class
    {
        var count = await source.CountAsync();
        var items = await source.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();

        return new PagedList<T>(items, pageNumber, pageSize, count);
    }
}