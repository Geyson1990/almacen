import { Component, Input, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Observable, catchError, map, of } from 'rxjs';
import { Empresa } from 'src/app/core/models/Anexos/Anexo001_C27NT/Secciones';
import { ProfesionalesConsultoraResponse } from 'src/app/core/models/Externos/ProfesionalesConsultora';
import { FormularioDIAResponse } from 'src/app/core/models/Formularios/FormularioMain';
import { ArchivoAdjunto, Consultora, EmpresaConsultora, FormularioSolicitudDIA, OtroProfesionalConsultora, ProfesionalConsultora } from 'src/app/core/models/Tramite/FormularioSolicitudDIA';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { ExternoService } from 'src/app/core/services/servicios/externo.service';
import { TramiteService } from 'src/app/core/services/tramite/tramite.service';
import { ConfirmationDialogComponent } from 'src/app/modals/confirmation-dialog/confirmation-dialog.component';
import { EmpresaConsultoraComponent } from 'src/app/modals/empresa-consultora/empresa-consultora.component';
import { OtrosProfesionalesConsultoraComponent } from 'src/app/modals/otros-profesionales-consultora/otros-profesionales-consultora.component';
import { ProfesionalesConsultoraComponent } from 'src/app/modals/profesionales-consultora/profesionales-consultora.component';
import { IOption, TableColumn, TableRow } from 'src/app/shared/components/table/interfaces/table.interface';
import { CONSTANTES } from 'src/app/enums/constants';
import { ComboGenerico } from 'src/app/core/models/Maestros/ComboGenerico';

@Component({
  selector: 'consultora-dialog',
  templateUrl: './consultora-dialog.component.html',
})
export class ConsultoraDialogComponent implements OnInit {
  form: FormGroup;
  selectedUnit: string = '';
  activeModal = inject(NgbActiveModal);
  openModal = inject(NgbModal);
  @Input() title!: string;
  @Input() codMaeSolicitud: number;
  @Input() idCliente: number;
  @Input() idEstudio: number;
  @Input() modoVisualizacion: boolean;
  @Input() codMaeRequisito: number;

  data: FormularioSolicitudDIA;
  consultora: Consultora;
  profesional: ProfesionalesConsultoraResponse[] = [];

  profesionales: ProfesionalConsultora[] = [];
  otrosProfesionales: OtroProfesionalConsultora[] = [];

  documentos: ArchivoAdjunto[] = [];
  dataTableConsultora: TableRow[] = [];
  dataTableProfesional: TableRow[] = [];
  dataTableOtrosProfesional: TableRow[] = [];
  showTipoDocumento: boolean = true;
  optsTipoDocumento: IOption[] = [];

  tableConsultora: TableColumn[] = [];

  tableProfesional: TableColumn[] = [];
  // -------------
  tableOtrosProfesional: TableColumn[] = [];
  estadoSolicitud: string;

  constructor(
    private builder: FormBuilder,
    private externoService: ExternoService,
    private tramiteService: TramiteService,
    private funcionesMtcService: FuncionesMtcService
  ) { }

  ngOnInit(): void {
    debugger;
    this.buildForm();
    this.loadTableHeader();
    this.getData();
    this.loadListas();
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

  private getData(): void {
    this.funcionesMtcService.mostrarCargando();
    const codigoSolicitud = this.codMaeSolicitud;
    this.tramiteService.getFormularioDia(codigoSolicitud).subscribe(resp => {
      this.funcionesMtcService.ocultarCargando();
      if (resp.success) {
        this.data = JSON.parse(resp.data.dataJson);
        if (this.data.Consultora !== undefined) {

          this.consultora = this.data.Consultora;
          this.fnTableConsultora(this.data.Consultora.EmpresaConsultora);
          this.fnTableProfesional(this.data.Consultora.ProfesionalConsultora);
          this.documentos = this.data.Consultora.Documentos;
        }
      }
    });

    const tramite = localStorage.getItem('tramite-selected');
    const tramiteObj = JSON.parse(tramite);
    this.estadoSolicitud = tramiteObj.estadoSolicitud;
  }

  // getParametros(idCliente: number): void {
  //   this.funcionesMtcService.mostrarCargando();
  //   this.externoService.getProfesionalesConsultora(idCliente).pipe(
  //     map(response => {
  //       if (response.success) {
  //         debugger;
  //         // const lista: ProfesionalesConsultoraResponse[] = response.data
  //         //   .filter(x => this.consultora.ProfesionalConsultora)
  //         //   .map(parametro => ({
  //         //     idProfesional: parametro.idProfesional,
  //         //     apellido: parametro.apellido,
  //         //     nombre: parametro.nombre,
  //         //     nroColegiatura: parametro.nroColegiatura,
  //         //     profesion: parametro.profesion

  //         //   }));

  //         console.log(JSON.stringify(response.data));
  //         console.log(JSON.stringify(this.consultora.ProfesionalConsultora));
  //         const listaFiltrada = response.data.filter(itemA =>
  //           this.consultora.ProfesionalConsultora.some(itemB => itemB.IdProfesional === itemA.idProfesional)
  //         ).map(parametro => ({
  //           idProfesional: parametro.idProfesional,
  //           apellido: parametro.apellido,
  //           nombre: parametro.nombre,
  //           nroColegiatura: parametro.nroColegiatura,
  //           profesion: parametro.profesion
  //         }));

  //         debugger;
  //         this.fnTableProfesional(listaFiltrada);
  //       }

  //       this.funcionesMtcService.ocultarCargando();
  //     }),
  //     catchError(error => {
  //       this.funcionesMtcService.ocultarCargando();
  //       console.error('Error en la solicitud:', error);
  //       return [];
  //     })
  //   ).subscribe();
  // }


  private buildForm(): void {
    this.form = this.builder.group({});
  }

  save(form: FormGroup) {
    this.data.Consultora.EmpresaConsultora = this.consultora.EmpresaConsultora;
    this.data.Consultora.ProfesionalConsultora = this.consultora.ProfesionalConsultora;
    this.data.Consultora.OtroProfesionalConsultora = this.consultora.OtroProfesionalConsultora;
    this.data.Consultora.Documentos = this.documentos;
    this.data.Consultora.Save = true;
    this.data.Consultora.FechaRegistro = this.funcionesMtcService.dateNow();
    this.data.Consultora.State = this.validarFormularioSolicitudDIA(this.data);

    this.GuardarJson(this.data);

  }

  validateConsultora(consultora: Consultora): boolean {
    // Validar que EmpresaConsultora tenga todos los campos llenos
    if (!consultora.EmpresaConsultora.Ruc.trim() || !consultora.EmpresaConsultora.Nombre.trim() || !consultora.EmpresaConsultora.IdCliente) {
      console.error("La empresa consultora debe tener todos los campos llenos.");
      return false;
    }

    // Validar que ProfesionalConsultora no esté vacío y que cada profesional tenga todos sus campos llenos
    if (!consultora.ProfesionalConsultora || consultora.ProfesionalConsultora.length === 0) {
      console.error("Debe haber al menos un profesional consultor registrado.");
      return false;
    }



    // Validar que OtroProfesionalConsultora no esté vacío y que cada otro profesional tenga todos sus campos llenos
    if (!consultora.OtroProfesionalConsultora || consultora.OtroProfesionalConsultora.length === 0) {
      console.error("Debe haber al menos un otro profesional consultor registrado.");
      return false;
    }



    // Validar que Documentos no esté vacío
    if (!consultora.Documentos || consultora.Documentos.length === 0) {
      console.error("Debe haber al menos un documento registrado.");
      return false;
    }



    return true;
  }

  validarFormularioSolicitudDIA(formulario: FormularioSolicitudDIA): number {
    if (!this.data.Consultora.Save) return 0;
    if (!this.validateConsultora(formulario.Consultora)) return 1;
    return 2;
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

  closeDialog() {
    this.activeModal.dismiss();
  }

  openModalDirectaSocial() {
    let text = 'Debe seleccionar la Empresa Consultora antes de poder seleccionar los Profesionales que Realizaron el Estudio.'

    if (!this.consultora || !this.consultora.EmpresaConsultora) {
      this.funcionesMtcService.mensajeInfo(text);
      return;
    }

    const modalOptions: NgbModalOptions = {
      centered: true,
      ariaLabelledBy: 'modal-basic-title',
    };
    const modalRef = this.openModal.open(ConfirmationDialogComponent, modalOptions);
    modalRef.componentInstance.description = text;
    modalRef.componentInstance.idConsultora = this.consultora.EmpresaConsultora.IdCliente;
  }

  fnTableConsultora(empresa: EmpresaConsultora) {
    if (empresa.Ruc !== '') {
      this.dataTableConsultora = [
        {
          ruc: { text: empresa.Ruc },
          nombre: { text: empresa.Nombre },
          accion: { buttonIcon: 'remove', onClick: (row: TableRow, column: TableColumn) => this.deleteEmpresa(row) },
        },
      ];
    }

  }

  deleteEmpresa(row: TableRow) {
    this.consultora.EmpresaConsultora = {
      IdCliente: 0,
      Nombre: '',
      Ruc: ''
    };
    this.consultora.ProfesionalConsultora = [];
    this.consultora.OtroProfesionalConsultora = [];
    this.dataTableConsultora = [];
    this.dataTableProfesional = [];
  }

  fnTableProfesional(profesionales: ProfesionalConsultora[]) {
    let tableProfesionales: TableRow[] = [];
    if (profesionales.length > 0) {
      tableProfesionales = profesionales.map(param => ({
        idProfesional: { text: param.IdProfesional.toString() },
        nombre: { text:  `${param.Nombres} ${param.Apellidos}`}, 
        profesion: { text: param.Profesion },
        colegiatura: { text: param.Colegiatura },
        accion: {
          buttonIcon: 'delete',
          hasCursorPointer: true,
          onClick: (row: TableRow, column: TableColumn) => {
            this.funcionesMtcService
              .mensajeConfirmar('¿Está seguro de eliminar el registro seleccionado?')
              .then(() => {
                this.data.Consultora.ProfesionalConsultora = this.data.Consultora.ProfesionalConsultora.filter(x => x.IdProfesional !== parseInt(row['idProfesional'].text));
                this.dataTableProfesional = this.dataTableProfesional.filter(x => x.idProfesional.text !== row['idProfesional'].text);
              });
          }
        },
      }));
    }

    this.dataTableProfesional = tableProfesionales;
  }

  fnTableOtroProfesional(profesionales: OtroProfesionalConsultora[]) {
    const tableProfesionales: TableRow[] = profesionales.map(param => ({
      idProfesional: { text: param.IdProfesional.toString() },
      nombre: { text: param.Nombres },
      profesion: { text: param.Profesion },
      colegiatura: { text: param.Colegiatura },
      accion: {
        buttonIcon: 'delete',
        hasCursorPointer: true,
        onClick: (row: TableRow, column: TableColumn) => {
          this.otrosProfesionales = this.otrosProfesionales.filter(x => x.IdProfesional !== parseInt(row['idProfesional'].text));
        }
      },
    }));

    this.dataTableOtrosProfesional = tableProfesionales;
  }

  openModalConsultora(text?: string, row?: TableRow, esEdicion?: boolean) {
    const modalOptions: NgbModalOptions = {
      size: 'lg',
      centered: true,
      ariaLabelledBy: 'modal-basic-title',
    };
    const modalRef = this.openModal.open(EmpresaConsultoraComponent, modalOptions);
    modalRef.componentInstance.title = text;
    modalRef.componentInstance.codMaeSolicitud = this.codMaeSolicitud;
    modalRef.componentInstance.modoVisualizacion = this.modoVisualizacion;
    modalRef.componentInstance.idCliente = this.idCliente;
    modalRef.componentInstance.idEstudio = this.idEstudio;    
    modalRef.result.then(
      (result) => {// Maneja el resultado aquí
        this.consultora.EmpresaConsultora = result.data;
        this.data.Consultora.EmpresaConsultora = result.data;          
        this.fnTableConsultora(result.data);
      },
      (reason) => {// Maneja la cancelación aquí
        console.log('Modal fue cerrado sin resultado:', reason);
      });
  };

  openModalProfesionales(text?: string, row?: TableRow) {
    let mensaje = 'Debe seleccionar la Empresa Consultora antes de poder seleccionar los Profesionales que Realizaron el Estudio.'

    if (!this.consultora.EmpresaConsultora || !this.consultora.EmpresaConsultora.IdCliente) {
      this.funcionesMtcService.mensajeInfo(mensaje);
      return;
    }

    const modalOptions: NgbModalOptions = {
      size: 'lg',
      centered: true,
      ariaLabelledBy: 'modal-basic-title',
    };
    const modalRef = this.openModal.open(ProfesionalesConsultoraComponent, modalOptions);
    modalRef.componentInstance.title = text;
    modalRef.componentInstance.data = this.data;
    modalRef.componentInstance.codMaeSolicitud = this.codMaeSolicitud;
    modalRef.componentInstance.modoVisualizacion = this.modoVisualizacion;
    modalRef.componentInstance.idCliente = this.idCliente;
    modalRef.componentInstance.idEstudio = this.idEstudio;
    modalRef.componentInstance.idConsultora = this.consultora.EmpresaConsultora.IdCliente;   
    //modalRef.componentInstance.idsSeleccionados = this.consultora?.ProfesionalConsultora?.length > 0 ? new Set(this.consultora?.ProfesionalConsultora.map(({ IdProfesional }) => IdProfesional)) : new Set<number>();
    modalRef.result.then(
      (result) => {// Maneja el resultado aquí
        //this.profesionales = result.data;
        this.data.Consultora.ProfesionalConsultora = result.data;
        this.fnTableProfesional(result.data);
      },
      (reason) => {// Maneja la cancelación aquí
        console.log('Modal fue cerrado sin resultado:', reason);
      });
  };

  openModalOtrosProfesionales(text?: string, row?: TableRow) {
    // let mensaje = 'Debe seleccionar la Empresa Consultora antes de poder seleccionar los Profesionales que Realizaron el Estudio.'

    // if (!this.consultora.EmpresaConsultora || !this.consultora.EmpresaConsultora.IdCliente) {
    //   this.funcionesMtcService.mensajeInfo(mensaje);
    //   return;
    // }

    const modalOptions: NgbModalOptions = {
      size: 'lg',
      centered: true,
      ariaLabelledBy: 'modal-basic-title',
    };
    const modalRef = this.openModal.open(OtrosProfesionalesConsultoraComponent, modalOptions);
    modalRef.componentInstance.title = text;
    modalRef.componentInstance.data = this.data;
    modalRef.componentInstance.idConsultora = this.consultora.EmpresaConsultora.IdCliente;
    modalRef.componentInstance.codMaeSolicitud = this.codMaeSolicitud;
    modalRef.componentInstance.modoVisualizacion = this.modoVisualizacion;
    modalRef.componentInstance.idCliente = this.idCliente;
    modalRef.componentInstance.idEstudio = this.idEstudio;    
    modalRef.result.then(
      (result) => {// Maneja el resultado aquí
        this.otrosProfesionales.push(result.data);
        this.data.Consultora.OtroProfesionalConsultora.push(result.data);
        //this.fnTableProfesional(result.data);
      },
      (reason) => {// Maneja la cancelación aquí
        console.log('Modal fue cerrado sin resultado:', reason);
      });
  };

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
    this.tableConsultora = [
      { header: 'RUC', field: 'ruc', },
      { header: 'NOMBRE', field: 'nombre', },
      { header: 'ACCIÓN', field: 'accion', hidden: this.modoVisualizacion }
    ];

    this.tableProfesional = [
      { header: 'ID_PROFESIONAL', field: 'idProfesional', hidden: true },
      { header: 'NOMBRE', field: 'nombre', },
      { header: 'PROFESIÓN', field: 'profesion', },
      { header: 'COLEGIATURA', field: 'colegiatura', },
      { header: 'ACCIÓN', field: 'accion', hidden: this.modoVisualizacion }
    ];
    // -------------
    this.tableOtrosProfesional = [
      { header: 'ID_PROFESIONAL', field: 'idProfesional', hidden: true },
      { header: 'NOMBRE', field: 'nombre', },
      { header: 'PROFESIÓN', field: 'profesion', },
      { header: 'COLEGIATURA', field: 'colegiatura', },
      { header: 'ACCIÓN', field: 'accion', hidden: this.modoVisualizacion }
    ];
  }

}
