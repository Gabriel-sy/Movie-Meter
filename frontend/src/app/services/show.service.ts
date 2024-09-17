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
      UserRating: show.user_rating,
      PublicRating: show.vote_average,
      MediaType: show.media_type,
      PosterPath: show.poster_path,
      Overview: show.overview,
      DirectorName: show.directorName
    }
    console.log(show.genre_ids)
    return this.http.post(this.API + 'api/show', showToSend);
  }

  findAllShows() {
    return this.http.get<MovieResponseDTO[]>(this.API + 'api/show')
  }

  deleteShowById(showId: string) {
    return this.http.delete(this.API + 'api/show/' + showId);
  }

  editShowRating(showId: string, userRating: string) {
    let header = new HttpHeaders();
    header = header.set('Content-Type', 'application/json; charset=utf-8')
    var json = JSON.stringify({ Id: showId, Rating: userRating as unknown as number })
    return this.http.put(this.API + 'api/show', json, { headers: header })
  }
}
