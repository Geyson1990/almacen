import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { FormularioComponent } from './presentation/pages/formulario/formulario.component';
import { Anexo002_a17_2_Component } from './presentation/pages/anexo002_a17_2/anexo002_a17_2.component';
import { Anexo002_b17_2_Component } from './presentation/pages/anexo002_b17_2/anexo002_b17_2.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/shared/shared.module';

import { Anexo002_A17_2Service, Anexo002_B17_2Service, Formulario002_17_2Service } from './application/usecases';
import { Anexo002_A17_2Repository,  Anexo002_B17_2Repository, Formulario002_17_2Repository } from './application/repositories';
import { Anexo002_A17_2HttpRepository, Anexo002_B17_2HttpRepository, Formulario002_17_2HttpRepository } from './infrastructure/repositories';
import { UiSwitchModule } from 'ngx-ui-switch';


@NgModule({
  declarations: [
    FormularioComponent,
    Anexo002_a17_2_Component,
    Anexo002_b17_2_Component
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
    Formulario002_17_2Service,
    Anexo002_A17_2Service,
    Anexo002_B17_2Service,
    { provide: Formulario002_17_2Repository, useClass: Formulario002_17_2HttpRepository },
    { provide: Anexo002_A17_2Repository, useClass: Anexo002_A17_2HttpRepository },
    { provide: Anexo002_B17_2Repository, useClass: Anexo002_B17_2HttpRepository }
  ]
})
export class Formulario_002_17_2_Module { }
