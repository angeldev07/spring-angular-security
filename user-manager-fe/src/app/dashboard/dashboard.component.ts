import {Component, OnDestroy, OnInit, signal, WritableSignal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterOutlet} from "@angular/router";
import {SidebarComponent} from "./sidebar/sidebar.component";
import {NavbarComponent} from "./navbar/navbar.component";
import {FooterComponent} from "./footer/footer.component";
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

  user: WritableSignal<UserDTO>
  subscriptionCurrentUser$!: Subscription

  constructor(
    private userService: UserService,
  ) {
    this.user = signal({} as UserDTO)
  }

  ngOnInit(): void {

    this.subscriptionCurrentUser$ = this.userService.currentUser.subscribe({
      next: value => {
        this.user.update(() => value)
      }
    })

  }


  ngOnDestroy() {
    this.subscriptionCurrentUser$.unsubscribe()
    this.user.set({})
  }

}
