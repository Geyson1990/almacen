import { Component, Input, OnInit, inject, input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, catchError, map, of, throwError } from 'rxjs';
import { ApiResponseModel } from 'src/app/core/models/Autenticacion/TipoPersonaResponseModel';
import { TipoDocumento } from 'src/app/core/models/Externos/OtroProfesional';
import { ParametroMonitoreo } from 'src/app/core/models/Externos/ParametroMonitoreo';
import { ProfesionalesConsultoraResponse } from 'src/app/core/models/Externos/ProfesionalesConsultora';
import { ComboGenerico } from 'src/app/core/models/Maestros/ComboGenerico';
import { FormularioSolicitudDIA, Insumos, Mineral, OtroProfesionalConsultora, ParametrosPlanVigilancia, ProfesionalConsultora } from 'src/app/core/models/Tramite/FormularioSolicitudDIA';
import { ApiResponse } from 'src/app/core/models/api-response';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { ExternoService } from 'src/app/core/services/servicios/externo.service';
import { CONSTANTES } from 'src/app/enums/constants';
import { IOption, ISelectCell, TableColumn, TableRow } from 'src/app/shared/components/table/interfaces/table.interface';


@Component({
  selector: 'app-otros-profesionales-consultora',
  templateUrl: './otros-profesionales-consultora.component.html',
  styleUrl: './otros-profesionales-consultora.component.scss'
})
export class OtrosProfesionalesConsultoraComponent implements OnInit {
  form: FormGroup;
  activeModal = inject(NgbActiveModal);
  @Input() title!: string;
  @Input() idConsultora: number;
  @Input() data: FormularioSolicitudDIA;
  @Input() codMaeSolicitud: number;
  @Input() idCliente: number;
  @Input() idEstudio: number;
  @Input() modoVisualizacion: boolean;

  idsSeleccionados: Set<number> = new Set<number>();
  profesional: ProfesionalesConsultoraResponse[] = [];
  profesionalSeleccionado: ProfesionalConsultora[] = [];
  tipoDocumento: TipoDocumento[] = [];
  ApellidoPaterno: string = '';
  ApellidoMaterno: string = '';
  Nombres: string = '';
  OtroProfesionalConsultora: OtroProfesionalConsultora = {
    ApellidoMaterno: '',
    IdProfesional: 0,
    ApellidoPaterno: '',
    Nombres: '',
    Profesion: '',
    Colegiatura: '',
    Email: ''
  };

  parametros: ParametroMonitoreo[] = [];
  parametrosIniciales: ParametroMonitoreo[] = [];
  parametrosSeleccionados: ParametroMonitoreo[] = [];
  dataTableOtrosProfesional: TableRow[] = [];
  //dataTablaProfesionalesSeleccionados: TableRow[] = [];
  listaFrecuenciaMuestreo: IOption[] = [];
  listaFrecuenciaReporte: IOption[] = [];

  headersOtrosProfesionales: TableColumn[] = [
    //{ header: 'CÓDIGO', field: 'Codigo', hidden: true },
    { header: 'NOMBRE', field: 'Nombre', },
    { header: 'PROFESIÓN', field: 'Profesion', },
    { header: 'EMAIL', field: 'Email', },
    { header: 'COLEGIATURA', field: 'Colegiatura', },
    //{ header: 'SELECCIONAR', field: 'Seleccionar', },
  ];

  // headersProfesionalesSeleccionados: TableColumn[] = [
  //   { header: 'CÓDIGO', field: 'Codigo', hidden: true },
  //   { header: 'NOMBRE', field: 'Nombre', },
  //   { header: 'PROFESIÓN', field: 'Profesion', },
  //   { header: 'COLEGIATURA', field: 'Colegiatura', },
  //   { header: 'SELECCIONAR', field: 'Seleccionar', },
  // ];

  constructor(
    private builder: FormBuilder,
    private externoService: ExternoService,
    private funcionesMtcService: FuncionesMtcService
  ) { }

  ngOnInit(): void {
    this.buildForm();
    //this.comboTipoDocumento();
    this.getData();
    //this.getParametros();
    this.habilitarControles();
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
    }
  }
  //#endregion ViewOnly

  private buildForm(): void {
    this.form = this.builder.group({
      IdTipoDocumentoIdentidad: ['', Validators.required],
      NumeroDocumento: [null, Validators.required],
      Colegiatura: [null, Validators.required]
    });
  }

  // getParametros(): void {
  //   this.funcionesMtcService.mostrarCargando();
  //   this.externoService.getProfesionalesConsultora(this.idConsultora).pipe(
  //     map(response => {
  //       if (response.success) {
  //         this.profesional = response.data;
  //         const listaProfesionales = this.idsSeleccionados!=undefined ? this.profesional.filter(profesional => !this.idsSeleccionados.has(profesional.idProfesional)): this.profesional;
  //         this.CargarGrillaInicial(listaProfesionales);
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

  private getData(): void {
    if (this.data?.Consultora?.ProfesionalConsultora.length > 0) {
      this.idsSeleccionados = new Set(this.data?.Consultora?.ProfesionalConsultora.map(({ IdProfesional }) => IdProfesional));
    }

    this.comboTipoDocumento().subscribe(response => {
      this.tipoDocumento = response.map(param => ({ idDocumentoIdentidad: param.idDocumentoIdentidad, descripcion: param.descripcion }));
    });

  }

  // private CargarGrillaInicial(lista: ProfesionalesConsultoraResponse[]) {

  //   const tableParameters: TableRow[] = lista.map(parametro => ({
  //     Codigo: { text: parametro.idProfesional.toString() },
  //     Nombre: { text: parametro.nombre },
  //     Profesion: { text: parametro.profesion },
  //     Colegiatura: { text: parametro.nroColegiatura },
  //     Seleccionar: {
  //       buttonIcon: 'add',
  //       hasCursorPointer: true,
  //       onClick: (row: TableRow, column: TableColumn) => {
  //         const param = this.profesional.find(x => x.idProfesional === parseInt(row['Codigo'].text));
  //         this.idsSeleccionados.add(param.idProfesional);
  //         if(this.idsSeleccionados!=undefined)
  //           this.ActualizarGrillaSeleccionados(this.idsSeleccionados);
  //       }
  //     },
  //   }));


  //   this.dataTablaProfesionales = tableParameters;
  // }

  private comboTipoDocumento(): Observable<TipoDocumento[]> {
    this.funcionesMtcService.mostrarCargando();
    return this.externoService.getComboTipoDocumento().pipe(
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

  // private ActualizarGrillaSeleccionados(seleccionados: Set<number>) {
  //   const tableParameters: TableRow[] = this.profesional
  //     .filter(profesional => seleccionados.has(profesional.idProfesional)).map(parametro => ({
  //       Codigo: { text: parametro.idProfesional.toString() },
  //       Nombre: { text: parametro.nombre },
  //       Profesion: { text: parametro.profesion },
  //       Colegiatura: { text: parametro.nroColegiatura },
  //       Seleccionar: {
  //         buttonIcon: 'delete',
  //         hasCursorPointer: true,
  //         onClick: (row: TableRow, column: TableColumn) => {
  //           const param = this.profesional.find(x => x.idProfesional === parseInt(row['Codigo'].text));
  //           this.idsSeleccionados.delete(param.idProfesional);

  //         }
  //       },
  //     }));
  //     const listaProfesionales = this.idsSeleccionados!=undefined ? this.profesional.filter(profesional => !this.idsSeleccionados.has(profesional.idProfesional)): this.profesional;
  //     this.CargarGrillaInicial(listaProfesionales);
  //   this.dataTablaProfesionalesSeleccionados = tableParameters;
  // }



  save(form: FormGroup) {

    this.activeModal.close({ data: this.OtroProfesionalConsultora });

  }

  closeDialog() {
    this.activeModal.dismiss();
  }

  search(form: FormGroup) {
    const datos = form.value;

    this.funcionesMtcService.mostrarCargando();
    this.externoService.getOtroProfesionalesConsultora(null, datos.IdTipoDocumentoIdentidad, datos.NumeroDocumento, null, datos.Colegiatura).pipe(
      map(response => {
        if (response.success) {
          const data = response.data;
          this.ApellidoPaterno = data.apellidoPaterno;
          this.ApellidoMaterno = data.apellidoMaterno;
          this.Nombres = data.nombres;

          this.OtroProfesionalConsultora.ApellidoMaterno = this.ApellidoMaterno;
          this.OtroProfesionalConsultora.ApellidoPaterno = this.ApellidoPaterno;
          this.OtroProfesionalConsultora.Nombres = this.Nombres;
          this.OtroProfesionalConsultora.IdProfesional = response.data.idProfesional;
          this.OtroProfesionalConsultora.Colegiatura = response.data.colegiatura;
          this.OtroProfesionalConsultora.Profesion = response.data.formacion;
          this.OtroProfesionalConsultora.Email = response.data.email;

          const tableParameters: TableRow[] = [{
            Nombre: { text: data.nombres },
            Profesion: { text: data.formacion },
            Colegiatura: { text: data.colegiatura },
            //Selecciona
          }];
          this.dataTableOtrosProfesional = tableParameters;
        }
        this.funcionesMtcService.ocultarCargando();
      }),
      catchError(error => {
        this.funcionesMtcService.ocultarCargando();
        console.error('Error en la solicitud:', error);
        return [];
      })
    ).subscribe();
  }
}
