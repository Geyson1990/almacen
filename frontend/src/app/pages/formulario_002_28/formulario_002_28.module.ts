import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//NG BOOTSTRAP
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

//RUTAS
import { Formulario_002_28_RoutingModule } from './formulario_002_28-routing.module';

//COMPONENTES
import { FormularioComponent } from './components/formulario/formulario.component';
import { Anexo002A28Component } from './components/anexos/anexo002-a28/anexo002-a28.component';
import { Anexo002F28Component } from './components/anexos/anexo002-f28/anexo002-f28.component';
import { Anexo002G28Component } from './components/anexos/anexo002-g28/anexo002-g28.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UiSwitchModule } from 'ngx-ui-switch';

@NgModule({
  declarations: [
    FormularioComponent,
    Anexo002A28Component,
    Anexo002F28Component,
    Anexo002G28Component,
  ], //Anexo002A28Component,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    UiSwitchModule,
    
    Formulario_002_28_RoutingModule,
    NgbModule,
  ],
})
export class Formulario_002_28_Module {}
