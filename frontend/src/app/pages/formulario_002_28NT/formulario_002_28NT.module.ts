import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//NG BOOTSTRAP
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

//RUTAS
import { Formulario_002_28NT_RoutingModule } from './formulario_002_28NT-routing.module';

//COMPONENTES
import { FormularioComponent } from './components/formulario/formulario.component';
import { Anexo002A28Component } from './components/anexos/anexo002-a28/anexo002-a28.component';
import { Anexo002B28Component } from './components/anexos/anexo002-b28/anexo002-b28.component';
import { Anexo002C28Component } from './components/anexos/anexo002-c28/anexo002-c28.component';
import { Anexo002D28Component } from './components/anexos/anexo002-d28/anexo002-d28.component';
import { Anexo002E28Component } from './components/anexos/anexo002-e28/anexo002-e28.component';
import { Anexo002F28Component } from './components/anexos/anexo002-f28/anexo002-f28.component';
import { Anexo002G28Component } from './components/anexos/anexo002-g28/anexo002-g28.component';
import { Anexo002H28Component } from './components/anexos/anexo002-h28/anexo002-h28.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { UiSwitchModule } from 'ngx-ui-switch';

@NgModule({
  //declarations: [FormularioComponent,Anexo003A17Component, Anexo003B17Component, Anexo003C17Component,Anexo003D17Component, Anexo003F17Component],
  declarations: [
    FormularioComponent,
    Anexo002A28Component,
    Anexo002B28Component,
    Anexo002C28Component,
    Anexo002D28Component,
    Anexo002E28Component,
    Anexo002F28Component,
    Anexo002G28Component,
    Anexo002H28Component,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    UiSwitchModule,

    Formulario_002_28NT_RoutingModule,
    NgbModule,
    SharedModule,
  ],
})
export class Formulario_002_28NT_Module {}
