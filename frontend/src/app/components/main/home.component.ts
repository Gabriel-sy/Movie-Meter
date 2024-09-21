import { Component, HostListener, Inject, OnInit, PLATFORM_ID, inject } from '@angular/core';
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
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, CarouselModule, ButtonModule, RouterLink, AddButtonComponent, PopupComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',

})
export class HomeComponent implements OnInit {

  popularMovies: PopularMovies[] = [];
  popularSeries: PopularMovies[] = []
  displayedSeries: PopularMovies[] = [];
  displayedMovies: PopularMovies[] = [];
  translateValueSeries = 0;
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
    @Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  openDialog() {
    const dialogRef = this.dialog.open(AddDialogComponent);

    const closeDialog: Subscription = dialogRef.afterClosed().subscribe({
      next: (res) => {
        this.popupDisplay = true
        this.popupType = res ? true : false;
        this.title = this.popupType ? 'Sucesso!' : 'Erro ao adicionar'
        this.subtitle = this.popupType ?
          'O título foi adicionado à sua lista!' :
          'Ocorreu um erro ao adicionar o título à sua lista, tente novamente.'
        setTimeout(() => {
          this.popupDisplay = false;
        }, 2500);
      },
      complete: () => {
        closeDialog.unsubscribe()
      }
    }
    )
  }


  ngOnInit(): void {
    this.searchMovieService.searchPopularMovies()
      .subscribe({
        next: (res: Results) => {
          this.popularMovies = res.results.map(movie => ({
            posterPath: movie.poster_path,
            title: movie.original_title,
          }))
          this.searchMovieService.searchPopularSeries()
            .subscribe({
              next: (res: Results) => {
                this.popularSeries = res.results.map(serie => ({
                  posterPath: serie.poster_path,
                  title: serie.original_name

                }))
                if (this.isBrowser) {
                  this.calculateVisibleItems();
                  this.initializeDisplayedMovies();
                  this.startAutoScroll();
                }
              }
            })
        }
      })

  }

  calculateVisibleItems() {
    const carouselWidth = document.querySelector('.carousel')?.clientWidth || 0;
    this.visibleItems = Math.floor(carouselWidth / this.itemWidth);
  }

  initializeDisplayedMovies() {
    this.displayedMovies = [...this.popularMovies, ...this.popularMovies].slice(0, this.popularMovies.length + this.visibleItems);
    this.displayedSeries = [...this.popularSeries, ...this.popularSeries].slice(0, this.popularSeries.length + this.visibleItems);
  }

  startAutoScroll() {
    this.autoScrollInterval = setInterval(() => {
      this.scrollMovies();
    }, 3000);
    this.autoScrollInterval = setInterval(() => {
      this.scrollSeries();
    }, 3600);
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
  scrollSeries() {
    this.translateValueSeries -= this.itemWidth;
    if (Math.abs(this.translateValueSeries) >= this.popularMovies.length * this.itemWidth) {
      this.translateValueSeries = 0;
    }
    setTimeout(() => {
      if (this.translateValueSeries === 0) {
        this.translateValueSeries = -this.itemWidth;
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



