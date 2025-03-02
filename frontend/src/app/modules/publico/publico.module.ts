import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublicoRoutingModule } from './publico-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CoreModule } from 'src/app/core/core.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { MateriaUseCase } from './application/usecases';
import { MateriaRepository } from './application/repositories';
import { MateriaHttpRepository } from './infrastructure/respositories/materia-http.repository';
import { QuillModule } from 'ngx-quill';
import { StoreModule } from '@ngrx/store';
import { ROOT_REDUCER } from './presentation/state/app.state';

import { ViasAccesoNuevaComponent } from 'src/app/modals/vias-acceso-nueva/vias-acceso-nueva.component';

import { MatDialogModule } from '@angular/material/dialog';
import { FileSelectorComponent } from 'src/app/pages/core/components/mapas/file-selector/file-selector.component';
import { LayoutComponent } from 'src/app/pages/core/components/mapas/layout/layout.component';

const COMPONENTS = [

];

const MODALS = [
  ViasAccesoNuevaComponent,
];

@NgModule({
  declarations: [
    FileSelectorComponent,
    LayoutComponent
  ],
  imports: [
    CommonModule,
    PublicoRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    CoreModule,
    SharedModule,
    QuillModule,
    MatDialogModule,
    StoreModule.forFeature('PublicoAppState', ROOT_REDUCER),
  ],
  providers: [
    MateriaUseCase,
    { provide: MateriaRepository, useClass: MateriaHttpRepository },
  ]
})
export class PublicoModule { }
