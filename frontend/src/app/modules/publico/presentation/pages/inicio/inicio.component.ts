import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewChildren,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { NgbAccordionDirective , NgbActiveModal, NgbModal, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import {
  ProcedimientoModel,
  TupaNota,
} from 'src/app/core/models/Tramite/ProcedimientoModel';
import { RequisitoModel } from 'src/app/core/models/Tramite/RequisitoModel';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { TramiteService } from 'src/app/core/services/tramite/tramite.service';
import { RelacionTupasService } from 'src/app/core/services/servicios/relacion-tupas.service';
import { TipoSolicitudModel } from 'src/app/core/models/TipoSolicitudModel';
import * as _ from 'lodash';
import { Materia } from '../../../domain';
import { MateriaUseCase } from '../../../application/usecases';
import { VisorPdfArchivosService } from 'src/app/core/services/tramite/visor-pdf-archivos.service';
import { VistaPdfComponent } from 'src/app/shared/components/vista-pdf/vista-pdf.component';
import { Subscription } from 'rxjs';
import { Procedimiento } from 'src/app/core/models/Portal/procedimiento';
import { Store } from '@ngrx/store';
import { PublicoAppState } from '../../state/app.state';
import { uncollapseProced } from '../../state/actions/procedimiento.actions';
import { Route, Router } from '@angular/router';
import { TableColumn, TableRow } from 'src/app/shared/components/table/interfaces/table.interface';
import { PagoDialogComponent } from 'src/app/components/pago-dialog/pago-dialog.component';
import { ConsultoraDialogComponent } from 'src/app/components/consultora-dialog/consultora-dialog.component';
import { CuadroResumenContenidoAmbientalesDialogComponent } from 'src/app/components/cuadro-resumen-contenido-ambientales-dialog/cuadro-resumen-contenido-ambientales-dialog.component';
import { PlanCierreActividadesDialogComponent } from 'src/app/components/plan-cierre-actividades-dialog/plan-cierre-actividades-dialog.component';
import { PlanRelacionamientoDialogComponent } from 'src/app/components/plan-relacionamiento-dialog/plan-relacionamiento-dialog.component';
import { PlanContingenciaDialogComponent } from 'src/app/components/plan-contingencia-dialog/plan-contingencia-dialog.component';
import { PlanMinimizacionManejoResiduoSolidoDialogComponent } from 'src/app/components/plan-minimizacion-manejo-residuo-solido-dialog/plan-minimizacion-manejo-residuo-solido-dialog.component';
import { PlanVigilanciaAmbientalDialogComponent } from 'src/app/components/plan-vigilancia-ambiental-dialog/plan-vigilancia-ambiental-dialog.component';
import { PlanManejoDialog } from 'src/app/components/plan-manejo-dialog/plan-manejo-dialog.component';
import { DescripcionPosiblesImpactAmbDialog } from 'src/app/components/descripcion-posibles-impact-amb-dialog/descripcion-posibles-impact-amb-dialog.component';
import { ParticipacionCiudadanaDialog } from 'src/app/components/participacion-ciudadana-dialog/participacion-ciudadana-dialog.component';
import { CartografiaDialog } from 'src/app/components/cartografia-dialog/cartografia-dialog.component';
import { ArqueologiaPatrimonioCulturalDialog } from 'src/app/components/arqueologia-patrimonio-cultural-dialog/arqueologia-patrimonio-cultural-dialog.component';
import { DescripcionCaractSocEcoCulAntoDialog } from 'src/app/components/descripcion-caract-soc-eco-cul-anto-dialog/descripcion-caract-soc-eco-cul-anto-dialog.component';
import { PuntoMuestreoDialog } from 'src/app/components/punto-muestreo-dialog/punto-muestreo-dialog.component';
import { DescripcionMedioBiologicoDialog } from 'src/app/components/descripcion-medio-biologico-dialog/descripcion-medio-biologico-dialog.component';
import { DescripcionMedioFisicoDialog } from 'src/app/components/descripcion-medio-fisico-dialog/descripcion-medio-fisico-dialog.component';
import { DescripcionEtapaConstrucHabilitacionDialog } from 'src/app/components/descripcion-etapa-construc-habilitacion-dialog/descripcion-etapa-construc-habilitacion-dialog.component';
import { CronogramaInversionProyectDialogComponent } from 'src/app/components/cronograma-inversion-proyect-dialog/cronograma-inversion-proyect-dialog.component';
import { AreaInfluenciaDialogComponent } from 'src/app/components/area-influencia-dialog/area-influencia-dialog.component';
import { DelimitacionPerimertoAreaDialogComponent } from 'src/app/components/delimitacion-perimerto-area-dialog/delimitacion-perimerto-area-dialog.component';
import { LocalizacionGeograficaPoliticaProyectComponent } from 'src/app/components/localizacion-geografica-politica-proyect/LocalizacionGeograficaPoliticaProyectComponent';
import { ObjetivoJustificacionProyectDialogComponent } from 'src/app/components/objetivo-justificacion-proyect/objetivo-justificacion-proyect.component';
import { AntecedentesDialogComponent } from 'src/app/components/antecedentes-dialog/antecedentes-dialog.component';
import { ResumenEjecutivoDialogComponent } from 'src/app/components/resumen-ejecutivo-dialog/resumen-ejecutivo-dialog.component';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class InicioComponent implements OnInit, OnDestroy {
  subs: Subscription[] = [];

  isCollapsed = true;

  divAyuda = 'hidden';

  materiaList: Materia[];

  grupoProcedimientoList: {
    materiaTxt: string;
    procedimientoList: Procedimiento[];
  }[] = [];
  listaSize: number;

  filtrarTexto: string = '';
  idMateria: number;


////

_modal: NgbActiveModal;
selectedUnit: string = '';


private modalService = inject(NgbModal);




titleModal: string = '';

modal: NgbModalRef;
@ViewChild('modalResumenEjecutivo') modalResumenEjecutivo: TemplateRef<any>;
@ViewChild('modalAntecedentes') modalAntecedentes: TemplateRef<any>;
@ViewChild('modalObjetivoJustificacion') modalObjetivoJustificacion: TemplateRef<any>;

/*****************************************************/

tableColumns: TableColumn[] = [
  {
    header: 'ÍNDICE',
    field: 'index',
  },
  { header: 'ESTADO', field: 'status' },
  { header: 'OBSERVACIONES', field: 'observations' },
  { header: 'HORA', field: 'hora' }
];
tableData: TableRow[] = [
  /******* 1 *********/
  {
    index: {
      text: '1. RESUMEN EJECUTIVO',
      hasCursorPointer: true,
      onClick: (row: TableRow, column: TableColumn) => {
        const modalOptions: NgbModalOptions = {
          size: 'lg',
          centered: true,
          ariaLabelledBy: 'modal-basic-title',
        };
        const modalRef = this.modalService.open(ResumenEjecutivoDialogComponent, modalOptions);
        modalRef.componentInstance.title = row['index'].text;
      }

    },
    status: { text: '', icon: 'far fa-pencil-square-o' },
    observations: { text: '' },
    hora: { text: '' },
  },
  /******* 2 *********/
  {
    index: { text: '2. DESCRIPCIÓN DEL PROYECTO' },
    status: { text: '' },
    observations: { text: '' },
    hora: { text: '' }
  },
  {
    index: {
      text: '2.1 ANTECEDENTES',
      hasCursorPointer: true,
      onClick: (row: TableRow, column: TableColumn) => {
        const modalOptions: NgbModalOptions = {
          size: 'lg',
          centered: true,
          ariaLabelledBy: 'modal-basic-title',
          scrollable: true
        };
        const modalRef = this.modalService.open(AntecedentesDialogComponent, modalOptions);
        modalRef.componentInstance.title = row['index'].text;
      }
    },
    status: { text: '', icon: 'edit' },
    observations: { text: 'Necesita revisión' },
    hora: { text: '18:03' }
  },
  {
    index: {
      text: '2.2 OBJETIVO Y JUSTIFICACION DEL PROYECTO',
      hasCursorPointer: true,
      onClick: (row: TableRow, column: TableColumn) => {
        const modalOptions: NgbModalOptions = {
          size: 'lg',
          centered: true,
          ariaLabelledBy: 'modal-basic-title',
          scrollable: true
        };
        const modalRef = this.modalService.open(ObjetivoJustificacionProyectDialogComponent, modalOptions);
        modalRef.componentInstance.title = row['index'].text;

        /*  const dialogRef = this.dialog.open(ObjetivoJustificacionProyectDialogComponent , {
           width: '800px',
           data: {
             title: row['index'].text
           }
         }); */
      }
    },
    status: { text: '', icon: 'edit' },
    observations: { text: 'Necesita revisión' },
    hora: { text: '18:03' }
  },
  {
    index: {
      text: '2.3 LOCALIZACIÓN GEOGRÁFICA Y POLÍTICA DEL PROYECTO',
      hasCursorPointer: true,
      onClick: (row: TableRow, column: TableColumn) => {
        const modalOptions: NgbModalOptions = {
          size: 'lg',
          centered: true,
          ariaLabelledBy: 'modal-basic-title',
          scrollable: true
        };
        const modalRef = this.modalService.open(LocalizacionGeograficaPoliticaProyectComponent, modalOptions);
        modalRef.componentInstance.title = row['index'].text;
      }
    },
    status: { text: '', icon: 'edit' },
    observations: { text: 'Necesita revisión' },
    hora: { text: '18:03' }
  },
  {
    index: {
      text: '2.4 DELIMITACIÓN DEL PERÍMETRO DEL ÁREA EFECTIVA DEL PROYECTO',
      hasCursorPointer: true,
      onClick: (row: TableRow, column: TableColumn) => {
        const modalOptions: NgbModalOptions = {
          size: 'lg',
          centered: true,
          ariaLabelledBy: 'modal-basic-title',
          scrollable: true
        };
        const modalRef = this.modalService.open(DelimitacionPerimertoAreaDialogComponent, modalOptions);
        modalRef.componentInstance.title = row['index'].text;
      }
    },
    status: { text: '', icon: 'edit' },
    observations: { text: 'Necesita revisión' },
    hora: { text: '18:03' }
  },
  {
    index: {
      text: '2.5 ÁREAS DE INFLUENCIA',
      hasCursorPointer: true,
      onClick: (row: TableRow, column: TableColumn) => {
        const modalOptions: NgbModalOptions = {
          size: 'lg',
          centered: true,
          ariaLabelledBy: 'modal-basic-title',
          scrollable: true
        };
        const modalRef = this.modalService.open(AreaInfluenciaDialogComponent, modalOptions);
        modalRef.componentInstance.title = row['index'].text;
      }
    },
    status: { text: '', icon: 'edit' },
    observations: { text: 'Necesita revisión' },
    hora: { text: '18:03' }
  },
  {
    index: {
      text: '2.6 CRONOGRAMA E INVERSION DEL PROYECTO',
      hasCursorPointer: true,
      onClick: (row: TableRow, column: TableColumn) => {
        const modalOptions: NgbModalOptions = {
          size: 'lg',
          centered: true,
          ariaLabelledBy: 'modal-basic-title',
        };
        const modalRef = this.modalService.open(CronogramaInversionProyectDialogComponent, modalOptions);
        modalRef.componentInstance.title = row['index'].text;
      }
    },
    status: { text: '', icon: 'edit' },
    observations: { text: 'Necesita revisión' },
    hora: { text: '18:03' }
  },
  {
    index: {
      text: '2.7 DESCRIPCION DE LA ETAPA DE CONSTRUCCIÓN / HABILITACIÓN Y OPERACIÓN',
      hasCursorPointer: true,
      onClick: (row: TableRow, column: TableColumn) => {
        const modalOptions: NgbModalOptions = {
          size: 'lg',
          centered: true,
          ariaLabelledBy: 'modal-basic-title',
          scrollable: true
        };
        const modalRef = this.modalService.open(DescripcionEtapaConstrucHabilitacionDialog, modalOptions);
        modalRef.componentInstance.title = row['index'].text;
      }
    },
    status: { text: '', icon: 'edit' },
    observations: { text: 'Necesita revisión' },
    hora: { text: '18:03' }
  },
  /******* 3 *********/
  {
    index: { text: '3. LÍNEA BASE' },
    status: { text: '' },
    observations: { text: '' },
    hora: { text: '' }
  },

  {
    index: {
      text: '3.1 DESCRIPCIÓN MEDIO FISICO',
      hasCursorPointer: true,
      onClick: (row: TableRow, column: TableColumn) => {
        const modalOptions: NgbModalOptions = {
          size: 'lg',
          centered: true,
          ariaLabelledBy: 'modal-basic-title',
          scrollable: true
        };
        const modalRef = this.modalService.open(DescripcionMedioFisicoDialog, modalOptions);
        modalRef.componentInstance.title = row['index'].text;
      }
    },
    status: { text: '', icon: 'edit' },
    observations: { text: 'Necesita revisión' },
    hora: { text: '18:03' }
  },

  {
    index: {
      text: '3.2 DESCRIPCIÓN MEDIO BIOLÓGICO',
      hasCursorPointer: true,
      onClick: (row: TableRow, column: TableColumn) => {
        const modalOptions: NgbModalOptions = {
          size: 'lg',
          centered: true,
          ariaLabelledBy: 'modal-basic-title',
          scrollable: true
        };
        const modalRef = this.modalService.open(DescripcionMedioBiologicoDialog, modalOptions);
        modalRef.componentInstance.title = row['index'].text;
      }
    },
    status: { text: '', icon: 'edit' },
    observations: { text: 'Necesita revisión' },
    hora: { text: '18:03' }
  },

  {
    index: {
      text: '3.3 PUNTO DE MUESTREO',
      hasCursorPointer: true,
      onClick: (row: TableRow, column: TableColumn) => {
        const modalOptions: NgbModalOptions = {
          size: 'lg',
          centered: true,
          ariaLabelledBy: 'modal-basic-title',
          scrollable: true
        };
        const modalRef = this.modalService.open(PuntoMuestreoDialog, modalOptions);
        modalRef.componentInstance.title = row['index'].text;
      }
    },
    status: { text: '', icon: 'edit' },
    observations: { text: 'Necesita revisión' },
    hora: { text: '18:03' }
  },

  {
    index: {
      text: '3.4. DESCRIPCIÓN Y CARACTERIZACION DE LOS ASPECTOS SOCIAL, ECONOMICO, CULTURAL Y ANTROPOLÓGICO DE LA POBLACION UBICADA EN EL ÁREA DE INFLUENCIA SOCIAL DEL PROYECTO',
      hasCursorPointer: true,
      onClick: (row: TableRow, column: TableColumn) => {
        const modalOptions: NgbModalOptions = {
          size: 'lg',
          centered: true,
          ariaLabelledBy: 'modal-basic-title',
          scrollable: true
        };
        const modalRef = this.modalService.open(DescripcionCaractSocEcoCulAntoDialog, modalOptions);
        modalRef.componentInstance.title = row['index'].text;
      }
    },
    status: { text: '', icon: 'edit' },
    observations: { text: 'Necesita revisión' },
    hora: { text: '18:03' }
  },

  {
    index: {
      text: '3.5 ARQUEOLOGIA Y PATRIMONIO CULTURAL',
      hasCursorPointer: true,
      onClick: (row: TableRow, column: TableColumn) => {
        const modalOptions: NgbModalOptions = {
          size: 'lg',
          centered: true,
          ariaLabelledBy: 'modal-basic-title',
          scrollable: true
        };
        const modalRef = this.modalService.open(ArqueologiaPatrimonioCulturalDialog, modalOptions);
        modalRef.componentInstance.title = row['index'].text;
      }
    },
    status: { text: '', icon: 'edit' },
    observations: { text: 'Necesita revisión' },
    hora: { text: '18:03' }
  },

  {
    index: {
      text: '3.6 CARTOGRAFIA',
      hasCursorPointer: true,
      onClick: (row: TableRow, column: TableColumn) => {
        const modalOptions: NgbModalOptions = {
          size: 'lg',
          centered: true,
          ariaLabelledBy: 'modal-basic-title',
          scrollable: true
        };
        const modalRef = this.modalService.open(CartografiaDialog, modalOptions);
        modalRef.componentInstance.title = row['index'].text;
      }
    },
    status: { text: '', icon: 'edit' },
    observations: { text: 'Necesita revisión' },
    hora: { text: '18:03' }
  },
  /******* 4 *********/
  {
    index: {
      text: '4.PARTICIPACIÓN CIUDADANA',
      hasCursorPointer: true,
      onClick: (row: TableRow, column: TableColumn) => {
        const modalOptions: NgbModalOptions = {
          size: 'lg',
          centered: true,
          ariaLabelledBy: 'modal-basic-title',
          scrollable: true
        };
        const modalRef = this.modalService.open(ParticipacionCiudadanaDialog, modalOptions);
        modalRef.componentInstance.title = row['index'].text;
      }
    },
    status: { text: '', icon: 'edit' },
    observations: { text: 'Necesita revisión' },
    hora: { text: '18:03' }
  },
  /******* 5 *********/
  {
    index: {
      text: '5. DESCRIPCIÓN DE LOS POSIBLES IMPACTOS AMBIENTALE',
      hasCursorPointer: true,
      onClick: (row: TableRow, column: TableColumn) => {
        const modalOptions: NgbModalOptions = {
          size: 'lg',
          centered: true,
          ariaLabelledBy: 'modal-basic-title',
          scrollable: true
        };
        const modalRef = this.modalService.open(DescripcionPosiblesImpactAmbDialog, modalOptions);
        modalRef.componentInstance.title = row['index'].text;
      }
    },
    status: { text: '', icon: 'edit' },
    observations: { text: 'Necesita revisión' },
    hora: { text: '18:03' }
  },
  /******* 6 *********/
  {
    index: { text: '6. PLAN DE MANEJO AMBIENTAL' },
    status: { text: '' },
    observations: { text: '' },
    hora: { text: '' }
  },
  {
    index: {
      text: '6.1 PLAN DE MANEJO',
      hasCursorPointer: true,
      onClick: (row: TableRow, column: TableColumn) => {
        const modalOptions: NgbModalOptions = {
          size: 'lg',
          centered: true,
          ariaLabelledBy: 'modal-basic-title',
          scrollable: true
        };
        const modalRef = this.modalService.open(PlanManejoDialog, modalOptions);
        modalRef.componentInstance.title = row['index'].text;
      }
    },
    status: { text: '', icon: 'edit' },
    observations: { text: 'Necesita revisión' },
    hora: { text: '18:03' }
  },
  {
    index: {
      text: '6.2 PLAN DE VIGILANCIA AMBIENTAL',
      hasCursorPointer: true,
      onClick: (row: TableRow, column: TableColumn) => {
        const modalOptions: NgbModalOptions = {
          size: 'lg',
          centered: true,
          ariaLabelledBy: 'modal-basic-title',
          scrollable: true
        };
        const modalRef = this.modalService.open(PlanVigilanciaAmbientalDialogComponent, modalOptions);
        modalRef.componentInstance.title = row['index'].text;
      }
    },
    status: { text: '', icon: 'edit' },
    observations: { text: 'Necesita revisión' },
    hora: { text: '18:03' }
  },
  {
    index: {
      text: '6.3. PLAN DE MINIMIZACION Y MANEJO DE RESIDUOS SÓLIDOS',
      hasCursorPointer: true,
      onClick: (row: TableRow, column: TableColumn) => {
        const modalOptions: NgbModalOptions = {
          size: 'lg',
          centered: true,
          ariaLabelledBy: 'modal-basic-title',
          scrollable: true
        };
        const modalRef = this.modalService.open(PlanMinimizacionManejoResiduoSolidoDialogComponent, modalOptions);
        modalRef.componentInstance.title = row['index'].text;
      }
    },
    status: { text: '', icon: 'edit' },
    observations: { text: 'Necesita revisión' },
    hora: { text: '18:03' }
  },
  {
    index: {
      text: '6.4 PLAN DE CONTINGENCIA',
      hasCursorPointer: true,
      onClick: (row: TableRow, column: TableColumn) => {
        const modalOptions: NgbModalOptions = {
          size: 'lg',
          centered: true,
          ariaLabelledBy: 'modal-basic-title',
          scrollable: true
        };
        const modalRef = this.modalService.open(PlanContingenciaDialogComponent, modalOptions);
        modalRef.componentInstance.title = row['index'].text;
      }
    },
    status: { text: '', icon: 'edit' },
    observations: { text: 'Necesita revisión' },
    hora: { text: '18:03' }
  },
  {
    index: {
      text: '6.5 PROTOCOLO DE RELACIONAMIENTO',
      hasCursorPointer: true,
      onClick: (row: TableRow, column: TableColumn) => {
        const modalOptions: NgbModalOptions = {
          size: 'lg',
          centered: true,
          ariaLabelledBy: 'modal-basic-title',
          scrollable: true
        };
        const modalRef = this.modalService.open(PlanRelacionamientoDialogComponent, modalOptions);
        modalRef.componentInstance.title = row['index'].text;
      }
    },
    status: { text: '', icon: 'edit' },
    observations: { text: 'Necesita revisión' },
    hora: { text: '18:03' }
  },
  {
    index: {
      text: '6.6. PLAN DE CIERRE /ACTIVIDADES DE CIERRE',
      hasCursorPointer: true,
      onClick: (row: TableRow, column: TableColumn) => {
        const modalOptions: NgbModalOptions = {
          size: 'lg',
          centered: true,
          ariaLabelledBy: 'modal-basic-title',
          scrollable: true
        };
        const modalRef = this.modalService.open(PlanCierreActividadesDialogComponent, modalOptions);
        modalRef.componentInstance.title = row['index'].text;
      }
    },
    status: { text: '', icon: 'edit' },
    observations: { text: 'Necesita revisión' },
    hora: { text: '18:03' }
  },
  {
    index: {
      text: '6.7. CUADRO RESUMEN CONTENIENDO LOS COMPROMISOS AMBIENTALES SEÑALADOS EN EL PLAN DE MANJEO AMBIENTAL',
      hasCursorPointer: true,
      onClick: (row: TableRow, column: TableColumn) => {
        const modalOptions: NgbModalOptions = {
          size: 'lg',
          centered: true,
          ariaLabelledBy: 'modal-basic-title',
          scrollable: true
        };
        const modalRef = this.modalService.open(CuadroResumenContenidoAmbientalesDialogComponent, modalOptions);
        modalRef.componentInstance.title = row['index'].text;
      }
    },
    status: { text: '', icon: 'edit' },
    observations: { text: 'Necesita revisión' },
    hora: { text: '18:03' }
  },
  /******* 7 *********/
  {
    index: {
      text: '7. CONSULTORA',
      hasCursorPointer: true,
      onClick: (row: TableRow, column: TableColumn) => {
        const modalOptions: NgbModalOptions = {
          size: 'lg',
          centered: true,
          ariaLabelledBy: 'modal-basic-title',
          scrollable: true
        };
        const modalRef = this.modalService.open(ConsultoraDialogComponent, modalOptions);
        modalRef.componentInstance.title = row['index'].text;
      }
    },
    status: { text: '', icon: 'edit' },
    observations: { text: 'Necesita revisión' },
    hora: { text: '18:03' }
  },
  /******* 8 *********/
  {
    index: {
      text: '8. PAGO',
      hasCursorPointer: true,
      onClick: (row: TableRow, column: TableColumn) => {
        const modalOptions: NgbModalOptions = {
          size: 'lg',
          centered: true,
          ariaLabelledBy: 'modal-basic-title',
          scrollable: true
        };
        const modalRef = this.modalService.open(PagoDialogComponent, modalOptions);
        modalRef.componentInstance.title = row['index'].text;
      }
    },
    status: { text: '', icon: 'edit' },
    observations: { text: 'Necesita revisión' },
    hora: { text: '18:03' }
  },

];



///
  constructor(
    private readonly _funcionesMtcService: FuncionesMtcService,
    private readonly _relacionTupasService: RelacionTupasService,
    private readonly _materiaUseCase: MateriaUseCase,
    private readonly _visorPdfArchivosService: VisorPdfArchivosService,
    private readonly _store: Store<PublicoAppState>,
    private readonly _modalService: NgbModal,
    private readonly _router: Router
  ) {}

  ngOnInit() {
    this.cargarListas();
    this.cargarDatos();
  }

  cargarListas(): void {
    this._materiaUseCase.listar().subscribe((data) => {
      this.materiaList = data;
    });
  }

  cargarDatos(): void {
    this.subs.push(
      this._relacionTupasService
        .listarProcedPortal(this.filtrarTexto, this.idMateria)
        .subscribe(
          (response) => {
            if (!response.success || !response.data) {
              this._funcionesMtcService.mensajeError(response.message);
              return;
            }

            this.listaSize = response.data.length;
            this.grupoProcedimientoList = _.chain(response.data)
              .groupBy('materiaTxt')
              .map((value, key) => ({
                materiaTxt: key,
                procedimientoList: value,
              }))
              .orderBy((r) => r.materiaTxt)
              .value();

            console.log(this.grupoProcedimientoList);
          },
          () => {
            this._funcionesMtcService.mensajeError(
              'No se pudo cargar los procedimientos'
            );
          }
        )
    );
  }

  onClickImgTupa(): void {
    this.filtrarTexto = '';
    this.idMateria = null;

    this.cargarListas();
    this.cargarDatos();

    this._store.dispatch(uncollapseProced({ idProcUncollapse: null }));
  }

  limpiarBusqueda(): void {
    this.filtrarTexto = '';
    this.cargarDatos();
  }

  irIniciarSesion(): void {
    this._router.navigate(['/autenticacion/iniciar-sesion']);
  }

  ngOnDestroy(): void {
    this.subs.forEach((subscription) => {
      if (subscription !== undefined) {
        subscription.unsubscribe();
      }

      this._store.dispatch(uncollapseProced({ idProcUncollapse: null }));
    });
  }







    //modalAntecedentes
    tableColumns214: TableColumn[] = [
      {
        header: 'NOMBRE PASIVO',
        field: 'nombrePasivo',
        rowspan: 2,
      },
      {
        header: 'TIPO COMPONENTE',
        field: 'tipoComponent',
        rowspan: 2,
      },
      {
        header: 'SUB TIPO COMPONENTE',
        field: 'subTipoComponent',
        rowspan: 2,
      },
      {
        header: 'UBICACIÓN (Coordenadas WGS84)',
        field: 'ubicacion',
        colspan: 4,
        isParentCol: true,
      },
      { header: 'ESTE', field: 'este', isChildCol: true },
      { header: 'NORTE', field: 'norte', isChildCol: true },
      { header: 'ZONA', field: 'zona', isChildCol: true },
      { header: 'DATUM', field: 'datum', isChildCol: true },
      {
        header: 'RESPONSABLE',
        field: 'responsable',
        rowspan: 2,
      },
    ];
  
    tableData214: TableRow[] = [
      {
        nombrePasivo: {
          text: '1. Primer pasivo',
        },
        tipoComponent: {
          text: '1. Primer pasivo',
        },
        subTipoComponent: {
          text: '1. Primer pasivo',
        },
        este: { text: '23', hasCursorPointer: true },
        norte: { text: '45' },
        zona: { text: '56' },
        datum: { text: '00' },
        responsable: { text: 'SI' },
      },
    ]
  
  
    tableColumns215: TableColumn[] = [
      {
        header: 'NOMBRE PASIVO',
        field: 'nombrePasivo',
        rowspan: 2,
      },
      {
        header: 'UBICACIÓN (Coordenadas WGS84)',
        field: 'ubicacion',
        colspan: 4,
      },
      { header: 'ESTE', field: 'este', isChildCol: true },
      { header: 'NORTE', field: 'norte', isChildCol: true },
      { header: 'ZONA', field: 'zona', isChildCol: true },
      { header: 'DATUM', field: 'datum', isChildCol: true },
      {
        header: 'DESCRIPCIÓN DE LA SITUACIÓN ACTUAL',
        field: 'descripcion',
        rowspan: 2,
      },
    ];
  
    tableData215: TableRow[] = []
  
    tableColumns216: TableColumn[] = [
      { header: 'Nº EXPEDIENTE', field: 'norExpediente', },
      { header: 'TIPO ESTUDIO', field: 'tipoEstudio', },
      { header: 'PROYECTO', field: 'proyect', },
      { header: 'ESTADO', field: 'estado', },
      { header: 'FECHA ENVÍO', field: 'fechaEnvio', },
      { header: 'AUTORIDAD COMPETENTE', field: 'autoridaComep', },
      { header: 'ACCIÓN', field: 'accion', },
    ];
  
    tableData216: TableRow[] = [
      {
        norExpediente: { text: '...' },
        tipoEstudio: { text: '....' },
        proyect: { text: '....' },
        estado: { text: '....' },
        fechaEnvio: { text: '....' },
        autoridaComep: { text: '....' },
        accion: { buttonIcon: 'add' },
      },
    ]
  
  
    // -------------217-----
    tableColumns217: TableColumn[] = [
      { header: 'TIPO DE ESTUDIO', field: 'norExpediente', },
      { header: 'INSTITUCIÓN', field: 'institucion', },
      { header: 'CERTIFICACIÓN', field: 'certificado', },
      { header: 'NRO RD', field: 'nroRD', },
      { header: 'FECHA', field: 'fecha', },
      { header: 'PLAZO(días)', field: 'plazo', },
      { header: 'ACCIÓN', field: 'accion', },
    ];
  
    tableData217: TableRow[] = [
      {
        norExpediente: { text: '...' },
        institucion: { text: '....' },
        certificado: { text: '....' },
        nroRD: { text: '....' },
        fecha: { text: '....' },
        plazo: { text: '....' },
        accion: { buttonIcon: 'add' },
      },
    ]
  
  
    // -------------2191-----
    tableColumns2191: TableColumn[] = [
      { header: 'NOMBRE', field: 'nombre', },
      { header: 'TIPO', field: 'tipo', },
      { header: 'CATEGORÍA', field: 'categ', },
      { header: 'CLASE', field: 'clase', },
      { header: 'FUENTE', field: 'fuente', },
    ];
  
    tableData2191: TableRow[] = [
      {
        nombre: { text: '...' },
        tipo: { text: '....' },
        categ: { text: '....' },
        clase: { text: '....' },
        fuente: { text: '....' },
      },
    ]
    // -------------2192-----
    tableColumns2192: TableColumn[] = [
      { header: 'Nro', field: 'numero', },
      { header: 'ÁREA NATURAL PROTEGIDA / ZONA DE AMORTIGUAMIENTO / ÁREAS DE CONSERVACIÓN REGIONAL', field: 'areaNatural', },
      { header: 'DISTANCIA (km)', field: 'distancia', },
      { header: 'EDICIÓN', field: 'edicion' },
    ];
  
    tableData2192: TableRow[] = [
      {
        numero: { text: '...' },
        areaNatural: { text: '....' },
        distancia: { text: '....' },
        edicion: {
          buttonIcon: 'add',
          onClick: (row: TableRow, column: TableColumn) => {
            // const dialogRef = this.dialog.open(NombreDialogComponent, {
            //   width: '800px',
            //   data: {
            //     title: row['index'].text
            //   }
            // });
          }
        },
      },
    ]
}
