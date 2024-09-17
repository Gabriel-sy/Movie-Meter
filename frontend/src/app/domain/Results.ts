import { Movie } from "./Movie";
import { Person } from "./Person";

export class Results {
  page!: number
  results!: Movie[]
  total_pages!: number
  total_results!: number
  crew!: Person[]
  cast!: Person[]
}