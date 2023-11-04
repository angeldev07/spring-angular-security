import {Component, OnDestroy, OnInit, signal, WritableSignal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterOutlet} from "@angular/router";
import {SidebarComponent} from "./sidebar/sidebar.component";
import {NavbarComponent} from "./navbar/navbar.component";
import {FooterComponent} from "./footer/footer.component";
import {LoginService} from "../auth/services/login.service";
import {UserDTO, UserService} from "../shared/user.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, NavbarComponent, FooterComponent],
  templateUrl: './dashboard.component.html',
  styles: []
})
export class DashboardComponent implements OnInit, OnDestroy {

  user: WritableSignal<UserDTO >

  subscriptionCurrentUser$!: Subscription

  constructor(
    private userService: UserService,
    private auth: LoginService
  ) {
    this.user = signal({} as UserDTO)
  }

  ngOnInit(): void {
    this.subscriptionCurrentUser$ = this.auth.currentUser.subscribe({
      next: ({username}) => {
        if(! username) return 
        this.userService.getUser(username).subscribe({
          next: value => {
            this.user.update(() => value)
          }
        })
      }
    })

  }

  ngOnDestroy() {
    this.subscriptionCurrentUser$.unsubscribe()
    this.user.set({})
  }

}
