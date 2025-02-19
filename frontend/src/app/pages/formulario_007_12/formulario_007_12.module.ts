import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//NG BOOTSTRAP
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

//RUTAS
import { Formulario_007_12_RoutingModule } from './formulario_007_12-routing.module';

//COMPONENTES
import { FormularioComponent } from './components/formulario/formulario.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalendarDatePickerComponent } from 'src/app/shared/components/calendar-date-picker/calendar-date-picker.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { UiSwitchModule } from 'ngx-ui-switch';

@NgModule({
  declarations: [FormularioComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    Formulario_007_12_RoutingModule,
    NgbModule,
    UiSwitchModule,
    
    SharedModule
  ],
})
export class Formulario_007_12_Module { }