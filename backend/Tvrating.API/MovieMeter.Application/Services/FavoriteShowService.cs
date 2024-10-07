using MovieMeter.Application.Models;
using MovieMeter.Core.Entities;
using MovieMeter.Core.Repositories;

namespace MovieMeter.Application.Services;

public class FavoriteShowService : IFavoriteShowService
{
    private readonly IFavoriteShowRepository _repository;
    private readonly IUserService _userService;

    public FavoriteShowService(IFavoriteShowRepository repository, IUserService userService)
    {
        _repository = repository;
        _userService = userService;
    }

    public async Task<ResultViewModel<FavoriteShow>> AddFavoriteShow(CreateFavShowInputModel model)
    {
        var user = await _userService.FindFullUserByUserName(model.UserName);

        if (user.Data is null)
        {
            return ResultViewModel<FavoriteShow>.Error(user.Message);
        }

        var favoriteShow = new FavoriteShow(model.OriginalTitle, model.PosterPath, user.Data, user.Data.Id);
        
        await _repository.AddFavoriteShow(favoriteShow);
        
        return ResultViewModel<FavoriteShow>.Success(favoriteShow);
    }

    public async Task<ResultViewModel<List<FavoriteShowViewModel>>> FindAllByUserName(string userName)
    {
        var result = await _repository.FindFavoriteShowsByUserName(userName);

        var returnModel = result
            .Select(f => FavoriteShowViewModel.FromEntity(f))
            .ToList();

        return ResultViewModel<List<FavoriteShowViewModel>>.Success(returnModel);
    }

    public async Task<ResultViewModel<FavoriteShow>> DeleteFavShow(string userName, string originalTitle)
    {
        var user = await _userService.FindFullUserByUserName(userName);

        if (user.Data is null)
        {
            return ResultViewModel<FavoriteShow>.Error("Usuário não encontrado");
        }
        
        var favShow = await _repository.FindFavoriteShowByUser(user.Data, originalTitle);
        
        if (favShow is null)
        {
            return ResultViewModel<FavoriteShow>.Error("Título favorito não encontrado");
        }

        await _repository.DeleteFavoriteShow(favShow);
        
        return ResultViewModel<FavoriteShow>.Success(favShow);
    }
}