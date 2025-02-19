import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { PaginationModel } from 'src/app/core/models/Pagination';
import { SeguridadService } from 'src/app/core/services/seguridad.service';
import { TramiteService } from 'src/app/core/services/tramite/tramite.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { GenerarTramiteRequestModel, TramiteRequestModel } from 'src/app/core/models/Tramite/TramiteRequest';
import { TipoSolicitudModel } from '../../../../core/models/TipoSolicitudModel';
import { CONSTANTES } from 'src/app/enums/constants';
import { TupaModel } from 'src/app/core/models/Tramite/TupaModel';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { DatosUsuarioLogin } from 'src/app/core/models/Autenticacion/DatosUsuarioLogin';
import { ApiResponse } from 'src/app/core/models/api-response';
import { ExternoService } from 'src/app/core/services/servicios/externo.service';
import { GenerarEstudio } from 'src/app/core/models/Externos/Estudio';
import { GlobalService } from 'src/app/core/services/mapas/global.service';

@Component({
  selector: 'app-tramite-iniciar',
  templateUrl: './tramite-iniciar.component.html',
  styleUrls: ['./tramite-iniciar.component.css'],
})
export class TramiteIniciarComponent implements OnInit {
  listaTupas = [];
  page = 1;
  pageSize = 5;
  nombreTipoPersona: string;
  tipoPersona: string;
  nombreTipoDocumento = '';
  NDocumento: string;
  Nombres: string;
  tipoNombres: string;

  tupa: TupaModel;
  TupaId: number;
  TupaCodigo: string;
  TupaNombre: string;
  TupaPlazo: string;
  TupaTipoEvaluacion: string;
  TupaOrganizacion: string;
  listadoTipoSolicitud: TipoSolicitudModel[] = [];
  tipoSolicitudSeleccionado: any;

  listadoTupas = [];
  listadoTupasPrincipal = [];
  listadoTupasSize: any;
  listadoDetalleTupa = [];
  closeResult = '';

  datosUsuarioLogin: DatosUsuarioLogin;
  constructor(
    private funcionesMtcService: FuncionesMtcService,
    private seguridadService: SeguridadService,
    private tramiteService: TramiteService,
    private modalService: NgbModal,
    private router: Router,
    private route: ActivatedRoute,
    private externoService: ExternoService,
    private globalService: GlobalService
  ) {
    // this.refreshCountries({ page: this.page, pageSize: this.pageSize } as PaginationModel);
  }

  ngOnInit(): void {
    this.funcionesMtcService.mostrarCargando();
    this.traerDatos();
    this.funcionesMtcService.ocultarCargando();
  }

  onSelectTipoSolicitud(value: any): void {
    if (value) {
      if (this.listadoTipoSolicitud) {
        for (const tipoSolicitud of this.listadoTipoSolicitud) {
          if (tipoSolicitud.codigo === value) {
            if (tipoSolicitud.tipoEvaluacion) {
              this.TupaPlazo =
                tipoSolicitud.plazoAtencion === 0
                  ? 'DETERMINADO'
                  : tipoSolicitud.plazoAtencion + ' DÍAS HÁBILES';
              this.TupaTipoEvaluacion =
                tipoSolicitud.tipoEvaluacion ?? 'DETERMINADO';
            } else {
              this.TupaPlazo =
                this.tupa.plazoDias === 0
                  ? 'DETERMINADO'
                  : this.tupa.plazoDias + ' DÍAS HÁBILES';
              this.TupaTipoEvaluacion =
                this.tupa.tipoEvaluacion ?? 'DETERMINADO';
            }
          }
        }
      }
    }
  }

  traerDatos(): void {
    //debugger;
    this.TupaCodigo = localStorage.getItem('tupa-codigo');

    this.datosUsuarioLogin = this.seguridadService.getDatosUsuarioLogin(); // Datos personales del usuario

    this.tramiteService.getTupaByCode(this.TupaCodigo.trim()).subscribe((resp: ApiResponse<TupaModel>) => {

      this.tupa = resp.data;
      localStorage.setItem('tramite-selected', JSON.stringify(this.tupa));
      this.TupaId = this.tupa.idTupa;
      this.TupaCodigo = this.tupa.codigo;
      this.TupaNombre = this.tupa.denominacion;
      this.TupaPlazo =
        this.tupa.plazo === 0
          ? 'DETERMINADO'
          : this.tupa.plazo + ' DÍAS HÁBILES';
      this.TupaTipoEvaluacion = this.tupa.tipoEvaluacion ?? 'DETERMINADO';
      this.TupaOrganizacion = this.tupa.dirLinea;
      this.listadoTipoSolicitud = this.tupa.tipoSolicitud?.sort((a, b) =>
        Number(a.codigo) < Number(b.codigo) ? -1 : 1
      );
      if (this.listadoTipoSolicitud != null) {
        this.tipoSolicitudSeleccionado = this.listadoTipoSolicitud[0].codigo;

        if (this.listadoTipoSolicitud[0].tipoEvaluacion) {
          const plazoAtencion = this.listadoTipoSolicitud[0].plazoAtencion ?? 0;
          this.TupaPlazo =
            plazoAtencion === 0
              ? 'DETERMINADO'
              : plazoAtencion + ' DÍAS HÁBILES';
          this.TupaTipoEvaluacion =
            this.listadoTipoSolicitud[0].tipoEvaluacion ?? 'DETERMINADO';//**Geyson Corregir */
        }
      }
    });

    this.Nombres = this.seguridadService.getUserName();
    // this.NDocumento = this.seguridadService.getNumDoc();
    this.tipoPersona = this.seguridadService.getNameId();

    if (
      this.seguridadService.getNameId() ===
      CONSTANTES.CodTabTipoPersona.PERSONA_NATURAL
    ) {
      this.nombreTipoPersona = 'PERSONA NATURAL';
      this.tipoNombres = 'Nombres y Apellidos';
      this.nombreTipoDocumento = 'D.N.I.';
      this.NDocumento = this.seguridadService.getNumDoc();
    } else if (
      this.seguridadService.getNameId() ===
      CONSTANTES.CodTabTipoPersona.PERSONA_JURIDICA
    ) {
      this.nombreTipoPersona = 'PERSONA JURÍDICA';
      this.tipoNombres = 'Razón Social';
      this.nombreTipoDocumento = 'R.U.C.';
      this.NDocumento = this.seguridadService.getCompanyCode();
      this.Nombres = this.datosUsuarioLogin.razonSocial;
    } else if (
      this.seguridadService.getNameId() ===
      CONSTANTES.CodTabTipoPersona.PERSONA_EXTRANJERA
    ) {
      this.nombreTipoPersona = 'PERSONA EXTRANJERA';
      this.tipoNombres = 'Nombres y Apellidos';

      switch (this.seguridadService.getTipoDocumento()) {
        case CONSTANTES.TipoDocPersonaExtranjera.CARNET_EXTRANJERIA:
          this.nombreTipoDocumento = 'CARNET DE EXTRANJERÍA';
          break;
        case CONSTANTES.TipoDocPersonaExtranjera.CARNET_SOLICITANTE_REFUGIO:
          this.nombreTipoDocumento = 'CARNET SOLICITANTE DE REFUGIO';
          break;
        case CONSTANTES.TipoDocPersonaExtranjera
          .CARNET_PERMISO_TEMPORAL_PERMANENCIA:
          this.nombreTipoDocumento =
            'CARNET DE PERMISO TEMPORAL DE PERMANENCIA';
          break;
        case CONSTANTES.TipoDocPersonaExtranjera.CARNET_IDENTIFICACION:
          this.nombreTipoDocumento = 'CARNÉ DE IDENTIFICACIÓN';
          break;
        case CONSTANTES.TipoDocPersonaExtranjera.PASAPORTE:
          this.nombreTipoDocumento = 'PASAPORTE';
          break;
        default:
          break;
      }
      this.NDocumento = this.seguridadService.getNumDoc();
    } else if (
      this.seguridadService.getNameId() ===
      CONSTANTES.CodTabTipoPersona.PERSONA_NATURAL_CON_RUC
    ) {
      this.nombreTipoPersona = 'PERSONA NATURAL CON RUC';
      this.tipoNombres = 'Nombres y Apellidos';
      this.nombreTipoDocumento = 'R.U.C.';
      this.NDocumento = this.seguridadService.getCompanyCode();
    } else {
      this.nombreTipoPersona = '';
      this.tipoNombres = 'Nombre o Razón Social';
      this.nombreTipoDocumento = 'D.N.I. / C.E. / *';
      this.NDocumento = this.seguridadService.getNumDoc();
    }
  }

  salir(): void {
    this.router.navigate(['/relacion-tupas']);
  }

  confirmarCrearSolicitud(): void {
    this.funcionesMtcService.mostrarCargando();
    console.log(this.tipoSolicitudSeleccionado);
    localStorage.setItem('tramite-solicitud', '');
    //const idCliente: number = parseInt(this.seguridadService.getIdCliente());
//debugger;
    this.tramiteService
      .putGenerar({
        TupaId: this.TupaId,
        CodigoEstado: 2,
        CodigoPersona: 2
      } as GenerarTramiteRequestModel)
      .subscribe(
        (respuesta: ApiResponse<number>) => {
          debugger;
          console.log(respuesta);
          //debugger;
          if (respuesta.success) {
            //debugger;
            localStorage.setItem('tramite-id', respuesta.data.toString());
            let data = { IdCliente: (this.seguridadService.getIdCliente() ?? 1)}
            this.generarEstudio(data);
          }
        },
        (error) => { }
      );
  }

  generarEstudio(data: any) {
    this.externoService
      .postGenerarEstudio(data)
      .subscribe(
        (respuesta: ApiResponse<GenerarEstudio>) => {          
          console.log(respuesta);
          this.funcionesMtcService.ocultarCargando();
          if (respuesta.success) {            
            localStorage.setItem('estudio-id', respuesta.data.idEstudio.toString());
            this.tramiteService.putActualizarIdEstudio({
              CodMaeSolicitud: Number(localStorage.getItem('tramite-id')),
              IdEstudio: respuesta.data.idEstudio
            }).subscribe();
            this.globalService.setLastPage('tramite-iniciar'); 
            this.router.navigate(['/tramite-iniciado']);
          } else {
            this.funcionesMtcService.mensajeError("Ocurrió un problema al intentar obtener la encuesta")
              .then(() => {
                this.router.navigate(['/relacion-tupas']);
              })
          }
        },
        (error) => { this.funcionesMtcService.ocultarCargando();}
      );
  }

  close() {    
    var sector =  localStorage.getItem('tupa-id-sector');
    this.router.navigate(['relacion-tupas/'+sector]);
  }
}
