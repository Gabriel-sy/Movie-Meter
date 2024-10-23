import { Component, Input, OnInit, inject } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from '../dialogs/delete-dialog/delete-dialog.component';
import { EditDialogComponent } from '../dialogs/edit-dialog/edit-dialog.component';
import { RouterLink } from '@angular/router';
import { PopupComponent } from "../popup/popup.component";
import { ReviewViewModel } from '../../../domain/ReviewViewModel';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule, RouterLink, PopupComponent],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent implements OnInit {
  readonly dialog = inject(MatDialog);
  @Input() shows$: Observable<ReviewViewModel[]> = new Observable<ReviewViewModel[]>()

  constructor() { }

  ngOnInit(): void {
  }

  formatTitle(title: string) {
    return title.replace(new RegExp(" ", "g"), '-')
  }

  showImage(posterPath: string) {
    return 'https://image.tmdb.org/t/p/w400' + posterPath

  }

  openDeleteDialog(showId: string, event: Event) {
    event.stopPropagation();
    this.dialog.open(DeleteDialogComponent, {
      data: showId
    })
  }

  openEditDialog(showId: string, currentRating: number, currentReview: string, event: Event) {
    event.stopPropagation();
    this.dialog.open(EditDialogComponent, {
      data: { currentRating: currentRating, currentReview: currentReview, showId: showId }
    })
  }


}
