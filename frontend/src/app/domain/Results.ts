import { Movie } from "./Movie";

export class Results {
  page!: number
  results!: Movie[]
  total_pages!: number
  total_results!: number
}