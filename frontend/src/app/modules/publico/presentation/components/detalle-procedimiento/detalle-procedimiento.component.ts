import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgbCollapse, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TipoSolicitudModel } from 'src/app/core/models/TipoSolicitudModel';
import { ProcedimientoModel } from 'src/app/core/models/Tramite/ProcedimientoModel';
import { RequisitoModel } from 'src/app/core/models/Tramite/RequisitoModel';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { RelacionTupasService } from 'src/app/core/services/servicios/relacion-tupas.service';
import { VisorPdfArchivosService } from 'src/app/core/services/tramite/visor-pdf-archivos.service';
import { MateriaUseCase } from '../../../application/usecases';
import { Procedimiento } from 'src/app/core/models/Portal/procedimiento';
import {
  DetalleProcedimiento,
  PagoAdicional,
  Requisito,
} from 'src/app/core/models/Portal/detalle-procedimiento';
import { EMPTY, Observable, Subscription } from 'rxjs';
import { catchError, first, map } from 'rxjs/operators';
import { VistaPdfComponent } from 'src/app/shared/components/vista-pdf/vista-pdf.component';
import { Store } from '@ngrx/store';
import { PublicoAppState } from '../../state/app.state';
import { uncollapseProced } from '../../state/actions/procedimiento.actions';
import { selectIdProcUncollapse } from '../../state/selectors/procedimiento.selector';

@Component({
  selector: 'app-detalle-procedimiento',
  templateUrl: './detalle-procedimiento.component.html',
  styleUrls: ['./detalle-procedimiento.component.scss'],
})
export class DetalleProcedimientoComponent implements OnInit, OnDestroy {
  subs: Subscription[] = [];

  @ViewChild('collapse') collapse: NgbCollapse;
  @Input() procedimiento: Procedimiento;

  isCollapsed = true;

  detalleProcedimiento: DetalleProcedimiento;
  tipoSolicitudSelected: string;
  requisitoFilterList: Requisito[] = [];
  pagoAddFilterList: PagoAdicional[] = [];
  tipoSolicitudModel: string;

  constructor(
    private readonly _funcionesMtcService: FuncionesMtcService,
    private readonly _relacionTupasService: RelacionTupasService,
    private readonly _materiaUseCase: MateriaUseCase,
    private readonly _visorPdfArchivosService: VisorPdfArchivosService,
    private readonly _store: Store<PublicoAppState>,
    private readonly _modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.subs.push(
      this._store
        .select(selectIdProcUncollapse)
        .subscribe((idProcUncollapse) => {
          if (
            this.isCollapsed === false &&
            (!idProcUncollapse ||
              idProcUncollapse !== this.procedimiento.idproc)
          ) {
            // this.isCollapsed = true;
            this.collapse.toggle(false);
          }
        })
    );
  }

  onShownDetalle(btnCabecera: HTMLButtonElement): void {
    setTimeout(() => {
      btnCabecera.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest',
      });
    }, 50);
  }

  cargarDetalleProced(btnCabecera: HTMLButtonElement): void {
    btnCabecera.disabled = true;

    if (this.isCollapsed) {
      this._store.dispatch(
        uncollapseProced({ idProcUncollapse: this.procedimiento.idproc })
      );
    }

    if (this.detalleProcedimiento) {
      this.collapse.toggle();
      btnCabecera.disabled = false;
      return;
    }

    this._funcionesMtcService.mostrarCargando();
    this.subs.push(
      this._relacionTupasService
        .obtenerProcedPortal(this.procedimiento.idproc)
        .subscribe(
          (response) => {
            if (!response.success || !response.data) {
              this._funcionesMtcService.mensajeError(response.message);
              return;
            }

            console.log(response);

            this.detalleProcedimiento = response.data;
            this.detalleProcedimiento.tipoPersonaTxt =
              response.data.tipoPersonaList
                .map((r) => r.tipoPersonaDesc)
                .join(', ');

            if (this.detalleProcedimiento.tipoSolicitudList?.length > 0) {
              this.tipoSolicitudSelected =
                this.detalleProcedimiento.tipoSolicitudList[0].idtiposolicitud.toString();
              this.requisitoFilterList =
                this.detalleProcedimiento.requisitoList.filter(
                  (r) =>
                    r.tipoSolicitud === Number(this.tipoSolicitudSelected) ||
                    !r.tipoSolicitud
                );
              this.pagoAddFilterList =
                this.detalleProcedimiento.pagoAdicionalList.filter(
                  (r) =>
                    r.tipoSolicitud === Number(this.tipoSolicitudSelected) ||
                    !r.tipoSolicitud
                );
            } else {
              this.requisitoFilterList =
                this.detalleProcedimiento.requisitoList.filter(
                  (r) => !r.tipoSolicitud
                );
              this.pagoAddFilterList =
                this.detalleProcedimiento.pagoAdicionalList.filter(
                  (r) => !r.tipoSolicitud
                );
            }
            this.calcularOrden();

            btnCabecera.disabled = false;
            this._funcionesMtcService.ocultarCargando();
            this.collapse.toggle();
          },
          () => {
            this._funcionesMtcService.ocultarCargando();
            this._funcionesMtcService.mensajeError(
              'No se pudo cargar los procedimientos'
            );
            btnCabecera.disabled = false;
          }
        )
    );
  }

  onTipoSolicitudChange(value: number): void {
    if (value) {
      this.requisitoFilterList = this.detalleProcedimiento.requisitoList.filter(
        (r) => r.tipoSolicitud === Number(value) || !r.tipoSolicitud
      );
      this.pagoAddFilterList =
        this.detalleProcedimiento.pagoAdicionalList.filter(
          (r) => r.tipoSolicitud === Number(value) || !r.tipoSolicitud
        );
    } else {
      this.requisitoFilterList = this.detalleProcedimiento.requisitoList.filter(
        (r) => !r.tipoSolicitud
      );
      this.pagoAddFilterList =
        this.detalleProcedimiento.pagoAdicionalList.filter(
          (r) => !r.tipoSolicitud
        );
    }
    this.calcularOrden();
  }

  calcularOrden(): void {
    let nuevoOrden = 0;
    for (const requisito of this.requisitoFilterList) {
      const { auxOrden: orden } = requisito;
      if (nuevoOrden !== orden) {
        nuevoOrden = orden;
        requisito.ordenTxt = orden.toString();
      } else {
        requisito.ordenTxt = '';
      }
    }
  }

  verFichaTupa() {
    const modalRef = this._modalService.open(VistaPdfComponent, {
      size: 'xl',
      scrollable: true,
    });
    modalRef.componentInstance.pdfUrl = this.detalleProcedimiento.fichaTupa;
    modalRef.componentInstance.titleModal = 'Ficha TUPA';
  }

  verManualTupa() {
    const modalRef = this._modalService.open(VistaPdfComponent, {
      size: 'xl',
      scrollable: true,
    });
    modalRef.componentInstance.pdfUrl = this.detalleProcedimiento.manualTupa;
    modalRef.componentInstance.titleModal = 'Manual TUPA';
  }

  verDocumentoAdj(event: Event, fileName: string, fileUrl: string) {
    event.preventDefault();

    const modalRef = this._modalService.open(VistaPdfComponent, {
      size: 'xl',
      scrollable: true,
    });
    modalRef.componentInstance.pdfUrl = fileUrl;
    modalRef.componentInstance.titleModal = fileName
      ? `Formulario: ${fileName}`
      : 'Formulario';
  }

  ngOnDestroy(): void {
    this.subs.forEach((subscription) => {
      if (subscription !== undefined) {
        subscription.unsubscribe();
      }
    });
  }
}
