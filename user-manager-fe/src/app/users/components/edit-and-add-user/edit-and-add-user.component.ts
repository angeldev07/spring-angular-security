import {Component, EventEmitter, Input, Output} from '@angular/core';
import {AsyncPipe, CommonModule, JsonPipe} from '@angular/common';
import {UserDTO} from "../../../shared/user.service";
import {DialogModule} from "primeng/dialog";
import {InputTextModule} from "primeng/inputtext";
import {DropdownModule} from "primeng/dropdown";
import {CheckboxModule} from "primeng/checkbox";
import {FileSelectEvent, FileUploadModule} from "primeng/fileupload";
import {FormBuilder, FormControl, ReactiveFormsModule} from "@angular/forms";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {environmentDev} from "../../../environment/environment.dev";
import {UsersService} from "../../services/users.service";

interface Rol {
  role: string;
}

@Component({
  selector: 'edit-and-add-user',
  standalone: true,
  imports: [CommonModule, AsyncPipe, JsonPipe, ReactiveFormsModule, DialogModule, InputTextModule, DropdownModule, CheckboxModule, FileUploadModule, ReactiveFormsModule],
  templateUrl: './edit-and-add-user.component.html',
  styles: []
})
export class EditAndAddUserComponent {
  @Input() user: UserDTO | null = {} as UserDTO;
  @Output() userChange: EventEmitter<UserDTO | null> = new EventEmitter();

  @Input({required: true}) isEdit: boolean = false; //true = edit, false = add
  @Output() isEditChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Input({required: true}) open: boolean = false;
  @Output() openChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output() updateView: EventEmitter<UserDTO | null> = new EventEmitter();

  roles = [
    'ROLE_USER',
    'ROLE_HR',
    'ROLE_ADMIN',
    'ROLE_SUPER_ADMIN'
  ]

  // form reactive
  form = this.fb.group({
    firstName: [''],
    lastName: [''],
    username: [''],
    email: [''],
    active: [true],
    nonLocked: [true],
    role: [this.roles[0]],
    profileImg: new FormControl()
  })

  originalValue: any


  constructor(
    private fb: FormBuilder,
    private usersService: UsersService
  ) {
  }

  ngOnInit(): void {

    if (this.isEdit) {
      this.form.patchValue({
        firstName: this.user?.firstName,
        lastName: this.user?.lastName,
        username: this.user?.username,
        email: this.user?.email,
        active: this.user?.active,
        nonLocked: this.user?.notLocked,
        role: this.user?.role,
      })
      this.originalValue = this.form.value
    }
  }

  resetUserSelected() {
    this.openChange.emit(false)
    this.isEditChange.emit(false)
    this.userChange.emit(null)
  }

  private checkIfFormChanged() {
    return JSON.stringify(this.form.value) !== JSON.stringify(this.originalValue)
  }

  changePhoto($event: FileSelectEvent) {
    this.form.get('profileImg')?.patchValue($event.currentFiles[0])
  }

  submit() {
    // if form is not changed, do nothing and close the dialog
    if (!this.checkIfFormChanged()) {
      this.resetUserSelected()
      return
    }

    // if form is changed, check if form is valid
    if (this.form.invalid) {
      return
    }

    // if form is valid, emit the
    const userData = {
      ...this.form.value,
      profileImg: null
    }
    console.log(userData)
    const formData = new FormData();
    formData.append('userData', new Blob([JSON.stringify(userData)], {type: 'application/json'}));
    formData.append('profileImg', this.form.get('profileImg')?.value);


    if(this.user && this.isEdit){
      this.usersService.updateUser(formData).subscribe({
        next: res => {
          this.updateView.emit(res)
        },
        error: (err: HttpErrorResponse) => {
          this.updateView.emit(null)
          console.log(err.error)
        },
        complete: () => {
          this.resetUserSelected()
        }
      })
      return
    }

    // if is not edit, is adding the new user
    this.usersService.addUser(formData).subscribe({
      next: res => {
        this.updateView.emit(res)
      },
      error: (err: HttpErrorResponse) => {
        this.updateView.emit(null)
        console.log(err.error)
      },
      complete: () => {
        this.openChange.emit(false)
        this.userChange.emit(null)
      }
    })



  }


}
