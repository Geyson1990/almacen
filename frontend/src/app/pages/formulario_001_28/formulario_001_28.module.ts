import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//NG BOOTSTRAP
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

//RUTAS
import { Formulario_001_28_RoutingModule } from './formulario_001_28-routing.module';

//COMPONENTES
import { FormularioComponent } from './components/formulario/formulario.component';
import { Anexo001A28Component } from './components/anexos/anexo001-a28/anexo001-a28.component';
import { Anexo001B28Component } from './components/anexos/anexo001-b28/anexo001-b28.component';
import { Anexo001C28Component } from './components/anexos/anexo001-c28/anexo001-c28.component';
import { Anexo001D28Component } from './components/anexos/anexo001-d28/anexo001-d28.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UiSwitchModule } from 'ngx-ui-switch';

@NgModule({
  declarations: [
    FormularioComponent,
    Anexo001A28Component,
    Anexo001B28Component,
    Anexo001C28Component,
    Anexo001D28Component,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    UiSwitchModule,

    Formulario_001_28_RoutingModule,
    NgbModule,
  ],
})
export class Formulario_001_28_Module {}
