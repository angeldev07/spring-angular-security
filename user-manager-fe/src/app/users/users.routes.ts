import { Routes } from "@angular/router";
import {UsersComponent} from "./users.component";
import {ProfileComponent} from "../profile/profile.component";


export const USER_ROUTES: Routes = [
  { path: 'users', component: UsersComponent },
  { path: 'profile', component: ProfileComponent },
  {
    path: '',
    redirectTo: 'users',
    pathMatch: 'full'
  },

];
