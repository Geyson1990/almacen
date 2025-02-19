import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormularioComponent } from './presentation/pages/formulario/formulario.component';
import { Anexo005_A17_3_Component } from './presentation/pages/anexo005_A17_3/anexo005_A17_3.component';
import { Anexo005_B17_3_Component } from './presentation/pages/anexo005_B17_3/anexo005_B17_3.component';

import { Anexo005_A17_3Service, Anexo005_B17_3Service, Formulario005_17_3Service } from './application/usecases';
import { Anexo005_A17_3Repository, Anexo005_B17_3Repository, Formulario005_17_3Repository } from './application/repositories';
import { Anexo005_A17_3HttpRepository, Anexo005_B17_3HttpRepository, Formulario005_17_3HttpRepository } from './infrastructure/repositories';
import { UiSwitchModule } from 'ngx-ui-switch';


@NgModule({
  declarations: [
    FormularioComponent,
    Anexo005_A17_3_Component,
    Anexo005_B17_3_Component,
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
    Formulario005_17_3Service,
    Anexo005_A17_3Service,
    Anexo005_B17_3Service,
    { provide: Formulario005_17_3Repository, useClass: Formulario005_17_3HttpRepository },
    { provide: Anexo005_A17_3Repository, useClass: Anexo005_A17_3HttpRepository },
    { provide: Anexo005_B17_3Repository, useClass: Anexo005_B17_3HttpRepository },
  ]
})
export class Formulario_005_17_3Module { }
