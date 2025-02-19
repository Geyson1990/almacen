import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//NG BOOTSTRAP
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

//COMPONENTES
import { FormularioComponent } from './presentation/pages/formulario/formulario.component';
import { Anexo001_a17_2_Component } from './presentation/pages/anexo001_A17_2/anexo001_a17_2.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalendarDatePickerComponent } from 'src/app/shared/components/calendar-date-picker/calendar-date-picker.component';
import { SharedModule } from 'src/app/shared/shared.module';

import { Anexo001_A17_2Service, Formulario001_17_2Service } from './application/usecases';
import { Anexo001_A17_2Repository, Formulario001_17_2Repository } from './application/repositories';
import { Anexo001_A17_2HttpRepository, Formulario001_17_2HttpRepository } from './infrastructure/repositories';
import { UiSwitchModule } from 'ngx-ui-switch';

@NgModule({
  declarations: [
    FormularioComponent, 
    Anexo001_a17_2_Component
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
    Formulario001_17_2Service,
    Anexo001_A17_2Service,
    { provide: Formulario001_17_2Repository, useClass: Formulario001_17_2HttpRepository },
    { provide: Anexo001_A17_2Repository, useClass: Anexo001_A17_2HttpRepository }
  ]
})
export class Formulario_001_17_2_Module { }