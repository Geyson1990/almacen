import { Component, Inject, Input, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { catchError, map, Observable, of } from 'rxjs';
import { FormularioDIAResponse } from 'src/app/core/models/Formularios/FormularioMain';
import { ComboGenerico } from 'src/app/core/models/Maestros/ComboGenerico';
import { ArchivoAdjunto, AreaActividadMinera, AreasInfluencia, FormularioSolicitudDIA } from 'src/app/core/models/Tramite/FormularioSolicitudDIA';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { ExternoService } from 'src/app/core/services/servicios/externo.service';
import { TramiteService } from 'src/app/core/services/tramite/tramite.service';
import { CONSTANTES } from 'src/app/enums/constants';
import { AreaSuperficialActivityComponent } from 'src/app/modals/area-superficial-activity/area-superficial-activity.component';
import { ConfirmationDialogComponent } from 'src/app/modals/confirmation-dialog/confirmation-dialog.component';
import { IOption, TableColumn, TableRow } from 'src/app/shared/components/table/interfaces/table.interface';
import { MapDialogComponent } from '../map-dialog/map-dialog.component';


@Component({
  selector: 'area-influencia-dialog',
  templateUrl: './area-influencia-dialog.component.html',
  styleUrl: './area-influencia-dialog.component.scss',
})
export class AreaInfluenciaDialogComponent implements OnInit {
  form: FormGroup;
  activeModal = inject(NgbActiveModal);
  modalService = inject(NgbModal);
  @Input() title!: string;
  @Input() modoVisualizacion: boolean;
  @Input() codMaeSolicitud: number;
  @Input() idCliente: number;
  @Input() idEstudio: number;
  @Input() codMaeRequisito: number;

  data: FormularioSolicitudDIA;
  documentos: ArchivoAdjunto[] = [];

  optsTipoDocumento: IOption[] = [];
  showTipoDocumento: boolean = true;

  areaDirectaAmbiental: AreaActividadMinera[];
  areaIndirectaAmbiental: AreaActividadMinera[];
  areaDirectaSocial: AreaActividadMinera[];
  areaIndirectaSocial: AreaActividadMinera[];

  headerDirectaAmbiental: TableColumn[] = [
    { header: 'NRO', field: 'Id', hidden: true },
    { header: 'ZONA', field: 'Zona', },
    { header: 'DATUM', field: 'Datum', },
    { header: 'IDACTIVIDAD', field: 'IdActividad', hidden: true },
    { header: 'ACTIVIDAD', field: 'Actividad', },
    { header: 'DESCRIPCIÓN', field: 'Descripcion', },
    { header: 'VALIDACIÓN', field: 'Validacion', },
    { header: 'EDITAR', field: 'edit', },
    { header: 'ELIMINAR', field: 'delete', },
  ];

  dataDirectaAmbiental: TableRow[] = [];

  headerIndirectaAmbiental: TableColumn[] = [
    { header: 'NRO', field: 'Id', hidden: true },
    { header: 'ZONA', field: 'Zona', },
    { header: 'DATUM', field: 'Datum', },
    { header: 'IDACTIVIDAD', field: 'IdActividad', hidden: true },
    { header: 'ACTIVIDAD', field: 'Actividad', },
    { header: 'DESCRIPCIÓN', field: 'Descripcion', },
    { header: 'VALIDACIÓN', field: 'Validacion', },
    { header: 'EDITAR', field: 'edit', },
    { header: 'ELIMINAR', field: 'delete', },
  ];

  dataIndirectaAmbiental: TableRow[] = [];

  headerDirectaSocial: TableColumn[] = [
    { header: 'NRO', field: 'Id', hidden: true },
    { header: 'ZONA', field: 'Zona', },
    { header: 'DATUM', field: 'Datum', },
    { header: 'IDACTIVIDAD', field: 'IdActividad', hidden: true },
    { header: 'ACTIVIDAD', field: 'Actividad', },
    { header: 'DESCRIPCIÓN', field: 'Descripcion', },
    { header: 'VALIDACIÓN', field: 'Validacion', },
    { header: 'EDITAR', field: 'edit', },
    { header: 'ELIMINAR', field: 'delete', },
  ];

  dataDirectaSocial: TableRow[] = [];

  headerIndirectaSocial: TableColumn[] = [
    { header: 'NRO', field: 'Id', hidden: true },
    { header: 'ZONA', field: 'Zona', },
    { header: 'DATUM', field: 'Datum', },
    { header: 'IDACTIVIDAD', field: 'IdActividad', hidden: true },
    { header: 'ACTIVIDAD', field: 'Actividad', },
    { header: 'DESCRIPCIÓN', field: 'Descripcion', },
    { header: 'VALIDACIÓN', field: 'Validacion', },
    { header: 'EDITAR', field: 'edit', },
    { header: 'ELIMINAR', field: 'delete', },
  ];

  dataIndirectaSocial: TableRow[] = [];

  estadoSolicitud: string;
  
  constructor(
    private builder: FormBuilder,
    private tramiteService: TramiteService,
    private funcionesMtcService: FuncionesMtcService,
    private externoService: ExternoService
  ) { }

  ngOnInit(): void {
    this.buildForm();
    this.getData();
    this.loadCombos();
  }

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

  private loadCombos(){
    this.comboGenericoEiaw(CONSTANTES.ComboGenericoEIAW.TipoDocumento).subscribe(response => {
      const options = response.map(({ codigo, descripcion }) => ({
        value: codigo.toString(),
        label: descripcion
      }));
      this.optsTipoDocumento.push(...options);
    });
  }

  private patchFormValues(data: FormularioSolicitudDIA) {
    this.documentos = data?.DescripcionProyecto?.AreasInfluencia?.Documentos || [];
    this.areaDirectaAmbiental = data?.DescripcionProyecto?.AreasInfluencia?.AreaDirectaAmbiental || [];
    this.areaIndirectaAmbiental = data?.DescripcionProyecto?.AreasInfluencia?.AreaIndirectaAmbiental || [];
    this.areaDirectaSocial = data?.DescripcionProyecto?.AreasInfluencia?.AreaDirectaSocial || [];
    this.areaIndirectaSocial = data?.DescripcionProyecto?.AreasInfluencia?.AreaIndirectaSocial || [];

    this.fnGridTableDirectaAmbiental(data?.DescripcionProyecto?.AreasInfluencia?.AreaDirectaAmbiental);
    this.fnGridTableDirectaSocial(data?.DescripcionProyecto?.AreasInfluencia?.AreaDirectaSocial);
    this.fnGridTableIndirectaAmbiental(data?.DescripcionProyecto?.AreasInfluencia?.AreaIndirectaAmbiental);
    this.fnGridTableIndirectaSocial(data?.DescripcionProyecto?.AreasInfluencia?.AreaIndirectaSocial);
  }

  agregarDocumento(item: ArchivoAdjunto) {//AttachButtonComponent - Documentos Adjuntos
    this.documentos.push(item);
  }

  actualizarDocumentos(documentos: ArchivoAdjunto[]) {
    this.documentos = documentos;
  }  

  validarAreasInfluencia(areasInfluencia: AreasInfluencia): boolean {
  
    // Validar listas de objetos
    if (!areasInfluencia.AreaDirectaAmbiental || areasInfluencia.AreaDirectaAmbiental.length === 0) {
      console.error("La lista AreaDirectaAmbiental está vacía.");
      return false;
    }
    if (!areasInfluencia.AreaIndirectaAmbiental || areasInfluencia.AreaIndirectaAmbiental.length === 0) {
      console.error("La lista AreaIndirectaAmbiental está vacía.");
      return false;
    }
    if (!areasInfluencia.AreaDirectaSocial || areasInfluencia.AreaDirectaSocial.length === 0) {
      console.error("La lista AreaDirectaSocial está vacía.");
      return false;
    }
    if (!areasInfluencia.AreaIndirectaSocial || areasInfluencia.AreaIndirectaSocial.length === 0) {
      console.error("La lista AreaIndirectaSocial está vacía.");
      return false;
    }
  
    // Validar lista de documentos
    if (!areasInfluencia.Documentos || areasInfluencia.Documentos.length === 0) {
      console.error("La lista Documentos está vacía.");
      return false;
    }
     
    return true;
  }

  validarFormularioSolicitudDIA(formulario: FormularioSolicitudDIA): number {
    if(!this.data.DescripcionProyecto.AreasInfluencia.Save) return 0;
    if (!this.validarAreasInfluencia(formulario.DescripcionProyecto.AreasInfluencia)) return 1;
    return 2;
  }
  
  save(form: FormGroup) {  
    this.data.DescripcionProyecto.AreasInfluencia.Documentos = this.documentos;
    this.data.DescripcionProyecto.AreasInfluencia.Save = true;
    this.data.DescripcionProyecto.AreasInfluencia.FechaRegistro = this.funcionesMtcService.dateNow();
    this.data.DescripcionProyecto.AreasInfluencia.State = this.validarFormularioSolicitudDIA(this.data);
    this.GuardarJson(this.data, false);
  }

  private GuardarJson(data: FormularioSolicitudDIA, esEliminar?:  boolean) {
    let mensaje:string = '';

    const objeto: FormularioDIAResponse = {
      codMaeSolicitud: this.codMaeSolicitud,
      codMaeRequisito: this.codMaeRequisito,
      dataJson: JSON.stringify(data)
    };    

    this.tramiteService.postGuardarFormulario(objeto).subscribe(resp => {
      this.funcionesMtcService.ocultarCargando();
      if (resp.success){
         mensaje = esEliminar ? 'Se eliminó el registro satisfactoriamente': 'Se grabó el formulario';
         this.funcionesMtcService.ocultarCargando().mensajeOk(mensaje).then(() => {if(!esEliminar)this.closeDialog()});
      }        
      else
        this.funcionesMtcService.ocultarCargando().mensajeError('No se grabó el formulario');
    });
  }

  closeDialog() {
    this.activeModal.dismiss();
  }

  openModal(text: string, row?: TableRow, tipo?:number, esEdicion?:boolean) {
    const modalOptions: NgbModalOptions = {
      size: 'xl',
      centered: true,
      ariaLabelledBy: 'modal-basic-title',
    };
    const modalRef = this.modalService.open(MapDialogComponent, modalOptions);
    modalRef.componentInstance.title = text;
    modalRef.componentInstance.tipo = tipo;
    modalRef.componentInstance.codMaeSolicitud = this.codMaeSolicitud;
    modalRef.componentInstance.modoVisualizacion = this.modoVisualizacion;
    modalRef.componentInstance.codMaeRequisito = this.codMaeRequisito;
    modalRef.componentInstance.idCliente = this.idCliente;
    modalRef.componentInstance.idEstudio = this.idEstudio;
    modalRef.componentInstance.id = this.fnObtenerId(tipo, esEdicion, esEdicion ? parseInt(row.Id.text): 0);
    modalRef.componentInstance.edicion = row ? this.fnObtenerRegistro(row, tipo) : undefined;
    modalRef.result.then(
      (result) => { this.getData(); },
      (reason) => { console.log('Modal fue cerrado sin resultado:', reason); });
  }

  fnObtenerId(tipo:number, esEdicion:boolean, id?:number){
    if(esEdicion) return id;

    if(tipo === 3)
      return this.areaDirectaAmbiental.length === 0 ? 1 : (this.areaDirectaAmbiental.reduce((max, item) => item.Id > max ? item.Id : max, 0)) + 1;
    else if(tipo === 4)
      return this.areaIndirectaAmbiental.length === 0 ? 1 : (this.areaIndirectaAmbiental.reduce((max, item) => item.Id > max ? item.Id : max, 0)) + 1;
    else if(tipo === 5)
      return this.areaDirectaSocial.length === 0 ? 1 : (this.areaDirectaSocial.reduce((max, item) => item.Id > max ? item.Id : max, 0)) + 1;
    else if(tipo === 6)
      return this.areaIndirectaSocial.length === 0 ? 1 : (this.areaIndirectaSocial.reduce((max, item) => item.Id > max ? item.Id : max, 0)) + 1;
  }

  fnObtenerRegistro(row:TableRow, tipo:number){
    if(tipo === 3)
      return this.areaDirectaAmbiental.find(x => x.Id === parseInt(row.Id.text));
    else if(tipo === 4)
      return this.areaIndirectaAmbiental.find(x => x.Id === parseInt(row.Id.text));
    else if(tipo === 5)
      return this.areaDirectaSocial.find(x => x.Id === parseInt(row.Id.text));
    else if(tipo === 6)
      return this.areaIndirectaSocial.find(x => x.Id === parseInt(row.Id.text));
  }

  fnGridTableDirectaAmbiental(data: AreaActividadMinera[]) {
    const tabla: TableRow[] = data?.map(datos => {
      return {
        Id: { text: datos.Id.toString() },
        Zona: { text: datos.Zona },
        Datum: { text: datos.Datum },
        IdActividad: { text: datos.IdActividad.toString() },
        Actividad: { text: datos.Actividad },
        Descripcion: { text: datos.Descripcion },
        Validacion: { text: datos.Validacion },
        edit: { buttonIcon: 'edit', hasCursorPointer: true, onClick: (row: TableRow) => this.fnEditarDirectaAmbiental(row) },
        delete: { buttonIcon: 'remove', hasCursorPointer: true, onClick: (row: TableRow) => this.fnEliminarDirectaAmbiental(row) }
      }
    }) || [];
    this.dataDirectaAmbiental = tabla;
  }

  fnEditarDirectaAmbiental(row?: TableRow) {
    this.openModal('ÁREA DIRECTA AMBIENTAL', row, 3, true);
  }

  fnEliminarDirectaAmbiental(row?: TableRow) {
    this.funcionesMtcService
      .mensajeConfirmar('¿Está seguro de eliminar el registro seleccionado?')
      .then(() => {
        this.areaDirectaAmbiental = this.areaDirectaAmbiental.filter(x => x.Id !== parseInt(row.Id.text));        
        this.data.DescripcionProyecto.AreasInfluencia.AreaDirectaAmbiental = this.areaDirectaAmbiental;
        this.GuardarJson(this.data, true);
        this.fnGridTableDirectaAmbiental(this.areaDirectaAmbiental);
      });
  }


  fnGridTableIndirectaAmbiental(data: AreaActividadMinera[]) {
    const tabla: TableRow[] = data?.map(datos => {
      return {
        Id: { text: datos.Id.toString() },
        Zona: { text: datos.Zona },
        Datum: { text: datos.Datum },
        IdActividad: { text: datos.IdActividad.toString() },
        Actividad: { text: datos.Actividad },
        Descripcion: { text: datos.Descripcion },
        Validacion: { text: datos.Validacion },
        edit: { buttonIcon: 'edit', hasCursorPointer: true, onClick: (row: TableRow) => this.fnEditarIndirectaAmbiental(row) },
        delete: { buttonIcon: 'remove', hasCursorPointer: true, onClick: (row: TableRow) => this.fnEliminarIndirectaAmbiental(row) }
      }
    }) || [];
    this.dataIndirectaAmbiental = tabla;
  }

  fnEditarIndirectaAmbiental(row?: TableRow) {
    this.openModal('ÁREA INDIRECTA AMBIENTAL', row, 4, true);
  }

  fnEliminarIndirectaAmbiental(row?: TableRow) {
    this.funcionesMtcService
      .mensajeConfirmar('¿Está seguro de eliminar el registro seleccionado?')
      .then(() => {
        this.areaIndirectaAmbiental = this.areaIndirectaAmbiental.filter(x => x.Id !== parseInt(row.Id.text));
        this.data.DescripcionProyecto.AreasInfluencia.AreaIndirectaAmbiental = this.areaIndirectaAmbiental;
        this.GuardarJson(this.data, true);
        this.fnGridTableIndirectaAmbiental(this.areaIndirectaAmbiental);
      });
  }

  fnGridTableDirectaSocial(data: AreaActividadMinera[]) {
    const tabla: TableRow[] = data?.map(datos => {
      return {
        Id: { text: datos.Id.toString() },
        Zona: { text: datos.Zona },
        Datum: { text: datos.Datum },
        IdActividad: { text: datos.IdActividad.toString() },
        Actividad: { text: datos.Actividad },
        Descripcion: { text: datos.Descripcion },
        Validacion: { text: datos.Validacion },
        edit: { buttonIcon: 'edit', hasCursorPointer: true, onClick: (row: TableRow) => this.fnEditarDirectaSocial(row) },
        delete: { buttonIcon: 'remove', hasCursorPointer: true, onClick: (row: TableRow) => this.fnEliminarDirectaSocial(row) }
      }
    }) || [];
    this.dataDirectaSocial = tabla;
  }

  fnEditarDirectaSocial(row?: TableRow) {
    this.openModal('ÁREA DIRECTA SOCIAL', row, 5, true);
  }

  fnEliminarDirectaSocial(row?: TableRow) {
    this.funcionesMtcService
      .mensajeConfirmar('¿Está seguro de eliminar el registro seleccionado?')
      .then(() => {
        this.areaDirectaSocial = this.areaDirectaSocial.filter(x => x.Id !== parseInt(row.Id.text));
        this.data.DescripcionProyecto.AreasInfluencia.AreaDirectaSocial = this.areaDirectaSocial;
        this.GuardarJson(this.data, true);
        this.fnGridTableDirectaSocial(this.areaDirectaSocial);
      });
  }

  fnGridTableIndirectaSocial(data: AreaActividadMinera[]) {
    const tabla: TableRow[] = data?.map(datos => {
      return {
        Id: { text: datos.Id.toString() },
        Zona: { text: datos.Zona },
        Datum: { text: datos.Datum },
        IdActividad: { text: datos.IdActividad.toString() },
        Actividad: { text: datos.Actividad },
        Descripcion: { text: datos.Descripcion },
        Validacion: { text: datos.Validacion },
        edit: { buttonIcon: 'edit', hasCursorPointer: true, onClick: (row: TableRow) => this.fnEditarIndirectaSocial(row) },
        delete: { buttonIcon: 'remove', hasCursorPointer: true, onClick: (row: TableRow) => this.fnEliminarIndirectaSocial(row) }
      }
    }) || [];
    this.dataIndirectaSocial = tabla;
  }

  fnEditarIndirectaSocial(row?: TableRow) {
    this.openModal('ÁREA INDIRECTA SOCIAL', row, 6, true);
  }

  fnEliminarIndirectaSocial(row?: TableRow) {
    this.funcionesMtcService
      .mensajeConfirmar('¿Está seguro de eliminar el registro seleccionado?')
      .then(() => {
        this.areaIndirectaSocial = this.areaIndirectaSocial.filter(x => x.Id !== parseInt(row.Id.text));
        this.data.DescripcionProyecto.AreasInfluencia.AreaIndirectaSocial = this.areaIndirectaSocial;
        this.GuardarJson(this.data, true);
        this.fnGridTableIndirectaSocial(this.areaIndirectaSocial);
      });
  }


  // openModalDirectaSocial() {
  //   let text = 'Debe ingresar por lo menos un área superficial en actividad minera en la sección 2.4 de limitación del perimetro del área del proyecto'
  //   const modalOptions: NgbModalOptions = {
  //     centered: true,
  //     ariaLabelledBy: 'modal-basic-title',
  //   };
  //   const modalRef = this.modalService.open(ConfirmationDialogComponent, modalOptions);
  //   modalRef.componentInstance.description = text;
  // }

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

  ver(){
    if (this.estadoSolicitud !== 'EN PROCESO') {
    return true;
    }
    return false;
  }
}
