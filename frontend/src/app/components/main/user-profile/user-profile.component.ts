import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { User } from '../../../domain/User';
import { UserService } from '../../../services/user.service';
import { LocalStorageService } from '../../../services/local-storage.service';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { FavTitleDialogComponent } from '../dialogs/fav-title-dialog/fav-title-dialog.component';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit {
  user: User = new User()
  userName: string = ''
  shouldShowEditButton: boolean = false
  changeAddSvgOpacity: boolean = false;
  readonly dialog = inject(MatDialog);

  constructor(private userService: UserService,
    private route: ActivatedRoute,
    private localStorageService: LocalStorageService){}

  ngOnInit(): void {
    this.userName = this.route.snapshot.url[1].path

    this.shouldShowEditButton = this.userName == this.localStorageService.get('userName')

    this.userService.findByUserName(this.userName).subscribe({
      next: (res: User) => {
        this.user = res;
      }
    })
  }

  openFavTitleDialog(){
    const dialog = this.dialog.open(FavTitleDialogComponent, {
      data: this.localStorageService.get('userName')
    })
  }
}
