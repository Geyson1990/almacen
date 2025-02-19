import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//NG BOOTSTRAP
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { FormularioComponent } from './presentation/pages/formulario/formulario.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { Formulario00212HttpRepository } from './infrastructure/formulario002-12-http.repository';
import { Formulario00212Repository, Formulario00212Service } from './application';
import { UiSwitchModule } from 'ngx-ui-switch';

@NgModule({
  declarations: [FormularioComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    UiSwitchModule,
    
    SharedModule
  ],
  providers: [
    Formulario00212Service,
    { provide: Formulario00212Repository, useClass: Formulario00212HttpRepository },
  ]
})
export class Formulario_002_12_Module { }
