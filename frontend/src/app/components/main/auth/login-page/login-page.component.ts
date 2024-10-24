import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { JwtResponse } from '../../../../domain/JwtResponse';
import { LocalStorageService } from '../../../../services/local-storage.service';
import { Subject, delay, takeUntil } from 'rxjs';
import { FormErrorComponent } from "../../form-error/form-error.component";
import { PopupService } from '../../../../services/popup.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormErrorComponent],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent implements OnDestroy{

  isLoading: boolean = false;
  invalidCredentials: boolean = false;
  unsubscribeSignal: Subject<void> = new Subject();
  formData = this.fb.group({
    email: ['', [Validators.required, Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
    password: ['', Validators.required]
  })

  constructor(private fb: FormBuilder, 
    private authService: AuthService, 
    private router: Router,
    private localStorageService: LocalStorageService,
    private popupService: PopupService) { }

  ngOnDestroy(): void {
    this.unsubscribeSignal.next()
    this.unsubscribeSignal.unsubscribe()
  }


  changeInputColor(fieldName: string) {
    if (this.fieldHasRequiredError(fieldName) || this.fieldHasPatternError(fieldName)) {
      return '#EA3323';
    }
    return 'transparent'
  }

  onSubmit() {
    this.formData.markAllAsTouched();
    if (this.formData.valid) {
      let values = this.formData.value;
      if (values.email && values.password) {
        this.isLoading = true;
        this.authService.login(values.email, values.password).pipe(
          takeUntil(this.unsubscribeSignal))
          .subscribe({
            next: (res: JwtResponse) => {
              if (this.localStorageService.clear()) {
                this.localStorageService.set("jwt", res.jwt)
                this.localStorageService.set("expireDate", (Date.now().toString()))
                this.localStorageService.set("userName", res.name)

                this.router.navigateByUrl('')
              }
            },
            error: (err) => {
              if (err.status == 400) {
                this.invalidCredentials = true
              } else {
                this.invalidCredentials = false
                this.popupService.showError("Ocorreu um erro interno", "Houve um problema ao se comunicar com o servidor, tente novamente mais tarde.")
              }
              this.isLoading = false
            },
            complete: () => { this.isLoading = false }
          })
      }
    }
  }

  fieldHasRequiredError(fieldName: string) {
    return this.formData.get(fieldName)?.hasError('required') && this.formData.get(fieldName)?.touched;
  }

  fieldHasPatternError(fieldName: string) {
    if (this.formData.get(fieldName)?.hasError('pattern') && !(this.formData.get(fieldName)?.hasError('required')) && this.formData.get(fieldName)?.touched) {
      return true;
    }
    return false;
  }

}
