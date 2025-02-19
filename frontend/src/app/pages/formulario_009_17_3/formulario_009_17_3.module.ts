import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormularioComponent } from './presentation/pages/formulario/formulario.component';
import { Anexo009_A17_3_Component } from './presentation/pages/anexo009_A17_3/anexo009_A17_3.component';
import { Anexo009_B17_3_Component } from './presentation/pages/anexo009_B17_3/anexo009_B17_3.component';

import { Anexo009_A17_3Service, Anexo009_B17_3Service, Formulario009_17_3Service } from './application/usecases';
import { Anexo009_A17_3Repository, Anexo009_B17_3Repository, Formulario009_17_3Repository } from './application/repositories';
import { Anexo009_A17_3HttpRepository, Anexo009_B17_3HttpRepository, Formulario009_17_3HttpRepository } from './infrastructure/repositories';
import { UiSwitchModule } from 'ngx-ui-switch';


@NgModule({
  declarations: [
    FormularioComponent,
    Anexo009_A17_3_Component,
    Anexo009_B17_3_Component,
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
    Formulario009_17_3Service,
    Anexo009_A17_3Service,
    Anexo009_B17_3Service,
    { provide: Formulario009_17_3Repository, useClass: Formulario009_17_3HttpRepository },
    { provide: Anexo009_A17_3Repository, useClass: Anexo009_A17_3HttpRepository },
    { provide: Anexo009_B17_3Repository, useClass: Anexo009_B17_3HttpRepository },
  ]
})
export class Formulario_009_17_3Module { }
