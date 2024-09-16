using Tvrating.Application.Models;

namespace Tvrating.Application.Services;

public interface IShowService
{
    Task<List<ShowViewModel>> GetAllShows();
    void SaveShow(CreateShowInputModel model);
}