import { Component, Input, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { NgbActiveModal, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { DistanciaPobladosCercanos, Estudio, FormularioSolicitudDIA } from 'src/app/core/models/Tramite/FormularioSolicitudDIA';
import { TableRow } from 'src/app/shared/components/table/interfaces/table.interface';

@Component({
  selector: 'app-distancia-poblados-cercanos',
  templateUrl: './distancia-poblados-cercanos.component.html',
  styleUrl: './distancia-poblados-cercanos.component.scss'
})
export class DistanciaPobladosCercanosComponent implements OnInit{
  form: FormGroup;
  activeModal = inject(NgbActiveModal);
  @Input() title!: string; 
  @Input() id: number;
  @Input() edicion: DistanciaPobladosCercanos;  
  @Input() modoVisualizacion: boolean;
  
  constructor(private builder: FormBuilder) { }

  ngOnInit(): void {
    this.buildForm();
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
      Nombre: [null, Validators.required],
      Distancia: [null, [Validators.required, Validators.pattern(/^\d+(\.\d{2})?$/)]],       
      Vias: [null, Validators.required]
    });
  }

  get nombre() {
    return this.form.get('Nombre');
  } 

  get distancia() {
    return this.form.get('Distancia');
  } 

  get vias() {
    return this.form.get('Vias');
  }  
  
  private getData(): void {
    if (this.edicion !== undefined) {
      this.form.patchValue(this.edicion);
    }
  }  

  closeDialog() {
    this.activeModal.dismiss();
  }

  save(){    
    
    if (this.form.valid) {      
      const datos: DistanciaPobladosCercanos = {
        ...this.form.value,
        Id: this.id
      }; 
      this.activeModal.close(datos);
    } else {
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
  soloNumeros(event: KeyboardEvent, campo: string) {
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
