import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { EncuestaComponent } from './presentation/pages/encuesta/encuesta.component';
import { EncuestasRoutingModule } from './encuestas-routing.module';
import { CoreModule } from 'src/app/core/core.module';
import { EncuestaUseCase } from './application/usecases';
import { EncuestaRepository } from './application/repositories';
import { EncuestaHttpRepository } from './infrastructure/respositories';
import { FormEncuestaEscalaLikertComponent } from './presentation/components/form-encuesta-escala-likert/form-encuesta-escala-likert.component';
import { FinalizarEncuestaUseCase } from './application/usecases/guardar-encuesta.usecase';
import { FormEncuestaGeneralComponent } from './presentation/components/form-encuesta-general/form-encuesta-general.component';

@NgModule({
  declarations: [
    EncuestaComponent,
    FormEncuestaEscalaLikertComponent,
    FormEncuestaGeneralComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    EncuestasRoutingModule,
    NgbModule,
    
    CoreModule,
    SharedModule,
  ],
  providers: [
    EncuestaUseCase,
    FinalizarEncuestaUseCase,
    { provide: EncuestaRepository, useClass: EncuestaHttpRepository },
  ]
})
export class EncuestasModule { }
