import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { ShowService } from '../../../../services/show.service';

@Component({
  selector: 'app-delete-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './delete-dialog.component.html',
  styleUrl: './delete-dialog.component.css'
})
export class DeleteDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: string, private showService: ShowService) {}

  deleteShowById(showId: string){
    const deleteShow: Subscription = this.showService.deleteShowById(showId).subscribe({
      complete: () => deleteShow.unsubscribe()
    })
  }
}
