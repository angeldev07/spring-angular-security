import {Component, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterLink, RouterLinkActive} from "@angular/router";
import {sidebarItems} from "./sidebarItems.const";
import {SidebarService} from "./sidebar.service";
import {LoginService} from "../../auth/services/login.service";
import {UserService} from "../../shared/user.service";

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styles: [
  ]
})
export class SidebarComponent {

  items = sidebarItems;

  constructor(
    private sidebarService: SidebarService,
    private auth: LoginService,
    private currentUser: UserService
  ) {
  }

  get open (): boolean {
    return this.sidebarService.open
  }

  logoutFn(){
    this.currentUser.clearUser()
    this.auth.logout()
  }

  close(){
    this.sidebarService.openSidebar(false)
  }

}
