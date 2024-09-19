import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { JwtResponse } from '../../../../domain/JwtResponse';
import { LocalStorageService } from '../../../../services/local-storage.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent {


  invalidCredentials: boolean = false;
  formData = this.fb.group({
    email: ['', [Validators.required, Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
    password: ['', Validators.required]
  })

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router,
    private localStorageService: LocalStorageService) { }


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
        this.authService.login(values.email, values.password)
          .subscribe({
            next: (res: JwtResponse) => {
              if(this.localStorageService.clear()){
                this.localStorageService.set("jwt", res.jwt)
                this.localStorageService.set("expireDate", (Date.now().toString()))
                
                this.router.navigateByUrl('')
              }
              
            },
            error: () => this.invalidCredentials = true
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
