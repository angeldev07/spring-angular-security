import {Component, OnDestroy, OnInit, signal, WritableSignal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TableModule} from 'primeng/table';
import {UserDTO} from "../shared/user.service";
import {UsersService} from "./services/users.service";
import {ButtonModule} from "primeng/button";
import {Subscription} from "rxjs";
import {AvatarModule} from "primeng/avatar";
import {SelectButtonModule} from "primeng/selectbutton";
import {TagModule} from "primeng/tag";

const OPTIONS = {DELETE: 'DELETE', UPDATE: 'UPDATE'}

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, AvatarModule, SelectButtonModule, TagModule],
  templateUrl: './users.component.html',
  styles: []
})
export class UsersComponent implements OnInit, OnDestroy {

  usersList: WritableSignal<Array<UserDTO>>;
  userSus$!: Subscription

  options: any[]

  constructor(
    private userService: UsersService
  ) {
    this.usersList = signal([])
    this.options = [{label: 'pi pi-pencil', value: OPTIONS.UPDATE}, {label: 'pi pi-trash', value: OPTIONS.DELETE}]
  }

  ngOnInit(): void {
    this.userSus$ = this.userService.users.subscribe({
      next: res => this.usersList.set(res)
    })
  }

  ngOnDestroy() {
    this.userSus$.unsubscribe()
  }

  show() {
    console.log(this.usersList())
  }

  getTableHeader() {
    return Object.keys(this.usersList()[0])
  }
}
