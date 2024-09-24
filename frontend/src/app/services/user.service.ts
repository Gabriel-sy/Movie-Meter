import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../domain/User';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly API = "https://localhost:44301/"
  constructor(private http: HttpClient) { }

  findByToken() {
    return this.http.get<User>(this.API + "/api/user/userByToken");
  }
}
