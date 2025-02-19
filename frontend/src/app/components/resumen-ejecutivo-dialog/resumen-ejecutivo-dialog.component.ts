import { Component, Inject, Input, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormularioDIA, FormularioDIAResponse } from 'src/app/core/models/Formularios/FormularioMain';
import { ArchivoAdjunto, FormularioSolicitudDIA, ResumenEjecutivo } from 'src/app/core/models/Tramite/FormularioSolicitudDIA';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { TramiteService } from 'src/app/core/services/tramite/tramite.service';
import { IOption, TableColumn, TableRow } from 'src/app/shared/components/table/interfaces/table.interface';
import { UnidadMinera } from 'src/app/core/models/Externos/UnidadMinera';
import { CONSTANTES } from 'src/app/enums/constants';
import { ExternoService } from 'src/app/core/services/servicios/externo.service';
import { Observable, catchError, map, of } from 'rxjs'; 
import { ComboGenerico } from 'src/app/core/models/Maestros/ComboGenerico';

@Component({
  selector: 'resumen-ejecutivo-dialog',
  templateUrl: './resumen-ejecutivo-dialog.component.html',
  styleUrl: './resumen-ejecutivo-dialog.component.scss',

})
export class ResumenEjecutivoDialogComponent implements OnInit {
  activeModal = inject(NgbActiveModal);
  @Input() title!: string;
  @Input() codMaeSolicitud: number;
  @Input() idCliente: number;
  @Input() idEstudio: number;
  @Input() modoVisualizacion: boolean;
  @Input() codMaeRequisito: number;
  
  data: FormularioSolicitudDIA;
  form: FormGroup;
  documentos: ArchivoAdjunto[] = [];
  ResumenEjecutivo: ResumenEjecutivo = {
    Documentos: [],
    Resumen: '',
    Save: false,
    FechaRegistro: '',
    State: 0
  };
  estadoSolicitud: string;
  showTipoDocumento: boolean = true;
  optsTipoDocumento: IOption[] = [];
  listaUnidadMinera: UnidadMinera[] = [];
  constructor(
    private builder: FormBuilder,
    private tramiteService: TramiteService,
    private funcionesMtcService: FuncionesMtcService,
    private externoService: ExternoService
  ) { }

  ngOnInit(): void {
    this.buildForm();
    this.getData();  
    this.loadListas();
    this.habilitarControles();
  }

  get viewOnly() { return this.modoVisualizacion; }

  get viewControl() { return !this.modoVisualizacion; }

  habilitarControles() {
    if (this.viewOnly) {
      Object.keys(this.form.controls).forEach(controlName => {
        const control = this.form.get(controlName);
        control?.disable();
      });
    }
  }

  private buildForm(): void {
    this.form = this.builder.group({
      Resumen: [null, Validators.required]
    });
  }

  private getData(): void {
    this.funcionesMtcService.mostrarCargando();
    const codigoSolicitud = Number(this.codMaeSolicitud);
    this.tramiteService.getFormularioDia(codigoSolicitud).subscribe(resp => {
      this.funcionesMtcService.ocultarCargando();
      if (resp.success) {
        this.data = JSON.parse(resp.data.dataJson);
        this.patchFormValues();
      }
    });

    const tramite = localStorage.getItem('tramite-selected');
    const tramiteObj = JSON.parse(tramite);
    this.estadoSolicitud = tramiteObj.estadoSolicitud; 
  }

  private patchFormValues() {
    this.form.patchValue(this.data.ResumenEjecutivo);
    debugger;
    this.documentos = this.data.ResumenEjecutivo.Documentos;
  }

  closeDialog() {
    this.activeModal.dismiss();
  }

  save(form: FormGroup) {
    this.funcionesMtcService.mostrarCargando();     
    this.ResumenEjecutivo = form.value;
    this.data.ResumenEjecutivo.Resumen = this.ResumenEjecutivo.Resumen;
    this.data.ResumenEjecutivo.Documentos = this.documentos;    
    this.data.ResumenEjecutivo.Save = true;
    this.data.ResumenEjecutivo.State = this.validarFormularioSolicitudDIA(this.data);
    console.log(this.validarFormularioSolicitudDIA(this.data));
    this.data.ResumenEjecutivo.FechaRegistro = this.funcionesMtcService.dateNow();
    const objeto: FormularioDIAResponse = {
      codMaeSolicitud: this.codMaeSolicitud,
      codMaeRequisito: this.codMaeRequisito,
      dataJson: JSON.stringify(this.data)
    };

    this.tramiteService.postGuardarFormulario(objeto).subscribe(resp => {
      this.funcionesMtcService.ocultarCargando();
      if (resp.success) {
        this.funcionesMtcService.ocultarCargando().mensajeOk('Se grabó el formulario').then(()=>this.closeDialog());
      } else {
        this.funcionesMtcService.ocultarCargando().mensajeError('No se grabó el formulario');
      }
    });
  }

  validarResumenEjecutivo(resumen: ResumenEjecutivo): boolean {
    // Validar que el resumen no esté vacío
    if (!resumen.Resumen || resumen.Resumen.trim() === '') {
      return false;
    }
  
    // Validar que el arreglo Documentos tenga al menos un elemento
    if (!resumen.Documentos || resumen.Documentos.length === 0) {
      return false;
    }
  
    return true;
  }
  
  validarFormularioSolicitudDIA(formulario: FormularioSolicitudDIA): number {
    if(!this.data.ResumenEjecutivo.Save) return 0;
    if (!this.validarResumenEjecutivo(formulario.ResumenEjecutivo)) return 1;
    return 2;
  }
  
  agregarDocumento(documento: ArchivoAdjunto) { 
    this.documentos.push(documento);
  }

  ver(){
    if (this.estadoSolicitud !== 'EN PROCESO') {
    return true;
    }
    return false;
  }
  private loadListas() {
    this.comboUnidadMinera().subscribe(response => this.listaUnidadMinera = response);

    this.comboGenerico(CONSTANTES.ComboGenericoEIAW.TipoDocumento).subscribe(response => {
      const options = response.map(({ codigo, descripcion }) => ({
        value: codigo.toString(),
        label: descripcion
      }));
      this.optsTipoDocumento.push(...options);
    });

  }
  private comboGenerico(tipo: string): Observable<ComboGenerico[]> {
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
  private comboUnidadMinera(): Observable<UnidadMinera[]> {
    this.funcionesMtcService.mostrarCargando();
    return this.externoService.getUnidadMinera(this.idEstudio, this.idCliente).pipe(
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

  actualizarDocumentos(documentos: ArchivoAdjunto[]) {
    debugger;
    this.documentos = documentos;
  }  
}
