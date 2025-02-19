import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormularioComponent } from './components/formulario/formulario.component';

//NG BOOTSTRAP
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Formulario001B12RoutingModule } from './formulario_001_b12-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { UiSwitchModule } from 'ngx-ui-switch';

@NgModule({
  declarations: [FormularioComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    UiSwitchModule,

    Formulario001B12RoutingModule,
    NgbModule,
  ],
})
export class Formulario001B12Module {}
