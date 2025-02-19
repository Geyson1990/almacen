/**
 * Firma electrónica de documentos asignados
 * @author André Bernabé Pérez
 * @version 1.0 26.08.2022
 */

import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  Requisito,
  TramiteModel,
} from 'src/app/core/models/Tramite/TramiteModel';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { SeguridadService } from 'src/app/core/services/seguridad.service';
import { TramiteService } from '../../../../core/services/tramite/tramite.service';
import { DatosUsuarioLogin } from '../../../../core/models/Autenticacion/DatosUsuarioLogin';
import { CONSTANTES } from '../../../../enums/constants';
import { TipoPersona } from '../../../../core/models/Formularios/Formulario002_a12/Secciones';
import { ProfesionalModel } from '../../../../core/models/Profesional/ProfesionalModel';
import { VisorPdfArchivosService } from 'src/app/core/services/tramite/visor-pdf-archivos.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { PdfJsViewerComponent } from 'ng2-pdfjs-viewer';
import { ProfesionalService } from '../../../../core/services/profesional/profesional.service';
import { FirmaSignnetComponent } from 'src/app/shared/components/firma-signnet/firma-signnet.component';
import { ServicioFirmaResponseModel } from 'src/app/core/models/SignNet/ServicioFirmaResponseModel';
import { DocFirmadoRequestModel } from 'src/app/core/models/Profesional/DocFirmadoRequestModel';
import { FirmaPeruComponent } from 'src/app/shared/components/firma-peru/firma-peru.component';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-firmar-documento',
  templateUrl: './firmar-documento.component.html',
  styleUrls: ['./firmar-documento.component.css'],
})
export class FirmarDocumentoComponent implements OnInit, AfterViewInit {
  @ViewChild('pdfViewer') pdfViewer: PdfJsViewerComponent;
  // @ViewChild('signNetCmp') signNetCmp: FirmaSignnetComponent;
  @ViewChild('firmaPeruCmp') firmaPeruCmp: FirmaPeruComponent;

  idEncrypt: string;
  tramite: TramiteModel;
  requisito: Requisito;
  rutaArchivosOut: string;
  nombreArchivos: string;
  datosSolicitante: DatosUsuarioLogin;

  datosProfesional: ProfesionalModel;

  urlPdf: Blob;

  timeLeft: number;
  interval: any;

  disableBtnFirmar = false;

  constructor(
    private seguridadService: SeguridadService,
    private funcionesMtcService: FuncionesMtcService,
    private router: Router,
    private route: ActivatedRoute,
    private profesionalService: ProfesionalService,
    private visorPdfArchivosService: VisorPdfArchivosService
  ) {}

  ngOnInit(): void {
    this.funcionesMtcService.mostrarCargando();
    this.seguridadService.postLogout();
    this.onChangeParams();
  }

  async ngAfterViewInit(): Promise<void> {
    await this.cargarDatos();
    this.initTimeLeft();
  }

  get nombresSolicitante(): string {
    if (
      this.datosSolicitante?.tipoPersona ===
      CONSTANTES.CodTabTipoPersona.PERSONA_JURIDICA
    ) {
      return this.datosSolicitante?.razonSocial;
    }
    return `${this.datosSolicitante?.nombres} ${
      this.datosSolicitante?.apePaterno
    } ${this.datosSolicitante?.apeMaterno ?? ''}`;
  }

  get nombresProfesional(): string {
    return `${this.datosProfesional?.nombres} ${
      this.datosProfesional?.apPaterno
    } ${this.datosProfesional?.apMaterno ?? ''}`;
  }

  get isFirmado(): boolean {
    return this.requisito?.firmado ?? true;
  }

  get browserName() {
    const agent = window.navigator.userAgent.toLowerCase();
    switch (true) {
      case agent.indexOf('edge') > -1:
        return 'edge';
      case agent.indexOf('opr') > -1 && !!(<any>window).opr:
        return 'opera';
      case agent.indexOf('chrome') > -1 && !!(<any>window).chrome:
        return 'chrome';
      case agent.indexOf('trident') > -1:
        return 'ie';
      case agent.indexOf('firefox') > -1:
        return 'firefox';
      case agent.indexOf('safari') > -1:
        return 'safari';
      default:
        return 'other';
    }
  }

  onChangeParams(): void {
    this.route.queryParams.subscribe((params) => {
      const paramTokenEncode = params?.token ?? null;
      if (!paramTokenEncode) {
        this.router.navigate(['/inicio']);
      }
      this.validarToken(paramTokenEncode);

      this.idEncrypt = params?.id ?? null;
      if (!this.idEncrypt) {
        this.seguridadService.postLogout();
        this.router.navigate(['/inicio']);
      }
    });
  }

  initTimeLeft(): void {
    const expirationTime = this.seguridadService
      .getTokenExpirationDate()
      .getTime();
    const nowTime = new Date().getTime();
    this.timeLeft = Math.round((expirationTime - nowTime) / 1000);

    clearInterval(this.interval);
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      }
    }, 1000);
  }

  get timeLeftFormatted(): string {
    let hours: string | number = Math.floor(this.timeLeft / 3600);
    let minutes: string | number = Math.floor(
      (this.timeLeft - hours * 3600) / 60
    );
    let seconds: string | number = this.timeLeft - hours * 3600 - minutes * 60;

    if (hours < 10) {
      hours = '0' + hours;
    }
    if (minutes < 10) {
      minutes = '0' + minutes;
    }
    if (seconds < 10) {
      seconds = '0' + seconds;
    }

    return `${hours}:${minutes}:${seconds}`;
  }

  async validarToken(paramToken: string): Promise<void> {
    if (!paramToken) {
      return;
    }
    const isTokenValid = this.seguridadService.isTokenValid(paramToken);
    if (!isTokenValid) {
      this.seguridadService.postLogout();
      this.funcionesMtcService.mensajeError(
        'El enlace para la firma electrónica ha expirado, por favor contacte con el solicitante'
      );
      this.router.navigate(['/inicio']);
      return;
    }
    const decodeToken = this.seguridadService.getDecodedToken(paramToken);
    if (!decodeToken) {
      this.seguridadService.postLogout();
      this.funcionesMtcService.mensajeError(
        'Error en el enlace para la firma electrónica'
      );
      this.router.navigate(['/inicio']);
      return;
    }
    sessionStorage.setItem('accessToken', paramToken);
  }

  async cargarDatos(): Promise<void> {
    try {
      this.funcionesMtcService.mostrarCargando();

      const idEncode = encodeURIComponent(this.idEncrypt);
      const response = await this.profesionalService
        .getRequisitoParaFirma(idEncode)
        .toPromise();

      if (!response.success) {
        this.funcionesMtcService.mensajeError(response.message);
        this.seguridadService.postLogout();
        this.router.navigate(['/inicio']);
        return;
      }

      this.tramite = response.result;
      this.requisito = this.tramite?.requisitos[0] ?? null;
      if (!this.requisito) {
        this.funcionesMtcService.mensajeError(
          'Ocurrio un error al intentar obtener el requisito. Por favor recargue la página'
        );
        return;
      }

      const filePathName = this.requisito.rutaDocumento;
      const file: Blob = await this.visorPdfArchivosService
        .get(filePathName)
        .toPromise();
      this.pdfViewer.pdfSrc = file;
      this.pdfViewer.refresh();
    } catch (error) {
      this.funcionesMtcService.mensajeError(
        'Ocurrio un error al intentar obtener el requisito. Por favor recargue la página'
      );
      console.log(error);
    } finally {
      this.funcionesMtcService.ocultarCargando();
    }

    // Cargamos los datos del solicitante
    this.datosSolicitante = this.seguridadService.getDatosUsuarioLogin();

    // Cargamos los datos del profesional
    if (!this.requisito.profAsignado) {
      this.funcionesMtcService.mensajeError(
        'Ocurrio un error al intentar obtener los datos del profesional. Por favor recargue la página'
      );
      return;
    }

    this.datosProfesional = this.requisito.profAsignado;
  }

  firmarDocumento(): void {
    this.disableBtnFirmar = true;
    this.funcionesMtcService
      .mensajeConfirmar(
        '¿Está seguro de realizar la firma electrónica del documento?'
      )
      .then(async () => {
        const idEncode = encodeURIComponent(this.idEncrypt);
        try {
          this.funcionesMtcService.mostrarCargando();

          this.firmaPeruCmp.iniciarFirmaProfesional(idEncode);
        } catch (error) {
          this.funcionesMtcService.mensajeError(
            'Ocurrio un error al intentar iniciar el cliente de firma. Por favor recargue la página'
          );
          throw error;
        } finally {
          this.funcionesMtcService.ocultarCargando();
        }
      })
      .catch(() => {
        this.disableBtnFirmar = false;
      });
  }

  onFirmaInicia(): void {
    console.log('INICIO DE FIRMA');
  }

  onFirmaCompleta(): void {
    console.log('FIRMA COMPLETADA');
    this.cargarDatos();
    this.funcionesMtcService.mensajeOk(
      'Se completó la firma electrónica del documento.'
    );
  }

  onFirmaCancela(): void {
    console.log('FIRMA CANCELADA');
    this.disableBtnFirmar = false;
    this.funcionesMtcService.mensajeError(
      'Ocurrió un error al intentar firmar el documento, por favor actualize la página e intente nuevamente, si el problema persiste contáctese con nosotros.'
    );
  }

  // firmarDocumento(btnSubmit: HTMLButtonElement): void {
  //   btnSubmit.disabled = true;
  //   this.funcionesMtcService
  //     .mensajeConfirmar('¿Está seguro de realizar la firma electrónica del documento?')
  //     .then(async () => {
  //       const idEncode = encodeURIComponent(this.idEncrypt);
  //       try {
  //         this.funcionesMtcService.mostrarCargando();
  //         const response = await this.profesionalService
  //           .getDocumentoParaFirma(idEncode)
  //           .toPromise();

  //         if (!response.success) {
  //           this.funcionesMtcService
  //             .mensajeError(response.message);
  //           return;
  //         }

  //         const { servicioFirma, pathFolderIn, pathFolderOut, nombreArchivos } = response.result;
  //         this.rutaArchivosOut = pathFolderOut;
  //         this.nombreArchivos = nombreArchivos;

  //         this.signNetCmp.setParametros({
  //           urlServicioFirma: servicioFirma,
  //           rutaOrigen: pathFolderIn,
  //           rutaDestino: pathFolderOut,
  //           nombreArchivos
  //         });
  //       } catch (error) {
  //         this.funcionesMtcService
  //           .mensajeError('Ocurrio un error al intentar obtener el documento. Por favor recargue la página');
  //         throw error;
  //       }
  //       finally {
  //         this.funcionesMtcService.ocultarCargando();
  //       }

  //       this.signNetCmp.firmarDocumento();
  //     })
  //     .catch(() => {
  //       btnSubmit.disabled = false;
  //     });
  // }

  // async signNetResponse(response: ServicioFirmaResponseModel, btnSubmit: HTMLButtonElement): Promise<void> {
  //   console.log('response: ', response);

  //   if (response?.resultado !== '0') {
  //     try {
  //       await this.profesionalService.deleteLimpiarDocumentos(this.nombreArchivos).toPromise();
  //     } catch (error) {
  //       console.log(error);
  //     }

  //     this.funcionesMtcService
  //       .mensajeError(response?.estado ?? 'Ocurrio un error con el servicio de la firma. Por favor recargue la página');
  //     btnSubmit.disabled = false;
  //     return;
  //   }

  //   const idEncode = encodeURIComponent(this.idEncrypt);
  //   const request: DocFirmadoRequestModel = {
  //     idEncode,
  //     rutaArchivos: this.rutaArchivosOut,
  //     nombreArchivos: this.nombreArchivos
  //   };

  //   try {
  //     this.funcionesMtcService.mostrarCargando();
  //     const resp = await this.profesionalService.postDocumentoFirmado(request).toPromise();
  //     if (resp?.success) {
  //       await this.cargarDatos();
  //       this.funcionesMtcService.mensajeOk(resp.message);
  //     }
  //     else {
  //       this.funcionesMtcService
  //         .mensajeError(resp?.message ?? 'Ocurrio un error al intentar guardar el documento firmado. Por favor recargue la página');
  //       btnSubmit.disabled = false;
  //     }
  //   } catch (error) {
  //     this.funcionesMtcService
  //       .mensajeError('Ocurrio un error al intentar guardar el documento firmado. Por favor recargue la página');
  //     btnSubmit.disabled = false;
  //     throw error;
  //   }
  //   finally {
  //     this.funcionesMtcService.ocultarCargando();
  //   }
  // }
}
