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
        return Ok(shows);
    }
}