import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LoginService} from "./services/login.service";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router, RouterModule} from "@angular/router";

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './auth.component.html',
  styles: []
})
export class AuthComponent {

  loginForm: FormGroup;

  constructor(
    private authService: LoginService,
    private fb: FormBuilder,
    private router: Router
  ) {

    this.loginForm = this.fb.group({
      username: ['07409', [Validators.required]],
      password: ['angel123', [Validators.required]]
    })
  }

  onSubmit(event: SubmitEvent) {
    const username = this.loginForm.controls['username'].value
    const password = this.loginForm.controls['password'].value
    //suscribe the login method
    this.authService.login(username, password).subscribe({
      next: ok => this.router.navigateByUrl('backlog/users'),
      error: error => console.log("jaja")
    });
  }

}
