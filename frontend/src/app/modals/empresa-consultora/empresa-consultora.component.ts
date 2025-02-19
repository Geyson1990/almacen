import { Component, Input, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, catchError, map, of, throwError } from 'rxjs';
import { EmpresaConsultoraResponse } from 'src/app/core/models/Externos/EmpresaConsultora';
import { ParametroMonitoreo } from 'src/app/core/models/Externos/ParametroMonitoreo';
import { ComboGenerico } from 'src/app/core/models/Maestros/ComboGenerico';
import { EmpresaConsultora, FormularioSolicitudDIA, Insumos, Mineral, ParametrosPlanVigilancia } from 'src/app/core/models/Tramite/FormularioSolicitudDIA';
import { ApiResponse } from 'src/app/core/models/api-response';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { ExternoService } from 'src/app/core/services/servicios/externo.service';
import { CONSTANTES } from 'src/app/enums/constants';
import { IOption, ISelectCell, TableColumn, TableRow } from 'src/app/shared/components/table/interfaces/table.interface';
import { visitParameterList } from 'typescript';

@Component({
  selector: 'app-empresa-consultora',
  templateUrl: './empresa-consultora.component.html',
  styleUrl: './empresa-consultora.component.scss'
})
export class EmpresaConsultoraComponent implements OnInit {
  form: FormGroup;
  activeModal = inject(NgbActiveModal);
  @Input() title!: string;
  @Input() codMaeSolicitud: number;
  @Input() idCliente: number;
  @Input() idEstudio: number;
  @Input() modoVisualizacion: boolean;
  dataTable: any = [];
  empresas: EmpresaConsultoraResponse[] = [];
  headersTable: TableColumn[] = [];
 

  constructor(
    private builder: FormBuilder,
    private externoService: ExternoService,
    private funcionesMtcService: FuncionesMtcService
  ) { }

  ngOnInit(): void {
    this.buildForm();
    this.loadTableHeaders();
    this.habilitarControles();
  }

  private loadTableHeaders() {
    this.headersTable = [
      { header: 'CÓDIGO', field: 'Codigo', hidden: true },
      { header: 'NOMBRE', field: 'Nombre', },
      { header: 'RUC', field: 'Ruc', },
      { header: 'SELECCIONAR', field: 'Seleccionar', hidden: this.modoVisualizacion},
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
    this.form = this.builder.group({
      Nombre: [null, Validators.required],
      NombreComercial: [null, Validators.required],
      Ruc: [null, Validators.required]
    });
  }

  buscarConsultora(event: any) {
    const form = this.form.value;
    this.getEmpresaConsultora(form.Nombre, form.Ruc, form.NombreComercial);

  }

  save(form: FormGroup) {
    // const tableParameters: TableRow[] = this.parametrosSeleccionados.map(parametro => ({
    //   Codigo: { text: parametro.idParametro.toString() },
    //   Parametro: { text: parametro.descripcion },
    //   FrecuenciaMuestreo: { hasSelect: true, select: { options: this.listaFrecuenciaMuestreo } },
    //   FrecuenciaReporte: { hasSelect: true, select: { options: this.listaFrecuenciaReporte } }
    // }));



  }

  getEmpresaConsultora(nombre?: string, ruc?: string, nombreComercial?: string): void {
    this.funcionesMtcService.mostrarCargando();
    this.externoService.getEmpresaConsultora(nombre, ruc, nombreComercial).pipe(
      map(response => {
        if (response.success) {
          this.empresas = [];
          this.dataTable = [];
          this.empresas = response.data;
          this.empresas.forEach(element => this.gridTableConsultora(element));
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

  private gridTableConsultora(data: EmpresaConsultoraResponse) {
    const fila: TableRow = {
      Codigo: { text: data.idCliente.toString() },
      Nombre: { text: data.nombre },
      Ruc: { text: data.ruc },
      Seleccionar: {
        buttonIcon: 'add',
        hasCursorPointer: true,
        onClick: (row: TableRow, column: TableColumn) => {
          const seleccionado = this.empresas
            .filter(x => x.idCliente === parseInt(row.Codigo.text))
            .map(suscrito => ({
              IdCliente: suscrito.idCliente,
              Nombre: suscrito.nombre,
              Ruc: suscrito.ruc
            } as EmpresaConsultora))[0];

          this.activeModal.close({ data: seleccionado });
        }
      },
    }
    this.dataTable.push(fila);
  }

  closeDialog() {
    this.activeModal.dismiss();
  }
}
