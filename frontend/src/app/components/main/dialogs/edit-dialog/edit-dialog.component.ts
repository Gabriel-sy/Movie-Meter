import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { ShowService } from '../../../../services/show.service';
import { FormErrorComponent } from "../../form-error/form-error.component";

@Component({
  selector: 'app-edit-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, CommonModule, ReactiveFormsModule, FormErrorComponent],
  templateUrl: './edit-dialog.component.html',
  styleUrl: './edit-dialog.component.css'
})
export class EditDialogComponent implements OnInit {
  isLoading: boolean = false;
  formData = this.fb.group({
    rating: ['', [Validators.required, Validators.pattern('^(10([.]0)?|[0-9]([.][0-9])?)$')]],
    review: ['', Validators.required]
  })

  constructor(private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: {currentRating: string, currentReview: string, showId: string},
    private showService: ShowService,
    private dialogRef: MatDialogRef<EditDialogComponent>) { }

    ngOnInit(): void {
      this.formData.patchValue({
        rating: this.data.currentRating,
        review: this.data.currentReview
      });
    }

  editShow() {
    if (this.formData.valid) {
      this.isLoading = true;
      if (this.formData.get('rating')?.value != null) {
        this.editUserRating(this.data.showId, this.formData.get('rating')?.value as string, this.formData.get('review')?.value as string)
      }

    } else {
      this.formData.markAllAsTouched()
    }
  }

  editUserRating(showId: string, userRating: string, userReview: string) {
    const editShow: Subscription = this.showService.editShowRating(showId, userRating, userReview).subscribe({
      error: () => {
        this.dialogRef.close("openError")
      },
      complete: () => {
        this.isLoading = false;
        editShow.unsubscribe()
        this.dialogRef.close("openSuccess")
      }
    });
  }

  changeInputColor(fieldName: string){
    if(this.fieldHasRequiredError(fieldName)){
      return '#FF6B6B';
    }
    return 'transparent'
  }

  fieldHasRequiredError(fieldName: string){
    return this.formData.get(fieldName)?.hasError('required') && this.formData.get(fieldName)?.touched;
  }
}
