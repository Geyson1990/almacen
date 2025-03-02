import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PdfJsViewerModule } from 'ng2-pdfjs-viewer'; // <-- Import PdfJsViewerModule module

import { ProfesionalRoutingModule } from './profesional-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
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
