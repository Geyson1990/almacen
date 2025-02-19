import { Component, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';

// EXPORTAMOS LA EXTENSIÓN DE DATE
import './shared/extend/date.extensions';
// EXPORTAMOS LA EXTENSIÓN DE STRING
import './shared/extend/string.extension';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'TupaDigitalMTC';
  showHead = true;

  constructor(private router: Router) {
    // on route change to '/login', set the variable showHead to false
    router.events.forEach((event) => {
      if (event instanceof NavigationStart) {
        if (event.url === '/ayuda/ayuda-voucher') {
          this.showHead = false;
        } else if (event.url === '/ayuda/ayuda-incidencia') {
          this.showHead = false;
        } else if (event.url === '/ayuda/ayuda-manual') {
          this.showHead = false;
        } else if (event.url === '/ayuda/ayuda-tupas') {
          this.showHead = false;
        } else if (event.url === '/autenticacion/iniciar-sesion') {
          this.showHead = false;
        } else if (event.url === '/autenticacion/registro') {
          this.showHead = false;
        } else {
          this.showHead = true;
        }
      }
    });
  }

  ngOnInit(): void { }
}


