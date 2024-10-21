using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MovieMeter.Application.Models;
using MovieMeter.Application.Services;

namespace MovieMeter.API.Controllers;

[Route("api/fav")]
[ApiController]
[Authorize]
public class FavoriteShowController : ControllerBase
{
    public readonly IFavoriteShowService _service;

    public FavoriteShowController(IFavoriteShowService service)
    {
        _service = service;
    }

    [AllowAnonymous]
    [HttpGet]
    public async Task<IActionResult> FindAllByUserName([FromQuery] string userName)
    {
        var result = await _service.FindAllByUserName(userName);

        if (!result.IsSuccess)
        {
            return BadRequest(new { message = result.Message });
        }

        return Ok(result.Data);
    }

    [HttpPost]
    public async Task<IActionResult> AddFavShow(CreateFavShowInputModel model)
    {
        var result = await _service.AddFavoriteShow(model);

        if (!result.IsSuccess)
        {
            return BadRequest(new { message = result.Message });
        }

        return Ok(result.Data);
    }

    [HttpDelete]
    public async Task<IActionResult> DeleteFavShow([FromQuery] string userName, [FromQuery] string originalTitle)
    {
        var result = await _service.DeleteFavShow(userName, originalTitle);

        if (!result.IsSuccess)
        {
            return BadRequest(new { message = result.Message });
        }

        return Ok(result.Data);
    }
}