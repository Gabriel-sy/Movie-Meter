import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchMovieService } from '../../services/search-movie.service';
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';
import { AddButtonComponent } from "./add-button/add-button.component";
import { PopupComponent } from "./popup/popup.component";
import { AddDialogComponent } from './dialogs/add-dialog/add-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subject, Subscription, delay, map } from 'rxjs';
import { LocalStorageService } from '../../services/local-storage.service';
import { UserService } from '../../services/user.service';
import { ShowSearchViewModel } from '../../domain/ShowSearchViewModel';
import { SpinnerComponent } from "./spinner/spinner.component";
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, CarouselModule, ButtonModule, RouterLink, 
    AddButtonComponent, PopupComponent, SpinnerComponent, 
    NgxSkeletonLoaderModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',

})
export class HomeComponent implements OnInit, OnDestroy {

  popularSeries$: Observable<ShowSearchViewModel[]> = new Observable<ShowSearchViewModel[]>();
  popularRomanceMovies$: Observable<ShowSearchViewModel[]> = new Observable<ShowSearchViewModel[]>();
  popularHorrorMovies$: Observable<ShowSearchViewModel[]> = new Observable<ShowSearchViewModel[]>();
  popularScienceFicMovies$: Observable<ShowSearchViewModel[]> = new Observable<ShowSearchViewModel[]>();
  popularMovies$: Observable<ShowSearchViewModel[]> = new Observable<ShowSearchViewModel[]>();
  unsubscribeSignal: Subject<void> = new Subject();
  readonly romanceId: string = '10749'
  readonly horrorId: string = '27'
  readonly ScienceFicId: string = '878'
  defaultDisplayLength: number[] = Array.from(Array(15).keys())
  popupDisplay: boolean = false;
  popupType: boolean = true;
  title: string = '';
  subtitle: string = '';
  readonly dialog = inject(MatDialog);
  skeletonTheme = {
    width: '100%', 
    height: '225px', 
    borderRadius: '4px', 
  };

  constructor(private searchMovieService: SearchMovieService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private localStorageService: LocalStorageService, 
    private userService: UserService,
    ) {
  }

  ngOnDestroy(): void {
    this.unsubscribeSignal.next()
    this.unsubscribeSignal.unsubscribe()
  }

  ngOnInit(): void {
    this.popularMovies$ = this.searchPopularMovies()
    this.popularSeries$ = this.searchPopularSeries()
    this.popularRomanceMovies$ = this.searchPopularMovieByGenre(this.romanceId)
    this.popularHorrorMovies$ = this.searchPopularMovieByGenre(this.horrorId)
    this.popularScienceFicMovies$ = this.searchPopularMovieByGenre(this.ScienceFicId)
  }

  searchPopularMovies() {
    return this.searchMovieService.searchPopularMovies()
      .pipe(
        map((res: ShowSearchViewModel[]) => {
          return res.slice(0, 15)
        }))
  }

  searchPopularSeries() {
    return this.searchMovieService.searchPopularSeries()
      .pipe(
        map((res: ShowSearchViewModel[]) => {
          return res.slice(0, 15)
        }))
  }

  searchPopularMovieByGenre(genre: string) {
    return this.searchMovieService.searchMoviesByGenre(genre)
      .pipe(
        map((res: ShowSearchViewModel[]) => {
          return res.slice(0, 15)
        }))
  }

  openDialog() {
    if (this.localStorageService.isLoggedIn()) {
      const dialogRef = this.dialog.open(AddDialogComponent);

      const closeDialog: Subscription = dialogRef.afterClosed().subscribe({
        next: (res) => {
          if (res.type == "openError" || res.type == "openSuccess") {
            this.popupDisplay = true
            this.popupType = res.type == "openSuccess" ? true : false;
            this.title = res.type == "openSuccess" ? 'Sucesso!' : 'Erro ao adicionar'
            this.subtitle = res.type == "openSuccess" ?
              'O título foi adicionado à sua lista!' :
              res.message
            setTimeout(() => {
              this.popupDisplay = false;
            }, 2500);
          }
        },
        complete: () => {
          closeDialog.unsubscribe()
        }
      }
      )
    } else {
      this.popupDisplay = true;
      this.popupType = false;
      this.title = "Você precisa estar logado"
      this.subtitle = "Para avaliar um título, você precisa fazer login primeiro"
      setTimeout(() => {
        this.popupDisplay = false;
      }, 2500);
    }
  }

  formatTitle(title: string): string {
    return title.replace(new RegExp(" ", "g"), '-');
  }

  showImage(posterPath: string) {
    return 'https://image.tmdb.org/t/p/w400' + posterPath
  }

}



