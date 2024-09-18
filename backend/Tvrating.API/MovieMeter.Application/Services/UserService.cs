using MovieMeter.Application.Models;
using MovieMeter.Core.Entities;
using MovieMeter.Core.Exceptions;
using MovieMeter.Core.Repositories;
using MovieMeter.Core.Services;

namespace MovieMeter.Application.Services;

public class UserService : IUserService
{
    private readonly IUserRepository _repository;
    private readonly IAuthService _authService;

    public UserService(IUserRepository repository, IAuthService authService)
    {
        _repository = repository;
        _authService = authService;
    }

    public async Task<ResultViewModel> Register(CreateUserInputModel model)
    {
        model.Password = _authService.EncryptPassword(model.Password);
        
        var user = model.FromEntity();
        
        var result = await _repository.Register(user);

        if (result is null)
        {
            return ResultViewModel.Success(); 
        }
        
        return ResultViewModel.Error("Email já existe");
    }

    public async Task<ResultViewModel<string?>> Login(LoginInputModel model)
    {
        var encryptedPassowrd = _authService.EncryptPassword(model.Password);

        var user = await _repository.GetUserByEmailAndPassword(model.Email, encryptedPassowrd);

        if (user is null)
        {
            return ResultViewModel<string?>.Error("Email ou senha inválidos");
        }

        var token = _authService.GenerateJwtToken(user.Email, user.Role);
        
        return ResultViewModel<string?>.Success(token);
    }

    public async Task<ResultViewModel<User?>> FindById(int id)
    {
        var user = await _repository.FindById(id);

        if (user is null)
        {
            return ResultViewModel<User?>.Error("Usuário não encontrado");
        }
        
        return ResultViewModel<User?>.Success(user);
    }

    public async Task<ResultViewModel<User?>> FindByEmail(string email)
    {
        var user = await _repository.FindByEmail(email);

        if (user is null)
        {
            return ResultViewModel<User?>.Error("Usuário não encontrado");
        }
        
        return ResultViewModel<User?>.Success(user);
    }
}