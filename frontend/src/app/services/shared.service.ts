import { Injectable, inject } from '@angular/core';
import { SearchMovieService } from './search-movie.service';
import { ShowSearchViewModel } from '../domain/ShowSearchViewModel';
import { catchError, map, throwError } from 'rxjs';
import { ErrorDialogComponent } from '../components/main/dialogs/error-dialog/error-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  tmpShows: ShowSearchViewModel[] = []
  readonly dialog = inject(MatDialog);

  constructor(private searchMovieService: SearchMovieService) { }

  searchTitle(searchTitle: string) {
    return this.searchMovieService.searchTitle(searchTitle)
      .pipe(
        map((res) => {
          
          this.tmpShows = res.results.map(movie => movie as ShowSearchViewModel).filter(movie => movie.media_type == 'tv' || movie.media_type == 'movie');

          this.mapTmpShows()

          this.tmpShows = this.tmpShows.filter(movie => movie.poster_path != undefined)

          this.tmpShows = this.tmpShows.filter(movie => movie.title != undefined && movie.release_date != undefined && movie.first_air_date != undefined)

          return this.tmpShows
        }),
        catchError(err => {
          this.openErrorDialog("Ocorreu um erro ao se comunicar com a API", "Por favor, tente novamente em alguns instantes.")
          return throwError(() => err)
        }),
      )
  }

  mapTmpShows(){
    //A api retorna filmes com 'title' e series com 'name', mesma coisa com release_date e first_air_date
    for (let i = 0; i < this.tmpShows.length; i++) {
      if (this.tmpShows[i].title == undefined) {
        this.tmpShows[i].title = this.tmpShows[i].name;
      }

      if (this.tmpShows[i].original_title == undefined) {
        this.tmpShows[i].original_title = this.tmpShows[i].original_name
      }

      if (this.tmpShows[i].release_date == undefined) {
        this.tmpShows[i].release_date = this.tmpShows[i].first_air_date;
      } else if (this.tmpShows[i].first_air_date == undefined) {
        this.tmpShows[i].first_air_date = this.tmpShows[i].release_date;
      }
    }
  }

  openErrorDialog(title: string, subtitle: string) {
    this.dialog.open(ErrorDialogComponent, {
      data: { title: title, subtitle: subtitle }
    })
  }
}
