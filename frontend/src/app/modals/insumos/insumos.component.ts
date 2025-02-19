import { Component, Input, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl, ValidationErrors} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, catchError, map, of } from 'rxjs';
import { InsumoResponse } from 'src/app/core/models/Externos/insumo-response';
import { UnidadMedidaResponse } from 'src/app/core/models/Externos/unidad-medida-response';
import { FormularioSolicitudDIA, Insumos, Mineral } from 'src/app/core/models/Tramite/FormularioSolicitudDIA';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { ExternoService } from 'src/app/core/services/servicios/externo.service';
import { TableRow } from 'src/app/shared/components/table/interfaces/table.interface';

@Component({
  selector: 'app-insumos',
  templateUrl: './insumos.component.html',
  styleUrl: './insumos.component.scss'
})
export class InsumosComponent implements OnInit {
  form: FormGroup;
  activeModal = inject(NgbActiveModal);
  @Input() title!: string;
  @Input() id: number;
  @Input() edicion: Insumos;
  @Input() modoVisualizacion: boolean;
  @Input() InsumoArray: Insumos[] = [];
   

  listaInsumo: InsumoResponse[] = [];
  listaUnidadMedida: UnidadMedidaResponse[] = [];

  descripcionInsumo: string = '';
  descripcionUnidadMedida: string = '';

  constructor(private builder: FormBuilder,
    private externoService: ExternoService,
    private funcionesMtcService: FuncionesMtcService
  ) { }

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

  ngOnInit(): void {    
    this.buildForm();
    this.loadListas();
    this.getData();
    this.habilitarControles();
  }

  private buildForm(): void {
    this.form = this.builder.group({
      Insumos: ['',[Validators.required, this.insumosValidator]],
      Cantidad: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      UnidadMedida: ['',[Validators.required, this.unidadMedidaValidator]],
      Almacenamiento: [null, Validators.required],
      Manejo: [null, Validators.required]
    });
    this.subscribeToValueChanges();
  }

  get insumos() {
    return this.form.get('Insumos') as FormControl;
  }

  insumosValidator(control: AbstractControl): ValidationErrors | null {
         return control.value === '' ? { invalidSelection: true } : null;
       }
       
  get cantidad() {
    return this.form.get('Cantidad') as FormControl;
  }

  get unidadMedida() {
    return this.form.get('UnidadMedida') as FormControl;
  }

  unidadMedidaValidator(control: AbstractControl): ValidationErrors | null {
    return control.value === '' ? { invalidSelection: true } : null;
  }
  get almacenamiento() {
    return this.form.get('Almacenamiento') as FormControl;
  }

  get manejo() {
    return this.form.get('Manejo') as FormControl;
  }

  private subscribeToValueChanges(): void {
    this.form.get('Insumos')?.valueChanges.subscribe(value => this.updateInsumosDescripcion(value));
    this.form.get('UnidadMedida')?.valueChanges.subscribe(value => this.updateUnidadMedidaDescripcion(value));
  }

  updateInsumosDescripcion(value: string) {   
    const selectedTipo = this.listaInsumo.find(item => item.idTipoInsumoBeneficio === parseInt(value));
    this.descripcionInsumo = selectedTipo ? selectedTipo.descripcion : '';
  }

  updateUnidadMedidaDescripcion(value: string) {
    const selectedRecurso = this.listaUnidadMedida.find(item => item.idUnidadMedida === parseInt(value));
    this.descripcionUnidadMedida = selectedRecurso ? selectedRecurso.descripcion : '';
  }

  save(form: FormGroup) { 
    const insumoExists = this.InsumoArray.some(item => {  
      return item.Insumos['text'] === this.descripcionInsumo;
    });
    
    if (insumoExists) {    
      this.funcionesMtcService.mensajeInfo('Debe ingresar Insumo diferente');           
      return;
    }

    if (form.valid) {
      const datos: Insumos = {
        ...form.value,
        Id: this.id,
        DescripcionInsumos: this.descripcionInsumo,
        DescripcionUnidadMedida: this.descripcionUnidadMedida
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
    if (this.edicion !== undefined) {
      this.form.patchValue(this.edicion);
      this.descripcionInsumo = this.edicion.DescripcionInsumos;
      this.descripcionUnidadMedida = this.edicion.DescripcionUnidadMedida;
    }
  }

  closeDialog() {
    this.activeModal.dismiss();
  }

  private loadListas() {
    this.comboInsumo().subscribe(response => this.listaInsumo = response);
    this.comboUnidadMedidaInsumo().subscribe(response => this.listaUnidadMedida = response);
  }

  private comboInsumo(): Observable<InsumoResponse[]> {
    this.funcionesMtcService.mostrarCargando();
    return this.externoService.getComboInsumo().pipe(
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

  private comboUnidadMedidaInsumo(): Observable<UnidadMedidaResponse[]> {
    this.funcionesMtcService.mostrarCargando();
    return this.externoService.getComboUnidadMedidaInsumo().pipe(
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
