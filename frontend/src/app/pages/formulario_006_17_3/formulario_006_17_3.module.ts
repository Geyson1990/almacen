import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormularioComponent } from './presentation/pages/formulario/formulario.component';
import { Anexo006_A17_3_Component } from './presentation/pages/anexo006_A17_3/anexo006_A17_3.component';
import { Anexo006_B17_3_Component } from './presentation/pages/anexo006_B17_3/anexo006_B17_3.component';
import { FormExperienciaLaboralComponent } from './presentation/components/form-experiencia-laboral/form-experiencia-laboral.component';

import { Anexo006_A17_3Service, Anexo006_B17_3Service, Formulario006_17_3Service } from './application/usecases';
import { Anexo006_A17_3Repository, Anexo006_B17_3Repository, Formulario006_17_3Repository } from './application/repositories';
import { Anexo006_A17_3HttpRepository, Anexo006_B17_3HttpRepository, Formulario006_17_3HttpRepository } from './infrastructure/repositories';
import { UiSwitchModule } from 'ngx-ui-switch';


@NgModule({
  declarations: [
    FormularioComponent,
    Anexo006_A17_3_Component,
    Anexo006_B17_3_Component,
    FormExperienciaLaboralComponent
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
    Formulario006_17_3Service,
    Anexo006_A17_3Service,
    Anexo006_B17_3Service,
    { provide: Formulario006_17_3Repository, useClass: Formulario006_17_3HttpRepository },
    { provide: Anexo006_A17_3Repository, useClass: Anexo006_A17_3HttpRepository },
    { provide: Anexo006_B17_3Repository, useClass: Anexo006_B17_3HttpRepository },
  ]
})
export class Formulario_006_17_3Module { }
