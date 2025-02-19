import { Component, Input, OnInit, inject, provideZoneChangeDetection } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Observable, catchError, map, of } from 'rxjs';
import { FormularioDIAResponse } from 'src/app/core/models/Formularios/FormularioMain';
import { ComboGenerico } from 'src/app/core/models/Maestros/ComboGenerico';
import { ArchivoAdjunto, FormularioSolicitudDIA, ParametrosPlanVigilancia, PlanVigilanciaAmbiental, PuntosMonitoreo } from 'src/app/core/models/Tramite/FormularioSolicitudDIA';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { ExternoService } from 'src/app/core/services/servicios/externo.service';
import { TramiteService } from 'src/app/core/services/tramite/tramite.service';
import { CONSTANTES } from 'src/app/enums/constants';
import { PuntosMonitoreoComponent } from 'src/app/modals/puntos-monitoreo/puntos-monitoreo.component';
import { IOption, TableColumn, TableRow } from 'src/app/shared/components/table/interfaces/table.interface';


@Component({
  selector: 'plan-vigilancia-ambiental-dialog',
  templateUrl: './plan-vigilancia-ambiental-dialog.component.html',
})
export class PlanVigilanciaAmbientalDialogComponent implements OnInit {
  form: FormGroup;
  selectedUnit: string = '';
  activeModal = inject(NgbActiveModal);
  openModal = inject(NgbModal);
  @Input() title!: string;
  @Input() data: FormularioSolicitudDIA;
  @Input() codMaeSolicitud: number;
  @Input() idCliente: number;
  @Input() idEstudio: number;
  @Input() modoVisualizacion: boolean;  
  @Input() codMaeRequisito: number;
  documentos: ArchivoAdjunto[] = [];
  PlanVigilanciaAmbiental: PlanVigilanciaAmbiental;
  PuntosMonitoreo: PuntosMonitoreo[] = [];

  listaZona: ComboGenerico[] = [];
  listaDatum: ComboGenerico[] = [];
  listaClaseMonitoreo: ComboGenerico[] = [];
  listaTipoMuestra: ComboGenerico[] = [];
  listaFrecuenciaMonitoreo: ComboGenerico[] = [];
  listaFrecuenciaReporte: ComboGenerico[] = [];
  showTipoDocumento: boolean = true;
  optsTipoDocumento: IOption[] = [];
  // -------------
  tableColumns621: TableColumn[] = [];
  tableData621: TableRow[] = [];
  estadoSolicitud: string;
  /****************************/


  constructor(
    private builder: FormBuilder,
    private externoService: ExternoService,
    private tramiteService: TramiteService,
    private funcionesMtcService: FuncionesMtcService
  ) { }

  ngOnInit(): void {
    this.buildForm();
    this.loadTableHeaders();
    this.getData();
    this.loadListas();
    this.gridTable();
    this.habilitarControles();
  }

  private loadTableHeaders() {
    this.tableColumns621 = [
      { header: 'CÓDIGO', field: 'Codigo', rowspan: 2, },
      { header: 'PARÁMETRO', field: 'Parametro', colspan: 3, isParentCol: true, },
      { header: 'NOMBRE', field: 'Nombre', isChildCol: true },
      { header: 'FRECUENCIA', field: 'Frecuencia', isChildCol: true },
      { header: 'REPORTE', field: 'Reporte', isChildCol: true },
      { header: 'COORDENADAS', field: 'Ubicacion', colspan: 4, isParentCol: true, },
      { header: 'ESTE', field: 'Este', isChildCol: true },
      { header: 'NORTE', field: 'Norte', isChildCol: true },
      { header: 'ZONA', field: 'Zona', isChildCol: true },
      { header: 'DATUM', field: 'Datum', isChildCol: true },  
      { header: 'CLASE', field: 'ubicacion', isParentCol: true, },
      { header: '(E/R)', field: 'ClaseMonitoreo', isChildCol: true },  
      { header: 'TIPO', field: 'tipo', isParentCol: true, },
      { header: '(L,S,G)', field: 'TipoMuestra', isChildCol: true },  
      { header: 'DESCRIPCIÓN DE LA UBICACIÓN', field: 'Descripcion', rowspan: 2,},
      { header: 'EDITAR', field: 'edit', rowspan: 2,hidden: this.modoVisualizacion  },
      { header: 'ELIMINAR', field: 'delete', rowspan: 2, hidden: this.modoVisualizacion },
      { header: 'VER', field: 'view', rowspan: 2, hidden: !this.modoVisualizacion },
    ];
  
  }

  get viewOnly() { return this.modoVisualizacion; }

  get viewControl() { return !this.modoVisualizacion; }

  habilitarControles() {
    if (this.viewOnly) {
      Object.keys(this.form.controls).forEach(controlName => {
        const control = this.form.get(controlName);
        control?.disable();
      });
    }else{
      if(!this.ver()) this.viewOnly;
    }
  }

  private buildForm(): void {
    this.form = this.builder.group({});
  }

  private getData(): void {
    this.funcionesMtcService.mostrarCargando();
    const codigoSolicitud = this.codMaeSolicitud;
    this.tramiteService.getFormularioDia(codigoSolicitud).subscribe(resp => {
      this.funcionesMtcService.ocultarCargando();
      if (resp.success) {
        this.data = JSON.parse(resp.data.dataJson);
        this.patchFormValues(this.data);
      }
    });

    const tramite = localStorage.getItem('tramite-selected');
    const tramiteObj = JSON.parse(tramite);
    this.estadoSolicitud = tramiteObj.estadoSolicitud; 
  }

  private patchFormValues(data: FormularioSolicitudDIA) {
    this.PuntosMonitoreo = data.PlanManejoAmbiental.PlanVigilanciaAmbiental.PuntosMonitoreo;
    this.documentos = data.PlanManejoAmbiental.PlanVigilanciaAmbiental.Documentos;
    this.gridTable();
  }
  

  save(form: FormGroup) {
    this.data.PlanManejoAmbiental.PlanVigilanciaAmbiental.PuntosMonitoreo = this.PuntosMonitoreo;
    this.data.PlanManejoAmbiental.PlanVigilanciaAmbiental.Documentos = this.documentos;
    this.data.PlanManejoAmbiental.PlanVigilanciaAmbiental.Save = true;
    this.data.PlanManejoAmbiental.PlanVigilanciaAmbiental.FechaRegistro = this.funcionesMtcService.dateNow();
    this.data.PlanManejoAmbiental.PlanVigilanciaAmbiental.State = this.validarFormularioSolicitudDIA(this.data);
    this.GuardarJson(this.data);
  }

  validarFormularioSolicitudDIA(formulario: FormularioSolicitudDIA): number {
    if(!this.data.PlanManejoAmbiental.PlanVigilanciaAmbiental.Save) return 0;
    if (!this.validatePlanVigilanciaAmbiental(formulario.PlanManejoAmbiental.PlanVigilanciaAmbiental)) return 1;
    return 2;
  }

  validatePlanVigilanciaAmbiental(plan: PlanVigilanciaAmbiental): boolean {
    // Validar que PuntosMonitoreo no esté vacío
    if (!plan.PuntosMonitoreo || plan.PuntosMonitoreo.length === 0) {
      return false;
    }
  
    // Validar que Documentos no esté vacío
    if (!plan.Documentos || plan.Documentos.length === 0) {
      return false;
    }

    // Validar cada punto de monitoreo
    for (let punto of plan.PuntosMonitoreo) {
      // Validar que Codigo no esté vacío
      if (!punto.Codigo.trim()) {
        return false;
      }
  
      // Validar que TipoMuestra no esté vacío
      if (!punto.TipoMuestra.trim()) {
        return false;
      }
  
      // Validar que ClaseMonitoreo no esté vacío
      if (!punto.ClaseMonitoreo.trim()) {
        return false;
      }
  
      // Validar que ZonaMuestreo no esté vacío
      if (!punto.ZonaMuestreo.trim()) {
        return false;
      }
  
      // Validar que TipoProcedencia no esté vacío
      if (!punto.TipoProcedencia.trim()) {
        return false;
      }
  
      // Validar que Descripcion no esté vacío
      if (!punto.Descripcion.trim()) {
        return false;
      }
  
      // Validar que Este no esté vacío
      if (!punto.Este.trim()) {
        return false;
      }
  
      // Validar que Norte no esté vacío
      if (!punto.Norte.trim()) {
        return false;
      }
  
      // Validar que Zona no esté vacío
      if (!punto.Zona.trim()) {
        return false;
      }
  
      // Validar que Datum no esté vacío
      if (!punto.Datum.trim()) {
        return false;
      }
  
      // Validar que Altitud no esté vacío
      if (!punto.Altitud.trim()) {
        return false;
      }
  
      // Validar que ParametrosPlanVigilancia no esté vacío
      if (!punto.ParametrosPlanVigilancia || punto.ParametrosPlanVigilancia.length === 0) {
        return false;
      }
  
      // Validar que documentos no esté vacío
      if (!punto.documentos || punto.documentos.length === 0) {
        return false;
      }
  
      // Validar cada parámetro dentro de ParametrosPlanVigilancia
      for (let parametro of punto.ParametrosPlanVigilancia) {
        // Validar que CodigoParametro no esté vacío
        if (!parametro.CodigoParametro.trim()) {
          return false;
        }
  
        // Validar que Parametro no esté vacío
        if (!parametro.Parametro.trim()) {
          return false;
        }
  
        // Validar que FrecuenciaMuestreo no esté vacío
        if (!parametro.FrecuenciaMuestreo.trim()) {
          return false;
        }
  
        // Validar que FrecuenciaReporte no esté vacío
        if (!parametro.FrecuenciaReporte.trim()) {
          return false;
        }
      }
    }
  
    return true;
  }

  private GuardarJson(data: FormularioSolicitudDIA) {
    const objeto: FormularioDIAResponse = {
      codMaeSolicitud: this.codMaeSolicitud,
      codMaeRequisito: this.codMaeRequisito,
      dataJson: JSON.stringify(data)
    };

    this.tramiteService.postGuardarFormulario(objeto).subscribe(resp => {
      this.funcionesMtcService.ocultarCargando();
      if (resp.success)
        this.funcionesMtcService.ocultarCargando().mensajeOk('Se grabó el formulario').then(() => this.closeDialog());
      else
        this.funcionesMtcService.ocultarCargando().mensajeError('No se grabó el formulario');
    });
  }

  closeDialog() {
    this.activeModal.dismiss();
  }

  agregarDocumento(item: ArchivoAdjunto) {//AttachButtonComponent - Documentos Adjuntos
    this.documentos.push(item);
  }

  actualizarDocumentos(documentos: ArchivoAdjunto[]) {
      this.documentos = documentos;
    }

  openModalPuntosMonitoreo(text?: string, row?: TableRow, esEdicion?: boolean) {
    const modalOptions: NgbModalOptions = {
      size: 'xl',
      centered: true,
      ariaLabelledBy: 'modal-basic-title',
    };
    const modalRef = this.openModal.open(PuntosMonitoreoComponent, modalOptions);
    modalRef.componentInstance.title = text || 'PUNTOS DE MONITOREO';
    modalRef.componentInstance.listaFrecuenciaMuestreo = this.listaFrecuenciaMonitoreo;
    modalRef.componentInstance.listaFrecuenciaReporte = this.listaFrecuenciaReporte;
    modalRef.componentInstance.edicion = esEdicion ? this.PuntosMonitoreo.find(x => x.Codigo === row.Codigo.text) : undefined;
    modalRef.componentInstance.modoVisualizacion = this.modoVisualizacion;
    modalRef.result.then(
      (result) => {// Maneja el resultado aquí
        this.PuntosMonitoreo.push(result);
        this.gridTable();
      },
      (reason) => {// Maneja la cancelación aquí
        console.log('Modal fue cerrado sin resultado:', reason);
      });
  };

  private gridTable() {
    const tabla: TableRow[] = this.PuntosMonitoreo.map(param => {
      const nombre = this.formatList(param.ParametrosPlanVigilancia, 'Parametro');
      const frecuencia = this.formatList(param.ParametrosPlanVigilancia, 'FrecuenciaMuestreo', this.listaFrecuenciaMonitoreo);
      const reporte = this.formatList(param.ParametrosPlanVigilancia, 'FrecuenciaReporte', this.listaFrecuenciaReporte);

      return {
        Codigo: { text: param.Codigo },
        Nombre: { htmlText: `<ul>${nombre}</ul>` },
        Frecuencia: { htmlText: `<ul>${frecuencia}</ul>` },
        Reporte: { htmlText: `<ul>${reporte}</ul>` },
        Este: { text: param.Este },
        Norte: { text: param.Norte },
        Zona: { text: this.findDescription(this.listaZona, param.Zona) },
        Datum: { text: this.findDescription(this.listaDatum, param.Datum) },
        ClaseMonitoreo: { text: this.findDescription(this.listaClaseMonitoreo, param.ClaseMonitoreo) },
        TipoMuestra: { text: this.findDescription(this.listaTipoMuestra, param.TipoMuestra) },
        Descripcion: { text: param.Descripcion },
        edit: { buttonIcon: 'add', onClick: (row: TableRow, column: TableColumn) => this.editRow(row) },
        delete: { buttonIcon: 'delete', onClick: (row: TableRow, column: TableColumn) => this.deleteRow(row) },
        view: { buttonIcon: 'search', onClick: (row: TableRow, column: TableColumn) => this.editRow(row) },
      };
    });

    this.tableData621 = tabla;
  }

  private editRow(row: TableRow) {
    this.openModalPuntosMonitoreo('PUNTOS DE MONITOREO', row, true);
  }

  private deleteRow(row: TableRow) {
    this.PuntosMonitoreo = this.PuntosMonitoreo.filter(x => x.Codigo !== row.Codigo.text);
    this.gridTable();
  }

  private formatList(parametros: ParametrosPlanVigilancia[], field: string, list?: ComboGenerico[]): string {
    return parametros.map(param => {
      const value = list ? list.find(x => x.codigo === parseInt(param[field]))?.descripcion || '' : param[field];
      return `<li>${value}</li>`;
    }).join('<br>');
  }

  private findDescription(list: ComboGenerico[], codigo: string): string {
    return list.find(x => x.codigo === parseInt(codigo))?.descripcion || '';
  }

  private loadListas() {
    this.comboGenerico(CONSTANTES.ComboGenericoFTAW.Zona).subscribe(response => this.listaZona = response);
    this.comboGenerico(CONSTANTES.ComboGenericoFTAW.Datum).subscribe(response => this.listaDatum = response);
    this.comboGenerico(CONSTANTES.ComboGenericoFTAW.ClaseMonitoreo).subscribe(response => this.listaClaseMonitoreo = response);
    this.comboGenerico(CONSTANTES.ComboGenericoFTAW.TipoMuestra).subscribe(response => this.listaTipoMuestra = response);
    this.comboGenerico(CONSTANTES.ComboGenericoFTAW.FrecuenciaMonitoreo).subscribe(response => this.listaFrecuenciaMonitoreo = response);
    this.comboGenerico(CONSTANTES.ComboGenericoFTAW.FrecuenciaReporte).subscribe(response => this.listaFrecuenciaReporte = response);
    this.comboGenericoEIAW(CONSTANTES.ComboGenericoEIAW.TipoDocumento).subscribe(response => {
      const options = response.map(({ codigo, descripcion }) => ({
        value: codigo.toString(),
        label: descripcion
      }));
      this.optsTipoDocumento.push(...options);
    });
  }

  private comboGenerico(tipo: string): Observable<ComboGenerico[]> {
    this.funcionesMtcService.mostrarCargando();
    return this.externoService.getComboGenerico(tipo).pipe(
      map(response => {
        this.funcionesMtcService.ocultarCargando();
        return response.success ? response.data : [];
      }),
      catchError(error => {
        this.funcionesMtcService.ocultarCargando();
        console.error('Error en la solicitud:', error);
        return of([]);
      })
    );
  }
  private comboGenericoEIAW(tipo: string): Observable<ComboGenerico[]> {
    this.funcionesMtcService.mostrarCargando();
    return this.externoService.getComboGenericoEiaw(tipo).pipe(
      map(response => {
        this.funcionesMtcService.ocultarCargando();
        return response.success ? response.data : [];
      }),
      catchError(error => {
        this.funcionesMtcService.ocultarCargando();
        console.error('Error en la solicitud:', error);
        return of([]);
      })
    );
  }

  ver(){
    if (this.estadoSolicitud !== 'EN PROCESO') {
    return true;
    }
    return false;
  }
}
