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

  url = 'https://api.themoviedb.org/3/search/movie?query=Sociedade%20da%20neve&include_adult=false&language=pt-BR&page=1';
  headers = {
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxMGQwZjMwMWI4YTMwYzg3MDI2OGY0MzE0MWQ3YTcxMCIsIm5iZiI6MTcyMDY0NzE2MS42OTA0OTksInN1YiI6IjY2OGViYTg0MGQ1ODlkMTMzZWYxNzdkMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.NjzfMPs94DIwgyR9raXICaZ-zT_iiRZIh8VYW6i7SNw'
    }
  };

  fetch() {
    const response = this.http.get(this.url, this.headers)
    console.log(response.subscribe((res) => {
      console.log(res)
    }))
  }


}
