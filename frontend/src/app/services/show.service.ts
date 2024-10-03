import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ShowViewModel } from '../domain/ShowViewModel';
import { ReviewResponse } from '../domain/ReviewResponse';
import { ShowInputModel } from '../domain/ShowInputModel';

@Injectable({
    providedIn: 'root'
})
export class ShowService {
    private readonly API = "https://localhost:44301/"
    constructor(private http: HttpClient) { }

    saveShow(show: ShowInputModel) {
        console.log(show.id)
        var showToSend = {
            ShowId: show.id,
            Title: show.title,
            ReleaseDate: show.release_date,
            Genres: show.genre_ids,
            UserRating: show.user_rating,
            PublicRating: show.vote_average,
            MediaType: show.media_type,
            PosterPath: show.poster_path,
            Overview: show.overview,
            DirectorName: show.directorName,
            OriginalTitle: show.original_title,
            UserReview: show.user_review
        }
        return this.http.post(this.API + 'api/review', showToSend);
    }

    findAllShows() {
        return this.http.get<ShowViewModel[]>(this.API + 'api/review/showByToken')
    }

    deleteShowById(showId: string) {
        return this.http.delete(this.API + 'api/review/' + showId);
    }

    editShowRating(showId: string, userRating: string, userReview: string) {
        let header = new HttpHeaders();
        header = header.set('Content-Type', 'application/json; charset=utf-8')
        var objectToSend = {
            Id: showId,
            Rating: userRating.toString(),
            Review: userReview
        }
        return this.http.put(this.API + 'api/review', objectToSend, { headers: header })
    }

    convertGenres(genres: number[]) {
        let newArr: string[] = [];
        for (let i = 0; i < genres.length; i++) {
            switch (genres[i]) {
                case 28:
                    newArr.push("Ação");
                    break;
                case 12:
                    newArr.push("Aventura");
                    break;
                case 16:
                    newArr.push("Animação");
                    break;
                case 35:
                    newArr.push("Comédia");
                    break;
                case 80:
                    newArr.push("Crime");
                    break;
                case 99:
                    newArr.push("Documentário");
                    break;
                case 18:
                    newArr.push("Drama");
                    break;
                case 10751:
                    newArr.push("Família");
                    break;
                case 14:
                    newArr.push("Fantasia");
                    break;
                case 36:
                    newArr.push("História");
                    break;
                case 27:
                    newArr.push("Terror");
                    break;
                case 10402:
                    newArr.push("Música");
                    break;
                case 9648:
                    newArr.push("Mistério");
                    break;
                case 10749:
                    newArr.push("Romance");
                    break;
                case 878:
                    newArr.push("Ficção científica");
                    break;
                case 10770:
                    newArr.push("Cinema TV");
                    break;
                case 53:
                    newArr.push("Thriller");
                    break;
                case 10752:
                    newArr.push("Guerra");
                    break;
                case 10759:
                    newArr.push("Ação e Aventura");
                    break;
                case 10762:
                    newArr.push("Kids");
                    break;
                case 10763:
                    newArr.push("Notícias");
                    break;
                case 10764:
                    newArr.push("Reality");
                    break;
                case 10765:
                    newArr.push("Ficção científica");
                    newArr.push("Fantasia");
                    break;
                case 10766:
                    newArr.push("Soap");
                    break;
                case 10767:
                    newArr.push("Talk");
                    break;
                case 10768:
                    newArr.push("Guerra e política");
                    break;
                case 37:
                    newArr.push("Faroeste");
                    break;
            }
        }
        return newArr;
    }

    getCommentsByTitle(title: string, page: number) {
        return this.http.get<ShowViewModel[]>(this.API + `api/review/${title}/${page}`)
    }

    getCommentsByTitleOrdered(title: string, page: number, sortCategory?: string, order?: string) {
        return sortCategory && order ?
            this.http.get<ShowViewModel[]>(this.API + `api/review/${title}/${sortCategory}/${order}/${page}`) :
            this.http.get<ShowViewModel[]>(this.API + `api/review/${title}/${page}`)
    }

    getCommentsHeaderByTitle(title: string) {
        return this.http.get<ShowViewModel[]>(this.API + `api/review/${title}/1`, { observe: 'response' })
    }

    changeLikes(request: ShowViewModel, showId: string) {
        var objectToSend = {
            ShowId: showId,
            ReviewUserName: request.reviewUserName,
            LikeUserName: request.likeUserName,
            ReviewText: request.userReview,
            Rating: request.userRating,
            Likes: request.likeAmount,
            IsLiked: request.isLiked
        }

        return this.http.post<ShowViewModel>(this.API + "api/review/changeLike", objectToSend)
    }

}
