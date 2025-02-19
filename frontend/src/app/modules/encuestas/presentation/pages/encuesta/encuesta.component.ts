import { Component, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormArray, UntypedFormBuilder, FormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { customValidateArrayGroup } from 'src/app/helpers/validator';
import { EncuestaUseCase } from '../../../application/usecases';
import { FinalizarEncuestaUseCase } from '../../../application/usecases/guardar-encuesta.usecase';
import { EncuestaPlantilla, OpcionConfig, PreguntaConfig, SeccionConfig, TipoEncuestaEnum, TipoPreguntaEnum } from '../../../domain';

@Component({
  selector: 'app-encuesta',
  templateUrl: './encuesta.component.html',
  styleUrls: ['./encuesta.component.css'],
})
export class EncuestaComponent implements OnInit {
  TIPO_ENCUESTA: number
  encuestaPlantilla: EncuestaPlantilla|null
  encuestaForm!: UntypedFormGroup
  encuestaEnviada = false
  errores: Array<string> = null

  constructor(
    private readonly fb: UntypedFormBuilder,
    private readonly route: ActivatedRoute,
    private readonly router : Router,
    private readonly encuestaUseCase: EncuestaUseCase,
    private readonly finalizarEncuestaUseCase: FinalizarEncuestaUseCase,
    private readonly funcionesMtcService: FuncionesMtcService,
  ) {


   }

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap:any) => {
      const {params} = paramMap;
      this.encuestaUseCase.obtenerPlantilla(Number(params.idEncuesta), params.codIdentificador)
      .subscribe((data) => {
        this.setForm(data)
        this.encuestaPlantilla = data;
        console.log("this.encuestaPlantilla", this.encuestaPlantilla)
      }, (error) => {
        this.errores = error?.error?.errors
        console.log("this.errores",this.errores)
        // this.funcionesMtcService.mensajeError("Ocurrió un problema al intentar obtener la encuesta")
        // .then(() => {
        //   this.router.navigate(['/']);
        // })
      });
    });

  }

  get TipoEncuestaEnum() {
    return TipoEncuestaEnum;
  }

  setForm(data: EncuestaPlantilla){
    this.encuestaForm = this.fb.group({
      fechaCaduca: [data.fechaCaduca],
      // estado:[data.estado],
      encuestaConfig: this.fb.group({
        idTipoEncuesta: [data.encuestaConfig.idEncuestaConfig],
        titulo: [data.encuestaConfig.titulo],
        idEncuestaConfig: [data.encuestaConfig.idEncuestaConfig],
        descripcion: [data.encuestaConfig.descripcion],
        flagComentarios: [data.encuestaConfig.flagComentarios],
        comentarios: [''],
        secciones: this.fb.array([]),
      }),
    })

    this.patchForm(data.encuestaConfig.secciones)
  }

  private patchForm(secciones: SeccionConfig[]) {
    const formArray = <UntypedFormArray>this.encuestaForm.get('encuestaConfig.secciones');
    secciones.forEach((data) => {
      formArray.push(this.patchFormValuesSeccion(data))
    });
  }

  private patchFormValuesSeccion(seccion: SeccionConfig) {
    const formGroup: UntypedFormGroup = this.fb.group({
      idSeccionConfig: [seccion.idSeccionConfig],
      nombre: [seccion.nombre],
      flagCompartido: [seccion.flagCompartido],
      orden: [seccion.orden],
      preguntas: this.fb.array([]),
    })

    const formArray = <UntypedFormArray>formGroup.get('preguntas');
    seccion.preguntas.forEach((data) => {
      formArray.push(this.patchFormValuesPregunta(data))
    });

    return formGroup
  }

  private patchFormValuesPregunta(pregunta: PreguntaConfig) {
    const formGroup: UntypedFormGroup = this.fb.group({
      idSeccionConfig: [pregunta.idSeccionConfig],
      idPreguntaConfig: [pregunta.idPreguntaConfig],
      descripcion: [pregunta.descripcion],
      idTipoPregunta: [pregunta.idTipoPregunta],
      flagObligatorio: [pregunta.flagObligatorio],
      orden: [pregunta.orden],
      idTipoRespuesta: [pregunta.idTipoRespuesta],
      respuesta: ["",
        pregunta.idTipoPregunta != TipoPreguntaEnum.SELECCION_MULTIPLE && pregunta.flagObligatorio ? [Validators.required] : null], // Respuesta(s) seleccionada(s) por el encuestado => [idOpcionRespuesta]
      opciones: this.fb.array([],
        pregunta.idTipoPregunta == TipoPreguntaEnum.SELECCION_MULTIPLE && pregunta.flagObligatorio ? [customValidateArrayGroup()] : null),
    })

    // if([TipoPreguntaEnum.SELECCION_UNICA, TipoPreguntaEnum.SELECCION_MULTIPLE].includes(pregunta.idTipoPregunta)){
      const formArray = <UntypedFormArray>formGroup.get('opciones');
      pregunta.opciones.forEach((data) => {
        formArray.push(this.patchFormValuesOpcion(data))
      });
    // }

    return formGroup
  }

  private patchFormValuesOpcion(opcion: OpcionConfig) {
    const formGroup: UntypedFormGroup = this.fb.group({
      idOpcionRespuesta: [opcion.idOpcionRespuesta],
      idTipoRespuesta: [opcion.idTipoRespuesta],
      descripcion: [opcion.descripcion],
      valorOpcion: [opcion.valorOpcion],
      orden: [opcion.orden],
      flagOtro: [opcion.flagOtro],
      respuestaOtro: [""],
      seleccionado: [false]
    })

    return formGroup
  }


  get Comentarios(): AbstractControl { return this.encuestaForm.get('encuestaConfig.comentarios'); }

  get CountCaracteresComentarios(): string{
    return this.Comentarios?.value?.length
  }

  findInvalidControlsRecursive(formToInvestigate:UntypedFormGroup|UntypedFormArray):string[] {
    var invalidControls:string[] = [];
    let recursiveFunc = (form:UntypedFormGroup|UntypedFormArray) => {
      Object.keys(form.controls).forEach(field => {
        const control = form.get(field);
        if (control.invalid) invalidControls.push(field);
        if (control instanceof UntypedFormGroup) {
          recursiveFunc(control);
        } else if (control instanceof UntypedFormArray) {
          recursiveFunc(control);
        }
      });
    }
    recursiveFunc(formToInvestigate);
    return invalidControls;
  }

  enviar(){
    // console.log("findInvalidControls", this.findInvalidControlsRecursive(this.encuestaForm));
    if (this.encuestaForm.invalid){
      this.encuestaForm.markAllAsTouched();
      return this.funcionesMtcService.mensajeErrorTit("Encuesta incompleta",'Por favor complete los campos de la encuesta');
    }

    const dataGuardar: EncuestaPlantilla = this.encuestaForm.value
    dataGuardar.idEncuesta = this.encuestaPlantilla.idEncuesta
    dataGuardar.codigoIdentificador = this.encuestaPlantilla.codigoIdentificador
    dataGuardar.idEncuestaConfig = this.encuestaPlantilla.idEncuestaConfig

    console.log("dataGuardar =>", dataGuardar)

    this.funcionesMtcService.mostrarCargando();
    this.finalizarEncuestaUseCase.execute(dataGuardar)
    .subscribe(() => {
      this.funcionesMtcService.ocultarCargando();
      this.encuestaEnviada = true
    }, error => {
      this.funcionesMtcService.ocultarCargando();
      this.funcionesMtcService.mensajeError('Surgió un error al guardar los datos');
      // this.encuestaEnviada = true
    });
  }

  formInvalid(control: AbstractControl): boolean {
    if (control) {
      return control.invalid && (control.dirty || control.touched);
    }
  }
}
