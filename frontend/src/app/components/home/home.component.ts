import { Component, inject } from '@angular/core';
import { CardComponent } from "../card/card.component";
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddDialogComponent } from '../add-dialog/add-dialog.component';
import { HttpClient, HttpRequest } from '@angular/common/http';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CardComponent, MatButtonModule, MatDialogModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  readonly dialog = inject(MatDialog);

  constructor(private http: HttpClient) { }

  openDialog() {
    const dialogRef = this.dialog.open(AddDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  
  }



