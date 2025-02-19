import { Component, Input, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ComboGenerico } from 'src/app/core/models/Maestros/ComboGenerico';
import { FormularioSolicitudDIA, PlanManejo } from 'src/app/core/models/Tramite/FormularioSolicitudDIA';
import { TableRow } from 'src/app/shared/components/table/interfaces/table.interface';

@Component({
  selector: 'app-plan-manejo',
  templateUrl: './plan-manejo.component.html',
  styleUrl: './plan-manejo.component.scss'
})
export class PlanManejoComponent implements OnInit{
  form: FormGroup;
  activeModal = inject(NgbActiveModal);
  @Input() title!: string;
  //@Input() data: FormularioSolicitudDIA;
  @Input() etapaFase: ComboGenerico[];
  @Input() edicion: PlanManejo;
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

  private buildForm(): void{
    this.form = this.builder.group({
      Etapa: ['', Validators.required],
      Medidas: [null, Validators.required],
      Riesgos: [null, Validators.required]
    });
  }

  get etapa() {
    return this.form.get('Etapa') as FormControl;
  }

  get etapaErrors() {
    if (this.etapa.hasError('required')) {
      return 'Obligatorio';
    }   
    return '';
  }

  get medidas() {
    return this.form.get('Medidas') as FormControl;
  }

  get medidasErrors() {
    if (this.medidas.hasError('required')) {
      return 'Obligatorio';
    }   
    return '';
  }

  get riesgos() {
    return this.form.get('Riesgos') as FormControl;
  }

  get riesgosErrors() {
    if (this.riesgos.hasError('required')) {
      return 'Obligatorio';
    }   
    return '';
  }

  private getData(): void{
    if (this.edicion !== undefined) {
      this.form.patchValue(this.edicion);
    }
  }

  save(form:FormGroup){
    if (form.valid) {
      const datos: PlanManejo = form.value;
      this.activeModal.close(datos);
    }    
  }

  closeDialog() {
    this.activeModal.dismiss();
  }
}
