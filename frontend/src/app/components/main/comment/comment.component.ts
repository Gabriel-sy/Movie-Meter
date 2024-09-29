import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.css'
})
export class CommentComponent {

  isLiked: boolean = false;

  changeLike(){
    if(this.isLiked){
      this.isLiked = false;
    } else {
      this.isLiked = true
    }
  }
}
