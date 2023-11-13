import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from "@angular/common/http";
import {LoginService} from "../../auth/services/login.service";
import {environmentDev} from "../../environment/environment.dev";
import {BehaviorSubject, catchError, map, Observable, tap, throwError} from "rxjs";
import {mappedResponse} from "../../shared/map/UserDTOMapped";
import {UserDTO} from "../../shared/user.service";
import {mappedHttpResponse} from "../../shared/map/HttpResponseDTO";

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private httpHeaders: HttpHeaders = new HttpHeaders({'Authorization': this.auth.token});

  constructor(
    private http: HttpClient,
    private auth: LoginService
  ) { }

  public updateUser(formData: FormData) {
    return this.http.put(`${environmentDev.url}/user/update`, formData).pipe(
      map((res: any) => mappedHttpResponse(res))
    )
  }

  public deleteUser(id: number) {
    const params =  new HttpParams().set('userId', id)
    return this.http.delete(`${environmentDev.url}/user/delete`, {params, headers: this.httpHeaders}).pipe(
      map((res: any) => mappedHttpResponse(res))
    )
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
