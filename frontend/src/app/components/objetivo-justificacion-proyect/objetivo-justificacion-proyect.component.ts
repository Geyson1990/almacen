import { Component, Inject, Input, OnInit, inject } from '@angular/core';
import { TupaAttachButtonComponent } from '../attach-button/attach-button.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TramiteService } from 'src/app/core/services/tramite/tramite.service';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { FormularioSolicitudDIA } from 'src/app/core/models/Tramite/FormularioSolicitudDIA';
import { FormularioDIAResponse } from 'src/app/core/models/Formularios/FormularioMain';


@Component({
  selector: 'objetivo-justificacion-proyect-dialog',
  templateUrl: './objetivo-justificacion-proyect.component.html',
})
export class ObjetivoJustificacionProyectDialogComponent implements OnInit{
  form: FormGroup;
  activeModal = inject(NgbActiveModal);
  @Input() title!: string;
  data: FormularioSolicitudDIA;
  estadoSolicitud: string;
  @Input() modoVisualizacion: boolean;
  @Input() codMaeSolicitud: number;  
  @Input() codMaeRequisito: number;
  //@Input() estadoSolicitud: string;

  //#region ViewOnly

  get viewOnly() { return this.modoVisualizacion; }

  get viewControl() { return !this.modoVisualizacion; }

  habilitarControles() {
    if (this.viewOnly) {
      Object.keys(this.form.controls).forEach(controlName => {
        const control = this.form.get(controlName);
        control?.disable();
      });
    }else{
      if(!this.ver()) this.viewOnly;
    }
  }
  //#endregion ViewOnly

  constructor(private builder: FormBuilder,
    private tramiteService: TramiteService,
    private funcionesMtcService: FuncionesMtcService,
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.getData();
    this.habilitarControles();
  }

  private getData(): void {
    this.funcionesMtcService.mostrarCargando();
    const codigoSolicitud = this.codMaeSolicitud;
    this.tramiteService.getFormularioDia(codigoSolicitud).subscribe(resp => {
      this.funcionesMtcService.ocultarCargando();
      if (resp.success) {
        this.data = JSON.parse(resp.data.dataJson);
        this.patchFormValues();
      }
    });

    const tramite = localStorage.getItem('tramite-selected');
    const tramiteObj = JSON.parse(tramite);
    this.estadoSolicitud = tramiteObj.estadoSolicitud; 
  }

  private patchFormValues(): void {
    this.form.patchValue({Objetivo: this.data.Objetivo});
  }

  private buildForm(): void{
    this.form = this.builder.group({
      Objetivo: [null, Validators.required]
    });
  }

  private GuardarJson(data: FormularioSolicitudDIA) {
    const objeto: FormularioDIAResponse = {
      codMaeSolicitud: this.codMaeSolicitud,
      codMaeRequisito: this.codMaeRequisito,
      dataJson: JSON.stringify(data)
    };

    this.tramiteService.postGuardarFormulario(objeto).subscribe(resp => {
      this.funcionesMtcService.ocultarCargando();
      if (resp.success)
        this.funcionesMtcService.ocultarCargando().mensajeOk('Se grabó el formulario').then(() => this.closeDialog());
      else
        this.funcionesMtcService.ocultarCargando().mensajeError('No se grabó el formulario');
    });
  }

 closeDialog(){
    this.activeModal.dismiss();
  }

  validarDatosObjeto(obj: string): boolean {
    if (!obj || obj.trim() === '') return false;
    return true;
  }
  
  validarFormularioSolicitudDIA(formulario: FormularioSolicitudDIA): number {
    if(this.data.DescripcionProyecto.Objetivo?.trim() === undefined ||
    this.data.DescripcionProyecto.Objetivo?.trim() === '') return 0;
    if (!this.validarDatosObjeto(formulario.DescripcionProyecto.Objetivo)) return 1;
    return 2;
  }

  save(form:FormGroup){  
    let data = form.value;
    this.data.Objetivo = data.Objetivo;
    this.data.DescripcionProyecto.Objetivo = data.Objetivo;
    this.data.DescripcionProyecto.Save = true;
    this.data.DescripcionProyecto.StateObjetivo= this.validarFormularioSolicitudDIA(this.data);
    this.data.DescripcionProyecto.FechaRegistro = this.funcionesMtcService.dateNow();
    this.GuardarJson(this.data);
  }

  ver(){
    if (this.estadoSolicitud !== 'EN PROCESO') {
    return true;
    }
    return false;
  }
}
