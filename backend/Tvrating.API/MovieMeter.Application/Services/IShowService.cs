﻿using MovieMeter.Application.Models;

namespace MovieMeter.Application.Services;

public interface IShowService
{
    Task<ResultViewModel<ResultsInputModel>> SearchTitle(string searchTitle, int? page = 1);
    Task<ResultViewModel<List<SearchViewModel>>> SimpleTitleSearch(string searchTitle, int? page = 1);
    Task<ResultViewModel<ResultsInputModel>> GetShowCredits(int showId, bool isMovie);
    Task<ResultViewModel<FullShowViewModel>> GetShowWithAllDetails(string searchTitle, string? userName);
    Task<ResultViewModel<List<SearchViewModel>>> GetPopularMovies(int? page = 1);
    Task<ResultViewModel<List<SearchViewModel>>> GetPopularSeries(int? page = 1);
    Task<ResultViewModel<List<SearchViewModel>>> GetPopularMoviesByGenre(string genre, int? page = 1);
}