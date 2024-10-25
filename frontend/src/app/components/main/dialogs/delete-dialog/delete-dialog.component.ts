import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ReviewService } from '../../../../services/review.service';
import { PopupService } from '../../../../services/popup.service';

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
  private dialogRef: MatDialogRef<DeleteDialogComponent>,
  private popupService: PopupService) {}

  deleteReviewById(showId: string){
    this.isLoading = true;
    const deleteShow: Subscription = this.reviewService.deleteReviewById(showId).subscribe({
      error: (err) => {
        this.dialogRef.close(false)
        this.popupService.showError("Ocorreu um erro", "Houve um problema ao remover a avaliação, tente novamente mais tarde.")
        this.isLoading = false
      },
      complete: () => {
        this.popupService.showSuccess("Sucesso!", "Avaliação removida.")
        this.dialogRef.close(true)
        deleteShow.unsubscribe()
        this.isLoading = false;
      }
    })
  }
}
