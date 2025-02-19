import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ValidaVoucherResponseModel } from 'src/app/core/models/Tramite/ValidaVoucherResponseModel';
import { VoucherRequestModel } from 'src/app/core/models/Tramite/VoucherRequestModel';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { SeguridadService } from 'src/app/core/services/seguridad.service';
import { TramiteService } from 'src/app/core/services/tramite/tramite.service';
import { ValidateFileSize_Formulario } from 'src/app/helpers/file';

@Component({
  selector: 'app-ayuda-voucher',
  templateUrl: './ayuda-voucher.component.html',
  styleUrls: ['./ayuda-voucher.component.css']
})
export class AyudaVoucherComponent implements OnInit {
  inpVPCodigoA: string;
  inpVPCodigoDia: string;
  inpVPCodigoMes: string;
  inpVPCodigoAnio: string;
  inpVPCodigoB: string;

  constructor(
    private router: Router,
    private funcionesMtcService: FuncionesMtcService,
    private tramiteService: TramiteService,
    private seguridadService: SeguridadService
  ) { }

  ngOnInit(): void {
    this.inpVPCodigoA = '';
    this.inpVPCodigoDia = '';
    this.inpVPCodigoMes = '01';
    this.inpVPCodigoAnio = '';
    this.inpVPCodigoB = '';
  }

  async validarVoucher(): Promise<void> {
    if (!this.inpVPCodigoA || this.inpVPCodigoA.trim().length === 0
      || !this.inpVPCodigoDia || this.inpVPCodigoDia.trim().length === 0
      || !this.inpVPCodigoMes || this.inpVPCodigoMes.trim().length === 0
      || !this.inpVPCodigoAnio || this.inpVPCodigoAnio.trim().length === 0
      || !this.inpVPCodigoB || this.inpVPCodigoB.trim().length === 0) {
      this.funcionesMtcService.mensajeError('Debe ingresar todos los campos del voucher');
      return;
    }

    const objVoucherRequestModel = {
      tramiteId: '0',
      tramiteReqId: '0',
      tipoDocumento: '',
      numeroDocumento: '',
      codigoTributo: '',
      numeroSecuencia: this.inpVPCodigoA.trim(),
      fechaMovimiento: this.inpVPCodigoAnio.trim() + '-' + this.inpVPCodigoMes.trim() + '-' + this.inpVPCodigoDia.trim() + 'T00:00:00.000Z',
      codigoOficina: this.inpVPCodigoB.trim(),
      total: 0,
      codigoUsuario: ''
    } as VoucherRequestModel;

    this.funcionesMtcService.mostrarCargando();

    try {
      const response = await this.tramiteService.putVerificarVoucher<ValidaVoucherResponseModel>(objVoucherRequestModel).toPromise();
      console.log(response);
      this.funcionesMtcService.ocultarCargando();
      if (response.success) {
        await this.funcionesMtcService.mensajeOk(response.result);
      } else {
        await this.funcionesMtcService.mensajeError(response.result);
      }
    } catch (e) {
      console.log(e);
      await this.funcionesMtcService.mensajeError('No se pudo validar el voucher.');
    } finally {
      this.funcionesMtcService.ocultarCargando();
      this.inpVPCodigoA = '';
      this.inpVPCodigoDia = '';
      this.inpVPCodigoMes = '01';
      this.inpVPCodigoAnio = '';
      this.inpVPCodigoB = '';
    }
  }
}