import { Component, inject } from '@angular/core';
import { CardComponent } from "../card/card.component";
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddDialogComponent } from '../add-dialog/add-dialog.component';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CardComponent, MatButtonModule, MatDialogModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  readonly dialog = inject(MatDialog);

  // shows: Observable<Movie[]> = new Observable<Movie[]>()

  constructor() { }

  

  

  

  openDialog() {
    const dialogRef = this.dialog.open(AddDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  
  }



