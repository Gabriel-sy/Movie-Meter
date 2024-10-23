import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ShowSearchViewModel } from '../domain/ShowSearchViewModel';
import { FullShowViewModel } from '../domain/FullShowViewModel';
import { environment } from '../../environments/environment';
import { catchError, throwError } from 'rxjs';
import { PopupService } from './popup.service';

@Injectable({
  providedIn: 'root'
})
export class SearchMovieService {

  private readonly API = environment.API + "/api/show";

  constructor(private http: HttpClient,
    private popupService: PopupService) { }

  getFullDetailShow(search: string, userName?: string){
    return userName != undefined ?
      this.http.get<FullShowViewModel>(this.API + "/detailed", {
        params: {
          searchTitle: search,
          userName: userName
        }
      }) :
      this.http.get<FullShowViewModel>(this.API + '/detailed', {
        params: {
          searchTitle: search
        }
      })
  }

  searchTitle(search: string, page = 1) {
      return this.http.get<ShowSearchViewModel[]>(this.API + '/search', {
        params: {
          searchTitle: search,
          page: page
        }
      }).pipe(catchError(err => {
        this.popupService.showError("Ocorreu um erro", "Houve um erro interno ao pesquisar, tente novamente mais tarde.")
        return throwError(() => new Error())
      }))
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

