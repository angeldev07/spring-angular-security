import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {LoginService} from "../services/login.service";

export const authGuard: CanActivateFn = (route, state) => {
  const isLogin = inject(LoginService).isLogin

  if (!isLogin) {
    inject(Router).navigateByUrl('/auth')
  }

  return isLogin;
};

export const loginGuard: CanActivateFn = (route, state) => {
  const isLogin = inject(LoginService).isLogin

  if (isLogin) {
    inject(Router).navigateByUrl('/backlog')
  }

  return !isLogin;
};

