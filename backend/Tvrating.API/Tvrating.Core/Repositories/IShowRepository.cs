using Tvrating.Core.Entities;

namespace Tvrating.Core.Repositories;

public interface IShowRepository
{
    Task<List<Show>> GetAll();
    Task SaveShow(Show show);
}