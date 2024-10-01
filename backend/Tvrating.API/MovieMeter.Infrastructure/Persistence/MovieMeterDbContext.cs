using Microsoft.EntityFrameworkCore;
using MovieMeter.Core.Entities;

namespace MovieMeter.Infrastructure.Persistence;

public class MovieMeterDbContext : DbContext
{
    public MovieMeterDbContext(DbContextOptions<MovieMeterDbContext> options) : base(options)
    {
    }

    public DbSet<Review> Reviews { get; set; }
    public DbSet<User> Users { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        builder
            .Entity<Review>(e =>
            {
                e.HasKey(s => s.Id);
                
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

       
    }
}