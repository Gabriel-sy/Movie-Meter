import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ShowService } from '../../../services/show.service';
import { Observable, map, tap } from 'rxjs';
import { ReviewResponse } from '../../../domain/ReviewResponse';

@Component({
  selector: 'app-review',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './review.component.html',
  styleUrl: './review.component.css'
})
export class ReviewComponent {

  @Input() title: string = ''
  reviews$: Observable<ReviewResponse[]> = new Observable<ReviewResponse[]>()
  isLiked: boolean = false;

  constructor(private showService: ShowService){}

  changeLike(){
    if(this.isLiked){
      this.isLiked = false;
    } else {
      this.isLiked = true;
    }
  }

  ngOnInit(): void {
    this.reviews$ = this.showService.getCommentsByTitle(this.title)
  }
}
