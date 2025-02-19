import { Component, Input, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl, ValidationErrors } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ComponentesProyecto, FormularioSolicitudDIA, Residuos } from 'src/app/core/models/Tramite/FormularioSolicitudDIA';
import { TableRow } from 'src/app/shared/components/table/interfaces/table.interface';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { ExternoService } from 'src/app/core/services/servicios/externo.service';
import { Observable, catchError, map, of } from 'rxjs';
import { ClasificacionResiduo, TipoResiduo, UnidadPeso, FrecuenciaPeso } from 'src/app/core/models/Externos/Residuo';
@Component({
  selector: 'app-residuos',
  templateUrl: './residuos.component.html',
  styleUrl: './residuos.component.scss'
})
export class ResiduosComponent implements OnInit {
  form: FormGroup;
  activeModal = inject(NgbActiveModal);
  @Input() title!: string;
  @Input() id: number;
  @Input() edicion: Residuos;
  @Input() modoVisualizacion: boolean;
  listaClasificacionResiduo: ClasificacionResiduo[] = [];
  listaTipoResiduo: TipoResiduo[] = [];
  listaResiduo: TipoResiduo[] = [];
  listaUnidadPeso: UnidadPeso[] = [];
  listaFrecuenciaPeso: FrecuenciaPeso[] = [];
  descripcionClasificacion: string = '';
  descripcionTipoResiduo: string = '';
  descripcionResiduo: string = '';
  descripcionUnidadPeso: string = '';
  descripcionFrecuencia: string = '';
  //residuoPeligroso: boolean = true;

  constructor(private builder: FormBuilder,
    private funcionesMtcService: FuncionesMtcService,
    private externoService: ExternoService
  ) { }

  ngOnInit(): void {
    this.buildForm();
    this.loadListas();
    this.getData();
    this.habilitarControles();
  }
  
  private buildForm(): void {
    this.form = this.builder.group({
      Clasificacion: ["",[Validators.required, this.clasificacionValidator]],
      Tipo: ["",[Validators.required, this.tipoValidator]],
      Residuos: ["",[Validators.required, this.residuosValidator]], 
      VolumenPorDia: [null, [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      Volumen: [null, [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      UnidadesPeso: ["",[Validators.required, this.unidadesPesoValidator]],
      PesoPerCapita: [null, [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      Peso: [null, [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      Frecuencia: ["",[Validators.required, this.frecuenciaPesoValidator]],
      VolumenTotal: [null, [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      PesoTotal: [null, [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      AlmacenajeTemporal: [{ value: null, disabled: true }],
      Comercializacion: [{ value: null, disabled: true }],
      Reaprovechamiento: [{ value: null, disabled: true }],
      Minimizacion: [{ value: null, disabled: true }],
      CantidadTotal: [{ value: null, disabled: true }],
      ECRRSS: [{ value: null, disabled: true }],
      EPSRRSS: [{ value: null, disabled: true }],
      Cantidad: [{ value: null, disabled: true }],
      TipoTratamiento: [{ value: null, disabled: true }],
      Observaciones: [{ value: null, disabled: true }],
      TratamientoEPSRRSS: [{ value: null, disabled: true }]
    });
    this.subscribeToValueChanges();
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

  get clasificacion() {
    return this.form.get('Clasificacion') as FormControl;
  }

  clasificacionValidator(control: AbstractControl): ValidationErrors | null {
      return control.value === '' ? { invalidSelection: true } : null;
  }
  get tipo() {
    return this.form.get('Tipo') as FormControl;
  }
  tipoValidator(control: AbstractControl): ValidationErrors | null {
    return control.value === '' ? { invalidSelection: true } : null;
  }
  get residuos() {
    return this.form.get('Residuos') as FormControl;
  }
  residuosValidator(control: AbstractControl): ValidationErrors | null {
    return control.value === '' ? { invalidSelection: true } : null;
  }
  

/*
  get clasificacionErrors() {
    if (this.clasificacion.hasError('required')) {
      return 'Obligatorio';
    }   
    return '';
  }
*/
  get volumenPorDia() {
    return this.form.get('VolumenPorDia') as FormControl;
  }
/*
  get volumenPorDiaErrors() {
    if (this.volumenPorDia.hasError('required')) {
      return 'Obligatorio';
    }   
    return '';
  }
  */
  get volumen() {
    return this.form.get('Volumen') as FormControl;
  }
/*
  get volumenErrors() {
    if (this.volumen.hasError('required')) {
      return 'Obligatorio';
    }   
    return '';
  }
*/
  get unidadesPeso() {
    return this.form.get('UnidadesPeso') as FormControl;
  }
  unidadesPesoValidator(control: AbstractControl): ValidationErrors | null {
    return control.value === '' ? { invalidSelection: true } : null;
  }
/*
  get unidadesPesoErrors() {
    if (this.unidadesPeso.hasError('required')) {
      return 'Obligatorio';
    }   
    return '';
  }
  */
  get pesoPerCapita() {
    return this.form.get('PesoPerCapita') as FormControl;
  }
/*
  get pesoPerCapitaErrors() {
    if (this.pesoPerCapita.hasError('required')) {
      return 'Obligatorio';
    }   
    return '';
  }
  */
  get peso() {
    return this.form.get('Peso') as FormControl;
  }
/*
  get pesoErrors() {
    if (this.peso.hasError('required')) {
      return 'Obligatorio';
    }   
    return '';
  }
*/
  get frecuencia() {
    return this.form.get('Frecuencia') as FormControl;
  }
  frecuenciaPesoValidator(control: AbstractControl): ValidationErrors | null {
    return control.value === '' ? { invalidSelection: true } : null;
  }
/*
  get frecuenciaErrors() {
    if (this.frecuencia.hasError('required')) {
      return 'Obligatorio';
    }   
    return '';
  }
*/
  get volumenTotal() {
    return this.form.get('VolumenTotal') as FormControl;
  }
/*
  get volumenTotalErrors() {
    if (this.volumenTotal.hasError('required')) {
      return 'Obligatorio';
    }   
    return '';
  }
  */
  get pesoTotal() {
    return this.form.get('PesoTotal') as FormControl;
  }
/*
  get pesoTotalErrors() {
    if (this.pesoTotal.hasError('required')) {
      return 'Obligatorio';
    }   
    return '';
  }
  */
  private subscribeToValueChanges(): void {
    this.form.get('Clasificacion')?.valueChanges.subscribe(value => this.updateClasificacionDescripcion(value));
    this.form.get('Tipo')?.valueChanges.subscribe(value => this.updateTipoDescripcion(value));
    this.form.get('Residuos')?.valueChanges.subscribe(value => this.updateResiduosDescripcion(value));
    this.form.get('UnidadesPeso')?.valueChanges.subscribe(value => this.updateUnidadesPesoDescripcion(value));
    this.form.get('Frecuencia')?.valueChanges.subscribe(value => this.updateFrecuenciaDescripcion(value));

    const fieldsToWatch = ['AlmacenajeTemporal', 'Comercializacion', 'Reaprovechamiento', 'Minimizacion'];

    fieldsToWatch.forEach(field => {
      this.form.get(field)?.valueChanges.subscribe(() => {
        this.calculateCantidadTotal();
      });
    });
  }

  updateClasificacionDescripcion(value: string) {
    const selectedTipo = this.listaClasificacionResiduo.find(item => item.idClasificacionResiduo === parseInt(value));
    this.descripcionClasificacion = selectedTipo ? selectedTipo.descripcion : '';
    if (value === "1") {
      this.toggleFormControls(true);
    } else if (value === "2") {
      this.toggleFormControls(false);
    }
  }

  private toggleFormControls(enable: boolean): void {
    const controls = [
      'AlmacenajeTemporal',
      'Comercializacion',
      'Reaprovechamiento',
      'Minimizacion',
      'CantidadTotal',
      'ECRRSS',
      'EPSRRSS',
      'Cantidad',
      'TipoTratamiento',
      'Observaciones',
      'TratamientoEPSRRSS'
    ];

    controls.forEach(control => {
      if (enable) {
        this.form.get(control)?.enable();
        this.form.get(control)?.reset();
      } else {
        this.form.get(control)?.disable();
      }
    });
  }

  private calculateCantidadTotal(): void {
    const almacenaje = parseFloat(this.form.get('AlmacenajeTemporal')?.value) || 0;
    const comercializacion = parseFloat(this.form.get('Comercializacion')?.value) || 0;
    const reaprovechamiento = parseFloat(this.form.get('Reaprovechamiento')?.value) || 0;
    const minimizacion = parseFloat(this.form.get('Minimizacion')?.value) || 0;

    const cantidadTotal = almacenaje + comercializacion + reaprovechamiento + minimizacion;
    this.form.get('CantidadTotal')?.setValue(cantidadTotal);
  }


  updateTipoDescripcion(value: string) {
    const selectedRecurso = this.listaTipoResiduo.find(item => item.idTipoResiduo === parseInt(value));
    this.descripcionTipoResiduo = selectedRecurso ? selectedRecurso.descripcion : '';
  }

  updateResiduosDescripcion(value: string) {
    const selectedRecurso = this.listaResiduo.find(item => item.idTipoResiduo === parseInt(value));
    this.descripcionResiduo = selectedRecurso ? selectedRecurso.descripcion : '';
  }

  updateUnidadesPesoDescripcion(value: string) {
    const selectedRecurso = this.listaUnidadPeso.find(item => item.idUnidadMedida === parseInt(value));
    this.descripcionUnidadPeso = selectedRecurso ? selectedRecurso.descripcion : '';
  }

  updateFrecuenciaDescripcion(value: string) {
    const selectedRecurso = this.listaFrecuenciaPeso.find(item => item.idFrecuenciaResiduo === parseInt(value));
    this.descripcionFrecuencia = selectedRecurso ? selectedRecurso.descripcion : '';
  }

  save(form: FormGroup) {
    if (form.valid) {
      const datos: Residuos = {
        ...form.value,
        Id: this.id,
        DescripcionTipo: this.descripcionTipoResiduo,
        DescripcionResiduos: this.descripcionResiduo,
        DescripcionClasificacion: this.descripcionClasificacion,
        DescripcionFrecuencia: this.descripcionFrecuencia,
        DescripcionUnidadPeso: this.descripcionUnidadPeso
      };
  
      this.activeModal.close(datos);
    }else {
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
  private getData(): void {
    debugger;
    if (this.edicion !== undefined) {
      this.form.patchValue(this.edicion);
      this.onClasificacionResiduoChange(this.edicion.Clasificacion);
      this.onTipoResiduoChange(parseInt( this.edicion.Tipo));
      this.descripcionClasificacion = this.edicion.DescripcionClasificacion;
      this.descripcionTipoResiduo = this.edicion.DescripcionTipo;
      this.descripcionResiduo = this.edicion.DescripcionResiduos;
      this.descripcionUnidadPeso = this.edicion.DescripcionUnidadPeso;
      this.descripcionFrecuencia = this.edicion.DescripcionFrecuencia;
    }
  }

  closeDialog() {
    this.activeModal.dismiss();
  }

  private loadListas() {
    this.comboClasificacionResiduo().subscribe(response => this.listaClasificacionResiduo = response);
    this.comboUnidadPeso().subscribe(response => this.listaUnidadPeso = response);
    this.comboFrecuenciaPeso().subscribe(response => this.listaFrecuenciaPeso = response);
  }

  onClasificacionResiduoChange(value: string): void {
    console.log("valor de clasificacion residuo:" + value.toString());

     
      this.form.patchValue({
        Tipo: '',
        Residuos: '',
        VolumenPorDia: '',
        Volumen: '',
        UnidadesPeso: '',
        PesoPerCapita: '',
        Peso: '',
        Frecuencia: '',
        VolumenTotal: '',
        PesoTotal: '',
        AlmacenajeTemporal: '',
        Comercializacion: '',
        Reaprovechamiento: '',
        Minimizacion: '',
        CantidadTotal: '',
        ECRRSS: false,
        EPSRRSS: false,
        Cantidad: '',
        TipoTratamiento: '',
        Observaciones: '',
        TratamientoEPSRRSS: false
      });
   


    if (value) {
      this.comboTipoResiduo(+value).subscribe(response => this.listaTipoResiduo = response);
    }
  }

  onTipoResiduoChange(value: number): void {
    if (value) {
      this.comboResiduo(value).subscribe(response => this.listaResiduo = response);
    }
  }

  private comboClasificacionResiduo(): Observable<ClasificacionResiduo[]> {
    this.funcionesMtcService.mostrarCargando();
    return this.externoService.getClasificacionResiduo().pipe(
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

  private comboTipoResiduo(clasificacionResiduo: number): Observable<TipoResiduo[]> {
    this.funcionesMtcService.mostrarCargando();
    return this.externoService.getTipoResiduo(clasificacionResiduo).pipe(
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

  private comboResiduo(tipoResiduo: number): Observable<TipoResiduo[]> {
    this.funcionesMtcService.mostrarCargando();
    return this.externoService.getResiduo(tipoResiduo).pipe(
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

  private comboUnidadPeso(): Observable<UnidadPeso[]> {
    this.funcionesMtcService.mostrarCargando();
    return this.externoService.getUnidadPeso().pipe(
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

  private comboFrecuenciaPeso(): Observable<FrecuenciaPeso[]> {
    this.funcionesMtcService.mostrarCargando();
    return this.externoService.getFrecuenciaPeso().pipe(
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
