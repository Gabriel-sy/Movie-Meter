import { Routes } from '@angular/router';
import { HomeComponent } from './components/main/home.component';
import { MediaPageComponent } from './components/main/media-page/media-page.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'media/details/:name', component: MediaPageComponent }
];
