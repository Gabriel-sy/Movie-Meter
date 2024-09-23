import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Movie } from '../domain/Movie';
import { MovieResponseDTO } from '../domain/MovieResponseDTO';
import { MovieEditRequestDTO } from '../domain/MovieEditRequestDTO';
import { catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShowService {
  private readonly API = "https://localhost:44301/"
  constructor(private http: HttpClient) { }

  saveShow(show: Movie) {
    var showToSend = {
      ShowId: show.id,
      Title: show.title,
      ReleaseDate: show.release_date,
      Genres: show.genre_ids,
      UserRating: show.user_rating.toString(),
      PublicRating: show.vote_average,
      MediaType: show.media_type,
      PosterPath: show.poster_path,
      Overview: show.overview,
      DirectorName: show.directorName,
      OriginalTitle: show.original_title,
      UserReview: show.user_review
    }
    console.log(show.user_rating)
    return this.http.post(this.API + 'api/show', showToSend);
  }

  findAllShows() {
    return this.http.get<MovieResponseDTO[]>(this.API + 'api/show/showByToken')
  }

  deleteShowById(showId: string) {
    return this.http.delete(this.API + 'api/show/' + showId);
  }

  editShowRating(showId: string, userRating: string, userReview: string) {
    let header = new HttpHeaders();
    header = header.set('Content-Type', 'application/json; charset=utf-8')
    var objectToSend = {
        Id: showId,
        Rating: userRating.toString(),
        Review: userReview
    }
    return this.http.put(this.API + 'api/show', objectToSend, { headers: header })
  }

  convertGenres(genres: number[]) {
    let newArr: string[] = [];
    for(let i = 0; i < genres.length; i++){
      switch (genres[i])
            {
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
  
}
