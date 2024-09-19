using MovieMeter.Application.Models;

namespace MovieMeter.Application.Services;

public interface IShowService
{
    Task<ResultViewModel<List<ShowViewModel>>> GetAllShows();
    Task<ResultViewModel> SaveShow(CreateShowInputModel model, string userEmail);
    Task<ResultViewModel> DeleteShow(int id);
    Task<ResultViewModel> EditUserRating(int id, string rating);
    
}