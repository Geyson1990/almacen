import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormularioComponent } from './presentation/pages/formulario/formulario.component';
import { Anexo003_a17_2_Component } from './presentation/pages/anexo003_a17_2/anexo003_a17_2.component';
import { Anexo003_b17_2_Component } from './presentation/pages/anexo003_b17_2/anexo003_b17_2.component';

//NG BOOTSTRAP
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


//COMPONENTES
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalendarDatePickerComponent } from 'src/app/shared/components/calendar-date-picker/calendar-date-picker.component';
import { SharedModule } from 'src/app/shared/shared.module';

import { Anexo003_A17_2Service, Anexo003_B17_2Service, Formulario003_17_2Service } from './application/usecases';
import { Anexo003_A17_2Repository, Anexo003_B17_2Repository, Formulario003_17_2Repository } from './application/repositories';
import { Anexo003_A17_2HttpRepository, Anexo003_B17_2HttpRepository, Formulario003_17_2HttpRepository } from './infrastructure/repositories';
import { UiSwitchModule } from 'ngx-ui-switch';

@NgModule({
   declarations: [
      FormularioComponent,
      Anexo003_a17_2_Component,
      Anexo003_b17_2_Component
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
      Formulario003_17_2Service,
      Anexo003_A17_2Service,
      Anexo003_B17_2Service,
      { provide: Formulario003_17_2Repository, useClass: Formulario003_17_2HttpRepository },
      { provide: Anexo003_A17_2Repository, useClass: Anexo003_A17_2HttpRepository },
      { provide: Anexo003_B17_2Repository, useClass: Anexo003_B17_2HttpRepository }
   ]
})
export class Formulario_003_17_2_Module { }