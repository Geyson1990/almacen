/// <reference types="@angular/localize" />

import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();

  if (window) {
    // window.console.log = () => { };
    // window.console.warn = () => { };
    // window.console.error = () => { };
    // window.console.time = () => { };
    // window.console.timeEnd = () => { };
  }
}

platformBrowserDynamic().bootstrapModule(AppModule, {
  ngZoneEventCoalescing: true
})
  .catch(err => console.error(err));
