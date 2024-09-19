using Microsoft.AspNetCore.Mvc;
using MovieMeter.Application.Models;
using MovieMeter.Application.Services;

namespace MovieMeter.API.Controllers;

[ApiController]
[Route("api/user")]
public class UserController : ControllerBase
{
    private readonly IUserService _service;

    public UserController(IUserService service)
    {
        _service = service;
    }

    
    [HttpPost("register")]
    public async Task<IActionResult> Register(CreateUserInputModel model)
    {
        var result = await _service.Register(model);

        if (!result.IsSuccess)
        {
            return BadRequest();
        }

        return Created();
    }
    
    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginInputModel model)
    {
        var result = await _service.Login(model);

        if (result.IsSuccess && result.Data != null)
        {
            var token = new { jwt = result.Data.Token, name = result.Data.Name };
            return Ok(token);
        }

        return BadRequest();
    }

    [HttpGet("findByToken")]
    public async Task<IActionResult> FindByToken()
    {
        var header = HttpContext.User.Claims.Single(c => c.Type == "Name");

        var user = await _service.FindByEmail(header.Value);

        if (user.IsSuccess && user.Data != null)
        {
            return Ok(new UserViewModel(user.Data.Name, user.Data.Email, user.Data.Shows));
        }

        return BadRequest();

    }
}