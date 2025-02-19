import { Component, Input, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormularioDIAResponse } from 'src/app/core/models/Formularios/FormularioMain';
import { ArchivoAdjunto, Arqueologia, FormularioSolicitudDIA } from 'src/app/core/models/Tramite/FormularioSolicitudDIA';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { TramiteService } from 'src/app/core/services/tramite/tramite.service';


@Component({
  selector: 'arqueologia-patrimonio-cultural-dialog',
  templateUrl: './arqueologia-patrimonio-cultural-dialog.component.html',

})
export class ArqueologiaPatrimonioCulturalDialog implements OnInit {
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
  documentos: ArchivoAdjunto[] = [];
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

  private buildForm(): void {
    this.form = this.builder.group({
      Descripcion: [null, Validators.required]
    });
  }

  private getData(): void {
    this.funcionesMtcService.mostrarCargando();
    //const codigoSolicitud = Number(localStorage.getItem('tramite-id'));
    this.tramiteService.getFormularioDia(this.codMaeSolicitud).subscribe(resp => {
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
    this.form.patchValue(data.Arqueologia);
    this.documentos = data.Arqueologia.Documentos;
  }

  closeDialog() {
    this.activeModal.dismiss();
  }

  save(form: FormGroup) {
    const datos: Arqueologia = form.value;
    datos.Documentos = this.documentos;
    this.data.Arqueologia = datos;
    this.data.Arqueologia.Save = true;
    this.data.Arqueologia.FechaRegistro = this.funcionesMtcService.dateNow();
    this.data.Arqueologia.State = this.validarFormularioSolicitudDIA(this.data);
    this.GuardarJson(this.data);
  }

  validateArqueologia(arqueologia: Arqueologia): boolean {
    // Validar que Descripcion no esté vacía
    if (!arqueologia.Descripcion.trim()) {
      return false;
    }

    // Validar que Documentos contenga al menos un documento
    if (!arqueologia.Documentos || arqueologia.Documentos.length === 0) {
      return false;
    }

    return true;
  }

  validarFormularioSolicitudDIA(formulario: FormularioSolicitudDIA): number {
    if (!this.data.Arqueologia.Save) return 0;
    if (!this.validateArqueologia(formulario.Arqueologia)) return 1;
    return 2;
  }

  private GuardarJson(data: FormularioSolicitudDIA) {
    const objeto: FormularioDIAResponse = {
      codMaeSolicitud: this.codMaeSolicitud, //Number(localStorage.getItem('tramite-id')),
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

  agregarDocumento(item: ArchivoAdjunto) {//AttachButtonComponent - Documentos Adjuntos
    this.documentos.push(item);
  }

  actualizarDocumentos(documentos: ArchivoAdjunto[]) {
      this.documentos = documentos;
    }

  ver() {
    if (this.estadoSolicitud !== 'EN PROCESO') {
      return true;
    }
    return false;
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
}
