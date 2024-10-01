using System.Reflection.Metadata;
using MovieMeter.Application.Models;
using MovieMeter.Core.Entities;
using MovieMeter.Core.Repositories;

namespace MovieMeter.Application.Services;

public class ReviewService : IReviewService
{
    private readonly IReviewRepository _repository;
    private readonly IUserService _userService;

    public ReviewService(IReviewRepository repository, IUserService userService)
    {
        _repository = repository;
        _userService = userService;
    }

    public async Task<ResultViewModel<List<ReviewViewModel>>> GetAllShows()
    {
        var shows = await _repository.GetAll();

        var model = shows.Select(s => ReviewViewModel.FromEntity(s)).ToList();

        return ResultViewModel<List<ReviewViewModel>>.Success(model);
    }

    public async Task<ResultViewModel<List<ReviewViewModel>>> GetAllByEmail(string email)
    {
        var user = await _userService.FindByEmail(email);

        if (user.Data != null)
        {
            var shows = await _repository.GetAll();

            var model = shows.Where(r => r.UserId == user.Data.Id)
                .Select(s => ReviewViewModel.FromEntity(s)).ToList();

            return ResultViewModel<List<ReviewViewModel>>.Success(model);
        }
        
        return ResultViewModel<List<ReviewViewModel>>.Error("Usuário não encontrado");
        
    }

    

    public async Task<ResultViewModel> SaveShow(CreateShowInputModel model, string userEmail)
    {
        var user = await _userService.FindByEmail(userEmail);

        if (user.Data != null)
        {
            var userHasShow = await _repository.GetByTitle(model.OriginalTitle, user.Data.Id);

            if (userHasShow is not null)
            {
                return ResultViewModel.Error("Usuário já possui esse titulo");
            }
            
            var showToSave = model.FromEntity(user.Data, user.Data.Id);

            var userReview = model.UserReview != null ? model.UserReview : "";
            
            showToSave.UpdateReviewText(userReview);
            
            await _repository.SaveReview(showToSave);
            
            return ResultViewModel.Success();
        }
        return ResultViewModel.Error("Usuário não encontrado");
    }

    public async Task<ResultViewModel> DeleteShow(int id)
    {
        var show = _repository.GetById(id);

        if (show.Result is null)
        {
            return ResultViewModel.Error("Show não encontrado");
        }
        
        await _repository.DeleteReview(show.Result);
        
        return ResultViewModel.Success();
    }

    public async Task<ResultViewModel> EditShow(EditShowInputModel model)
    {
        var show = _repository.GetById(model.Id);

        if (show.Result is null)
        {
            return ResultViewModel.Error("Show não encontrado");
        }

        await _repository.EditReview(show.Result, model.Rating, model.Review);
        
        return ResultViewModel.Success();
    }

    public async Task<ResultViewModel<List<ReviewViewModel>>> GetReviewsByOrigTitle(string originalTitle)
    {
        var reviews = await _repository.GetReviewsByShowOrigTitle(originalTitle);

        var model = reviews.Select(c => ReviewViewModel.FromEntity(c)).ToList();

        return ResultViewModel<List<ReviewViewModel>>.Success(model);
    }

    public async Task<ResultViewModel<LikeInputModel?>> ChangeLikes(LikeInputModel model)
    {
        var review = await _repository.FindReviewByShowIdAndUserName(model.ShowId, model.ReviewUserName);
        
        if (review == null) return ResultViewModel<LikeInputModel?>.Error("Review não encontrada");
        
        review.UpdateLikeAmount(model.IsLiked, model.LikeUserName);
        
        if (!model.IsLiked)
        {
            Console.WriteLine("NOME DO USUARIO QUE VAI DELETAR A CURTIDA!:" + model.LikeUserName);
            review.RemoveLikeName(model.LikeUserName);
            review.LikeNames.ForEach(n => Console.WriteLine(n));
            await _repository.DeleteUserLike(review.User, review);   
        }
        
        await _repository.ChangeLikes(review);
        
        var returnModel = new LikeInputModel(review.User.Name, review.UserReview, review.UserRating
        , review.LikeAmount, review.IsLiked, review.ShowId);
            
        return ResultViewModel<LikeInputModel?>.Success(returnModel);

    }
}