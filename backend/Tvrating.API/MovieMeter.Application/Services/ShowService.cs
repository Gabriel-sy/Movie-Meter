using System.Net.Http.Json;
using System.Text.Json;
using MovieMeter.Application.Models;

namespace MovieMeter.Application.Services;

public class ShowService : IShowService
{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly JsonSerializerOptions _serializerOptions = new JsonSerializerOptions
    {
        PropertyNameCaseInsensitive = true
    }; 

    public ShowService(IHttpClientFactory httpClientFactory)
    {
        _httpClientFactory = httpClientFactory;
    }

    public async Task<ResultViewModel<List<SearchViewModel>>> SearchTitle(string searchTitle, int? page = 1)
    {
        var httpClient = _httpClientFactory.CreateClient("TMDB");

        using var response =
            await httpClient.GetAsync($"search/multi?query={searchTitle}&language=pt-BR&page={page}");

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

    private static List<ShowInputModel> MapFields(List<ShowInputModel> model)
    {
        model = model.Where(s => s.Poster_Path != null && s.Media_Type is "tv" or "movie")
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