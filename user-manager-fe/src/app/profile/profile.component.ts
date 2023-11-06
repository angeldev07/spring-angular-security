import {Component, OnDestroy, OnInit, signal, WritableSignal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UserDTO, UserService} from "../shared/user.service";
import {Subscription} from "rxjs";
import {TagModule} from "primeng/tag";
import {InputTextModule} from "primeng/inputtext";
import {DropdownModule} from "primeng/dropdown";
import { CheckboxModule } from 'primeng/checkbox';
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, TagModule, InputTextModule, DropdownModule, CheckboxModule ],
  templateUrl: './profile.component.html',
  styles: [
  ]
})
export class ProfileComponent implements  OnInit, OnDestroy {

  user: WritableSignal<UserDTO>;
  userSubscription$!: Subscription;

  constructor(
    private userService: UserService
  ) {
    this.user = signal( {} as UserDTO);

  }

  ngOnInit(): void {
    this.userSubscription$ = this.userService.getUser().subscribe({
      next: res => {
        this.user.set(res)
      }
    })
  }

  ngOnDestroy() {
    this.userSubscription$.unsubscribe()
  }

}
