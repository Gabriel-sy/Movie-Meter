using Tvrating.Application.Models;
using Tvrating.Core.Repositories;

namespace Tvrating.Application.Services;

public class ShowService : IShowService
{
    private readonly IShowRepository _repository;

    public ShowService(IShowRepository repository)
    {
        _repository = repository;
    }

    public async Task<List<ShowViewModel>> GetAllShows()
    {
        var shows = await _repository.GetAll();

        var model = shows.Select(s => ShowViewModel.FromEntity(s)).ToList();

        return model;
    }

    public async void SaveShow(CreateShowInputModel model)
    {
        var showToSave = model.FromEntity();

        await _repository.SaveShow(showToSave);
    }
}