import { Component, Input, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Observable, catchError, map, of } from 'rxjs';
import { Datum } from 'src/app/core/models/Externos/Datum';
import { ComponenteExUnidadMinera, ComponenteNoCerrado } from 'src/app/core/models/Tramite/FormularioSolicitudDIA';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { ExternoService } from 'src/app/core/services/servicios/externo.service';
import { IOption, TableColumn, TableRow } from 'src/app/shared/components/table/interfaces/table.interface';
import { PasivoLaboresInfraestructuraComponent } from '../pasivo-labores-infraestructura/pasivo-labores-infraestructura.component';

@Component({
  selector: 'app-componentes-no-cerrados',
  templateUrl: './componentes-no-cerrados.component.html',
  styleUrl: './componentes-no-cerrados.component.scss'
})
export class ComponentesNoCerradosComponent implements OnInit {
  form: FormGroup;
  activeModal = inject(NgbActiveModal);
  openModal = inject(NgbModal);

  @Input() title!: string;
  @Input() id: number;
  @Input() edicion: ComponenteNoCerrado;
  @Input() codMaeSolicitud: number;
  @Input() idCliente: number;
  @Input() idEstudio: number;
  @Input() modoVisualizacion: boolean;
  @Input() codMaeRequisito: number;

  listaDatum: Datum[] = [];
  descripcionDatum: string = '';


  componenteExUnidadMinera: ComponenteExUnidadMinera[] = [];
  optsDatum: IOption[] = [];

  headersParameters: TableColumn[] = [];

  dataTablaParameters: TableRow[] = [];

  constructor(
    private builder: FormBuilder,
    private funcionesMtcService: FuncionesMtcService,
    private externoService: ExternoService,
  ) { }

  ngOnInit(): void {
    this.buildForm();
    this.loadTableHeaders();
    this.loadListas();
    this.getData();
    this.habilitarControles();
  }

  private loadTableHeaders() {
    this.headersParameters = [
      { header: 'ID', field: 'Id', hidden: true },
      { header: 'NOMBRE', field: 'Nombre', },
      { header: 'TIPO', field: 'Tipo', },
      { header: 'SUBTIPO', field: 'Subtipo', },
      { header: 'ESTE', field: 'Este', },
      { header: 'NORTE', field: 'Norte', },
      { header: 'ZONA', field: 'Zona', },
      { header: 'DATUM', field: 'Datum', },
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
    }
  }
  //#endregion ViewOnly

  private buildForm(): void {
    this.form = this.builder.group({
      Id: [null, Validators.required],
      NombrePasivo: [null, Validators.required],
      Condicion: [null, Validators.required],
      Datum: [{ value: "2", disabled: true }, Validators.required]
    });
  }

  private getData(): void {
    if (this.edicion !== undefined) {
      this.id = this.edicion.Id;
      this.componenteExUnidadMinera = this.edicion.ComponenteExUnidadMinera;
      this.form.patchValue(this.edicion);
    }
    this.form.patchValue({ Id: this.id });
    this.fnGridTableComponenteExUnidadMinera(this.componenteExUnidadMinera);
  }

  private preSaveValidation(datos: ComponenteNoCerrado): string[] {
    const errores: string[] = [];

    if (datos.Condicion === null || datos.Condicion === undefined || datos.Condicion?.trim() === '') {
      errores.push('Se debe de ingresar el campo obligatorio: Condición.');
    }
    if (datos.NombrePasivo === null || datos.NombrePasivo === undefined || datos.NombrePasivo?.trim() === '') {
      errores.push('Se debe de ingresar el campo obligatorio: Nombre Pasivo.');
    }

    return errores;
  }

  save(form: FormGroup) {

    const datos: ComponenteNoCerrado = {
      ...form.value,
      Id: this.id,
      ComponenteExUnidadMinera: this.componenteExUnidadMinera
    };

    const errores = this.preSaveValidation(datos);

    if (errores.length > 0) {
      const mensajeHtml = `<ul>${errores.map(error => `<li>${error}</li>`).join('')}</ul>`;
      this.funcionesMtcService.mensajeHtml(mensajeHtml);
      return;
    }

    this.activeModal.close(datos);
  }

  closeDialog() {
    this.activeModal.dismiss();
  }

  private loadListas() {
    this.comboDatum().subscribe(response => this.listaDatum = response);
  }

  private comboDatum(): Observable<Datum[]> {
    this.funcionesMtcService.mostrarCargando();
    return this.externoService.getDatum().pipe(
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

  openModalExUnidadMinera(text: string, row?: TableRow) {
    const modalOptions: NgbModalOptions = {
      size: 'md',
      centered: true,
      ariaLabelledBy: 'modal-basic-title',
    };
    const modalRef = this.openModal.open(PasivoLaboresInfraestructuraComponent, modalOptions);
    modalRef.componentInstance.title = text;
    modalRef.componentInstance.id = this.componenteExUnidadMinera.length === 0 ? 1 : (this.componenteExUnidadMinera.reduce((max, item) => item.Id > max ? item.Id : max, 0)) + 1;
    modalRef.componentInstance.edicion = row ? this.componenteExUnidadMinera.find(x => x.Id === parseInt(row.Id.text)) : undefined;
    modalRef.componentInstance.codMaeSolicitud = this.codMaeSolicitud;
    modalRef.componentInstance.modoVisualizacion = this.modoVisualizacion;
    modalRef.componentInstance.idCliente = this.idCliente;
    modalRef.componentInstance.idEstudio = this.idEstudio;
    modalRef.componentInstance.codMaeRequisito = this.codMaeRequisito;
    modalRef.result.then(
      (result) => {// Maneja el resultado aquí
        if (row) {
          this.componenteExUnidadMinera = this.componenteExUnidadMinera.filter(x => x.Id !== parseInt(row.Id.text));
        }
        this.componenteExUnidadMinera.push(result);
        this.fnGridTableComponenteExUnidadMinera(this.componenteExUnidadMinera);
      },
      (reason) => {// Maneja la cancelación aquí
        console.log('Modal fue cerrado sin resultado:', reason);
      });
  }

  fnGridTableComponenteExUnidadMinera(data: ComponenteExUnidadMinera[]) {

    const tabla: TableRow[] = data.map(datos => {
      return {
        Id: { text: datos.Id.toString() },
        Nombre: { text: datos.Nombre },
        Tipo: { text: datos.DescripcionTipo },
        Subtipo: { text: datos.DescripcionSubtipo },
        Este: { text: datos.Este },
        Norte: { text: datos.Norte },
        Zona: { text: datos.DescripcionZona },
        Datum: { text: datos.DescripcionDatum },
        edit: { buttonIcon: 'edit', hasCursorPointer: true, onClick: (row: TableRow) => this.fnEditarComponenteExUnidadMinera(row) },
        delete: { buttonIcon: 'remove', hasCursorPointer: true, onClick: (row: TableRow) => this.fnEliminarComponenteExUnidadMinera(row) },
        view: { buttonIcon: 'search', hasCursorPointer: true, onClick: (row: TableRow) => this.fnEditarComponenteExUnidadMinera(row) },
      }
    });

    this.dataTablaParameters = tabla;
  }

  fnEditarComponenteExUnidadMinera(row?: TableRow) {
    this.openModalExUnidadMinera('COMPONENTES DE LA EX UNIDAD MINERA', row);
  }

  fnEliminarComponenteExUnidadMinera(row?: TableRow) {
    this.funcionesMtcService
      .mensajeConfirmar('¿Está seguro de eliminar el registro seleccionado?')
      .then(() => {
        this.componenteExUnidadMinera = this.componenteExUnidadMinera.filter(x => x.Id !== parseInt(row.Id.text));
        this.fnGridTableComponenteExUnidadMinera(this.componenteExUnidadMinera);
      });
  }
}
