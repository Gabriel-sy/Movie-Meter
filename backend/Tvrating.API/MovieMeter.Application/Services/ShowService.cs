using MovieMeter.Application.Models;
using MovieMeter.Core.Repositories;

namespace MovieMeter.Application.Services;

public class ShowService : IShowService
{
    private readonly IShowRepository _repository;

    public ShowService(IShowRepository repository)
    {
        _repository = repository;
    }

    public async Task<ResultViewModel<List<ShowViewModel>>> GetAllShows()
    {
        var shows = await _repository.GetAll();

        var model = shows.Select(s => ShowViewModel.FromEntity(s)).ToList();

        return ResultViewModel<List<ShowViewModel>>.Success(model);
    }

    public async Task<ResultViewModel> SaveShow(CreateShowInputModel model)
    {
        var showToSave = model.FromEntity();

        await _repository.SaveShow(showToSave); 

        return ResultViewModel.Success();
    }

    public async Task<ResultViewModel> DeleteShow(int id)
    {
        var show = _repository.GetById(id);

        if (show.Result is null)
        {
            return ResultViewModel.Error("Show não encontrado");
        }
        
        await _repository.DeleteShow(show.Result);
        
        return ResultViewModel.Success();
    }

    public async Task<ResultViewModel> EditUserRating(int id, string rating)
    {
        var show = _repository.GetById(id);

        if (show.Result is null)
        {
            return ResultViewModel.Error("Show não encontrado");
        }

        await _repository.EditShowRating(show.Result, rating);
        
        return ResultViewModel.Success();
    }
}