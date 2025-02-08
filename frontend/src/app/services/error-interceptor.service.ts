import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, finalize, tap, throwError } from 'rxjs';
import { LocalStorageService } from './local-storage.service';
import { PopupService } from './popup.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorInterceptorService implements HttpInterceptor {

  constructor(private localStorageService: LocalStorageService, private popupService: PopupService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const longRequestThreshold = 6000;
    let requestStarted = false;
    let timeoutId: any
    return next.handle(req).pipe(catchError(err => {
      tap(() => {
        requestStarted = true;
        timeoutId = setTimeout(() => {
          if (requestStarted) {
            this.popupService.showError("Servidor inicializando", "Por favor, aguarde o servidor está sendo inicializado.", 3000)
          }
        }, longRequestThreshold);
      }),
      finalize(() => {
        requestStarted = false;
        clearTimeout(timeoutId);
      })
      if (err.status == 401) {
        this.localStorageService.logout()
      }
      return throwError(() => err)
    }),
      )
  }
}
