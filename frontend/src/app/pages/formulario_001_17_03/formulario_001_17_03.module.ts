import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormularioComponent } from './presentation/pages/formulario/formulario.component';
import { Anexo001_A17_03_Component } from './presentation/pages/anexo001_A17_03/anexo001_A17_03.component';

import { Anexo001_A17_03Service, Formulario001_17_03Service } from './application/usecases';
import { Anexo001_A17_03Repository, Formulario001_17_03Repository } from './application/repositories';
import { Anexo001_A17_03HttpRepository, Formulario001_17_03HttpRepository } from './infrastructure/repositories';
import { UiSwitchModule } from 'ngx-ui-switch';



@NgModule({
  declarations: [
    FormularioComponent,
    Anexo001_A17_03_Component,
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
    Formulario001_17_03Service,
    Anexo001_A17_03Service,
    { provide: Formulario001_17_03Repository, useClass: Formulario001_17_03HttpRepository },
    { provide: Anexo001_A17_03Repository, useClass: Anexo001_A17_03HttpRepository },
  ]
})
export class Formulario_001_17_03_Module { }
