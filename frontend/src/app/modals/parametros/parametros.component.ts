import { Component, Input, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, catchError, map, of, throwError } from 'rxjs';
import { ParametroMonitoreo } from 'src/app/core/models/Externos/ParametroMonitoreo';
import { ComboGenerico } from 'src/app/core/models/Maestros/ComboGenerico';
import { FormularioSolicitudDIA, Insumos, Mineral, ParametrosPlanVigilancia } from 'src/app/core/models/Tramite/FormularioSolicitudDIA';
import { ApiResponse } from 'src/app/core/models/api-response';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { ExternoService } from 'src/app/core/services/servicios/externo.service';
import { CONSTANTES } from 'src/app/enums/constants';
import { IOption, ISelectCell, TableColumn, TableRow } from 'src/app/shared/components/table/interfaces/table.interface';
import { visitParameterList } from 'typescript';

@Component({
  selector: 'app-parametros',
  templateUrl: './parametros.component.html',
  styleUrl: './parametros.component.scss'
})
export class ParametrosComponent implements OnInit {
  form: FormGroup;
  activeModal = inject(NgbActiveModal);
  @Input() title!: string;
  @Input() data: FormularioSolicitudDIA;
  @Input() tipoMuestra: number;
  @Input() edicion: ParametrosPlanVigilancia[];
  @Input() modoVisualizacion: boolean;
  parametros: ParametroMonitoreo[] = [];
  parametrosIniciales: ParametroMonitoreo[] = [];
  parametrosSeleccionados: ParametroMonitoreo[] = [];
  dataTablaParametros: TableRow[] = [];
  dataTablaParametrosSeleccionados: TableRow[] = [];
  listaFrecuenciaMuestreo: IOption[] = [];
  listaFrecuenciaReporte: IOption[] = [];
  headersParameters: TableColumn[] = [];
  headersParametersSeleccionados: TableColumn[] = [];

  constructor(
    private builder: FormBuilder,
    private externoService: ExternoService,
    private funcionesMtcService: FuncionesMtcService
  ) { }

  ngOnInit(): void {
    this.buildForm();
    this.getParametros();
    this.construccionListas();
    this.habilitarControles();
    this.loadTableHeaders();
  }

  private loadTableHeaders() {
    this.headersParameters = [
      { header: 'CÓDIGO', field: 'Codigo', hidden: true },
      { header: 'PARÁMETROS', field: 'Parametro', },
      { header: 'SELECCIONAR', field: 'Seleccionar', hidden: this.modoVisualizacion},
    ];
  
    this.headersParametersSeleccionados = [
      { header: 'CÓDIGO', field: 'Codigo', hidden: true },
      { header: 'PARÁMETROS', field: 'Parametro', },
      { header: 'ACCION', field: 'Seleccionar',  hidden: this.modoVisualizacion},
    ];
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
    }
  }

  private buildForm(): void {
    this.form = this.builder.group({});
  }

  getParametros(): void {
    this.funcionesMtcService.mostrarCargando();
    this.externoService.getParametrosMonitoreo(this.tipoMuestra).pipe(
      map(response => {        
        if (response.success) {
          this.parametros = response.data;
          this.parametrosIniciales = response.data;
          this.parametrosIniciales.forEach(param => this.CargarGrillaInicial(param));
          this.getData();
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
    if (this.edicion.length > 0) {
      const selIds = new Set(this.edicion.map(({ CodigoParametro }) => parseInt(CodigoParametro, 10)));
      this.parametrosIniciales = this.parametros.filter(parametro => !selIds.has(parametro.idParametro));
      this.parametrosSeleccionados = this.parametros.filter(parametro => selIds.has(parametro.idParametro));
      this.parametrosIniciales.forEach(param=>this.CargarGrillaInicial(param));
      this.parametrosSeleccionados.forEach(param => this.ActualizarGrillaSeleccionados(param));
    }
  } 

  private CargarGrillaInicial(parametro: ParametroMonitoreo) {
    const fila: TableRow = {
      Codigo: { text: parametro.idParametro.toString() },
      Parametro: { text: parametro.descripcion },
      Seleccionar: {
        buttonIcon: 'add',
        hasCursorPointer: true,
        onClick: (row: TableRow, column: TableColumn) => {
          const param: ParametroMonitoreo = this.parametros.find(x => x.idParametro === parseInt(row['Codigo'].text));
          this.parametrosSeleccionados.push(param);
          this.parametrosIniciales = this.parametrosIniciales.filter(x => x.idParametro !== param.idParametro);
          this.ActualizarGrillaSeleccionados(param);
          this.dataTablaParametros = this.dataTablaParametros.filter(x => x.Codigo.text !== param.idParametro.toString());
        }
      },
    }
    this.dataTablaParametros.push(fila);
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
  
  private ActualizarGrillaSeleccionados(param: any) {
    const nuevaFila: TableRow = {
      Codigo: { text: param.idParametro.toString() },
      Parametro: { text: param.descripcion },
      Seleccionar: {
        buttonIcon: 'remove',
        hasCursorPointer: true,
        onClick: (row: TableRow, column: TableColumn) => {
          const filaBorrada = this.parametros.find(x => x.idParametro === parseInt(row['Codigo'].text));
          this.parametrosSeleccionados = this.parametrosSeleccionados.filter(x => x.idParametro !== filaBorrada.idParametro);
          this.dataTablaParametrosSeleccionados = this.dataTablaParametrosSeleccionados.filter(x => x.Codigo.text !== filaBorrada.idParametro.toString());
          this.CargarGrillaInicial(filaBorrada);
          this.dataTablaParametros = this.dataTablaParametros.sort((a, b) => a.Parametro.text.localeCompare(b.Parametro.text, undefined, { sensitivity: 'base' }));
        }
      },
    }

    this.dataTablaParametrosSeleccionados.push(nuevaFila);

  }

  private construccionListas(): void {
    this.comboGenerico(CONSTANTES.ComboGenericoFTAW.FrecuenciaMonitoreo).subscribe(response => {
      this.listaFrecuenciaMuestreo = response.map(param => ({ value: param.codigo.toString(), label: param.descripcion }));
      this.listaFrecuenciaMuestreo.unshift({ value: '0', label: '--SELECCIONE--' });     
    });

    this.comboGenerico(CONSTANTES.ComboGenericoFTAW.FrecuenciaReporte).subscribe(response => {
      this.listaFrecuenciaReporte = response.map(param => ({ value: param.codigo.toString(), label: param.descripcion }));
      this.listaFrecuenciaReporte.unshift({ value: '0', label: '--SELECCIONE--' });
    });
  }

  save(form: FormGroup) {
    const tableParameters: TableRow[] = this.parametrosSeleccionados.map(parametro => ({
      Codigo: { text: parametro.idParametro.toString() },
      Parametro: { text: parametro.descripcion },
      FrecuenciaMuestreo: { hasSelect: true, select: { options: this.listaFrecuenciaMuestreo},selectedValue : '0'},
      FrecuenciaReporte: { hasSelect: true, select: { options: this.listaFrecuenciaReporte} , selectedValue: '0'}
    }));

    this.activeModal.close({ data: this.parametrosSeleccionados, row: tableParameters });

  }

  closeDialog() {
    this.activeModal.dismiss();
  }
}
