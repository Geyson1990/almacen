import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//NG BOOTSTRAP
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

//RUTAS
import { Formulario_003_17_RoutingModule } from './formulario_003_17-routing.module';

//COMPONENTES
import { FormularioComponent } from './components/formulario/formulario.component';
import { Anexo003A17Component } from './components/anexos/anexo003-a17/anexo003-a17.component';
import { Anexo003B17Component } from './components/anexos/anexo003-b17/anexo003-b17.component';
import { Anexo003C17Component } from './components/anexos/anexo003-c17/anexo003-c17.component';
import { Anexo003D17Component } from './components/anexos/anexo003-d17/anexo003-d17.component';
import { Anexo003F17Component } from './components/anexos/anexo003-f17/anexo003-f17.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UiSwitchModule } from 'ngx-ui-switch';

@NgModule({
  declarations: [
    FormularioComponent,
    Anexo003A17Component,
    Anexo003B17Component,
    Anexo003C17Component,
    Anexo003D17Component,
    Anexo003F17Component,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    UiSwitchModule,

    Formulario_003_17_RoutingModule,
    NgbModule,
  ],
})
export class Formulario_003_17_Module {}
