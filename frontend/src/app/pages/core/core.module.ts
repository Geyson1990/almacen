import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoreRoutingModule } from './core-routing.module';
import { CoreComponent } from './core.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SharedModule } from 'src/app/shared/shared.module';
import { SeguridadComponent } from './components/seguridad/seguridad.component';
import { RouterModule } from '@angular/router';
import { CambiarPassComponent } from './components/cambiar-pass/cambiar-pass.component';
import { MiCuentaComponent } from './components/mi-cuenta/mi-cuenta.component';
import { QuillModule } from 'ngx-quill';


@NgModule({
  declarations: [
    CoreComponent,
    SeguridadComponent,
    CambiarPassComponent,
    MiCuentaComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    CoreRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    NgxSpinnerModule,
    NgbModule,
    SharedModule,
    QuillModule
  ]
})
export class CoreModule { }
