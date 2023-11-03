import { Routes } from "@angular/router";
import {UsersComponent} from "./users.component";


export const USER_ROUTES: Routes = [
  { path: 'users', component: UsersComponent },
  {
    path: '',
    redirectTo: 'users',
    pathMatch: 'full'
  },

];
