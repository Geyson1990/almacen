import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormularioComponent } from './presentation/pages/formulario/formulario.component';
import { Anexo004_A17_3_Component } from './presentation/pages/anexo004_A17_3/anexo004_A17_3.component';

import { Anexo004_A17_3Service, Formulario004_17_3Service } from './application/usecases';
import { Anexo004_A17_3Repository, Formulario004_17_3Repository } from './application/repositories';
import { Anexo004_A17_3HttpRepository, Formulario004_17_3HttpRepository } from './infrastructure/repositories';
import { UiSwitchModule } from 'ngx-ui-switch';


@NgModule({
  declarations: [
    FormularioComponent,
    Anexo004_A17_3_Component,

  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    UiSwitchModule,
    
    SharedModule
  ],
  providers: [
    Formulario004_17_3Service,
    Anexo004_A17_3Service,
    { provide: Formulario004_17_3Repository, useClass: Formulario004_17_3HttpRepository },
    { provide: Anexo004_A17_3Repository, useClass: Anexo004_A17_3HttpRepository },
  ]
})
export class Formulario_004_17_3Module { }
