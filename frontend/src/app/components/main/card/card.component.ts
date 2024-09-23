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

  formatTitle(title: string) {
    return title.replace(new RegExp(" ", "g"), '-')
  }

  showImage(posterPath: string) {
    return 'https://image.tmdb.org/t/p/w400' + posterPath

  }

  convertGenres(genres: number[]): string[] {
    console.log(genres)
    return this.showService.convertGenres(genres);
  }

  openDeleteDialog(showId: string, event: Event) {
    event.stopPropagation();
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

  openEditDialog(showId: string, currentRating: string, currentReview: string, event: Event) {
    event.stopPropagation();
    const dialog = this.dialog.open(EditDialogComponent, {
      data: { currentRating: currentRating, currentReview: currentReview, showId: showId }
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
