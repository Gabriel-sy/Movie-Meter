import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {NavigationEnd, Router, RouterLink } from '@angular/router';
import { LocalStorageService } from '../../../services/local-storage.service';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {

  path: string = '';
  userName: string = '';
  shouldShowSearchBar: boolean = true;
  shouldShowRegister: boolean = true;
  shouldShowLogin: boolean = true;
  shouldShowLogout: boolean = false;

  constructor(private localStorageService: LocalStorageService,
    private router: Router) {

    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.userName = this.localStorageService.get('userName');
        switch (router.url) {
          case "/register":
            this.shouldShowSearchBar = false;
            this.shouldShowRegister = false;
            this.shouldShowLogin = true;
            break;
          case "/login":
            this.shouldShowLogout = false;
            this.shouldShowRegister = true;
            this.shouldShowSearchBar = false;
            this.shouldShowLogin = false;
            break;
          case "/":
            this.shouldShowSearchBar = true;
            this.shouldShowRegister = false;
            this.shouldShowLogin = false;
            this.shouldShowLogout = true;
        }
      }
    })
  }

  ngOnInit(): void {
    if (this.localStorageService.isLoggedIn()) {
      this.shouldShowSearchBar = true;
      this.shouldShowRegister = false;
      this.shouldShowLogin = false;
      this.shouldShowLogout = true;
    }


  }

  logout() {
    this.localStorageService.logout();
  }

}
