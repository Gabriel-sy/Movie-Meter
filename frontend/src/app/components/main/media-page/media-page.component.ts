import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ShowService } from '../../../services/show.service';
import { SearchMovieService } from '../../../services/search-movie.service';
import { Results } from '../../../domain/Results';
import { Movie } from '../../../domain/Movie';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Person } from '../../../domain/Person';
import { AddButtonComponent } from "../add-button/add-button.component";
import { LocalStorageService } from '../../../services/local-storage.service';
import { UserService } from '../../../services/user.service';
import { User } from '../../../domain/User';
import { AddDialogComponent } from '../dialogs/add-dialog/add-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { PopupComponent } from "../popup/popup.component";

@Component({
  selector: 'app-media-page',
  standalone: true,
  imports: [CommonModule, AddButtonComponent, PopupComponent],
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
  showId: string = "";
  foundShow: any;

  constructor(private route: ActivatedRoute, private showService: ShowService,
    private searchMovieService: SearchMovieService,
    private localStorageService: LocalStorageService,
    private userService: UserService) { }

  ngOnDestroy(): void {
    this.unsubscribeSignal.next()
    this.unsubscribeSignal.unsubscribe()
  }

  ngOnInit(): void {
    this.showId = this.route.snapshot.url[2].path.replace(new RegExp("-", "g"), ' ');

    this.searchMovieService.searchTitle(this.showId)
      .subscribe({
        next: (res: Results) => {
          this.foundShow = res.results.find(m => m.original_title == this.showId || m.original_name == this.showId)

          this.foundShow.genre_names = this.showService.convertGenres(this.foundShow.genre_ids);

          if (this.foundShow.release_date == undefined) {
            this.foundShow.release_date = this.foundShow.first_air_date;
          }

          if (this.foundShow.title == undefined) {
            this.foundShow.title = this.foundShow.name;
          }

          this.userService.findByToken().subscribe({
            next: (res: User) => {
              res.shows.forEach(movie => {
                if (movie.title == this.foundShow.title) {
                  this.foundShow.user_rating = movie.userRating;
                }
              })

            }
          })

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
                  if(res.cast[i] != undefined){
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
      })
  }

  openDialog(title: string) {
    if (this.localStorageService.isLoggedIn()) {
      const dialogRef = this.dialog.open(AddDialogComponent, {
        data: title
      });

      const closeDialog: Subscription = dialogRef.afterClosed().subscribe({
        next: (res) => {
          if (!(typeof res === 'string')) {
            this.popupDisplay = true
            this.popupType = res ? true : false;
            this.title = this.popupType ? 'Sucesso!' : 'Erro ao adicionar'
            this.subtitle = this.popupType ?
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
}
