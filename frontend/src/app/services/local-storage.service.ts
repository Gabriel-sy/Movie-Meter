import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  private storage: Storage;

  constructor() {
    this.storage = window.localStorage;
  }

  set(key: string, value: string): boolean {
    if(this.storage){
      this.storage.setItem(key, value);
      return true;
    }
    return false;
  }

  get(key: string): any {
    if(this.storage){
      return this.storage.getItem(key);
    }
    return undefined;
  }

  clear(): boolean{
    if(this.storage){
      this.storage.clear();
      return true;
    }
    return false;
  }

  remove(key: string): boolean {
    if(this.storage){
      this.storage.removeItem(key);
      return true;
    }
    return false;
  }

  isLoggedIn(): boolean {
    if(this.storage){
      let expireDate = this.get('expireDate');

      if(this.get('jwt') == null){
        return false;
      }

      if(expireDate){
        let expireDateAsNumber = parseInt(expireDate)
        let dateNow = Date.now();
  
        dateNow /= 60000;
        expireDateAsNumber /= 60000;
  
        if(parseInt((dateNow - expireDateAsNumber).toFixed()) > 2){
          console.log('nao logado')
          return false;
        } else {
          return true;
        }

      } else {
        return false;
      }
    }
    return false;
  }
}
