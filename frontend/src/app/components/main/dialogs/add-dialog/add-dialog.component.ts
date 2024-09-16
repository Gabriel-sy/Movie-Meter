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
import { MovieSearchDTO } from '../../../../domain/MovieSearchDTO';


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
  shows: MovieSearchDTO[] = []
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
              
              this.shows = res.results.map(movie => movie as MovieSearchDTO).filter(movie => movie.media_type == 'tv' || movie.media_type == 'movie');
              
              //A api retorna filmes com 'title' e series com 'name', mesma coisa com release_date e first_air_date
              for(let i = 0; i < this.shows.length; i++) {
                if(this.shows[i].title == undefined){
                  this.shows[i].title = this.shows[i].name;
                }
                
                if(this.shows[i].release_date == undefined){
                  this.shows[i].release_date = this.shows[i].first_air_date;
                } else if (this.shows[i].first_air_date == undefined){
                  this.shows[i].first_air_date = this.shows[i].release_date;
                }
              }
              
              this.shows = this.shows.filter(movie => movie.title != undefined && movie.release_date != undefined && movie.first_air_date != undefined)
            }
          })
      } else if (length == 0) {
        this.shows = []
      }
    }, 500);
  }

  setInputValue(movie: string) {
    this.inputValue = movie;
    this.formData.patchValue({ show: movie });
    this.shows = []
    this.errorInputMsg = false;
    this.cdr.detectChanges();
  }

}
