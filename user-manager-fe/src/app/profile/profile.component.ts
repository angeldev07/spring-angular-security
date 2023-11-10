import {Component, OnDestroy, OnInit, signal, WritableSignal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UserDTO, UserService} from "../shared/user.service";
import {Subscription, tap} from "rxjs";
import {TagModule} from "primeng/tag";
import {InputTextModule} from "primeng/inputtext";
import {DropdownModule} from "primeng/dropdown";
import {CheckboxModule} from 'primeng/checkbox';
import {FileSelectEvent, FileUpload, FileUploadModule} from 'primeng/fileupload';
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from "@angular/forms";
import {ButtonModule} from "primeng/button";
import {ToastModule} from 'primeng/toast';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {MessageService} from 'primeng/api';
import {environmentDev} from "../environment/environment.dev";
import {HttpResponseDTO} from "../shared/map/HttpResponseDTO";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ToastModule, TagModule, InputTextModule, DropdownModule, CheckboxModule, ButtonModule, FileUploadModule],
  templateUrl: './profile.component.html',
  styles: [],
  providers: [MessageService]
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
    private http: HttpClient,
    private messageService: MessageService
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
    this.user.set({});
  }

  onSubmit() {

    const userData = {
      ...this.userForm.value,
      username: this.userForm.get('username')?.value,
      role: this.userForm.get('role')?.value,
      profileImg: null
    }

    const formData = new FormData();
    formData.append('userData', new Blob([JSON.stringify(userData)], {type: 'application/json'}));
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

  onSelect(event: FileSelectEvent) {
    const reader = new FileReader();
    reader.readAsDataURL(event.currentFiles[0]);
    reader.onload = () => {
      this.user.mutate(user => user.profileImgUrl = reader.result as string)
    };

  }

  onUpload(event: FileSelectEvent, upload: FileUpload) {
    //change the user profile image at the moment of upload to avoid the user to wait for the server response
    this.onSelect(event)

    //created a dataform to send the image and the username to the server
    const formData = new FormData();
    formData.append('profileImg', event.currentFiles[0])
    formData.append("username", `${this.user().username}`)

    //clear the upload component
    upload.clear()

    //send the request to the server
    this.userService.updateProfileImage(formData).pipe(
      tap(res => {

        if (res instanceof HttpErrorResponse)
          return

        const userLocal = JSON.parse(localStorage.getItem('user') ?? '')
        userLocal.user.profileImgUrl = this.user().profileImgUrl
        localStorage.setItem('user', JSON.stringify(userLocal))

      }),
    ).subscribe({
      next: (res: HttpResponseDTO) => {
        this.messageService.add({severity: 'success', summary: 'Profile img updated!', detail: `${res.message}`});
      },
      error: (err: HttpErrorResponse) => this.messageService.add({severity: 'error', summary: 'Profile img not updated!', detail: `${err.error.message}`}),
    })

  }
}
