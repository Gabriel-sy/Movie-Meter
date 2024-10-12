import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, OnInit, PLATFORM_ID, Renderer2, ViewChild, inject } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { LocalStorageService } from '../../../services/local-storage.service';
import { ShowSearchViewModel } from '../../../domain/ShowSearchViewModel';
import { Observable, catchError, delay, map, throwError } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { SpinnerComponent } from "../spinner/spinner.component";
import { SharedService } from '../../../services/shared.service';
import { SearchMovieService } from '../../../services/search-movie.service';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule, SpinnerComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  animations: [
    trigger('dropdownAnimation', [
      state('void', style({
        opacity: 0,
        transform: 'translateY(-10%)'
      })),
      transition(':enter', [
        style({
          opacity: 0,
          transform: 'translateY(-10%)'
        }),
        animate('300ms ease-out', style({
          opacity: 1,
          transform: 'translateY(0)'
        }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({
          opacity: 0,
          transform: 'translateY(-10%)'
        }))
      ])
    ])
  ]
})

export class NavbarComponent implements OnInit {

  private readonly platformId = inject(PLATFORM_ID)
  foundSearch$: Observable<ShowSearchViewModel[]> = new Observable<ShowSearchViewModel[]>()
  shows: ShowSearchViewModel[] = []
  path: string = '';
  userName: string = '';
  shouldShowRegister: boolean = false;
  searchDisplay: boolean = false;
  shouldShowLogin: boolean = false;
  timer = setTimeout(() => { }, 0)
  inputValue: string = ''
  isLoading: boolean = false;
  dropdownDisplay: boolean = false;
  readonly dialog = inject(MatDialog);
  @ViewChild('results') results!: ElementRef;
  @ViewChild('dropdown') dropdown!: ElementRef;


  constructor(private localStorageService: LocalStorageService,
    private router: Router,
    private renderer: Renderer2,
    private sharedService: SharedService,
    private searchMovieService: SearchMovieService) {
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.userName = this.localStorageService.get('userName');
      }
    })


    this.renderer.listen('window', 'click', (e: Event) => {
      if (this.results) {
        if (!this.results.nativeElement.contains(e.target)) {
          this.closeSearchResults()
        }

      }
      if (this.dropdown) {
        if (!this.dropdown.nativeElement.contains(e.target)) {
          this.dropdownDisplay = false;
        }
      }

    })

  }

  ngOnInit(): void {
    this.isLoggedIn()
  }

  logout() {
    this.localStorageService.clear();
  }

  isLoggedIn(): any {
    if (isPlatformBrowser(this.platformId)) {
      if (!this.localStorageService.isLoggedIn()) {
        this.shouldShowLogin = true;
        this.shouldShowRegister = true;
        return false;
      }
      this.shouldShowLogin = false;
      this.shouldShowRegister = false;
      return true;
    }
  }

  searchMovie(event: any) {
    clearTimeout(this.timer)
    const length = event.target.value.length

    this.timer = setTimeout(() => {
      if (length > 3) {
        this.searchDisplay = true;
        this.isLoading = true
        this.foundSearch$ = this.searchMovieService.searchTitle(event.target.value)
        .pipe(
            catchError(err => {
              this.closeSearchResults()
              return throwError(() => err)
            }),
          )
      } else if (length == 0) {
        this.closeSearchResults()
      }

    }, 500);

  }

  closeSearchResults() {
    this.searchDisplay = false;
    this.foundSearch$ = new Observable<ShowSearchViewModel[]>();
    this.inputValue = '';
    this.isLoading = false
  }

  showImage(posterPath: string) {
    return 'https://image.tmdb.org/t/p/w400' + posterPath
  }

  formatTitle(title: string): string {
    return title.replace(new RegExp(" ", "g"), '-');
  }

  showDropdown() {
    if (this.dropdownDisplay == true) {
      this.dropdownDisplay = false
    } else {
      this.dropdownDisplay = true
    }
  }
}
