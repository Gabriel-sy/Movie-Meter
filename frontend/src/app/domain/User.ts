
import { ReviewResponse } from "./ReviewResponse"
import { ShowViewModel } from "./ShowViewModel"

export class User {
  name!: string
  email!: string
  profilePicture!: number[]
  biography!: string
  shows!: ShowViewModel[]
  reviewLikes!: ReviewResponse[]
}