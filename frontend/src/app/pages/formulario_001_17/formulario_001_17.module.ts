import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


//NG BOOTSTRAP
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

//RUTAS
import { Formulario_001_17_RoutingModule } from './formulario_001_17-routing.module';

//COMPONENTES
import { FormularioComponent } from './components/formulario/formulario.component';
import { Anexo001A17Component } from './components/anexos/anexo001-a17/anexo001-a17.component';
import { Anexo001B17Component } from './components/anexos/anexo001-b17/anexo001-b17.component';
import { Anexo001C17Component } from './components/anexos/anexo001-c17/anexo001-c17.component';
import { Anexo001D17Component } from './components/anexos/anexo001-d17/anexo001-d17.component';
import { Anexo001E17Component } from './components/anexos/anexo001-e17/anexo001-e17.component';
import { Anexo001F17Component } from './components/anexos/anexo001-f17/anexo001-f17.component';
import { Anexo001G17Component } from './components/anexos/anexo001-g17/anexo001-g17.component';
import { Anexo003E17Component } from './components/anexos/anexo003-e17/anexo003-e17.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalendarDatePickerComponent } from 'src/app/shared/components/calendar-date-picker/calendar-date-picker.component';
import { Anexo001H17Component } from './components/anexos/anexo001-h17/anexo001-h17.component';
import { SharedModule } from '../../shared/shared.module';
import { UiSwitchModule } from 'ngx-ui-switch';

@NgModule({
  declarations: [
    FormularioComponent,
    // CalendarDatePickerComponent,
    Anexo001A17Component,
    Anexo001B17Component,
    Anexo001C17Component,
    Anexo001D17Component,
    Anexo001E17Component,
    Anexo001F17Component,
    Anexo001G17Component,
    Anexo003E17Component,
    Anexo001H17Component,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    Formulario_001_17_RoutingModule,
    NgbModule,
    UiSwitchModule,
    
    SharedModule
  ],
})
export class Formulario_001_17_Module {}
