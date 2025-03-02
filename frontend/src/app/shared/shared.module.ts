import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { NotFoundComponent } from './components/not-found/not-found.component';
import { PaginationTableComponent } from './components/pagination-table/pagination-table.component';
import { CalendarDatePickerComponent } from './components/calendar-date-picker/calendar-date-picker.component';
import { VistaPdfComponent } from './components/vista-pdf/vista-pdf.component';
import { HeaderComponent } from './components/header/header.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbAccordionModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MaskDirective } from './directives/mask.directive';
import { DigitOnlyDirective } from './directives/digit-only.directive';
import { PasswordComponent } from './components/forms/password/password.component';
import { DatosGeneralesComponent } from './components/datos-generales/datos-generales.component';
import { FileUploadComponent } from './components/forms/file-upload/file-upload.component';
import { BasicInputComponent } from './components/forms/basic-input/basic-input.component';
import { BasicCheckboxComponent } from './components/forms/basic-checkbox/basic-checkbox.component';
import { BasicFileUploadComponent } from './components/forms/basic-file-upload/basic-file-upload.component';
import { FileUploadCoreComponent } from './components/forms/file-upload-core/file-upload-core.component';
import { BasicSelectComponent } from './components/forms/basic-select/basic-select.component';
import { FirmaSignnetComponent } from './components/firma-signnet/firma-signnet.component';
import { HttpClientModule } from '@angular/common/http';
import { FirmaPeruComponent } from './components/firma-peru/firma-peru.component';
import { QuillModule } from 'ngx-quill';
import { TupaTableComponent } from './components/table/table.component';
import { TupaTableMultipleComponent } from './components/table-edit/table-multiple.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgbAccordionModule,
    QuillModule,
  ],
  declarations: [
    NotFoundComponent,
    PaginationTableComponent,
    CalendarDatePickerComponent,
    VistaPdfComponent,
    HeaderComponent,
    DigitOnlyDirective,
    MaskDirective,
    PasswordComponent,
    FileUploadComponent,
    BasicInputComponent,
    BasicCheckboxComponent,
    BasicFileUploadComponent,
    FileUploadCoreComponent,
    BasicSelectComponent,
    FirmaSignnetComponent,
    FirmaPeruComponent,
    TupaTableComponent,
    TupaTableMultipleComponent
  ],
  exports: [
    NotFoundComponent,
    PaginationTableComponent,
    CalendarDatePickerComponent,
    VistaPdfComponent,
    HeaderComponent,
    DigitOnlyDirective,
    MaskDirective,
    PasswordComponent,
    FileUploadComponent,
    BasicInputComponent,
    BasicCheckboxComponent,
    BasicFileUploadComponent,
    BasicSelectComponent,
    FirmaSignnetComponent,
    FirmaPeruComponent,
    HttpClientModule,
    NgbModule,
    NgbAccordionModule,
    TupaTableComponent,
    TupaTableMultipleComponent
  ],
  providers: [],
  schemas: [],
})
export class SharedModule {}
