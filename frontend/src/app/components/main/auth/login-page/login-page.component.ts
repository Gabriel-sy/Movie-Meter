import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { JwtResponse } from '../../../../domain/JwtResponse';
import { LocalStorageService } from '../../../../services/local-storage.service';
import { Subject, delay, takeUntil } from 'rxjs';
import { PopupComponent } from "../../popup/popup.component";
import { FormErrorComponent } from "../../form-error/form-error.component";

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, PopupComponent, FormErrorComponent],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent implements OnDestroy{

  isLoading: boolean = false;
  popupDisplay: boolean = false;
  popupType: boolean = true;
  title: string = '';
  subtitle: string = '';
  invalidCredentials: boolean = false;
  unsubscribeSignal: Subject<void> = new Subject();
  formData = this.fb.group({
    email: ['', [Validators.required, Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
    password: ['', Validators.required]
  })

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router,
    private localStorageService: LocalStorageService) { }

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
          delay(1500),
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
                this.popupDisplay = true
                this.popupType = false
                this.title = "Erro ao fazer login"
                this.subtitle = "Ocorreu um erro ao se comunicar com o servidor, tente novamente"

                setTimeout(() => {
                  this.popupDisplay = false;
                }, 2500);
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
