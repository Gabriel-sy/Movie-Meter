import { ChangeDetectorRef, Component, OnDestroy, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SearchMovieService } from '../../../../services/search-movie.service';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Movie } from '../../../../domain/Movie';
import { CommonModule } from '@angular/common';
import { Results } from '../../../../domain/Results';
import { ShowService } from '../../../../services/show.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';


@Component({
  selector: 'app-add-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatProgressSpinnerModule, CommonModule, ReactiveFormsModule],
  templateUrl: './add-dialog.component.html',
  styleUrl: './add-dialog.component.css'
})
export class AddDialogComponent implements OnDestroy {

  foundMovies: Observable<Results> = new Observable<Results>();
  unsubscribeSignal: Subject<void> = new Subject();
  showToSave: Movie = new Movie()
  timer = setTimeout(() => { }, 0)
  foundShows: Movie[] = []
  titles: string[] = []
  inputValue: string = ''
  errorInputMsg: boolean = false;
  isSubmitted: boolean = false;
  readonly dialog = inject(MatDialog);
  formData = this.fb.group({
    rating: ['', [Validators.required, Validators.pattern('^(10([.]0)?|[0-9]([.][0-9])?)$')]],
    show: [this.inputValue, [Validators.required]]
  })


  constructor(private searchMovieService: SearchMovieService,
    private showService: ShowService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private dialogRef: MatDialogRef<AddDialogComponent>) { }

  ngOnDestroy(): void {
    this.unsubscribeSignal.next()
    this.unsubscribeSignal.unsubscribe()
  }

  saveMovie() {
    if (this.formData.valid) {

      this.searchMovieService.searchTitle(this.inputValue)
        .pipe(takeUntil(this.unsubscribeSignal))
        .subscribe({
          next: (res: Results) => {
            this.foundShows = res.results;
            this.foundShows = this.foundShows.filter(show => show.title == this.inputValue || show.name == this.inputValue)
            this.showToSave = this.foundShows[0] as Movie;

            let showId = this.showToSave.id;

            if (this.showToSave == undefined || this.showToSave == null) {
              this.errorInputMsg = true;
            }
            this.showToSave.user_rating = this.formData.get('rating')?.value as string

            this.searchMovieService.findDirectorName(this.showToSave)
              .pipe(takeUntil(this.unsubscribeSignal))
              .subscribe({
                next: (res: Results) => {
                  for (let i = 0; i < res.crew.length; i++) {
                    if (res.crew[i].known_for_department == "Directing" && res.crew[i].job == "Director") {
                      this.showToSave.directorName = res.crew[i].name;
                    }
                  }
                },
                complete: () => {
                  this.showService.saveShow(this.showToSave)
                    .pipe(takeUntil(this.unsubscribeSignal))
                    .subscribe({
                      next: () => this.dialogRef.close(true),
                      error: () => this.errorInputMsg = true
                    })
                }
              })


          }
        })
    } else {
      this.isSubmitted = true
      this.errorInputMsg = true;
    }
  }

  searchMovie(event: any) {
    clearTimeout(this.timer)

    const length = event.target.value.length

    this.timer = setTimeout(() => {
      if (length > 3) {
        this.foundMovies = this.searchMovieService.searchTitle(event.target.value)
        this.foundMovies
          .pipe(takeUntil(this.unsubscribeSignal))
          .subscribe({
            next: (res: Results) => {
              //Filmes
              this.titles = res.results.map(movie => movie.title);
              //Series
              let tvseries: string[] = res.results.filter(movie => movie.media_type == 'tv').map(movie => movie.name)
              //Juntando os dois (series no começo)
              tvseries = tvseries.concat(this.titles)

              this.titles = tvseries.filter(movie => movie != undefined)
            }
          })
      } else if (length == 0) {
        this.titles = []
      }
    }, 500);
  }

  setInputValue(movie: string) {
    this.inputValue = movie;
    this.formData.patchValue({ show: movie });
    this.titles = []
    this.errorInputMsg = false;
    this.cdr.detectChanges();
  }

}
