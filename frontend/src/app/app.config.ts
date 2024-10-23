import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { AuthInterceptorService } from './services/auth-interceptor.service';
import { ErrorInterceptorService } from './services/error-interceptor.service';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { PopupComponent } from './components/main/popup/popup.component';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }),
  provideRouter(routes, withInMemoryScrolling({ scrollPositionRestoration: "top" })),
  provideClientHydration(),
  provideHttpClient(withInterceptorsFromDi(), withFetch()),
  importProvidersFrom(NgxSkeletonLoaderModule.forRoot({
    animation: 'pulse', theme: {
      extendsFromRoot: true,
      backgroundColor: '#2e2e2e'
    }
  })),
  provideAnimations(),
  provideToastr({
    maxOpened: 1,
    timeOut: 2500,
    toastClass: '',
    autoDismiss: true,
    positionClass: 'toast-top-left'
  }),
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptorService, multi: true },
  ]
};
