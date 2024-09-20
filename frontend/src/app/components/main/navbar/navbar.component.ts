import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { LocalStorageService } from '../../../services/local-storage.service';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {

  private readonly platformId = inject(PLATFORM_ID)
  path: string = '';
  userName: string = '';
  shouldShowRegister: boolean = false;
  shouldShowLogin: boolean = false;

  constructor(private localStorageService: LocalStorageService,
    private router: Router) {

    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.userName = this.localStorageService.get('userName');
        this.isLoggedIn()
      }
    })
  }

  ngOnInit(): void {
  }

  logout() {
    this.localStorageService.logout();
  }

  isLoggedIn(): any {
    if (isPlatformBrowser(this.platformId)) {
      if (!this.localStorageService.isLoggedIn()) {
        this.shouldShowLogin = true;
        this.shouldShowRegister = true;
        return false;
      }
      this.shouldShowLogin = false;
      this.shouldShowRegister = false;
      return true;
    }



  }

}
