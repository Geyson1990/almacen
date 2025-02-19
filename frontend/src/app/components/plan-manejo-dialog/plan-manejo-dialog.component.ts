import { Component, Input, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Observable, catchError, map, of } from 'rxjs';
import { FormularioDIAResponse } from 'src/app/core/models/Formularios/FormularioMain';
import { ComboGenerico } from 'src/app/core/models/Maestros/ComboGenerico';
import { FormularioSolicitudDIA, PlanManejo } from 'src/app/core/models/Tramite/FormularioSolicitudDIA';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { ExternoService } from 'src/app/core/services/servicios/externo.service';
import { TramiteService } from 'src/app/core/services/tramite/tramite.service';
import { CONSTANTES } from 'src/app/enums/constants';
import { EstudiosInvestigacionesComponent } from 'src/app/modals/estudios-investigaciones/estudios-investigaciones.component';
import { PlanManejoComponent } from 'src/app/modals/plan-manejo/plan-manejo.component';
import { TableColumn, TableRow } from 'src/app/shared/components/table/interfaces/table.interface';

@Component({
  selector: 'plan-manejo-dialog',
  templateUrl: './plan-manejo-dialog.component.html',
})
export class PlanManejoDialog {
  form: FormGroup;
  selectedUnit: string = '';
  activeModal = inject(NgbActiveModal);
  openModal = inject(NgbModal);
  planManejo: PlanManejo[] = [];
  etapaFase: ComboGenerico[] = [];

  data: FormularioSolicitudDIA;
  @Input() title!: string;
  @Input() codMaeSolicitud: number;
  @Input() idCliente: number;
  @Input() idEstudio: number;
  @Input() modoVisualizacion: boolean;
  @Input() codMaeRequisito: number;

  // -------4.PARTICIPACIÓN CIUDADANA
  
  tableColumns41: TableColumn[] = [];
  tableData41: TableRow[] = [];
  estadoSolicitud: string;
  /****************************/

  constructor(
    private builder: FormBuilder,
    private tramiteService: TramiteService,
    private funcionesMtcService: FuncionesMtcService,
    private externoService: ExternoService
  ) { }

  async ngOnInit(): Promise<void> {
    this.buildForm();
    this.loadTableHeaders();
    await this.loadCombos();
    await this.getData();
    this.habilitarControles();
  }

  private loadTableHeaders(){
    this.tableColumns41 = [
      { header: 'CODIGO', field: 'Codigo', hidden: true},
      { header: 'ETAPA O FASE', field: 'Etapa', },
      { header: 'MEDIDAS DE MANEJO AMBIENTAL', field: 'Medidas', },
      { header: 'RIESGOS/IMPACTO/ASPECTOS DEL PROYECTO EN LOS QUE SE ENFOCAN LAS MEDIDAS DE PREVENCION, CORRECCION', field: 'Riesgos', },
      { header: 'EDITAR', field: 'edit', hidden: this.modoVisualizacion },
      { header: 'ELIMINAR', field: 'delete', hidden: this.modoVisualizacion },
      { header: 'VER', field: 'view', hidden: !this.modoVisualizacion },
    ];
  }

  get viewOnly() { return this.modoVisualizacion; }

  get viewControl() { return !this.modoVisualizacion; }

  habilitarControles() {
    if (this.viewOnly) {
      if(this.form !== undefined)
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

  private patchFormValues(data: FormularioSolicitudDIA): void {
    this.planManejo = data.PlanManejoAmbiental?.PlanManejo || [];
    this.fnGridTable(this.planManejo);
  }

  private async loadCombos(): Promise<void> {
    (await this.comboGenerico(CONSTANTES.ComboGenericoDIAW.EtapaFase)).subscribe(response => this.etapaFase = response);
  }

  private async comboGenerico(tipo: string): Promise<Observable<ComboGenerico[]>> {
    this.funcionesMtcService.mostrarCargando();
    return await this.externoService.getComboGenericoDiaw(tipo).pipe(
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

  closeDialog() {
    this.activeModal.dismiss();
  }

  openModalPlanManejoAmbiental(esEdicion?:boolean, row?:TableRow) {
    const text:string = 'PLAN DE MANEJO AMBIENTAL';
    const modalOptions: NgbModalOptions = {
      size: 'md',
      centered: true,
      ariaLabelledBy: 'modal-basic-title',
    };
    const modalRef = this.openModal.open(PlanManejoComponent, modalOptions);
    modalRef.componentInstance.title = text;
    modalRef.componentInstance.etapaFase = this.etapaFase;
    modalRef.componentInstance.edicion = esEdicion ? this.planManejo.find(x => x.Etapa === row.Codigo.text) : undefined;
    modalRef.componentInstance.codMaeSolicitud = this.codMaeSolicitud;
    modalRef.componentInstance.modoVisualizacion = this.modoVisualizacion;
    modalRef.componentInstance.idCliente = this.idCliente;
    modalRef.componentInstance.idEstudio = this.idEstudio;
    modalRef.result.then(
      (result) => {// Maneja el resultado aquí
        if(esEdicion)
          this.planManejo = this.planManejo.filter(x=>x.Etapa !== row.Codigo.text)
        
        this.planManejo.push(result);
        this.fnGridTable(this.planManejo);
      },
      (reason) => {// Maneja la cancelación aquí
        console.log('Modal fue cerrado sin resultado:', reason);
      });
  };

  save(form: FormGroup) {
    this.data.PlanManejoAmbiental.PlanManejo = this.planManejo || [];
    this.data.PlanManejoAmbiental.Save = true;
    this.data.PlanManejoAmbiental.FechaRegistro = this.funcionesMtcService.dateNow();
    this.data.PlanManejoAmbiental.StatePlanManejo = this.validarFormularioSolicitudDIA(this.data);
    // this.activeModal.close(this.planManejo);
    this.GuardarJson(this.data);
  }

  validatePlanmanejo(planManejo: PlanManejo[]): boolean {     
    // Validar que Documentos contenga al menos un documento
    if (!planManejo || planManejo.length === 0) {
      return false;
    }     
  
    return true;
  }

  validarFormularioSolicitudDIA(formulario: FormularioSolicitudDIA): number {
    if(!this.data.PlanManejoAmbiental.Save) return 0;
    if (!this.validatePlanmanejo(formulario.PlanManejoAmbiental.PlanManejo)) return 1;
    return 2;
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

  private fnGridTable(data: PlanManejo[]) {    
    const tabla: TableRow[] = data.map(param => {
      return {
        Codigo:{ text: param.Etapa.toString() },
        Etapa: { text: this.findDescription(this.etapaFase, param.Etapa) },
        Medidas: { text: param.Medidas},
        Riesgos: { text: param.Riesgos },        
        edit: { buttonIcon: 'edit', onClick: (row: TableRow) => this.fnEditar(row) },  
        delete: { buttonIcon: 'delete', onClick: (row: TableRow) => this.fnEliminar(row) },
        view: { buttonIcon: 'search', onClick: (row: TableRow) => this.fnEditar(row) },
      };
    });

    this.tableData41 = tabla;
  }

  private findDescription(list: ComboGenerico[], codigo: string): string {
    return list.find(x => x.codigo === parseInt(codigo))?.descripcion || '';
  }



  private fnEditar(row?: TableRow){
    this.openModalPlanManejoAmbiental(true, row);
  }

  private fnEliminar(row?: TableRow){
    this.planManejo = this.planManejo.filter(x => x.Etapa !== row.Codigo.text);
    this.fnGridTable(this.planManejo);
  }

  ver(){
    if (this.estadoSolicitud !== 'EN PROCESO') {
    return true;
    }
    return false;
  }
}
