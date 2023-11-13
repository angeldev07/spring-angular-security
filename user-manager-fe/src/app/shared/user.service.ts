import {Injectable, signal, WritableSignal} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {environmentDev} from "../environment/environment.dev";
import {LoginService} from "../auth/services/login.service";
import {BehaviorSubject, catchError, map, Observable, Subscription, take, tap} from "rxjs";
import {mappedResponse} from './map/UserDTOMapped'
import {mappedHttpResponse} from "./map/HttpResponseDTO";

export interface UserDTO {
  id? : number,
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
  profileImgUrl?: string;
  lastLoginDateDisplay?: Date;
  joinDate?: Date;
  role?: string;
  authorities?: string[];
  active?: boolean;
  notLocked?: boolean;
}


@Injectable({
  providedIn: 'root'
})
export class UserService {

  _user: BehaviorSubject<UserDTO> = new BehaviorSubject<UserDTO>({} as UserDTO)

  constructor(
    private http: HttpClient,
    private auth: LoginService
  ) {

    const userLocal = JSON.parse(localStorage.getItem('user') ?? '')

    if(userLocal.user){
      this._user.next(userLocal.user)
      return
    }

    this.auth.currentUser.subscribe({
      next: res => {
        if(res.username.length === 0) return

        this.getCurrentUserRequest().subscribe({
          next: res => {
            this._user.next(res)
          }
        })

      }
    })

  }

  get currentUser(){
    return this._user.asObservable()
  }

  getCurrentUserValue(value: keyof UserDTO){
    return this._user.value[value]
  }

  public clearUser(){
    this._user.next({} as UserDTO)
  }

  public updateUserInfo() {
    this.getCurrentUserRequest().subscribe({
      next: res => {
        this._user.next(res)
      }
    })
  }

  private getCurrentUserRequest(){
    const headers = new HttpHeaders({'Authorization': `Bearer ${this.auth.token}`})
    const userLocal = JSON.parse(localStorage.getItem('user') ?? '')

    return this.http.get(`${environmentDev.url}/user/${this.auth.username}`, {headers}).pipe(
      map((res: any) => mappedResponse(res)),
      tap(res => {
        userLocal.user = res
        localStorage.setItem('user', JSON.stringify(userLocal))
      })
    )

  }


  public updateProfileImage(formData: FormData) {
    const headers = new HttpHeaders({'Authorization': `Bearer ${this.auth.token}`})
    return this.http.patch(`${environmentDev.url}/user/update-profile-img`, formData, {headers}).pipe(
      map((res: any) => mappedHttpResponse(res)),
      catchError((err: HttpErrorResponse) => {
        return new Observable<HttpErrorResponse>(subscriber => {
          subscriber.next(err)
          subscriber.complete()
        })
      })
    )
  }



}
