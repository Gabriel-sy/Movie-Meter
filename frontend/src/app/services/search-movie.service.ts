import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Movie } from '../domain/Movie';
import { Observable, map } from 'rxjs';
import { Results } from '../domain/Results';

@Injectable({
  providedIn: 'root'
})
export class SearchMovieService {

  headers = {
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxMGQwZjMwMWI4YTMwYzg3MDI2OGY0MzE0MWQ3YTcxMCIsIm5iZiI6MTcyMDY0NzE2MS42OTA0OTksInN1YiI6IjY2OGViYTg0MGQ1ODlkMTMzZWYxNzdkMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.NjzfMPs94DIwgyR9raXICaZ-zT_iiRZIh8VYW6i7SNw'
    }
  }

  constructor(private http: HttpClient) { }

  searchTitle(value: string) {

    return this.http.get<Results>('https://api.themoviedb.org/3/search/multi?query=' + value + '&language=pt-BR&page=1', this.headers)
  }

  findDirectorName(show: Movie) {
    if (show.media_type === 'movie') {
      return this.http.get<Results>(`https://api.themoviedb.org/3/movie/${show.id}/credits?language=en-US`, this.headers);
    } else {
      return this.http.get<Results>(`https://api.themoviedb.org/3/tv/${show.id}/credits?language=en-US`, this.headers);
    }
  }

  searchPopular() {
    return this.http.get<Results>("https://api.themoviedb.org/3/movie/popular", this.headers);
  }

}

