using MovieMeter.Core.Entities;

namespace MovieMeter.Core.Repositories;

public interface IShowRepository
{
    Task<List<Show>> GetAll();
    Task<Show> SaveShow(Show show);
    Task<Show> DeleteShow(Show show);
    Task<Show> EditShowRating(Show show, string rating);
    Task<Show?> GetById(int id);
}