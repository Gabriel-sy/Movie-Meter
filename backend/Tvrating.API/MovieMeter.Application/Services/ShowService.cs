using MovieMeter.Application.Models;
using MovieMeter.Core.Entities;
using MovieMeter.Core.Repositories;

namespace MovieMeter.Application.Services;

public class ShowService : IShowService
{
    private readonly IShowRepository _repository;
    private readonly IUserService _userService;

    public ShowService(IShowRepository repository, IUserService userService)
    {
        _repository = repository;
        _userService = userService;
    }

    public async Task<ResultViewModel<List<ShowViewModel>>> GetAllShows()
    {
        var shows = await _repository.GetAll();

        var model = shows.Select(s => ShowViewModel.FromEntity(s)).ToList();

        return ResultViewModel<List<ShowViewModel>>.Success(model);
    }

    public async Task<ResultViewModel> SaveShow(CreateShowInputModel model, string userEmail)
    {
        var user = await _userService.FindByEmail(userEmail);

        if (user.Data != null)
        {
            var showToSave = model.FromEntity(user.Data, user.Data.Id);
            
            await _repository.SaveShow(showToSave);
            
            return ResultViewModel.Success();
        }
        return ResultViewModel.Error("Usuário não encontrado");
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