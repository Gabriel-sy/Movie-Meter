using MovieMeter.Application.Models;
using MovieMeter.Core.Entities;

namespace MovieMeter.Application.Services;

public interface IUserService
{
    Task<ResultViewModel> Register(CreateUserInputModel model);
    Task<ResultViewModel<LoginViewModel?>> Login(LoginInputModel model);
    Task<ResultViewModel<UserViewModel?>> FindById(int id);
    Task<ResultViewModel<UserViewModel?>> FindByUserName(string userName);
    Task<ResultViewModel<User?>> FindByEmail(string email);
    Task<ResultViewModel<UserViewModel?>> FindByEmailWithShows(string email);
    Task<ResultViewModel<User>> UploadProfilePicture(byte[] picture, User user);
}