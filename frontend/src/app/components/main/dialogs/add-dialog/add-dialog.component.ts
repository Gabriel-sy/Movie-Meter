import { ChangeDetectorRef, Component, Inject, OnDestroy, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SearchMovieService } from '../../../../services/search-movie.service';
import { Observable, Subject, finalize, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ShowSearchViewModel } from '../../../../domain/ShowSearchViewModel';
import { FormErrorComponent } from "../../form-error/form-error.component";
import { PopupComponent } from "../../popup/popup.component";
import { ReviewService } from '../../../../services/review.service';
import { FullShowViewModel } from '../../../../domain/FullShowViewModel';
import { HttpErrorResponse } from '@angular/common/http';

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
  genres: string[] = []
  timer = setTimeout(() => { }, 0)
  foundShow: FullShowViewModel = new FullShowViewModel()
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
    private reviewService: ReviewService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private dialogRef: MatDialogRef<AddDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string) { }

  ngOnDestroy(): void {
    this.unsubscribeSignal.next()
    this.unsubscribeSignal.unsubscribe()
  }

  saveMovie() {
    if (this.formData.valid) {
      this.isLoading = true;
      this.searchMovieService.getFullDetailShow(this.inputValue)
        .pipe(takeUntil(this.unsubscribeSignal))
        .subscribe({
          next: (res: FullShowViewModel) => {
            this.foundShow = res;
            this.foundShow.userReview = this.formData.get('review')?.value || ''
            this.foundShow.userRating = this.formData.get('rating')?.value as unknown as number

            this.reviewService.saveReview(this.foundShow)
              .pipe(takeUntil(this.unsubscribeSignal))
              .subscribe({
                error: (err) => {
                  this.dialogRef.close({type: "openError", message: err.error.message})
                  this.isLoading = false
                },
                complete: () => {
                  this.dialogRef.close("openSuccess")
                  this.isLoading = false
                }
              })
          },
          error: (err) => {
            this.isLoading = false;
            this.dialogRef.close({type: "openError", message: err.error.message})
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
        this.foundSearch$ = this.searchMovieService.searchTitle(event.target.value)
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
