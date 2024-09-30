import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-review',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './review.component.html',
  styleUrl: './review.component.css'
})
export class ReviewComponent {

  isLiked: boolean = false;

  changeLike(){
    if(this.isLiked){
      this.isLiked = false;
    } else {
      this.isLiked = true;
    }
  }
}
