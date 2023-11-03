import {Component} from '@angular/core';
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

  constructor(
    private sidebarService: SidebarService
  ) {}

  open() {
    this.sidebarService.openSidebar(true)
  }

}
