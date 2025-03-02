import { Component, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TipoSolicitudModel } from 'src/app/core/models/TipoSolicitudModel';
import { IncidenciaRequestModel } from 'src/app/core/models/Tramite/IncidenciaRequestModel';
import { ProcedimientoModel } from 'src/app/core/models/Tramite/ProcedimientoModel';
import { RequisitoModel } from 'src/app/core/models/Tramite/RequisitoModel';
import { ResponseComunModel } from 'src/app/core/models/Tramite/ResponseComunModel';
import { ValidaVoucherResponseModel } from 'src/app/core/models/Tramite/ValidaVoucherResponseModel';
import { VoucherRequestModel } from 'src/app/core/models/Tramite/VoucherRequestModel';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { SeguridadService } from 'src/app/core/services/seguridad.service';
import { fileSizeValidator, requiredFileType, ValidateFileSize_Formulario } from 'src/app/helpers/file';
import { noWhitespaceValidator, exactLengthValidator } from 'src/app/helpers/validator';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  razonSocial: string;

  registroIncidenciaFG: UntypedFormGroup;

  inpVPCodigoA: string;
  inpVPCodigoDia: string;
  inpVPCodigoMes: string;
  inpVPCodigoAnio: string;
  inpVPCodigoB: string;

  // listadoBase = [];
  // listadoFiltro = [];
  listSize = 1;
  page = 1;
  pageSize = 10;
  txtBuscarTupa = '';

  listadoProcedimientos: Array<ProcedimientoModel>;
  listadoProcedimientosFilter: Array<ProcedimientoModel>;

  listadoDetalleTupa: Array<RequisitoModel>;
  listadoDetalleTupaFilter: Array<RequisitoModel>;

  listadoTipoSolicitud: Array<TipoSolicitudModel>;
  tipoSolicitudModel: string;
  tipoSolicitudSeleccionado: TipoSolicitudModel;
  procedimientoSeleccionado: ProcedimientoModel;

  modal: NgbModalRef;

  isNavbarCollapsed = true;
  isMenuCollapsed = true;

  divAyuda = 'hidden';

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private funcionesMtcService: FuncionesMtcService,
    private seguridadService: SeguridadService,
    private formBuilder: UntypedFormBuilder,
  ) { }

  ngOnInit(): void {
    console.log(this.seguridadService.getUserName());

    this.razonSocial = this.seguridadService.getUserName();

    this.registroIncidenciaFG = this.formBuilder.group({
      rinProcedFC: ['', [noWhitespaceValidator(), Validators.maxLength(240)]],
      rinDescripcionFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(240)]],
      rinFileAdjuntoFC: [null, [fileSizeValidator(0, 3145728), requiredFileType(['pdf', 'png', 'jpg', 'jpeg'])]]
    });
  }

  get rinProcedFC(): AbstractControl { return this.registroIncidenciaFG.get('rinProcedFC'); }
  get rinDescripcionFC(): AbstractControl { return this.registroIncidenciaFG.get('rinDescripcionFC'); }
  get rinFileAdjuntoFC(): AbstractControl { return this.registroIncidenciaFG.get('rinFileAdjuntoFC'); }

  //get urlRecuperarPassCasilla(): string { return this.casillaService.getUrlRecuperarPass(); }

  async submitIncidencia(btnSubmit: HTMLButtonElement): Promise<void> {
    if (this.registroIncidenciaFG.invalid) {
      return;
    }
    btnSubmit.disabled = true;

    const formValue = this.registroIncidenciaFG.value;

    const ubicacionURL = this.router.url;
    const tupaId = Number(localStorage.getItem('tupa-id')) ?? null;
    const incidenciaRequestModel: IncidenciaRequestModel = {
      tupaId,
      ubicacionURL,
      procedimiento: formValue.rinProcedFC?.trim(),
      descripcion: formValue.rinDescripcionFC.trim(),
      nombre: null,
      numeroDocumento: null,
      celular: null,
      correo: null,
      adjunto: formValue.rinFileAdjuntoFC
    };
    const incidenciaFormData = this.funcionesMtcService.jsonToFormData(
      incidenciaRequestModel
    );
    try {
      this.funcionesMtcService.mostrarCargando();
      // const response = await this.tramiteService
      //   .postRegistrarIncidencia(incidenciaFormData)
      //   .toPromise();
      this.funcionesMtcService.ocultarCargando();
      // if (response.success) {
      //   await this.funcionesMtcService.mensajeOk(response.message);
      // } else {
      //   await this.funcionesMtcService.mensajeError(response.message);
      // }
    } catch (e) {
      console.log(e);
      this.funcionesMtcService.ocultarCargando();
      await this.funcionesMtcService.mensajeError(
        'No se pudo registrar la incidencia.'
      );
    } finally {
      this.registroIncidenciaFG.reset();
      this.modal.close();
    }
  }

  async validarVoucher(): Promise<void> {
    if (!this.inpVPCodigoA || this.inpVPCodigoA.trim().length === 0
      || !this.inpVPCodigoDia || this.inpVPCodigoDia.trim().length === 0
      || !this.inpVPCodigoMes || this.inpVPCodigoMes.trim().length === 0
      || !this.inpVPCodigoAnio || this.inpVPCodigoAnio.trim().length === 0
      || !this.inpVPCodigoB || this.inpVPCodigoB.trim().length === 0) {
      this.funcionesMtcService.mensajeError(
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

    this.funcionesMtcService.mostrarCargando();

    try {
      // const response = await this.tramiteService
      //   .putVerificarVoucher<ResponseComunModel<string>>(objVoucherRequestModel)
      //   .toPromise();
      //console.log(response);
      this.funcionesMtcService.ocultarCargando();
      // if (response.success) {
      //   await this.funcionesMtcService.mensajeOk(response.message);
      // } else {
      //   await this.funcionesMtcService.mensajeError(response.message);
      // }
    } catch (e) {
      console.log(e);
      this.funcionesMtcService.ocultarCargando();
      await this.funcionesMtcService.mensajeError(
        'No se pudo validar el voucher.'
      );
    } finally {
      this.inpVPCodigoA = '';
      this.inpVPCodigoDia = '';
      this.inpVPCodigoMes = '01';
      this.inpVPCodigoAnio = '';
      this.inpVPCodigoB = '';
      this.modal.close();
    }
  }

  openModal(content): void {
    this.modal = this.modalService.open(content, {
      size: 'lg',
      ariaLabelledBy: 'modal-basic-title',
    });
  }

  openModalLista(content): void {
    this.poblarProcedimientos();
    this.modal = this.modalService.open(content, {
      size: 'xl',
      ariaLabelledBy: 'modal-basic-title',
    });
  }

  openModalIncidencia(content): void {
    this.registroIncidenciaFG.reset();
    const URL = this.router.url;
    if (URL === '/tramite-iniciado') {
      const jsonString = localStorage.getItem('tramite-selected');
      if (jsonString) {
        const objTramite = JSON.parse(jsonString);
        if (objTramite) {
          this.rinProcedFC.setValue(objTramite.codigo + ' ' + objTramite.organizacion);
        }
      }
    }
    this.openModal(content);
  }

  openModalValVoucher(content): void {
    this.inpVPCodigoA = '';
    this.inpVPCodigoDia = '';
    this.inpVPCodigoMes = '01';
    this.inpVPCodigoAnio = '';
    this.inpVPCodigoB = '';

    this.openModal(content);
  }

  async openModalRequisitos(content: any, item: ProcedimientoModel): Promise<void> {
    this.funcionesMtcService.mostrarCargando();
    try {
      this.procedimientoSeleccionado = item;
      

   

      for (const tipoSol of this.listadoTipoSolicitud) {
        tipoSol.codigostr = tipoSol.codigo?.toString() ?? '';

        if (!tipoSol.tipoEvaluacion) {
          tipoSol.tipoEvaluacion = item.tipoEvaluacion;
          tipoSol.plazoAtencion = item.plazoDias;
        }
      }

      // Agregamos SIN TIPO DE SOLICITUD solo si no cuenta con TIPOS DE SOLICITUD
      if (this.listadoTipoSolicitud.length <= 0) {
        const tipoSolicitud = new TipoSolicitudModel();
        tipoSolicitud.codigostr = '';
        tipoSolicitud.descripcion = 'SIN TIPO DE SOLICITUD';
        tipoSolicitud.tipoEvaluacion = item.tipoEvaluacion;
        tipoSolicitud.plazoAtencion = item.plazoDias;
        this.listadoTipoSolicitud.unshift(tipoSolicitud);
      }

      this.tipoSolicitudSeleccionado = this.listadoTipoSolicitud[0];
      this.tipoSolicitudModel = this.tipoSolicitudSeleccionado.codigostr;

      this.listadoDetalleTupaFilter = this.listadoDetalleTupa.filter(r => r.tipoSolicitud === this.tipoSolicitudModel || !r.tipoSolicitud);
      this.calcularOrden();

      this.modalService.open(content, {
        size: 'xl',
        ariaLabelledBy: 'modal-basic-title',
      });
    } catch (error) {
      console.log(error);
      this.funcionesMtcService.mensajeError('Ocurrio un problema al obtener el listado de requisitos.');
    } finally {
      this.funcionesMtcService.ocultarCargando();
    }
  }

  onTipoSolicitudChange(value: string): void {
    if (value) {
      this.listadoDetalleTupaFilter = this.listadoDetalleTupa.filter(r => r.tipoSolicitud === value || !r.tipoSolicitud);
    } else {
      this.listadoDetalleTupaFilter = this.listadoDetalleTupa.filter(r => !r.tipoSolicitud);
    }
    this.calcularOrden();
    this.tipoSolicitudSeleccionado = this.listadoTipoSolicitud.filter(r => r.codigostr === value)[0];
  }

  calcularOrden(): void {
    let nuevoOrden: number = 0;
    for (const requisito of this.listadoDetalleTupaFilter) {
      const { auxOrden: orden } = requisito;
      if (nuevoOrden !== orden) {
        nuevoOrden = orden;
        requisito.ordenTxt = orden.toString();
      }
      else {
        requisito.ordenTxt = '';
      }
    }
  }

  async poblarProcedimientos(): Promise<void> {
    try {
      //this.listadoProcedimientos = await this.tramiteService.getProcedimientos('', '').toPromise();
      this.onChangeBuscarTupa();
    } catch (e) {
      this.funcionesMtcService.mensajeError('Error en el servicio de obtener los procedimientos');
    }
  }

  iniciarTramite(item: ProcedimientoModel): void {
    this.modalService.dismissAll();

    if (item.codigo === 'DGAT-011') {
      this.funcionesMtcService
        .mensajeWarnConfirmar(`Si presenta su solicitud de renovación antes de los 6 meses del vencimiento de su autorización,
         su solicitud será considerada como no presentada de conformidad al artículo 68º del Reglamento de la Ley de Radio y
         Televisión. Le sugerimos verifique la fecha de vencimiento de su autorización antes de presentar su solicitud`)
        .then(() => {
          this.crearTramite(item);
        });
    }
    else {
      this.crearTramite(item);
    }
  }

  private crearTramite(item: ProcedimientoModel): void {
    // Método de obtener datos del TUPA
   
    localStorage.setItem('tupa-id-sector', item.idSector.toString());
    localStorage.setItem('tupa-codigo', item.codigo);
    localStorage.setItem('tupa-nombre', item.nombre);
    localStorage.setItem('tupa-plazo', item.plazoDias.toString());
    localStorage.setItem('tupa-id', item.idTupa.toString());
    this.router.navigate(['/tramite-iniciar']);
  }

  // cargarLista(): void {
  //   this.funcionesMtcService.mostrarCargando();
  //   this.tramiteService.getListaTupas().subscribe(
  //     (resp: any) => {
  //       console.log(resp);
  //       this.funcionesMtcService.ocultarCargando();
  //       this.listadoBase = resp;
  //       this.listadoFiltro = resp;
  //       this.listaSize = resp.length;
  //     },
  //     (error) => {
  //       this.funcionesMtcService.mensajeError(
  //         'No se pudo cargar los procedimientos'
  //       );
  //       this.funcionesMtcService.ocultarCargando();
  //     }
  //   );
  // }

  onChangeBuscarTupa(): void {
    if (this.txtBuscarTupa) {
      this.listadoProcedimientosFilter = this.listadoProcedimientos
        .filter(x =>
          x.nombre.toUpperCase().includes(this.txtBuscarTupa.trim().toUpperCase())
          || x.codigo.toUpperCase().includes(this.txtBuscarTupa.trim().toUpperCase()));
      this.listSize = this.listadoProcedimientosFilter.length;
    } else {
      this.listadoProcedimientosFilter = this.listadoProcedimientos;
      this.listSize = this.listadoProcedimientos.length;
    }
  }

  cerrarSesion(event: any): void {
    event.preventDefault();

    this.seguridadService.postLogout();
    this.router.navigate(['/autenticacion/iniciar-sesion']);
  }

  gotoCasilla(event: any): void {
    event.preventDefault();
    //const urlIntegracionCasilla = this.casillaService.getUrlIntegracion();
    //const urlIntegracionCasilla = this.casillaService.getUrlLogin();
    //console.log('urlIntegracionCasilla: ', urlIntegracionCasilla);
    //window.location.href = urlIntegracionCasilla+"/#/auth/login?param="+sessionStorage.getItem("accessToken");
  }

  
}
