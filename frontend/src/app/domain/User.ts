
import { ReviewResponse } from "./ReviewResponse"
import { ReviewViewModel } from "./ReviewViewModel"

export class User {
  name!: string
  email!: string
  profilePicture!: number[]
  biography!: string
  totalLikes!: number
  reviews!: ReviewViewModel[]
  reviewLikes!: ReviewResponse[]
}