import { Component, Inject, Input, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { FormularioDIAResponse } from 'src/app/core/models/Formularios/FormularioMain';
import { ArchivoAdjunto, FormularioSolicitudDIA, Mecanismos, ParticipacionCiudadana } from 'src/app/core/models/Tramite/FormularioSolicitudDIA';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { TramiteService } from 'src/app/core/services/tramite/tramite.service';
import { ParticipacionCiudadanaComponent } from 'src/app/modals/participacion-ciudadana/participacion-ciudadana.component';
import { IOption, TableColumn, TableRow } from 'src/app/shared/components/table/interfaces/table.interface';
import { CONSTANTES } from 'src/app/enums/constants';
import { ExternoService } from 'src/app/core/services/servicios/externo.service';
import { Observable, catchError, map, of } from 'rxjs';
import { ComboGenerico } from 'src/app/core/models/Maestros/ComboGenerico';

@Component({
  selector: 'participacion-ciudadana-dialog',
  templateUrl: './participacion-ciudadana-dialog.component.html',
})
export class ParticipacionCiudadanaDialog implements OnInit {
  form: FormGroup;
  selectedUnit: string = '';
  activeModal = inject(NgbActiveModal);
  openModal = inject(NgbModal);
  @Input() title!: string;
  participacionCiudadana: ParticipacionCiudadana;
  @Input() data: FormularioSolicitudDIA;
  @Input() codMaeSolicitud: number;
  @Input() idCliente: number;
  @Input() idEstudio: number;
  @Input() modoVisualizacion: boolean;
  @Input() codMaeRequisito: number;
  documentos: ArchivoAdjunto[] = [];
  Mecanismos: Mecanismos[] = [];
  showTipoDocumento: boolean = true;
  optsTipoDocumento: IOption[] = [];

  // -------4.PARTICIPACIÓN CIUDADANA
  tableColumns41: TableColumn[] = [];

  tableData41: TableRow[] = []
  estadoSolicitud: string;
  /****************************/


  constructor(
    private builder: FormBuilder,
    private tramiteService: TramiteService,
    private funcionesMtcService: FuncionesMtcService,
    private externoService: ExternoService
  ) { }

  ngOnInit(): void {
    this.buildForm();
    this.loadTableHeader();
    this.getData();
    //this.loadListas();
    this.habilitarControles();    
  }

  //#region ViewOnly
  get viewOnly() { return this.modoVisualizacion; }

  get viewControl() { return !this.modoVisualizacion; }

  habilitarControles() {
    if (this.viewOnly) {
      if (this.form !== undefined)
        Object.keys(this.form.controls).forEach(controlName => {
          const control = this.form.get(controlName);
          control?.disable();
        });
    } else {
      if (!this.ver()) this.viewOnly;
    }
  }
  //#endregion ViewOnly

  private buildForm(): void {
    this.form = this.builder.group({});
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
    this.Mecanismos = data.ParticipacionCiudadana?.Mecanismos || [];
    this.documentos = data.ParticipacionCiudadana?.Documentos || [];
    this.fnGridTableMecanismos(this.Mecanismos);
    
  }

  closeDialog() {
    this.activeModal.dismiss();
  }

  openModalParticipacionCiudadana(text?: string, row?: TableRow) {
    const modalOptions: NgbModalOptions = {
      size: 'xl',
      centered: true,
      ariaLabelledBy: 'modal-basic-title',
    };
    const modalRef = this.openModal.open(ParticipacionCiudadanaComponent, modalOptions);
    modalRef.componentInstance.title = text;
    modalRef.componentInstance.id = this.Mecanismos.length === 0 ? 1 : (this.Mecanismos.reduce((max, item) => item.Id > max ? item.Id : max, 0)) + 1;
    modalRef.componentInstance.edicion = row ? this.Mecanismos.find(x => x.Id === parseInt(row.Id.text)) : undefined;
    modalRef.componentInstance.codMaeSolicitud = this.codMaeSolicitud;
    modalRef.componentInstance.modoVisualizacion = this.modoVisualizacion;
    modalRef.componentInstance.idCliente = this.idCliente;
    modalRef.componentInstance.idEstudio = this.idEstudio;
    modalRef.result.then(
      (result) => {// Maneja el resultado aquí

        // this.tableData41.push(result.row);
        // this.Mecanismos.push(result.data);
        if (row) {
          this.Mecanismos = this.Mecanismos.filter(x => x.Id !== parseInt(row.Id.text));
        }
        this.Mecanismos.push(result);
        this.fnGridTableMecanismos(this.Mecanismos);
      },
      (reason) => {// Maneja la cancelación aquí
        console.log('Modal fue cerrado sin resultado:', reason);
      });
  };

  fnGridTableMecanismos(data: Mecanismos[]) {

    const tabla: TableRow[] = data?.map(datos => {
      return {
        Id: { text: datos.Id.toString() },
        Mecanismos: { text: datos.DescripcionMecanismo },
        Secuencia: { text: datos.DescripcionSecuencia },
        Descripcion: { text: datos.Descripcion },
        NroPersonas: { text: datos.NroPersonas },
        edit: { buttonIcon: 'edit', hasCursorPointer: true, onClick: (row: TableRow) => this.fnEditarMecanismo(row) },
        delete: { buttonIcon: 'remove', hasCursorPointer: true, onClick: (row: TableRow) => this.fnEliminarMecanismo(row) },
        view: { buttonIcon: 'search', hasCursorPointer: true, onClick: (row: TableRow) => this.fnEditarMecanismo(row) },
      }
    }) || [];

    this.tableData41 = tabla;
  }

  fnEditarMecanismo(row?: TableRow) {
    this.openModalParticipacionCiudadana('PARTICIPACIÓN CIUDADANA', row);
  }

  fnEliminarMecanismo(row?: TableRow) {
    this.funcionesMtcService
      .mensajeConfirmar('¿Está seguro de eliminar el registro seleccionado?')
      .then(() => {
        this.Mecanismos = this.Mecanismos.filter(x => x.Id !== parseInt(row.Id.text));
        this.fnGridTableMecanismos(this.Mecanismos);
      });
  }

  validateParticipacionCiudadana(participacion: ParticipacionCiudadana): boolean {
    // Validar que Mecanismos no esté vacío
    if (!participacion.Mecanismos || participacion.Mecanismos.length === 0) {
      return false;
    }

    // Validar que Documentos no esté vacío
    if (!participacion.Documentos || participacion.Documentos.length === 0) {
      return false;
    }

    // Validar cada mecanismo
    for (let mecanismo of participacion.Mecanismos) {
      // Validar que DescripcionMecanismo no esté vacío
      if (!mecanismo.DescripcionMecanismo.trim()) {
        return false;
      }

      // Validar que Descripcion no esté vacío
      if (!mecanismo.Descripcion.trim()) {
        return false;
      }

      // Validar que NroPersonas no esté vacío
      if (!mecanismo.NroPersonas.trim()) {
        return false;
      }

      // Validar que Lugar no esté vacío
      if (!mecanismo.Lugar || mecanismo.Lugar.length === 0) {
        return false;
      }

      // Validar que Participantes no esté vacío
      if (!mecanismo.Participantes || mecanismo.Participantes.length === 0) {
        return false;
      }

      // Validar que Fechas no esté vacío
      if (!mecanismo.Fechas || mecanismo.Fechas.length === 0) {
        return false;
      }

      // Validar que Documentacion no esté vacío
      if (!mecanismo.Documentacion || mecanismo.Documentacion.length === 0) {
        return false;
      }
    }

    return true;
  }

  validarFormularioSolicitudDIA(formulario: FormularioSolicitudDIA): number {
    if (!this.data.ParticipacionCiudadana.Save) return 0;
    if (!this.validateParticipacionCiudadana(formulario.ParticipacionCiudadana)) return 1;
    return 2;
  }


  save(form: FormGroup) {
    // this.participacionCiudadana.Documentos = this.documentos;
    // this.participacionCiudadana.Mecanismos = this.Mecanismos;
    // this.activeModal.close(this.participacionCiudadana);
    const objeto: ParticipacionCiudadana = {
      Mecanismos: this.Mecanismos,
      Documentos: this.documentos,
      Save: true,
      FechaRegistro: this.funcionesMtcService.dateNow(),
      State: 0
    }
    this.data.ParticipacionCiudadana = objeto;
    this.data.ParticipacionCiudadana.State = this.validarFormularioSolicitudDIA(this.data);
    this.GuardarJson(this.data);
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

  agregarDocumento(item: ArchivoAdjunto) {//AttachButtonComponent - Documentos Adjuntos
    this.documentos.push(item);
  }

  actualizarDocumentos(documentos: ArchivoAdjunto[]) {
    this.documentos = documentos;
  }

  private loadListas() {

    this.comboGenerico(CONSTANTES.ComboGenericoEIAW.TipoDocumento).subscribe(response => {
      const options = response.map(({ codigo, descripcion }) => ({
        value: codigo.toString(),
        label: descripcion
      }));
      this.optsTipoDocumento.push(...options);
    });

  }
  private comboGenerico(tipo: string): Observable<ComboGenerico[]> {
    this.funcionesMtcService.mostrarCargando();
    return this.externoService.getComboGenericoEiaw(tipo).pipe(
      map(response => {
        this.funcionesMtcService.ocultarCargando();
        return response.success ? response.data : [];
      }),
      catchError(error => {
        this.funcionesMtcService.ocultarCargando();
        console.error('Error en la solicitud:', error);
        return of([]);
      })
    );
  }

  ver() {
    if (this.estadoSolicitud !== 'EN PROCESO') {
      return true;
    }
    return false;
  }

  private loadTableHeader() {
    this.tableColumns41 = [
      { header: 'MECANISMO', field: 'Mecanismos', },
      { header: 'SECUENCIA / FASE', field: 'Secuencia', },
      { header: 'DESCRIPCIÓN DEL MECANISMO', field: 'Descripcion', },
      { header: 'No PARTICIPANTES', field: 'NroPersonas', },
      { header: 'EDITAR', field: 'edit', hidden: this.modoVisualizacion },
      { header: 'ELIMINAR', field: 'delete', hidden: this.modoVisualizacion },
      { header: 'VER', field: 'view', hidden: !this.modoVisualizacion },
    ];
  }
}
