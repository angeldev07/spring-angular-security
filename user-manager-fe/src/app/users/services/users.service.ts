import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {LoginService} from "../../auth/services/login.service";
import {environmentDev} from "../../environment/environment.dev";
import {BehaviorSubject, catchError, map, Observable, throwError} from "rxjs";
import {mappedResponse} from "../../shared/map/UserDTOMapped";
import {UserDTO} from "../../shared/user.service";

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private httpHeaders: HttpHeaders;
  private _users: BehaviorSubject< Array<UserDTO> >

  constructor(
    private http: HttpClient,
    private auth: LoginService
  ) {

    this.httpHeaders = new HttpHeaders({'Authorization': this.auth.token})

    const users = JSON.parse( localStorage.getItem('users') ?? '{}'  )

    this._users = new BehaviorSubject<Array<UserDTO> >([])

    if(users.length > 0){
      this._users.next(users)
      console.log('aca')
    }
    else
      this.initialize()

  }


  get users(): Observable<Array<UserDTO>> {
    return this._users.asObservable();
  }

  private getAllUsers() {
    return this.http.get(`${environmentDev.url}/user`, {headers: this.httpHeaders}).pipe(
      map((res: any) => {
        return res.map((user: any) => mappedResponse(user))
      }),
      catchError((err: HttpErrorResponse) => {
        return throwError(() => new Error(err.error?.message));
      })
    )
  }

  private initialize() {
    this.getAllUsers().subscribe({
      next: res => {
        this._users.next(res)
        localStorage.setItem('users', JSON.stringify(res))
      }
    })
  }
}
