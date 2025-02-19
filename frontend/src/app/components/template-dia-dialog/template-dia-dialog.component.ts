import { Component, Input, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { FormularioDIAResponse } from 'src/app/core/models/Formularios/FormularioMain';
import { Antecedentes, ComponenteNoCerrado, CorreoNotificacion, DatosGenerales, DatosRepresentante, DatosTitular, DatosGeneralesEmpresa, DescripcionProyecto, Distancia, Estudio, FormularioSolicitudDIA, PasivoAmbiental, Permiso, RepresentanteAcreditado, DerechosMineros } from 'src/app/core/models/Tramite/FormularioSolicitudDIA';
//import { Antecedentes, CorreoNotificacion, DatosGenerales, DatosGeneralesEmpresa, DatosRepresentante, DatosTitular, DescripcionProyecto, Distancia, Estudio, FormularioSolicitudDIA, PasivoAmbiental, Permiso, RepresentanteAcreditado } from 'src/app/core/models/Tramite/FormularioSolicitudDIA';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { SeguridadService } from 'src/app/core/services/seguridad.service';
import { ExternoService } from 'src/app/core/services/servicios/externo.service';
import { TramiteService } from 'src/app/core/services/tramite/tramite.service';
import { AreaSuperficialActivityComponent } from 'src/app/modals/area-superficial-activity/area-superficial-activity.component';
import { ComponentesNoCerradosComponent } from 'src/app/modals/componentes-no-cerrados/componentes-no-cerrados.component';
import { DistanciaProyectoAreasNaturalesComponent } from 'src/app/modals/distancia-proyecto-areas-naturales/distancia-proyecto-areas-naturales.component';
import { EstudiosInvestigacionesComponent } from 'src/app/modals/estudios-investigaciones/estudios-investigaciones.component';
import { PermisosLicenciasComponent } from 'src/app/modals/permisos-licencias/permisos-licencias.component';
import { IOption, TableColumn, TableRow } from 'src/app/shared/components/table/interfaces/table.interface';
import { UnidadMinera } from 'src/app/core/models/Externos/UnidadMinera';
import { Observable, catchError, map, of } from 'rxjs';
import { AreasNaturalesProtegidas } from 'src/app/core/models/Externos/areas-protegidas';
import { ComboGenerico } from 'src/app/core/models/Maestros/ComboGenerico';
import { CONSTANTES } from 'src/app/enums/constants';
import { FormularioTramiteService } from 'src/app/core/services/tramite/formulario-tramite.service';

@Component({
  selector: 'template-dia-dialog',
  templateUrl: './template-dia-dialog.component.html',
})
export class AntecedentesDialogComponent implements OnInit {
  pdfSrc: string | ArrayBuffer | null = null;

  constructor(
    private tramiteService: TramiteService,
    private funcionesMtcService: FuncionesMtcService,
    private formularioService: FormularioTramiteService
  ) {}

  ngOnInit(): void {
    this.cargarPDF();
  }

  cargarPDF() {
    this.formularioService.visorPdf(4).subscribe((pdfData) => {
      this.pdfSrc = this.arrayBufferToBase64(pdfData.data);

      // Abre el modal usando Bootstrap
      // const modalElement = document.getElementById('pdfModal')!;
      // const modal = new bootstrap.Modal(modalElement);
      // modal.show();
    });
  }

  arrayBufferToBase64(buffer: Uint8Array): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return 'data:application/pdf;base64,' + btoa(binary);
  }

  downloadPdf() {
    const link = document.createElement('a');
    link.href = this.pdfSrc as string;
    link.download = 'documento.pdf';
    link.click();
  }
  
}
