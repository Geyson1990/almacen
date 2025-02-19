import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//NG BOOTSTRAP
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

//RUTAS
import { Formulario_001_12_4_RoutingModule } from './formulario_001_12_4-routing.module';

//COMPONENTES
import { FormularioComponent } from './components/formulario/formulario.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalendarDatePickerComponent } from 'src/app/shared/components/calendar-date-picker/calendar-date-picker.component';
import { UiSwitchModule } from 'ngx-ui-switch';

@NgModule({
  declarations: [FormularioComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    UiSwitchModule,

    Formulario_001_12_4_RoutingModule,
    NgbModule,
  ],
})
export class Formulario_001_12_4_Module {}
