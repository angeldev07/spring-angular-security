import {Component, OnDestroy, OnInit, signal, WritableSignal} from '@angular/core';
import {CommonModule, DatePipe, JsonPipe} from '@angular/common';
import {Table, TableModule} from 'primeng/table';
import {UserDTO} from "../shared/user.service";
import {UsersService} from "./services/users.service";
import {ButtonModule} from "primeng/button";
import {Subscription} from "rxjs";
import {AvatarModule} from "primeng/avatar";
import {SelectButtonModule} from "primeng/selectbutton";
import {TagModule} from "primeng/tag";
import {UserModalComponent} from "./components/user-modal/user-modal.component";
import {InputTextModule} from "primeng/inputtext";

const OPTIONS = {DELETE: 'DELETE', UPDATE: 'UPDATE'}

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, TableModule, JsonPipe, DatePipe, UserModalComponent, ButtonModule, AvatarModule, SelectButtonModule, TagModule, InputTextModule],
  templateUrl: './users.component.html',
  styles: []
})
export class UsersComponent implements OnInit, OnDestroy {

  usersList: WritableSignal<Array<UserDTO>>;
  userSus$!: Subscription
  options: any[]
  userSelected: UserDTO | null = null
  isUserSelected = false
  cols = [
    { label: 'Photo', prop: 'profileImgUrl'},
    { label: 'First name', prop: 'firstName'},
    { label: 'Last name', prop: 'lastName'},
    { label: 'Username', prop: 'username'},
    { label: 'Email', prop: 'email'},
    { label: 'Status', prop: 'active'},
    { label: 'Actions'}
  ]

  //Photo	First name	Last name	Username	email	Status	actions

  constructor(
    private userService: UsersService
  ) {
    this.usersList = signal([])
    this.options = [{label: 'pi pi-pencil', value: OPTIONS.UPDATE}, {label: 'pi pi-trash', value: OPTIONS.DELETE}]
  }

  ngOnInit(): void {
    this.userSus$ = this.userService.users.subscribe({
      next: res => {
        this.usersList.set(res)
      }
    })
  }

  ngOnDestroy() {
    this.userSus$.unsubscribe()
  }

  filterUser(event: any, table: Table) {
    table.filterGlobal(event.target.value, 'contains')
  }

}
