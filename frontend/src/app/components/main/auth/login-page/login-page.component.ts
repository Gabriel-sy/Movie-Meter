import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent {


  formData = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
    password: ['', Validators.required]
  })

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router){}


  changeInputColor(fieldName: string){
    if(this.fieldHasRequiredError(fieldName) || this.fieldHasPatternError(fieldName)){
      return '#EA3323';
    }
    return 'transparent'
  }

  onSubmit(){
    this.formData.markAllAsTouched();
    if(this.formData.valid){
      let values = this.formData.value;
      if(values.email && values.name && values.password){
        this.authService.registerUser(values.name, values.email, values.password)
          .subscribe({
            error: () => {
              
            },
            complete: () => this.router.navigateByUrl('login') 
          })
      }
    }
  }

  fieldHasRequiredError(fieldName: string){
    
    return this.formData.get(fieldName)?.hasError('required') && this.formData.get(fieldName)?.touched;  
  }

  fieldHasPatternError(fieldName: string){
    if(this.formData.get(fieldName)?.hasError('pattern') && !(this.formData.get(fieldName)?.hasError('required')) && this.formData.get(fieldName)?.touched){
      return true;
    }
    return false;
  }

}
