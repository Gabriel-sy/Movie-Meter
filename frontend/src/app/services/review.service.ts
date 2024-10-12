import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReviewViewModel } from '../domain/ReviewViewModel';
import { FullShowViewModel } from '../domain/FullShowViewModel';

@Injectable({
    providedIn: 'root'
})
export class ReviewService {
    private readonly API = "https://localhost:44301/api/review"
    constructor(private http: HttpClient) { }

    saveReview(show: FullShowViewModel) {
        var showToSend = {
            ShowId: show.showId,
            Title: show.translatedTitle,
            ReleaseDate: show.releaseDate,
            Genres: show.genreNames,
            UserRating: show.userRating,
            PublicRating: show.voteAverage,
            MediaType: show.mediaType,
            PosterPath: show.posterPath,
            Overview: show.overview,
            DirectorName: show.directorName,
            OriginalTitle: show.originalTitle,
            UserReview: show.userReview
        }
        return this.http.post(this.API, showToSend);
    }

    findAllUserReviews() {
        return this.http.get<ReviewViewModel[]>(this.API + '/showByToken')
    }

    deleteReviewById(showId: string) {
        return this.http.delete(this.API, {
            params: {
                id: showId
            }
        });
    }

    editReviewRating(showId: string, userRating: string, userReview: string) {
        let header = new HttpHeaders();
        header = header.set('Content-Type', 'application/json; charset=utf-8')
        var objectToSend = {
            Id: showId,
            Rating: userRating.toString(),
            Review: userReview
        }
        return this.http.put(this.API, objectToSend, { headers: header })
    }

    getCommentsByTitle(title: string, page: number, sortCategory?: string, order?: string) {
        return sortCategory && order ?
            this.http.get<ReviewViewModel[]>(this.API + "/ordered", {
                params: {
                    originalTitle: title,
                    pageNumber: page,
                    order: order,
                    sortCategory: sortCategory
                }
            }) :
            this.http.get<ReviewViewModel[]>(this.API + "/ordered", {
                params: {
                    originalTitle: title,
                    pageNumber: page
                }
            })
    }

    getCommentsHeaderByTitle(title: string) {
        return this.http.get<ReviewViewModel[]>(this.API + "/ordered", {
            observe: 'response',
            params: {
                originalTitle: title,
                pageNumber: 1
            }
        })
    }

    changeLikes(request: ReviewViewModel, showId: string) {
        var objectToSend = {
            ShowId: showId,
            ReviewUserName: request.reviewUserName,
            LikeUserName: request.likeUserName,
            ReviewText: request.userReview,
            Rating: request.userRating,
            Likes: request.likeAmount,
            IsLiked: request.isLiked
        }

        return this.http.post<ReviewViewModel>(this.API + "/changeLike", objectToSend)
    }

    getRecentUserReviews(userName: string) {
        return this.http.get<ReviewViewModel[]>(this.API + '/recent', {
            params: {
                userName: userName
            }
        })
    }

}
