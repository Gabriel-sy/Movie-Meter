import { Movie } from "./Movie"
import { MovieResponseDTO } from "./MovieResponseDTO"

export class User {
  name!: string
  email!: string
  shows!: MovieResponseDTO[]
}