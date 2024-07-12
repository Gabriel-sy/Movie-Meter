import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Movie } from '../domain/Movie';
import { MovieResponseDTO } from '../domain/MovieResponseDTO';
import { MovieEditRequestDTO } from '../domain/MovieEditRequestDTO';

@Injectable({
  providedIn: 'root'
})
export class ShowService {
  private readonly API = 'http://localhost:8080/'
  constructor(private http: HttpClient) { }

  saveShow(show: Movie) {
    return this.http.post(this.API + 'shows/save', show);
  }

  findAllShows() {
    return this.http.get<MovieResponseDTO[]>(this.API + 'shows')
  }

  deleteShowById(showId: string) {
    return this.http.delete(this.API + 'shows/' + showId);
  }

  editShowRating(showId: string, userRating: string) {
    let header = new HttpHeaders();
    header = header.set('Content-Type', 'application/json; charset=utf-8')
    var json = JSON.stringify({ id: showId, userRating: userRating })
    return this.http.put(this.API + 'shows', json, { headers: header })
  }
}
