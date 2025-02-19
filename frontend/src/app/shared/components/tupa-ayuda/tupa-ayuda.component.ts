import { Component, Input, OnInit, input } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef, NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { Subscription, combineLatest } from 'rxjs';
import { ProcedimientoModel } from 'src/app/core/models/Tramite/ProcedimientoModel';
import { ResponseComunModel } from 'src/app/core/models/Tramite/ResponseComunModel';
import { VoucherRequestModel } from 'src/app/core/models/Tramite/VoucherRequestModel';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { SeguridadService } from 'src/app/core/services/seguridad.service';
import { CasillaService } from 'src/app/core/services/servicios/casilla.service';
import { RelacionTupasService } from 'src/app/core/services/servicios/relacion-tupas.service';
import { TramiteService } from 'src/app/core/services/tramite/tramite.service';
import { ValidadorVoucherComponent } from '../validador-voucher/validador-voucher.component';

@Component({
  selector: 'app-tupa-ayuda',
  templateUrl: './tupa-ayuda.component.html',
  styleUrls: ['./tupa-ayuda.component.scss'],
})
export class TupaAyudaComponent implements OnInit {
  subs: Subscription[] = [];

  modal: NgbModalRef;

  listadoProcedimientos: Array<ProcedimientoModel>;
  listadoProcedimientosFilter: Array<ProcedimientoModel>;

  listSize = 1;
  page = 1;
  pageSize = 10;
  txtBuscarTupa = '';

  constructor(
    private modalService: NgbModal,
    private funcionesMtcService: FuncionesMtcService,
    private tramiteService: TramiteService
  ) {}

  ngOnInit(): void {}

  openModal(content): void {
    this.modal = this.modalService.open(content, {
      size: 'lg',
      ariaLabelledBy: 'modal-basic-title',

    });
  }

  openModalValVoucher(): void {
    this.openModal(ValidadorVoucherComponent);
  }

  openModalLista(content): void {
    this.poblarProcedimientos();
    this.modal = this.modalService.open(content, {
      size: 'xl',
      ariaLabelledBy: 'modal-basic-title',
    });
  }

  async poblarProcedimientos(): Promise<void> {
    try {
      this.listadoProcedimientos = await this.tramiteService
        .getProcedimientos('', '')
        .toPromise();
      this.onChangeBuscarTupa();
    } catch (e) {
      this.funcionesMtcService.mensajeError(
        'Error en el servicio de obtener los procedimientos'
      );
    }
  }

  onChangeBuscarTupa(): void {
    if (this.txtBuscarTupa) {
      this.listadoProcedimientosFilter = this.listadoProcedimientos.filter(
        (x) =>
          x.nombre
            .toUpperCase()
            .includes(this.txtBuscarTupa.trim().toUpperCase()) ||
          x.codigo
            .toUpperCase()
            .includes(this.txtBuscarTupa.trim().toUpperCase())
      );
      this.listSize = this.listadoProcedimientosFilter.length;
    } else {
      this.listadoProcedimientosFilter = this.listadoProcedimientos;
      this.listSize = this.listadoProcedimientos.length;
    }
  }

  ngOnDestroy(): void {
    this.subs.forEach((subscription) => {
      if (subscription !== undefined) {
        subscription.unsubscribe();
      }
    });
  }
}
