import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ShowService } from '../../../services/show.service';
import { Observable, map, tap } from 'rxjs';
import { LocalStorageService } from '../../../services/local-storage.service';
import { UserService } from '../../../services/user.service';
import { User } from '../../../domain/User';
import { ShowViewModel } from '../../../domain/ShowViewModel';

@Component({
  selector: 'app-review',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './review.component.html',
  styleUrl: './review.component.css'
})
export class ReviewComponent {

  @Input() title: string = ''
  @Input() showId: string = ''
  reviews$: Observable<ShowViewModel[]> = new Observable<ShowViewModel[]>()
  user$: Observable<User> = new Observable<User>()
  userName: string = '';

  constructor(private showService: ShowService, private localStorageService: LocalStorageService
    , private userService: UserService){}

  ngOnInit(): void {
    this.userName = this.localStorageService.get('userName')
    this.reviews$ = this.showService.getCommentsByTitle(this.title)
    .pipe(map((res: ShowViewModel[]) => {
      res.forEach(s => {
        s.isLiked = false
        s.reviewUserName = s.userName
        s.likeNames.forEach(n => {
          console.log(n)
          if(n == this.userName) s.isLiked = true
        })
      })
      return res;
    }))
    
  }

  changeLike(review: ShowViewModel){
    review.isLiked = !review.isLiked;
    review.likeUserName = this.userName
    this.showService.changeLikes(review, this.showId)
    .subscribe({
      next: (res: ShowViewModel) => {
        review.likeAmount = res.likeAmount
      }
    })
  }

  isLoggedIn(){
    return this.localStorageService.isLoggedIn()
  }

  likeText(likeAmount: number){
    if(likeAmount == 1){
      return 'like'
    } 
    return 'likes'
  }
}
