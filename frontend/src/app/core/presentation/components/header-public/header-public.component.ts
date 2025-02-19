import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { IncidenciaRequestModel } from 'src/app/core/models/Tramite/IncidenciaRequestModel';
import { ValidaVoucherResponseModel } from 'src/app/core/models/Tramite/ValidaVoucherResponseModel';
import { VoucherRequestModel } from 'src/app/core/models/Tramite/VoucherRequestModel';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { TramiteService } from 'src/app/core/services/tramite/tramite.service';
import { fileSizeValidator, requiredFileType, ValidateFileSize_Formulario } from 'src/app/helpers/file';
import { emailValidator, exactLengthValidator, noWhitespaceValidator, numberValidator } from 'src/app/helpers/validator';
import { UntypedFormBuilder, UntypedFormGroup, Validators, Validator, AbstractControl } from '@angular/forms';
import { ProcedimientoModel } from 'src/app/core/models/Tramite/ProcedimientoModel';
import { TipoSolicitudModel } from 'src/app/core/models/TipoSolicitudModel';
import { RequisitoModel } from 'src/app/core/models/Tramite/RequisitoModel';
import { ResponseComunModel } from 'src/app/core/models/Tramite/ResponseComunModel';
import { RelacionTupasService } from 'src/app/core/services/servicios/relacion-tupas.service';

@Component({
  selector: 'app-header-public',
  templateUrl: './header-public.component.html',
  styleUrls: ['./header-public.component.css']
})
export class HeaderPublicComponent implements OnInit {
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

  divAyuda = 'hidden';

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private funcionesMtcService: FuncionesMtcService,
    private tramiteService: TramiteService,
    private formBuilder: UntypedFormBuilder,
    private relacionTupasService: RelacionTupasService
  ) { }

  ngOnInit(): void {
    this.registroIncidenciaFG = this.formBuilder.group({
      rinNombresFC: ['', [Validators.required, noWhitespaceValidator(), Validators.pattern('[ A-zÀ-ú]*'), Validators.maxLength(240)]],
      rinDocIdentidadFC: ['', [Validators.required, exactLengthValidator([8, 11])]],
      rinCelularFC: ['', [Validators.required, exactLengthValidator([9])]],
      rinEmailFC: ['', [Validators.required, Validators.email, Validators.maxLength(240)]],
      rinDescripcionFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(240)]],
      rinFileAdjuntoFC: [null, [fileSizeValidator(0, 3145728), requiredFileType(['pdf', 'png', 'jpg', 'jpeg'])]]
    });
  }

  get rinNombresFC(): AbstractControl { return this.registroIncidenciaFG.get('rinNombresFC'); }
  get rinDocIdentidadFC(): AbstractControl { return this.registroIncidenciaFG.get('rinDocIdentidadFC'); }
  get rinCelularFC(): AbstractControl { return this.registroIncidenciaFG.get('rinCelularFC'); }
  get rinEmailFC(): AbstractControl { return this.registroIncidenciaFG.get('rinEmailFC'); }
  get rinDescripcionFC(): AbstractControl { return this.registroIncidenciaFG.get('rinDescripcionFC'); }
  get rinFileAdjuntoFC(): AbstractControl { return this.registroIncidenciaFG.get('rinFileAdjuntoFC'); }

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
      const response = await this.tramiteService
        .putVerificarVoucher<ResponseComunModel<string>>(objVoucherRequestModel)
        .toPromise();
      console.log(response);
      this.funcionesMtcService.ocultarCargando();
      if (response.success) {
        await this.funcionesMtcService.mensajeOk(response.message);
      } else {
        await this.funcionesMtcService.mensajeError(response.message);
      }
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

  async submitIncidencia(btnSubmit: HTMLButtonElement): Promise<void> {
    if (this.registroIncidenciaFG.invalid) {
      return;
    }
    btnSubmit.disabled = true;

    const formValue = this.registroIncidenciaFG.value;

    const ubicacionURL = this.router.url;
    const incidenciaRequestModel: IncidenciaRequestModel = {
      tupaId: null,
      ubicacionURL,
      procedimiento: null,
      descripcion: formValue.rinDescripcionFC.trim(),
      nombre: formValue.rinNombresFC.trim(),
      numeroDocumento: formValue.rinDocIdentidadFC.trim(),
      celular: formValue.rinCelularFC.trim(),
      correo: formValue.rinEmailFC.trim(),
      adjunto: formValue.rinFileAdjuntoFC
    };

    const incidenciaFormData = this.funcionesMtcService.jsonToFormData(
      incidenciaRequestModel
    );
    try {
      this.funcionesMtcService.mostrarCargando();
      const response = await this.tramiteService
        .postRegistrarIncidenciaOtro(incidenciaFormData)
        .toPromise();
      this.funcionesMtcService.ocultarCargando();
      if (response.success) {
        await this.funcionesMtcService.mensajeOk(response.message);
      } else {
        await this.funcionesMtcService.mensajeError(response.message);
      }
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

  openModal(content): void {
    this.modal = this.modalService.open(content, {
      size: 'lg',
      ariaLabelledBy: 'modal-basic-title',
    });
  }

  async openModalRequisitos(content: any, item: ProcedimientoModel): Promise<void> {
    this.funcionesMtcService.mostrarCargando();
    try {
      this.procedimientoSeleccionado = item;
      const tiposSolicitud = await this.relacionTupasService.getTiposSolicitud<Array<TipoSolicitudModel>>(item.id).toPromise();
      const requisitos = await this.relacionTupasService.getDetalleTupa<Array<RequisitoModel>>(item.id).toPromise();
      console.log('tiposSolicitud: ', tiposSolicitud);
      console.log('requisitos: ', requisitos);

      this.listadoTipoSolicitud = tiposSolicitud ?? [];

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
      this.listadoDetalleTupa = requisitos;
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
    let nuevoOrden = 0;
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
      this.listadoProcedimientos = await this.tramiteService.getProcedimientos('', '').toPromise();
      this.onChangeBuscarTupa();
    } catch (e) {
      this.funcionesMtcService.mensajeError('Error en el servicio de obtener los procedimientos');
    }
  }

  iniciarTramite(): void {
    this.modalService.dismissAll();
    this.router.navigate(['/autenticacion/iniciar-sesion']);
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
  //     error => {
  //       this.funcionesMtcService.mensajeError('No se pudo cargar los procedimientos');
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
}
