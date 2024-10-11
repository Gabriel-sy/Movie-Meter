import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ReviewService } from '../../../../services/review.service';

@Component({
  selector: 'app-delete-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, CommonModule],
  templateUrl: './delete-dialog.component.html',
  styleUrl: './delete-dialog.component.css'
})
export class DeleteDialogComponent {
  isLoading: boolean = false;
  constructor(@Inject(MAT_DIALOG_DATA) public data: string, 
  private reviewService: ReviewService, 
  private dialogRef: MatDialogRef<DeleteDialogComponent>) {}

  deleteReviewById(showId: string){
    this.isLoading = true;
    const deleteShow: Subscription = this.reviewService.deleteReviewById(showId).subscribe({
      error: () => {
        this.dialogRef.close("openError")
        this.isLoading = false
      },
      complete: () => {
        this.dialogRef.close("openSuccess")
        deleteShow.unsubscribe()
        this.isLoading = false;
      }
    })
  }
}
