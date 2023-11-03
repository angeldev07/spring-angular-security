import {Injectable} from '@angular/core';
import {BehaviorSubject, catchError, map, Observable, tap, throwError} from "rxjs";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {environmentDev} from "../../environment/environment.dev";
import {Router} from "@angular/router";

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
  private _token: string;
  private _isLogin: boolean;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {

    const currentSession = JSON.parse(localStorage.getItem('user') ?? '{}')
    this._currentUser = new BehaviorSubject<UserLogin>({} as UserLogin);

    if (currentSession['token']) {

      const {token, username} = currentSession
      this._token = token
      this._isLogin = true
      this._currentUser.next({username})
      return

    }

    this._token = '';
    this._isLogin = false;

  }


  get currentUser(): Observable<UserLogin> {
    return this._currentUser.asObservable();
  }

  get token(){
    return this._token
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
        this.saveOnLocal('user', {token, username})
        this._currentUser.next({username})
        this._isLogin = true;
      }),
      catchError((err: HttpErrorResponse) => {
        this._isLogin = false;
        return throwError(() => new Error(err.error?.message));
      })
    )
  }

  public logout() {
    localStorage.clear()
    this._token = ''
    this._isLogin = false;
    this._currentUser.next({username: ''});
    this.router.navigate(['/auth'])
  }

  private mapAnswer(res: any): LoginResponseDTO {
    return {
      message: res.Message,
      username: res.Username,
      token: res.token
    }

  }

  private saveOnLocal(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
  }
}
