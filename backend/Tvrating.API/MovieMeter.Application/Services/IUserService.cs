using MovieMeter.Application.Models;
using MovieMeter.Core.Entities;

namespace MovieMeter.Application.Services;

public interface IUserService
{
    Task<ResultViewModel> Register(CreateUserInputModel model);
    Task<ResultViewModel<LoginViewModel?>> Login(LoginInputModel model);
    Task<ResultViewModel<User?>> FindById(int id);
    Task<ResultViewModel<User?>> FindByEmail(string email);
}