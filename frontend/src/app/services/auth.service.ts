import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtResponse } from '../domain/JwtResponse';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly API = environment.API + "/api/user";

  constructor(private http: HttpClient) { }

  registerUser(name: string, email: string, password: string){
    var objectToSend = {
      name: name,
      email: email,
      password: password
    }
    
    return this.http.post(this.API + "/register", objectToSend);
  }

  login(email: string, password: string){
    var objectToSend = {
      email: email,
      password: password
    }
    
    return this.http.post<JwtResponse>(this.API + "/login", objectToSend);
  }
}
