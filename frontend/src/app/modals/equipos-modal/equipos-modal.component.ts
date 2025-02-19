import { Component, Input, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Equipos, FormularioSolicitudDIA } from 'src/app/core/models/Tramite/FormularioSolicitudDIA';
import { TableRow } from 'src/app/shared/components/table/interfaces/table.interface';


@Component({
  selector: 'app-equipos-modal',  
  templateUrl: './equipos-modal.component.html',
  styleUrl: './equipos-modal.component.scss'
})
export class EquiposModalComponent implements OnInit{
  form: FormGroup;
  activeModal = inject(NgbActiveModal);
  @Input() title!: string;
  @Input() id: number;
  @Input() edicion: Equipos;
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
      Equipo: [null, Validators.required],
      Descripcion: [null, Validators.required],
      Cantidad: [null, Validators.required]
    });
  }

  get equipo() {
    return this.form.get('Equipo') as FormControl;
  }

  get equipoErrors() {
    if (this.equipo.hasError('required')) {
      return 'Obligatorio';
    }   
    return '';
  }

  get descripcion() {
    return this.form.get('Descripcion') as FormControl;
  }

  get descripcionErrors() {
    if (this.descripcion.hasError('required')) {
      return 'Obligatorio';
    }   
    return '';
  }

  get cantidad() {
    return this.form.get('Cantidad') as FormControl;
  }

  get cantidadErrors() {
    if (this.cantidad.hasError('required')) {
      return 'Obligatorio';
    }   
    return '';
  }

  private getData(): void {
    if (this.edicion !== undefined) {
      this.form.patchValue(this.edicion);
    }
  }

  save(form:FormGroup){
    if (form.valid) {
      const datos: Equipos = {
        ...form.value,
        Id: this.id
      }; 
      this.activeModal.close(datos);
    }    
  }
  
  closeDialog() {
    this.activeModal.dismiss();
  }

  soloNumeros(vent: KeyboardEvent, campo: string) {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/[^0-9]/g, ''); // Solo permite números
    this.form.get(campo)?.setValue(value);
  }
}
