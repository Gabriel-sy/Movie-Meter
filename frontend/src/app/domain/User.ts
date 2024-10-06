
import { ReviewResponse } from "./ReviewResponse"
import { ShowViewModel } from "./ShowViewModel"

export class User {
  name!: string
  email!: string
  profilePicture!: number[]
  biography!: string
  totalLikes!: number
  reviews!: ShowViewModel[]
  reviewLikes!: ReviewResponse[]
}