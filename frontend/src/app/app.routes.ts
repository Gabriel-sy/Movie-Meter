import { Routes } from '@angular/router';
import { HomeComponent } from './components/main/home.component';
import { MediaPageComponent } from './components/main/media-page/media-page.component';
import { RegisterPageComponent } from './components/main/auth/register-page/register-page.component';
import { LoginPageComponent } from './components/main/auth/login-page/login-page.component';
import { MyListComponent } from './components/main/my-list/my-list.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'media/details/:name', component: MediaPageComponent },
  { path: 'register', component: RegisterPageComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'user/:name/my-list', component: MyListComponent }
];
