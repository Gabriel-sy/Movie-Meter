import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router } from '@angular/router';
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
import { ReviewService } from '../../../services/review.service';
import { FullShowViewModel } from '../../../domain/FullShowViewModel';

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
  foundShow: FullShowViewModel = new FullShowViewModel()

  constructor(private route: ActivatedRoute, private reviewService: ReviewService,
    private searchMovieService: SearchMovieService,
    private localStorageService: LocalStorageService,
    private userService: UserService,
    private router: Router) {
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd && this.foundShow.originalTitle != undefined) {
        let currentUrl = this.foundShow.originalTitle
        if (currentUrl != this.formatTitle(this.route.snapshot.url[2].path)) {
          this.actors = [];
          this.mainActorsName = [];
          this.foundShow = new FullShowViewModel()
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
    this.searchMovieService
      .getFullDetailShow(this.showName, this.localStorageService.get('uesrName'))
      .pipe(takeUntil(this.unsubscribeSignal))
      .subscribe({
        next: (res: FullShowViewModel) => {
          this.foundShow = res;
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
