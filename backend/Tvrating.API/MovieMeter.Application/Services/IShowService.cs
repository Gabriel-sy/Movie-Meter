using MovieMeter.Application.Models;

namespace MovieMeter.Application.Services;

public interface IShowService
{
    Task<ResultViewModel<List<SearchViewModel>>> SearchTitle(string searchTitle, int? page = 1);
}