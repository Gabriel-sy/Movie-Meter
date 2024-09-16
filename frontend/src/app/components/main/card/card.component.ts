import { Component, Input, OnInit, inject } from '@angular/core';
import { ShowService } from '../../../services/show.service';
import { Observable, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MovieResponseDTO } from '../../../domain/MovieResponseDTO';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from '../dialogs/delete-dialog/delete-dialog.component';
import { EditDialogComponent } from '../dialogs/edit-dialog/edit-dialog.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent implements OnInit {
  readonly dialog = inject(MatDialog);
  @Input() shows: Observable<MovieResponseDTO[]> = new Observable<MovieResponseDTO[]>()

  constructor(private showService: ShowService) { }

  ngOnInit(): void {
    
  }

  showImage(posterPath: string) {
    return 'https://image.tmdb.org/t/p/w400' + posterPath
  }

  openDeleteDialog(showId: string) {
    const dialog = this.dialog.open(DeleteDialogComponent, {
      data: showId
    })
    const closedDialog: Subscription = dialog.afterClosed().subscribe({
      next: (res) => {
        if (res) {
          this.shows = this.showService.findAllShows()
        }
      },
      complete: () => closedDialog.unsubscribe()
    })
  }

  openEditDialog(showId: string) {
    const dialog = this.dialog.open(EditDialogComponent, {
      data: showId 
    })
    const closedDialog: Subscription = dialog.afterClosed().subscribe({
      next: (res) => {
        if (res) {
          
          this.shows = this.showService.findAllShows()
        }
      },
      complete: () => closedDialog.unsubscribe()
    })
  }

  
}
