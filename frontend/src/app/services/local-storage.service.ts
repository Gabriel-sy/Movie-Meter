import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from '../components/main/dialogs/error-dialog/error-dialog.component';
import { Router } from '@angular/router';
import { UserService } from './user.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  private storage: any;
  private readonly platformId = inject(PLATFORM_ID)
  readonly dialog = inject(MatDialog);


  constructor(private router: Router) {
    if(isPlatformBrowser(this.platformId)){
      this.storage = localStorage;
    } else {
      this.storage = undefined;
    }
    
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
    if(this.storage && isPlatformBrowser(this.platformId)){

      
      let expireDate = this.get('expireDate');

      if(this.get('jwt') == null){
        return false;
      }

      if(expireDate){
        let expireDateAsNumber = parseInt(expireDate)
        let dateNow = Date.now();
  
        dateNow /= 60000;
        expireDateAsNumber /= 60000;
  
        if(parseInt((dateNow - expireDateAsNumber).toFixed()) > 2000){
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

  logout(): boolean{
    if(this.storage){
      this.storage.removeItem('jwt');
      this.storage.removeItem('expireDate');
      this.storage.removeItem('userName');
      this.router.navigateByUrl('login')
      this.dialog.open(ErrorDialogComponent, {
        data: {title: "Sessão expirada", subtitle: "Sua sessão expirou, por favor faça login novamente"}
      })
      return true;
    }
    return false;
  }
}
