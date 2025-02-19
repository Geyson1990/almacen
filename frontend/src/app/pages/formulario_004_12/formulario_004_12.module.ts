import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//NG BOOTSTRAP
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

//RUTAS
import { Formulario_004_12_RoutingModule } from './formulario_004_12-routing.module';

//COMPONENTES
import { FormularioComponent } from './components/formulario/formulario.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UiSwitchModule } from 'ngx-ui-switch';

@NgModule({
  declarations: [FormularioComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    UiSwitchModule,

    Formulario_004_12_RoutingModule,
    NgbModule,
  ],
})
export class Formulario_004_12_Module {}
