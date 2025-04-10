import { Component, OnInit } from '@angular/core';
import { SeguridadService } from 'src/app/core/services/seguridad.service';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { ReporteService } from 'src/app/core/services/inventario/reporte.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiResponse } from 'src/app/core/models/api-response';
import { VistaPdfComponent } from 'src/app/shared/components/vista-pdf/vista-pdf.component';

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
      fechaInicio: [""],
      fechaFin: [""],
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

  // get fechaInicio() {
  //   return this.form.get('fechaInicio') as FormControl;
  // }

  // get fechaInicioErrors() {
  //   return (this.fechaInicio.touched || this.fechaInicio.dirty) && this.fechaInicio.hasError('required')
  //     ? 'Obligatorio'
  //     : '';
  // }

  // get fechaFin() {
  //   return this.form.get('fechaFin') as FormControl;
  // }

  // get fechaFinErrors() {
  //   return (this.fechaFin.touched || this.fechaFin.dirty) && this.fechaFin.hasError('required')
  //     ? 'Obligatorio'
  //     : '';
  // }
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
      // if (this.fechaInicio.invalid) {
      //   this.fechaInicio.markAsTouched();
      // }
      // if (this.fechaFin.invalid) {
      //   this.fechaFin.markAsTouched();
      // }
      this.funcionesMtcService.mensajeError('Por favor, complete todos los campos obligatorios.');
      return;
    }

    this.funcionesMtcService.mostrarCargando();
    const { idTipoReporte, fechaInicio, fechaFin } = form.value;
    const params = {
      fechaInicio: fechaInicio === '' ? null : fechaInicio,
      fechaFin: fechaFin === '' ? null : fechaFin
    };
    this.reporteService.postReporteKardex(params, parseInt(idTipoReporte));
    this.funcionesMtcService.ocultarCargando();
  }

  onReportPdf() {
    if (this.form.invalid) {
      // Mostrar mensajes de error si los campos son inválidos
      if (this.idTipoReporte.invalid) {
        this.idTipoReporte.markAsTouched();
      }
      // if (this.fechaInicio.invalid) {
      //   this.fechaInicio.markAsTouched();
      // }
      // if (this.fechaFin.invalid) {
      //   this.fechaFin.markAsTouched();
      // }
      this.funcionesMtcService.mensajeError('Por favor, complete todos los campos obligatorios.');
      return;
    }

    this.funcionesMtcService.mostrarCargando();
    const { idTipoReporte, fechaInicio, fechaFin } = this.form.value;
    const params = {
      fechaInicio: fechaInicio === '' ? null : fechaInicio,
      fechaFin: fechaFin === '' ? null : fechaFin
    };
    this.reporteService.postReporteKardexPdf(params, parseInt(idTipoReporte)).subscribe((resp: ApiResponse<string>) => {
      if (resp.success) {
        //const file = new Blob([resp.data], { type: 'application/pdf' });
        const byteCharacters = atob(resp.data);
      const byteNumbers = new Array(byteCharacters.length).fill(0).map((_, i) =>
        byteCharacters.charCodeAt(i)
      );

      const byteArray = new Uint8Array(byteNumbers);
      const file = new Blob([byteArray], { type: 'application/pdf' });
      //const url = URL.createObjectURL(blob);

        const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
        const urlPdf = URL.createObjectURL(file);
        modalRef.componentInstance.pdfUrl = urlPdf;
        modalRef.componentInstance.titleModal = "Vista Previa";




        // const url = window.URL.createObjectURL(blob);
        // const a = document.createElement('a');
        // a.href = url;
        // a.download = 'reporte.pdf'; // Nombre del archivo PDF
        // a.click();
        // window.URL.revokeObjectURL(url);
      } else {
        this.funcionesMtcService.mensajeError(resp.message);
      }
    });
    this.funcionesMtcService.ocultarCargando();

  }

}

