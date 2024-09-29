using Microsoft.EntityFrameworkCore;
using MovieMeter.Core.Entities;

namespace MovieMeter.Infrastructure.Persistence;

public class MovieMeterDbContext : DbContext
{
    public MovieMeterDbContext(DbContextOptions<MovieMeterDbContext> options) : base(options)
    {
    }

    public DbSet<Show> Shows { get; set; }
    public DbSet<User> Users { get; set; }

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

        builder
            .Entity<User>(e =>
            {
                e.HasKey(u => u.Id);
                e.HasMany(u => u.Shows)
                    .WithOne(s => s.User)
                    .HasForeignKey(s => s.UserId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

        builder
            .Entity<Comment>(e =>
            {
                e.HasKey(c => c.Id);

                e.HasOne(c => c.Show)
                    .WithMany(s => s.Comments)
                    .HasForeignKey(c => c.ShowId)
                    .OnDelete(DeleteBehavior.Restrict);
            });
    }
}