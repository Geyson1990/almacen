import { Component, Input, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormularioSolicitudDIA, Maquinarias } from 'src/app/core/models/Tramite/FormularioSolicitudDIA';
import { TableRow } from 'src/app/shared/components/table/interfaces/table.interface';

@Component({
  selector: 'app-maquinaria-modal',
  templateUrl: './maquinaria-modal.component.html',
  styleUrl: './maquinaria-modal.component.scss'
})
export class MaquinariaModalComponent implements OnInit {
  form: FormGroup;
  activeModal = inject(NgbActiveModal);
  @Input() title!: string;
  @Input() id: number;
  @Input() edicion: Maquinarias;
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

  private buildForm(): void {
    this.form = this.builder.group({
      Maquinaria: [null, Validators.required],
      Descripcion: [null, Validators.required],
      Cantidad: [null, Validators.required]
    });
  }

  get maquinaria() {
    return this.form.get('Maquinaria') as FormControl;
  }

  get maquinariaErrors() {
    if (this.maquinaria.hasError('required')) {
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
  save(form: FormGroup) {
    if (form.valid) {
      const datos: Maquinarias = {
        ...form.value,
        Id: this.id
      };
  
      this.activeModal.close(datos);
    }
   
  }

  private getData(): void {
    if (this.edicion !== undefined) {
      this.form.patchValue(this.edicion);
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
