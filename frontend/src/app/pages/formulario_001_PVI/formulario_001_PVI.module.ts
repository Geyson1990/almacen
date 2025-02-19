import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//NG BOOTSTRAP
import { NgbModule, NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';

//RUTAS
import { Formulario_001_PVI_RoutingModule } from './formulario_001_PVI-routing.module';

//COMPONENTES
import { FormularioComponent } from './presentation/pages/formulario.component';
import { Formulario001PVIService } from './application';
import { Formulario001PVIRepository } from './application';
import { Formulario001PVIHttpRepository } from './infrastructure/repositories';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SiidgacService } from 'src/app/core/services/siidgac/siidgac.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { UiSwitchModule } from 'ngx-ui-switch';

@NgModule({
  declarations: [FormularioComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    Formulario_001_PVI_RoutingModule,
    NgbModule,
    NgbAccordionModule,
    UiSwitchModule,
    
    SharedModule,
  ],
  providers: [
    Formulario001PVIService,
    SiidgacService,
    { provide: Formulario001PVIRepository, useClass: Formulario001PVIHttpRepository}
  ]
})
export class Formulario_001_PVI_Module { }
