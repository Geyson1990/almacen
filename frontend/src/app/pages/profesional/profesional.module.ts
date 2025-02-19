import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PdfJsViewerModule } from 'ng2-pdfjs-viewer'; // <-- Import PdfJsViewerModule module

import { ProfesionalRoutingModule } from './profesional-routing.module';
import { FirmarDocumentoComponent } from './components/firmar-documento/firmar-documento.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [FirmarDocumentoComponent],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    PdfJsViewerModule,
    ProfesionalRoutingModule,
  ]
})
export class ProfesionalModule { }
