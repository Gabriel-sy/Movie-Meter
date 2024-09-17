using Tvrating.Application.Models;

namespace Tvrating.Application.Services;

public interface IShowService
{
    Task<ResultViewModel<List<ShowViewModel>>> GetAllShows();
    ResultViewModel SaveShow(CreateShowInputModel model);
    ResultViewModel DeleteShow(int id);
    ResultViewModel EditUserRating(int id, string rating);
}