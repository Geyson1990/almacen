import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormularioComponent } from './presentation/pages/formulario/formulario.component';
import { Formulario001_16Service } from './application/usecases/formulario001_16.service';
import { Formulario001_16Repository } from './application/repositories/formulario001_16.repository';
import { Formulario001_16HttpRepository } from './infrastructure/repositories/formulario001_16-http.repository';
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
    Formulario001_16Service,
    { provide: Formulario001_16Repository, useClass: Formulario001_16HttpRepository },
  ]
})
export class Formulario_001_16_Module { }
