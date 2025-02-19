import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//NG BOOTSTRAP
import { NgbModule, NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';

//RUTAS
import { Formulario_002_PVI_RoutingModule } from './formulario_002_PVI-routing.module';

//COMPONENTES
import { FormularioComponent } from './presentation/pages/formulario.component';
import { Formulario002PVIService } from './application';
import { Formulario002PVIRepository } from './application';
import { Formulario002PVIHttpRepository } from './infrastructure/repositories';
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
    Formulario_002_PVI_RoutingModule,
    NgbModule,
    NgbAccordionModule,
    UiSwitchModule,
    SharedModule,
  ],
  providers: [
    Formulario002PVIService,
    SiidgacService,
    { provide: Formulario002PVIRepository, useClass: Formulario002PVIHttpRepository}
  ]
})
export class Formulario_002_PVI_Module { }
