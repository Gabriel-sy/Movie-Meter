import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { ShowService } from '../../../../services/show.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-delete-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, CommonModule],
  templateUrl: './delete-dialog.component.html',
  styleUrl: './delete-dialog.component.css'
})
export class DeleteDialogComponent {
  isLoading: boolean = false;
  constructor(@Inject(MAT_DIALOG_DATA) public data: string, private showService: ShowService) {}

  deleteShowById(showId: string){
    this.isLoading = true;
    const deleteShow: Subscription = this.showService.deleteShowById(showId).subscribe({
      error: () => this.isLoading = false,
      complete: () => {
        deleteShow.unsubscribe()
        this.isLoading = false;
      }
    })
  }
}
