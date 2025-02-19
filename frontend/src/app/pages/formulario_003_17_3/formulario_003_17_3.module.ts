import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormularioComponent } from './presentation/pages/formulario/formulario.component';
import { Anexo003_A17_3_Component } from './presentation/pages/anexo003_A17_3/anexo003_A17_3.component';

import { Anexo003_A17_3Service, Formulario003_17_3Service } from './application/usecases';
import { Anexo003_A17_3Repository, Formulario003_17_3Repository } from './application/repositories';
import { Anexo003_A17_3HttpRepository, Formulario003_17_3HttpRepository } from './infrastructure/repositories';
import { UiSwitchModule } from 'ngx-ui-switch';


@NgModule({
  declarations: [
    FormularioComponent,
    Anexo003_A17_3_Component,

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
    Formulario003_17_3Service,
    Anexo003_A17_3Service,
    { provide: Formulario003_17_3Repository, useClass: Formulario003_17_3HttpRepository },
    { provide: Anexo003_A17_3Repository, useClass: Anexo003_A17_3HttpRepository },
  ]
})
export class Formulario_003_17_3Module { }
