import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//NG BOOTSTRAP
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
//COMPONENTES
import { FormularioComponent } from './presentation/pages/formulario/formulario.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Formulario00312NTService } from './application/formulario003-12NT.service';
import { Formulario00312NTRepository } from './application/formulario003-12NT.repository';
import { Formulario00312NTHttpRepository } from './infrastructure/formulario003-12NT-http.repository';
import { SharedModule } from 'src/app/shared/shared.module';
import { UiSwitchModule } from 'ngx-ui-switch';

@NgModule({
  declarations: [FormularioComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    UiSwitchModule,

    SharedModule,
  ],
  providers: [
    Formulario00312NTService,
    {
      provide: Formulario00312NTRepository,
      useClass: Formulario00312NTHttpRepository,
    },
  ],
})
export class Formulario_003_12NT_Module {}
