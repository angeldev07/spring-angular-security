import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from "@angular/common/http";
import {LoginService} from "../../auth/services/login.service";
import {environmentDev} from "../../environment/environment.dev";
import {catchError, map, throwError} from "rxjs";
import {mappedResponse} from "../../shared/map/UserDTOMapped";
import {mappedHttpResponse} from "../../shared/map/HttpResponseDTO";

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(
    private http: HttpClient,
    private auth: LoginService
  ) { }

  public addUser(formData: FormData) {
    const headers: HttpHeaders = new HttpHeaders({'Authorization': `Bearer ${this.auth.token}`});
    return this.http.post(`${environmentDev.url}/user/add`, formData , {headers}).pipe(
      map((res: any) => mappedResponse(res))
    )
  }

  public updateUserPersonalInfo(formData: FormData) {
    return this.http.put(`${environmentDev.url}/user/update-profile`, formData).pipe(
      map((res: any) => mappedHttpResponse(res))
    )
  }

  public updateUser(formData: FormData) {
    const headers: HttpHeaders = new HttpHeaders({'Authorization': `Bearer ${this.auth.token}`});
    return this.http.put(`${environmentDev.url}/user/update`, formData, {headers}).pipe(
      map((res: any) => mappedResponse(res))
    )
  }

  public deleteUser(id: number) {
    const params =  new HttpParams().set('userId', id)
    const headers: HttpHeaders = new HttpHeaders({'Authorization': `Bearer ${this.auth.token}`});

    return this.http.delete(`${environmentDev.url}/user/delete`, {params, headers: headers}).pipe(
      map((res: any) => mappedHttpResponse(res))
    )
  }

  public getAllUsers() {
    const headers: HttpHeaders = new HttpHeaders({'Authorization': `Bearer ${this.auth.token}`});
    return this.http.get(`${environmentDev.url}/user`, {headers: headers}).pipe(
      map((res: any) => {
        return res.map((user: any) => mappedResponse(user))
      }),
      catchError((err: HttpErrorResponse) => {
        return throwError(() => new Error(err.error?.message));
      })
    )
  }

}
