import { CommonModule } from '@angular/common';
import { Component, OnDestroy, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../services/auth.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from '../../dialogs/error-dialog/error-dialog.component';
import { FormErrorComponent } from "../../form-error/form-error.component";
import { Subject, delay, takeUntil } from 'rxjs';
import { PopupComponent } from "../../popup/popup.component";

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormErrorComponent, PopupComponent],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.css'
})
export class RegisterPageComponent implements OnDestroy {

  emailExists: boolean = false;
  isSubmitted: boolean = false;
  spinnerDisplay: boolean = false;
  isLoading: boolean = false;
  popupDisplay: boolean = false;
  popupType: boolean = true;
  title: string = '';
  subtitle: string = '';
  unsubscribeSignal: Subject<void> = new Subject();
  formData = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
    password: ['', Validators.required]
  })

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) { }

  ngOnDestroy(): void {
    this.unsubscribeSignal.next()
    this.unsubscribeSignal.unsubscribe()
  }

  onSubmit() {
    this.formData.markAllAsTouched();
    if (this.formData.valid) {
      let values = this.formData.value;
      if (values.email && values.name && values.password) {
        this.spinnerDisplay = true;
        this.isLoading = true;
        this.authService.registerUser(values.name, values.email, values.password)
          .pipe(
            delay(2000),
            takeUntil(this.unsubscribeSignal))
          .subscribe({
            next: () => {
            },
            error: (err) => {
              this.spinnerDisplay = false;
              this.isLoading = false;
              if (err.status == 400) {
                this.emailExists = true;
              } else {
                this.emailExists = false
                this.popupDisplay = true
                this.popupType = false
                this.title = "Erro ao registrar"
                this.subtitle = "Ocorreu um erro ao se comunicar com o servidor, tente novamente"

                setTimeout(() => {
                  this.popupDisplay = false;
                }, 2500);
              }

            },
            complete: () => {
              this.router.navigateByUrl('login')
              this.spinnerDisplay = false;
              this.isLoading = false;
            }
          })
      }
    }
  }

  changeInputColor(fieldName: string) {
    if (this.fieldHasRequiredError(fieldName) || this.fieldHasPatternError(fieldName)) {
      return '#FF6B6B';
    }
    return 'transparent'
  }

  fieldHasRequiredError(fieldName: string): boolean {

    return this.formData.get(fieldName)?.hasError('required') && this.formData.get(fieldName)?.touched || false;
  }

  fieldHasPatternError(fieldName: string) {
    if (this.formData.get(fieldName)?.hasError('pattern') && !(this.formData.get(fieldName)?.hasError('required')) && this.formData.get(fieldName)?.touched) {
      return true;
    }
    return false;
  }
}
