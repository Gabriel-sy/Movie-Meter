import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ShowSearchViewModel } from '../domain/ShowSearchViewModel';

@Injectable({
  providedIn: 'root'
})
export class SearchMovieService {

  private readonly API = 'https://localhost:44301/api/show'

  

  constructor(private http: HttpClient) { }

  searchTitle(search: string, page = 1) {
      return this.http.get<ShowSearchViewModel[]>(this.API + '/search', {
        params: {
          searchTitle: search,
          page: page
        }
      })
  }

  searchPopularMovies(page = 1) {
    return this.http.get<ShowSearchViewModel[]>(this.API + '/movie/popular', {
      params: {
        page: page
      }
    })
  }

  searchPopularSeries(page = 1) {
    return this.http.get<ShowSearchViewModel[]>(this.API + '/tv/popular', {
      params: {
        page: page
      }
    })
  }

  searchMoviesByGenre(genre: string, page = 1) {
    return this.http.get<ShowSearchViewModel[]>(this.API + '/movie/popular', {
      params: {
        genre: genre,
        page: page
      }
    })
  }

}

