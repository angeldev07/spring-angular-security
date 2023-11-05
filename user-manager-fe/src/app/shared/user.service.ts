import {Injectable, signal, WritableSignal} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environmentDev} from "../environment/environment.dev";
import {LoginService} from "../auth/services/login.service";
import {map, tap} from "rxjs";
import { mappedResponse } from './map/UserDTOMapped'
export interface UserDTO {
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

  mappedResponse = mappedResponse;

  constructor(
    private http: HttpClient,
    private auth: LoginService
  ) {
  }

  public getUser(username: string) {
    const headers = new HttpHeaders({'Authorization': this.auth.token})
    return this.http.get(`${environmentDev.url}/user/${username}`, {headers}).pipe(
      map((res: any) => this.mappedResponse(res))
    )
  }


}
