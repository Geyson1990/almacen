import { Component, OnInit, Input } from '@angular/core';
import { AbstractControl, UntypedFormArray, UntypedFormControl, UntypedFormGroup, FormGroupDirective } from '@angular/forms';

@Component({
  selector: 'app-form-encuesta-escala-likert',
  templateUrl: './form-encuesta-escala-likert.component.html',
  styleUrls: ['./form-encuesta-escala-likert.component.css'],
})
export class FormEncuestaEscalaLikertComponent implements OnInit {
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

  onChangeOpcion(event: any, value: any, control: UntypedFormControl){
    control.get("respuesta").setValue(value.toString())
  }
}
