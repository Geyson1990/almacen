import { Component, Input, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormularioSolicitudDIA, FuenteAbastecimientoEnergia } from 'src/app/core/models/Tramite/FormularioSolicitudDIA';
import { TableRow } from 'src/app/shared/components/table/interfaces/table.interface';

@Component({
  selector: 'app-fuente-abastecimiento',
  templateUrl: './fuente-abastecimiento.component.html',
  styleUrl: './fuente-abastecimiento.component.scss'
})
export class FuenteAbastecimientoComponent implements OnInit {
  form: FormGroup;
  activeModal = inject(NgbActiveModal);
  @Input() title!: string;
  @Input() id: number;
  @Input() edicion: FuenteAbastecimientoEnergia;
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
      FuenteEnergia: [null, Validators.required],
      Caracteristicas: [null, Validators.required]
    });
  }

  get fuenteEnergia() {
    return this.form.get('FuenteEnergia') as FormControl;
  }

  get fuenteEnergiaErrors() {
    if (this.fuenteEnergia.hasError('required')) {
      return 'Obligatorio';
    }   
    return '';
  }
  get caracteristicas() {
    return this.form.get('Caracteristicas') as FormControl;
  }

  get caracteristicasErrors() {
    if (this.caracteristicas.hasError('required')) {
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
      const datos: FuenteAbastecimientoEnergia = {
        ...form.value,
        Id: this.id
      }; 
              
      this.activeModal.close(datos);
    }
    
  }
  
  closeDialog() {
    this.activeModal.dismiss();
  }
}
