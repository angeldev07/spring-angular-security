import {Injectable} from '@angular/core';
import {BehaviorSubject, catchError, map, Observable, tap, throwError} from "rxjs";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {environmentDev} from "../../environment/environment.dev";

interface UserLogin {
  username: string
}

interface LoginResponseDTO {
  message: string,
  username: string,
  token: string
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private _currentUser: BehaviorSubject<UserLogin>
  private token: string;
  private _isLogin: boolean;

  constructor(
    private http: HttpClient
  ) {
    this.token = '';
    this._isLogin = false;
    this._currentUser = new BehaviorSubject<UserLogin>({} as UserLogin);
  }


  get currentUser(): Observable<UserLogin> {
    return this._currentUser.asObservable();
  }


  get isLogin(): boolean {
    return this._isLogin;
  }

  login(username: string, password: string) {

    return this.http.post<LoginResponseDTO>(`${environmentDev.url}/login`, {
      username, password
    }).pipe(
      map((res: any) => {
        return this.mapAnswer(res)
      }),
      tap(({token, username}) => {
        this.saveToken(token)
        this._currentUser.next({username})
        this._isLogin = true;
      }),
      catchError((err: HttpErrorResponse) => {
        this._isLogin = false;
        return throwError(() => new Error(err.error?.message));
      })
    )
  }

  private mapAnswer(res: any): LoginResponseDTO {
    return {
      message: res.Message,
      username: res.Username,
      token: res.token
    }

  }

  private saveToken(token: string) {
    localStorage.setItem("token", token);
  }
}
