﻿using Microsoft.AspNetCore.Mvc;
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

    [HttpGet("search")]
    public async Task<IActionResult> SimpleTitleSearch([FromQuery] string searchTitle, [FromQuery] int? page = 1)
    {
        var result = await _service.SimpleTitleSearch(searchTitle, page);

        if (!result.IsSuccess)
        {
            return BadRequest(new { message = result.Message });
        }

        return Ok(result.Data);
    }

    [HttpGet("detailed")]
    public async Task<IActionResult> GetFullDetailedShow(
        [FromQuery] string searchTitle,
        [FromQuery] string? userName)
    {
        var result = await _service.GetShowWithAllDetails(searchTitle, userName);

        if (!result.IsSuccess)
        {
            return BadRequest(new { message = result.Message });
        }

        return Ok(result.Data);
    }

    [HttpGet("movie/popular")]
    public async Task<IActionResult> GetPopularMovies(
        [FromQuery] string? genre,
        [FromQuery] int? page = 1)
    {
        var result = genre == null ?
            await _service.GetPopularMovies(page) :
            await _service.GetPopularMoviesByGenre(genre, page);

        if (!result.IsSuccess)
        {
            return BadRequest(new { message = result.Message });
        }

        return Ok(result.Data);
    }

    [HttpGet("tv/popular")]
    public async Task<IActionResult> GetPopularSeries([FromQuery] int? page = 1)
    {
        var result = await _service.GetPopularSeries(page);

        if (!result.IsSuccess)
        {
            return BadRequest(new { message = result.Message });
        }

        return Ok(result.Data);
    }
}