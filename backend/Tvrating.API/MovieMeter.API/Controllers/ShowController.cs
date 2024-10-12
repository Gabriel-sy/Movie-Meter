using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MovieMeter.Application.Services;

namespace MovieMeter.API.Controllers;

[ApiController]
[Route("api/show")]
public class ShowController : ControllerBase
{
    private readonly IShowService _service;

    public ShowController(IShowService service)
    {
        _service = service;
    }

    [AllowAnonymous]
    [HttpGet("search")]
    public async Task<IActionResult> SearchTitle([FromQuery]string searchTitle, [FromQuery]int? page = 1)
    {
        var result = await _service.SimpleTitleSearch(searchTitle, page);

        if (!result.IsSuccess)
        {
            return BadRequest(result.Message);
        }

        return Ok(result.Data);
    }
}