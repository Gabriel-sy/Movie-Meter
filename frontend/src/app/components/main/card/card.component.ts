import { Component, Input, OnInit, inject } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from '../dialogs/delete-dialog/delete-dialog.component';
import { EditDialogComponent } from '../dialogs/edit-dialog/edit-dialog.component';
import { RouterLink } from '@angular/router';
import { PopupComponent } from "../popup/popup.component";
import { ReviewService } from '../../../services/review.service';
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
  popupDisplay: boolean = false;
  popupType: boolean = true;
  title: string = '';
  subtitle: string = '';

  constructor(private reviewService: ReviewService) { }

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
    const dialog = this.dialog.open(DeleteDialogComponent, {
      data: showId
    })
    const closedDialog: Subscription = dialog.afterClosed().subscribe({
      next: (res) => {
        if (res == "openError" || res == "openSuccess") {
          this.shows$ = this.reviewService.findAllUserReviews()
          this.popupDisplay = true
          this.popupType = res == "openSuccess" ? true : false;
          this.title = res == "openSuccess" ? 'Sucesso!' : 'Erro ao remover'
          this.subtitle = res == "openSuccess" ?
            'O título foi removido da sua lista!' :
            'Ocorreu um erro ao remover o título da sua lista, tente novamente.'
          setTimeout(() => {
            this.popupDisplay = false;
          }, 2500);
        }
      },
      complete: () => closedDialog.unsubscribe()
    })
  }

  openEditDialog(showId: string, currentRating: number, currentReview: string, event: Event) {
    event.stopPropagation();
    const dialog = this.dialog.open(EditDialogComponent, {
      data: { currentRating: currentRating, currentReview: currentReview, showId: showId }
    })
    const closedDialog: Subscription = dialog.afterClosed().subscribe({
      next: (res) => {
        if (res == "openError" || res == "openSuccess") {
          this.shows$ = this.reviewService.findAllUserReviews()
          this.popupDisplay = true
          this.popupType = res == "openSuccess" ? true : false;
          this.title = res == "openSuccess" ? 'Sucesso!' : 'Erro ao editar'
          this.subtitle = res == "openSuccess" ?
            'O título foi editado com sucesso!' :
            'Ocorreu um erro ao editar o título da sua lista, tente novamente.'
          setTimeout(() => {
            this.popupDisplay = false;
          }, 2500);
        }
      },
      complete: () => closedDialog.unsubscribe()
    })
  }


}
