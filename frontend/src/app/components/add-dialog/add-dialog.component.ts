import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SearchMovieService } from '../../services/search-movie.service';
import { Observable, map } from 'rxjs';
import { Movie } from '../../domain/Movie';
import { CommonModule } from '@angular/common';
import { Results } from '../../domain/Results';


@Component({
  selector: 'app-add-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatProgressSpinnerModule, CommonModule],
  templateUrl: './add-dialog.component.html',
  styleUrl: './add-dialog.component.css'
})
export class AddDialogComponent {

  foundMovies: Observable<Results> = new Observable<Results>();
  titles: string[] = []
  inputValue: string = ''
  

  constructor(private searchMovieService: SearchMovieService) { }


  searchMovie(event: any) {
    const length = event.target.value.length
    if (length > 3) {
      this.foundMovies = this.searchMovieService.searchTitle(event.target.value)
      this.foundMovies.subscribe({
        next: (res: Results) => {
          this.titles = res.results.map(movie => movie.title);
        }
      })
    } else if(length == 0) {
      this.titles = []
    }

  }

  setInputValue(movie: string){
    this.inputValue = movie;
    this.titles = []
  }
}
