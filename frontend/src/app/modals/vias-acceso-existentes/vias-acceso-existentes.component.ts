import { Component, Input, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl, ValidationErrors } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, catchError, map, of } from 'rxjs';
import { ComboGenerico } from 'src/app/core/models/Maestros/ComboGenerico';
import { FormularioSolicitudDIA, ViasAccesoExistente } from 'src/app/core/models/Tramite/FormularioSolicitudDIA';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { ExternoService } from 'src/app/core/services/servicios/externo.service';
import { TableRow } from 'src/app/shared/components/table/interfaces/table.interface';

@Component({
  selector: 'app-vias-acceso-existentes',
  templateUrl: './vias-acceso-existentes.component.html',
  styleUrl: './vias-acceso-existentes.component.scss'
})
export class ViasAccesoExistentesComponent implements OnInit {
  form: FormGroup;
  activeModal = inject(NgbActiveModal);
  @Input() title!: string;
  @Input() id: number;
  @Input() edicion: ViasAccesoExistente;
  @Input() modoVisualizacion: boolean;

  listaTipoVia: ComboGenerico[] = [];
  descripcionTipoVia: string = '';

  constructor(private builder: FormBuilder,
    private externoService: ExternoService,
    private funcionesMtcService: FuncionesMtcService
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
      TipoVia: ['',[Validators.required, this.tipoViaValidator]],
      RutaInicio: ['', Validators.required],
      RutaFin: ['', Validators.required],
      Distancia:  ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      Tiempo:  ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
    });
    this.subscribeToValueChanges();
  }

  get tipoVia() {
    return this.form.get('TipoVia') as FormControl;
  }
  tipoViaValidator(control: AbstractControl): ValidationErrors | null {
       return control.value === '' ? { invalidSelection: true } : null;
     } 

  get rutaInicio() {
    return this.form.get('RutaInicio') as FormControl;
  }
 
   
  get rutaFin() {
    return this.form.get('RutaFin') as FormControl;
  }
 
  get distancia() {
    return this.form.get('Distancia') as FormControl;
  }
 
  get tiempo() {
    return this.form.get('Tiempo') as FormControl;
  }
 
  private subscribeToValueChanges(): void {
    this.form.get('TipoVia')?.valueChanges.subscribe(value => this.updateDescripcion(value));
  }

  updateDescripcion(value: string) {
    const selectedTipo = this.listaTipoVia.find(item => item.codigo === parseInt(value));
    this.descripcionTipoVia = selectedTipo ? selectedTipo.descripcion : '';
  }

  private getData(): void {
    if (this.edicion !== undefined) {
      this.form.patchValue(this.edicion);
      this.descripcionTipoVia = this.edicion.DescripcionTipoVia;
    }
  }


  save(form: FormGroup) {
    if (form.valid) {
      const datos: ViasAccesoExistente = {
        ...form.value,
        Id: this.id,
        DescripcionTipoVia: this.descripcionTipoVia      
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

  closeDialog() {
    this.activeModal.dismiss();
  }

  private loadListas() {
    this.comboTipoVia().subscribe(response => this.listaTipoVia = response);
  }

  private comboTipoVia(): Observable<ComboGenerico[]> {
    this.funcionesMtcService.mostrarCargando();
    return this.externoService.getComboTipoViaExistente().pipe(
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
