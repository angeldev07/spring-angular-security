import {Component, OnDestroy, OnInit, signal, WritableSignal} from '@angular/core';
import {CommonModule, DatePipe, JsonPipe} from '@angular/common';
import {Table, TableModule} from 'primeng/table';
import {UserDTO} from "../shared/user.service";
import {UsersService} from "./services/users.service";
import {ButtonModule} from "primeng/button";
import {Subscription, tap} from "rxjs";
import {AvatarModule} from "primeng/avatar";
import {SelectButtonModule} from "primeng/selectbutton";
import {TagModule} from "primeng/tag";
import {UserModalComponent} from "./components/user-modal/user-modal.component";
import {InputTextModule} from "primeng/inputtext";
import {MessageService} from "primeng/api";
import {ToastModule} from "primeng/toast";


@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, TableModule, JsonPipe, DatePipe, UserModalComponent, ButtonModule, ToastModule, AvatarModule, SelectButtonModule, TagModule, InputTextModule],
  templateUrl: './users.component.html',
  styles: [],
  providers: [MessageService]
})
export class UsersComponent implements OnInit, OnDestroy {

  usersList = signal<Array<UserDTO>>([]);
  userSus$!: Subscription
  userSelected: UserDTO | null = null
  isUserSelected = false
  cols = [
    {label: 'Photo', prop: 'profileImgUrl'},
    {label: 'First name', prop: 'firstName'},
    {label: 'Last name', prop: 'lastName'},
    {label: 'Username', prop: 'username'},
    {label: 'Email', prop: 'email'},
    {label: 'Status', prop: 'active'},
    {label: 'Actions'}
  ]


  //Photo	First name	Last name	Username	email	Status	actions

  constructor(
    private userService: UsersService,
    private messageService: MessageService
  ) {
  }

  ngOnInit(): void {

    this.userSus$ = this.userService.getAllUsers().subscribe({
      next: res => {
        this.usersList.set(res)
      }
    })

  }

  ngOnDestroy() {
    this.userSus$.unsubscribe()
    this.usersList.set([])
  }


  filterUser(event: any, table: Table) {
    table.filterGlobal(event.target.value, 'contains')
  }

  deleteUser(user: UserDTO) {
    this.userService.deleteUser(user["id"]!).subscribe({
      next: res => {
        this.messageService.add({severity: 'success', summary: 'Success', detail: `User ${user.username} deleted!`});
      },
      error: (err) => {
        this.messageService.add({severity: 'error', summary: 'Error', detail: `${err.error?.message}`});
      }
    })

  }
}
