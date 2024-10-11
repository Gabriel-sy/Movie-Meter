
using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.OpenApi.Extensions;
using MovieMeter.API.Extensions;
using MovieMeter.Application.Models;
using MovieMeter.Application.Services;
using MovieMeter.Core.Entities;

namespace MovieMeter.API.Controllers;

[ApiController]
[Route("api/review")]
[Authorize]
public class ReviewController : ControllerBase
{
    private readonly IReviewService _service;

    public ReviewController(IReviewService service)
    {
        _service = service;
    }

    [HttpPost]
    public async Task<IActionResult> SaveReview([FromBody]CreateReviewInputModel model)
    {
        var header = HttpContext.User.Claims.Single(c => c.Type == "Name");
        
        var result = await _service.SaveShow(model, header.Value);
        
        if (!result.IsSuccess)
        {
            return BadRequest(result.Message);
        }

        return NoContent();
    }
    
    [HttpGet]
    public async Task<IActionResult> GetAllReviews()
    {
        var shows = await _service.GetAllShows();

        if (!shows.IsSuccess)
        {
            return BadRequest(shows.Message);
        }
        
        return Ok(shows.Data);
    }

    [HttpPut]
    public async Task<IActionResult> EditRating(EditReviewInputModel model)
    {
        var result = await _service.EditShow(model);

        if (!result.IsSuccess)
        {
            return BadRequest(result.Message);
        }

        return NoContent();
    }

    [HttpDelete()]
    public async Task<IActionResult> DeleteReview([FromQuery]int id)
    {
        var result = await _service.DeleteShow(id);
        
        if (!result.IsSuccess)
        {
            return BadRequest(result.Message);
        }

        return NoContent();
    }
    
    [HttpGet("showByToken")]
    public async Task<IActionResult> FindByToken()
    {
        var header = HttpContext.User.Claims.Single(c => c.Type == "Name");

        var user = await _service.GetAllByEmail(header.Value);
        
        if (user.IsSuccess && user.Data != null)
        {
            return Ok(user.Data);
        }

        return BadRequest();

    }
    
    [AllowAnonymous]
    [HttpGet("ordered")]
    public async Task<IActionResult> GetReviewsByOrigTitleOrdered(
        [FromQuery]string originalTitle, 
        [FromQuery]int pageNumber,
        [FromQuery]string order = "desc", 
        [FromQuery]string sortCategory = "rating")
    {
        var result = await _service.GetReviewsByOrigTitleOrdered(originalTitle, pageNumber,
            sortCategory, order);

        if (result.Data != null)
        {
            Response.AddPaginationHeader(new PaginationHeader(result.Data.CurrentPage,
                result.Data.PageSize, result.Data.TotalItems, result.Data.TotalPages));

            return Ok(result.Data);
        }

        return BadRequest("Erro ao processar a requisição");
    }

    [Authorize]
    [HttpPost("changeLike")]
    public async Task<IActionResult> ChangeLikes([FromBody]LikeInputModel model)
    {
        var result = await _service.ChangeLikes(model);

        if (!result.IsSuccess)
        {
            return BadRequest(result.Message);
        }
        
        return Ok(result.Data);
    }

    [AllowAnonymous]
    [HttpGet("recent")]
    public async Task<IActionResult> GetRecentReviews([FromQuery] string userName)
    {
        var result = await _service.FindRecentUserReviews(userName);

        if (!result.IsSuccess)
        {
            return BadRequest(result.Message);
        }

        return Ok(result.Data);
    }

    
}