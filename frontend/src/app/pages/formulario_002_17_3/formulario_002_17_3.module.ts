import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormularioComponent } from './presentation/pages/formulario/formulario.component';
import { Anexo002_a17_3_Component } from './presentation/pages/anexo002_a17_3/anexo002_a17_3.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { SharedModule } from 'src/app/shared/shared.module';
import { UiSwitchModule } from 'ngx-ui-switch';

import { Anexo002_A17_3Service, Formulario002_17_3Service } from './application/usecases';
import { Anexo002_A17_3Repository, Formulario002_17_3Repository } from './application/repositories';
import { Anexo002_A17_3HttpRepository, Formulario002_17_3HttpRepository } from './infrastructure/repositories';

@NgModule({
  declarations: [
    FormularioComponent,
    Anexo002_a17_3_Component,
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
    Formulario002_17_3Service,
    Anexo002_A17_3Service,
    { provide: Formulario002_17_3Repository, useClass: Formulario002_17_3HttpRepository },
    { provide: Anexo002_A17_3Repository, useClass: Anexo002_A17_3HttpRepository },
 ]
})
export class Formulario_002_17_3_Module { }
