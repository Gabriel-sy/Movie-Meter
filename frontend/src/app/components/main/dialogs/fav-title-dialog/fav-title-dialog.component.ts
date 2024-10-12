import { CommonModule } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Observable, Subject, Subscription, finalize, map, takeUntil } from 'rxjs';
import { SharedService } from '../../../../services/shared.service';
import { ShowSearchViewModel } from '../../../../domain/ShowSearchViewModel';
import { FavShowService } from '../../../../services/fav-show.service';
import { LocalStorageService } from '../../../../services/local-storage.service';
import { FavShowInputModel } from '../../../../domain/FavShowInputModel';
import { SearchMovieService } from '../../../../services/search-movie.service';

@Component({
  selector: 'app-fav-title-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, CommonModule],
  templateUrl: './fav-title-dialog.component.html',
  styleUrl: './fav-title-dialog.component.css'
})
export class FavTitleDialogComponent implements OnDestroy {
  foundSearch$: Observable<ShowSearchViewModel[]> = new Observable<ShowSearchViewModel[]>();
  showToSave: ShowSearchViewModel = new ShowSearchViewModel()
  unsubscribeSignal: Subject<void> = new Subject();
  timer = setTimeout(() => { }, 0);
  isLoading: boolean = false;
  inputValue: string = '';
  userName: string = ''
  originalTitle: string = ''
  posterPath: string = ''
  isExpanded: boolean = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: string,
    private dialogRef: MatDialogRef<FavTitleDialogComponent>,
    private sharedService: SharedService,
    private favShowService: FavShowService,
    private localStorageService: LocalStorageService,
    private searchMovieService: SearchMovieService) { }

  ngOnDestroy(): void {
    this.unsubscribeSignal.next()
    this.unsubscribeSignal.unsubscribe()
  }

  searchMovie(event: any) {
    clearTimeout(this.timer)

    const length = event.target.value.length

    this.timer = setTimeout(() => {
      if (length > 3) {
        this.foundSearch$ = this.searchMovieService.searchTitle(event.target.value)
          .pipe(
            finalize(() => this.isExpanded = true),
            takeUntil(this.unsubscribeSignal))
      } else if (length == 0) {
        this.foundSearch$ = new Observable<ShowSearchViewModel[]>()
        this.isExpanded = false;
        this.inputValue = '';
      }
    }, 500);
  }

  setInputValue(title: string) {
    this.inputValue = title

    this.userName = this.localStorageService.get('userName')

    this.searchMovieService.searchTitle(title)
      .pipe(map((res: ShowSearchViewModel[]) => {
        res = res.filter(show => show.originalTitle == this.inputValue)
        this.showToSave = res[0]

        this.originalTitle = this.showToSave.originalTitle
        this.posterPath = this.showToSave.posterPath

        let objToSend: FavShowInputModel = {
          originalTitle: this.originalTitle,
          posterPath: this.posterPath,
          userName: this.userName
        }
        this.favShowService.addFavShow(objToSend).subscribe({next: () => console.log('aaaaa')})
      }), takeUntil(this.unsubscribeSignal))

      .subscribe({
        complete: () => this.dialogRef.close()
      })

  }
}
