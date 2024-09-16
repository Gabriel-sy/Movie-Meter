using Microsoft.EntityFrameworkCore;
using Tvrating.Core.Entities;

namespace Tvrating.Infrastructure.Persistence;

public class TvratingDbContext : DbContext
{
    public TvratingDbContext(DbContextOptions<TvratingDbContext> options) : base(options)
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