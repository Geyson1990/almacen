import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormularioComponent } from './presentation/pages/formulario/formulario.component';
import { Anexo007_A17_3_Component } from './presentation/pages/anexo007_A17_3/anexo007_A17_3.component';
import { Anexo007_B17_3_Component } from './presentation/pages/anexo007_B17_3/anexo007_B17_3.component';
import { Anexo007_C17_3_Component } from './presentation/pages/anexo007_C17_3/anexo007_C17_3.component';

import { Anexo007_A17_3Service, Anexo007_B17_3Service, Anexo007_C17_3Service, Formulario007_17_3Service } from './application/usecases';
import { Anexo007_A17_3Repository, Anexo007_B17_3Repository, Anexo007_C17_3Repository, Formulario007_17_3Repository } from './application/repositories';
import { Anexo007_A17_3HttpRepository, Anexo007_B17_3HttpRepository, Anexo007_C17_3HttpRepository, Formulario007_17_3HttpRepository } from './infrastructure/repositories';
import { UiSwitchModule } from 'ngx-ui-switch';


@NgModule({
  declarations: [
    FormularioComponent,
    Anexo007_A17_3_Component,
    Anexo007_B17_3_Component,
    Anexo007_C17_3_Component,
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
    Formulario007_17_3Service,
    Anexo007_A17_3Service,
    Anexo007_B17_3Service,
    Anexo007_C17_3Service,
    { provide: Formulario007_17_3Repository, useClass: Formulario007_17_3HttpRepository },
    { provide: Anexo007_A17_3Repository, useClass: Anexo007_A17_3HttpRepository },
    { provide: Anexo007_B17_3Repository, useClass: Anexo007_B17_3HttpRepository },
    { provide: Anexo007_C17_3Repository, useClass: Anexo007_C17_3HttpRepository },
  ]
})
export class Formulario_007_17_3Module { }
