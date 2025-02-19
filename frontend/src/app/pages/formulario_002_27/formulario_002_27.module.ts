import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormularioComponent } from './presentation/pages/formulario/formulario.component';
import { Anexo002_A27Component } from './presentation/pages/anexo002_A27/anexo002_A27.component';
import { Anexo002_B27Component } from './presentation/pages/anexo002_B27/anexo002_B27.component';
import { Anexo002_C27Component } from './presentation/pages/anexo002_C27/anexo002_C27.component';
import { Anexo002_D27Component } from './presentation/pages/anexo002_D27/anexo002_D27.component';
import { Anexo002_E27Component } from './presentation/pages/anexo002_E27/anexo002_E27.component';
import { FormEstacionRadioelectricaComponent } from './presentation/components/form-estacion-radioelectrica/form-estacion-radioelectrica.component';
import { FormEstacionFijaSatelitalComponent } from './presentation/components/form-estacion-fija-satelital/form-estacion-fija-satelital.component';
import { Anexo002_A27Service, Anexo002_B27Service, Anexo002_C27Service, Anexo002_D27Service, Anexo002_E27Service, Formulario002_27Service } from './application/usecases';
import { Anexo002_A27Repository, Anexo002_B27Repository, Anexo002_C27Repository, Anexo002_D27Repository, Anexo002_E27Repository, Formulario002_27Repository } from './application/repositories';
import { Anexo002_A27HttpRepository, Anexo002_B27HttpRepository, Anexo002_C27HttpRepository, Anexo002_D27HttpRepository, Anexo002_E27HttpRepository, Formulario002_27HttpRepository } from './infrastructure/repositories';
import { UiSwitchModule } from 'ngx-ui-switch';

@NgModule({
  declarations: [
    FormularioComponent,
    Anexo002_A27Component,
    Anexo002_B27Component,
    Anexo002_C27Component,
    Anexo002_D27Component,
    Anexo002_E27Component,
    FormEstacionRadioelectricaComponent,
    FormEstacionFijaSatelitalComponent
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
    Formulario002_27Service,
    Anexo002_A27Service,
    Anexo002_B27Service,
    Anexo002_C27Service,
    Anexo002_D27Service,
    Anexo002_E27Service,
    { provide: Formulario002_27Repository, useClass: Formulario002_27HttpRepository },
    { provide: Anexo002_A27Repository, useClass: Anexo002_A27HttpRepository },
    { provide: Anexo002_B27Repository, useClass: Anexo002_B27HttpRepository },
    { provide: Anexo002_C27Repository, useClass: Anexo002_C27HttpRepository },
    { provide: Anexo002_D27Repository, useClass: Anexo002_D27HttpRepository },
    { provide: Anexo002_E27Repository, useClass: Anexo002_E27HttpRepository },
  ]
})
export class Formulario_002_27_Module { }
