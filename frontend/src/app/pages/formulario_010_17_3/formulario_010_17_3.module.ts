import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormularioComponent } from './presentation/pages/formulario/formulario.component';
import { Anexo010_A17_3_Component } from './presentation/pages/anexo010_A17_3/anexo010_A17_3.component';

import { Anexo010_A17_3Service, Formulario010_17_3Service } from './application/usecases';
import { Anexo010_A17_3Repository, Formulario010_17_3Repository } from './application/repositories';
import { Anexo010_A17_3HttpRepository, Formulario010_17_3HttpRepository } from './infrastructure/repositories';
import { UiSwitchModule } from 'ngx-ui-switch';


@NgModule({
  declarations: [
    FormularioComponent,
    Anexo010_A17_3_Component,
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
    Formulario010_17_3Service,
    Anexo010_A17_3Service,
    { provide: Formulario010_17_3Repository, useClass: Formulario010_17_3HttpRepository },
    { provide: Anexo010_A17_3Repository, useClass: Anexo010_A17_3HttpRepository },
  ]
})
export class Formulario_010_17_3Module { }
