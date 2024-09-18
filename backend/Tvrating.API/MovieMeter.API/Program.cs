using Microsoft.EntityFrameworkCore;
using MovieMeter.Application.Services;
using MovieMeter.Core.Repositories;
using MovieMeter.Core.Services;
using MovieMeter.Infrastructure.AuthServices;
using MovieMeter.Infrastructure.Persistence;
using MovieMeter.Infrastructure.Persistence.Repositories;

var builder = WebApplication.CreateBuilder(args);
var AllowFront = "AllowFront";

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();



builder.Services.AddScoped<IShowRepository, ShowRepository>();
builder.Services.AddScoped<IShowService, ShowService>();
builder.Services.AddScoped<IAuthService, AuthService>();

var connectionString = builder.Configuration.GetConnectionString("MovieMeter");
builder.Services.AddDbContext<MovieMeterDbContext>(o => o.UseSqlServer(connectionString));

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

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
