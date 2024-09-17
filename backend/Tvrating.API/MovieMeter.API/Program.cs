using Microsoft.EntityFrameworkCore;
using MovieMeter.Application.Services;
using MovieMeter.Core.Repositories;
using MovieMeter.Infrastructure.Persistence;
using MovieMeter.Infrastructure.Persistence.Repositories;

var builder = WebApplication.CreateBuilder(args);
var AllowFront = "AllowFront";

builder.Services.AddControllers();

var connectionString = builder.Configuration.GetConnectionString("MovieMeter");
builder.Services.AddDbContext<MovieMeterDbContext>(o => o.UseSqlServer(connectionString));

builder.Services.AddScoped<IShowRepository, ShowRepository>();
builder.Services.AddScoped<IShowService, ShowService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: AllowFront,
        configurePolicy: policy =>
        {
            policy.WithOrigins("http://localhost:4200")
                .AllowAnyHeader()
                .AllowAnyMethod();
        });
    
});

var app = builder.Build();


app.UseCors(AllowFront);

app.UseHttpsRedirection();

app.UseRouting();


app.UseAuthorization();

app.MapControllers();

app.Run();
