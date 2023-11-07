import {Component, OnDestroy, OnInit, signal, WritableSignal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UserDTO, UserService} from "../shared/user.service";
import {Subscription} from "rxjs";
import {TagModule} from "primeng/tag";
import {InputTextModule} from "primeng/inputtext";
import {DropdownModule} from "primeng/dropdown";
import {CheckboxModule} from 'primeng/checkbox';
import {FileSelectEvent, FileUpload, FileUploadModule} from 'primeng/fileupload';
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from "@angular/forms";
import {ButtonModule} from "primeng/button";
import {HttpClient} from "@angular/common/http";
import {environmentDev} from "../environment/environment.dev";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TagModule, InputTextModule, DropdownModule, CheckboxModule, ButtonModule, FileUploadModule],
  templateUrl: './profile.component.html',
  styles: []
})
export class ProfileComponent implements OnInit, OnDestroy {

  user!: WritableSignal<UserDTO>;
  userSubscription$!: Subscription;
  userForm = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(5)]],
    lastName: ['', [Validators.required, Validators.minLength(5)]],
    email: ['', [Validators.required, Validators.email]],
    profileImg: new FormControl(),
    username: [{value: '', disabled: true}],
    role: [{value: '', disabled: true}],
    active: [false],
    nonLocked: [false]
  })

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.user = signal({} as UserDTO);

  }

  ngOnInit(): void {
    this.userSubscription$ = this.userService.getUser().subscribe({
      next: res => {
        this.user.set({...res})
        this.userForm.patchValue({
          active: this.user().active,
          email: this.user().email,
          firstName: this.user()?.firstName,
          lastName: this.user().lastName,
          nonLocked: this.user().notLocked,
          role: this.user().role,
          username: this.user().username,
        })
      }
    })

  }

  ngOnDestroy() {
    this.userSubscription$.unsubscribe()
  }

  onSubmit() {

    const userData = {
      ...this.userForm.value,
      username: this.userForm.get('username')?.value,
      role: this.userForm.get('role')?.value,
      profileImg: null
    }

    const formData = new FormData();
    formData.append('userData', new Blob([JSON.stringify(userData)], { type: 'application/json' }));
    formData.append('profileImg', this.userForm.get('profileImg')?.value)

    this.http.put(`${environmentDev.url}/user/update`, formData).subscribe({
      next: res => {
        console.log(res)
      },
      error: err => console.log(err),
      complete: () => {
        this.userForm.get('username')?.disable();
        this.userForm.get('role')?.disable();
      }
    })
  }

  onSelect(event: FileSelectEvent, upload: FileUpload) {
    const reader = new FileReader();
    reader.readAsDataURL(event.currentFiles[0]);
    this.userForm.controls.profileImg.setValue(event.currentFiles[0])
    reader.onload = () => {
      this.user.mutate(user => user.profileImgUrl = reader.result as string)
    };
    upload._files = []
  }
}
