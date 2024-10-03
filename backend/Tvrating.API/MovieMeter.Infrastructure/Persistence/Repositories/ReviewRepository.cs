using Microsoft.EntityFrameworkCore;
using MovieMeter.Core.Entities;
using MovieMeter.Core.Repositories;
using MovieMeter.Core.Services;

namespace MovieMeter.Infrastructure.Persistence.Repositories;

public class ReviewRepository : IReviewRepository
{
    private readonly MovieMeterDbContext _context;

    public ReviewRepository(MovieMeterDbContext context)
    {
        _context = context;
    }

    public async Task<List<Review>> GetAll()
    {
        var review = await _context.Reviews
            .Where(p => !p.IsDeleted)
            .ToListAsync();

        return review;
    }

    public async Task<Review> SaveReview(Review review)
    {
        await _context.Reviews.AddAsync(review);
        await _context.SaveChangesAsync();
        return review;
    }

    public async Task<Review> DeleteReview(Review review)
    {
        review.SetAsDeleted();
        _context.Reviews.Update(review);
        await _context.SaveChangesAsync();
        return review;
    }

    public async Task<Review> EditReview(Review review, string rating, string reviewText)
    {
        review.UpdateRating(rating);
        review.UpdateReviewText(reviewText);

        _context.Reviews.Update(review);
        await _context.SaveChangesAsync();
        return review;
    }

    public async Task<Review?> GetById(int id)
    {
        var review = await _context.Reviews.SingleOrDefaultAsync(s => s.Id == id && !s.IsDeleted);
        return review;
    }

    public async Task<Review?> GetByTitle(string title, int userId)
    {
        var review = await _context.Reviews.SingleOrDefaultAsync(s => s.OriginalTitle == title
                                                                    && s.UserId == userId                                                          
                                                                    && !s.IsDeleted);
        
        return review;
    }

    public async Task<PagedList<Review>> GetReviewsByShowOrigTitle(string originalTitle, int pageNumber)
    {
        var query = _context.Reviews
            .Where(c => c.OriginalTitle == originalTitle && !c.IsDeleted)
            .Include(c => c.User)
            .AsQueryable();

        return await PaginationHelper.CreateAsync(query, pageNumber, 10);
    }

    public async Task<Review> ChangeLikes(Review review)
    {
        
        _context.Reviews.Update(review);
        _context.Users.Update(review.User);
        await _context.SaveChangesAsync();
        
        return review;
    }

    public async Task<Review?> FindReviewByShowIdAndUserName(int showId, string userName)
    {
        var review = await _context.Reviews
            .Include(r => r.User)
            .SingleOrDefaultAsync(r => r.ShowId == showId && r.User.Name == userName
                                                              && !r.IsDeleted);
        return review;
    }

    public async Task<Review?> DeleteUserLike(User user, Review review)
    {
        _context.Users.Update(user);
        _context.Reviews.Update(review);
        await _context.SaveChangesAsync();

        return review;
    }
}