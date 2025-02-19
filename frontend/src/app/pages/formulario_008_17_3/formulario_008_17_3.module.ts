import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormularioComponent } from './presentation/pages/formulario/formulario.component';
import { Anexo008_A17_3_Component } from './presentation/pages/anexo008_A17_3/anexo008_A17_3.component';

import { Anexo008_A17_3Service, Formulario008_17_3Service } from './application/usecases';
import { Anexo008_A17_3Repository, Formulario008_17_3Repository } from './application/repositories';
import { Anexo008_A17_3HttpRepository, Formulario008_17_3HttpRepository } from './infrastructure/repositories';
import { UiSwitchModule } from 'ngx-ui-switch';


@NgModule({
  declarations: [
    FormularioComponent,
    Anexo008_A17_3_Component,
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
    Formulario008_17_3Service,
    Anexo008_A17_3Service,
    { provide: Formulario008_17_3Repository, useClass: Formulario008_17_3HttpRepository },
    { provide: Anexo008_A17_3Repository, useClass: Anexo008_A17_3HttpRepository },
  ]
})
export class Formulario_008_17_3Module { }
