import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FavShowInputModel } from '../domain/FavShowInputModel';
import { FavShowViewModel } from '../domain/FavShowViewModel';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FavShowService {

  private readonly API = environment.API + "/api/fav";

  constructor(private http: HttpClient) { }

  addFavShow(model: FavShowInputModel){
    return this.http.post(this.API, model);
  }

  getFavShows(userName: string){
    return this.http.get<FavShowViewModel[]>(this.API, {
      params: {
        userName: userName
      }
    })
  }

  deleteFavShow(userName: string, originalTitle: string){
    return this.http.delete(this.API, {
      params: {
        userName: userName,
        originalTitle: originalTitle
      }
    })
  }
}
