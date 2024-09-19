import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  constructor(private localStorageService: LocalStorageService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    

    if(this.localStorageService.isLoggedIn() && !req.headers.get('Authorization')){
      const setJwt = req.clone({
        headers: req.headers.append("Authorization", "Bearer " + this.localStorageService.get('jwt')),
      });

      

      return next.handle(setJwt);
    }
    return next.handle(req);

  }
}
