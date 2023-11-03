import {Component, signal, Signal, WritableSignal} from '@angular/core';
import { CommonModule } from '@angular/common';

interface SocialNetwork {
  link: string,
  description:string,
  icon: string
}


@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styles: [
  ]
})
export class FooterComponent {

  socialNetwork: WritableSignal<Array<SocialNetwork>>

  constructor() {
    this.socialNetwork = signal([
      {
        link: 'https://www.github.com/angeldev07',
        icon: 'pi pi-github',
        description: '@angeldev07'
      },
      {
        link: 'https://www.linkedin.com/in/angel-garcia-a783b8254/',
        icon: 'pi pi-linkedin',
        description: '@angel-garcia'
      }
    ])
  }
}
