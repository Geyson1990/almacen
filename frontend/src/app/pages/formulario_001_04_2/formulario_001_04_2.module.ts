import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { FormularioComponent } from './presentation/pages/formulario/formulario.component';
import { Formulario001_04_2Repository } from './application/repositories';
import { Formulario001_04_2Service } from './application/usecases';
import { Formulario001_04_2HttpRepository } from './infrastructure/repositories';
import { UiSwitchModule } from 'ngx-ui-switch';

@NgModule({
  declarations: [FormularioComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    UiSwitchModule,
    
    SharedModule,
  ],
  providers: [
    Formulario001_04_2Service,
    {
      provide: Formulario001_04_2Repository,
      useClass: Formulario001_04_2HttpRepository,
    },
  ],
})
export class Formulario_001_04_2_Module {}
