import { Component, Input, OnInit, inject, } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormularioDIAResponse } from 'src/app/core/models/Formularios/FormularioMain';
import { DescripcionAspectoSocial, FormularioSolicitudDIA } from 'src/app/core/models/Tramite/FormularioSolicitudDIA';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { TramiteService } from 'src/app/core/services/tramite/tramite.service';


@Component({
  selector: 'descripcion-caract-soc-eco-cul-anto-dialog',
  templateUrl: './descripcion-caract-soc-eco-cul-anto-dialog.component.html',

})
export class DescripcionCaractSocEcoCulAntoDialog implements OnInit {
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

  private buildForm(): void{
    this.form = this.builder.group({
      Indices: [null, Validators.required],
      Descripcion: [null, Validators.required],
      OtrosAspectos: [null, Validators.required]
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
    this.form.patchValue(data.DescripcionAspectoSocial);
  }  

  closeDialog() {
    this.activeModal.dismiss();
  }

  validateDescripcionAspectoSocial(descripcion: DescripcionAspectoSocial): boolean {
    // Validar que las propiedades de tipo string no estén vacías
    const requiredFields = ['Indices', 'Descripcion', 'OtrosAspectos'];
  
    for (const field of requiredFields) {
      const fieldValue = descripcion[field as keyof DescripcionAspectoSocial];
      // Asegurarse de que el valor es una cadena de texto antes de aplicar trim
      if (typeof fieldValue === 'string' && !fieldValue.trim()) {
        return false;
      }
    }
  
    return true;
  }

  validarFormularioSolicitudDIA(formulario: FormularioSolicitudDIA): number {
    if(!this.data.DescripcionAspectoSocial.Save) return 0;
    if (!this.validateDescripcionAspectoSocial(formulario.DescripcionAspectoSocial)) return 1;
    return 2;
  }


  save(form:FormGroup){
    const datos: DescripcionAspectoSocial = form.value;
    this.data.DescripcionAspectoSocial = datos;
    this.data.DescripcionAspectoSocial.Save = true;
    this.data.DescripcionAspectoSocial.FechaRegistro = this.funcionesMtcService.dateNow();
    this.data.DescripcionAspectoSocial.State = this.validarFormularioSolicitudDIA(this.data);
    this.GuardarJson(this.data);
     //this.activeModal.close(datos);
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

  ver(){
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
