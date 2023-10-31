import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AuthComponent} from "./auth/auth.component";
import {UsersComponent} from "./users/users.component";

const routes: Routes = [
  {
    path: 'auth',
    component: AuthComponent
  },
  {
    path: 'users',
    component: UsersComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
