import { Component, Input, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormularioDIAResponse } from 'src/app/core/models/Formularios/FormularioMain';
import { DescripcionMedioFisico, FormularioSolicitudDIA } from 'src/app/core/models/Tramite/FormularioSolicitudDIA';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { TramiteService } from 'src/app/core/services/tramite/tramite.service';
import { TableRow } from 'src/app/shared/components/table/interfaces/table.interface';

@Component({
  selector: 'descripcion-medio-fisico-dialog',
  templateUrl: './descripcion-medio-fisico-dialog.component.html',
})
export class DescripcionMedioFisicoDialog implements OnInit {
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
      Metereologia: [null, Validators.required],
      CalidadAire: [null, Validators.required],
      CalidadRuidoAmbiental: [null, Validators.required],
      Topografia: [null, Validators.required],
      Geologia: [null, Validators.required],
      Geomorfologia: [null, Validators.required],
      Hidrologia: [null, Validators.required],
      Hidrogeologia: [null, Validators.required],
      CalidadAgua: [null, Validators.required],
      EstudioSuelo: [null, Validators.required],
      ClasificacionTierras: [null, Validators.required],
      UsoActualTierra: [null, Validators.required],
      CalidadSuelos: [null, Validators.required],
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

  private patchFormValues(data:FormularioSolicitudDIA): void {
    this.form.patchValue(data.DescripcionMedioFisico);       
  }

  closeDialog() {
    this.activeModal.dismiss();
  }

  save(form:FormGroup){    
    let data = form.value;

    const datos: DescripcionMedioFisico = {
      Metereologia: data.Metereologia,
      CalidadAire: data.CalidadAire,
      CalidadRuidoAmbiental: data.CalidadRuidoAmbiental,
      Topografia: data.Topografia,
      Geologia: data.Geologia,
      Geomorfologia: data.Geomorfologia,
      Hidrologia: data.Hidrologia,
      Hidrogeologia:data.Hidrogeologia,
      CalidadAgua: data.CalidadAgua,
      EstudioSuelo: data.EstudioSuelo,
      ClasificacionTierras: data.ClasificacionTierras,
      UsoActualTierra: data.UsoActualTierra,
      CalidadSuelos: data.CalidadSuelos,
      Save: true,
      FechaRegistro: this.funcionesMtcService.dateNow(),
      State: 0
    };

    this.data.DescripcionMedioFisico = datos;
    this.data.DescripcionMedioFisico.State = this.validarFormularioSolicitudDIA(this.data);
     //this.activeModal.close(datos);
     this.GuardarJson(this.data);
  }

  validateDescripcionMedioFisico(descripcion: DescripcionMedioFisico): boolean {
    const requiredFields = [
      'Metereologia', 'CalidadAire', 'CalidadRuidoAmbiental', 'Topografia', 'Geologia', 
      'Geomorfologia', 'Hidrologia', 'Hidrogeologia', 'CalidadAgua', 'EstudioSuelo', 
      'ClasificacionTierras', 'UsoActualTierra', 'CalidadSuelos'
    ];
  
    for (const field of requiredFields) {
      const fieldValue = descripcion[field as keyof DescripcionMedioFisico];
      if (typeof fieldValue === 'string' && !fieldValue.trim()) {
        return false;
      }
    }
    
    return true;
  }

  validarFormularioSolicitudDIA(formulario: FormularioSolicitudDIA): number {
    if(!this.data.DescripcionMedioFisico.Save) return 0;
    if (!this.validateDescripcionMedioFisico(formulario.DescripcionMedioFisico)) return 1;
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
