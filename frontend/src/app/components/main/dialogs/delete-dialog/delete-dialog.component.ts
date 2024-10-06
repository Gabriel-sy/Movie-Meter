import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { ShowService } from '../../../../services/show.service';
import { CommonModule } from '@angular/common';
import { EditDialogComponent } from '../edit-dialog/edit-dialog.component';

@Component({
  selector: 'app-delete-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, CommonModule],
  templateUrl: './delete-dialog.component.html',
  styleUrl: './delete-dialog.component.css'
})
export class DeleteDialogComponent {
  isLoading: boolean = false;
  constructor(@Inject(MAT_DIALOG_DATA) public data: string, private showService: ShowService, private dialogRef: MatDialogRef<DeleteDialogComponent>) {}

  deleteShowById(showId: string){
    this.isLoading = true;
    const deleteShow: Subscription = this.showService.deleteShowById(showId).subscribe({
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
