import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//NG BOOTSTRAP
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

//RUTAS
import { Formulario_002_17_RoutingModule } from './formulario_002_17-routing.module';

//COMPONENTES
import { FormularioComponent } from './components/formulario/formulario.component';
import { Anexo002E17Component } from './components/anexos/anexo002-e17/anexo002-e17.component';
import { Anexo002F17Component } from './components/anexos/anexo002-f17/anexo002-f17.component';
import { Anexo002G17Component } from './components/anexos/anexo002-g17/anexo002-g17.component';
import { Anexo002I17Component } from './components/anexos/anexo002-i17/anexo002-i17.component';
import { Anexo002A17Component } from './components/anexos/anexo002-a17/anexo002-a17.component';
import { Anexo002B17Component } from './components/anexos/anexo002-b17/anexo002-b17.component';
import { Anexo002D17Component } from './components/anexos/anexo002-d17/anexo002-d17.component';
import { Anexo002H17Component } from './components/anexos/anexo002-h17/anexo002-h17.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalendarDatePickerComponent } from 'src/app/shared/components/calendar-date-picker/calendar-date-picker.component';
import { UiSwitchModule } from 'ngx-ui-switch';

@NgModule({
  declarations: [
    FormularioComponent,
    Anexo002E17Component,
    Anexo002F17Component,
    Anexo002G17Component,
    Anexo002I17Component,
    Anexo002A17Component,
    Anexo002B17Component,
    Anexo002D17Component,
    Anexo002H17Component,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    UiSwitchModule,

    Formulario_002_17_RoutingModule,
    NgbModule,
  ],
})
export class Formulario_002_17_Module {}
