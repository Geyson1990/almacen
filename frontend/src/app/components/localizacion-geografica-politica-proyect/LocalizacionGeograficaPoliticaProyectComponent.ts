import { Component, Inject, Input, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { catchError, map, Observable, of } from 'rxjs';
import { UbicacionGeograficaResponse } from 'src/app/core/models/Externos/ubicacion-geografica';
import { FormularioDIAResponse } from 'src/app/core/models/Formularios/FormularioMain';
import { ComboGenerico } from 'src/app/core/models/Maestros/ComboGenerico';
import { ArchivoAdjunto, DistanciaPobladosCercanos, FormularioSolicitudDIA, LocalizacionGeografica } from 'src/app/core/models/Tramite/FormularioSolicitudDIA';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { ExternoService } from 'src/app/core/services/servicios/externo.service';
import { TramiteService } from 'src/app/core/services/tramite/tramite.service';
import { CONSTANTES } from 'src/app/enums/constants';
import { DistanciaPobladosCercanosComponent } from 'src/app/modals/distancia-poblados-cercanos/distancia-poblados-cercanos.component';
import { IOption, TableColumn, TableRow } from 'src/app/shared/components/table/interfaces/table.interface';

@Component({
  selector: 'localizacion-geografica-politica-proyect-dialog',
  templateUrl: './localizacion-geografica-politica-proyect.component.html',

})
export class LocalizacionGeograficaPoliticaProyectComponent implements OnInit {
  form: FormGroup;
  openModal = inject(NgbModal);
  activeModal = inject(NgbActiveModal);

  selectedUnit: string = '';
  @Input() title!: string;
  @Input() codMaeSolicitud: number;
  @Input() idCliente: number;
  @Input() idEstudio: number;
  @Input() modoVisualizacion: boolean;
  @Input() codMaeRequisito: number;

  data: FormularioSolicitudDIA;
  distanciaPobladosCercanos: DistanciaPobladosCercanos[] = [];
  localizacionSuperpuesta: ArchivoAdjunto[];
  optsTipoDocumento: IOption[] = [];
  showTipoDocumento: boolean = true;

  ubicacionGeografica: UbicacionGeograficaResponse = {
    departamento: '',
    distrito: '',
    idDepartamento: '',
    idDistrito: '',
    idProvincia: '',
    porcentaje: 0,
    provincia: ''
  };

  tableColumns231: TableColumn[];
  tableColumns233: TableColumn[];
  tableData231: TableRow[] = [];
  tableData233: TableRow[] = [];
  estadoSolicitud: string;

  constructor(
    private builder: FormBuilder,
    private tramiteService: TramiteService,
    private funcionesMtcService: FuncionesMtcService,
    private externoService: ExternoService
  ) { }

  private loadTableHeaders() {
    this.tableColumns231 = [
      { header: 'REGION', field: 'region', },
      { header: 'PROVINCIA', field: 'provincia', },
      { header: 'DISTRITO', field: 'distrito', },
    ];

    this.tableColumns233 = [
      { header: 'ID', field: 'Id', hidden: true },
      { header: 'NOMBRE (*)', field: 'Nombre', },
      { header: 'DISTANCIA AREA DE PROYECTO (KM) (*)', field: 'Distancia', },
      { header: 'VIAS DE ACCESO (*)', field: 'Vias', },
      { header: 'EDITAR', field: 'edit', hidden: this.modoVisualizacion },
      { header: 'ELIMINAR', field: 'delete', hidden: this.modoVisualizacion },
      { header: 'VER', field: 'view', hidden: !this.modoVisualizacion },
    ];
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

  ngOnInit(): void {
    this.buildForm();
    this.loadTableHeaders();
    this.getData();
    this.habilitarControles();
  }

  private buildForm(): void {
    this.form = this.builder.group({});
  }

  closeDialog() {
    this.activeModal.dismiss();
  }

  validarLocalizacionGeografica(localizacion: LocalizacionGeografica): boolean {

    // Validar campos de texto
    if (!localizacion.Localizacion || localizacion.Localizacion.trim() === "") {
      console.error("El campo Localizacion está vacío.");
      return false;
    }

    // Validar objeto anidado UbicacionGeografica
    if (!localizacion.UbicacionGeografica) {
      console.error("El campo UbicacionGeografica está vacío.");
      return false;
    }
    // Puedes agregar una función específica para validar UbicacionGeografica si tiene más campos.

    // Validar listas
    if (!localizacion.LocalizacionSuperpuesta || localizacion.LocalizacionSuperpuesta.length === 0) {
      console.error("La lista LocalizacionSuperpuesta está vacía.");
      return false;
    }
    if (!localizacion.DistanciaPobladosCercanos || localizacion.DistanciaPobladosCercanos.length === 0) {
      console.error("La lista DistanciaPoblados Cercanos está vacía.");
      return false;
    }



    return true;
  }


  validarFormularioSolicitudDIA(formulario: FormularioSolicitudDIA): number {
    if (!this.data.DescripcionProyecto.LocalizacionGeografica.Save) return 0;
    if (!this.validarLocalizacionGeografica(formulario.DescripcionProyecto.LocalizacionGeografica)) return 1;
    return 2;
  }

  save(form: FormGroup) {
    this.data.DescripcionProyecto.LocalizacionGeografica.Localizacion = '';
    this.data.DescripcionProyecto.LocalizacionGeografica.LocalizacionSuperpuesta = this.localizacionSuperpuesta;
    this.data.DescripcionProyecto.LocalizacionGeografica.DistanciaPobladosCercanos = this.distanciaPobladosCercanos;
    this.data.DescripcionProyecto.LocalizacionGeografica.Save = true;
    this.data.DescripcionProyecto.LocalizacionGeografica.FechaRegistro = this.funcionesMtcService.dateNow();
    this.data.DescripcionProyecto.LocalizacionGeografica.State = this.validarFormularioSolicitudDIA(this.data);
    // this.activeModal.close(this.data);
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

  private getData(): void {
    this.funcionesMtcService.mostrarCargando();
    const codigoSolicitud = this.codMaeSolicitud;

    this.tramiteService.getFormularioDia(codigoSolicitud).subscribe(resp => {
      this.funcionesMtcService.ocultarCargando();
      if (resp.success) {
        this.data = JSON.parse(resp.data.dataJson);
        this.patchFormValues();
      }
    });

    this.externoService.getUbicacionGeografica(this.idEstudio).subscribe(resp => {
      if (resp.success) {
        this.ubicacionGeografica = resp.data;
      }
      this.fnGridTableUbicacionGeografica(this.ubicacionGeografica);
    });

    this.comboGenerico(CONSTANTES.ComboGenericoEIAW.TipoDocumento).subscribe(response => {
      const options = response.map(({ codigo, descripcion }) => ({
        value: codigo.toString(),
        label: descripcion
      }));
      this.optsTipoDocumento.push(...options);
    });

    const tramite = localStorage.getItem('tramite-selected');
    const tramiteObj = JSON.parse(tramite);
    this.estadoSolicitud = tramiteObj.estadoSolicitud;
  }

  private fnGridTableUbicacionGeografica(data: UbicacionGeograficaResponse) {
    this.tableData231.push({
      region: { text: data.departamento },
      provincia: { text: data.provincia },
      distrito: { text: data.distrito },
    });
  }

  private patchFormValues(): void {
    this.distanciaPobladosCercanos = this.data.DescripcionProyecto?.LocalizacionGeografica?.DistanciaPobladosCercanos || [];
    this.localizacionSuperpuesta = this.data.DescripcionProyecto?.LocalizacionGeografica?.LocalizacionSuperpuesta || [];

    this.fnGridTablePobladosCercanos(this.distanciaPobladosCercanos);
  }

  openModalDistancia(text?: string, row?: TableRow) {
    const modalOptions: NgbModalOptions = {
      size: 'md',
      centered: true,
      ariaLabelledBy: 'modal-basic-title',
    };
    const modalRef = this.openModal.open(DistanciaPobladosCercanosComponent, modalOptions);
    modalRef.componentInstance.title = text;
    modalRef.componentInstance.modoVisualizacion = this.modoVisualizacion;
    modalRef.componentInstance.id = this.distanciaPobladosCercanos.length === 0 ? 1 : (this.distanciaPobladosCercanos.reduce((max, item) => item.Id > max ? item.Id : max, 0)) + 1;
    modalRef.componentInstance.edicion = row ? this.distanciaPobladosCercanos.find(x => x.Id === parseInt(row.Id.text)) : undefined;
    modalRef.result.then(
      (result) => {// Maneja el resultado aquí
        if (row) {
          this.distanciaPobladosCercanos = this.distanciaPobladosCercanos.filter(x => x.Id !== parseInt(row.Id.text));
        }
        this.distanciaPobladosCercanos.push(result);
        this.fnGridTablePobladosCercanos(this.distanciaPobladosCercanos);
      },
      (reason) => {// Maneja la cancelación aquí
        console.log('Modal fue cerrado sin resultado:', reason);
      });
  };

  fnGridTablePobladosCercanos(data: DistanciaPobladosCercanos[]) {

    const tabla: TableRow[] = data.map(datos => {
      return {
        Id: { text: datos.Id.toString() },
        Nombre: { text: datos.Nombre },
        Distancia: { text: datos.Distancia },
        Vias: { text: datos.Vias },
        edit: { buttonIcon: 'edit', hasCursorPointer: true, onClick: (row: TableRow) => this.fnEditarPobladosCercanos(row) },
        delete: { buttonIcon: 'remove', hasCursorPointer: true, onClick: (row: TableRow) => this.fnEliminarPobladosCercanos(row) },
        view: { buttonIcon: 'search', hasCursorPointer: true, onClick: (row: TableRow) => this.fnEditarPobladosCercanos(row) },
      }
    });

    this.tableData233 = tabla;
  }

  fnEditarPobladosCercanos(row?: TableRow) {
    this.openModalDistancia('DISTANCIA DE POBLADOS CERCANOS', row);
  }

  fnEliminarPobladosCercanos(row?: TableRow) {
    this.funcionesMtcService
      .mensajeConfirmar('¿Está seguro de eliminar el registro seleccionado?')
      .then(() => {
        this.distanciaPobladosCercanos = this.distanciaPobladosCercanos.filter(x => x.Id !== parseInt(row.Id.text));
        this.fnGridTablePobladosCercanos(this.distanciaPobladosCercanos);
      });
  }

  agregarDocumento(documento: ArchivoAdjunto) {
    this.localizacionSuperpuesta.push(documento);
  }

  actualizarDocumentos(documentos: ArchivoAdjunto[]) {
    this.localizacionSuperpuesta = documentos;
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
}
