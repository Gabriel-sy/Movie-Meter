import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ShowInputModel } from '../domain/ShowInputModel';
import { Results } from '../domain/Results';

@Injectable({
  providedIn: 'root'
})
export class SearchMovieService {

  private readonly URL = 'https://api.themoviedb.org/3'

  headers = {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxMGQwZjMwMWI4YTMwYzg3MDI2OGY0MzE0MWQ3YTcxMCIsIm5iZiI6MTcyMDY0NzE2MS42OTA0OTksInN1YiI6IjY2OGViYTg0MGQ1ODlkMTMzZWYxNzdkMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.NjzfMPs94DIwgyR9raXICaZ-zT_iiRZIh8VYW6i7SNw'
  }

  constructor(private http: HttpClient) { }

  searchTitle(showName: string, page = 1) {
    return this.http.get<Results>(this.URL + '/search/multi', {
      headers: this.headers,
      params: {
        query: showName,
        language: 'pt-BR',
        page: page
      }
    })

  }

  findDirectorName(show: ShowInputModel, language = 'en-US') {
    return this.http.get<Results>(`https://api.themoviedb.org/3/movie/${show.id}/credits`, {
      headers: this.headers,
      params: {
        language: language
      }
    });
  }

  searchPopularMovies() {
    return this.http.get<Results>("https://api.themoviedb.org/3/movie/popular", {
      headers: this.headers
    });
  }

  searchPopularSeries() {
    return this.http.get<Results>("https://api.themoviedb.org/3/discover/tv", {
      headers: this.headers,
      params: {
        include_null_first_air_dates: false,
        language: 'en-US',
        page: 1,
        sort_by: 'popularity.desc',
        'vote_average.gte': 7,
        'vote_average.lte': 10,
        'vote_count.gte': 1000,
        with_original_language: 'en',
        without_genres: '10767%2C%2035%2C%2010764%2C%2010763%2C%2099',
      },
    });
  }

  searchMoviesByGenre(genre: string, page = 1) {
    return this.http.get<Results>(this.URL + '/discover/movie', {
      headers: this.headers,
      params:
      {
        'include_null_first_air_dates': false,
        'language': 'en-US',
        'page': page,
        'sort_by': 'popularity.desc',
        'vote_average.gte': 7,
        'vote_average.lte': 10,
        'vote_count.gte': 300,
        'with_original_language': 'en',
        'with_genres': genre,
        'primary_release_date.gte': '2023-01-01',

      },
    })
  }

}

