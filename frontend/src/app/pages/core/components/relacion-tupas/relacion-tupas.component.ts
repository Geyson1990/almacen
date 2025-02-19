import { Component, OnDestroy, OnInit } from '@angular/core';
import { PaginationModel } from 'src/app/core/models/Pagination';
import { SeguridadService } from 'src/app/core/services/seguridad.service';
import { RelacionTupasService } from 'src/app/core/services/servicios/relacion-tupas.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FuncionesMtcService } from '../../../../core/services/funciones-mtc.service';
import { TramiteService } from '../../../../core/services/tramite/tramite.service';
import { TipoSolicitudModel } from 'src/app/core/models/TipoSolicitudModel';
import { RequisitoModel } from 'src/app/core/models/Tramite/RequisitoModel';
import { ProcedimientoModel } from 'src/app/core/models/Tramite/ProcedimientoModel';
import { UnidadOrganicaModel } from 'src/app/core/models/Tramite/UnidadOrganicaModel';
import { DatosUsuarioLogin } from 'src/app/core/models/Autenticacion/DatosUsuarioLogin';
import { ApiResponse } from 'src/app/core/models/api-response';

@Component({
  selector: 'app-relacion-tupas',
  templateUrl: './relacion-tupas.component.html',
  styleUrls: ['./relacion-tupas.component.css'],
})
export class RelacionTupasComponent implements OnInit, OnDestroy {
  listaTupas = [];
  page = 1;
  pageSize = 50;
  tipoPersona: string;
  NDocumento: string;
  Nombres: string;
  NRazonSocial: string="";
  NRuc : string="";

  listadoTupasPrincipal = [];
  listadoTupasFiltrado = [];
  listadoTupasSize: number;
  closeResult = '';

  paramsSubscription: Subscription;
  idGrupo: number;

  filterText: string;

  listadoDetalleTupa: Array<RequisitoModel>;
  listadoDetalleTupaFilter: Array<RequisitoModel>;

  listadoTipoSolicitud: TipoSolicitudModel[];
  tipoSolicitudModel: string;
  tipoSolicitudSeleccionado: TipoSolicitudModel;
  procedimientoSeleccionado: ProcedimientoModel;

  unidadOrganica: UnidadOrganicaModel
  datosUsuarioLogin: DatosUsuarioLogin;

  constructor(
    private seguridadService: SeguridadService,
    private relacionTupaService: RelacionTupasService,
    private modalService: NgbModal,
    private router: Router,
    private route: ActivatedRoute,
    private funcionesMtcService: FuncionesMtcService,
    private tramiteService: TramiteService,
  ) {
    // this.tramiteService.getUnidadesOrganicas(this.seguridadService.getNameId())
    // .subscribe((response: Array<UnidadOrganicaModel>) => {
    //   console.log("response",response)
    //   const listadoUnidadesOrganicas = response
    //   this.unidadOrganica = listadoUnidadesOrganicas.find(x => x.id == this.idGrupo)
    // }, (error) => {
    //   this.funcionesMtcService.mensajeError('Ocurrio un problema al obtener los datos de la dependencia');
    // })
  }

  ngOnInit(): void {
    this.paramsSubscription = this.route.paramMap.subscribe((paramMap) => {
      const param = paramMap.get('idGrupo');
      if (param && !isNaN(Number(param))) {
        this.idGrupo = Number(param);
      }
      else {
        this.idGrupo = null;
      }

      
      this.cargarListadoTupa();
    });
  }


  ngOnDestroy(): void {
    if (this.paramsSubscription) { this.paramsSubscription.unsubscribe(); }
  }

  async openModal(content: any, item: ProcedimientoModel): Promise<void> {
    
    this.funcionesMtcService.mostrarCargando();
    try {
      this.procedimientoSeleccionado = item;
      this.listadoTipoSolicitud = [];
//       this.relacionTupaService.getRequisitosTupa(item.codigo).subscribe((response)=>{
           

//         // Agregamos SIN TIPO DE SOLICITUD solo si no cuenta con TIPOS DE SOLICITUD
//         if (this.listadoTipoSolicitud.length <= 0) {
//           const tipoSolicitud = new TipoSolicitudModel();
//           tipoSolicitud.codigostr = '';
//           tipoSolicitud.descripcion = 'SIN TIPO DE SOLICITUD';
//           tipoSolicitud.tipoEvaluacion = item.tipoEvaluacion;
//           tipoSolicitud.plazoAtencion = item.plazoDias;
//           this.listadoTipoSolicitud.unshift(tipoSolicitud);
//         }

//         for (const tipoSol of this.listadoTipoSolicitud) {
//           tipoSol.codigostr = tipoSol.codigo?.toString() ?? '';
//         }

//         this.tipoSolicitudSeleccionado = { ...this.listadoTipoSolicitud[0] };
//         this.tipoSolicitudModel = this.listadoTipoSolicitud[0].codigostr;
//         this.listadoDetalleTupa = [ ...response.data ];
//         this.listadoDetalleTupaFilter = [ ...this.listadoDetalleTupa.filter(r => !r.tipoSolicitud)];
// debugger;
//         this.modalService.open(content, {
//           size: 'xl',
//           ariaLabelledBy: 'modal-basic-title',
//         });
//       });
      // const tiposSolicitud = await this.relacionTupaService.getTiposSolicitud<Array<TipoSolicitudModel>>(item.id).toPromise();
      const requisitos = await this.relacionTupaService.getRequisitosTupa(item.codigo).toPromise();
      // console.log('tiposSolicitud: ', tiposSolicitud);
      console.log('requisitos: ', requisitos);

       this.listadoTipoSolicitud = [];

       for (const tipoSol of this.listadoTipoSolicitud) {
         tipoSol.codigostr = tipoSol.codigo?.toString() ?? '';
       }

       // Agregamos SIN TIPO DE SOLICITUD solo si no cuenta con TIPOS DE SOLICITUD
       if (this.listadoTipoSolicitud.length <= 0) {
         const tipoSolicitud = new TipoSolicitudModel();
         tipoSolicitud.codigostr = '';
         tipoSolicitud.descripcion = 'SIN TIPO DE SOLICITUD';
         tipoSolicitud.tipoEvaluacion = item.tipoEvaluacion ?? 'DETERMINADO';
         tipoSolicitud.plazoAtencion = parseInt(item.plazo);
         this.listadoTipoSolicitud.unshift(tipoSolicitud);
       }

       this.tipoSolicitudSeleccionado = this.listadoTipoSolicitud[0];
       this.tipoSolicitudModel = this.tipoSolicitudSeleccionado.codigostr;
       this.listadoDetalleTupa = requisitos.data;

       this.listadoDetalleTupaFilter = this.listadoDetalleTupa;//this.listadoDetalleTupa.filter(r => !r.tipoSolicitud);
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

  iniciarTramite(item: ProcedimientoModel): void {
    this.crearTramite(item);
  }

  private crearTramite(item: ProcedimientoModel): void {
    //debugger;
    // Método de obtener datos del TUPA
    localStorage.setItem('tupa-id-sector', item.idSector.toString());
    localStorage.setItem('tupa-codigo', item.codigo);
    localStorage.setItem('tupa-nombre', item.denominacion);
    localStorage.setItem('tupa-plazo', item.plazo.toString());
    localStorage.setItem('tupa-id', item.idTupa.toString());
    this.router.navigate(['/tramite-iniciar']);
  }

  traerDatos(): void {
    this.NDocumento = this.seguridadService.getNumDoc();
    this.Nombres = this.seguridadService.getUserName();
    this.datosUsuarioLogin = this.seguridadService.getDatosUsuarioLogin(); 

    if (this.seguridadService.getNameId() === '00001') {
      this.tipoPersona = 'PERSONA NATURAL';
    } else if (this.seguridadService.getNameId() === '00002') {
      this.tipoPersona = 'PERSONA JURÍDICA';
      this.NRazonSocial = this.datosUsuarioLogin.razonSocial;
      this.NRuc = this.datosUsuarioLogin.ruc;

    } else if (this.seguridadService.getNameId() === '00004') {
      this.tipoPersona = 'PERSONA EXTRANJERA';
    } else if (this.seguridadService.getNameId() === '00005') {
      this.tipoPersona = 'PERSONA NATURAL CON RUC';
    } else{
      this.tipoPersona = '-';
      //this.NDocumento = this.datosUsuarioLogin.ruc;
    }
  }

  async cargarListadoTupa(): Promise<void> {
    this.traerDatos();

    const tipoPersona = this.seguridadService.getNameId();
    if (this.idGrupo) {
      try {
        this.tramiteService.getTupasPorGrupo(this.idGrupo, tipoPersona).subscribe((response)=>{
          if(response.success) this.listadoTupasPrincipal = response.data;
          this.listadoTupasFiltrado = this.listadoTupasPrincipal;
          this.listadoTupasSize = this.listadoTupasPrincipal.length;
        });
      } catch (e) {
        this.funcionesMtcService.mensajeError('Error en el servicio de obtener listado de TUPAs por grupo');
      }
    }
    else {
      try {
        this.listadoTupasPrincipal = await this.tramiteService.getProcedimientos('', tipoPersona).toPromise();
        this.listadoTupasFiltrado = this.listadoTupasPrincipal;
        this.listadoTupasSize = this.listadoTupasPrincipal.length;
      } catch (e) {
        this.funcionesMtcService.mensajeError('Error en el servicio de obtener listado de TUPAs');
      }
    }

    // this.listadoTupasPrincipal = this.listadoTupasPrincipal.map((x) => {
    //   if(x.codigo == 'DGAT-025')
    //     x.nombre = x.nombre.replace(/EN CASO DE COMPARTICIÓN DE INFRAESTRUCTURA/gi, "<b>EN CASO DE COMPARTICIÓN DE INFRAESTRUCTURA</b>");
    //   if(x.codigo == 'DGAT-026')
    //     x.nombre = x.nombre.replace(/MODIFICACIÓN DE FRECUENCIA O CANAL/gi, "<b>MODIFICACIÓN DE FRECUENCIA O CANAL</b>");
    //   return x
    // });

    
  }

  refreshPagination(paginationModel: PaginationModel): void {
    this.page = paginationModel.page;
    this.pageSize = paginationModel.pageSize;
  }

  onChangeFilter(newValue: string): void {
    this.filterText = newValue;

    if (this.filterText) {
      this.listadoTupasFiltrado = this.listadoTupasPrincipal
        .filter(x => (x.codigo as string).trim().toUpperCase().includes(this.filterText.trim().toUpperCase()) 
        || x.denominacion.toUpperCase().normalize('NFD').replace(/([aeio])\u0301|(u)[\u0301\u0308]/gi,"$1$2")
        .normalize().includes(this.filterText.trim().toUpperCase().normalize('NFD').replace(/([aeio])\u0301|(u)[\u0301\u0308]/gi,"$1$2")
        .normalize())
        );
    }
    else {
      this.listadoTupasFiltrado = this.listadoTupasPrincipal;
    }
    this.listadoTupasSize = this.listadoTupasFiltrado.length;
  }

  onTipoSolicitudChange(value: any): void {
    if (value) {
      this.listadoDetalleTupaFilter = this.listadoDetalleTupa.filter(r => r.tipoSolicitud === value || !r.tipoSolicitud);
    } else {
      this.listadoDetalleTupaFilter = this.listadoDetalleTupa.filter(r => !r.tipoSolicitud);
    }
    this.tipoSolicitudSeleccionado = this.listadoTipoSolicitud.filter(r => r.codigostr === value)[0];
  }
}
