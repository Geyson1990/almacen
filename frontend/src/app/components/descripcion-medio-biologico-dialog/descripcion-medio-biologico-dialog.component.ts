import { Component, Input, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormularioDIAResponse } from 'src/app/core/models/Formularios/FormularioMain';
import { ArchivoAdjunto, DescripcionMedioBiologico, FormularioSolicitudDIA } from 'src/app/core/models/Tramite/FormularioSolicitudDIA';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { TramiteService } from 'src/app/core/services/tramite/tramite.service';
import { IOption, TableColumn, TableRow } from 'src/app/shared/components/table/interfaces/table.interface';
import { CONSTANTES } from 'src/app/enums/constants';
import { ExternoService } from 'src/app/core/services/servicios/externo.service';
import { Observable, catchError, map, of } from 'rxjs';
import { ComboGenerico } from 'src/app/core/models/Maestros/ComboGenerico';
@Component({
  selector: 'descripcion-medio-biologico-dialog',
  templateUrl: './descripcion-medio-biologico-dialog.component.html',
})
export class DescripcionMedioBiologicoDialog implements OnInit {
  form: FormGroup;
  selectedUnit: string = '';
  activeModal = inject(NgbActiveModal);
  @Input() title!: string;
  @Input() codMaeSolicitud: number;
  @Input() idCliente: number;
  @Input() idEstudio: number;
  @Input() modoVisualizacion: boolean;  
  @Input() codMaeRequisito: number;
  data: FormularioSolicitudDIA;  
  documentos: ArchivoAdjunto[] = [];
  showTipoDocumento: boolean = true;
  optsTipoDocumento: IOption[] = [];
  estadoSolicitud: string;
  
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

  private buildForm(): void{
    this.form = this.builder.group({
      CriteriosEvaluacion: [null, Validators.required],
      DescripcionEcosistemas: [null, Validators.required],
      Ecosistemas: [null, Validators.required],
      FloraTerrestre: [null, Validators.required],
      FaunaTerrestre: [null, Validators.required],
      Hidrobiologia: [null, Validators.required],
      EcosistemasFragiles: [null, Validators.required],
      AreasNaturales: [null, Validators.required]
    });
  }

  private getData(): void {
    this.funcionesMtcService.mostrarCargando();
    //const codigoSolicitud = Number(localStorage.getItem('tramite-id'));
    this.tramiteService.getFormularioDia(this.codMaeSolicitud).subscribe(resp => {
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
    this.form.patchValue(data.DescripcionMedioBiologico);
    this.documentos = data.DescripcionMedioBiologico?.Documentos || [];
  }

  closeDialog() {
    this.activeModal.dismiss();
  }

  validateDescripcionMedioBiologico(descripcion: DescripcionMedioBiologico): boolean {
    // Validar que las propiedades de tipo string no estén vacías
    const requiredFields = [
      'CriteriosEvaluacion', 'DescripcionEcosistemas', 'Ecosistemas', 'FloraTerrestre', 
      'FaunaTerrestre', 'Hidrobiologia', 'EcosistemasFragiles', 'AreasNaturales'
    ];
  
    for (const field of requiredFields) {
      const fieldValue = descripcion[field as keyof DescripcionMedioBiologico];
      // Asegurarse de que el valor es una cadena de texto antes de aplicar trim
      if (typeof fieldValue === 'string' && !fieldValue.trim()) {
        console.error(`${field} no puede estar vacío.`);
        return false;
      }
    }
  
    // Validar que Documentos no esté vacío
    if (!descripcion.Documentos || descripcion.Documentos.length === 0) {
      return false;
    }

    return true;
  }

  
  validarFormularioSolicitudDIA(formulario: FormularioSolicitudDIA): number {
    if(!this.data.DescripcionMedioBiologico.Save) return 0;
    if (!this.validateDescripcionMedioBiologico(formulario.DescripcionMedioBiologico)) return 1;
    return 2;
  }

  save(form:FormGroup){    
    let data = form.value;

    const datos: DescripcionMedioBiologico = {
      CriteriosEvaluacion: data.CriteriosEvaluacion,
      DescripcionEcosistemas: data.DescripcionEcosistemas,
      Ecosistemas: data.Ecosistemas,
      FloraTerrestre: data.FloraTerrestre,
      FaunaTerrestre: data.FaunaTerrestre,
      Hidrobiologia: data.Hidrobiologia,
      EcosistemasFragiles: data.EcosistemasFragiles,
      AreasNaturales:data.AreasNaturales,
      Documentos: this.documentos || [],
      Save: true,
      FechaRegistro: this.funcionesMtcService.dateNow(),
      State: 0
    };
    
     this.data.DescripcionMedioBiologico = datos;
     this.GuardarJson(this.data);
  }

  private GuardarJson(data: FormularioSolicitudDIA) {
    const objeto: FormularioDIAResponse = {
      codMaeSolicitud: this.codMaeSolicitud, //Number(localStorage.getItem('tramite-id')),
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

  private loadListas() {
   
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

  ver(){
    if (this.estadoSolicitud !== 'EN PROCESO') {
    return true;
    }
    return false;
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
}
