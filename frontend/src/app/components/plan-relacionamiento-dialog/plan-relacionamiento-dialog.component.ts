import { Component, Input, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormularioDIAResponse } from 'src/app/core/models/Formularios/FormularioMain';
import { FormularioSolicitudDIA, ProtocoloRelacionamiento } from 'src/app/core/models/Tramite/FormularioSolicitudDIA';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { TramiteService } from 'src/app/core/services/tramite/tramite.service';

@Component({
  selector: 'plan-relacionamiento-dialog',
  templateUrl: './plan-relacionamiento-dialog.component.html',
})
export class PlanRelacionamientoDialogComponent implements OnInit {
  form: FormGroup;
  selectedUnit: string = '';
  activeModal = inject(NgbActiveModal);
  @Input() title!: string;
  @Input() codMaeSolicitud: number;
  @Input() idCliente: number;
  @Input() idEstudio: number;
  @Input() modoVisualizacion: boolean;
  @Input() codMaeRequisito: number;
  data: FormularioSolicitudDIA;
  estadoSolicitud: string;
  
  constructor(
    private builder: FormBuilder,
    private tramiteService: TramiteService,
    private funcionesMtcService: FuncionesMtcService,
  ) { }

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
    }else{
      if(!this.ver()) this.viewOnly;
    }
  }

  private buildForm(): void {
    this.form = this.builder.group({
      Descripcion: [null, Validators.required]
    });
  }

  private getData(): void {
    this.funcionesMtcService.mostrarCargando();
    const codigoSolicitud = this.codMaeSolicitud;
    this.tramiteService.getFormularioDia(codigoSolicitud).subscribe(resp => {
      this.funcionesMtcService.ocultarCargando();
      if (resp.success) {
        this.data = JSON.parse(resp.data.dataJson);
        this.patchFormValues(this.data);
      }
    });

    const tramite = localStorage.getItem('tramite-selected');
    const tramiteObj = JSON.parse(tramite);
    this.estadoSolicitud = tramiteObj.estadoSolicitud; 
  }

  private patchFormValues(data: FormularioSolicitudDIA): void {
    this.form.patchValue(data.ProtocoloRelacionamiento);
  }

  closeDialog() {
    this.activeModal.dismiss();
  }

  validateProtocoloRelacionamiento(plan: ProtocoloRelacionamiento): boolean {
    if (!plan.Descripcion.trim()) {
      return false;
    }  
    return true;
  }

  validarFormularioSolicitudDIA(formulario: FormularioSolicitudDIA): number {
    if(!this.data.ProtocoloRelacionamiento.Save) return 0;
    if (!this.validateProtocoloRelacionamiento(formulario.ProtocoloRelacionamiento)) return 1;
    return 2;
  }

  save(form: FormGroup) {
    const datos: ProtocoloRelacionamiento = form.value;
    this.data.ProtocoloRelacionamiento = datos;
    this.data.ProtocoloRelacionamiento.Save = true;
    this.data.ProtocoloRelacionamiento.FechaRegistro = this.funcionesMtcService.dateNow();
    this.data.ProtocoloRelacionamiento.State = this.validarFormularioSolicitudDIA(this.data);
    this.GuardarJson(this.data);
    //  this.activeModal.close(datos);
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

  ver(){
    if (this.estadoSolicitud !== 'EN PROCESO') {
    return true;
    }
    return false;
  }
}
