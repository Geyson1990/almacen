import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//NG BOOTSTRAP
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
//RUTAS
import { Formulario_004_27_RoutingModule } from './formulario_004_27-routing.module';
//COMPONENTES
import { FormularioComponent } from './components/formulario/formulario.component';
import { Anexo004A27Component } from './components/anexos/anexo004-a27/anexo004-a27.component';
import { Anexo004B27Component } from './components/anexos/anexo004-b27/anexo004-b27.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { Anexo004C27Component } from './components/anexos/anexo004-c27/anexo004-c27.component';
import { Anexo004D27Component } from './components/anexos/anexo004-d27/anexo004-d27.component';
// import { CalendarDatePickerComponent } from 'src/app/shared/components/calendar-date-picker/calendar-date-picker.component';
//import { Anexo001H17Component } from './components/anexos/anexo001-h17/anexo001-h17.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { UiSwitchModule } from 'ngx-ui-switch';

@NgModule({
  declarations: [
    FormularioComponent,
    Anexo004A27Component,
    Anexo004B27Component,
    Anexo004C27Component,
    Anexo004D27Component,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    Formulario_004_27_RoutingModule,
    NgbModule,
    SharedModule,
    NgSelectModule,
    UiSwitchModule,
  ],
})
export class Formulario_004_27_Module {}
