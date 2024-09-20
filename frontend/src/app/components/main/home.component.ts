import { Component, HostListener, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ShowService } from '../../services/show.service';
import { SearchMovieService } from '../../services/search-movie.service';
import { Observable, map } from 'rxjs';
import { Movie } from '../../domain/Movie';
import { Results } from '../../domain/Results';
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { PopularMovies } from '../../domain/PopularMovie';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, CarouselModule, ButtonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',

})
export class HomeComponent implements OnInit {

  popularMovies: PopularMovies[] = [];
  displayedMovies: PopularMovies[] = [];
  translateValue = 0;
  isBrowser: boolean;
  itemWidth = 150;
  visibleItems = 0;
  private autoScrollInterval: any;

  constructor(private searchMovieService: SearchMovieService, @Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    this.searchMovieService.searchPopular()
      .subscribe({
        next: (res: Results) => {
          this.popularMovies = res.results.map(movie => ({
            posterPath: movie.poster_path,
            title: movie.title,
          }))
          if (this.isBrowser) {
            this.calculateVisibleItems();
            this.initializeDisplayedMovies();
            this.startAutoScroll();
          }
        }
      })
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
      this.scroll();
    }, 3000);
  }

  scroll() {
    this.translateValue -= this.itemWidth;
    if (Math.abs(this.translateValue) >= this.popularMovies.length * this.itemWidth) {
      this.translateValue = 0;
    }
    setTimeout(() => {
      if (this.translateValue === 0) {
        this.translateValue = -this.itemWidth;
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



