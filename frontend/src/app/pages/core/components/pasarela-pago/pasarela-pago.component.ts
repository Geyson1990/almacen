import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { PaginationModel } from 'src/app/core/models/Pagination';
import { SeguridadService } from 'src/app/core/services/seguridad.service';
import { TramiteService } from 'src/app/core/services/tramite/tramite.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { TramiteRequestModel } from 'src/app/core/models/Tramite/TramiteRequest';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { environment } from 'src/environments/environment';
import { VoucherRequestModel } from 'src/app/core/models/Tramite/VoucherRequestModel';
import Swal from 'sweetalert2';
import { VoucherAddResponseModel } from 'src/app/core/models/Tramite/VoucherAddResponseModel';
import { TupaModel } from 'src/app/core/models/Tramite/TupaModel';
import { TipoSolicitudModel } from 'src/app/core/models/TipoSolicitudModel';
import { DatosUsuarioLogin } from 'src/app/core/models/Autenticacion/DatosUsuarioLogin';
import { CONSTANTES } from '../../../../enums/constants';
import { ApiResponse } from 'src/app/core/models/api-response';

@Component({
    selector: 'app-pasarela-pago',
    templateUrl: './pasarela-pago.component.html',
    styleUrls: ['./pasarela-pago.component.css'],
})
export class PasarelaPagoComponent implements OnInit {
    listaTupas = [];
    page = 1;
    pageSize = 5;
    tipoPersona: string;
    tipoDocumento: string;
    NDocumento: string;
    Nombres: string;
    tipoNombres: string;
    UserId: string;
    datosUsuarioLogin: DatosUsuarioLogin;

    returnUrlPago = '';
    urlPago = '';
    pagosAdicionales = 0;

    tupa: TupaModel;
    TupaId: number;
    TupaCodigo: string;
    TupaNombre: string;
    TupaPlazo: string;
    listadoTipoSolicitud: TipoSolicitudModel[] = [];
    tipoSolicitudSeleccionado: any;
    tramiteSelected: TupaModel;

    listadoTupas = [];
    listadoTupasPrincipal = [];
    listadoTupasSize: any;
    listadoDetalleTupa = [];
    closeResult = '';

    codigoA: any;
    codigoDia: any;
    codigoMes: any;
    codigoAnio: any;
    codigoB: any;

    addCodigoA: string;
    addCodigoDia: string;
    addCodigoMes: string;
    addCodigoAnio: string;
    addCodigoB: string;
    listadoVoucherAdd: Array<VoucherAddResponseModel>;

    constructor(
        private seguridadService: SeguridadService,
        private tramiteService: TramiteService,
        private modalService: NgbModal,
        private funcionesMtcService: FuncionesMtcService,
        private route: Router
    ) {
        // this.refreshCountries({ page: this.page, pageSize: this.pageSize } as PaginationModel);
        this.datosUsuarioLogin = this.seguridadService.getDatosUsuarioLogin();
        console.log(this.datosUsuarioLogin);
    }

    ngOnInit(): void {
        this.returnUrlPago =
            `${environment.baseUrlExternalApp}` +
            `${environment.endPoint.uriReturnPago}`;
        this.urlPago = `${environment.endPoint.urlPasarelaPago}`;
        this.codigoMes = '01';
        this.addCodigoMes = '01';
        this.pagosAdicionales = Number(localStorage.getItem('tramite-pagos'));
        this.traerDatos();
    }

    irPasarelaPago(): void {
        const retrievedObject = localStorage.getItem('tramite-selected');
        let url = '';
        console.log(this.returnUrlPago);

        this.tramiteSelected = JSON.parse(retrievedObject);
        const tributo = localStorage.getItem('tramite-tributo');
        const codigoTupa =
            localStorage.getItem('tramite-clasificador') === ''
                ? this.tramiteSelected.codigo
                : localStorage.getItem('tramite-clasificador');

        let tipoDocPasarela: number;
        let numDocPasarela: string;

        const datosUsuario = this.seguridadService.getDatosUsuarioLogin();
        if (
            datosUsuario.tipoPersona ===
            CONSTANTES.CodTabTipoPersona.PERSONA_JURIDICA ||
            datosUsuario.tipoPersona ===
            CONSTANTES.CodTabTipoPersona.PERSONA_NATURAL_CON_RUC
        ) {
            tipoDocPasarela = CONSTANTES.TipoDocPersonaPasarela.RUC;
            numDocPasarela = datosUsuario.ruc;
        } else {
            switch (datosUsuario.tipoDocumento) {
                case CONSTANTES.TipoDocPersona.RUC:
                    tipoDocPasarela = CONSTANTES.TipoDocPersonaPasarela.RUC;
                    numDocPasarela = datosUsuario.ruc;
                    break;
                case CONSTANTES.TipoDocPersona.DNI:
                    tipoDocPasarela = CONSTANTES.TipoDocPersonaPasarela.DNI;
                    numDocPasarela = datosUsuario.nroDocumento;
                    break;
                case CONSTANTES.TipoDocPersona.CARNET_EXTRANJERIA:
                    tipoDocPasarela =
                        CONSTANTES.TipoDocPersonaPasarela.CARNET_EXTRANJERIA;
                    numDocPasarela = datosUsuario.nroDocumento;
                    break;
                case CONSTANTES.TipoDocPersona.PASAPORTE:
                    tipoDocPasarela = CONSTANTES.TipoDocPersonaPasarela.PASAPORTE;
                    numDocPasarela = datosUsuario.nroDocumento;
                    break;
                case CONSTANTES.TipoDocPersona.CARNET_IDENTIFICACION:
                    tipoDocPasarela =
                        CONSTANTES.TipoDocPersonaPasarela.CEDULA_DIPLOMATICA_IDENTIDAD;
                    numDocPasarela = datosUsuario.nroDocumento;
                    break;
                default:
                    tipoDocPasarela = CONSTANTES.TipoDocPersonaPasarela.OTRAS;
                    numDocPasarela = datosUsuario.nroDocumento;
                    break;
            }
        }

        url =
            this.urlPago +
            '?cTupa=' +
            codigoTupa +
            '&cTrib=' +
            tributo +
            '&tDoc=' +
            tipoDocPasarela + // Number(this.tipoDocumento) +
            '&nDoc=' +
            numDocPasarela.toString() + // this.NDocumento +
            '&nom=' +
            this.Nombres +
            '&url=' +
            this.returnUrlPago;

        console.log(url);
        if (tributo === '') {
            this.funcionesMtcService.mensajeError(
                'EL SERVICIO DE PAGO EN LÍNEA NO ESTÁ PARA ESTE PROCEDIMIENTO.'
            );
        } else if (tributo === '0000') {
            this.funcionesMtcService.mensajeError(
                'EL SERVICIO DE PAGO EN LÍNEA ESTÁ EN PROCESO DE IMPLEMENTACIÓN CON EL BANCO DE LA NACIÓN.'
            );
        } else {
            window.open(url, '_self');
        }
    }

    regresar(): void {
        this.route.navigate(['tramite-iniciado']);
    }

    cantPagosPendientesAdd(): number {
        return (
            (this.pagosAdicionales ?? 1) - 1 - (this.listadoVoucherAdd?.length ?? 0)
        );
    }

    pagosPendientesAdd(): boolean {
        return this.cantPagosPendientesAdd() > 0;
    }

    validarVoucher(): void {

        this.funcionesMtcService.mostrarCargando();
        // if (this.cantPagosPendientesAdd() > 0) {
        //     this.funcionesMtcService.mensajeError(
        //         'Primero debe realizar la validación de ' +
        //         this.cantPagosPendientesAdd() +
        //         ' voucher(s) adicional(es), para continuar.'
        //     );
        //     return;
        // }

        const retrievedObject = localStorage.getItem('tramite-selected');
        const tramiteId = localStorage.getItem('tramite-id');
        const tramiteReqId = localStorage.getItem('tramite-req-id');
        const tramiteReqRefId = localStorage.getItem('tramite-req-ref-id');
        const codTributo = localStorage.getItem('tramite-tributo');
        const tramiteCosto = localStorage.getItem('tramite-costo');

        const codigoProc = localStorage.getItem('tupa-codigo');
        const descProc = localStorage.getItem('tupa-nombre');

        this.tramiteSelected = JSON.parse(retrievedObject);
        const objVoucherRequestModel: VoucherRequestModel = {
            tramiteId,
            tramiteReqId,
            tramiteReqRefId,
            tipoDocumento: this.tipoDocumento,
            numeroDocumento: this.NDocumento,
            codigoTributo: codTributo,
            numeroSecuencia: this.codigoA,
            fechaMovimiento:
                this.codigoAnio +
                '-' +
                this.codigoMes +
                '-' +
                this.codigoDia +
                'T00:00:00.000Z',
            codigoOficina: this.codigoB,
            total: Number(tramiteCosto),
            codigoUsuario: String(this.UserId),
            codigoProc,
            descProc,
        };

        console.log(objVoucherRequestModel);

        this.funcionesMtcService.ocultarCargando();
        this.funcionesMtcService
                .mensajeOk(`El voucher fue validado exitosamente.`)
                .then(() => {
                    this.route.navigate(['tramite-iniciado']);
                });
        // this.tramiteService.putComprobarVoucher(objVoucherRequestModel).subscribe(
        //     (response) => {
        //         this.funcionesMtcService
        //         .mensajeOk(`El voucher fue validado exitosamente.`)
        //         .then(() => {
        //             this.route.navigate(['tramite-iniciado']);
        //         });
        //         // console.log(response);
        //         // this.funcionesMtcService.ocultarCargando();
        //         // if (response === -1) {
        //         //     this.funcionesMtcService
        //         //         .mensajeError(`El voucher no ha sido encontrado.`)
        //         //         .then(() => {
        //         //             this.route.navigate(['pasarela-pago']);
        //         //         });
        //         // } else if (response === 0) {
        //         //     this.funcionesMtcService
        //         //         .mensajeError(
        //         //             `El voucher ya ha sido utilizado en otra transacción. Consulte la bandeja "Mis trámites"`
        //         //         )
        //         //         .then(() => {
        //         //             this.route.navigate(['pasarela-pago']);
        //         //         });
        //         // } else if (response === -2) {
        //         //     this.funcionesMtcService
        //         //         .mensajeError(
        //         //             `El número de documento con el que se registró el voucher no coincide con el de su perfil.`
        //         //         )
        //         //         .then(() => {
        //         //             this.route.navigate(['pasarela-pago']);
        //         //         });
        //         // } else if (response === -3) {
        //         //     this.funcionesMtcService
        //         //         .mensajeError(
        //         //             `El monto del voucher no coincide con el del tributo.`
        //         //         )
        //         //         .then(() => {
        //         //             this.route.navigate(['pasarela-pago']);
        //         //         });
        //         // } else if (response === -4) {
        //         //     this.funcionesMtcService
        //         //         .mensajeError(
        //         //             `La fecha del voucher no está permitido. Contáctese con nosotros.`
        //         //         )
        //         //         .then(() => {
        //         //             this.route.navigate(['pasarela-pago']);
        //         //         });
        //         // } else if (response === -5) {
        //         //     this.funcionesMtcService
        //         //         .mensajeError(`No se pudo encontrar el requisito de pago.`)
        //         //         .then(() => {
        //         //             this.route.navigate(['pasarela-pago']);
        //         //         });
        //         // } else {
        //         //     this.funcionesMtcService
        //         //         .mensajeOk(`El voucher fue validado exitosamente.`)
        //         //         .then(() => {
        //         //             this.route.navigate(['tramite-iniciado']);
        //         //         });
        //         // }
        //     },
        //     (error) => {
        //         this.funcionesMtcService.ocultarCargando();
        //         this.funcionesMtcService
        //             .mensajeError('No se pudo validar el voucher.')
        //             .then(() => {
        //                 this.route.navigate(['pasarela-pago']);
        //             });
        //     }
        // );
    }

    validarVoucherAdicional(): void {
        const tramiteId = localStorage.getItem('tramite-id');
        const tramiteReqId = localStorage.getItem('tramite-req-id');
        const tramiteReqRefId = localStorage.getItem('tramite-req-ref-id');
        const codTributo = localStorage.getItem('tramite-tributo');
        const montoAdicional = localStorage.getItem('tramite-montoadd');

        const codigoProc = localStorage.getItem('tupa-codigo');
        const descProc = localStorage.getItem('tupa-nombre');

        const objVoucherRequestModel: VoucherRequestModel = {
            tramiteId,
            tramiteReqId,
            tramiteReqRefId,
            tipoDocumento: this.tipoDocumento,
            numeroDocumento: this.NDocumento,
            codigoTributo: codTributo,
            numeroSecuencia: this.addCodigoA,
            fechaMovimiento:
                this.addCodigoAnio +
                '-' +
                this.addCodigoMes +
                '-' +
                this.addCodigoDia +
                'T00:00:00.000Z',
            codigoOficina: this.addCodigoB,
            total: Number(montoAdicional),
            codigoUsuario: String(this.UserId),
            codigoProc,
            descProc,
        };

        this.funcionesMtcService.mostrarCargando();
        this.tramiteService
            .putComprobarVoucherAdd(objVoucherRequestModel)
            .subscribe(
                (response) => {
                    console.log(response);
                    this.funcionesMtcService.ocultarCargando();
                    if (response === -1) {
                        this.funcionesMtcService
                            .mensajeError(`El voucher no ha sido encontrado.`)
                            .then(() => {
                                this.route.navigate(['pasarela-pago']);
                            });
                    } else if (response === 0) {
                        this.funcionesMtcService
                            .mensajeError(
                                `El voucher ya ha sido utilizado en otra transacción. Consulte la bandeja "Mis trámites".`
                            )
                            .then(() => {
                                this.route.navigate(['pasarela-pago']);
                            });
                    } else if (response === -2) {
                        this.funcionesMtcService
                            .mensajeError(
                                `El número de documento con el que se registró el voucher no coincide con el de su perfil.`
                            )
                            .then(() => {
                                this.route.navigate(['pasarela-pago']);
                            });
                    } else if (response === -3) {
                        this.funcionesMtcService
                            .mensajeError(
                                `El monto del voucher no coincide con el del tributo.`
                            )
                            .then(() => {
                                this.route.navigate(['pasarela-pago']);
                            });
                    } else if (response === -4) {
                        this.funcionesMtcService
                            .mensajeError(
                                `La fecha del voucher no está permitido. Contáctese con nosotros.`
                            )
                            .then(() => {
                                this.route.navigate(['pasarela-pago']);
                            });
                    } else if (response === -5) {
                        this.funcionesMtcService
                            .mensajeError(
                                `No se pudo encontrar la cantidad de pagos adicionales para el trámite.`
                            )
                            .then(() => {
                                this.route.navigate(['pasarela-pago']);
                            });
                    } else {
                        this.funcionesMtcService.mensajeOk(
                            `El voucher fue validado exitosamente.`
                        );
                        // MOSYTRA LA TABLA DE VOUCHERS ADICIONALES
                        this.addCodigoA = '';
                        this.addCodigoAnio = '';
                        this.addCodigoMes = '01';
                        this.addCodigoDia = '';
                        this.addCodigoB = '';
                        this.traerListadoVoucherAdd();
                    }
                },
                (error) => {
                    this.funcionesMtcService.ocultarCargando();
                    this.funcionesMtcService.mensajeError(
                        'No se pudo validar el voucher.'
                    );
                }
            );
    }

    traerListadoVoucherAdd(): void {
        const tramiteReqRefId = Number(localStorage.getItem('tramite-req-ref-id'));

        this.tramiteService
            .getObtenerPagosAdd(tramiteReqRefId)
            .subscribe((resp: Array<VoucherAddResponseModel>) => {
                this.listadoVoucherAdd = resp;
                console.log(resp);
            });
    }

    eliminarVoucherAdd(
        tramiteReqRefId: number,
        tasaId: number,
        voucher: string
    ): void {
        this.funcionesMtcService
            .mensajeConfirmar(`¿Está seguro de eliminar el voucher adicional? \n`)
            .then(() => {
                console.log('Eliminar voucher adicional: ' + tramiteReqRefId);

                this.funcionesMtcService.mostrarCargando();
                this.tramiteService
                    .putEliminarPagoAdd(tramiteReqRefId, tasaId, voucher)
                    .subscribe(
                        (resp) => {
                            if (resp === 1) {
                                this.traerListadoVoucherAdd();
                            } else {
                                this.funcionesMtcService.mensajeError(
                                    'No se eliminó el voucher seleccionado'
                                );
                            }
                        },
                        (error) => {
                            this.funcionesMtcService.mensajeError(
                                'Ocurrió un problema tratar de eliminar el voucher'
                            );
                        },
                        () => this.funcionesMtcService.ocultarCargando()
                    );
            });
    }

    traerDatos(): void {
        //this.TupaId = Number(localStorage.getItem('tupa-id'));
        this.TupaCodigo = localStorage.getItem('tupa-codigo');

        this.tramiteService.getTupaByCode(this.TupaCodigo).subscribe((resp: ApiResponse<TupaModel>) => {
            this.tupa = resp.data;
            console.log(resp);
            localStorage.setItem('tramite-selected', JSON.stringify(this.tupa));
            this.TupaCodigo = this.tupa.codigo;
            this.TupaNombre = this.tupa.denominacion;
            this.TupaPlazo =
                this.tupa.plazo === 0
                    ? 'DETERMINADO'
                    : this.tupa.plazo + ' DÍAS HÁBILES';
            this.listadoTipoSolicitud = this.tupa.tipoSolicitud;
            if (this.listadoTipoSolicitud != null) {
                this.tipoSolicitudSeleccionado = this.listadoTipoSolicitud[0].codigo;
            }
        });

        this.NDocumento = this.seguridadService.getNumDoc();
        this.Nombres = this.seguridadService.getUserName();
        this.UserId = this.seguridadService.getUserId();
        this.tipoDocumento = this.seguridadService.getNameId();

        if (this.seguridadService.getNameId() === '00001') {
            this.tipoPersona = 'PERSONA NATURAL';
            this.tipoNombres = 'Solicitante';
        } else if (this.seguridadService.getNameId() === '00002') {
            this.tipoPersona = 'PERSONA JURÍDICA';
            this.tipoNombres = 'Solicitante';
            this.NDocumento = this.seguridadService.getCompanyCode();
        } else if (this.seguridadService.getNameId() === '00004') {
            this.tipoPersona = 'PERSONA EXTRANJERA';
            this.tipoNombres = 'Solicitante';
        } else {
            this.tipoPersona = 'PERSONA NATURAL CON RUC';
            this.tipoNombres = 'Solicitante';
        }

        this.traerListadoVoucherAdd();
    }

    openModalAdicional(content): void {
        this.traerListadoVoucherAdd();
        this.modalService.open(content, {
            size: 'lg',
            ariaLabelledBy: 'modal-basic-title',
            backdrop: 'static',
            keyboard: false,
        });
    }
}
