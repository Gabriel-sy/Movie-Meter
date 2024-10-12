import { Person } from "./Person";

export class FullShowViewModel {
  showId!: number;
  originalTitle!: string;
  translatedTitle!: string;
  releaseDate!: string;
  genreNames!: string[];
  voteAverage!: number;
  mediaType!: string;
  posterPath!: string;
  userRating!: number;
  overview!: string;
  directorName!: string;
  userReview!: string;
  cast!: Person[];
}