import { Component, Input, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Distancia } from 'src/app/core/models/Tramite/FormularioSolicitudDIA';
import { TableRow } from 'src/app/shared/components/table/interfaces/table.interface';


@Component({
  selector: 'app-distancia-proyecto-areas-naturales',
  templateUrl: './distancia-proyecto-areas-naturales.component.html',
  styleUrl: './distancia-proyecto-areas-naturales.component.scss'
})
export class DistanciaProyectoAreasNaturalesComponent {
  form: FormGroup;
  activeModal = inject(NgbActiveModal);
  @Input() title!: string;
  @Input() id: number;
  @Input() edicion: Distancia;
  @Input() codMaeSolicitud: number;
  @Input() idCliente: number;
  @Input() idEstudio: number;
  @Input() modoVisualizacion: boolean;

  constructor(private builder: FormBuilder) { }

  closeDialog() {
    this.activeModal.dismiss();
  }

  ngOnInit(): void {
    this.buildForm();
    this.getData(); 
    this.habilitarControles();
  }

  private buildForm(): void{
    this.form = this.builder.group({
      Id: [null],
      AreaNatural: [null, Validators.required],
      Distancia: [null, Validators.required]
    });
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

  get areaNatural() {
    return this.form.get('AreaNatural') as FormControl;
  }
  
  get areaNaturalErrors() {
    return (this.areaNatural.touched || this.areaNatural.dirty) && this.areaNatural.hasError('required')
      ? 'Obligatorio'
      : '';
  }

  get distancia() {
    return this.form.get('Distancia') as FormControl;
  }
  get distanciaErrors() {
    return (this.distancia.touched || this.distancia.dirty) && this.distancia.hasError('required')
      ? 'Obligatorio'
      : '';
  }
 

  private getData(): void {
    if (this.edicion !== undefined) {
      this.form.patchValue(this.edicion);
      this.id = this.edicion.Id;
    }
    this.form.patchValue({ Id: this.id });
  }
 
  save(){ 
 
    if (this.form.valid) {
      this.activeModal.close({...this.form.value});
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
  
  soloNumeros(vent: KeyboardEvent, campo: string) {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/[^0-9]/g, ''); // Solo permite números
    this.form.get(campo)?.setValue(value);
  }
}
