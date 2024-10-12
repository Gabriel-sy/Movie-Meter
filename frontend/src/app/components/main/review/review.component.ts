import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';
import { Observable, Subject, delay, map, startWith, take, takeUntil } from 'rxjs';
import { LocalStorageService } from '../../../services/local-storage.service';
import { User } from '../../../domain/User';
import { SpinnerComponent } from "../spinner/spinner.component";
import { Paginator } from '../../../domain/Paginator';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { RouterLink } from '@angular/router';
import { ReviewService } from '../../../services/review.service';
import { ReviewViewModel } from '../../../domain/ReviewViewModel';

@Component({
  selector: 'app-review',
  standalone: true,
  imports: [CommonModule, SpinnerComponent, RouterLink],
  templateUrl: './review.component.html',
  styleUrl: './review.component.css',
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
export class ReviewComponent implements OnDestroy {
  @Input() title: string = ''
  @Input() showId: string = ''
  reviews$: Observable<ReviewViewModel[]> = new Observable<ReviewViewModel[]>()
  user$: Observable<User> = new Observable<User>()
  unsubscribeSignal: Subject<void> = new Subject();
  userName: string = '';
  sortCategory: string = ''
  order: string = ''
  currentPage: number = 1;
  itemsPerPage: number = 0;
  totalItems: number = 0;
  totalPages: number = 0;
  totalPagesArray: number[] = []
  dropdownDisplay: boolean = false

  constructor(private reviewService: ReviewService,
    private localStorageService: LocalStorageService) { }

  ngOnDestroy(): void {
    this.unsubscribeSignal.next()
    this.unsubscribeSignal.unsubscribe()
  }

  ngOnInit(): void {
    this.userName = this.localStorageService.get('userName')
    this.getReviews()

    this.reviewService.getCommentsHeaderByTitle(this.title)
      .pipe(takeUntil(this.unsubscribeSignal))
      .subscribe({
        next: (res) => {
          let pagination = JSON.parse(res.headers.get('pagination') || '') as Paginator

          this.currentPage = pagination.currentPage;
          this.itemsPerPage = pagination.itemsPerPage;
          this.totalItems = pagination.totalItems;
          this.totalPages = pagination.totalPages;
          for (let i = 1; i <= pagination.totalPages; i++) {
            this.totalPagesArray.push(i);
          }
        }
      })
  }

  getReviews(sortCategory?: string, order?: string) {
    if (this.dropdownDisplay) {
      this.dropdownDisplay = false
    }
    if (sortCategory && order) {
      this.sortCategory = sortCategory
      this.order = order
    }
    this.reviews$ = this.reviewService.getCommentsByTitle
      (this.title, this.currentPage, sortCategory, order)
      .pipe(map((res: ReviewViewModel[]) => res.map(s => ({
        ...s,
        isLiked: s.likeNames.includes(this.userName),
        reviewUserName: s.userName
      })),
        takeUntil(this.unsubscribeSignal)))
  }

  changeCurrentPage(subtractOrAdd: boolean) {
    subtractOrAdd ? this.currentPage++ : this.currentPage--
    this.getReviews(this.sortCategory, this.order)
  }

  changeLike(review: ReviewViewModel) {
    review.isLiked = !review.isLiked;
    review.likeUserName = this.userName
    this.reviewService.changeLikes(review, this.showId)
      .pipe(takeUntil(this.unsubscribeSignal))
      .subscribe({
        next: (res: ReviewViewModel) => {
          review.likeAmount = res.likeAmount
        }
      })
  }

  isLoggedIn() {
    return this.localStorageService.isLoggedIn()
  }

  likeText(likeAmount: number) {
    if (likeAmount == 1) {
      return 'like'
    }
    return 'likes'
  }

  showDropDown() {
    this.dropdownDisplay = !this.dropdownDisplay
  }
}
