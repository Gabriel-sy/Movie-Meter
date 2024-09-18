import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ShowService } from '../../../services/show.service';
import { SearchMovieService } from '../../../services/search-movie.service';
import { Results } from '../../../domain/Results';
import { Movie } from '../../../domain/Movie';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Person } from '../../../domain/Person';

@Component({
  selector: 'app-media-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './media-page.component.html',
  styleUrl: './media-page.component.css'
})
export class MediaPageComponent implements OnInit, OnDestroy {

  unsubscribeSignal: Subject<void> = new Subject();
  showId: string = "";
  foundShow: Movie = new Movie();
  actors: Person[] = [];
  mainActorsName: string[] = [];

  constructor(private route: ActivatedRoute, private showService: ShowService,
    private searchMovieService: SearchMovieService) { }

  ngOnDestroy(): void {
    this.unsubscribeSignal.next()
    this.unsubscribeSignal.unsubscribe()
  }

  ngOnInit(): void {
    this.showId = this.route.snapshot.url[2].path.replace(new RegExp("-", "g"), ' ');

    this.searchMovieService.searchTitle(this.showId)
      .subscribe({
        next: (res: Results) => {
          this.foundShow = res.results[0];

          this.foundShow.genre_names = this.showService.convertGenres(this.foundShow.genre_ids);

          if (this.foundShow.release_date == undefined) {
            this.foundShow.release_date = this.foundShow.first_air_date;
          }

          if (this.foundShow.title == undefined) {
            this.foundShow.title = this.foundShow.name;
          }

          this.searchMovieService.findDirectorName(this.foundShow)
            .pipe(takeUntil(this.unsubscribeSignal))
            .subscribe({
              next: (res: Results) => {
                for (let i = 0; i < res.crew.length; i++) {
                  if (res.crew[i].known_for_department == "Directing" && res.crew[i].job == "Director") {
                    this.foundShow.directorName = res.crew[i].name;
                  }
                }
                for (let i = 0; i <= 7; i++) {
                  this.actors.push(res.cast[i]);
                  this.mainActorsName.push(res.cast[i].name)
                  if(i < 7){
                    this.mainActorsName[i] += ",";
                  } else if(i == 7){
                    this.mainActorsName[i] += ".";
                  }
                  
                }
              },
            })
        }
      })


  }

  showImage(posterPath: string) {
    return 'https://image.tmdb.org/t/p/w400' + posterPath

  }
}
