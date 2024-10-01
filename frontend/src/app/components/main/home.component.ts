import { Component, HostListener, Inject, OnDestroy, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { SearchMovieService } from '../../services/search-movie.service';
import { Results } from '../../domain/Results';
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { PopularMovies } from '../../domain/PopularMovie';
import { RouterLink } from '@angular/router';
import { AddButtonComponent } from "./add-button/add-button.component";
import { PopupComponent } from "./popup/popup.component";
import { AddDialogComponent } from './dialogs/add-dialog/add-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subject, Subscription, map, takeUntil } from 'rxjs';
import { LocalStorageService } from '../../services/local-storage.service';
import { UserService } from '../../services/user.service';
import { ShowInputModel } from '../../domain/ShowInputModel';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, CarouselModule, ButtonModule, RouterLink, AddButtonComponent, PopupComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',

})
export class HomeComponent implements OnInit, OnDestroy {

  popularSeries$: Observable<ShowInputModel[]> = new Observable<ShowInputModel[]>();
  popularRomanceMovies$: Observable<ShowInputModel[]> = new Observable<ShowInputModel[]>();
  popularHorrorMovies$: Observable<ShowInputModel[]> = new Observable<ShowInputModel[]>();
  popularScienceFicMovies$: Observable<ShowInputModel[]> = new Observable<ShowInputModel[]>();
  unsubscribeSignal: Subject<void> = new Subject();
  popularMovies: PopularMovies[] = [];
  displayedMovies: PopularMovies[] = [];
  translateValueMovies = 0;
  isBrowser: boolean;
  popupDisplay: boolean = false;
  popupType: boolean = true;
  title: string = '';
  subtitle: string = '';
  itemWidth = 150;
  visibleItems = 0;
  private autoScrollInterval: any;
  readonly dialog = inject(MatDialog);

  constructor(private searchMovieService: SearchMovieService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private localStorageService: LocalStorageService, private userService: UserService) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnDestroy(): void {
    this.unsubscribeSignal.next()
    this.unsubscribeSignal.unsubscribe()
  }

  ngOnInit(): void {
    this.searchPopularMovies()
    this.searchPopularSeries()
    this.searchPopularRomanceMovies()
    this.searchPopularHorrorMovies()
    this.searchPopularScienceFicMovies()
  }

  searchPopularMovies() {
    this.searchMovieService.searchPopularMovies()
      .pipe(takeUntil(this.unsubscribeSignal))
      .subscribe({
        next: (res: Results) => {
          this.popularMovies = res.results.map(movie => ({
            posterPath: movie.poster_path,
            title: movie.original_title,
          }))

          if (this.isBrowser) {
            this.calculateVisibleItems();
            this.initializeDisplayedMovies();
            this.startAutoScroll();
          }
        }
      })
  }

  searchPopularSeries() {
    this.popularSeries$ = this.searchMovieService.searchPopularSeries()
      .pipe(map((res: Results) => {
        return res.results
      }))
  }

  searchPopularRomanceMovies() {
    this.popularRomanceMovies$ = this.searchMovieService.searchPopularRomanceMovies()
      .pipe(map((res: Results) => {
        return res.results
      }))
  }

  searchPopularHorrorMovies() {
    this.popularHorrorMovies$ = this.searchMovieService.searchPopularHorrorMovies()
      .pipe(map((res: Results) => {
        return res.results
      }))
  }

  searchPopularScienceFicMovies() {
    this.popularScienceFicMovies$ = this.searchMovieService.searchPopularScienceFictionMovies()
      .pipe(map((res: Results) => {
        return res.results
      }))
  }

  openDialog() {
    if (this.localStorageService.isLoggedIn()) {
      const dialogRef = this.dialog.open(AddDialogComponent);

      const closeDialog: Subscription = dialogRef.afterClosed().subscribe({
        next: (res) => {
          if (res == "openError" || res == "openSuccess") {
            this.popupDisplay = true
            this.popupType = res == "openSuccess" ? true : false;
            this.title = res == "openSuccess" ? 'Sucesso!' : 'Erro ao adicionar'
            this.subtitle = res == "openSuccess" ?
              'O título foi adicionado à sua lista!' :
              'Ocorreu um erro ao adicionar o título à sua lista, tente novamente.'
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

  calculateVisibleItems() {
    const carouselWidth = document.querySelector('.carousel')?.clientWidth || 0;
    this.visibleItems = Math.floor(carouselWidth / this.itemWidth);
  }

  initializeDisplayedMovies() {
    this.displayedMovies = [...this.popularMovies, ...this.popularMovies].slice(0, this.popularMovies.length + this.visibleItems);
  }

  startAutoScroll() {
    this.autoScrollInterval = setInterval(() => {
      this.scrollMovies();
    }, 3000);
  }

  scrollMovies() {
    this.translateValueMovies -= this.itemWidth;
    if (Math.abs(this.translateValueMovies) >= this.popularMovies.length * this.itemWidth) {
      this.translateValueMovies = 0;
    }
    setTimeout(() => {
      if (this.translateValueMovies === 0) {
        this.translateValueMovies = -this.itemWidth;
      }
    }, 500);
  }

  formatTitle(title: string): string {
    return title.replace(new RegExp(" ", "g"), '-');
  }

  showImage(posterPath: string) {
    return 'https://image.tmdb.org/t/p/w400' + posterPath
  }

}



