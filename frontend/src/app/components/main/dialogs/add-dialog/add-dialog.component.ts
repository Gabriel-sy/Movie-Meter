import { ChangeDetectorRef, Component, EventEmitter, Inject, OnDestroy, OnInit, Output, ViewEncapsulation, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SearchMovieService } from '../../../../services/search-movie.service';
import { Observable, Subject, catchError, finalize, map, takeUntil, throwError } from 'rxjs';
import { ShowInputModel } from '../../../../domain/ShowInputModel';
import { CommonModule } from '@angular/common';
import { Results } from '../../../../domain/Results';
import { ShowService } from '../../../../services/show.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ShowSearchViewModel } from '../../../../domain/ShowSearchViewModel';
import { FormErrorComponent } from "../../form-error/form-error.component";
import { PopupComponent } from "../../popup/popup.component";
import { SharedService } from '../../../../services/shared.service';

@Component({
  selector: 'app-add-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatProgressSpinnerModule, CommonModule, ReactiveFormsModule, FormErrorComponent, PopupComponent],
  templateUrl: './add-dialog.component.html',
  styleUrl: './add-dialog.component.css'
})
export class AddDialogComponent implements OnDestroy {

  unsubscribeSignal: Subject<void> = new Subject();
  foundSearch$: Observable<ShowSearchViewModel[]> = new Observable<ShowSearchViewModel[]>()
  @Output() popupEvent = new EventEmitter<boolean>();
  showToSave: ShowInputModel = new ShowInputModel()
  genres: string[] = []
  timer = setTimeout(() => { }, 0)
  foundShows: ShowInputModel[] = []
  shows: ShowSearchViewModel[] = []
  inputValue: string = this.data;
  isExpanded: boolean = false;
  isLoading: boolean = false;
  readonly dialog = inject(MatDialog);

  formData = this.fb.group({
    rating: ['', [Validators.required, Validators.pattern('^(10([.]0)?|[0-9]([.][0-9])?)$')]],
    show: [this.inputValue, [Validators.required]],
    review: ['']
  })

  constructor(private searchMovieService: SearchMovieService,
    private showService: ShowService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private dialogRef: MatDialogRef<AddDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string,
    private sharedService: SharedService) { }

  ngOnDestroy(): void {
    this.unsubscribeSignal.next()
    this.unsubscribeSignal.unsubscribe()
  }

  saveMovie() {
    if (this.formData.valid) {
      this.isLoading = true;
      this.searchMovieService.searchTitle(this.inputValue)
        .pipe(takeUntil(this.unsubscribeSignal))
        .subscribe({
          next: (res: Results) => {
            this.foundShows = res.results;
            this.foundShows = this.foundShows.filter(show => show.title == this.inputValue || show.name == this.inputValue)
            this.showToSave = this.foundShows[0] as ShowInputModel;

            this.mapShowToSave()

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
                error: () => {
                  this.isLoading = false
                  this.dialogRef.close("openError")
                },
                complete: () => {
                  this.showService.saveShow(this.showToSave)
                    .pipe(takeUntil(this.unsubscribeSignal))
                    .subscribe({
                      error: () => {
                        this.dialogRef.close("openError")
                        this.isLoading = false
                      },
                      complete: () => {
                        this.dialogRef.close("openSuccess")
                        this.isLoading = false
                      }
                    })
                }
              })
          },
          error: () => {
            this.isLoading = false;
            this.dialogRef.close("openError")
          },
        })
    } else {
      this.formData.markAllAsTouched()
    }
  }

  searchMovie(event: any) {
    clearTimeout(this.timer)

    const length = event.target.value.length

    this.timer = setTimeout(() => {
      if (length > 3) {
        this.foundSearch$ = this.sharedService.searchTitle(event.target.value)
        .pipe(finalize(() => this.isExpanded = true))
      } else if (length == 0) {
        this.foundSearch$ = new Observable<ShowSearchViewModel[]>()
        this.isExpanded = false;
        this.inputValue = '';
      }
    }, 500);
  }

  setInputValue(movie: string) {
    this.inputValue = movie;
    this.formData.patchValue({ show: movie });
    this.foundSearch$ = new Observable<ShowSearchViewModel[]>()
    this.isExpanded = false;
    this.cdr.detectChanges();
  }

  mapShowToSave(){
    if (this.showToSave.release_date == undefined) {
      this.showToSave.release_date = this.showToSave.first_air_date;
    }

    this.showToSave.user_rating = this.formData.get('rating')?.value as string

    this.showToSave.user_review = this.formData.get('review')?.value || '';

    if (this.showToSave.title == undefined) {
      this.showToSave.title = this.showToSave.name;
    }

    if (this.showToSave.original_title == undefined) {
      this.showToSave.original_title = this.showToSave.original_name;
    }
  }

  changeInputColor(fieldName: string) {
    if (this.fieldHasRequiredError(fieldName)) {
      return '#FF6B6B';
    }
    return 'transparent'
  }

  fieldHasRequiredError(fieldName: string) {
    return this.formData.get(fieldName)?.hasError('required') && this.formData.get(fieldName)?.touched;
  }

}
