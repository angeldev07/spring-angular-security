import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  private  _open: boolean

  constructor() {
    this._open = false
  }

  get open (){
    return this._open
  }

  openSidebar(value: boolean) {
    this._open = value
  }


}
