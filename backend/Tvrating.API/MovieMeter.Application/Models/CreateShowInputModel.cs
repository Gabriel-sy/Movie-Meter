﻿using MovieMeter.Core.Entities;
using MovieMeter.Core.Services;

namespace MovieMeter.Application.Models;

public class CreateShowInputModel
{
    public int ShowId { get; set; }
    public string? ReleaseDate { get; set; }
    public int[] Genres { get; set; }
    public string UserRating { get; set; }
    public string PosterPath { get; set; }
    public string Overview { get; set; }
    public string? DirectorName { get; set; }
    public string OriginalTitle { get; set; }
    public string? UserReview { get; set; }

    public Review FromEntity(User user, int userId)
    {
        ReleaseDate = ReleaseDate?[..4];

        return new Review(ShowId, ReleaseDate, ConvertGenre.Convert(Genres), UserRating
        , PosterPath, Overview, DirectorName, user, userId, OriginalTitle, UserReview);
        
    }
}