import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SuccessPopupComponent } from '../components/main/popups/success-popup/success-popup.component';
import { ErrorPopupComponent } from '../components/main/popups/error-popup/error-popup.component';

@Injectable({
  providedIn: 'root'
})
export class PopupService {

  constructor(private toastr: ToastrService) { }

  showSuccess(title: string, message: string, timeout = 2500) {
    this.toastr.success(message, title, 
      { 
        timeOut: timeout,
        toastComponent: SuccessPopupComponent
      })
  }

  showError(title: string, message: string, timeout = 2500) {
    this.toastr.error(message, title, 
      { 
        timeOut: timeout,
        toastComponent: ErrorPopupComponent
      })
  }
}
