import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//NG BOOTSTRAP
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
//RUTAS
import { Formulario_001_27_RoutingModule } from './formulario_001_27-routing.module';
//COMPONENTES
import { FormularioComponent } from './components/formulario/formulario.component';
import { Anexo001A27Component } from './components/anexos/anexo001-a27/anexo001-a27.component';
import { Anexo001B27Component } from './components/anexos/anexo001-b27/anexo001-b27.component';
import { Anexo001C27Component } from './components/anexos/anexo001-c27/anexo001-c27.component';
import { Anexo001D27Component } from './components/anexos/anexo001-d27/anexo001-d27.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { Anexo001E27Component } from './components/anexos/anexo001-e27/anexo001-e27.component';
import { UiSwitchModule } from 'ngx-ui-switch';
// import { CalendarDatePickerComponent } from 'src/app/shared/components/calendar-date-picker/calendar-date-picker.component';
//import { Anexo001H17Component } from './components/anexos/anexo001-h17/anexo001-h17.component';

@NgModule({
  declarations: [
    FormularioComponent,
    Anexo001A27Component,
    Anexo001B27Component,
    Anexo001C27Component,
    Anexo001D27Component,
    Anexo001E27Component,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    Formulario_001_27_RoutingModule,
    NgbModule,    
    UiSwitchModule,

    SharedModule,
  ],
})
export class Formulario_001_27_Module {}
