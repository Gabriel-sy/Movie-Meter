using System.Net.Http.Json;
using System.Text.Json;
using System.Web;
using MovieMeter.Application.Models;
using MovieMeter.Core.Entities;
using MovieMeter.Core.Services;

namespace MovieMeter.Application.Services;

public class ShowService : IShowService
{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly IUserService _userService;
    private readonly JsonSerializerOptions _serializerOptions = new JsonSerializerOptions
    {
        PropertyNameCaseInsensitive = true
    }; 

    public ShowService(IHttpClientFactory httpClientFactory, IUserService userService)
    {
        _httpClientFactory = httpClientFactory;
        _userService = userService;
    }

    public async Task<ResultViewModel<ResultsInputModel>> SearchTitle(string searchTitle, int? page = 1)
    {
        var httpClient = _httpClientFactory.CreateClient("TMDB");

        var queryParams = HttpUtility.ParseQueryString(string.Empty);

        queryParams["query"] = searchTitle;
        queryParams["language"] = "pt-BR";
        queryParams["page"] = page.ToString();

        var queryString = queryParams.ToString();
        
        using var response =
            await httpClient.GetAsync($"search/multi?{queryString}");

        if (!response.IsSuccessStatusCode)
        {
            return ResultViewModel<ResultsInputModel>.Error("Erro ao se comunicar com a API externa");
        }

        var stream = await response.Content.ReadAsStreamAsync();

        var responseBody = JsonSerializer.Deserialize<ResultsInputModel>(stream, _serializerOptions);

        if (responseBody is null || responseBody.Results is null)
        {
            return ResultViewModel<ResultsInputModel>.Error("Nada encontrado");
        }

        responseBody.Results = responseBody.Results
            .Where(s => s.Media_Type is "tv" or "movie")
            .ToList();

        responseBody.Results = MapFields(responseBody.Results);
        
        return ResultViewModel<ResultsInputModel>.Success(responseBody);
    }

    public async Task<ResultViewModel<List<SearchViewModel>>> SimpleTitleSearch(string searchTitle, int? page = 1)
    {
        var result = await SearchTitle(searchTitle, page);

        if (!result.IsSuccess && result.Data is not null)
        {
            return ResultViewModel<List<SearchViewModel>>.Error(result.Message);
        }
        
        var model = result.Data.Results.Select
            (s => SearchViewModel.FromEntity(s)).ToList();
        
        return ResultViewModel<List<SearchViewModel>>.Success(model);
    }

    public async Task<ResultViewModel<ResultsInputModel>> GetShowCredits(int showId)
    {
        var httpClient = _httpClientFactory.CreateClient("TMDB");

        using var response =
            await httpClient.GetAsync($"movie/{showId}/credits");

        if (!response.IsSuccessStatusCode)
        {
            return ResultViewModel<ResultsInputModel>.Error("Erro ao se comunicar com a API externa");
        }
        
        var stream = await response.Content.ReadAsStreamAsync();

        var responseBody = JsonSerializer.Deserialize<ResultsInputModel>(stream, _serializerOptions);
        
        if (responseBody is null)
        {
            return ResultViewModel<ResultsInputModel>.Error("Nada encontrado");
        }
        
        return ResultViewModel<ResultsInputModel>.Success(responseBody);
    }

    public async Task<ResultViewModel<FullShowViewModel>> GetShowWithAllDetails(
        string searchTitle,
        string? userName)
    {
        var userReview = "";
        decimal userRating = -1;
        
        var search = await SearchTitle(searchTitle);
        if (!search.IsSuccess || search.Data is null || search.Data.Results is null)
        {
            return ResultViewModel<FullShowViewModel>.Error(search.Message);
        }

        var actualShow = search.Data.Results.First();
        
        var credits = await GetShowCredits(actualShow.Id);
        if (!credits.IsSuccess || credits.Data is null || credits.Data.Crew is null)
        {
            return ResultViewModel<FullShowViewModel>.Error(credits.Message);
        }

        if (userName is not null)
        {
            var user = await _userService.FindFullUserByUserName(userName);
            if (!user.IsSuccess || user.Data is null)
            {
                return ResultViewModel<FullShowViewModel>.Error("Usuário não encontrado");
            }
            (userReview, userRating) = GetUserReviewAndRating(user.Data, searchTitle);
        }
        
        var genreNames = ConvertGenre.Convert(actualShow.Genre_Ids);
        var directorName = MapDirectorName(actualShow.Media_Type, credits.Data.Crew);
        var cast = GetCast(credits.Data.Cast, 8);

        var model = FullShowViewModel.FromEntity(actualShow, directorName, cast, genreNames,
            userRating, userReview);
        
        return ResultViewModel<FullShowViewModel>.Success(model);
    }

    public async Task<ResultViewModel<List<SearchViewModel>>> GetPopularMovies(int? page = 1)
    {
        var httpClient = _httpClientFactory.CreateClient("TMDB");

        using var response =
            await httpClient.GetAsync($"movie/popular?page={page}");

        if (!response.IsSuccessStatusCode)
        {
            return ResultViewModel<List<SearchViewModel>>.Error("Erro ao se comunicar com a API externa");
        }

        var stream = await response.Content.ReadAsStreamAsync();
        
        var responseBody = JsonSerializer.Deserialize<ResultsInputModel>(stream, _serializerOptions);
        
        if (responseBody is null || responseBody.Results is null)
        {
            return ResultViewModel<List<SearchViewModel>>.Error("Nada encontrado");
        }

        var model = MapFields(responseBody.Results)
            .Select(s => SearchViewModel.FromEntity(s)).ToList();
        
        return ResultViewModel<List<SearchViewModel>>.Success(model);
    }

    public async Task<ResultViewModel<List<SearchViewModel>>> GetPopularSeries(int? page = 1)
    {
        var httpClient = _httpClientFactory.CreateClient("TMDB");

        var queryParams = HttpUtility.ParseQueryString(string.Empty);

        queryParams["page"] = page.ToString();
        queryParams["vote_average.lte"] = "7";
        queryParams["vote_average.tle"] = "10";
        queryParams["vote_count.gte"] = "1000";
        queryParams["with_original_language"] = "en";
        queryParams["without_genres"] = "10767%2C%2035%2C%2010764%2C%2010763%2C%2099";
        
        var queryString = queryParams.ToString();

        using var response =
            await httpClient.GetAsync($"discover/tv?{queryString}");

        if (!response.IsSuccessStatusCode)
        {
            return ResultViewModel<List<SearchViewModel>>.Error("Erro ao se comunicar com a API externa");
        }

        var stream = await response.Content.ReadAsStreamAsync();
        
        var responseBody = JsonSerializer.Deserialize<ResultsInputModel>(stream, _serializerOptions);
        
        if (responseBody is null || responseBody.Results is null)
        {
            return ResultViewModel<List<SearchViewModel>>.Error("Nada encontrado");
        }

        var model = MapFields(responseBody.Results)
            .Select(s => SearchViewModel.FromEntity(s)).ToList();

        return ResultViewModel<List<SearchViewModel>>.Success(model);
    }

    public async Task<ResultViewModel<List<SearchViewModel>>> GetPopularMoviesByGenre(string genre, int? page = 1)
    {
        var httpClient = _httpClientFactory.CreateClient("TMDB");

        var queryParams = HttpUtility.ParseQueryString(string.Empty);

        queryParams["page"] = page.ToString();
        queryParams["vote_average.gte"] = "6";
        queryParams["vote_average.tle"] = "10";
        queryParams["vote_count.gte"] = "300";
        queryParams["with_original_language"] = "en";
        queryParams["with_genres"] = genre;
        queryParams["primary_release_date.gte"] = "2023-01-01";
        
        var queryString = queryParams.ToString();

        using var response =
            await httpClient.GetAsync($"discover/movie?{queryString}");

        if (!response.IsSuccessStatusCode)
        {
            return ResultViewModel<List<SearchViewModel>>.Error("Erro ao se comunicar com a API externa");
        }

        var stream = await response.Content.ReadAsStreamAsync();
        
        var responseBody = JsonSerializer.Deserialize<ResultsInputModel>(stream, _serializerOptions);
        
        if (responseBody is null || responseBody.Results is null)
        {
            return ResultViewModel<List<SearchViewModel>>.Error("Nada encontrado");
        }

        var model = MapFields(responseBody.Results)
            .Select(s => SearchViewModel.FromEntity(s)).ToList();

        return ResultViewModel<List<SearchViewModel>>.Success(model);
    }

    private static List<Person> GetCast(List<Person> cast, int amount)
    {
        return cast.Take(amount).ToList();
    }

    private static (string? userReview, decimal userRating) GetUserReviewAndRating(User user, string searchTitle)
    {
        var review = user.Reviews.SingleOrDefault(r => r.OriginalTitle == searchTitle);
        return review != null ? (review.UserReview, review.UserRating) : (string.Empty, -1);
    }

    private static string MapDirectorName(string mediaType, List<Person> crew)
    {
        if (mediaType != "movie") return string.Empty;

        return crew.FirstOrDefault
            (p => p.Known_For_Department == "Directing" && p.Job == "Director")?.Name ?? string.Empty;
    }

    private static List<ShowInputModel> MapFields(List<ShowInputModel> model)
    {
        model = model
            .Where(s => s.Poster_Path != null &&
                        (s.Release_Date is not null ||
                         s.First_Air_Date is not null))
            .ToList();

        model.ForEach(s =>
        {
            if (s.Original_Title is null)
            {
                s.Original_Title = s.Original_Name;
            }

            if (s.Title is null)
            {
                s.Title = s.Name;
            }

            if (s.Release_Date is null)
            {
                s.Release_Date = s.First_Air_Date;
            }
            
        });
        
        return model;
    }
    
}