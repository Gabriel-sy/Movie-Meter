import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, finalize, tap, throwError } from 'rxjs';
import { LocalStorageService } from './local-storage.service';
import { PopupService } from './popup.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorInterceptorService implements HttpInterceptor {
  private activeRequests = new Map<string, { timeoutId: any, startTime: number }>();

  constructor(private localStorageService: LocalStorageService, private popupService: PopupService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const longRequestThreshold = 6000;
    const requestId = req.url + (Math.random() * 10000);
    const startTime = Date.now();
    let timeoutId: any;

    if (!this.activeRequests.has(requestId)) {
      timeoutId = setTimeout(() => {
        const request = this.activeRequests.get(requestId);
        if (request && Date.now() - request.startTime >= longRequestThreshold) {
          this.popupService.showError(
            "Servidor inicializando",
            "Por favor aguarde enquanto o servidor é inicializado",
            3000
          );
        }
      }, longRequestThreshold);

      this.activeRequests.set(requestId, { timeoutId, startTime });
    }

    return next.handle(req).pipe(
      catchError(err => {
        if (err.status == 401) {
          this.localStorageService.logout();
        }
        return throwError(() => err);
      }),
      finalize(() => {
        const request = this.activeRequests.get(requestId);
        if (request) {
          clearTimeout(request.timeoutId);
          this.activeRequests.delete(requestId);
        }
      })
    );
  }
}