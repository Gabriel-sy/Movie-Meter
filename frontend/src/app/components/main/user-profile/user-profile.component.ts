import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { User } from '../../../domain/User';
import { UserService } from '../../../services/user.service';
import { LocalStorageService } from '../../../services/local-storage.service';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { FavTitleDialogComponent } from '../dialogs/fav-title-dialog/fav-title-dialog.component';
import { Observable, Subject, Subscription, delay, takeUntil } from 'rxjs';
import { FavShowService } from '../../../services/fav-show.service';
import { FavShowViewModel } from '../../../domain/FavShowViewModel';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit, OnDestroy {
  user: User = new User()
  favShows: FavShowViewModel[] = []
  unsubscribeSignal: Subject<void> = new Subject();
  userName: string = ''
  shouldShowEditButton: boolean = false
  changeAddSvgOpacity1: boolean = false;
  changeAddSvgOpacity2: boolean = false;
  changeAddSvgOpacity3: boolean = false;
  changeAddSvgOpacity4: boolean = false;
  readonly dialog = inject(MatDialog);

  constructor(private userService: UserService,
    private route: ActivatedRoute,
    private localStorageService: LocalStorageService,
    private favShowService: FavShowService) { }

  ngOnDestroy(): void {
    this.unsubscribeSignal.next()
    this.unsubscribeSignal.unsubscribe()
  }

  ngOnInit(): void {
    this.userName = this.route.snapshot.url[1].path

    this.shouldShowEditButton = this.userName == this.localStorageService.get('userName')

    this.updateFavShows()

    this.userService.findByUserName(this.userName)
      .pipe(takeUntil(this.unsubscribeSignal))
      .subscribe({
        next: (res: User) => {
          this.user = res;
        }
      })
  }

  openFavTitleDialog() {
    const dialog = this.dialog.open(FavTitleDialogComponent, {
      data: this.localStorageService.get('userName')
    })

    const closeDialog: Subscription = dialog.afterClosed()
      .pipe(takeUntil(this.unsubscribeSignal))
      .subscribe({
        next: () => {
          this.updateFavShows()
        }
      })
  }

  deleteFavShow(originalTitle: string, event: Event) {
    event.stopPropagation()
    this.favShowService.deleteFavShow(this.localStorageService.get('userName'), originalTitle)
      .pipe(takeUntil(this.unsubscribeSignal))
      .subscribe({
        complete: () => {
          this.updateFavShows()
        }
      })

  }

  stopPropagation(event: Event) {
    event.stopPropagation()
  }

  showImage(posterPath: string) {
    return 'https://image.tmdb.org/t/p/w400' + posterPath
  }

  updateFavShows() {
    this.favShowService.getFavShows(this.userName)
      .pipe(
        delay(1000),
        takeUntil(this.unsubscribeSignal))
      .subscribe({
        next: (res: FavShowViewModel[]) => {
          this.favShows = res.slice(0, 4)
        }
      })
  }
}
