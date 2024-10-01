import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { ShowService } from '../../../services/show.service';
import { SearchMovieService } from '../../../services/search-movie.service';
import { Results } from '../../../domain/Results';
import { ShowInputModel } from '../../../domain/ShowInputModel';
import { Observable, Subject, Subscription, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Person } from '../../../domain/Person';
import { AddButtonComponent } from "../add-button/add-button.component";
import { LocalStorageService } from '../../../services/local-storage.service';
import { UserService } from '../../../services/user.service';
import { User } from '../../../domain/User';
import { AddDialogComponent } from '../dialogs/add-dialog/add-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { PopupComponent } from "../popup/popup.component";
import { ReviewComponent } from "../review/review.component";

@Component({
  selector: 'app-media-page',
  standalone: true,
  imports: [CommonModule, AddButtonComponent, PopupComponent, ReviewComponent],
  templateUrl: './media-page.component.html',
  styleUrl: './media-page.component.css'
})
export class MediaPageComponent implements OnInit, OnDestroy {

  readonly dialog = inject(MatDialog);
  unsubscribeSignal: Subject<void> = new Subject();
  actors: Person[] = [];
  mainActorsName: string[] = [];
  popupDisplay: boolean = false;
  popupType: boolean = true;
  title: string = '';
  subtitle: string = '';
  showName: string = "";
  userRating: string = ''
  director: string = '';
  foundShow: ShowInputModel = new ShowInputModel()

  constructor(private route: ActivatedRoute, private showService: ShowService,
    private searchMovieService: SearchMovieService,
    private localStorageService: LocalStorageService,
    private userService: UserService,
    private router: Router) {
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd && this.foundShow.title != undefined) {
        let currentUrl = this.foundShow.title
        if (currentUrl != this.formatTitle(this.route.snapshot.url[2].path)) {
          this.actors = [];
          this.mainActorsName = [];
          this.foundShow = new ShowInputModel()
          this.showName = this.route.snapshot.url[2].path.replace(new RegExp("-", "g"), ' ')
          this.loadShow()
        }

      }
    })
  }

  ngOnDestroy(): void {
    this.unsubscribeSignal.next()
    this.unsubscribeSignal.unsubscribe()
  }

  ngOnInit(): void {
    this.showName = this.route.snapshot.url[2].path.replace(new RegExp("-", "g"), ' ');

    this.loadShow()
  }

  loadShow() {
    this.searchMovieService.searchTitle(this.showName)
      .pipe(takeUntil(this.unsubscribeSignal))
      .subscribe({
        next: (res: Results) => {
          this.foundShow = res.results.find(m => m.original_title == this.showName || m.original_name == this.showName)
            || new ShowInputModel()

          this.foundShow = this.mapShowFields(this.foundShow)

          this.getUserRating()

          this.getDirectorAndActors()
        }
      })
  }

  openDialog(title: string) {
    if (this.localStorageService.isLoggedIn()) {
      const dialogRef = this.dialog.open(AddDialogComponent, {
        data: title
      });

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

  getDirectorAndActors() {
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
            if (res.cast[i] != undefined) {
              this.actors.push(res.cast[i]);
              this.mainActorsName.push(res.cast[i].name)
              if (i < 7) {
                this.mainActorsName[i] += ",";
              }
            }
          }
          let lastIndex = this.mainActorsName.length - 1
          this.mainActorsName[lastIndex] = this.mainActorsName[lastIndex].slice(0, -1)
          this.mainActorsName[lastIndex] += "."
        },
      })
  }

  mapShowFields(show: any) {
    show.genre_names = this.showService.convertGenres(show.genre_ids);

    if (show.release_date == undefined) {
      show.release_date = show.first_air_date;
    }

    if (show.title == undefined) {
      show.title = show.name;
    }
    return show
  }

  getUserRating() {
    if (this.isLoggedIn()) {
      this.userService.findByToken()
        .pipe(takeUntil(this.unsubscribeSignal))
        .subscribe({
          next: (res: User) => {
            res.shows.forEach(movie => {
              if (movie.originalTitle == this.foundShow.original_title) {
                this.foundShow.user_rating = movie.userRating;
                this.foundShow.user_review = movie.userReview;
              }
            })
          }
        })
    }
  }

  showImage(posterPath: string) {
    return 'https://image.tmdb.org/t/p/w400' + posterPath

  }

  isLoggedIn() {
    return this.localStorageService.isLoggedIn()
  }

  formatTitle(title: string): string {
    return title.replace(new RegExp(" ", "g"), '-');
  }
}
