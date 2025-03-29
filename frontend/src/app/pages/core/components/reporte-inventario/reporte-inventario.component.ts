import { Component, OnInit } from '@angular/core';
import { SeguridadService } from 'src/app/core/services/seguridad.service';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { ReporteService } from 'src/app/core/services/inventario/reporte.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-reporte-inventario',
  templateUrl: './reporte-inventario.component.html',
  styleUrls: ['./reporte-inventario.component.css']
})
export class ReporteInventarioComponent implements OnInit {
  form: FormGroup;

  constructor(
    private builder: FormBuilder,
    private seguridadService: SeguridadService,
    private modalService: NgbModal,
    private funcionesMtcService: FuncionesMtcService,
    private route: Router,
    private reporteService: ReporteService,
  ) {
  }

  ngOnInit(): void {
    this.buildForm();
  }

  private buildForm(): void {
    this.form = this.builder.group({
      idTipoReporte: ["", Validators.required],
      fechaInicio: ["", Validators.required],
      fechaFin: ["", Validators.required],
    });
  }

  //#region Validaciones

  get idTipoReporte() {
    return this.form.get('idTipoReporte') as FormControl;
  }

  get idTipoReporteErrors() {
    return (this.idTipoReporte.touched || this.idTipoReporte.dirty) && this.idTipoReporte.hasError('required')
      ? 'Obligatorio'
      : '';
  }

  get fechaInicio() {
    return this.form.get('fechaInicio') as FormControl;
  }

  get fechaInicioErrors() {
    return (this.fechaInicio.touched || this.fechaInicio.dirty) && this.fechaInicio.hasError('required')
      ? 'Obligatorio'
      : '';
  }

  get fechaFin() {
    return this.form.get('fechaFin') as FormControl;
  }

  get fechaFinErrors() {
    return (this.fechaFin.touched || this.fechaFin.dirty) && this.fechaFin.hasError('required')
      ? 'Obligatorio'
      : '';
  }
  //#endregion

  onReset() {
    this.form.reset();
    this.form.controls.idTipoReporte.setValue('');
    this.form.controls.fechaInicio.setValue('');
    this.form.controls.fechaFin.setValue('');
  }

  onDownload(form: FormGroup) { 
    if (this.form.invalid) {
      // Mostrar mensajes de error si los campos son inválidos
      if (this.idTipoReporte.invalid) {
        this.idTipoReporte.markAsTouched();
      }
      if (this.fechaInicio.invalid) {
        this.fechaInicio.markAsTouched();
      }
      if (this.fechaFin.invalid) {
        this.fechaFin.markAsTouched();
      }
      this.funcionesMtcService.mensajeError('Por favor, complete todos los campos obligatorios.');
      return;
    }
    
    this.funcionesMtcService.mostrarCargando();
    const { idTipoReporte, fechaInicio, fechaFin } = form.value;
    const params = {
      fechaInicio: fechaInicio,
      fechaFin: fechaFin
    };
    this.reporteService.postReporteKardex(params, parseInt(idTipoReporte));
    this.funcionesMtcService.ocultarCargando();
  }

}

