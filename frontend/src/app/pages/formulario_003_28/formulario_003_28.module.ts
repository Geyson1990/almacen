import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormularioComponent } from './presentation/pages/formulario/formulario.component';
import { Anexo003_A28_Component } from './presentation/pages/anexo003_A28/anexo003_A28.component';

import {
  Anexo003_A28Service,
  Anexo003_B28Service,
  Formulario003_28Service,
} from './application/usecases';
import {
  Anexo003_A28Repository,
  Anexo003_B28Repository,
  Formulario003_28Repository,
} from './application/repositories';
import {
  Anexo003_A28HttpRepository,
  Anexo003_B28HttpRepository,
  Formulario003_28HttpRepository,
} from './infrastructure/repositories';
import { Anexo003_B28_Component } from './presentation/pages/anexo003_B28/anexo003_B28.component';
import { UiSwitchModule } from 'ngx-ui-switch';

@NgModule({
  declarations: [
    FormularioComponent,
    Anexo003_A28_Component,
    Anexo003_B28_Component,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    UiSwitchModule,
    
    SharedModule,
  ],
  providers: [
    Formulario003_28Service,
    Anexo003_A28Service,
    Anexo003_B28Service,
    {
      provide: Formulario003_28Repository,
      useClass: Formulario003_28HttpRepository,
    },
    { provide: Anexo003_A28Repository, useClass: Anexo003_A28HttpRepository },
    { provide: Anexo003_B28Repository, useClass: Anexo003_B28HttpRepository },
  ],
})
export class Formulario_003_28Module {}
