import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormularioComponent } from './presentation/pages/formulario/formulario.component';
import { Anexo003_A27_Component } from './presentation/pages/anexo003_A27/anexo003_A27.component';

import { Anexo003_A27Service, Formulario003_27Service } from './application/usecases';
import { Anexo003_A27Repository, Formulario003_27Repository } from './application/repositories';
import { Anexo003_A27HttpRepository, Formulario003_27HttpRepository } from './infrastructure/repositories';
import { UiSwitchModule } from 'ngx-ui-switch';


@NgModule({
  declarations: [
    FormularioComponent,
    Anexo003_A27_Component,

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
    Formulario003_27Service,
    Anexo003_A27Service,
    { provide: Formulario003_27Repository, useClass: Formulario003_27HttpRepository },
    { provide: Anexo003_A27Repository, useClass: Anexo003_A27HttpRepository },
  ]
})
export class Formulario_003_27_Module { }
