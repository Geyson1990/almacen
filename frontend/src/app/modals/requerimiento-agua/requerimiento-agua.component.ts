import { Component, Input, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl, ValidationErrors} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, catchError, map, of } from 'rxjs';
import { DatumResponse } from 'src/app/core/models/Externos/datum-response';
import { EtapaAbastecimientoResponse } from 'src/app/core/models/Externos/etapa-abastecimiento-response';
import { FaseResponse } from 'src/app/core/models/Externos/fase-response';
import { FuenteAguaResponse } from 'src/app/core/models/Externos/fuente-agua-response';
import { ZonaResponse } from 'src/app/core/models/Externos/zona-response';
import { FormularioSolicitudDIA, RequerimientoAgua } from 'src/app/core/models/Tramite/FormularioSolicitudDIA';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { ExternoService } from 'src/app/core/services/servicios/externo.service';
import { CONSTANTES } from 'src/app/enums/constants';
import { TableRow } from 'src/app/shared/components/table/interfaces/table.interface';
@Component({
  selector: 'app-requerimiento-agua',
  templateUrl: './requerimiento-agua.component.html',
  styleUrl: './requerimiento-agua.component.scss'
})
export class RequerimientoAguaComponent {
  form: FormGroup;
  activeModal = inject(NgbActiveModal);
  @Input() title!: string;
  @Input() id: number;
  @Input() edicion: RequerimientoAgua;
  @Input() modoVisualizacion: boolean;

  listaFase: FaseResponse[] = [];
  listaEtapaAbastecimiento: EtapaAbastecimientoResponse[] = [];
  listaFuenteAbastecimiento: FuenteAguaResponse[] = [];
  listaZona: ZonaResponse[] = [];
  listaDatum: DatumResponse[] = [];

  descripcionFase: string='';
  descripcionEtapa: string='';
  descripcionFuente: string='';
  descripcionZona: string='';
  descripcionDatum: string='';
  cantidadMetros: number = 0;
  numeroDias: number = 0;
  totalMetros: number = 0;
  constructor(private builder: FormBuilder,
    private externoService: ExternoService,
    private funcionesMtcService: FuncionesMtcService,
  ) { }

  ngOnInit(): void {
    this.buildForm();
    this.loadListas();
    this.getData();
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
    }
  }
  //#endregion ViewOnly

  private buildForm(): void {
    this.form = this.builder.group({
      Fase: ["",[Validators.required, this.faseValidator]],
      Etapa: ["",[Validators.required, this.etapaValidator]],
      Cantidad: [null, [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      NroDias: [null, Validators.required],
      Total: [null],
      NombreFuente: [null, Validators.required],
      FuenteAbastecimiento: ["",[Validators.required, this.fuenteAbastecimientoValidator]],
      Este: [null, Validators.required],
      Norte: [null, Validators.required],
      Zona: ["",[Validators.required, this.zonaValidator]],
      Datum: [{ value: "2", disabled: true },[Validators.required, this.datumValidator]],
      DisponibilidadEstacional: [null, Validators.required],
      UsosExistentes:  [null, Validators.required],
      SistemaCaptacion:  [null, Validators.required],
      SistemaConduccion: [null, Validators.required],
      RequerimientoAguaPorMetro: [null, [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      LongitudPerforacion: [null, [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      CantidadDiariaUso: [null, [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      PorcentajeRetorno: [null, [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      CantidadAguaReciclada: [null, [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      CantidadAguaFresca: [null, [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
    });
    this.subscribeToValueChanges();
  }

  get fase() {
    return this.form.get('Fase') as FormControl;
  }

  faseValidator(control: AbstractControl): ValidationErrors | null {
    return control.value === '' ? { invalidSelection: true } : null;
  }

  get faseErrors() {
    if (this.fase.hasError('required')) {
      return 'Obligatorio';
    }   
    return '';
  }

  get etapa() {
    return this.form.get('Etapa') as FormControl;
  }

  etapaValidator(control: AbstractControl): ValidationErrors | null {
    return control.value === '' ? { invalidSelection: true } : null;
  }

  get etapaErrors() {
    if (this.etapa.hasError('required')) {
      return 'Obligatorio';
    }   
    return '';
  }
  
  get cantidad() {
    return this.form.get('Cantidad') as FormControl;
  } 
  
  get nroDias() {
    return this.form.get('NroDias') as FormControl;
  } 
  
  get total() {
    return this.form.get('Total') as FormControl;
  }

  get totalErrors() {
    if (this.total.hasError('required')) {
      return 'Obligatorio';
    }   
    return '';
  }

  get nombreFuente() {
    return this.form.get('NombreFuente') as FormControl;
  }

  

  get fuenteAbastecimiento() {
    return this.form.get('FuenteAbastecimiento') as FormControl;
  }

  fuenteAbastecimientoValidator(control: AbstractControl): ValidationErrors | null {
    return control.value === '' ? { invalidSelection: true } : null;
  }

  get fuenteAbastecimientoErrors() {
    if (this.fuenteAbastecimiento.hasError('required')) {
      return 'Obligatorio';
    }   
    return '';
  }
  
  get este() {
    return this.form.get('Este') as FormControl;
  }

  

  get norte() {
    return this.form.get('Norte') as FormControl;
  }
 
  
  get zona() {
    return this.form.get('Zona') as FormControl;
  }

  zonaValidator(control: AbstractControl): ValidationErrors | null {
      return control.value === '' ? { invalidSelection: true } : null;
  }


  
  get datum() {
    return this.form.get('Datum') as FormControl;
  }

  datumValidator(control: AbstractControl): ValidationErrors | null {
    return control.value === '' ? { invalidSelection: true } : null;
  }
   
  get disponibilidadEstacional() {
    return this.form.get('DisponibilidadEstacional') as FormControl;
  }
  
  get usosExistentes() {
    return this.form.get('UsosExistentes') as FormControl;
  }

  get sistemaCaptacion() {
    return this.form.get('SistemaCaptacion') as FormControl;
  }

  get sistemaConduccion() {
    return this.form.get('SistemaConduccion') as FormControl;
  }

  get requerimientoAguaPorMetro() {
    return this.form.get('RequerimientoAguaPorMetro') as FormControl;
  }

  get longitudPerforacion() {
    return this.form.get('LongitudPerforacion') as FormControl;
  }

  get porcentajeRetorno() {
    return this.form.get('PorcentajeRetorno') as FormControl;
  }

  get cantidadDiariaUso() {
    return this.form.get('CantidadDiariaUso') as FormControl;
  }

  get cantidadAguaReciclada() {
    return this.form.get('CantidadAguaReciclada') as FormControl;
  }

  get cantidadAguaFresca() {
    return this.form.get('CantidadAguaFresca') as FormControl;
  }

  private subscribeToValueChanges(): void {
    this.form.get('Fase')?.valueChanges.subscribe(value => this.updateFaseDescripcion(value));
    this.form.get('Etapa')?.valueChanges.subscribe(value => this.updateEtapaDescripcion(value));
    this.form.get('FuenteAbastecimiento')?.valueChanges.subscribe(value => this.updateFuenteDescripcion(value));
    this.form.get('Zona')?.valueChanges.subscribe(value => this.updateZonaDescripcion(value));
    this.form.get('Datum')?.valueChanges.subscribe(value => this.updateDatumDescripcion(CONSTANTES.Datum));
  }

  updateFaseDescripcion(value: string) {
    const selectedTipo = this.listaFase.find(item => item.idTipoFase === parseInt(value));
    this.descripcionFase = selectedTipo ? selectedTipo.descripcion : '';
  }

  updateEtapaDescripcion(value: string) {
    const selectedRecurso = this.listaEtapaAbastecimiento.find(item => item.idTipoEtapa === parseInt(value));
    this.descripcionEtapa = selectedRecurso ? selectedRecurso.descripcion : '';
  }

  updateFuenteDescripcion(value: string) {
    const selectedRecurso = this.listaFuenteAbastecimiento.find(item => item.idFuenteAbastecimiento === parseInt(value));
    this.descripcionFuente = selectedRecurso ? selectedRecurso.descripcion : '';
  }

  updateZonaDescripcion(value: string) {
    const selectedRecurso = this.listaZona.find(item => item.idZona === parseInt(value));
    this.descripcionZona = selectedRecurso ? selectedRecurso.descripcion : '';
  }

  updateDatumDescripcion(value: string) {
    const selectedRecurso = this.listaDatum.find(item => item.idDatum === parseInt(value));
    this.descripcionDatum = selectedRecurso ? selectedRecurso.descripcion : '';
  }

  private getData(): void {
    if (this.edicion !== undefined) {
      this.form.patchValue(this.edicion);
      this.descripcionFase = this.edicion.DescripcionFase;
      this.descripcionEtapa = this.edicion.DescripcionEtapa;
      this.descripcionFuente = this.edicion.DescripcionFuente;
      this.descripcionZona = this.edicion.DescripcionZona;
      this.descripcionDatum = this.edicion.DescripcionDatum;
    }
    this.form.patchValue({ Id: this.id });
    this.form.controls['Datum'].setValue(CONSTANTES.Datum);
  }


  save(form: FormGroup) {
    if (form.valid) {
      const datos: RequerimientoAgua = {
        ...form.value,
        Id: this.id,
        DescripcionFase: this.descripcionFase,
        DescripcionEtapa: this.descripcionEtapa,
        DescripcionFuente: this.descripcionFuente,
        DescripcionZona: this.descripcionZona,
        DescripcionDatum: this.descripcionDatum
      };
  
      this.activeModal.close(datos);

    }
    else {
      this.markAllFieldsAsTouched();
    }    
  }

  private markAllFieldsAsTouched(): void {
    Object.keys(this.form.controls).forEach(controlName => {
      const control = this.form.get(controlName);
      if (control && !control.touched) {
        control.markAsTouched();
      }
    });
   }

  closeDialog() {
    this.activeModal.dismiss();
  }

  private loadListas() {
    this.comboFase().subscribe(response => this.listaFase = response);
    this.comboEtapaAbastecimiento().subscribe(response => this.listaEtapaAbastecimiento = response);
    this.comboFuenteAbastecimiento().subscribe(response => this.listaFuenteAbastecimiento = response);
    this.comboZona().subscribe(response => this.listaZona = response);
    this.comboDatum().subscribe(response => this.listaDatum = response);    
  }

  private comboFase(): Observable<FaseResponse[]> {
    this.funcionesMtcService.mostrarCargando();
    return this.externoService.getComboFaseRequerimientoAgua().pipe(
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

  private comboEtapaAbastecimiento(): Observable<EtapaAbastecimientoResponse[]> {
    this.funcionesMtcService.mostrarCargando();
    return this.externoService.getComboEtapaAbastecimientoRequerimientoAgua().pipe(
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

  private comboFuenteAbastecimiento(): Observable<FuenteAguaResponse[]> {
    this.funcionesMtcService.mostrarCargando();
    return this.externoService.getComboFuenteAbastecimientoRequerimientoAgua().pipe(
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

  private comboZona(): Observable<ZonaResponse[]> {
    this.funcionesMtcService.mostrarCargando();
    return this.externoService.getComboZonaRequerimientoAgua().pipe(
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

  private comboDatum(): Observable<DatumResponse[]> {
    this.funcionesMtcService.mostrarCargando();
    return this.externoService.getComboDatumRequerimientoAgua().pipe(
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
  
  soloNumeros(vent: KeyboardEvent, campo: string) {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/[^0-9]/g, ''); // Solo permite números
    this.form.get(campo)?.setValue(value);
  }

  totalMetrosCubicos(){
    const cantidadControl = this.form.get('Cantidad').value;
    const nroDiasControl = this.form.get('NroDias').value; 
   
    if((cantidadControl=='' || cantidadControl==0) || (nroDiasControl=='' || nroDiasControl==0)){
      this.form.get('Total').setValue('');
      return false;
    }
    
    this.cantidadMetros = Number(cantidadControl);
    this.numeroDias = Number(nroDiasControl);
    
      this.totalMetros = this.cantidadMetros * this.numeroDias; 
      this.form.get('Total').setValue(this.totalMetros);
      
  }

  soloDecimales(event: any, controlName: string): void {
    const inputValue: string = event.target.value;
    const formattedValue = inputValue
      .replace(/[^0-9.]/g, '')               
      .replace(/(\..*?)\..*/g, '$1')         
      .replace(/(\.\d{2})\d+/g, '$1'); 
    
    event.target.value = formattedValue;
 
    const control = this.form.get(controlName);
    if (control) {
      control.setValue(formattedValue, { emitEvent: false });
      control.updateValueAndValidity();
    }
  }
}
