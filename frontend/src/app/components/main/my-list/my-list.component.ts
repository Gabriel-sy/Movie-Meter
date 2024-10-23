import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, inject } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Observable, Subscription, map } from 'rxjs';

import { LocalStorageService } from '../../../services/local-storage.service';
import { AddDialogComponent } from '../dialogs/add-dialog/add-dialog.component';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../card/card.component';
import { MatButtonModule } from '@angular/material/button';
import { AddButtonComponent } from "../add-button/add-button.component";
import { PopupComponent } from "../popup/popup.component";
import { ReviewService } from '../../../services/review.service';
import { ReviewViewModel } from '../../../domain/ReviewViewModel';

@Component({
  selector: 'app-my-list',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule, CommonModule, AddButtonComponent, PopupComponent, CardComponent],
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
  shows$: Observable<ReviewViewModel[]> = new Observable<ReviewViewModel[]>()
  dropdownDisplay: boolean = false

  constructor(private reviewService: ReviewService, private localStorageService: LocalStorageService) { }

  ngOnInit(): void {
    this.localStorageService.isLoggedIn()
    this.shows$ = this.reviewService.findAllUserReviews()
  }

  openDialog() {
    const dialogRef = this.dialog.open(AddDialogComponent);
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
      show.sort((a, b) => a.userRating - b.userRating)
      this.dropdownDisplay = false
      return show
    }
    ))
  }

  filterShowsByRatingDesc() {
    this.shows$ = this.shows$.pipe(map((show) => {
      show.sort((a, b) => b.userRating - a.userRating)
      this.dropdownDisplay = false
      return show
    }
    ))
  }

  showDropdown() {
    this.dropdownDisplay = !this.dropdownDisplay
  }
}
