import { Component, Input, OnInit, inject, input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, catchError, map, of, throwError } from 'rxjs';
import { ParametroMonitoreo } from 'src/app/core/models/Externos/ParametroMonitoreo';
import { ProfesionalesConsultoraResponse } from 'src/app/core/models/Externos/ProfesionalesConsultora';
import { ComboGenerico } from 'src/app/core/models/Maestros/ComboGenerico';
import { FormularioSolicitudDIA, Insumos, Mineral, ParametrosPlanVigilancia, ProfesionalConsultora } from 'src/app/core/models/Tramite/FormularioSolicitudDIA';
import { ApiResponse } from 'src/app/core/models/api-response';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { ExternoService } from 'src/app/core/services/servicios/externo.service';
import { CONSTANTES } from 'src/app/enums/constants';
import { IOption, ISelectCell, TableColumn, TableRow } from 'src/app/shared/components/table/interfaces/table.interface';
import { isDebuggerStatement, visitParameterList } from 'typescript';

@Component({
  selector: 'app-profesionales-consultora',
  templateUrl: './profesionales-consultora.component.html',
  styleUrl: './profesionales-consultora.component.scss'
})
export class ProfesionalesConsultoraComponent implements OnInit {
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

  dataTablaProfesionales: TableRow[] = [];
  dataTablaProfesionalesSeleccionados: TableRow[] = [];
  listaFrecuenciaMuestreo: IOption[] = [];
  listaFrecuenciaReporte: IOption[] = [];
  headersProfesionales: TableColumn[] = [];
  headersProfesionalesSeleccionados: TableColumn[] = [];  

  constructor(
    private builder: FormBuilder,
    private externoService: ExternoService,
    private funcionesMtcService: FuncionesMtcService
  ) { }

  ngOnInit(): void {
    this.buildForm();
    this.loadTableHeaders();
    this.getParametros();
    this.construccionListas();
    this.habilitarControles();
  }

  private loadTableHeaders() {
    this.headersProfesionales = [
      { header: 'CÓDIGO', field: 'Codigo', hidden: true },
      { header: 'NOMBRE', field: 'Nombre', },
      { header: 'PROFESIÓN', field: 'Profesion', },
      { header: 'COLEGIATURA', field: 'Colegiatura', },
      { header: 'SELECCIONAR', field: 'Seleccionar', hidden: this.modoVisualizacion },
    ];
  
    this.headersProfesionalesSeleccionados = [
      { header: 'CÓDIGO', field: 'Codigo', hidden: true },
      { header: 'NOMBRE', field: 'Nombre', },
      { header: 'PROFESIÓN', field: 'Profesion', },
      { header: 'COLEGIATURA', field: 'Colegiatura', },
      { header: 'SELECCIONAR', field: 'Seleccionar', hidden: this.modoVisualizacion },
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
     }
   }
   //#endregion ViewOnly


  private buildForm(): void {
    this.form = this.builder.group({});
  }

  getParametros(): void {
    this.funcionesMtcService.mostrarCargando();
    this.externoService.getProfesionalesConsultora(this.idConsultora).pipe(
      map(response => {
        if (response.success) {
          this.profesional = response.data;
          this.getData();
          const listaProfesionales = this.idsSeleccionados !== undefined ? this.profesional.filter(profesional => !this.idsSeleccionados.has(profesional.idProfesional)) : this.profesional;
          this.CargarGrillaInicial(listaProfesionales);
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

  private getData(): void {
    if (this.data?.Consultora?.ProfesionalConsultora.length > 0) {
      //debugger;
      this.idsSeleccionados = new Set(this.data?.Consultora?.ProfesionalConsultora.map(({ IdProfesional }) => IdProfesional));
      this.ActualizarGrillaSeleccionados(this.idsSeleccionados);
    }

  }

  private CargarGrillaInicial(lista: ProfesionalesConsultoraResponse[]) {

    const tableParameters: TableRow[] = lista.map(parametro => ({
      Codigo: { text: parametro.idProfesional.toString() },
      Nombre: { text: `${parametro.nombre} ${parametro.apellido}`},
      Profesion: { text: parametro.profesion },
      Colegiatura: { text: parametro.nroColegiatura },
      Seleccionar: {
        buttonIcon: 'add',
        hasCursorPointer: true,
        onClick: (row: TableRow, column: TableColumn) => {
          const param = this.profesional.find(x => x.idProfesional === parseInt(row['Codigo'].text));
          this.idsSeleccionados.add(param.idProfesional);
          if (this.idsSeleccionados != undefined)
            this.ActualizarGrillaSeleccionados(this.idsSeleccionados);
        }
      },
    }));


    this.dataTablaProfesionales = tableParameters;
  }

  private comboGenerico(tipo: string): Observable<ComboGenerico[]> {
    this.funcionesMtcService.mostrarCargando();
    return this.externoService.getComboGenerico(tipo).pipe(
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

  private ActualizarGrillaSeleccionados(seleccionados: Set<number>) {
    const tableParameters: TableRow[] = this.profesional
      .filter(profesional => seleccionados.has(profesional.idProfesional)).map(parametro => ({
        Codigo: { text: parametro.idProfesional.toString() },
        Nombre: { text: `${parametro.nombre} ${parametro.apellido}`},  
        Profesion: { text: parametro.profesion },
        Colegiatura: { text: parametro.nroColegiatura },
        Seleccionar: {
          buttonIcon: 'delete',
          hasCursorPointer: true,
          onClick: (row: TableRow, column: TableColumn) => {
            const param = this.profesional.find(x => x.idProfesional === parseInt(row['Codigo'].text));

            this.idsSeleccionados.delete(param.idProfesional);       

            const listaProfesionales = this.idsSeleccionados != undefined ? this.profesional.filter(profesional => !this.idsSeleccionados.has(profesional.idProfesional)) : this.profesional;
            this.CargarGrillaInicial(listaProfesionales);
            this.dataTablaProfesionalesSeleccionados = tableParameters;
            if (this.idsSeleccionados != undefined)
              this.ActualizarGrillaSeleccionados(this.idsSeleccionados);
          }
        },
      }));
    const listaProfesionales = this.idsSeleccionados != undefined ? this.profesional.filter(profesional => !this.idsSeleccionados.has(profesional.idProfesional)) : this.profesional;
    this.CargarGrillaInicial(listaProfesionales);
    this.dataTablaProfesionalesSeleccionados = tableParameters;
  }

  private construccionListas(): void {
    this.comboGenerico(CONSTANTES.ComboGenericoFTAW.FrecuenciaMonitoreo).subscribe(response => {
      this.listaFrecuenciaMuestreo = response.map(param => ({ value: param.codigo.toString(), label: param.descripcion }));
    });

    this.comboGenerico(CONSTANTES.ComboGenericoFTAW.FrecuenciaReporte).subscribe(response => {
      this.listaFrecuenciaReporte = response.map(param => ({ value: param.codigo.toString(), label: param.descripcion }));
    });
  }

  saveX(form: FormGroup) {
    let mensaje = 'Debe seleccionar los Profesionales que Realizaron el Estudio.'

    if (this.idsSeleccionados === undefined) {
      this.funcionesMtcService.mensajeInfo(mensaje);
      return;
    }

    const data: ProfesionalConsultora[] = this.profesional.filter(profesional => this.idsSeleccionados.has(profesional.idProfesional)).map(x => ({
      IdProfesional: x.idProfesional,
      Apellidos: x.apellido,
      Nombres: x.nombre,
      Colegiatura: x.nroColegiatura,
      Profesion: x.profesion
    }));

    this.activeModal.close({ data: data });

  }

  closeDialog() {
    this.activeModal.dismiss();
  }
}
