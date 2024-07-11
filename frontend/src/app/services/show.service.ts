import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Movie } from '../domain/Movie';
import { Observable } from 'rxjs';
import { MovieResponseDTO } from '../domain/MovieResponseDTO';

@Injectable({
  providedIn: 'root'
})
export class ShowService {
  private readonly API = 'http://localhost:8080/'
  constructor(private http: HttpClient) { }

  saveShow(show: Movie){
    return this.http.post(this.API + 'shows/save', show);
  }

  findAllShows(){
    return this.http.get<MovieResponseDTO[]>(this.API + 'shows')
  }
}
