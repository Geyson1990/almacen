import { Component, Input, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Observable, catchError, map, of } from 'rxjs';
import { FormularioDIAResponse } from 'src/app/core/models/Formularios/FormularioMain';
import { ComboGenerico, ComboGenericoString } from 'src/app/core/models/Maestros/ComboGenerico';
import { ArchivoAdjunto, Compromisos, FormularioSolicitudDIA, Resumen } from 'src/app/core/models/Tramite/FormularioSolicitudDIA';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { ExternoService } from 'src/app/core/services/servicios/externo.service';
import { TramiteService } from 'src/app/core/services/tramite/tramite.service';
import { CONSTANTES } from 'src/app/enums/constants';
import { CuadroResumenAmbientalComponent } from 'src/app/modals/cuadro-resumen-ambiental/cuadro-resumen-ambiental.component';
import { IOption,TableColumn, TableRow } from 'src/app/shared/components/table/interfaces/table.interface';

@Component({
  selector: 'cuadro-resumen-contenido-ambientales-dialog',
  templateUrl: './cuadro-resumen-contenido-ambientales-dialog.component.html',
})
export class CuadroResumenContenidoAmbientalesDialogComponent implements OnInit {
  form: FormGroup;
  activeModal = inject(NgbActiveModal);
  openModal = inject(NgbModal);
  @Input() title!: string;
  @Input() codMaeSolicitud: number;
  @Input() idCliente: number;
  @Input() idEstudio: number;
  @Input() modoVisualizacion: boolean;
  @Input() codMaeRequisito: number;

  data: FormularioSolicitudDIA;
  montoTotal: string = '0';
  compromisos: Compromisos[] = [];
  documentos: ArchivoAdjunto[] = [];
  etapa: ComboGenerico[] = [];
  tipoActividad: ComboGenerico[] = [];
  tipoMoneda: ComboGenericoString[] = [];
  showTipoDocumento: boolean = true;
  optsTipoDocumento: IOption[] = [];
  estadoSolicitud: string;

  constructor(
    private builder: FormBuilder,
    private tramiteService: TramiteService,
    private funcionesMtcService: FuncionesMtcService,
    private externoService: ExternoService
  ) { }

  async ngOnInit(): Promise<void> {
    this.buildForm();
    await this.loadCombos();
    await this.getData();
    this.habilitarControles();
  }

   //#region ViewOnly
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
   //#endregion ViewOnly

  private buildForm(): void {
    this.form = this.builder.group({
      UnidadMonetaria: [null, Validators.required]
    });
  }

  private async getData(): Promise<void> {
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

  closeDialog() {
    this.activeModal.dismiss();
  }

  private patchFormValues(data: FormularioSolicitudDIA): void {
    this.compromisos = data.PlanManejoAmbiental?.Resumen?.Compromisos || [];
    this.documentos = data.PlanManejoAmbiental?.Resumen?.Documentos || [];
    this.montoTotal = this.data.PlanManejoAmbiental?.Resumen?.MontoInversion;
    this.form.controls['UnidadMonetaria'].setValue(this.data.PlanManejoAmbiental?.Resumen?.UnidadMonetaria); 
  }

  openDialog(data?: Compromisos) {
    const modalOptions: NgbModalOptions = {
      ariaLabelledBy: 'modal-basic-title',
      scrollable: true
    };
    const modalRef = this.openModal.open(CuadroResumenAmbientalComponent, modalOptions);
    modalRef.componentInstance.title = 'PLAN DE MANEJO AMBIENTAL';
    modalRef.componentInstance.tipoActividad = this.tipoActividad;
    modalRef.componentInstance.etapa = this.etapa;
    modalRef.componentInstance.edicion = data;
    modalRef.componentInstance.codMaeSolicitud = this.codMaeSolicitud;
    modalRef.componentInstance.modoVisualizacion = this.modoVisualizacion;
    modalRef.componentInstance.idCliente = this.idCliente;
    modalRef.componentInstance.idEstudio = this.idEstudio;
    modalRef.result.then(
      (result) => {// Maneja el resultado aquí
        
        if(data){
          this.compromisos = this.compromisos.filter(x=>x.Etapas!==data.Etapas);
        }
      
        this.compromisos.push(result);
        let sumaTotal = this.sumarCostoEstimado(this.compromisos);
        this.montoTotal = sumaTotal.toString();
      },
      (reason) => {// Maneja la cancelación aquí
        console.log('Modal fue cerrado sin resultado:', reason);
      });
  }

  sumarCostoEstimado(lista: Compromisos[]): number {
    return lista.reduce((sum, item) => {
      return sum + parseFloat(item.CostoEstimado);
    }, 0);
  }

  private async loadCombos(): Promise<void> {
    (await this.comboGenerico(CONSTANTES.ComboGenericoDIAW.Etapa)).subscribe(response => this.etapa = response);
    (await this.comboGenerico(CONSTANTES.ComboGenericoDIAW.TipoActividad)).subscribe(response => this.tipoActividad = response);
    (await this.comboGenericoString(CONSTANTES.ComboGenericoDIAW.TipoMoneda)).subscribe(response => this.tipoMoneda = response);
    this.comboGenericoEIAW(CONSTANTES.ComboGenericoEIAW.TipoDocumento).subscribe(response => {
      const options = response.map(({ codigo, descripcion }) => ({
        value: codigo.toString(),
        label: descripcion
      }));
      this.optsTipoDocumento.push(...options);
    });
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

  private async comboGenericoString(tipo: string): Promise<Observable<ComboGenericoString[]>> {
    this.funcionesMtcService.mostrarCargando();
    return await this.externoService.getComboGenericoStringDiaw(tipo).pipe(
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
  save(form: FormGroup) {
    this.data.PlanManejoAmbiental.Resumen.MontoInversion = this.montoTotal || "0";
    this.data.PlanManejoAmbiental.Resumen.UnidadMonetaria = this.form.controls['UnidadMonetaria'].value || "";
    this.data.PlanManejoAmbiental.Resumen.Compromisos = this.compromisos || [];
    this.data.PlanManejoAmbiental.Resumen.Documentos = this.documentos || [];
    this.data.PlanManejoAmbiental.Resumen.Save = true;
    this.data.PlanManejoAmbiental.Resumen.FechaRegistro = this.funcionesMtcService.dateNow();
    //  this.activeModal.close(this.data.PlanManejoAmbiental.Resumen);
    this.data.PlanManejoAmbiental.Resumen.State = this.validarFormularioSolicitudDIA(this.data);
    this.GuardarJson(this.data);
  }

  validateResumen(resumen: Resumen): boolean {
    // Validar que Compromisos no esté vacío y que cada compromiso tenga todos sus campos llenos
    if (!resumen.Compromisos || resumen.Compromisos.length === 0) {
      console.error("Debe haber al menos un compromiso registrado.");
      return false;
    }
  
    for (let compromiso of resumen.Compromisos) {
      if (!compromiso.Descripcion.trim() || !compromiso.Etapas.trim() || !compromiso.TipoActividad.trim() || !compromiso.CostoEstimado.trim() || !compromiso.Tecnologia.trim()) {
        console.error("Cada compromiso debe tener todos los campos llenos.");
        return false;
      }
    }
  
    // Validar que MontoInversion no esté vacío
    if (!resumen.MontoInversion.trim()) {
      console.error("El monto de inversión no puede estar vacío.");
      return false;
    }
  
    // Validar que UnidadMonetaria no esté vacío
    if (!resumen.UnidadMonetaria.trim()) {
      console.error("La unidad monetaria no puede estar vacía.");
      return false;
    }
  
    // Validar que Documentos no esté vacío
    if (!resumen.Documentos || resumen.Documentos.length === 0) {
      console.error("Debe haber al menos un documento registrado.");
      return false;
    }
      
    return true;
  }

  validarFormularioSolicitudDIA(formulario: FormularioSolicitudDIA): number {
    if(!this.data.PlanManejoAmbiental.Resumen.Save) return 0;
    if (!this.validateResumen(formulario.PlanManejoAmbiental.Resumen)) return 1;
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

  agregarDocumento(item: ArchivoAdjunto) {//AttachButtonComponent - Documentos Adjuntos
    this.documentos.push(item);
  }

  actualizarDocumentos(documentos: ArchivoAdjunto[]) {
      this.documentos = documentos;
    }

  delete(compromiso: Compromisos) {
    this.compromisos = this.compromisos.filter(x => x.Etapas != compromiso.Etapas);
    let sumaTotal = this.sumarCostoEstimado(this.compromisos);
    this.montoTotal = sumaTotal.toString();
  }

  ver(){
    if (this.estadoSolicitud !== 'EN PROCESO') {
    return true;
    }
    return false;
  }
}
