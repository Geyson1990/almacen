import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormularioComponent } from './presentation/pages/formulario/formulario.component';
import { Anexo012_A17_3_Component } from './presentation/pages/anexo012_A17_3/anexo012_A17_3.component';

import { Anexo012_A17_3Service, Formulario012_17_3Service } from './application/usecases';
import { Anexo012_A17_3Repository, Formulario012_17_3Repository } from './application/repositories';
import { Anexo012_A17_3HttpRepository, Formulario012_17_3HttpRepository } from './infrastructure/repositories';
import { UiSwitchModule } from 'ngx-ui-switch';


@NgModule({
  declarations: [
    FormularioComponent,
    Anexo012_A17_3_Component,
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
    Formulario012_17_3Service,
    Anexo012_A17_3Service,
    { provide: Formulario012_17_3Repository, useClass: Formulario012_17_3HttpRepository },
    { provide: Anexo012_A17_3Repository, useClass: Anexo012_A17_3HttpRepository }
  ]
})
export class Formulario_012_17_3Module { }
