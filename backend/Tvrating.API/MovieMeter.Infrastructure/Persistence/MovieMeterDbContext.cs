using Microsoft.EntityFrameworkCore;
using MovieMeter.Core.Entities;

namespace MovieMeter.Infrastructure.Persistence;

public class MovieMeterDbContext : DbContext
{
    public MovieMeterDbContext(DbContextOptions<MovieMeterDbContext> options) : base(options)
    {
    }

    public DbSet<Show> Shows { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        builder
            .Entity<Show>(e =>
            {
                e.HasKey(s => s.Id);
            });
    }
}