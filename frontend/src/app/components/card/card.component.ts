import { Component, Input, OnInit } from '@angular/core';
import { ShowService } from '../../services/show.service';
import { Observable } from 'rxjs';
import { Movie } from '../../domain/Movie';
import { CommonModule } from '@angular/common';
import { MovieResponseDTO } from '../../domain/MovieResponseDTO';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent implements OnInit{
  constructor(private showService: ShowService){}

  shows: Observable<MovieResponseDTO[]> = new Observable<MovieResponseDTO[]>()

  ngOnInit(): void {
    this.shows = this.showService.findAllShows()
  }

  showImage(posterPath: string) {
    return 'https://image.tmdb.org/t/p/w500' + posterPath
  }
}
