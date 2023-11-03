import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SidebarService} from "../sidebar/sidebar.service";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styles: []
})
export class NavbarComponent {

  @Input() rol: string | undefined
  @Input() username: string | undefined

  constructor(
    private sidebarService: SidebarService
  ) {
    this.rol = '';
    this.username = ''
  }

  open() {
    this.sidebarService.openSidebar(true)
  }

}
