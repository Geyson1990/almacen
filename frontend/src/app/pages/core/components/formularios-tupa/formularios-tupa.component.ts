import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Procedimiento } from 'src/app/core/models/Portal/procedimiento';
import { Subscription } from 'rxjs';
import { Materia } from 'src/app/modules/publico/domain';
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
import { LocalizacionGeograficaPoliticaProyectComponent } from 'src/app/components/localizacion-geografica-politica-proyect/LocalizacionGeograficaPoliticaProyectComponent';
import { DelimitacionPerimertoAreaDialogComponent } from 'src/app/components/delimitacion-perimerto-area-dialog/delimitacion-perimerto-area-dialog.component';
import { ObjetivoJustificacionProyectDialogComponent } from 'src/app/components/objetivo-justificacion-proyect/objetivo-justificacion-proyect.component';
import { AntecedentesDialogComponent } from 'src/app/components/antecedentes-dialog/antecedentes-dialog.component';
import { ResumenEjecutivoDialogComponent } from 'src/app/components/resumen-ejecutivo-dialog/resumen-ejecutivo-dialog.component';
import { FormularioSolicitudDIA } from 'src/app/core/models/Tramite/FormularioSolicitudDIA';
import { TramiteService } from 'src/app/core/services/tramite/tramite.service';
import { FormularioDIA } from 'src/app/core/models/Formularios/FormularioMain';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { CONSTANTES } from 'src/app/enums/constants';
import { CommentModalTableComponent } from 'src/app/modals/comment-modal-table/comment-modal-table.component';
import { SeguridadService } from 'src/app/core/services/seguridad.service';
import { ObservacionService } from 'src/app/core/services/observacion.service';

@Component({
  selector: 'app-formularios-tupa',
  templateUrl: './formularios-tupa.component.html',
  styleUrls: ['./formularios-tupa.component.css']
})
export class FormulariosTupaComponent implements OnInit {
  subs: Subscription[] = [];
  materiaList: Materia[];
  currentTime: string = '';
  modoVisualizacion: boolean = false;
  esFuncionario: boolean = false;
  public dataFormDia: any = {};
  isCollapsed = true;
  divAyuda = 'hidden';
  listaSize: number;
  idMateria: number;
  filtrarTexto: string = '';
  selectedUnit: string = '';
  titleModal: string = '';
  legend: number = 1;  
  // grupoProcedimientoList: {
  //   materiaTxt: string;
  //   procedimientoList: Procedimiento[];
  // }[] = [];
  _modal: NgbActiveModal;
  private modalService = inject(NgbModal);

  modal: NgbModalRef;
  @ViewChild('modalResumenEjecutivo') modalResumenEjecutivo: TemplateRef<any>;
  @ViewChild('modalAntecedentes') modalAntecedentes: TemplateRef<any>;
  @ViewChild('modalObjetivoJustificacion') modalObjetivoJustificacion: TemplateRef<any>;

  codMaeSolicitud = Number(localStorage.getItem('tramite-id'));
  regUsuaRegistra = parseInt(this.seguridadService.getUserId());
  codMovPersona = parseInt(this.seguridadService.getUserId());
  idCliente: number = Number(this.seguridadService.getIdCliente());
  idEstudio: number = Number(localStorage.getItem('estudio-id'));
  codMaeRequisito: number = Number(localStorage.getItem('requisito-id'));

  estadoSolicitud: string = '';
  fechaHora = '';
  tableData: TableRow[] = [];

  tableColumns: TableColumn[] = [
    { header: 'ÍNDICE', field: 'index', },
    { header: 'ESTADO', field: 'status' },
    { header: '', field: 'comment' },
    { header: 'OBSERVACIONES', field: 'observations' },
    { header: 'HORA', field: 'hora' }
  ];
  
  mensajeFormulario: { numero: number; mensaje: string }[] = [
    0, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12, 13, 14, 15, 16, 17, 19, 20, 21, 22, 23, 24, 25, 26, 27
  ].map(numero => ({ numero, mensaje: '' }));
  observaciones: any[] = [];

  setTableData() {
    this.tableData = [
      /******* 1 *********/
      {
        index: {
          text: '1. RESUMEN EJECUTIVO',         
          hasCursorPointer: true,
          onClick: (row: TableRow, column: TableColumn) => {
            const modalOptions: NgbModalOptions = {
              size: 'lg',
              centered: true,
              ariaLabelledBy: 'modal-basic-title'
            };
            const modalRef = this.modalService.open(ResumenEjecutivoDialogComponent, modalOptions);
            modalRef.componentInstance.title = row['index'].text;
            modalRef.componentInstance.codMaeSolicitud = this.codMaeSolicitud;
            modalRef.componentInstance.modoVisualizacion = this.modoVisualizacion;
            modalRef.componentInstance.idCliente = this.idCliente;
            modalRef.componentInstance.idEstudio = this.idEstudio;
            modalRef.componentInstance.codMaeRequisito = this.codMaeRequisito;
            // modalRef.result.then(
            //   (result) => {// Maneja el resultado aquí
            //     //this.frmSolicitud.ResumenEjecutivo = result.ResumenEjecutivo;
            //     console.log('Modal Resumen Ejecutivo:');
            //   },
            //   (reason) => {// Maneja la cancelación aquí
            //     this.getData();
            //     console.log('Modal fue cerrado sin resultado:', reason);
            //   });
          }
        },
        status: { text: '', icon: 'edit' },
        comment: { 
          text: '', 
          icon: '',
          onClick: (row: TableRow, column: TableColumn) => {
          //Esta funcion abre el modal de comentarios para tabla 
          if(row[column.field].icon=='chat'){
          const modalOptions: NgbModalOptions = {
            size: 'lg',
            centered: true,
            ariaLabelledBy: 'modal-basic-title',
          };
          const openComentTable = this.modalService.open(CommentModalTableComponent, modalOptions);
         
          openComentTable.componentInstance.data = {
            "codMaeSolicitud": this.codMaeSolicitud,
            "regUsuaRegistra": this.regUsuaRegistra,
            "codMovPersona": this.codMovPersona,
            "capitulo": '1',
            "nombreCapitulo": row['index'].text
          }
       
        }
        }
      },
        observations: {           
          htmlText: '',
          textAlign: 'left'
        },
        hora: { text: '' }

        /*  status: { text: '', icon: 'edit' },
         observations: { htmlText: ''}, 
         hora: { text: '' }, */
      },
      /******* 2 *********/
      {
        index: { htmlText: '<b>2. DESCRIPCIÓN DEL PROYECTO</b>', hasCursorPointer: false, isTitle: true },
        status: { text: '' },
        comment: { 
          text: '', 
          icon: ''
      },
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
            modalRef.componentInstance.codMaeSolicitud = this.codMaeSolicitud;
            modalRef.componentInstance.modoVisualizacion = this.modoVisualizacion;
            modalRef.componentInstance.idCliente = this.idCliente;
            modalRef.componentInstance.idEstudio = this.idEstudio;
            modalRef.componentInstance.codMaeRequisito = this.codMaeRequisito;
            //modalRef.componentInstance.data = this.frmSolicitud;
            modalRef.result.then(
              (result) => {// Maneja el resultado aquí
                //this.frmSolicitud.ResumenEjecutivo = result.ResumenEjecutivo;
              },
              (reason) => {// Maneja la cancelación aquí
                this.getData();
                console.log('Modal fue cerrado sin resultado:', reason);
              });

          }
        },
        status: { text: '', icon: 'edit' }, 
        comment: { 
          text: '', 
          icon: '',
          onClick: (row: TableRow, column: TableColumn) => {
          //Esta funcion abre el modal de comentarios para tabla  
          if(row[column.field].icon=='chat'){
          const modalOptions: NgbModalOptions = {
            size: 'lg',
            centered: true,
            ariaLabelledBy: 'modal-basic-title',
          };
          const openComentTable = this.modalService.open(CommentModalTableComponent, modalOptions);
          openComentTable.componentInstance.data = {
            "codMaeSolicitud": this.codMaeSolicitud,
            "regUsuaRegistra": this.regUsuaRegistra,
            "codMovPersona": this.codMovPersona,
            "capitulo": '2.1',
            "nombreCapitulo": row['index'].text
          }
       
        }
        }
      },
        observations: {         
          htmlText: '',
          textAlign: 'left'
        },
        hora: { text: '' }
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
            modalRef.componentInstance.codMaeSolicitud = this.codMaeSolicitud;
            modalRef.componentInstance.modoVisualizacion = this.modoVisualizacion;
            modalRef.componentInstance.idCliente = this.idCliente;
            modalRef.componentInstance.idEstudio = this.idEstudio;
            modalRef.componentInstance.codMaeRequisito = this.codMaeRequisito;
            //modalRef.componentInstance.data = this.frmSolicitud;
            modalRef.result.then(
              (result) => {// Maneja el resultado aquí
                //this.frmSolicitud.Objetivo = result;
              },
              (reason) => {// Maneja la cancelación aquí
                this.getData();
                console.log('Modal fue cerrado sin resultado:', reason);
              });
          }
        },
        status: { text: '', icon: 'edit' }, 
        comment: { 
          text: '', 
          icon: '',
          onClick: (row: TableRow, column: TableColumn) => {
          //Esta funcion abre el modal de comentarios para tabla  
          if(row[column.field].icon=='chat'){
          const modalOptions: NgbModalOptions = {
            size: 'lg',
            centered: true,
            ariaLabelledBy: 'modal-basic-title',
          };
          const openComentTable = this.modalService.open(CommentModalTableComponent, modalOptions);
          openComentTable.componentInstance.data = {
            "codMaeSolicitud": this.codMaeSolicitud,
            "regUsuaRegistra": this.regUsuaRegistra,
            "codMovPersona": this.codMovPersona,
            "capitulo": '2.2',
            "nombreCapitulo": row['index'].text
          }
       
        }
        }
      },
        observations: {          
          htmlText: '',
          textAlign: 'left'
        },
        hora: { text: '' }
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
            modalRef.componentInstance.codMaeSolicitud = this.codMaeSolicitud;
            modalRef.componentInstance.idCliente = this.idCliente;
            modalRef.componentInstance.idEstudio = this.idEstudio;
            modalRef.componentInstance.codMaeRequisito = this.codMaeRequisito;
            modalRef.componentInstance.modoVisualizacion = this.modoVisualizacion;
            modalRef.result.then(
              (result) => {// Maneja el resultado aquí
                //this.frmSolicitud.Objetivo = result;
              },
              (reason) => {// Maneja la cancelación aquí
                this.getData();
                console.log('Modal fue cerrado sin resultado:', reason);
              });
          }
        },
        status: { text: '', icon: 'edit' }, 
        comment: { 
          text: '', 
          icon: '',
          onClick: (row: TableRow, column: TableColumn) => {
          //Esta funcion abre el modal de comentarios para tabla  
          if(row[column.field].icon=='chat'){
          const modalOptions: NgbModalOptions = {
            size: 'lg',
            centered: true,
            ariaLabelledBy: 'modal-basic-title',
          };
          const openComentTable = this.modalService.open(CommentModalTableComponent, modalOptions);
          openComentTable.componentInstance.data = {
            "codMaeSolicitud": this.codMaeSolicitud,
            "regUsuaRegistra": this.regUsuaRegistra,
            "codMovPersona": this.codMovPersona,
            "capitulo": '2.3',
            "nombreCapitulo": row['index'].text
          }
       
        }
        }
      },
        observations: {
          htmlText: '',
          textAlign: 'left'
        },
        hora: { text: '' }
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
            modalRef.componentInstance.codMaeSolicitud = this.codMaeSolicitud;
            modalRef.componentInstance.modoVisualizacion = this.modoVisualizacion;
            modalRef.componentInstance.idCliente = this.idCliente;
            modalRef.componentInstance.idEstudio = this.idEstudio;
            modalRef.componentInstance.codMaeRequisito = this.codMaeRequisito;
            modalRef.result.then(
              (result) => {// Maneja el resultado aquí
                //this.frmSolicitud.Objetivo = result;
              },
              (reason) => {// Maneja la cancelación aquí
                this.getData();
                console.log('Modal fue cerrado sin resultado:', reason);
              });
          }
        },
        status: { text: '', icon: 'edit' }, 
        comment: { 
          text: '', 
          icon: '',
          onClick: (row: TableRow, column: TableColumn) => {
          //Esta funcion abre el modal de comentarios para tabla  
          if(row[column.field].icon=='chat'){
          const modalOptions: NgbModalOptions = {
            size: 'lg',
            centered: true,
            ariaLabelledBy: 'modal-basic-title',
          };
          const openComentTable = this.modalService.open(CommentModalTableComponent, modalOptions);
          openComentTable.componentInstance.data = {
            "codMaeSolicitud": this.codMaeSolicitud,
            "regUsuaRegistra": this.regUsuaRegistra,
            "codMovPersona": this.codMovPersona,
            "capitulo": '2.4',
            "nombreCapitulo": row['index'].text
          }
       
        }
        }
      },
        observations: {
          htmlText: '',
          textAlign: 'left'
        },
        hora: { text: '' }
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
            modalRef.componentInstance.codMaeSolicitud = this.codMaeSolicitud;
            modalRef.componentInstance.modoVisualizacion = this.modoVisualizacion;
            modalRef.componentInstance.codMaeRequisito = this.codMaeRequisito;
            modalRef.componentInstance.idCliente = this.idCliente;
            modalRef.componentInstance.idEstudio = this.idEstudio;
            modalRef.result.then(
              (result) => {// Maneja el resultado aquí
                //this.frmSolicitud.Objetivo = result;
              },
              (reason) => {// Maneja la cancelación aquí
                this.getData();
                console.log('Modal fue cerrado sin resultado:', reason);
              });
          }
        },
        status: { text: '', icon: 'edit' }, 
        comment: { 
          text: '', 
          icon: '',
          onClick: (row: TableRow, column: TableColumn) => {
          //Esta funcion abre el modal de comentarios para tabla  
          if(row[column.field].icon=='chat'){
          const modalOptions: NgbModalOptions = {
            size: 'lg',
            centered: true,
            ariaLabelledBy: 'modal-basic-title',
          };
          const openComentTable = this.modalService.open(CommentModalTableComponent, modalOptions);
          openComentTable.componentInstance.data = {
            "codMaeSolicitud": this.codMaeSolicitud,
            "regUsuaRegistra": this.regUsuaRegistra,
            "codMovPersona": this.codMovPersona,
            "capitulo": '2.5',
            "nombreCapitulo": row['index'].text
          }
       
        }
        }
      },
        observations: {
          htmlText: '',
          textAlign: 'left'
        },
        hora: { text: '' }
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
            modalRef.componentInstance.codMaeSolicitud = this.codMaeSolicitud;
            modalRef.componentInstance.modoVisualizacion = this.modoVisualizacion;
            modalRef.componentInstance.idCliente = this.idCliente;
            modalRef.componentInstance.idEstudio = this.idEstudio;
            modalRef.componentInstance.codMaeRequisito = this.codMaeRequisito;
            modalRef.result.then(
              (result) => {// Maneja el resultado aquí
                //this.frmSolicitud.Objetivo = result;
              },
              (reason) => {// Maneja la cancelación aquí
                this.getData();
                console.log('Modal fue cerrado sin resultado:', reason);
              });
          }
        },
        status: { text: '', icon: 'edit' }, 
        comment: { 
          text: '', 
          icon: '',
          onClick: (row: TableRow, column: TableColumn) => {
          //Esta funcion abre el modal de comentarios para tabla  
          if(row[column.field].icon=='chat'){
          const modalOptions: NgbModalOptions = {
            size: 'lg',
            centered: true,
            ariaLabelledBy: 'modal-basic-title',
          };
          const openComentTable = this.modalService.open(CommentModalTableComponent, modalOptions);
          openComentTable.componentInstance.data = {
            "codMaeSolicitud": this.codMaeSolicitud,
            "regUsuaRegistra": this.regUsuaRegistra,
            "codMovPersona": this.codMovPersona,
            "capitulo": '2.6',
            "nombreCapitulo": row['index'].text
          }
       
        }
        }
      },
        observations: {
          htmlText: '',
          textAlign: 'left'
        },
        hora: { text: '' }
      },
      {
        index: {
          text: '2.7 DESCRIPCIÓN DE LA ETAPA DE CONSTRUCCIÓN / HABILITACIÓN Y OPERACIÓN',
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
            modalRef.componentInstance.codMaeSolicitud = this.codMaeSolicitud;
            modalRef.componentInstance.modoVisualizacion = this.modoVisualizacion;
            modalRef.componentInstance.idCliente = this.idCliente;
            modalRef.componentInstance.idEstudio = this.idEstudio;
            modalRef.componentInstance.codMaeRequisito = this.codMaeRequisito;
            //modalRef.componentInstance.data = this.frmSolicitud;
            modalRef.result.then(
              (result) => {// Maneja el resultado aquí
                //this.frmSolicitud = result;
              },
              (reason) => {// Maneja la cancelación aquí
                this.getData();
                console.log('Modal fue cerrado sin resultado:', reason);
              });
          }
        },
        status: { text: '', icon: 'edit' }, 
        comment: { 
          text: '', 
          icon: '',
          onClick: (row: TableRow, column: TableColumn) => {
          //Esta funcion abre el modal de comentarios para tabla  
          if(row[column.field].icon=='chat'){
          const modalOptions: NgbModalOptions = {
            size: 'lg',
            centered: true,
            ariaLabelledBy: 'modal-basic-title',
          };
          const openComentTable = this.modalService.open(CommentModalTableComponent, modalOptions);
          openComentTable.componentInstance.data = {
            "codMaeSolicitud": this.codMaeSolicitud,
            "regUsuaRegistra": this.regUsuaRegistra,
            "codMovPersona": this.codMovPersona,
            "capitulo": '2.7',
            "nombreCapitulo": row['index'].text
          }
       
        }
        }
      },
        observations: {
          htmlText: '',
          textAlign: 'left'
        },
        hora: { text: '' }
      },
      /******* 3 *********/
      {
        index: { htmlText: '<b>3. LÍNEA BASE</b>', isTitle: true },
        status: { text: '' },
        comment: { 
          text: '', 
          icon: ''
      },
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
            modalRef.componentInstance.codMaeSolicitud = this.codMaeSolicitud;
            modalRef.componentInstance.modoVisualizacion = this.modoVisualizacion;
            modalRef.componentInstance.codMaeRequisito = this.codMaeRequisito;
            modalRef.result.then(
              (result) => {// Maneja el resultado aquí
                //this.frmSolicitud = result;
              },
              (reason) => {// Maneja la cancelación aquí
                this.getData();
                console.log('Modal fue cerrado sin resultado:', reason);
              });
          }
        },
        status: { text: '', icon: 'edit' }, 
        comment: { 
          text: '', 
          icon: '',
          onClick: (row: TableRow, column: TableColumn) => {
          //Esta funcion abre el modal de comentarios para tabla  
          if(row[column.field].icon=='chat'){
          const modalOptions: NgbModalOptions = {
            size: 'lg',
            centered: true,
            ariaLabelledBy: 'modal-basic-title',
          };
          const openComentTable = this.modalService.open(CommentModalTableComponent, modalOptions);
          openComentTable.componentInstance.data = {
            "codMaeSolicitud": this.codMaeSolicitud,
            "regUsuaRegistra": this.regUsuaRegistra,
            "codMovPersona": this.codMovPersona,
            "capitulo": '3.1',
            "nombreCapitulo": row['index'].text
          }
       
        }
        }
      },
        observations: {
          htmlText: '',
          textAlign: 'left'
        },
        hora: { text: '' }
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
            modalRef.componentInstance.codMaeSolicitud = this.codMaeSolicitud;
            modalRef.componentInstance.modoVisualizacion = this.modoVisualizacion;
            modalRef.componentInstance.codMaeRequisito = this.codMaeRequisito;
            modalRef.result.then(
              (result) => {// Maneja el resultado aquí
                //this.frmSolicitud = result;
              },
              (reason) => {// Maneja la cancelación aquí
                this.getData();
                console.log('Modal fue cerrado sin resultado:', reason);
              });
          }
        },
        status: { text: '', icon: 'edit' }, 
        comment: { 
          text: '', 
          icon: '',
          onClick: (row: TableRow, column: TableColumn) => {
          //Esta funcion abre el modal de comentarios para tabla  
          if(row[column.field].icon=='chat'){
          const modalOptions: NgbModalOptions = {
            size: 'lg',
            centered: true,
            ariaLabelledBy: 'modal-basic-title',
          };
          const openComentTable = this.modalService.open(CommentModalTableComponent, modalOptions);
          openComentTable.componentInstance.data = {
            "codMaeSolicitud": this.codMaeSolicitud,
            "regUsuaRegistra": this.regUsuaRegistra,
            "codMovPersona": this.codMovPersona,
            "capitulo": '3.2',
            "nombreCapitulo": row['index'].text
          }
       
        }
        }
      },
        observations: {
          htmlText: '',
          textAlign: 'left'
        },
        hora: { text: '' }
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
            modalRef.componentInstance.codMaeSolicitud = this.codMaeSolicitud;
            modalRef.componentInstance.modoVisualizacion = this.modoVisualizacion;            
            modalRef.componentInstance.codMaeRequisito = this.codMaeRequisito;
            modalRef.result.then(
              (result) => {// Maneja el resultado aquí
                //this.frmSolicitud = result;
              },
              (reason) => {// Maneja la cancelación aquí
                this.getData();
                console.log('Modal fue cerrado sin resultado:', reason);
              });
          }
        },
        status: { text: '', icon: 'edit' }, 
        comment: { 
          text: '', 
          icon: '',
          onClick: (row: TableRow, column: TableColumn) => {
          //Esta funcion abre el modal de comentarios para tabla  
          if(row[column.field].icon=='chat'){
          const modalOptions: NgbModalOptions = {
            size: 'lg',
            centered: true,
            ariaLabelledBy: 'modal-basic-title',
          };
          const openComentTable = this.modalService.open(CommentModalTableComponent, modalOptions);
          openComentTable.componentInstance.data = {
            "codMaeSolicitud": this.codMaeSolicitud,
            "regUsuaRegistra": this.regUsuaRegistra,
            "codMovPersona": this.codMovPersona,
            "capitulo": '3.3',
            "nombreCapitulo": row['index'].text
          }
       
        }
        }
      },
        observations: {
          htmlText: '',
          textAlign: 'left'
        },
        hora: { text: '' }
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
            modalRef.componentInstance.codMaeSolicitud = this.codMaeSolicitud;
            modalRef.componentInstance.modoVisualizacion = this.modoVisualizacion;
            modalRef.componentInstance.codMaeRequisito = this.codMaeRequisito;
            modalRef.result.then(
              (result) => {// Maneja el resultado aquí
                //this.frmSolicitud = result;
              },
              (reason) => {// Maneja la cancelación aquí
                this.getData();
                console.log('Modal fue cerrado sin resultado:', reason);
              });
          }
        },
        status: { text: '', icon: 'edit' }, 
        comment: { 
          text: '', 
          icon: '',
          onClick: (row: TableRow, column: TableColumn) => {
          //Esta funcion abre el modal de comentarios para tabla  
          if(row[column.field].icon=='chat'){
          const modalOptions: NgbModalOptions = {
            size: 'lg',
            centered: true,
            ariaLabelledBy: 'modal-basic-title',
          };
          const openComentTable = this.modalService.open(CommentModalTableComponent, modalOptions);
          openComentTable.componentInstance.data = {
            "codMaeSolicitud": this.codMaeSolicitud,
            "regUsuaRegistra": this.regUsuaRegistra,
            "codMovPersona": this.codMovPersona,
            "capitulo": '3.4',
            "nombreCapitulo": row['index'].text
          }
       
        }
        }
      },
        observations: {
          htmlText: '',
          textAlign: 'left'
        },
        hora: { text: '' }
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
            modalRef.componentInstance.codMaeSolicitud = this.codMaeSolicitud;
            modalRef.componentInstance.modoVisualizacion = this.modoVisualizacion;
            modalRef.componentInstance.codMaeRequisito = this.codMaeRequisito;
            modalRef.result.then(
              (result) => {// Maneja el resultado aquí
                //this.frmSolicitud = result;
              },
              (reason) => {// Maneja la cancelación aquí
                this.getData();
                console.log('Modal fue cerrado sin resultado:', reason);
              });
          }
        },
        status: { text: '', icon: 'edit' }, 
        comment: { 
          text: '', 
          icon: '',
          onClick: (row: TableRow, column: TableColumn) => {
          //Esta funcion abre el modal de comentarios para tabla  
          if(row[column.field].icon=='chat'){
          const modalOptions: NgbModalOptions = {
            size: 'lg',
            centered: true,
            ariaLabelledBy: 'modal-basic-title',
          };
          const openComentTable = this.modalService.open(CommentModalTableComponent, modalOptions);
          openComentTable.componentInstance.data = {
            "codMaeSolicitud": this.codMaeSolicitud,
            "regUsuaRegistra": this.regUsuaRegistra,
            "codMovPersona": this.codMovPersona,
            "capitulo": '3.5',
            "nombreCapitulo": row['index'].text
          }
       
        }
        }
      },
        observations: {
          htmlText: '',
          textAlign: 'left'
        },
        hora: { text: '' }
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
            modalRef.componentInstance.codMaeSolicitud = this.codMaeSolicitud;
            modalRef.componentInstance.modoVisualizacion = this.modoVisualizacion;
            modalRef.componentInstance.codMaeRequisito = this.codMaeRequisito;
            modalRef.result.then(
              (result) => {// Maneja el resultado aquí
                //this.frmSolicitud = result;
              },
              (reason) => {// Maneja la cancelación aquí
                this.getData();
                console.log('Modal fue cerrado sin resultado:', reason);
              });
          }
        },
        status: { text: '', icon: 'edit' }, 
        comment: { 
          text: '', 
          icon: '',
          onClick: (row: TableRow, column: TableColumn) => {
          //Esta funcion abre el modal de comentarios para tabla  
          if(row[column.field].icon=='chat'){
          const modalOptions: NgbModalOptions = {
            size: 'lg',
            centered: true,
            ariaLabelledBy: 'modal-basic-title',
          };
          const openComentTable = this.modalService.open(CommentModalTableComponent, modalOptions);
          openComentTable.componentInstance.data = {
            "codMaeSolicitud": this.codMaeSolicitud,
            "regUsuaRegistra": this.regUsuaRegistra,
            "codMovPersona": this.codMovPersona,
            "capitulo": '3.6',
            "nombreCapitulo": row['index'].text
          }
       
        }
        }
      },
        observations: {
          htmlText: '',
          textAlign: 'left'
        },
        hora: { text: '' }
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
            modalRef.componentInstance.codMaeSolicitud = this.codMaeSolicitud;
            modalRef.componentInstance.modoVisualizacion = this.modoVisualizacion;
            modalRef.componentInstance.idCliente = this.idCliente;
            modalRef.componentInstance.idEstudio = this.idEstudio;
            modalRef.componentInstance.codMaeRequisito = this.codMaeRequisito;
            modalRef.result.then(
              (result) => {// Maneja el resultado aquí
                //this.frmSolicitud = result;
              },
              (reason) => {// Maneja la cancelación aquí
                this.getData();
                console.log('Modal fue cerrado sin resultado:', reason);
              });
          }
        },
        status: { text: '', icon: 'edit' }, 
        comment: { 
          text: '', 
          icon: '',
          onClick: (row: TableRow, column: TableColumn) => {
          //Esta funcion abre el modal de comentarios para tabla  
          if(row[column.field].icon=='chat'){
          const modalOptions: NgbModalOptions = {
            size: 'lg',
            centered: true,
            ariaLabelledBy: 'modal-basic-title',
          };
          const openComentTable = this.modalService.open(CommentModalTableComponent, modalOptions);
          openComentTable.componentInstance.data = {
            "codMaeSolicitud": this.codMaeSolicitud,
            "regUsuaRegistra": this.regUsuaRegistra,
            "codMovPersona": this.codMovPersona,
            "capitulo": '4',
            "nombreCapitulo": row['index'].text
          }
       
        }
        }
      },
        observations: {
          htmlText: '',
          textAlign: 'left'
        },
        hora: { text: '' }
      },
      /******* 5 *********/
      {
        index: {
          text: '5. DESCRIPCIÓN DE LOS POSIBLES IMPACTOS AMBIENTALES',
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
            modalRef.componentInstance.codMaeSolicitud = this.codMaeSolicitud;
            modalRef.componentInstance.modoVisualizacion = this.modoVisualizacion;
            modalRef.componentInstance.codMaeRequisito = this.codMaeRequisito;
            modalRef.result.then(
              (result) => {// Maneja el resultado aquí
                //this.frmSolicitud = result;
              },
              (reason) => {// Maneja la cancelación aquí
                this.getData();
                console.log('Modal fue cerrado sin resultado:', reason);
              });
          }
        },
        status: { text: '', icon: 'edit' }, 
        comment: { 
          text: '', 
          icon: '',
          onClick: (row: TableRow, column: TableColumn) => {
          //Esta funcion abre el modal de comentarios para tabla  
          if(row[column.field].icon=='chat'){
          const modalOptions: NgbModalOptions = {
            size: 'lg',
            centered: true,
            ariaLabelledBy: 'modal-basic-title',
          };
          const openComentTable = this.modalService.open(CommentModalTableComponent, modalOptions);
          openComentTable.componentInstance.data = {
            "codMaeSolicitud": this.codMaeSolicitud,
            "regUsuaRegistra": this.regUsuaRegistra,
            "codMovPersona": this.codMovPersona,
            "capitulo": '5',
            "nombreCapitulo": row['index'].text
          }
       
        }
        }
      },
        observations: {
          htmlText: '',
          textAlign: 'left'
        },
        hora: { text: '' }
      },
      /******* 6 *********/
      {
        index: { htmlText: '<b>6. PLAN DE MANEJO AMBIENTAL</b>', isTitle: true },
        status: { text: '' },
        comment: { 
          text: '', 
          icon: ''
      },
        observations: {
          htmlText: '',
          textAlign: 'left'
        },
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
            modalRef.componentInstance.codMaeSolicitud = this.codMaeSolicitud;
            modalRef.componentInstance.modoVisualizacion = this.modoVisualizacion;
            modalRef.componentInstance.idCliente = this.idCliente;
            modalRef.componentInstance.idEstudio = this.idEstudio;
            modalRef.componentInstance.codMaeRequisito = this.codMaeRequisito;
            modalRef.result.then(
              (result) => {// Maneja el resultado aquí
                //this.frmSolicitud = result;
              },
              (reason) => {// Maneja la cancelación aquí
                this.getData();
                console.log('Modal fue cerrado sin resultado:', reason);
              });
          }
        },
        status: { text: '', icon: 'edit' }, 
        comment: { 
          text: '', 
          icon: '',
          onClick: (row: TableRow, column: TableColumn) => {
          //Esta funcion abre el modal de comentarios para tabla  
          if(row[column.field].icon=='chat'){
          const modalOptions: NgbModalOptions = {
            size: 'lg',
            centered: true,
            ariaLabelledBy: 'modal-basic-title',
          };
          const openComentTable = this.modalService.open(CommentModalTableComponent, modalOptions);
          openComentTable.componentInstance.data = {
            "codMaeSolicitud": this.codMaeSolicitud,
            "regUsuaRegistra": this.regUsuaRegistra,
            "codMovPersona": this.codMovPersona,
            "capitulo": '6.1',
            "nombreCapitulo": row['index'].text
          }
       
        }
        }
      },
        observations: {
          htmlText: '',
          textAlign: 'left'
        },
        hora: { text: '' }
      },
      {
        index: {
          text: '6.2 PLAN DE VIGILANCIA AMBIENTAL',
          hasCursorPointer: true,
          onClick: (row: TableRow, column: TableColumn) => {
            const modalOptions: NgbModalOptions = {
              size: 'xl',
              centered: true,
              ariaLabelledBy: 'modal-basic-title',
              scrollable: true
            };
            const modalRef = this.modalService.open(PlanVigilanciaAmbientalDialogComponent, modalOptions);
            modalRef.componentInstance.title = row['index'].text;
            modalRef.componentInstance.codMaeSolicitud = this.codMaeSolicitud;
            modalRef.componentInstance.modoVisualizacion = this.modoVisualizacion;
            modalRef.componentInstance.idCliente = this.idCliente;
            modalRef.componentInstance.idEstudio = this.idEstudio;
            modalRef.componentInstance.codMaeRequisito = this.codMaeRequisito;
            modalRef.result.then(
              (result) => {// Maneja el resultado aquí
                //this.frmSolicitud = result;
              },
              (reason) => {// Maneja la cancelación aquí
                this.getData();
                console.log('Modal fue cerrado sin resultado:', reason);
              });
          }
        },
        status: { text: '', icon: 'edit' }, 
        comment: { 
          text: '', 
          icon: '',
          onClick: (row: TableRow, column: TableColumn) => {
          //Esta funcion abre el modal de comentarios para tabla  
          if(row[column.field].icon=='chat'){
          const modalOptions: NgbModalOptions = {
            size: 'lg',
            centered: true,
            ariaLabelledBy: 'modal-basic-title',
          };
          const openComentTable = this.modalService.open(CommentModalTableComponent, modalOptions);
          openComentTable.componentInstance.data = {
            "codMaeSolicitud": this.codMaeSolicitud,
            "regUsuaRegistra": this.regUsuaRegistra,
            "codMovPersona": this.codMovPersona,
            "capitulo": '6.2',
            "nombreCapitulo": row['index'].text
          }
       
        }
        }
      },
        observations: {
          htmlText: '',
          textAlign: 'left'
        },
        hora: { text: '' }
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
            modalRef.componentInstance.codMaeSolicitud = this.codMaeSolicitud;
            modalRef.componentInstance.modoVisualizacion = this.modoVisualizacion;
            modalRef.componentInstance.idCliente = this.idCliente;
            modalRef.componentInstance.idEstudio = this.idEstudio;
            modalRef.componentInstance.codMaeRequisito = this.codMaeRequisito;
            modalRef.result.then(
              (result) => {// Maneja el resultado aquí
                //this.frmSolicitud = result;
              },
              (reason) => {// Maneja la cancelación aquí
                this.getData();
                console.log('Modal fue cerrado sin resultado:', reason);
              });
          }
        },
        status: { text: '', icon: 'edit' }, 
        comment: { 
          text: '', 
          icon: '',
          onClick: (row: TableRow, column: TableColumn) => {
          //Esta funcion abre el modal de comentarios para tabla  
          if(row[column.field].icon=='chat'){
          const modalOptions: NgbModalOptions = {
            size: 'lg',
            centered: true,
            ariaLabelledBy: 'modal-basic-title',
          };
          const openComentTable = this.modalService.open(CommentModalTableComponent, modalOptions);
          openComentTable.componentInstance.data = {
            "codMaeSolicitud": this.codMaeSolicitud,
            "regUsuaRegistra": this.regUsuaRegistra,
            "codMovPersona": this.codMovPersona,
            "capitulo": '6.3',
            "nombreCapitulo": row['index'].text
          }
       
        }
        }
      },
        observations: {
          htmlText: '',
          textAlign: 'left'
        },
        hora: { text: '' }
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
            modalRef.componentInstance.codMaeSolicitud = this.codMaeSolicitud;
            modalRef.componentInstance.modoVisualizacion = this.modoVisualizacion;
            modalRef.componentInstance.idCliente = this.idCliente;
            modalRef.componentInstance.idEstudio = this.idEstudio;
            modalRef.componentInstance.codMaeRequisito = this.codMaeRequisito;
            modalRef.result.then(
              (result) => {// Maneja el resultado aquí
                //this.frmSolicitud = result;
              },
              (reason) => {// Maneja la cancelación aquí
                this.getData();
                console.log('Modal fue cerrado sin resultado:', reason);
              });
          }
        },
        status: { text: '', icon: 'edit' }, 
        comment: { 
          text: '', 
          icon: '',
          onClick: (row: TableRow, column: TableColumn) => {
          //Esta funcion abre el modal de comentarios para tabla  
          if(row[column.field].icon=='chat'){
          const modalOptions: NgbModalOptions = {
            size: 'lg',
            centered: true,
            ariaLabelledBy: 'modal-basic-title',
          };
          const openComentTable = this.modalService.open(CommentModalTableComponent, modalOptions);
          openComentTable.componentInstance.data = {
            "codMaeSolicitud": this.codMaeSolicitud,
            "regUsuaRegistra": this.regUsuaRegistra,
            "codMovPersona": this.codMovPersona,
            "capitulo": '6.4',
            "nombreCapitulo": row['index'].text
          }
       
        }
        }
      },
        observations: {
          htmlText: '',
          textAlign: 'left'
        },
        hora: { text: '' }
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
            modalRef.componentInstance.codMaeSolicitud = this.codMaeSolicitud;
            modalRef.componentInstance.modoVisualizacion = this.modoVisualizacion;
            modalRef.componentInstance.idCliente = this.idCliente;
            modalRef.componentInstance.idEstudio = this.idEstudio;
            modalRef.componentInstance.codMaeRequisito = this.codMaeRequisito;
            modalRef.result.then(
              (result) => {// Maneja el resultado aquí
                //this.frmSolicitud = result;
              },
              (reason) => {// Maneja la cancelación aquí
                this.getData();
                console.log('Modal fue cerrado sin resultado:', reason);
              });
          }
        },
        status: { text: '', icon: 'edit' }, 
        comment: { 
          text: '', 
          icon: '',
          onClick: (row: TableRow, column: TableColumn) => {
          //Esta funcion abre el modal de comentarios para tabla  
          if(row[column.field].icon=='chat'){
          const modalOptions: NgbModalOptions = {
            size: 'lg',
            centered: true,
            ariaLabelledBy: 'modal-basic-title',
          };
          const openComentTable = this.modalService.open(CommentModalTableComponent, modalOptions);
          openComentTable.componentInstance.data = {
            "codMaeSolicitud": this.codMaeSolicitud,
            "regUsuaRegistra": this.regUsuaRegistra,
            "codMovPersona": this.codMovPersona,
            "capitulo": '6.5',
            "nombreCapitulo": row['index'].text
          }
       
        }
        }
      },
        observations: {
          htmlText: '',
          textAlign: 'left'
        },
        hora: { text: '' }
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
            modalRef.componentInstance.codMaeSolicitud = this.codMaeSolicitud;
            modalRef.componentInstance.modoVisualizacion = this.modoVisualizacion;
            modalRef.componentInstance.idCliente = this.idCliente;
            modalRef.componentInstance.idEstudio = this.idEstudio;
            modalRef.componentInstance.codMaeRequisito = this.codMaeRequisito;
            modalRef.result.then(
              (result) => {// Maneja el resultado aquí
                //this.frmSolicitud = result;
              },
              (reason) => {// Maneja la cancelación aquí
                this.getData();
                console.log('Modal fue cerrado sin resultado:', reason);
              });
          }
        },
        status: { text: '', icon: 'edit' }, 
        comment: { 
          text: '', 
          icon: '',
          onClick: (row: TableRow, column: TableColumn) => {
          //Esta funcion abre el modal de comentarios para tabla  
          if(row[column.field].icon=='chat'){
          const modalOptions: NgbModalOptions = {
            size: 'lg',
            centered: true,
            ariaLabelledBy: 'modal-basic-title',
          };
          const openComentTable = this.modalService.open(CommentModalTableComponent, modalOptions);
          openComentTable.componentInstance.data = {
            "codMaeSolicitud": this.codMaeSolicitud,
            "regUsuaRegistra": this.regUsuaRegistra,
            "codMovPersona": this.codMovPersona,
            "capitulo": '6.6',
            "nombreCapitulo": row['index'].text
          }
       
        }
        }
      },
        observations: {
          htmlText: '',
          textAlign: 'left'
        },
        hora: { text: '' }
      },
      {
        index: {
          text: '6.7. CUADRO RESUMEN CONTENIENDO LOS COMPROMISOS AMBIENTALES SEÑALADOS EN EL PLAN DE MANEJO AMBIENTAL',
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
            modalRef.componentInstance.codMaeSolicitud = this.codMaeSolicitud;
            modalRef.componentInstance.modoVisualizacion = this.modoVisualizacion;
            modalRef.componentInstance.idCliente = this.idCliente;
            modalRef.componentInstance.idEstudio = this.idEstudio;
            modalRef.componentInstance.codMaeRequisito = this.codMaeRequisito;
            modalRef.result.then(
              (result) => {// Maneja el resultado aquí
                //this.frmSolicitud = result;
              },
              (reason) => {// Maneja la cancelación aquí
                this.getData();
                console.log('Modal fue cerrado sin resultado:', reason);
              });
          }
        },
        status: { text: '', icon: 'edit' }, 
        comment: { 
          text: '', 
          icon: '',
          onClick: (row: TableRow, column: TableColumn) => {
          //Esta funcion abre el modal de comentarios para tabla  
          if(row[column.field].icon=='chat'){
          const modalOptions: NgbModalOptions = {
            size: 'lg',
            centered: true,
            ariaLabelledBy: 'modal-basic-title',
          };
          const openComentTable = this.modalService.open(CommentModalTableComponent, modalOptions);
          openComentTable.componentInstance.data = {
            "codMaeSolicitud": this.codMaeSolicitud,
            "regUsuaRegistra": this.regUsuaRegistra,
            "codMovPersona": this.codMovPersona,
            "capitulo": '6.7',
            "nombreCapitulo": row['index'].text
          }
       
        }
        }
      },
        observations: {
          htmlText: '',
          textAlign: 'left'
        },
        hora: { text: '' }
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
            modalRef.componentInstance.codMaeSolicitud = this.codMaeSolicitud;
            modalRef.componentInstance.modoVisualizacion = this.modoVisualizacion;
            modalRef.componentInstance.idCliente = this.idCliente;
            modalRef.componentInstance.idEstudio = this.idEstudio;
            modalRef.componentInstance.codMaeRequisito = this.codMaeRequisito;
            modalRef.result.then(
              (result) => {// Maneja el resultado aquí
                //this.frmSolicitud = result;
              },
              (reason) => {// Maneja la cancelación aquí
                this.getData();
                console.log('Modal fue cerrado sin resultado:', reason);
              });
          }
        },
        status: { text: '', icon: 'edit' }, 
        comment: { 
          text: '', 
          icon: '',
          onClick: (row: TableRow, column: TableColumn) => {
          //Esta funcion abre el modal de comentarios para tabla  
          if(row[column.field].icon=='chat'){
          const modalOptions: NgbModalOptions = {
            size: 'lg',
            centered: true,
            ariaLabelledBy: 'modal-basic-title',
          };
          const openComentTable = this.modalService.open(CommentModalTableComponent, modalOptions);
          openComentTable.componentInstance.data = {
            "codMaeSolicitud": this.codMaeSolicitud,
            "regUsuaRegistra": this.regUsuaRegistra,
            "codMovPersona": this.codMovPersona,
            "capitulo": '7',
            "nombreCapitulo": row['index'].text
          }
       
        }
        }
      },
        observations: {
          htmlText: '',
          textAlign: 'left'
        },
        hora: { text: '' }
      },
      /******* 8 *********/
      {
        index: {
          text: '8. SOLICITUD DE TÍTULO HABILITANTE',
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
            modalRef.componentInstance.codMaeSolicitud = this.codMaeSolicitud;
            modalRef.componentInstance.modoVisualizacion = this.modoVisualizacion;
            modalRef.componentInstance.idCliente = this.idCliente;
            modalRef.componentInstance.idEstudio = this.idEstudio;
            modalRef.componentInstance.codMaeRequisito = this.codMaeRequisito;
            modalRef.result.then(
              (result) => {// Maneja el resultado aquí
                //this.frmSolicitud = result;
             
              },
              (reason) => {// Maneja la cancelación aquí
                this.getData();
                console.log('Modal fue cerrado sin resultado:', reason);
              });
          }
        },
        status: { text: '', icon: 'edit' }, 
        comment: { 
          text: '', 
          icon: '',
          onClick: (row: TableRow, column: TableColumn) => {
          //Esta funcion abre el modal de comentarios para tabla  
          if(row[column.field].icon=='chat'){
          const modalOptions: NgbModalOptions = {
            size: 'lg',
            centered: true,
            ariaLabelledBy: 'modal-basic-title',
          };
          const openComentTable = this.modalService.open(CommentModalTableComponent, modalOptions);
          openComentTable.componentInstance.data = {
            "codMaeSolicitud": this.codMaeSolicitud,
            "regUsuaRegistra": this.regUsuaRegistra,
            "codMovPersona": this.codMovPersona,
            "capitulo": '8',
            "nombreCapitulo": row['index'].text
          }
       
        }
        }
      },
        observations: {
          htmlText: '',
          textAlign: 'left'
        },
        hora: { text: '' }
      },

    ];
  }
  solicitudObservacion = [];
  constructor(
    private router: Router,
    private tramiteService: TramiteService,
    private funcionesMtcService: FuncionesMtcService,
    private seguridadService: SeguridadService,
    private observacionService: ObservacionService
  ) { }

  ngOnInit(): void {
    this.getData();

    const tramite = localStorage.getItem('tramite-selected');
    const tramiteObj = JSON.parse(tramite);
    this.estadoSolicitud = tramiteObj.estadoSolicitud;
    this.modoVisualizacion = this.esFuncionario ? true : (!(this.estadoSolicitud !== 'EN PROCESO')
    || !(this.estadoSolicitud !== 'FINALIZADO')
    || !(this.estadoSolicitud !== 'APROBADO')
    || !(this.estadoSolicitud !== 'DESAPROBADO')
    || !(this.estadoSolicitud !== 'DESISTIDO')
    || !(this.estadoSolicitud !== 'ABANDONO'));
    this.setTableData();
/*
    var i = 0;
    this.tableData.forEach(row => {
      debugger;
      if (i == 1 || i == 9 || i == 18) { } else {
        if (this.estadoSolicitud === 'OBSERVADO') {
          row.observations.icon = 'chat';
        } else {
          row.observations.icon = '';
        }
      }
      i++;
    });
    */
    
  }

  getData() {
    this.funcionesMtcService.mostrarCargando();
    const CodMaeSolicitud = this.codMaeSolicitud;
    this.tramiteService.getFormularioDia(CodMaeSolicitud).subscribe(resp => {
      this.funcionesMtcService.ocultarCargando();
      if (resp.success) {
        localStorage.setItem("form-dia", resp.data.dataJson);
        const formDia = localStorage.getItem('form-dia');
        this.dataFormDia = JSON.parse(formDia);
        this.refreshTableData(CodMaeSolicitud);
      }
      else
        this.funcionesMtcService.ocultarCargando().mensajeError('No se grabó el formulario');
    });
  }

  close() {  
  
    this.router.navigate(['tramite-iniciado'], { queryParams: {  denominacionEstado: this.estadoSolicitud } });
  }

  modificarStatusPorIndice(indice: number, propiedadPath: string, capitulo: string) {
    // Mapa de estados a iconos
    // const stateToIconMap = {
    //   1: 'warning',
    //   2: 'done',
    //   3: 'close'
    // };

    // Función para acceder a una propiedad anidada
    const getNestedProperty = (obj: any, path: string) => {
      return path.split('.').reduce((acc, part) => acc && acc[part], obj);
    };

    // Obtener el valor de 'State' dinámicamente usando la ruta de propiedad
    const state = getNestedProperty(this.dataFormDia, propiedadPath)?.State;

    // Asignar el icono según el estado
    let icon = CONSTANTES.StateToIconMap[state] || 'edit';
    let iconClass = CONSTANTES.StateToIconClassMap[state] || 'no-data';
    
    const observacion = this.solicitudObservacion.find(item => item.capitulo === capitulo);
    if(this.estadoSolicitud=='APROBADO' && observacion){
      icon= 'done';      
    }else if((this.estadoSolicitud === 'OBSERVADO' || 
      this.estadoSolicitud=='INFORMACION COMPLEMENTARIA') && observacion){        
        icon= 'warning';  
    }

    // Asignar el icono al campo correspondiente en la tabla
    this.tableData[indice].status.icon = icon;
    this.tableData[indice].comment.iconClass = icon;
    this.tableData[indice].status.iconClass = iconClass;  
  }

  modificarStatusPorString(indice: number, texto?: string, capitulo?: string) {
    let icon = 'edit';
    if (texto?.trim().length > 0) {
      icon = 'done';
    }

    let iconClass = CONSTANTES.StateIconToIconClassMap[icon] || 'no-data';

    const observacion = this.solicitudObservacion.find(item => item.capitulo === capitulo);
    if(this.estadoSolicitud=='APROBADO' && observacion){
      icon= 'done';      
    }else if((this.estadoSolicitud === 'OBSERVADO' || 
      this.estadoSolicitud=='INFORMACION COMPLEMENTARIA') && observacion){        
        icon= 'warning';  
    }

    // Asignar el icono al campo correspondiente en la tabla
    this.tableData[indice].status.icon = icon;
    this.tableData[indice].comment.iconClass = icon;
    this.tableData[indice].status.iconClass = iconClass;
  }

  modificarStatusPorArray(indice: number, array: string[], capitulo: string) {
    let icon = 'edit';
    if (array.length > 0) {
      icon = 'done';
    }

    let iconClass = CONSTANTES.StateIconToIconClassMap[icon] || 'no-data';

     
    const observacion = this.solicitudObservacion.find(item => item.capitulo === capitulo);
    if(this.estadoSolicitud=='APROBADO' && observacion){
      icon= 'done';      
    }else if((this.estadoSolicitud === 'OBSERVADO' || 
      this.estadoSolicitud=='INFORMACION COMPLEMENTARIA') && observacion){        
        icon= 'warning';  
    }

    // Asignar el icono al campo correspondiente en la tabla
    this.tableData[indice].status.icon = icon;
    this.tableData[indice].comment.iconClass = icon;
    this.tableData[indice].status.iconClass = iconClass;
  }


  async refreshTableData(codMaeSolicitud) {

    await this.getSolicitudObservation(codMaeSolicitud);
  
    this.tableData.forEach(async (row, i) => {
      let node: string;
      var capitulo: string;  
      capitulo = CONSTANTES.CapituloFormDia[i];
      switch (i) {
        case 0: { node = CONSTANTES.FormDia.RESUMEN_EJECUTIVO; this.modificarStatusPorIndice(i, 'ResumenEjecutivo',capitulo); capitulo = CONSTANTES.CapituloFormDia[i]; break; }
        case 2: { node = CONSTANTES.FormDia.DESCRIPCION_PROYECTO; this.modificarStatusPorIndice(i, 'DescripcionProyecto.Antecedentes', capitulo); capitulo = CONSTANTES.CapituloFormDia[i]; break; }
        case 3: { node = CONSTANTES.FormDia.OBJETIVO; this.modificarStatusPorString(i, this.dataFormDia.Objetivo, capitulo); capitulo = CONSTANTES.CapituloFormDia[i]; break; }
        case 4: { node = CONSTANTES.FormDia.LOCALIZACION_GEOGRAFICA; this.modificarStatusPorIndice(i, 'DescripcionProyecto.LocalizacionGeografica', capitulo); capitulo = CONSTANTES.CapituloFormDia[i]; break;}
        case 5: { node = CONSTANTES.FormDia.DELIMITACION; this.modificarStatusPorIndice(i, 'DescripcionProyecto.Delimitacion', capitulo); capitulo = CONSTANTES.CapituloFormDia[i]; break; }
        case 6: { node = CONSTANTES.FormDia.AREAS_INFLUENCIA; this.modificarStatusPorIndice(i, 'DescripcionProyecto.AreasInfluencia', capitulo); capitulo = CONSTANTES.CapituloFormDia[i]; break; }
        case 7: { node = CONSTANTES.FormDia.CRONOGRAMA_INVERSION; this.modificarStatusPorIndice(i, 'DescripcionProyecto.CronogramaInversion', capitulo); capitulo = CONSTANTES.CapituloFormDia[i]; break; }
        case 8: { node = CONSTANTES.FormDia.DESCRIPCION_ETAPAS; this.modificarStatusPorIndice(i, 'DescripcionProyecto.DescripcionEtapas', capitulo); capitulo = CONSTANTES.CapituloFormDia[i]; break; }
        case 10: { node = CONSTANTES.FormDia.DESCRIPCION_MEDIO_FISICO; this.modificarStatusPorIndice(i, 'DescripcionMedioFisico', capitulo); capitulo = CONSTANTES.CapituloFormDia[i]; break; }
        case 11: { node = CONSTANTES.FormDia.DESCRIPCION_MEDIO_BIOLOGICO; this.modificarStatusPorIndice(i, 'DescripcionMedioBiologico', capitulo); capitulo = CONSTANTES.CapituloFormDia[i]; break; }
        case 12: { node = CONSTANTES.FormDia.PUNTO_MUESTREO; this.modificarStatusPorArray(i, this.dataFormDia.PuntoMuestreo, capitulo); capitulo = CONSTANTES.CapituloFormDia[i]; break; }
        case 13: { node = CONSTANTES.FormDia.DESCRIPCION_ASPECTO_SOCIAL; this.modificarStatusPorIndice(i, 'DescripcionAspectoSocial', capitulo); capitulo = CONSTANTES.CapituloFormDia[i]; break; }
        case 14: { node = CONSTANTES.FormDia.ARQUEOLOGIA; this.modificarStatusPorIndice(i, 'Arqueologia', capitulo); capitulo = CONSTANTES.CapituloFormDia[i]; break; }
        case 15: { node = CONSTANTES.FormDia.CARTOGRAFIA; this.modificarStatusPorArray(i, this.dataFormDia.Cartografia, capitulo); capitulo = CONSTANTES.CapituloFormDia[i]; break; }
        case 16: { node = CONSTANTES.FormDia.PARTICIPACION_CIUDADANA; this.modificarStatusPorIndice(i, 'ParticipacionCiudadana', capitulo); capitulo = CONSTANTES.CapituloFormDia[i]; break; }
        case 17: { node = CONSTANTES.FormDia.IMPACTOS_AMBIENTALES; this.modificarStatusPorArray(i, this.dataFormDia.ImpactosAmbientales, capitulo); capitulo = CONSTANTES.CapituloFormDia[i]; break; }
        case 19: { node = CONSTANTES.FormDia.PLAN_MANEJO_AMBIENTAL; this.modificarStatusPorArray(i, this.dataFormDia.PlanManejoAmbiental.PlanManejo, capitulo); capitulo = CONSTANTES.CapituloFormDia[i]; break; }
        case 20: { node = CONSTANTES.FormDia.PLAN_VIGILANCIA_AMBIENTAL; this.modificarStatusPorIndice(i, 'PlanManejoAmbiental.PlanVigilanciaAmbiental', capitulo); capitulo = CONSTANTES.CapituloFormDia[i]; break; }
        case 21: { node = CONSTANTES.FormDia.PLAN_MINIMIZACION; this.modificarStatusPorIndice(i, 'PlanMinimizacion', capitulo); capitulo = CONSTANTES.CapituloFormDia[i]; break; }
        case 22: { node = CONSTANTES.FormDia.PLAN_CONTINGENCIA; this.modificarStatusPorIndice(i, 'PlanContingencia', capitulo); capitulo = CONSTANTES.CapituloFormDia[i]; break; }
        case 23: { node = CONSTANTES.FormDia.PROTOCOLO_RELACIONAMIENTO; this.modificarStatusPorIndice(i, 'ProtocoloRelacionamiento', capitulo); capitulo = CONSTANTES.CapituloFormDia[i]; break;}
        case 24: { node = CONSTANTES.FormDia.PLAN_CIERRE; this.modificarStatusPorIndice(i, 'PlanCierre', capitulo); capitulo = CONSTANTES.CapituloFormDia[i]; break;}
        case 25: { node = CONSTANTES.FormDia.RESUMEN; this.modificarStatusPorIndice(i, 'PlanManejoAmbiental.Resumen', capitulo); capitulo = CONSTANTES.CapituloFormDia[i]; break; }
        case 26: { node = CONSTANTES.FormDia.CONSULTORA; this.modificarStatusPorIndice(i, 'Consultora', capitulo); capitulo = CONSTANTES.CapituloFormDia[i]; break; }
        case 27: { node = CONSTANTES.FormDia.SOLICITUD_TITULO; this.modificarStatusPorIndice(i, 'SolicitudTitulo', capitulo); capitulo = CONSTANTES.CapituloFormDia[i]; break; }
        default: return;
      }
      
      let respuesta = this.funcionesMtcService.validateForm(this.dataFormDia, node);
      row.observations.htmlText = respuesta.msg === '' ? '' : '<p style="text-align: justify !important;!i;!;">Datos obligatorios incompletos en la sección:</p>' + respuesta.msg;
      
      row.comment.icon = this.getObservationIcon(capitulo);      

      this.actualizarMensaje(i, respuesta.msg);

      //row.status.icon = this.getObservationSubsanada(capitulo);
       
       

      var flagFormulario = this.verificarMensajes();
      var contarMensajes = this.contarMensajes();
      const tramite = localStorage.getItem('tramite-selected');
      const tramiteObj = JSON.parse(tramite);
      tramiteObj.estadoFormulario = flagFormulario;
      tramiteObj.contarMensajes = contarMensajes;
      localStorage.setItem('tramite-selected', JSON.stringify(tramiteObj));

      const fecha = new Date(respuesta.Fecha);
      if (isNaN(fecha.getTime())) {
        row.hora.text = '';
      } else {
        const opciones: Intl.DateTimeFormatOptions = {
          weekday: 'long',
          day: '2-digit',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        };

        this.fechaHora = new Intl.DateTimeFormat('es-ES', opciones).format(fecha);
        row.hora.text = this.fechaHora;
      }
    });
  }

  actualizarMensaje(i, msg) {
    if (i !== 1 || i !== 9 || i !== 18) {
      const mensajeObj = this.mensajeFormulario.find(item => item.numero === i);
      if (mensajeObj) {
        mensajeObj.mensaje = msg;
      }
    }
  }

  verificarMensajes() {
    return this.mensajeFormulario.every(item => !item.mensaje || item.mensaje.trim() === '');
  }

  contarMensajes(): number {
    return this.mensajeFormulario.filter(item => item.mensaje.trim() !== '').length;
  }

  async getSolicitudObservation(codMaeSolicitud: string): Promise<void> {
    try {
      this.solicitudObservacion = [];
      const resp = await this.observacionService.getSolicitudObservacion(codMaeSolicitud).toPromise();
      if (resp.success) {
        this.solicitudObservacion = resp.data;         
      }
    } catch (err) {
      console.log('Error', err);
    }
  }

  getObservationIcon(capitulo: string): string {
   
    const observacion = this.solicitudObservacion.find(item => item.capitulo === capitulo);
    return observacion && observacion.comentario ? 'chat' : '';
  }
  
  getObservationSubsanada(capitulo: string): string {        
    const observacion = this.solicitudObservacion.find(item => item.capitulo === capitulo);
    if(this.estadoSolicitud=='APROBADO' && observacion){
      console.log('1:::'+capitulo,observacion);
      return 'done';
    }else if((this.estadoSolicitud === 'OBSERVADO' || 
      this.estadoSolicitud=='INFORMACION COMPLEMENTARIA') && observacion){
        console.log('2:::'+capitulo,observacion);
      return 'warning';
    }
  }
  
}
