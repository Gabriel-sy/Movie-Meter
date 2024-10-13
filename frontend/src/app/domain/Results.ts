import { ShowInputModel } from "./ShowInputModel";
import { Person } from "./Person";

export class Results {
  page!: number
  results!: ShowInputModel[]
  total_pages!: number
  total_results!: number
  crew!: Person[]
  cast!: Person[]
}