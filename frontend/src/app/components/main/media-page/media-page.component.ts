import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { SearchMovieService } from '../../../services/search-movie.service';
import { Observable, Subject, Subscription, delay, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { AddButtonComponent } from "../add-button/add-button.component";
import { LocalStorageService } from '../../../services/local-storage.service';
import { AddDialogComponent } from '../dialogs/add-dialog/add-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ReviewComponent } from "../review/review.component";
import { FullShowViewModel } from '../../../domain/FullShowViewModel';
import { PopupService } from '../../../services/popup.service';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@Component({
  selector: 'app-media-page',
  standalone: true,
  imports: [CommonModule, AddButtonComponent, ReviewComponent, NgxSkeletonLoaderModule],
  templateUrl: './media-page.component.html',
  styleUrl: './media-page.component.css'
})
export class MediaPageComponent implements OnInit, OnDestroy {

  readonly dialog = inject(MatDialog);
  unsubscribeSignal: Subject<void> = new Subject();
  mainActorsName: string[] = [];
  showName: string = "";
  userRating: string = ''
  director: string = '';
  foundShow: FullShowViewModel = new FullShowViewModel()
  imgTheme = {
    width: '100%',
    height: '750px',
    borderRadius: '15px',
    backgroundColor: '#2a2a2a'
  };

  titleTheme = {
    width: '60%',
    height: '3rem',
    marginTop: '50px',
    backgroundColor: '#2a2a2a',
    borderRadius: '8px',
  };

  genreTheme = {
    width: '100px',
    height: '40px',
    borderRadius: '30px',
    backgroundColor: '#2a2a2a',
    display: 'inline-block',
    margin: '0 10px 10px 0'
  };

  ratingTheme = {
    width: '150px',
    height: '24px',
    borderRadius: '4px',
    backgroundColor: '#2a2a2a'
  };

  overviewTheme = {
    width: '100%',
    height: '20px',
    marginBottom: '10px',
    borderRadius: '4px',
    backgroundColor: '#2a2a2a'
  };

  infoCardTheme = {
    width: '100%',
    height: '24px',
    borderRadius: '4px',
    backgroundColor: '#2a2a2a'
  };

  castTheme = {
    width: '100%',
    height: '20px',
    marginBottom: '8px',
    borderRadius: '4px',
    backgroundColor: '#2a2a2a'
  };

  actorImageTheme = {
    width: '180px',
    height: '270px',
    borderRadius: '15px 15px 0 0',
    backgroundColor: '#2a2a2a'
  };

  actorNameTheme = {
    width: '80%',
    height: '20px',
    marginBottom: '8px',
    borderRadius: '4px',
    backgroundColor: '#2a2a2a'
  };

  characterNameTheme = {
    width: '60%',
    height: '16px',
    borderRadius: '4px',
    backgroundColor: '#2a2a2a'
  };


  constructor(private route: ActivatedRoute,
    private searchMovieService: SearchMovieService,
    private localStorageService: LocalStorageService,
    private router: Router,
    private popupService: PopupService) {
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        let currentUrl = this.foundShow.originalTitle
        if (currentUrl != this.formatTitle(this.route.snapshot.url[2].path)) {
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
  }

  loadShow() {
    this.searchMovieService
      .getFullDetailShow(this.showName, this.localStorageService.get('userName'))
      .pipe(takeUntil(this.unsubscribeSignal))
      
      .subscribe({
        next: (res: FullShowViewModel) => {
          this.foundShow = res;
          this.foundShow.cast = res.cast.filter(p => p.profile_Path != undefined)
          
          for(let i = 0; i < this.foundShow.cast.length; i++){
            let name = this.foundShow.cast[i].name
            if(i == this.foundShow.cast.length - 1){
              this.mainActorsName.push(name += ".")
            } else {
              this.mainActorsName.push(name += ", ")
            }  
          }
        },
        error: (err) => {
          this.popupService.showError("Ocorreu um erro", err.error.message)
          this.router.navigateByUrl('')
        },
      })
  }

  openDialog(title: string) {
    if (this.localStorageService.isLoggedIn()) {
      this.dialog.open(AddDialogComponent, {
        data: title
      });
    } else {
      this.popupService.showError("Ocorreu um erro", "Para adicionar uma avaliação, você precisa estar logado.")
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
