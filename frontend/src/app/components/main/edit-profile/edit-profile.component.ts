import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { LocalStorageService } from '../../../services/local-storage.service';
import { User } from '../../../domain/User';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from "../spinner/spinner.component";
import { FormErrorComponent } from "../form-error/form-error.component";
import { Subject, delay, takeUntil } from 'rxjs';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { EditUserInputModel } from '../../../domain/EditUserInputModel';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [CommonModule, SpinnerComponent, FormErrorComponent, ReactiveFormsModule],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.css'
})
export class EditProfileComponent implements OnInit, OnDestroy {

  userName: string = ''
  profilePicture: any;
  isLoading: boolean = false;
  isSubmitLoading: boolean = false;
  currentUserName: string = ''
  currentBiography: string = ''
  fileIsBiggerError: boolean = false;
  serverError: boolean = false;
  unsubscribeSignal: Subject<void> = new Subject();
  formData = this.fb.group({
    userName: [this.currentUserName, [Validators.required, Validators.minLength(3)]],
    biography: [this.currentBiography]
  })

  constructor(private userService: UserService,
    private localStorageService: LocalStorageService,
    private fb: FormBuilder,
    private router: Router) { }

  ngOnDestroy(): void {
    this.unsubscribeSignal.next()
    this.unsubscribeSignal.unsubscribe()
  }

  ngOnInit(): void {
    this.userName = this.localStorageService.get('userName')
    this.getProfilePicture()
  }

  async pictureUpload(event: any) {
    this.isLoading = true;
    const picture: File = event.target.files[0];
    const formData = new FormData();

    if (picture.size > 8000000) {
      this.fileIsBiggerError = true
      this.isLoading = false
    } else {
      formData.append("formFile", picture, picture.name);
      this.fileIsBiggerError = false;
      this.userService.uploadProfilePicture(formData)
        .pipe(
          delay(1000),
          takeUntil(this.unsubscribeSignal))
        .subscribe({
          complete: () => {
            this.getProfilePicture()
          }
        })
    }
  }


  getProfilePicture() {
    this.userService.findByUserName(this.userName)
      .pipe(takeUntil(this.unsubscribeSignal))
      .subscribe({
        next: (res: User) => {
          this.profilePicture = res.profilePicture
          this.currentUserName = res.name
          this.currentBiography = res.biography
          this.formData.patchValue({
            userName: this.currentUserName,
            biography: this.currentBiography
          });
        },
        complete: () => {
          this.isLoading = false
          this.fileIsBiggerError = false
        }
      })
  }

  onSubmit() {
    if (this.formData.valid) {
      this.isSubmitLoading = true
      let newUserName = this.formData.get('userName')?.value
      let obj = {
        currentUserName: this.currentUserName,
        newUserName: newUserName || this.currentUserName,
        biography: this.formData.get('biography')?.value || this.currentBiography
      }
      this.userService.editUserDetails(obj as EditUserInputModel)
        .pipe(
          delay(1000),
          takeUntil(this.unsubscribeSignal))
        .subscribe({
          error: () => {
            this.isSubmitLoading = false;
            this.serverError = true;
          },
          complete: () => {
            this.localStorageService.set('userName', newUserName || '')
            this.isSubmitLoading = false
            this.router.navigateByUrl('user/' + newUserName + '/profile')
          }
        })
    }
  }
}
