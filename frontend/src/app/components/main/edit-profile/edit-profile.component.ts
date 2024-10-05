import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { LocalStorageService } from '../../../services/local-storage.service';
import { User } from '../../../domain/User';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.css'
})
export class EditProfileComponent implements OnInit {

  userName: string = ''
  profilePicture: any;

  constructor(private userService: UserService,
    private localStorageService: LocalStorageService){}

  ngOnInit(): void {
    this.userName = this.localStorageService.get('userName')
    this.userService.findByUserName(this.userName).subscribe({
      next: (res: User) => {
        this.profilePicture = res.profilePicture
      } 
    })
  }

  async pictureUpload(event: any){
    const picture: File = event.target.files[0];
    const formData = new FormData();

    formData.append("formFile", picture, picture.name);

    this.userService.uploadProfilePicture(formData).subscribe()
  }
}
