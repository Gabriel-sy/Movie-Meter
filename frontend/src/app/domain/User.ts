
import { ReviewResponse } from "./ReviewResponse"
import { ShowViewModel } from "./ShowViewModel"

export class User {
  name!: string
  email!: string
  shows!: ShowViewModel[]
  reviewLikes!: ReviewResponse[]
}