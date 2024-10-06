using MovieMeter.Application.Models;
using MovieMeter.Core.Entities;

namespace MovieMeter.Application.Services;

public interface IFavoriteShowService
{
    Task<ResultViewModel<FavoriteShow>> AddFavoriteShow(CreateFavShowInputModel model);
    Task<ResultViewModel<List<FavoriteShowViewModel>>> FindAllByUserName(string userName);
    Task<ResultViewModel<FavoriteShow>> DeleteFavShow(string userName, string originalTitle);
}