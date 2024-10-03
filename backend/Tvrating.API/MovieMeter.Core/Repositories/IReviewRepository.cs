using MovieMeter.Core.Entities;
using MovieMeter.Core.Services;

namespace MovieMeter.Core.Repositories;

public interface IReviewRepository
{
    Task<List<Review>> GetAll();
    Task<Review> SaveReview(Review review);
    Task<Review> DeleteReview(Review review);
    Task<Review> EditReview(Review review, string rating, string reviewText);
    Task<Review?> GetById(int id);
    Task<Review?> GetByTitle(string title, int userId);
    Task<PagedList<Review>> GetReviewsByShowOrigTitle(string originalTitle, int pageNumber);
    Task<Review> ChangeLikes(Review review);
    Task<Review?> FindReviewByShowIdAndUserName(int showId, string userName);
    Task<Review?> DeleteUserLike(User user, Review review);
}