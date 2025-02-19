import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { PaginationModel } from 'src/app/core/models/Pagination';
import { SeguridadService } from 'src/app/core/services/seguridad.service';
import { TramiteService } from 'src/app/core/services/tramite/tramite.service';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { TramiteRequestModel } from 'src/app/core/models/Tramite/TramiteRequest';
import { environment } from 'src/environments/environment';
import { VoucherRequestModel } from 'src/app/core/models/Tramite/VoucherRequestModel';
import { CONSTANTES } from 'src/app/enums/constants';
import { ApiResponse } from 'src/app/core/models/api-response';

@Component({
  selector: 'app-recepcion-pago',
  templateUrl: './recepcion-pago.component.html',
  styleUrls: ['./recepcion-pago.component.css'],
})
export class RecepcionPagoComponent implements OnInit {
  listaTupas = [];
  page = 1;
  pageSize = 5;
  tipoPersona: string;
  tipoDocumento: string;
  NDocumento: string;
  nombres: string;
  tipoNombres: string;

  returnUrlPago = '';
  urlPago = '';

  tupa = {};
  TupaId: number;
  TupaCodigo: string;
  TupaNombre: string;
  TupaPlazo: string;
  listadoTipoSolicitud = [];
  tipoSolicitudSeleccionado: any;
  tramiteSelected: {} = null;

  listadoTupas = [];
  listadoTupasPrincipal = [];
  listadoTupasSize: any;
  listadoDetalleTupa = [];
  closeResult = '';

  constructor(
    private seguridadService: SeguridadService,
    private tramiteService: TramiteService,
    private funcionesMtcService: FuncionesMtcService,
    private modalService: NgbModal,
    private route: Router
  ) {
    // this.refreshCountries({ page: this.page, pageSize: this.pageSize } as PaginationModel);
  }

  ngOnInit(): void {
    this.traerDatos();
  }

  traerDatos(): void {
    const tramiteId = localStorage.getItem('tramite-id');
    const tramiteReqId = localStorage.getItem('tramite-req-id');
    const tramiteReqRefId = localStorage.getItem('tramite-req-ref-id');
    const tramiteSelected = localStorage.getItem('tramite-selected') as any;
    this.nombres = this.seguridadService.getUserName();

    let tipoDocPasarela: string;
    let numDocPasarela: string;

    const datosUsuario = this.seguridadService.getDatosUsuarioLogin();
    if (
      datosUsuario.tipoPersona ===
        CONSTANTES.CodTabTipoPersona.PERSONA_JURIDICA ||
      datosUsuario.tipoPersona ===
        CONSTANTES.CodTabTipoPersona.PERSONA_NATURAL_CON_RUC
    ) {
      tipoDocPasarela = CONSTANTES.TipoDocPersonaPasarela.RUC.toString();
      numDocPasarela = datosUsuario.ruc;
    } else {
      switch (datosUsuario.tipoDocumento) {
        case CONSTANTES.TipoDocPersona.RUC:
          tipoDocPasarela = CONSTANTES.TipoDocPersonaPasarela.RUC.toString();
          numDocPasarela = datosUsuario.ruc;
          break;
        case CONSTANTES.TipoDocPersona.DNI:
          tipoDocPasarela = CONSTANTES.TipoDocPersonaPasarela.DNI.toString();
          numDocPasarela = datosUsuario.nroDocumento;
          break;
        case CONSTANTES.TipoDocPersona.CARNET_EXTRANJERIA:
          tipoDocPasarela =
            CONSTANTES.TipoDocPersonaPasarela.CARNET_EXTRANJERIA.toString();
          numDocPasarela = datosUsuario.nroDocumento;
          break;
        case CONSTANTES.TipoDocPersona.PASAPORTE:
          tipoDocPasarela =
            CONSTANTES.TipoDocPersonaPasarela.PASAPORTE.toString();
          numDocPasarela = datosUsuario.nroDocumento;
          break;
        case CONSTANTES.TipoDocPersona.CARNET_IDENTIFICACION:
          tipoDocPasarela =
            CONSTANTES.TipoDocPersonaPasarela.CEDULA_DIPLOMATICA_IDENTIDAD.toString();
          numDocPasarela = datosUsuario.nroDocumento;
          break;
        default:
          tipoDocPasarela =
            CONSTANTES.TipoDocPersonaPasarela.OTRAS.toString();
          numDocPasarela = datosUsuario.nroDocumento;
          break;
      }
    }

    // this.NDocumento = this.seguridadService.getNumDoc();
    // this.tipoDocumento = '1'; // PERSONA NATURAL POR DEFECTO, 6 => PERSONA JURIDICA

    const codigoProc = localStorage.getItem('tupa-codigo');
    const descProc = localStorage.getItem('tupa-nombre');

    this.TupaCodigo = tramiteSelected.codigo;
    this.TupaNombre = tramiteSelected.nombre;

    if (this.seguridadService.getNameId() === '00001') {
      this.tipoPersona = 'PERSONA NATURAL';
      this.tipoNombres = 'Nombre y Apellidos';
    } else if (this.seguridadService.getNameId() === '00002') {
      this.tipoPersona = 'PERSONA JURÍDICA';
      this.tipoNombres = 'Razón Social';
    } else {
      this.tipoPersona = 'PERSONA NATURAL CON RUC';
      this.tipoNombres = 'Nombre y Apellidos';
    }

    const model = {
      tramiteId,
      tramiteReqId,
      tramiteReqRefId,
      tipoDocumento: tipoDocPasarela,
      numeroDocumento: numDocPasarela,
      codigoProc,
      descProc,
    } as VoucherRequestModel;

    this.funcionesMtcService.mostrarCargando();
    this.tramiteService.putComprobarPago(model).subscribe(
      (response) => {
        console.log(response);
        if (response === 1) {
          this.funcionesMtcService.ocultarCargando();
          this.funcionesMtcService
            .mensajeOk(
              'El pago fue realizado correctamente, continúe con el registro de los requisitos'
            )
            .then(() => {
              this.route.navigate(['tramite-iniciado']);
            });
        } else {
          this.funcionesMtcService.ocultarCargando();
          this.funcionesMtcService
            .mensajeError(
              'El pago no fue realizado, continúe con el registro de los requisitos'
            )
            .then(() => {
              this.route.navigate(['tramite-iniciado']);
            });
        }
      },
      (error) => {
        this.funcionesMtcService.mensajeError('No se pudo finalizar el pago');
        this.funcionesMtcService.ocultarCargando();
        this.route.navigate(['tramite-iniciado']);
      }
    );
  }

  salir(): void {
    this.route.navigate(['/relacion-tupas']);
  }

  confirmarCrearSolicitud(): void {
    console.log(this.tipoSolicitudSeleccionado);
    //this.tramiteService
    //  .putGenerar({
    //    tupaId: this.TupaId,
    //    tipoPersona: this.tipoPersona,
    //    tipoDocumento: this.tipoDocumento,
    //    numeroDocumento: this.NDocumento,
    //    tipoSolicitud: {
    //      codigo: this.tipoSolicitudSeleccionado,
    //      descripcion: '',
    //    },
    //  } as TramiteRequestModel)
    //  .subscribe(
    //    (respuesta: ApiResponse<number>) => {
    //      console.log(respuesta);
    //      if (respuesta.success) {
    //        localStorage.setItem('tramite-id', respuesta.data.toString());
    //        this.route.navigate(['/tramite-iniciado']);
    //      }
    //    },
    //    (error) => {}
    //  );
  }
}
