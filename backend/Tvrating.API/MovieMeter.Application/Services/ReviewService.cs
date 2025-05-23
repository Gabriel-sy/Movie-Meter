﻿using MovieMeter.Application.Models;
using MovieMeter.Core.Entities;
using MovieMeter.Core.Repositories;
using MovieMeter.Core.Services;

namespace MovieMeter.Application.Services;

public class ReviewService : IReviewService
{
    private readonly IReviewRepository _repository;
    private readonly IUserService _userService;
    private readonly IHttpClientFactory _httpClientFactory;

    public ReviewService(IReviewRepository repository, IUserService userService, IHttpClientFactory httpClientFactory)
    {
        _repository = repository;
        _userService = userService;
        _httpClientFactory = httpClientFactory;
    }

    public async Task<ResultViewModel<List<ReviewViewModel>>> GetAllShows()
    {
        var shows = await _repository.GetAll();

        var model = shows.Select(s => ReviewViewModel.FromEntity(s)).ToList();

        return ResultViewModel<List<ReviewViewModel>>.Success(model);
    }

    public async Task<ResultViewModel<List<MyListReviewViewModel>>> GetAllByEmail(string email)
    {
        var user = await _userService.FindByEmail(email);

        if (user.Data != null)
        {
            var shows = await _repository.GetAllByUserId(user.Data.Id);

            var model = shows
                .Select(s => MyListReviewViewModel.FromEntity(s)).ToList();

            return ResultViewModel<List<MyListReviewViewModel>>.Success(model);
        }

        return ResultViewModel<List<MyListReviewViewModel>>.Error("Usuário não encontrado");

    }


    public async Task<ResultViewModel> SaveShow(CreateReviewInputModel model, string userEmail)
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

    public async Task<ResultViewModel> EditShow(EditReviewInputModel model)
    {
        var show = _repository.GetById(model.Id);

        if (show.Result is null)
        {
            return ResultViewModel.Error("Show não encontrado");
        }

        await _repository.EditReview(show.Result, model.Rating, model.Review);

        return ResultViewModel.Success();
    }

    public async Task<ResultViewModel<PagedList<SimpleReviewViewModel>>> GetReviewsByOrigTitle(string originalTitle,
        int pageNumber)
    {
        var reviews = await _repository.GetReviewsByShowOrigTitle(originalTitle, pageNumber);

        var model = reviews.Select(c => SimpleReviewViewModel.FromEntity(c)).ToList();

        var returnModel = new PagedList<SimpleReviewViewModel>(model, pageNumber, reviews.TotalPages,
            reviews.PageSize, reviews.TotalItems);

        return ResultViewModel<PagedList<SimpleReviewViewModel>>.Success(returnModel);
    }

    public async Task<ResultViewModel<PagedList<SimpleReviewViewModel>>> GetReviewsByOrigTitleOrdered
        (string originalTitle, int pageNumber, string sortCategory, string order)
    {
        var reviews = new PagedList<Review>();

        reviews = (sortCategory, order) switch
        {
            ("rating", "desc") => await _repository.GetReviewsByOrigTitleDescRating
                (originalTitle, pageNumber),
            ("rating", "asc") => await _repository.GetReviewsByOrigTitleAscRating
                (originalTitle, pageNumber),
            ("likes", "desc") => await _repository.GetReviewsByShowOrigTitle
                (originalTitle, pageNumber),
            ("likes", "asc") => await _repository.GetReviewsByOrigTitleAscLike
                (originalTitle, pageNumber),

            _ => throw new InvalidDataException("Categoria inválida")
        };

        var model = reviews.Select(c => SimpleReviewViewModel.FromEntity(c)).ToList();


        var returnModel = new PagedList<SimpleReviewViewModel>(model, pageNumber, reviews.TotalPages,
            reviews.PageSize, reviews.TotalItems);

        return ResultViewModel<PagedList<SimpleReviewViewModel>>.Success(returnModel);
    }


    public async Task<ResultViewModel<LikeInputModel?>> ChangeLikes(LikeInputModel model)
    {
        var review = await _repository.FindReviewByShowIdAndUserName(model.ShowId, model.ReviewUserName);

        if (review == null) return ResultViewModel<LikeInputModel?>.Error("Review não encontrada");

        review.UpdateLikeAmount(model.IsLiked, model.LikeUserName);

        review.User.UpdateTotalLikes(model.IsLiked);

        if (!model.IsLiked)
        {
            review.RemoveLikeName(model.LikeUserName);
            await _repository.DeleteUserLike(review.User, review);
        }

        await _repository.ChangeLikes(review);

        var returnModel = new LikeInputModel(review.User.Name, review.UserReview, review.UserRating
        , review.LikeAmount, review.IsLiked, review.ShowId);

        return ResultViewModel<LikeInputModel?>.Success(returnModel);

    }

    public async Task<ResultViewModel<List<ReviewViewModel>>> FindRecentUserReviews(string username)
    {
        var user = await _userService.FindFullUserByUserName(username);

        if (user.Data is null)
        {
            return ResultViewModel<List<ReviewViewModel>>.Error("Usuário não encontrado");
        }

        var reviews = await _repository.FindRecentUserReviews(user.Data);



        if (reviews is null)
        {
            return ResultViewModel<List<ReviewViewModel>>.Error("Usuário não tem reviews recentes");
        }

        var model = reviews
            .Select(r => ReviewViewModel.FromEntity(r))
            .ToList();

        model = FormatTimes(model);

        return ResultViewModel<List<ReviewViewModel>>.Success(model);
    }

    public List<ReviewViewModel> FormatTimes(List<ReviewViewModel> reviews)
    {
        var timeSinceInt = 0;
        var timeTypeString = "";
        var since = " atrás.";

        reviews.ForEach(r =>
        {
            var timeSince = r.CreatedAt - DateTime.Now;

            if (timeSince.Value.Days == 00 && timeSince.Value.Hours == 00)
            {
                timeSinceInt = Math.Abs(timeSince.Value.Minutes);
                timeTypeString = " Minutos";

            }
            else if (timeSince.Value.Days == 00)
            {
                timeSinceInt = Math.Abs(timeSince.Value.Hours);
                timeTypeString = " Horas";
            }
            else
            {
                timeSinceInt = Math.Abs(timeSince.Value.Days);
                timeTypeString = " Dias";
            }

            r.TimeSinceCreation = timeSinceInt + timeTypeString + since;
        });

        return reviews;
    }
}