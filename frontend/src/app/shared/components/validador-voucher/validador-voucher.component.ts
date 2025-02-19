import { Component, Input, OnInit, input } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal, NgbModalRef, NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { Subscription, combineLatest } from 'rxjs';
import { ProcedimientoModel } from 'src/app/core/models/Tramite/ProcedimientoModel';
import { ResponseComunModel } from 'src/app/core/models/Tramite/ResponseComunModel';
import { VoucherRequestModel } from 'src/app/core/models/Tramite/VoucherRequestModel';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { SeguridadService } from 'src/app/core/services/seguridad.service';
import { CasillaService } from 'src/app/core/services/servicios/casilla.service';
import { RelacionTupasService } from 'src/app/core/services/servicios/relacion-tupas.service';
import { TramiteService } from 'src/app/core/services/tramite/tramite.service';

@Component({
  selector: 'app-validador-voucher',
  templateUrl: './validador-voucher.component.html',
  styleUrls: ['./validador-voucher.component.scss'],
})
export class ValidadorVoucherComponent implements OnInit {
  subs: Subscription[] = [];

  inpVPCodigoA: string;
  inpVPCodigoDia: string;
  inpVPCodigoMes: string;
  inpVPCodigoAnio: string;
  inpVPCodigoB: string;

  constructor(
    public readonly _activeModal: NgbActiveModal,
    private readonly _funcionesMtcService: FuncionesMtcService,
    private readonly _tramiteService: TramiteService
  ) {}

  ngOnInit(): void {}

  async validarVoucher(): Promise<void> {
    if (
      !this.inpVPCodigoA ||
      this.inpVPCodigoA.trim().length === 0 ||
      !this.inpVPCodigoDia ||
      this.inpVPCodigoDia.trim().length === 0 ||
      !this.inpVPCodigoMes ||
      this.inpVPCodigoMes.trim().length === 0 ||
      !this.inpVPCodigoAnio ||
      this.inpVPCodigoAnio.trim().length === 0 ||
      !this.inpVPCodigoB ||
      this.inpVPCodigoB.trim().length === 0
    ) {
      this._funcionesMtcService.mensajeError(
        'Debe ingresar todos los campos del voucher'
      );
      return;
    }

    const objVoucherRequestModel = {
      tramiteId: '0',
      tramiteReqId: '0',
      tipoDocumento: '',
      numeroDocumento: '',
      codigoTributo: '',
      numeroSecuencia: this.inpVPCodigoA.trim(),
      fechaMovimiento:
        this.inpVPCodigoAnio.trim() +
        '-' +
        this.inpVPCodigoMes.trim() +
        '-' +
        this.inpVPCodigoDia.trim() +
        'T00:00:00.000Z',
      codigoOficina: this.inpVPCodigoB.trim(),
      total: 0,
      codigoUsuario: '',
    } as VoucherRequestModel;

    this._funcionesMtcService.mostrarCargando();

    try {
      const response = await this._tramiteService
        .putVerificarVoucher<ResponseComunModel<string>>(objVoucherRequestModel)
        .toPromise();
      console.log(response);
      this._funcionesMtcService.ocultarCargando();
      if (response.success) {
        await this._funcionesMtcService.mensajeOk(response.message);
      } else {
        await this._funcionesMtcService.mensajeError(response.message);
      }
    } catch (e) {
      console.log(e);
      this._funcionesMtcService.ocultarCargando();
      await this._funcionesMtcService.mensajeError(
        'No se pudo validar el voucher.'
      );
    } finally {
      this.inpVPCodigoA = '';
      this.inpVPCodigoDia = '';
      this.inpVPCodigoMes = '01';
      this.inpVPCodigoAnio = '';
      this.inpVPCodigoB = '';
      this._activeModal.close();
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
