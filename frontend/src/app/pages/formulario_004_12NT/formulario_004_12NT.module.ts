import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//NG BOOTSTRAP
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

//RUTAS
import { Formulario_004_12NT_RoutingModule } from './formulario_004_12NT-routing.module';

//COMPONENTES
import { FormularioComponent } from './components/formulario/formulario.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalendarDatePickerComponent } from 'src/app/shared/components/calendar-date-picker/calendar-date-picker.component';
import { SharedModule } from '../../shared/shared.module';
import { UiSwitchModule } from 'ngx-ui-switch';

@NgModule({
  declarations: [FormularioComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    Formulario_004_12NT_RoutingModule,
    NgbModule,
    UiSwitchModule,
    
    SharedModule],
})
export class Formulario_004_12NT_Module { }