import { Component, OnInit } from '@angular/core';
import { UnidadOrganicaModel } from 'src/app/core/models/Tramite/UnidadOrganicaModel';
import { SeguridadService } from 'src/app/core/services/seguridad.service';
import { TramiteService } from 'src/app/core/services/tramite/tramite.service';
import { ProcedimientoModel } from '../../../../core/models/Tramite/ProcedimientoModel';
import { TipoPersona } from '../../../../core/models/Formularios/Formulario002_a12/Secciones';
import { FuncionesMtcService } from '../../../../core/services/funciones-mtc.service';
import { Router } from '@angular/router';
import { RelacionTupasService } from 'src/app/core/services/servicios/relacion-tupas.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RequisitoModel } from 'src/app/core/models/Tramite/RequisitoModel';
import { PaginationModel } from 'src/app/core/models/Pagination';
import { TipoSolicitudModel } from 'src/app/core/models/TipoSolicitudModel';
import { SectorModel } from 'src/app/core/models/Tramite/SectorModel';
import { ApiResponse } from 'src/app/core/models/api-response';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {

  txtBuscarTupa = '';
  mostrarUO = true;

  listadoUnidadesOrganicas: Array<UnidadOrganicaModel>;
  listadoSectores: Array<SectorModel>;

  listadoProcedimientos: Array<ProcedimientoModel>;
  listadoProcedimientosFilter: Array<ProcedimientoModel>;

  listadoDetalleTupa: Array<RequisitoModel>;
  listadoDetalleTupaFilter: Array<RequisitoModel>;

  listadoTipoSolicitud: Array<TipoSolicitudModel>;
  tipoSolicitudModel: string;
  tipoSolicitudSeleccionado: TipoSolicitudModel;
  procedimientoSeleccionado: ProcedimientoModel;

  // listadoProcedimientosPaging: Array<ProcedimientoModel>;

  listSize = 1;
  page = 1;
  pageSize = 50;

  constructor(
    private seguridadService: SeguridadService,
    private tramiteService: TramiteService,
    private funcionesMtcService: FuncionesMtcService,
    private relacionTupasService: RelacionTupasService,
    private modalService: NgbModal,
    private router: Router,
  ) { }

  async ngOnInit(): Promise<void> {
    this.funcionesMtcService.mostrarCargando();
    //await this.poblarUnidadesOrganicas();
    await this.poblarSectores();
    //await this.poblarProcedimientos();
    this.funcionesMtcService.ocultarCargando();
  }

  async poblarUnidadesOrganicas(): Promise<void> {
    try {
      const tipoPersona = this.seguridadService.getNameId();
      this.listadoUnidadesOrganicas = await this.tramiteService.getUnidadesOrganicas(tipoPersona).toPromise();
    } catch (e) {
      this.funcionesMtcService.mensajeError('Error en el servicio de obtener las unidades orgánicas');
    }
  }

  async poblarSectores(): Promise<void> {
    try {
      await this.tramiteService.getSectores().subscribe(res => {
				if (res.success) this.listadoSectores = res.data;
			});

    } catch (e) {
      this.funcionesMtcService.mensajeError('Error en el servicio de obtener las unidades orgánicas');
    }
  }

  async poblarProcedimientos(): Promise<void> {
    const tipoPersona = this.seguridadService.getNameId();
    this.tramiteService.getProcedimientos('', tipoPersona).subscribe((response) => {
      this.listadoProcedimientos = response.map((x) => {
        if (x.codigo === 'DGAT-025') {
          x.nombre = x.nombre.replace(/EN CASO DE COMPARTICIÓN DE INFRAESTRUCTURA/gi, '<b>EN CASO DE COMPARTICIÓN DE INFRAESTRUCTURA</b>');
        }
        if (x.codigo === 'DGAT-026') {
          x.nombre = x.nombre.replace(/MODIFICACIÓN DE FRECUENCIA O CANAL/gi, '<b>MODIFICACIÓN DE FRECUENCIA O CANAL</b>');
        }
        return x;
      });
      this.listSize = this.listadoProcedimientos.length;
    }, error => {
      this.funcionesMtcService.mensajeError('Error en el servicio de obtener los procedimientos');
    });

  }

  onChangeBuscarTupa(value: string): void {
    if (value) {
      this.txtBuscarTupa = value.toUpperCase();
    }
    else {
      this.txtBuscarTupa = '';
    }

    if (this.txtBuscarTupa && this.txtBuscarTupa.trim().length > 0) {
      this.mostrarUO = false;
      this.listadoProcedimientosFilter = this.listadoProcedimientos
        .filter(x =>
          x.nombre.toUpperCase().includes(this.txtBuscarTupa.trim().toUpperCase())
          || x.codigo.toUpperCase().includes(this.txtBuscarTupa.trim().toUpperCase()));
      this.listSize = this.listadoProcedimientosFilter.length;
    } else {
      this.mostrarUO = true;
      this.listadoProcedimientosFilter = this.listadoProcedimientos;
      this.listSize = this.listadoProcedimientos.length;
    }
  }

  redirecToServices(serviceId: number): void {
    if (serviceId === 1) {
      return;
    }
    if (serviceId === 2) {
      return;
    }
    if (serviceId === 3) {
      window.location.href = 'https://licencias-tramite.mtc.gob.pe/';/*'https://licencias.mtc.gob.pe/';*/
    }
    if (serviceId === 4) {
      window.location.href = 'http://tlicenciasdgac.mtc.gob.pe/';
    }
    if (serviceId === 5) {
      window.location.href = 'https://www.vuce.gob.pe/vuce/index.jsp';
    }
    if (serviceId === 6) {
      return;
    }

    return;
  }

  redirecToTupas(item: UnidadOrganicaModel): void {
    this.router.navigate(['/relacion-tupas', item.id]);
  }

  iniciarTramite(item: ProcedimientoModel): void {
    if (item.codigo === 'DGAT-011') {
      this.funcionesMtcService
        .mensajeWarnConfirmar(`Si presenta su solicitud de renovación antes de los 6 meses del vencimiento de su autorización,
         su solicitud será considerada como no presentada de conformidad al artículo 68º del Reglamento de la Ley de Radio y
         Televisión. Le sugerimos verifique la fecha de vencimiento de su autorización antes de presentar su solicitud`)
        .then(() => {
          this.crearTramite(item);
        });
    }
    else {
      this.crearTramite(item);
    }
  }

  private crearTramite(item: ProcedimientoModel): void {
    // Método de obtener datos del TUPA
    //debugger;
    localStorage.setItem('tupa-id-sector', item.id.toString());
    localStorage.setItem('tupa-codigo', item.codigo);
    localStorage.setItem('tupa-nombre', item.nombre);
    localStorage.setItem('tupa-plazo', item.plazoDias.toString());

    this.router.navigate(['/tramite-iniciar']);
  }

  async openModal(content: any, item: ProcedimientoModel): Promise<void> {
    this.funcionesMtcService.mostrarCargando();
    try {
      this.procedimientoSeleccionado = item;
      const tiposSolicitud = await this.relacionTupasService.getTiposSolicitud<Array<TipoSolicitudModel>>(item.id).toPromise();
      const requisitos = await this.relacionTupasService.getDetalleTupa<Array<RequisitoModel>>(item.id).toPromise();
      console.log('tiposSolicitud: ', tiposSolicitud);
      console.log('requisitos: ', requisitos);

      this.listadoTipoSolicitud = tiposSolicitud ?? [];

      for (const tipoSol of this.listadoTipoSolicitud) {
        tipoSol.codigostr = tipoSol.codigo?.toString() ?? '';

        if (!tipoSol.tipoEvaluacion) {
          tipoSol.tipoEvaluacion = item.tipoEvaluacion;
          tipoSol.plazoAtencion = item.plazoDias;
        }
      }

      // Agregamos SIN TIPO DE SOLICITUD solo si no cuenta con TIPOS DE SOLICITUD
      if (this.listadoTipoSolicitud.length <= 0) {
        const tipoSolicitud = new TipoSolicitudModel();
        tipoSolicitud.codigostr = '';
        tipoSolicitud.descripcion = 'SIN TIPO DE SOLICITUD';
        tipoSolicitud.tipoEvaluacion = item.tipoEvaluacion;
        tipoSolicitud.plazoAtencion = item.plazoDias;
        this.listadoTipoSolicitud.unshift(tipoSolicitud);
      }

      this.tipoSolicitudSeleccionado = this.listadoTipoSolicitud[0];
      this.tipoSolicitudModel = this.tipoSolicitudSeleccionado.codigostr;
      this.listadoDetalleTupa = requisitos;
      this.listadoDetalleTupaFilter = this.listadoDetalleTupa.filter(r => r.tipoSolicitud === this.tipoSolicitudModel || !r.tipoSolicitud);
      this.calcularOrden();

      this.modalService.open(content, {
        size: 'xl',
        ariaLabelledBy: 'modal-basic-title',
      });
    } catch (error) {
      console.log(error);
      this.funcionesMtcService.mensajeError('Ocurrio un problema al obtener el listado de requisitos.');
    } finally {
      this.funcionesMtcService.ocultarCargando();
    }
  }

  calcularOrden(): void {
    let nuevoOrden = 0;
    for (const requisito of this.listadoDetalleTupaFilter) {
      const { auxOrden: orden } = requisito;
      if (nuevoOrden !== orden) {
        nuevoOrden = orden;
        requisito.ordenTxt = orden.toString();
      }
      else {
        requisito.ordenTxt = '';
      }
    }
  }

  onTipoSolicitudChange(value: string): void {
    if (value) {
      this.listadoDetalleTupaFilter = this.listadoDetalleTupa.filter(r => r.tipoSolicitud === value || !r.tipoSolicitud);
    } else {
      this.listadoDetalleTupaFilter = this.listadoDetalleTupa.filter(r => !r.tipoSolicitud);
    }
    this.calcularOrden();
    this.tipoSolicitudSeleccionado = this.listadoTipoSolicitud.filter(r => r.codigostr === value)[0];
  }

  refreshPagination(paginationModel: PaginationModel): void {
    this.page = paginationModel.page;
    this.pageSize = paginationModel.pageSize;
  }
}
