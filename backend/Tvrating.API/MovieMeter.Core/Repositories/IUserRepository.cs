using MovieMeter.Core.Entities;

namespace MovieMeter.Core.Repositories;

public interface IUserRepository
{
    Task<User?> Register(User user);
    Task<User?> GetUserByEmailAndPassword(string email, string password);
    Task<User?> FindByEmail(string email);
    Task<User?> FindByEmailWithShows(string email);
    Task<User?> FindById(int id);
    Task<User?> FindByUserName(string userName);
    Task<User?> UploadProfilePicture(User user);
    Task<User> EditUserDetails(User user);
}