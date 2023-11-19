import {Component, OnDestroy, OnInit, signal, WritableSignal} from '@angular/core';
import {CommonModule, DatePipe, JsonPipe} from '@angular/common';
import {Table, TableModule} from 'primeng/table';
import {UserDTO, UserService} from "../shared/user.service";
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
import {DialogModule} from "primeng/dialog";
import {EditAndAddUserComponent} from "./components/edit-and-add-user/edit-and-add-user.component";


@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, TableModule, JsonPipe, DatePipe, UserModalComponent, EditAndAddUserComponent, ButtonModule, ToastModule, AvatarModule, SelectButtonModule, TagModule, InputTextModule, DialogModule],
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
  deleteUserFlag = false
  editUserFlag: boolean = false;
  isEditOrAddUser: boolean = false; // true = edit, false = add

  constructor(
    private userService: UsersService,
    private messageService: MessageService,
    private currentUser: UserService,
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

    if (user.id === this.currentUser.getCurrentUserValue('id')) {
      this.messageService.add({severity: 'error', summary: 'Error', detail: `You can't delete yourself!`});
      this.userSelected = null
      this.deleteUserFlag = false
      return
    }


    this.userService.deleteUser(user["id"]!).subscribe({
      next: res => {
        this.messageService.add({severity: 'success', summary: 'Success', detail: `User ${user.username} deleted!`});
        this.usersList.update(value => value.filter(u => u.id !== user.id))
      },
      error: (err) => {
        this.messageService.add({severity: 'error', summary: 'Error', detail: `${err.error?.message}`});
      }
    })

    this.userSelected = null
    this.deleteUserFlag = false

  }

  openEditUser(user: UserDTO) {
    this.userSelected = user
    this.editUserFlag = true
    this.isEditOrAddUser = true
  }

  openAddUser() {
    this.editUserFlag = true
    this.isEditOrAddUser = false
  }

  updateList(event: UserDTO | null) {

    if (event) {

      if (this.isEditOrAddUser)
        this.usersList.update(value => value.map(u => u.id === event.id ? event : u))
      else
        this.usersList.update(value => [...value, event])

      this.messageService.add({severity: 'success', summary: 'Success', detail: `User info updated successfully!`});
      return
    }

    this.messageService.add({severity: 'error', summary: 'Error', detail: `Something went wrong!`});

  }

  hasRole() {
    return this.currentUser.currentUserValue.authorities?.includes('user:create')
  }
}
