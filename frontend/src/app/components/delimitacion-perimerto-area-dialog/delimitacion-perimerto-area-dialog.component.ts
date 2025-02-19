import { Component, Inject, Input, NgModule, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { catchError, map, Observable, of } from 'rxjs';
import { FormularioDIAResponse } from 'src/app/core/models/Formularios/FormularioMain';
import { ComboGenerico } from 'src/app/core/models/Maestros/ComboGenerico';
import { ArchivoAdjunto, AreaActividadMinera, Delimitacion, FormularioSolicitudDIA } from 'src/app/core/models/Tramite/FormularioSolicitudDIA';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { ExternoService } from 'src/app/core/services/servicios/externo.service';
import { TramiteService } from 'src/app/core/services/tramite/tramite.service';
import { CONSTANTES } from 'src/app/enums/constants';
import { AreaSuperficialActivityComponent } from 'src/app/modals/area-superficial-activity/area-superficial-activity.component';
import { IOption, TableColumn, TableRow } from 'src/app/shared/components/table/interfaces/table.interface';
import { MapDialogComponent } from '../map-dialog/map-dialog.component';

@Component({
  selector: 'delimitacion-perimerto-area-dialog',
  templateUrl: './delimitacion-perimerto-area-dialog.component.html',

})
export class DelimitacionPerimertoAreaDialogComponent implements OnInit {
  form: FormGroup;
  selectedUnit: string = '';
  activeModal = inject(NgbActiveModal);
  private modalService = inject(NgbModal);
  @Input() title!: string;
  @Input() codMaeSolicitud: number;
  @Input() idCliente: number;
  @Input() idEstudio: number;
  @Input() modoVisualizacion: boolean;
  @Input() codMaeRequisito: number;

  data: FormularioSolicitudDIA;
  documentos: ArchivoAdjunto[] = [];
  listaZona: ComboGenerico[] = [];
  listaDatum: ComboGenerico[] = [];
  optsZona: IOption[] = [];
  optsDatum: IOption[] = [];
  delimitacion: Delimitacion;
  optsTipoDocumento: IOption[] = [];
  showTipoDocumento: boolean = true;
  estadoSolicitud: string;

  areasSuperficialesEnActividadesMineras: AreaActividadMinera[];
  areasSuperficialesEnUsoMinero: AreaActividadMinera[];
  tableData242: TableRow[] = [];
  tableData2191: TableRow[] = [];
  dataActividadMinera: TableRow[] = [];
  dataUsoMinero: TableRow[] = [];
  tableColumns242: TableColumn[] = [];
  headerActividadMinera: TableColumn[] = [];
  headerUsoMinero: TableColumn[] = [];


  constructor(
    private builder: FormBuilder,
    private tramiteService: TramiteService,
    private funcionesMtcService: FuncionesMtcService,
    private externoService: ExternoService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      rows: this.fb.array([])
    });
  }

  loadTableHeaders(){
    this.tableColumns242 = [
      { header: 'COORDENADA ESTE', field: 'coodernadaE', required: true, },
      { header: 'COORDENADA NORTE', field: 'coordenadaN', required: true, },
      { header: 'ZONA', field: 'zona', required: true, },
      { header: 'DATUM', field: 'datum', required: true, },
    ];
    
    this.headerActividadMinera = [
      { header: 'NRO', field: 'Id', hidden: true },
      { header: 'ZONA', field: 'Zona', },
      { header: 'DATUM', field: 'Datum', },
      { header: 'IDACTIVIDAD', field: 'IdActividad', hidden: true },
      { header: 'ACTIVIDAD', field: 'Actividad', },
      { header: 'DESCRIPCIÓN', field: 'Descripcion', },
      { header: 'VALIDACIÓN', field: 'Validacion', },
      { header: 'EDITAR', field: 'edit', hidden: this.modoVisualizacion},
      { header: 'ELIMINAR', field: 'delete', hidden: this.modoVisualizacion},
      { header: 'VER', field: 'view', hidden: !this.modoVisualizacion },
    ];
    
    this.headerUsoMinero = [
      { header: 'NRO', field: 'Id', hidden: true },
      { header: 'ZONA', field: 'Zona', },
      { header: 'DATUM', field: 'Datum', },
      { header: 'IDACTIVIDAD', field: 'IdActividad', hidden: true },
      { header: 'ACTIVIDAD', field: 'Actividad', },
      { header: 'DESCRIPCIÓN', field: 'Descripcion', },
      { header: 'VALIDACIÓN', field: 'Validacion', },
      { header: 'EDITAR', field: 'edit', hidden: this.modoVisualizacion},
      { header: 'ELIMINAR', field: 'delete', hidden: this.modoVisualizacion},
      { header: 'VER', field: 'view', hidden: !this.modoVisualizacion },
    ];
  }

  //#region ViewOnly
  get viewOnly() { return this.modoVisualizacion; }

  get viewControl() { return !this.modoVisualizacion; }

  habilitarControles() {
    if (this.viewOnly) {
      if(this.form !== undefined)
        Object.keys(this.form.controls).forEach(controlName => {
          const control = this.form.get(controlName);
          control?.disable();
        });
    }else{
      if(!this.ver()) this.viewOnly;
    }
  }
  //#endregion ViewOnly

  async ngOnInit(): Promise<void> {
    this.buildForm();
    this.loadTableHeaders();
    await this.loadCombos();
    this.getData();
    this.gridTableCoordenadas();
    this.habilitarControles();
  }

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

  private patchFormValues(data: FormularioSolicitudDIA) {    
    this.documentos = data?.DescripcionProyecto?.Delimitacion?.Documentos || [];
    this.areasSuperficialesEnActividadesMineras = data?.DescripcionProyecto?.Delimitacion?.AreasActividadMinera;
    this.areasSuperficialesEnUsoMinero = data?.DescripcionProyecto?.Delimitacion?.AreasUsoMinero;
    this.gridTableCoordenadas(data.DescripcionProyecto.Delimitacion);
    this.fnGridTableAreasSuperficialesActividadMinera(data?.DescripcionProyecto?.Delimitacion?.AreasActividadMinera);
    this.fnGridTableAreasUsoMinero(data?.DescripcionProyecto?.Delimitacion?.AreasUsoMinero);
  }

  closeDialog() {
    this.activeModal.dismiss();
  }

  //#region Modal Areas Superficiales de Actividades Mineras
  openModal(text: string, row?: TableRow, tipo?:number, esEdicion?:boolean) {
    const modalOptions: NgbModalOptions = {
      size: 'xl',
      centered: true,
      ariaLabelledBy: 'modal-basic-title',
    };
    const modalRef = this.modalService.open(MapDialogComponent, modalOptions);
    modalRef.componentInstance.title = text;
    modalRef.componentInstance.tipo = tipo;    
    modalRef.componentInstance.modoVisualizacion = this.modoVisualizacion;
    modalRef.componentInstance.idCliente = this.idCliente;
    modalRef.componentInstance.idEstudio = this.idEstudio;
    modalRef.componentInstance.codMaeRequisito = this.codMaeRequisito;
    modalRef.componentInstance.id = this.fnObtenerId(tipo, esEdicion, esEdicion ? parseInt(row.Id.text): 0);
    modalRef.componentInstance.edicion = row ? this.fnObtenerRegistro(row, tipo) : undefined;
    modalRef.result.then(
      (result) => { this.getData(); },
      (reason) => { console.log('Modal fue cerrado sin resultado:', reason); });
  }

  fnObtenerId(tipo:number, esEdicion:boolean, id?:number){
    if(esEdicion) return id;

    if(tipo === 1)
      return this.areasSuperficialesEnActividadesMineras.length === 0 ? 1 : (this.areasSuperficialesEnActividadesMineras.reduce((max, item) => item.Id > max ? item.Id : max, 0)) + 1;    
    else if(tipo === 2)
      return this.areasSuperficialesEnUsoMinero.length === 0 ? 1 : (this.areasSuperficialesEnUsoMinero.reduce((max, item) => item.Id > max ? item.Id : max, 0)) + 1;
  }

  fnObtenerRegistro(row:TableRow, tipo:number){
    if(tipo === 1)
      return this.areasSuperficialesEnActividadesMineras.find(x => x.Id === parseInt(row.Id.text));    
    else if(tipo === 2)
      return this.areasSuperficialesEnUsoMinero.find(x => x.Id === parseInt(row.Id.text));    
  }

  fnGridTableAreasSuperficialesActividadMinera(data: AreaActividadMinera[]) {
    const tabla: TableRow[] = data?.map(datos => {
      return {
        Id: { text: datos.Id.toString() },
        Zona: { text: datos.Zona },
        Datum: { text: datos.Datum },
        IdActividad: { text: datos.IdActividad.toString() },
        Actividad: { text: datos.Actividad },
        Descripcion: { text: datos.Descripcion },
        Validacion: { htmlText: `<b>${datos.Validacion}</b>`},
        edit: { buttonIcon: 'edit', hasCursorPointer: true, onClick: (row: TableRow) => this.fnEditarActividadesMineras(row) },
        delete: { buttonIcon: 'remove', hasCursorPointer: true, onClick: (row: TableRow) => this.fnEliminarActividadesMineras(row) }
      }
    }) || [];
    this.dataActividadMinera = tabla;
  }

  fnEditarActividadesMineras(row?: TableRow) {
    this.openModal('ÁREAS SUPERFICIALES EN ACTIVIDAD MINERA', row, 1, true);
  }

  fnEliminarActividadesMineras(row?: TableRow) {
    this.funcionesMtcService
      .mensajeConfirmar('¿Está seguro de eliminar el registro seleccionado?')
      .then(() => {
        this.areasSuperficialesEnActividadesMineras = this.areasSuperficialesEnActividadesMineras.filter(x => x.Id !== parseInt(row.Id.text));
        this.fnGridTableAreasSuperficialesActividadMinera(this.areasSuperficialesEnActividadesMineras);
        this.data.DescripcionProyecto.Delimitacion.AreasActividadMinera = this.areasSuperficialesEnActividadesMineras;
        this.GuardarJson(this.data, 'Se eliminó el registro seleccionado.');
      });
  }

  fnGridTableAreasUsoMinero(data: AreaActividadMinera[]) {
    const tabla: TableRow[] = data?.map(datos => {
      return {
        Id: { text: datos.Id.toString() },
        Zona: { text: datos.Zona },
        Datum: { text: datos.Datum },
        IdActividad: { text: datos.IdActividad.toString() },
        Actividad: { text: datos.Actividad },
        Descripcion: { text: datos.Descripcion },
        Validacion: { text: datos.Validacion },
        edit: { buttonIcon: 'edit', hasCursorPointer: true, onClick: (row: TableRow) => this.fnEditarUsoMinero(row) },
        delete: { buttonIcon: 'remove', hasCursorPointer: true, onClick: (row: TableRow) => this.fnEliminarUsoMinero(row) }
      }
    }) || [];
    this.dataUsoMinero = tabla;
  }

  fnEditarUsoMinero(row?: TableRow) {
    this.openModal('ÁREAS SUPERFICIALES EN USO MINERO', row, 2, true);
  }

  fnEliminarUsoMinero(row?: TableRow) {
    this.funcionesMtcService
      .mensajeConfirmar('¿Está seguro de eliminar el registro seleccionado?')
      .then(() => {
        this.areasSuperficialesEnUsoMinero = this.areasSuperficialesEnUsoMinero.filter(x => x.Id !== parseInt(row.Id.text));
        this.fnGridTableAreasUsoMinero(this.areasSuperficialesEnUsoMinero);
        this.data.DescripcionProyecto.Delimitacion.AreasUsoMinero = this.areasSuperficialesEnUsoMinero;
        this.GuardarJson(this.data, 'Se eliminó el registro seleccionado.');
      });
  }
  //#endregion

  agregarDocumento(item: ArchivoAdjunto) {//AttachButtonComponent - Documentos Adjuntos
    this.documentos.push(item);
  }

  actualizarDocumentos(documentos: ArchivoAdjunto[]) {
    this.documentos = documentos;
  }  

  validarDelimitacion(delimitacion: Delimitacion): boolean {
    // Validar listas
    if (!delimitacion.AreasActividadMinera || delimitacion.AreasActividadMinera.length === 0) {
      console.error("La lista AreasActividadMinera está vacía.");
      return false;
    }
    if (!delimitacion.AreasUsoMinero || delimitacion.AreasUsoMinero.length === 0) {
      console.error("La lista AreasUsoMinero está vacía.");
      return false;
    }
    if (!delimitacion.Documentos || delimitacion.Documentos.length === 0) {
      console.error("La lista Documentos está vacía.");
      return false;
    }
  
    // Validar campos de texto
    if (!delimitacion.CoordenadaPuntoEste || delimitacion.CoordenadaPuntoEste.trim() === "") {
      console.error("El campo CoordenadaPuntoEste está vacío.");
      return false;
    }
    if (!delimitacion.CoordenadaPuntoNorte || delimitacion.CoordenadaPuntoNorte.trim() === "") {
      console.error("El campo CoordenadaPuntoNorte está vacío.");
      return false;
    }
    if (!delimitacion.Zona || delimitacion.Zona.trim() === "") {
      console.error("El campo Zona está vacío.");
      return false;
    }
    if (!delimitacion.Datum || delimitacion.Datum.trim() === "") {
      console.error("El campo Datum está vacío.");
      return false;
    }
  
    return true;
  }

  validarFormularioSolicitudDIA(formulario: FormularioSolicitudDIA): number {
    if(!this.data.DescripcionProyecto.Delimitacion.Save) return 0;
    if (!this.validarDelimitacion(formulario.DescripcionProyecto.Delimitacion)) return 1;
    return 2;
  }

  save(form: FormGroup) {

    if (this.form.valid) {
/*
      if (this.validarCordenadaEste(this.tableData242[0]['coodernadaE']?.value)) {
        this.funcionesMtcService.mensajeError('Las coordenadas Este ingresadas deben encontrarse en las AREAS SUPERFICIALES EN ACTIVIDAD MINERA');
        return;
      }

      if (this.validarCordenadaNorte(this.tableData242[0]['coordenadaN']?.value)) {
        this.funcionesMtcService.mensajeError('Las coordenadas Norte ingresadas deben encontrarse en las AREAS SUPERFICIALES EN ACTIVIDAD MINERA');
        return;
      }
*/
      const datos: Delimitacion = {
        AreasActividadMinera: [],
        AreasUsoMinero: [],
        CoordenadaPuntoEste: this.tableData242[0]['coodernadaE']?.value,
        CoordenadaPuntoNorte: this.tableData242[0]['coordenadaN']?.value,
        Zona: this.tableData242[0]['zona']?.value,
        Datum: this.tableData242[0]['datum']?.value,
        Documentos: this.documentos,
        Save: true,
        State: 0,
        FechaRegistro: this.funcionesMtcService.dateNow()
      }
      

      this.data.DescripcionProyecto.Delimitacion = datos;
      this.data.DescripcionProyecto.Delimitacion.State = this.validarFormularioSolicitudDIA(this.data);
      //this.data.DescripcionProyecto.Delimitacion.Documentos = this.documentos;
      //this.data.DescripcionProyecto.Delimitacion.Documentos = this.documentos;
      this.GuardarJson(this.data);

    }


  }

  private GuardarJson(data: FormularioSolicitudDIA, mensaje?: string) {
    const objeto: FormularioDIAResponse = {
      codMaeSolicitud: this.codMaeSolicitud,
      codMaeRequisito: this.codMaeRequisito,
      dataJson: JSON.stringify(data)
    };

    this.tramiteService.postGuardarFormulario(objeto).subscribe(resp => {
      this.funcionesMtcService.ocultarCargando();
      if (resp.success)
        this.funcionesMtcService.ocultarCargando().mensajeOk(mensaje || 'Se grabó el formulario').then(() => {if(!mensaje)this.closeDialog()});
      else
        this.funcionesMtcService.ocultarCargando().mensajeError('No se grabó el formulario');
    });
  }

  private async loadCombos(): Promise<void> {
    (await this.comboGenerico(CONSTANTES.ComboGenericoDIAW.Zona)).subscribe(response => {
      const options = response.map(({ codigo, descripcion }) => ({
        value: codigo.toString(),
        label: descripcion
      }));
      this.optsZona.push(...options);
    });

    (await this.comboGenerico(CONSTANTES.ComboGenericoDIAW.Datum)).subscribe(response => {
      const options = response.map(({ codigo, descripcion }) => ({
        value: codigo.toString(),
        label: descripcion
      }));
      this.optsDatum.push(...options);
    });

    this.comboGenericoEiaw(CONSTANTES.ComboGenericoEIAW.TipoDocumento).subscribe(response => {
      const options = response.map(({ codigo, descripcion }) => ({
        value: codigo.toString(),
        label: descripcion
      }));
      this.optsTipoDocumento.push(...options);
    });

  }

  private async comboGenerico(tipo: string): Promise<Observable<ComboGenerico[]>> {
    this.funcionesMtcService.mostrarCargando();
    return await this.externoService.getComboGenericoDiaw(tipo).pipe(
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

  private gridTableCoordenadas(data?: Delimitacion) {
    this.tableData242 = [
      {
        coodernadaE: { hasInput: true, inputPlaceholder: 'Ingrese...', value: data?.CoordenadaPuntoEste || '' },
        coordenadaN: { hasInput: true, inputPlaceholder: 'Ingrese...', value: data?.CoordenadaPuntoNorte || '' },
        zona: { hasSelect: true, select: { options: this.optsZona }, selectedValue: data?.Zona || '0' },
        datum: { hasSelect: true, select: { options: this.optsDatum }, selectedValue: '2' },
      },
    ]
  }

  private comboGenericoEiaw(tipo: string): Observable<ComboGenerico[]> {
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


  validarCordenadaEste(valor: string) {
    var esteMinMax = this.obtenerMenorMayorEste();

    var este = esteMinMax.split('_');

    const minValue = parseInt(este[0]);
    const maxValue = parseInt(este[1]);
    const inputValue = parseInt(valor, 10);

    if (!(inputValue >= minValue && inputValue <= maxValue)) {
      return true;
    } else {
      return false;
    }
  }

  validarCordenadaNorte(valor: string) {
    var norteMinMax = this.obtenerMenorMayorNorte();

    var norte = norteMinMax.split('_');

    const minValue = parseInt(norte[0]);
    const maxValue = parseInt(norte[1]);
    const inputValue = parseInt(valor, 10);

    if (!(inputValue >= minValue && inputValue <= maxValue)) {
      return true;
    } else {
      return false;
    }

  }

  obtenerMenorMayorEste() {
    const estValues = this.tableData2191.map(item => parseInt(item.est.text, 10));
    const menor = Math.min(...estValues);
    const mayor = Math.max(...estValues);
    return menor + '_' + mayor;
  }

  obtenerMenorMayorNorte() {
    const estValues = this.tableData2191.map(item => parseInt(item.nor.text, 10));
    const menor = Math.min(...estValues);
    const mayor = Math.max(...estValues);
    return menor + '_' + mayor;
  }


}
