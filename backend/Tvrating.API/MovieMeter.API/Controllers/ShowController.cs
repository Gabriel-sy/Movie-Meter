
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.OpenApi.Extensions;
using MovieMeter.Application.Models;
using MovieMeter.Application.Services;

namespace MovieMeter.API.Controllers;

[ApiController]
[Route("api/show")]
[Authorize]
public class ShowController : ControllerBase
{
    private readonly IShowService _service;

    public ShowController(IShowService service)
    {
        _service = service;
    }

    [HttpPost]
    public async Task<IActionResult> SaveShow([FromBody]CreateShowInputModel model)
    {
        var result = await _service.SaveShow(model);

        if (!result.IsSuccess)
        {
            return BadRequest(result.Message);
        }

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

    [HttpPut]
    public async Task<IActionResult> EditRating(EditShowInputModel model)
    {
        var result = await _service.EditUserRating(model.Id, model.Rating);

        if (!result.IsSuccess)
        {
            return BadRequest(result.Message);
        }

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteShow(int id)
    {
        var result = await _service.DeleteShow(id);
        
        if (!result.IsSuccess)
        {
            return BadRequest(result.Message);
        }

        return NoContent();
    }
}