using Microsoft.AspNetCore.Mvc;
using Tvrating.Application.Models;
using Tvrating.Application.Services;

namespace Tvrating.API.Controllers;

[ApiController]
[Route("api/show")]
public class ShowController : ControllerBase
{
    private readonly IShowService _service;

    public ShowController(IShowService service)
    {
        _service = service;
    }

    [HttpPost]
    public ActionResult SaveShow(CreateShowInputModel model)
    {
        _service.SaveShow(model);

        return NoContent();
    }

    [HttpGet]
    public async Task<IActionResult> GetAllShows()
    {
        var shows = await _service.GetAllShows();

        if (!shows.IsSuccess)
        {
            return BadRequest(shows.Message);
        }
        
        return Ok(shows.Data);
    }

    [HttpPut("{id}")]
    public IActionResult EditRating(int id, [FromBody] string rating)
    {
        var result = _service.EditUserRating(id, rating);

        if (!result.IsSuccess)
        {
            return BadRequest(result.Message);
        }

        return NoContent();
    }

    [HttpDelete("{id}")]
    public IActionResult DeleteShow(int id)
    {
        var result = _service.DeleteShow(id);
        
        if (!result.IsSuccess)
        {
            return BadRequest(result.Message);
        }

        return NoContent();
    }
}