import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, inject } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ShowViewModel } from '../../../domain/ShowViewModel';
import { Observable, Subscription, map } from 'rxjs';
import { ShowService } from '../../../services/show.service';
import { LocalStorageService } from '../../../services/local-storage.service';
import { AddDialogComponent } from '../dialogs/add-dialog/add-dialog.component';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../card/card.component';
import { MatButtonModule } from '@angular/material/button';
import { AddButtonComponent } from "../add-button/add-button.component";
import { PopupComponent } from "../popup/popup.component";

@Component({
  selector: 'app-my-list',
  standalone: true,
  imports: [CardComponent, MatButtonModule, MatDialogModule, CommonModule, AddButtonComponent, PopupComponent],
  templateUrl: './my-list.component.html',
  styleUrl: './my-list.component.css',
  animations: [
    trigger('dropdownAnimation', [
      state('void', style({
        opacity: 0,
        transform: 'translateY(-10%)'
      })),
      transition(':enter', [
        style({
          opacity: 0,
          transform: 'translateY(-10%)'
        }),
        animate('300ms ease-out', style({
          opacity: 1,
          transform: 'translateY(0)'
        }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({
          opacity: 0,
          transform: 'translateY(-10%)'
        }))
      ])
    ])
  ]
})
export class MyListComponent implements OnInit {
  readonly dialog = inject(MatDialog);
  shows$: Observable<ShowViewModel[]> = new Observable<ShowViewModel[]>()
  popupDisplay: boolean = false;
  popupType: boolean = true;
  title: string = '';
  subtitle: string = '';
  dropdownDisplay: boolean = false

  constructor(private showService: ShowService, private localStorageService: LocalStorageService) { }

  ngOnInit(): void {
    this.localStorageService.isLoggedIn()
    this.shows$ = this.showService.findAllShows()

  }

  openDialog() {
    const dialogRef = this.dialog.open(AddDialogComponent);

    const closeDialog: Subscription = dialogRef.afterClosed().subscribe({
      next: (res) => {
        if (res == "openError" || res == "openSuccess") {
          this.shows$ = this.showService.findAllShows()
          this.popupDisplay = true
          this.popupType = res == "openSuccess" ? true : false;
          this.title = res == "openSuccess" ? 'Sucesso!' : 'Erro ao adicionar'
          this.subtitle = res == "openSuccess" ?
            'O título foi adicionado à sua lista!' :
            'Ocorreu um erro ao adicionar o título à sua lista, tente novamente.'
          setTimeout(() => {
            this.popupDisplay = false;
          }, 2500);
        }
      },
      complete: () =>
        closeDialog.unsubscribe()

    })
  }

  filterShowsByNameAsc() {
    this.shows$ = this.shows$.pipe(map((show) => {
      show.sort((a, b) => { return a.originalTitle.localeCompare(b.originalTitle) })
      this.dropdownDisplay = false
      return show
    }
    ))
  }

  filterShowsByNameDesc() {
    this.shows$ = this.shows$.pipe(map((show) => {
      show.sort((a, b) => { return b.originalTitle.localeCompare(a.originalTitle) })
      this.dropdownDisplay = false
      return show
    }
    ))
  }

  filterShowsByRatingAsc() {
    this.shows$ = this.shows$.pipe(map((show) => {
      show.sort()
      this.dropdownDisplay = false
      return show
    }
    ))
  }

  filterShowsByRatingDesc() {
    this.shows$ = this.shows$.pipe(map((show) => {
      show.sort().reverse()
      this.dropdownDisplay = false
      return show
    }
    ))
  }

  showDropdown() {
    this.dropdownDisplay = !this.dropdownDisplay

  }
}
