import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AyudaVoucherComponent } from './components/ayuda-voucher/ayuda-voucher.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AyudaRoutingModule } from './ayuda-rounting.module';
import { AyudaIncidenciaComponent } from './components/ayuda-incidencia/ayuda-incidencia.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PaginationTableComponent } from 'src/app/shared/components/pagination-table/pagination-table.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AyudaTupasComponent } from './components/ayuda-tupas/ayuda-tupas.component';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [AyudaVoucherComponent, AyudaIncidenciaComponent, AyudaTupasComponent],
  imports: [
    CommonModule,
    AyudaRoutingModule,
    FormsModule,
    HttpClientModule,
    NgbModule,
    ReactiveFormsModule,
    SharedModule,
  ]
})
export class AyudaModule { }
