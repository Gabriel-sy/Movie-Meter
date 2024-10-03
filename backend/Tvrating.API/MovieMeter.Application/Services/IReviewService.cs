using MovieMeter.Application.Models;
using MovieMeter.Core.Services;

namespace MovieMeter.Application.Services;

public interface IReviewService
{
    Task<ResultViewModel<List<ReviewViewModel>>> GetAllShows();
    Task<ResultViewModel<List<ReviewViewModel>>> GetAllByEmail(string email);
    Task<ResultViewModel> SaveShow(CreateShowInputModel model, string userEmail);
    Task<ResultViewModel> DeleteShow(int id);
    Task<ResultViewModel> EditShow(EditShowInputModel model);
    Task<ResultViewModel<PagedList<SimpleReviewViewModel>>> GetReviewsByOrigTitle(string originalTitle, int pageNumber);
    Task<ResultViewModel<LikeInputModel?>> ChangeLikes(LikeInputModel model);
}