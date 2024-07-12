import { Component, inject } from '@angular/core';
import { CardComponent } from "./card/card.component";
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddDialogComponent } from './dialogs/add-dialog/add-dialog.component';
import { Observable, Subscription } from 'rxjs';
import { MovieResponseDTO } from '../../domain/MovieResponseDTO';
import { ShowService } from '../../services/show.service';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CardComponent, MatButtonModule, MatDialogModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  readonly dialog = inject(MatDialog);
  shows: Observable<MovieResponseDTO[]> = new Observable<MovieResponseDTO[]>()

  constructor(private showService: ShowService) { }

  openDialog() {
    const dialogRef = this.dialog.open(AddDialogComponent);

    const closeDialog: Subscription = dialogRef.afterClosed().subscribe({
      next: (res) => {
        if (res) {
          this.shows = this.showService.findAllShows()
        }
      },
      complete: () => closeDialog.unsubscribe()
    })
  }

}



