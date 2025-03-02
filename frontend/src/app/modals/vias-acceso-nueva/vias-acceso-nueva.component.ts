import { Component, Input, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl, ValidationErrors } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, catchError, map, of } from 'rxjs';
import { FormularioSolicitudDIA, ViasAccesoNueva } from 'src/app/core/models/Tramite/FormularioSolicitudDIA';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { TableRow } from 'src/app/shared/components/table/interfaces/table.interface';

@Component({
  selector: 'app-vias-acceso-nueva',
  templateUrl: './vias-acceso-nueva.component.html',
  styleUrl: './vias-acceso-nueva.component.scss'
})
export class ViasAccesoNuevaComponent implements OnInit {
  form: FormGroup;
  activeModal = inject(NgbActiveModal);
  @Input() title!: string;
  @Input() id: number;
  @Input() edicion: ViasAccesoNueva;
  @Input() modoVisualizacion: boolean;

  //listaTipoVia: ComboGenerico[] = [];
  descripcionTipoVia: string = '';

  constructor(private builder: FormBuilder,
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

  private buildForm(): void{
    this.form = this.builder.group({
      TipoVia: ['',[Validators.required, this.tipoViaValidator]],
      Largo: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      Ancho: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      Material: ['', Validators.required],
      Equipos: ['', Validators.required]
    });
    this.subscribeToValueChanges();
  }
    
  get tipoVia() {
    return this.form.get('TipoVia') as FormControl;
  }

    tipoViaValidator(control: AbstractControl): ValidationErrors | null {
       return control.value === '' ? { invalidSelection: true } : null;
     }

  get largo() {
    return this.form.get('Largo') as FormControl;
  }


  
  get ancho() {
    return this.form.get('Ancho') as FormControl;
  }

 
  get material() {
    return this.form.get('Material') as FormControl;
  }



  get equipos() {
    return this.form.get('Equipos') as FormControl;
  }

 

  private subscribeToValueChanges(): void {
    this.form.get('TipoVia')?.valueChanges.subscribe(value => this.updateDescripcion(value));
  }

  updateDescripcion(value: string) {
    //const selectedTipo = this.listaTipoVia.find(item => item.codigo === parseInt(value));
   // this.descripcionTipoVia = selectedTipo ? selectedTipo.descripcion : '';
  }

  private getData(): void {
    if (this.edicion !== undefined) {
      this.form.patchValue(this.edicion);
      this.descripcionTipoVia = this.edicion.DescripcionTipoVia;
    }
  }

  save(form:FormGroup){
    if (form.valid) {
      const datos: ViasAccesoNueva = {
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
    //this.comboTipoVia().subscribe(response => this.listaTipoVia = response);
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
