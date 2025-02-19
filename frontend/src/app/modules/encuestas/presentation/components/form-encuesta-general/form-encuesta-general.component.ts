import { Component, OnInit, Input } from '@angular/core';
import { AbstractControl, UntypedFormArray, FormControl, UntypedFormGroup, FormGroupDirective } from '@angular/forms';
import { TipoPreguntaEnum } from '../../../domain';

@Component({
  selector: 'app-form-encuesta-general',
  templateUrl: './form-encuesta-general.component.html',
  styleUrls: ['./form-encuesta-general.component.css'],
})
export class FormEncuestaGeneralComponent implements OnInit {
  @Input() formGroupName: string
  form: UntypedFormGroup

  titulo = 'Inicio';

  constructor(
    private rootFormGroup: FormGroupDirective
  ) {

  }

  ngOnInit(): void {
    this.form = this.rootFormGroup.control.get(this.formGroupName) as UntypedFormGroup
  }

  get Secciones(): UntypedFormArray { return this.form.get(['secciones']) as UntypedFormArray; }

  // onChangeOpcionsSeleccionUnica(event: any, value: any, control: FormControl){
  //   control.get("respuesta").setValue(value.toString())
  // }

  get TipoPreguntaEnum() {
    return TipoPreguntaEnum;
  }

  formInvalid(control: AbstractControl): boolean {
    if (control) {
      return control.invalid && (control.dirty || control.touched);
    }
  }
}
