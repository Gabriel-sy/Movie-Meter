import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, inject } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MovieResponseDTO } from '../../../domain/MovieResponseDTO';
import { Observable, Subscription, map } from 'rxjs';
import { ShowService } from '../../../services/show.service';
import { LocalStorageService } from '../../../services/local-storage.service';
import { AddDialogComponent } from '../dialogs/add-dialog/add-dialog.component';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../card/card.component';
import { MatButtonModule } from '@angular/material/button';
import { AddButtonComponent } from "../add-button/add-button.component";

@Component({
  selector: 'app-my-list',
  standalone: true,
  imports: [CardComponent, MatButtonModule, MatDialogModule, CommonModule, AddButtonComponent],
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
  shows: Observable<MovieResponseDTO[]> = new Observable<MovieResponseDTO[]>()
  
  dropdownDisplay: boolean = false

  constructor(private showService: ShowService, private localStorageService: LocalStorageService) { }

  ngOnInit(): void {
    this.localStorageService.isLoggedIn()
    this.shows = this.showService.findAllShows()

  }

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

  filterShowsByNameAsc() {
    this.shows = this.shows.pipe(map((show) => {
      show.sort((a, b) => { return a.title.localeCompare(b.title) })
      this.dropdownDisplay = false
      return show
    }
    ))
  }

  filterShowsByNameDesc() {
    this.shows = this.shows.pipe(map((show) => {
      show.sort((a, b) => { return b.title.localeCompare(a.title) })
      this.dropdownDisplay = false
      return show
    }
    ))
  }

  filterShowsByRatingAsc() {
    this.shows = this.shows.pipe(map((show) => {
      show.sort((a, b) => { return a.userRating.localeCompare(b.userRating) })
      this.dropdownDisplay = false
      return show
    }
    ))
  }

  filterShowsByRatingDesc() {
    this.shows = this.shows.pipe(map((show) => {
      show.sort((a, b) => { return b.userRating.localeCompare(a.userRating) })
      this.dropdownDisplay = false
      return show
    }
    ))
  }

  showDropdown() {
    if (this.dropdownDisplay == true) {
      this.dropdownDisplay = false
    } else {
      this.dropdownDisplay = true
    }

  }
}
