import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../domain/User';
import { EditUserInputModel } from '../domain/EditUserInputModel';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly API = "https://localhost:44301/api/user"
  constructor(private http: HttpClient) { }

  findByToken() {
    return this.http.get<User>(this.API + "api/user/userByToken");
  }

  uploadProfilePicture(formData: FormData){
    return this.http.post(this.API + '/upload/picture', formData);
  }

  findByUserName(userName: string){
    return this.http.get<User>(this.API, {
      params: {
        name: userName
      }
    })
  }

  editUserDetails(data: EditUserInputModel){
    return this.http.put(this.API, data);
  }
}
