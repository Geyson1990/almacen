import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// NG BOOTSTRAP
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// RUTAS
import { Formulario_001_28NT_RoutingModule } from './formulario_001_28NT-routing.module';

// COMPONENTES
import { FormularioComponent } from './components/formulario/formulario.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalendarDatePickerComponent } from 'src/app/shared/components/calendar-date-picker/calendar-date-picker.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { Anexo001_a28nt_Component } from './components/anexos/anexo001_a28nt/anexo001_a28nt.component';
import { Anexo001_b28nt_Component } from './components/anexos/anexo001_b28nt/anexo001_b28nt.component';
import { Anexo001_c28nt_Component } from './components/anexos/anexo001_c28nt/anexo001_c28nt.component';
import { Anexo001_d28nt_Component } from './components/anexos/anexo001_d28nt/anexo001_d28nt.component';
import { Anexo001_e28nt_Component } from './components/anexos/anexo001_e28nt/anexo001_e28nt.component';
import { Anexo001_g28nt_Component } from './components/anexos/anexo001_g28nt/anexo001_g28nt.component';
import { Anexo001_f28nt_Component } from './components/anexos/anexo001_f28nt/anexo001_f28nt.component';
//import { Anexo001_a28_partial_Component } from './components/partials/anexo001_a28_partial/anexo001_a28_partial.component';
import { Anexo001AbcdntComponent } from './components/anexos/anexo001-abcdnt/anexo001-abcdnt.component';
import { UiSwitchModule } from 'ngx-ui-switch';

@NgModule({
  declarations: [
    FormularioComponent,
    Anexo001_a28nt_Component,
    Anexo001_b28nt_Component,
    Anexo001_c28nt_Component,
    Anexo001_d28nt_Component,
    Anexo001_e28nt_Component,
    Anexo001_f28nt_Component,
    Anexo001_g28nt_Component,
    //Anexo001_a28_partial_Component,
    Anexo001AbcdntComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    UiSwitchModule,

    Formulario_001_28NT_RoutingModule,
    NgbModule,
    
    SharedModule
  ],
})
export class Formulario_001_28NT_Module { }
