import {Component, OnInit} from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements  OnInit{
  title = 'application is running'
  constructor(
    private primeNG: PrimeNGConfig
  ) {}

  ngOnInit(): void {
    // activacion efecto ripple en todos los componentes
    this.primeNG.ripple = true
  }
}
