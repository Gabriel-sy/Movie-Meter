import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit{

  path: string = '';
  shouldShowSearchBar: boolean = true;
  shouldShowRegister: boolean = true;
  shouldShowLogin: boolean = true;

  constructor(private route: Router){
    route.events.subscribe(event => {
      switch (route.url){
        case "/register":
          this.shouldShowSearchBar = false;
          this.shouldShowRegister = false;
          this.shouldShowLogin = true;
      }
    })
  }

  ngOnInit(): void {
    
  }
}
