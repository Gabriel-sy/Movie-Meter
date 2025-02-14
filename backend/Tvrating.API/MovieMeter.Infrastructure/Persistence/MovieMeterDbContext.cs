﻿using Microsoft.EntityFrameworkCore;
using MovieMeter.Core.Entities;

namespace MovieMeter.Infrastructure.Persistence;

public class MovieMeterDbContext : DbContext
{
    public MovieMeterDbContext(DbContextOptions<MovieMeterDbContext> options) : base(options)
    {
    }

    public DbSet<Review> Reviews { get; set; }
    public DbSet<User> Users { get; set; }
    public DbSet<FavoriteShow> FavoriteShows { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {

        builder
            .Entity<Review>(e =>
            {
                e.HasKey(r => r.Id);

                e.Property(r => r.UserRating).HasPrecision(10, 2);

            });

        builder
            .Entity<User>(e =>
            {
                e.HasKey(u => u.Id);
                e.HasMany(u => u.Reviews)
                    .WithOne(s => s.User)
                    .HasForeignKey(s => s.UserId)
                    .OnDelete(DeleteBehavior.Restrict);

                e.HasMany(u => u.FavoriteShows)
                    .WithOne(f => f.User)
                    .HasForeignKey(f => f.UserId)
                    .OnDelete(DeleteBehavior.Restrict);

            });


    }
}