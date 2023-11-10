import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {LoginService} from "../../auth/services/login.service";
import {environmentDev} from "../../environment/environment.dev";
import {BehaviorSubject, catchError, map, Observable, tap, throwError} from "rxjs";
import {mappedResponse} from "../../shared/map/UserDTOMapped";
import {UserDTO} from "../../shared/user.service";

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private httpHeaders: HttpHeaders;

  constructor(
    private http: HttpClient,
    private auth: LoginService
  ) {

    this.httpHeaders = new HttpHeaders({'Authorization': this.auth.token})

  }

  public getAllUsers() {
    return this.http.get(`${environmentDev.url}/user`, {headers: this.httpHeaders}).pipe(
      map((res: any) => {
        return res.map((user: any) => mappedResponse(user))
      }),
      catchError((err: HttpErrorResponse) => {
        return throwError(() => new Error(err.error?.message));
      })
    )
  }

}
