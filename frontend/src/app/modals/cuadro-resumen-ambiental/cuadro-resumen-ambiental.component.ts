import { Component, Input, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ComboGenerico } from 'src/app/core/models/Maestros/ComboGenerico';
import { Compromisos, FormularioSolicitudDIA } from 'src/app/core/models/Tramite/FormularioSolicitudDIA';

@Component({
  selector: 'app-cuadro-resumen-ambiental',
  templateUrl: './cuadro-resumen-ambiental.component.html',
  styleUrl: './cuadro-resumen-ambiental.component.scss'
})
export class CuadroResumenAmbientalComponent  implements OnInit {
  form: FormGroup;
  activeModal = inject(NgbActiveModal);
  @Input() title!: string;
  selectedMecanismo: string = '';
  selectedSecuencia: string = '';
  @Input() data: FormularioSolicitudDIA;  
  @Input() edicion: Compromisos;
  @Input() etapa: ComboGenerico[];
  @Input() tipoActividad: ComboGenerico[];
  @Input() codMaeSolicitud: number;
  @Input() idCliente: number;
  @Input() idEstudio: number;
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
      Descripcion: [null, Validators.required],
      Etapas: ['', Validators.required],
      TipoActividad: ['', Validators.required],
      CostoEstimado: [null, Validators.required],
      Tecnologia: [null, Validators.required]
    });
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

  get etapas() {
    return this.form.get('Etapas') as FormControl;
  }

  get etapasErrors() {
    if (this.etapas.hasError('required')) {
      return 'Obligatorio';
    }   
    return '';
  }

  get actividad() {
    return this.form.get('TipoActividad') as FormControl;
  }

  get tipoActividadErrors() {
    if (this.actividad.hasError('required')) {
      return 'Obligatorio';
    }   
    return '';
  }
   
  get costoEstimado() {
    return this.form.get('CostoEstimado') as FormControl;
  }

  get costoEstimadoErrors() {
    if (this.costoEstimado.hasError('required')) {
      return 'Obligatorio';
    }   
    return '';
  }
  
  get tecnologia() {
    return this.form.get('Tecnologia') as FormControl;
  }

  get tecnologiaErrors() {
    if (this.tecnologia.hasError('required')) {
      return 'Obligatorio';
    }   
    return '';
  }
   

  private getData(): void{
    if (this.edicion !== undefined) {
      this.form.patchValue(this.edicion);
    }
  }

  closeDialog() {
    this.activeModal.dismiss();
  }

  save(form:FormGroup){    
    
    if (form.valid) {
      let data:Compromisos = form.value;

      // const datos: Compromisos = {
      //   Descripcion: data.Descripcion,
      //   Etapas: data.Etapas,
      //   TipoActividad: data.TipoActividad,
      //   CostoEstimado: data.CostoEstimado,
      //   Tecnologia: data.Tecnologia
      // };
  
       this.activeModal.close(data);
    }
    
  }

  soloNumeros(vent: KeyboardEvent, campo: string) {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/[^0-9]/g, ''); // Solo permite números
    this.form.get(campo)?.setValue(value);
  }
}
