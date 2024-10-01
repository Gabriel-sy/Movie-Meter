using MovieMeter.Application.Models;

namespace MovieMeter.Application.Services;

public interface IReviewService
{
    Task<ResultViewModel<List<ReviewViewModel>>> GetAllShows();
    Task<ResultViewModel<List<ReviewViewModel>>> GetAllByEmail(string email);
    Task<ResultViewModel> SaveShow(CreateShowInputModel model, string userEmail);
    Task<ResultViewModel> DeleteShow(int id);
    Task<ResultViewModel> EditShow(EditShowInputModel model);
    Task<ResultViewModel<List<ReviewViewModel>>> GetReviewsByOrigTitle(string originalTitle);
    Task<ResultViewModel<LikeInputModel?>> ChangeLikes(LikeInputModel model);
}