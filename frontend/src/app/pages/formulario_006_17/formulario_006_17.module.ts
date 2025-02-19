import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//NG BOOTSTRAP
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

//RUTAS
import { Formulario_006_17_RoutingModule } from './formulario_006_17-routing.module';

//COMPONENTES
import { FormularioComponent } from './components/formulario/formulario06.component';
import { Anexo006A17Component } from './components/anexos/anexo006-a17/anexo006-a17.component';
import { Anexo006B17Component } from './components/anexos/anexo006-b17/anexo006-b17.component';
import { Anexo006C17Component } from './components/anexos/anexo006-c17/anexo006-c17.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UiSwitchModule } from 'ngx-ui-switch';

@NgModule({
  declarations: [
    FormularioComponent,
    Anexo006A17Component,
    Anexo006B17Component,
    Anexo006C17Component,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    UiSwitchModule,
    
    Formulario_006_17_RoutingModule,
    NgbModule,
  ],
})
export class Formulario_006_17_Module {}
