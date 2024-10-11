using MovieMeter.Application.Models;
using MovieMeter.Core.Services;

namespace MovieMeter.Application.Services;

public interface IReviewService
{
    Task<ResultViewModel<List<ReviewViewModel>>> GetAllShows();
    Task<ResultViewModel<List<ReviewViewModel>>> GetAllByEmail(string email);
    Task<ResultViewModel> SaveShow(CreateReviewInputModel model, string userEmail);
    Task<ResultViewModel> DeleteShow(int id);
    Task<ResultViewModel> EditShow(EditReviewInputModel model);
    Task<ResultViewModel<PagedList<SimpleReviewViewModel>>> GetReviewsByOrigTitle(
        string originalTitle, int pageNumber);
    Task<ResultViewModel<PagedList<SimpleReviewViewModel>>> GetReviewsByOrigTitleOrdered(
        string originalTitle,
        int pageNumber, string sortCategory, string order);
    Task<ResultViewModel<LikeInputModel?>> ChangeLikes(LikeInputModel model);
    Task<ResultViewModel<List<ReviewViewModel>>> FindRecentUserReviews(string username);
}