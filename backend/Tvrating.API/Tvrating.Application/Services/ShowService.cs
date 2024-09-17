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

    public async Task<ResultViewModel<List<ShowViewModel>>> GetAllShows()
    {
        var shows = await _repository.GetAll();

        var model = shows.Select(s => ShowViewModel.FromEntity(s)).ToList();

        return ResultViewModel<List<ShowViewModel>>.Success(model);
    }

    public ResultViewModel SaveShow(CreateShowInputModel model)
    {
        var showToSave = model.FromEntity();

        _repository.SaveShow(showToSave);

        return ResultViewModel.Success();
    }

    public ResultViewModel DeleteShow(int id)
    {
        var show = _repository.GetById(id);

        if (show.Result is null)
        {
            return ResultViewModel.Error("Show não encontrado");
        }
        
        _repository.DeleteShow(show.Result);
        
        return ResultViewModel.Success();
    }

    public ResultViewModel EditUserRating(int id, string rating)
    {
        var show = _repository.GetById(id);

        if (show.Result is null)
        {
            return ResultViewModel.Error("Show não encontrado");
        }

        _repository.EditShowRating(show.Result, rating);
        
        return ResultViewModel.Success();
    }
}