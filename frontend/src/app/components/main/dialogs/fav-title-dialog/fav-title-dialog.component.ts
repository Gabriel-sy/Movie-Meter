import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Observable, Subscription, finalize } from 'rxjs';
import { ShowViewModel } from '../../../../domain/ShowViewModel';
import { ShowService } from '../../../../services/show.service';
import { SharedService } from '../../../../services/shared.service';
import { ShowSearchViewModel } from '../../../../domain/ShowSearchViewModel';

@Component({
  selector: 'app-fav-title-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, CommonModule],
  templateUrl: './fav-title-dialog.component.html',
  styleUrl: './fav-title-dialog.component.css'
})
export class FavTitleDialogComponent {
  foundSearch$: Observable<ShowSearchViewModel[]> = new Observable<ShowSearchViewModel[]>();
  timer = setTimeout(() => { }, 0);
  isLoading: boolean = false;
  inputValue: string = '';
  isExpanded: boolean = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: string, 
  private dialogRef: MatDialogRef<FavTitleDialogComponent>,
  private sharedService: SharedService) {}

  searchMovie(event: any){
    clearTimeout(this.timer)

    const length = event.target.value.length

    this.timer = setTimeout(() => {
      if (length > 3) {
        this.foundSearch$ = this.sharedService.searchTitle(event.target.value)
        .pipe(finalize(() => this.isExpanded = true))
      } else if (length == 0) {
        this.foundSearch$ = new Observable<ShowSearchViewModel[]>()
        this.isExpanded = false;
        this.inputValue = '';
      }
    }, 500);
  }

  setInputValue(title: string){
    this.inputValue = title
  }
}
