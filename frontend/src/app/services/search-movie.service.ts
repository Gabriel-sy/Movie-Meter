import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Movie } from '../domain/Movie';
import { Observable, map } from 'rxjs';
import { Results } from '../domain/Results';

@Injectable({
  providedIn: 'root'
})
export class SearchMovieService {

  

  constructor(private http: HttpClient) { }

  searchTitle(value: string) {
    const headers = {
      headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxMGQwZjMwMWI4YTMwYzg3MDI2OGY0MzE0MWQ3YTcxMCIsIm5iZiI6MTcyMDY0NzE2MS42OTA0OTksInN1YiI6IjY2OGViYTg0MGQ1ODlkMTMzZWYxNzdkMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.NjzfMPs94DIwgyR9raXICaZ-zT_iiRZIh8VYW6i7SNw'
      }
    }
    return this.http.get<Results>('https://api.themoviedb.org/3/search/multi?query=' + value + '&language=pt-BR&page=1', headers)
  }

  findDirectorName(show: Movie) {
    const headers = {
      headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxMGQwZjMwMWI4YTMwYzg3MDI2OGY0MzE0MWQ3YTcxMCIsIm5iZiI6MTcyNjQ0NDU1MC45MzU0MjksInN1YiI6IjY2OGViYTg0MGQ1ODlkMTMzZWYxNzdkMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.xvPvk3TE5AUp2JpJqM7QeZnnhlfjaHz2dxz5vIEp74o'
      }
    }
  
    if (show.media_type === 'movie') {
      return this.http.get<Results>(`https://api.themoviedb.org/3/movie/${show.id}/credits?language=en-US`, headers);
    } else {
      return this.http.get<Results>(`https://api.themoviedb.org/3/tv/${show.id}/credits?language=en-US`, headers);
    }
  }
  
}

