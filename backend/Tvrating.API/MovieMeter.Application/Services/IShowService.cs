using MovieMeter.Application.Models;

namespace MovieMeter.Application.Services;

public interface IShowService
{
    Task<ResultViewModel<ResultsInputModel>> SearchTitle(string searchTitle, int? page = 1);
    Task<ResultViewModel<List<SearchViewModel>>> SimpleTitleSearch(string searchTitle, int? page = 1);
    Task<ResultViewModel<ResultsInputModel>> GetShowCredits(int showId);
    Task<ResultViewModel<FullShowViewModel>> GetShowWithAllDetails(string searchTitle, string userName);
    Task<ResultViewModel<List<SearchViewModel>>> GetPopularMovies();
}