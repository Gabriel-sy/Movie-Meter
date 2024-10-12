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
        catchError(err => {
          this.openErrorDialog("Ocorreu um erro ao se comunicar com a API", "Por favor, tente novamente em alguns instantes.")
          return throwError(() => err)
        }),
      )
  }


  openErrorDialog(title: string, subtitle: string) {
    this.dialog.open(ErrorDialogComponent, {
      data: { title: title, subtitle: subtitle }
    })
  }
}
