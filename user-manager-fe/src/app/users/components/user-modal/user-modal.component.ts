import {Component, Input, Output, EventEmitter} from '@angular/core';
import { CommonModule } from '@angular/common';
import {ButtonModule} from "primeng/button";
import {DialogModule} from "primeng/dialog";
import {TagModule} from "primeng/tag";
import {UserDTO} from "../../../shared/user.service";

@Component({
  selector: 'app-user-modal',
  standalone: true,
    imports: [CommonModule, ButtonModule, DialogModule, TagModule],
  templateUrl: './user-modal.component.html',
  styles: [
  ]
})
export class UserModalComponent {

  @Input({required: true}) userSelected: UserDTO | null = null
  @Output() userSelectedChange: EventEmitter<UserDTO | null> = new EventEmitter<UserDTO | null>()

  @Input({required: true}) isUserSelected = false
  @Output() isUserSelectedChange: EventEmitter<boolean> = new EventEmitter<boolean>()
  resetUserSelected() {
    this.isUserSelectedChange.emit(false)
    this.userSelectedChange.emit(null)
  }
}
