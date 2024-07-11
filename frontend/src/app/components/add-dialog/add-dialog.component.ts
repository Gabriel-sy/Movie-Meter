import { Component, OnInit, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SearchMovieService } from '../../services/search-movie.service';
import { Observable, debounceTime, delay, map, timer } from 'rxjs';
import { Movie } from '../../domain/Movie';
import { CommonModule } from '@angular/common';
import { Results } from '../../domain/Results';
import { ShowService } from '../../services/show.service';


@Component({
  selector: 'app-add-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatProgressSpinnerModule, CommonModule],
  templateUrl: './add-dialog.component.html',
  styleUrl: './add-dialog.component.css'
})
export class AddDialogComponent implements OnInit{
  
  foundMovies: Observable<Results> = new Observable<Results>();
  showToSave: Movie = new Movie()
  titles: string[] = []
  foundShows: Movie[] = []
  inputValue: string = ''
  timer = setTimeout(() => {}, 0)
  constructor(private searchMovieService: SearchMovieService, private showService: ShowService) { }

  ngOnInit(): void {
  
  }

  saveMovie(){
    this.searchMovieService.searchTitle(this.inputValue).subscribe({
      next: (res: Results) => {
        this.foundShows = res.results;
        this.foundShows = this.foundShows.filter(show => show.title == this.inputValue || show.name == this.inputValue)
        this.showToSave = this.foundShows[0] as Movie;
        this.showService.saveShow(this.showToSave).subscribe()
      }
    })
  }


  searchMovie(event: any) {
    clearTimeout(this.timer)

    const length = event.target.value.length

    this.timer = setTimeout(() => {
      if (length > 3 ) {
        this.foundMovies = this.searchMovieService.searchTitle(event.target.value)
        this.foundMovies.subscribe({
          next: (res: Results) => {
            //Filmes
            this.titles = res.results.map(movie => movie.title);
            //Series
            const tvseries: string[] = res.results.filter(movie => movie.media_type == 'tv').map(movie => movie.name)
            //Juntando os dois
            this.titles = this.titles.concat(tvseries)
  
            this.titles = this.titles.filter(movie => movie != undefined)
          }
        })
      } else if (length == 0) {
        this.titles = []
      }
    }, 500);
  }

  setInputValue(movie: string) {
    this.inputValue = movie;
    this.titles = []
  }
}
