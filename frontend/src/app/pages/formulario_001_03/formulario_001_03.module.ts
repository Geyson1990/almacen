import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { FormularioComponent } from './presentation/pages/formulario/formulario.component';
import { Formulario001_03Service } from './application/usecases/formulario001_03.service';
import { Formulario001_03Repository } from './application/repositories/formulario001_03.repository';
import { Formulario001_03HttpRepository } from './infrastructure/repositories/formulario001_03-http.repository';
import { UiSwitchModule } from 'ngx-ui-switch';

@NgModule({
    declarations: [
      FormularioComponent
    ],
    imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      NgbModule,
      UiSwitchModule,
      
      SharedModule
    ],
    providers: [
      Formulario001_03Service,
      { provide: Formulario001_03Repository, useClass: Formulario001_03HttpRepository },
    ]
  })
  export class Formulario_001_03_Module { }