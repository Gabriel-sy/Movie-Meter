import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Movie } from '../domain/Movie';
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
    // this.http.get<Response>('https://api.themoviedb.org/3/search/multi?query=' + value + '&language=pt-BR&page=1', this.headers).subscribe({
    //   next: (res: Response) => console.log(res.results)
    // })
    return this.http.get<Results>('https://api.themoviedb.org/3/search/multi?query=' + value + '&language=pt-BR&page=1', this.headers)
    
  }

  findDirectorName(show: Movie) {
    if (show.media_type === 'movie') {
      return this.http.get<Results>(`https://api.themoviedb.org/3/movie/${show.id}/credits?language=en-US`, this.headers);
    } else {
      return this.http.get<Results>(`https://api.themoviedb.org/3/tv/${show.id}/credits?language=en-US`, this.headers);
    }
  }

  searchPopularMovies() {
    return this.http.get<Results>("https://api.themoviedb.org/3/movie/popular", this.headers);
  }

  searchPopularSeries(){
    return this.http.get<Results>("https://api.themoviedb.org/3/discover/tv?include_adult=false&include_null_first_air_dates=false&language=en-US&page=1&sort_by=popularity.desc&vote_average.gte=7&vote_average.lte=10&vote_count.gte=1000&with_original_language=en&without_genres=10767%2C%2035%2C%2010764%2C%2010763%2C%2099", this.headers);
  }

}

