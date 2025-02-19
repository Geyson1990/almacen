import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormularioComponent } from './components/formulario/formulario.component';

//NG BOOTSTRAP
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Formulario002A12RoutingModule } from './formulario_002_a12-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { UiSwitchModule } from 'ngx-ui-switch';

@NgModule({
  declarations: [FormularioComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    UiSwitchModule,

    Formulario002A12RoutingModule,
    NgbModule,
  ],
})
export class Formulario002A12Module {}
