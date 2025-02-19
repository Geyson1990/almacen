import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//NG BOOTSTRAP
import { NgbModule, NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';

//RUTAS
import { Formulario_001_PVNI_RoutingModule } from './formulario_001_PVNI-routing.module';

//COMPONENTES
import { FormularioComponent } from './presentation/pages/formulario.component';
import { Formulario001PVNIService } from './application';
import { Formulario001PVNIRepository } from './application';
import { Formulario001PVNIHttpRepository } from './infrastructure/repositories';
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
    Formulario_001_PVNI_RoutingModule,
    NgbModule,
    NgbAccordionModule,
    UiSwitchModule,
    SharedModule,
  ],
  providers: [
    Formulario001PVNIService,
    SiidgacService,
    { provide: Formulario001PVNIRepository, useClass: Formulario001PVNIHttpRepository}
  ]
})
export class Formulario_001_PVNI_Module { }
