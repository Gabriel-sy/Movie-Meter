using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
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



builder.Services.AddScoped<IReviewRepository, ReviewRepository>();
builder.Services.AddScoped<IReviewService, ReviewService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IFavoriteShowService, FavoriteShowService>();
builder.Services.AddScoped<IFavoriteShowRepository, FavoriteShowRepository>();
builder.Services.AddScoped<IShowService, ShowService>();

var connectionString = builder.Configuration.GetConnectionString("MovieMeter");
builder.Services.AddDbContext<MovieMeterDbContext>(o => o.UseSqlServer(connectionString));

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,

            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
        };
    });

builder.Services.AddHttpClient("TMDB", httpClient =>
{
    httpClient.BaseAddress = new Uri("https://api.themoviedb.org/3/");
    
    httpClient.DefaultRequestHeaders.Add(
        "Authorization", "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxMGQwZjMwMWI4YTMwYzg3MDI2OGY0MzE0MWQ3YTcxMCIsIm5iZiI6MTcyMDY0NzE2MS42OTA0OTksInN1YiI6IjY2OGViYTg0MGQ1ODlkMTMzZWYxNzdkMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.NjzfMPs94DIwgyR9raXICaZ-zT_iiRZIh8VYW6i7SNw");
    
    httpClient.DefaultRequestHeaders.Add(
        "accept", "application/json");
});

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

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
