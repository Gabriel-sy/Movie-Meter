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
                e.Property(s => s.PublicRating)
                    .HasPrecision(3, 2)
                    .HasConversion(d => decimal.Round(d, 2, MidpointRounding.ToZero),
                        d => d);
            });
    }
}