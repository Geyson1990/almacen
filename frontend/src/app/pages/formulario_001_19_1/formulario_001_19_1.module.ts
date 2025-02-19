import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//NG BOOTSTRAP
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

//RUTAS
import { Formulario_001_19_1_RoutingModule } from './formulario_001_19_1-routing.module';

//COMPONENTES
import { FormularioComponent } from './components/formulario/formulario.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { UiSwitchModule } from 'ngx-ui-switch';

@NgModule({
  //declarations: [FormularioComponent,Anexo003A17Component, Anexo003B17Component, Anexo003C17Component,Anexo003D17Component, Anexo003F17Component],
  declarations: [FormularioComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    Formulario_001_19_1_RoutingModule,
    NgbModule,
    UiSwitchModule,
    
    SharedModule,
  ],
})
export class Formulario_001_19_1_Module {}
