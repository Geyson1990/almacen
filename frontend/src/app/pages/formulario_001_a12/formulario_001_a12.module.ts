import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormularioComponent } from './components/formulario/formulario.component';

//NG BOOTSTRAP
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Formulario001A12RoutingModule } from './formulario_001_a12-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { UiSwitchModule } from 'ngx-ui-switch';

@NgModule({
  declarations: [FormularioComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    UiSwitchModule,

    Formulario001A12RoutingModule,
    NgbModule,
  ],
})
export class Formulario001A12Module {}
