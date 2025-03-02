import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { IncidenciaRequestModel } from 'src/app/core/models/Tramite/IncidenciaRequestModel';
import { ValidaVoucherResponseModel } from 'src/app/core/models/Tramite/ValidaVoucherResponseModel';
import { VoucherRequestModel } from 'src/app/core/models/Tramite/VoucherRequestModel';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { fileSizeValidator, requiredFileType, ValidateFileSize_Formulario } from 'src/app/helpers/file';
import { emailValidator, exactLengthValidator, noWhitespaceValidator, numberValidator } from 'src/app/helpers/validator';
import { UntypedFormBuilder, UntypedFormGroup, Validators, Validator, AbstractControl } from '@angular/forms';
import { ProcedimientoModel } from 'src/app/core/models/Tramite/ProcedimientoModel';
import { TipoSolicitudModel } from 'src/app/core/models/TipoSolicitudModel';
import { RequisitoModel } from 'src/app/core/models/Tramite/RequisitoModel';
import { ResponseComunModel } from 'src/app/core/models/Tramite/ResponseComunModel';

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
    private formBuilder: UntypedFormBuilder,
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





  openModal(content): void {
    this.modal = this.modalService.open(content, {
      size: 'lg',
      ariaLabelledBy: 'modal-basic-title',
    });
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

 

  iniciarTramite(): void {
    this.modalService.dismissAll();
    this.router.navigate(['/autenticacion/iniciar-sesion']);
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
