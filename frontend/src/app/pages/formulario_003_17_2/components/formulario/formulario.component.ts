/**
 * Formulario 003/17.2 utilizado por los procedimientos DSTT-028, DSTT-029, DSTT-031, DSTT-034, DSTT-035, DSTT-036, DSTT-037 Y DSTT-038
 * @author Alicia Toquila Quispe
 * @version 1.0 07.05.2021
 * @version 1.1 11.06.2021
*/
import { Component, OnInit, Injectable, ViewChild, AfterViewInit, Input } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbAccordionDirective , NgbModal, NgbDateStruct, NgbDatepickerI18n, NgbDateParserFormatter, NgbDateAdapter } from '@ng-bootstrap/ng-bootstrap';
import { TramiteService } from 'src/app/core/services/tramite/tramite.service';
import { OficinaRegistralService } from '../../../../core/services/servicios/oficinaregistral.service';
import { FuncionesMtcService } from '../../../../core/services/funciones-mtc.service';
import { SeguridadService } from '../../../../core/services/seguridad.service';
import { TipoDocumentoModel } from 'src/app/core/models/TipoDocumentoModel';
import { RepresentanteLegal } from 'src/app/core/models/SunatModel';
import { ReniecService } from 'src/app/core/services/servicios/reniec.service';
import { ExtranjeriaService } from 'src/app/core/services/servicios/extranjeria.service';
import { FormularioTramiteService } from 'src/app/core/services/tramite/formulario-tramite.service';
import { Formulario003_17_2Request } from 'src/app/core/models/Formularios/Formulario003_17_2/Formulario003_17_2Request';
import { Formulario003_17_2Response } from 'src/app/core/models/Formularios/Formulario003_17_2/Formulario003_17_2Response';
import { Formulario003172Service } from '../../../../core/services/formularios/formulario003-17-2.service';
import { SunatService } from 'src/app/core/services/servicios/sunat.service';
import { VisorPdfArchivosService } from '../../../../core/services/tramite/visor-pdf-archivos.service';
import { VistaPdfComponent } from '../../../../shared/components/vista-pdf/vista-pdf.component';
import { defaultRadioGroupAppearanceProvider } from 'pdf-lib';
import { RenatService } from 'src/app/core/services/servicios/renat.service';
import { DatosPersona } from 'src/app/core/models/ReniecModel';
import { MtcService } from 'src/app/core/services/servicios/mtc.service';
import { Seccion1, Seccion3, Seccion4, Seccion5, Conductor } from '../../../../core/models/Formularios/Formulario003_17_2/Secciones';
import { DatosUsuarioLogin } from 'src/app/core/models/Autenticacion/DatosUsuarioLogin';
import { UI_SWITCH_OPTIONS } from 'ngx-ui-switch/ui-switch/ui-switch.token';

@Component({
   selector: 'app-formulario',
   templateUrl: './formulario.component.html',
   styleUrls: ['./formulario.component.css']
})
export class FormularioComponent implements OnInit, AfterViewInit {

   @Input() public dataInput: any;
   @Input() public dataRequisitosInput: any;
   @ViewChild('acc') acc: NgbAccordionDirective ;

   disabled: boolean = true;
   graboUsuario: boolean = false;

   codigoProcedimientoTupa: string;
   descProcedimientoTupa: string;
   tramiteSelected: string;
   codigoTipoSolicitudTupa: string;
   descTipoSolicitudTupa: string;

   datosUsuarioLogin: DatosUsuarioLogin;

   visibleButtonEstatutoSocial = true;
   filePdfEstatutoSocialSeleccionado: any = null;
   pathPdfEstatutoSocialSeleccionado: any = null;

   txtTitulo: string = '';
   id: number = 0;
   uriArchivo: string = '';//PARA SABER EL NOMBRE DEL PDF (COMPLETO CON TODO Y ADJUNTOS)
   tipoDocumentoValidForm: string;
   formulario: UntypedFormGroup;
   listaTiposDocumentos: TipoDocumentoModel[] = [
      { id: "01", documento: 'DNI' },
      { id: "04", documento: 'Carnet de Extranjería' },
      { id: "05", documento: 'Carnet de Permiso Temp. Perman.' },
      { id: "06", documento: 'Permiso Temporal de Permanencia' },
   ];
   representanteLegal: RepresentanteLegal[] = [];

   txtTituloCompleto: string = "FORMULARIO 003-17.2 SERVICIO DE TRANSPORTE TERRESTRE DE AMBITO NACIONAL (PERSONAS, MERCANCÍAS)";
   txtTituloModificado: string = "FORMULARIO 003-17.2 SERVICIO DE TRANSPORTE TERRESTRE DE AMBITO NACIONAL (PERSONAS, MERCANCÍAS)";
   esRepresentante: boolean = false;
   tipoDocumento: TipoDocumentoModel;
   oficinasRegistral: any = [];

   nroDocumentoLogin: string;
   nombreUsuario: string;
   personaJuridica: boolean = false;
   nroRuc: string = "";
   razonSocial: string;
   filePdfPathName: string = null;
   cargoRepresentanteLegal: string = "";

   tipoSolicitante: string = "";
   //codTipoDocSolicitante: string = ""; // 01 DNI  03 CI  04 CE   

   //Datos de Formulario
   tituloFormulario = 'SOLICITUD DE SERVICIO DE TRANSPORTE TERRESTRE DE AMBITO NACIONAL (PERSONAS, MERCANCÍAS)';
   tipoPersona: number = 1
   paDJ63: string[] = ["DSTT-025", "DSTT-028", "DSTT-029", "DSTT-030", "DSTT-033", "DSTT-034"];
   paDJ64: string[] = ["DSTT-025", "DSTT-028", "DSTT-029"];
   paDJ65: string[] = ["DSTT-025", "DSTT-028"];
   paDJ66: string[] = ["DSTT-025", "DSTT-028", "DSTT-029", "DSTT-030", "DSTT-033", "DSTT-034"];
   paDJ67: string[] = ["DSTT-025", "DSTT-028", "DSTT-029"];
   paDJ68: string[] = ["DSTT-035", "DSTT-037", "DSTT-040"];
   paDJ69: string[] = ["DSTT-025", "DSTT-028", "DSTT-029", "DSTT-030", "DSTT-031", "DSTT-033", "DSTT-034", "DSTT-036", "DSTT-039"];


   activarDJ63: boolean = false;
   activarDJ64: boolean = false;
   activarDJ65: boolean = false;
   activarDJ66: boolean = false;
   activarDJ67: boolean = false;
   activarDJ68: boolean = false;
   activarDJ69: boolean = false;

   activarPN: boolean = false;
   activarPJ: boolean = false;

   activarEstatuto: boolean = true;
   paEstatuto: string[] = ["DSTT-032", "DSTT-036"];

   paAutorizacion: string[] = ["DSTT-033", "DSTT-038"];
   autorizacion = false;
   codigoEmpresaServicio: string = "";
   nombreEmpresaServicio: string = "";

   paTipoServicio: string[] = ["DSTT-037", "DSTT-038"];
   activarTipoServicio = false;
   servicio: string = "1";

   paSeccion5: string[] = ['DSTT-027'];
   paRelacionConductores: string[] = ['DSTT-027'];
   paCategoriaM3: string[] = ['DSTT-027'];
   paValidaLicenciaConductor: string[] = ['DSTT-027'];
   habilitarSeccion5 = true;
   RelacionConductores: boolean = false;

   CIIU: boolean = true;

   public conductores: Conductor[] = [];
   public recordIndexToEditConductores: number;

   tipoDocumentoSolicitante: string = "";
   nombreTipoDocumentoSolicitante: string = "";
   numeroDocumentoSolicitante: string = "";
   nombreSolicitante: string = "";

   constructor(
      private fb: UntypedFormBuilder,
      public activeModal: NgbActiveModal,
      public tramiteService: TramiteService,
      private _oficinaRegistral: OficinaRegistralService,
      private funcionesMtcService: FuncionesMtcService,
      private seguridadService: SeguridadService,
      private reniecService: ReniecService,
      private extranjeriaService: ExtranjeriaService,
      private formularioTramiteService: FormularioTramiteService,
      private formularioService: Formulario003172Service,
      private visorPdfArchivosService: VisorPdfArchivosService,
      private modalService: NgbModal,
      private sunatService: SunatService,
      private renatService: RenatService,
      private mtcService: MtcService) {

      this.conductores = [];
   }

   ngOnInit(): void {
      const tramiteSelected: any = JSON.parse(localStorage.getItem('tramite-selected'));
      this.codigoProcedimientoTupa = tramiteSelected.codigo;
      this.descProcedimientoTupa = tramiteSelected.nombre;
      this.codigoTipoSolicitudTupa = (this.dataInput.tipoSolicitudTupaCod == "" ? "0" : this.dataInput.tipoSolicitudTupaCod);
      this.descTipoSolicitudTupa = this.dataInput.tipoSolicitudTupaDesc;

      this.recordIndexToEditConductores = -1;

      console.log("Codigo Tipo Solicitud: " + this.codigoTipoSolicitudTupa);
      console.log("Descripcion Tipo Solicitud: " + this.descTipoSolicitudTupa);

      this.uriArchivo = this.dataInput.rutaDocumento;
      this.id = this.dataInput.movId;


      if (this.paAutorizacion.indexOf(this.codigoProcedimientoTupa) > -1) this.autorizacion = true; else this.autorizacion = false;
      if (this.paTipoServicio.indexOf(this.codigoProcedimientoTupa) > -1) this.activarTipoServicio = true; else this.activarTipoServicio = false;
      if (this.paDJ63.indexOf(this.codigoProcedimientoTupa) > -1) this.activarDJ63 = true; else this.activarDJ63 = false;
      if (this.paDJ64.indexOf(this.codigoProcedimientoTupa) > -1) this.activarDJ64 = true; else this.activarDJ64 = false;
      if (this.paDJ65.indexOf(this.codigoProcedimientoTupa) > -1) this.activarDJ65 = true; else this.activarDJ65 = false;
      if (this.paDJ66.indexOf(this.codigoProcedimientoTupa) > -1) this.activarDJ66 = true; else this.activarDJ66 = false;
      if (this.paDJ67.indexOf(this.codigoProcedimientoTupa) > -1) this.activarDJ67 = true; else this.activarDJ67 = false;
      if (this.paDJ68.indexOf(this.codigoProcedimientoTupa) > -1) this.activarDJ68 = true; else this.activarDJ68 = false;
      if (this.paDJ69.indexOf(this.codigoProcedimientoTupa) > -1) this.activarDJ69 = true; else this.activarDJ69 = false;

      if (this.paEstatuto.indexOf(this.codigoProcedimientoTupa) > -1) this.activarEstatuto = false; else this.activarEstatuto = true;

      if (this.codigoProcedimientoTupa == "DSTT-025" || this.codigoProcedimientoTupa == "DSTT-026" || this.codigoProcedimientoTupa == "DSTT-027" || this.codigoProcedimientoTupa == "DSTT-028")
         this.servicio = "1";

      if (this.codigoProcedimientoTupa == "DSTT-033" || this.codigoProcedimientoTupa == "DSTT-034")
         this.servicio = "2";

      if (this.codigoProcedimientoTupa == "DSTT-032" || this.codigoProcedimientoTupa == "DSTT-035") {
         if (this.codigoTipoSolicitudTupa == "1" || this.codigoTipoSolicitudTupa == "2" || this.codigoTipoSolicitudTupa == "3" || this.codigoTipoSolicitudTupa == "4" || this.codigoTipoSolicitudTupa == "5")
            this.servicio = "1";

         if (this.codigoTipoSolicitudTupa == "6" || this.codigoTipoSolicitudTupa == "7")
            this.servicio = "2";

      }

      if (this.codigoProcedimientoTupa == "DSTT-036") {
         this.servicio = "3";
      }

      if (this.codigoProcedimientoTupa == "DSTT-037" || this.codigoProcedimientoTupa == "DSTT-038" || this.codigoProcedimientoTupa == "DSTT-039" || this.codigoProcedimientoTupa == "DSTT-040")
         this.servicio = "4";

      if (this.paSeccion5.indexOf(this.codigoProcedimientoTupa) > -1) {
         this.habilitarSeccion5 = true;
      }
      else {
         if (this.codigoProcedimientoTupa == 'DSTT-032' && (this.codigoTipoSolicitudTupa == "1" || this.codigoTipoSolicitudTupa == "2" || this.codigoTipoSolicitudTupa == "3" || this.codigoTipoSolicitudTupa == "5"))
            this.habilitarSeccion5 = true;
         else
            this.habilitarSeccion5 = false;
      }

      if (this.paRelacionConductores.indexOf(this.codigoProcedimientoTupa) > -1)
         this.RelacionConductores = true;
      else {
         if (this.codigoProcedimientoTupa == 'DSTT-032' && (this.codigoTipoSolicitudTupa == "1" || this.codigoTipoSolicitudTupa == "2" || this.codigoTipoSolicitudTupa == "3" || this.codigoTipoSolicitudTupa == "5"))
            this.RelacionConductores = true;
         else
            this.RelacionConductores = false;
      }

      if (this.codigoProcedimientoTupa == "DSTT-033") {
         this.codigoEmpresaServicio = "12";
         this.nombreEmpresaServicio = "SERVICIO DE TRANSPORTE DE MERCANCIAS PUBLICO";
      }
      /*
      if (this.codigoProcedimientoTupa=="DSTT-034"){
        this.empresaAutorizacion = "13";
      }*/
      console.log("Tipo servicio:" + this.servicio);
      this.formulario = this.fb.group({
         tipoDocumentoSolicitante: this.fb.control(""),
         nroDocumentoSolicitante: this.fb.control(""),
         rucPersona: this.fb.control(""),
         nombresPersona: this.fb.control(""),
         domicilioPersona: this.fb.control(""),
         distritoPersona: this.fb.control(""),
         provinciaPersona: this.fb.control(""),
         departamentoPersona: this.fb.control(""),
         telefonoPersona: this.fb.control(""),
         celularPersona: this.fb.control("", [Validators.required]),
         correoPersona: this.fb.control("", [Validators.required]),
         ruc: this.fb.control({ value: '', disabled: true }, [Validators.required]),
         razonSocial: this.fb.control({ value: '', disabled: true }, [Validators.required]),
         domicilio: this.fb.control("", [Validators.required]),
         distrito: this.fb.control("", [Validators.required]),
         provincia: this.fb.control("", [Validators.required]),
         departamento: this.fb.control("", [Validators.required]),
         tipoDocumento: this.fb.control("", [Validators.required]),
         numeroDocumento: this.fb.control("", [Validators.required]),
         nombreRepresentante: this.fb.control("", [Validators.required]),
         apePaternoRepresentante: this.fb.control("", [Validators.required]),
         apeMaternoRepresentante: this.fb.control("", [Validators.required]),
         domicilioRepresentante: this.fb.control("", [Validators.required]),
         telefonoRepresentante: this.fb.control(""),
         celularRepresentante: this.fb.control("", [Validators.required]),
         correoRepresentante: this.fb.control("", [Validators.required]),
         distritoRepresentante: this.fb.control("", [Validators.required]),
         provinciaRepresentante: this.fb.control("", [Validators.required]),
         departamentoRepresentante: this.fb.control("", [Validators.required]),
         oficinaRepresentante: this.fb.control("", [Validators.required]),
         partidaRepresentante: this.fb.control("", [Validators.required]),
         asientoRepresentante: this.fb.control("", [Validators.required]),
         oficinaEmpresa: this.fb.control("", [Validators.required]),
         partidaEmpresa: this.fb.control("", [Validators.required]),
         asientoEmpresa: this.fb.control("", [Validators.required]),
         tipoServicio: this.fb.control({ value: this.servicio, disabled: !this.activarTipoServicio }, [Validators.required]),
         declaracion_61: this.fb.control(false, [Validators.requiredTrue]),
         declaracion_62: this.fb.control(false, [Validators.requiredTrue]),
         declaracion_63: this.fb.control(false, [Validators.requiredTrue]),
         declaracion_64: this.fb.control(false, [Validators.requiredTrue]),
         declaracion_65: this.fb.control(false, [Validators.requiredTrue]),
         declaracion_66: this.fb.control(false, [Validators.requiredTrue]),
         declaracion_67: this.fb.control(false, [Validators.requiredTrue]),
         declaracion_68: this.fb.control(false, [Validators.requiredTrue]),
         declaracion_69: this.fb.control(false, [Validators.requiredTrue]),
         autorizacion: this.fb.control(true, [Validators.requiredTrue]),

         tipoDocumentoConductor: this.fb.control(''),
         numeroDocumentoConductor: this.fb.control(''),
         nombresApellidos: this.fb.control(''),
         numeroLicencia: this.fb.control(''),
         claseCategoria: this.fb.control('')
      });

      this.cargarOficinaRegistral();
      this.nroRuc = this.seguridadService.getCompanyCode();
      this.razonSocial = this.seguridadService.getUserName();       //nombre de usuario login
      const tipoDocumento = this.seguridadService.getNameId();      //tipo de documento usuario login
      this.nroDocumentoLogin = this.seguridadService.getNumDoc();   //nro de documento usuario login
      this.datosUsuarioLogin = this.seguridadService.getDatosUsuarioLogin(); // Datos personales del usuario
      this.tipoDocumentoValidForm = tipoDocumento;

      console.log("TIPO DOCUMENTO", tipoDocumento); //00001
      console.log("NUMERO", this.nroDocumentoLogin);
      console.log(this.seguridadService.getDatosUsuarioLogin());
      switch (tipoDocumento) {
         case "00001":
         case "00004":
         case "00005": this.formulario.controls["ruc"].clearValidators();
            this.formulario.controls["razonSocial"].clearValidators();
            this.formulario.controls["domicilio"].clearValidators();
            this.formulario.controls["departamento"].clearValidators();
            this.formulario.controls["provincia"].clearValidators();
            this.formulario.controls["distrito"].clearValidators();
            this.formulario.controls["tipoDocumento"].clearValidators();
            this.formulario.controls["numeroDocumento"].clearValidators();
            this.formulario.controls["nombreRepresentante"].clearValidators();
            this.formulario.controls["apePaternoRepresentante"].clearValidators();
            this.formulario.controls["apeMaternoRepresentante"].clearValidators();
            this.formulario.controls["telefonoRepresentante"].clearValidators();
            this.formulario.controls["celularRepresentante"].clearValidators();
            this.formulario.controls["correoRepresentante"].clearValidators();
            this.formulario.controls['domicilioRepresentante'].clearValidators();
            this.formulario.controls['distritoRepresentante'].clearValidators();
            this.formulario.controls['provinciaRepresentante'].clearValidators();
            this.formulario.controls['departamentoRepresentante'].clearValidators();
            this.formulario.controls['oficinaRepresentante'].clearValidators();
            this.formulario.controls['partidaRepresentante'].clearValidators();
            this.formulario.controls['asientoRepresentante'].clearValidators();
            this.formulario.controls['oficinaEmpresa'].clearValidators();
            this.formulario.controls['partidaEmpresa'].clearValidators();
            this.formulario.controls['asientoEmpresa'].clearValidators();
            this.formulario.controls['tipoServicio'].clearValidators();
            this.formulario.updateValueAndValidity();

            this.activarPN = true;
            this.activarPJ = false;
            break;

         case "00002": this.formulario.controls["tipoDocumentoSolicitante"].clearValidators();
            this.formulario.controls["nroDocumentoSolicitante"].clearValidators();
            this.formulario.controls["rucPersona"].clearValidators();
            this.formulario.controls["nombresPersona"].clearValidators();
            this.formulario.controls["domicilioPersona"].clearValidators();
            this.formulario.controls["distritoPersona"].clearValidators();
            this.formulario.controls["provinciaPersona"].clearValidators();
            this.formulario.controls["telefonoPersona"].clearValidators();
            this.formulario.controls["celularPersona"].clearValidators();
            this.formulario.controls["correoPersona"].clearValidators();
            this.formulario.updateValueAndValidity();

            this.activarPN = false;
            this.activarPJ = true;

            break;

      }
      if (!this.activarDJ63) { this.formulario.controls["declaracion_63"].clearValidators(); }
      if (!this.activarDJ64) { this.formulario.controls["declaracion_64"].clearValidators(); }
      if (!this.activarDJ65) { this.formulario.controls["declaracion_65"].clearValidators(); }
      if (!this.activarDJ66) { this.formulario.controls["declaracion_66"].clearValidators(); }
      if (!this.activarDJ67) { this.formulario.controls["declaracion_67"].clearValidators(); }
      if (!this.activarDJ68) { this.formulario.controls["declaracion_68"].clearValidators(); }
      if (!this.activarDJ69) { this.formulario.controls["declaracion_69"].clearValidators(); }

      if (this.codigoProcedimientoTupa == "DSTT-033") {
         console.log("Validacion: " + this.codigoProcedimientoTupa);
         //this.validaAutorizacion();
      } else {
         this.formulario.controls["autorizacion"].clearValidators();
      }

      this.cargarDatos();
      this.recuperarDatosUsuario();
   }

   async ngAfterViewInit(): Promise<void> {
      await this.verificarCIUU(this.codigoProcedimientoTupa);
      setTimeout(async () => {
         if (this.habilitarSeccion5 === true) {
            this.acc.expand('seccion-5');
         } else {
            this.acc.collapse('seccion-5');
            document.querySelector('button[aria-controls=seccion-5]').parentElement.parentElement.classList.add('acordeon-bloqueado');
         }
      });
   }

   async verificarCIUU(codigoTupa: string): Promise<void> {
      try {
         if (this.tipoSolicitante == "PJ" || this.tipoSolicitante == "PNR") {
            const resp: any = await this.sunatService.getDatosPrincipales(this.nroRuc).toPromise();
            console.log(resp);
            if (!resp) {
               this.funcionesMtcService.ocultarCargando();
               this.funcionesMtcService.mensajeError('El servicio de la SUNAT no responde. No se puede validar el CIUU de la actividad principal.');
               this.formulario.disable();
               return;
            } else {
               switch (codigoTupa) {
                  case "DSTT-025":
                  case "DSTT-029": if (resp.CIIU !== "4922" && resp.CIIU !== "60214") {
                     this.funcionesMtcService.ocultarCargando();
                     this.funcionesMtcService.mensajeError('Para continuar, el administrado debe tener como actividad principal CIIU (60214 o 4922) OTRAS ACTIVIDADES DE TRANSPORTE POR VÍA TERRESTRE.');
                     this.CIIU = false;
                     this.formulario.disable();
                  }
                     break;
                  case "DSTT-027": this.funcionesMtcService.ocultarCargando();
                     break;

                  case "DSTT-033": if (resp.CIIU !== "4923" && resp.CIIU !== "60230") {
                     this.funcionesMtcService.ocultarCargando();
                     this.funcionesMtcService.mensajeError('Para continuar, el administrado debe tener como actividad principal el CIIU (60230 o 4923) TRANSPORTE DE CARGA POR CARRETERA.');
                     this.CIIU = false;
                     this.formulario.disable();
                  }
                     break;
                  case "DSTT-034": if (resp.CIIU === "4923" || resp.CIIU === "60230") {
                     this.funcionesMtcService.ocultarCargando();
                     this.funcionesMtcService.mensajeError('Para continuar, el administrado NO debe tener como actividad principal el CIIU (60230 o 4923) TRANSPORTE DE CARGA POR CARRETERA.');
                     this.CIIU = false;
                     this.formulario.disable();
                  }
                     break;
                  case "DSTT-036": if (resp.CIIU !== "4923" && resp.CIIU !== "60230") {
                     this.funcionesMtcService.ocultarCargando();
                     this.funcionesMtcService.mensajeError('Para continuar, el administrado debe tener como actividad principal el CIIU (60230 o 4923) TRANSPORTE DE CARGA POR CARRETERA.');
                     this.CIIU = false;
                     this.formulario.disable();
                  }
                     break;
                  default: this.funcionesMtcService.ocultarCargando(); break;
               }
            }
         }
      } catch (error) {
         console.log(error);
         this.funcionesMtcService.mensajeError('Error al consultar el CIIU del administrado.');
         this.formulario.disable();
      }
   }

   validaAutorizacion() {
      this.renatService.EmpresaServicioVigencia(this.nroRuc, parseInt(this.codigoEmpresaServicio)).subscribe((data: any) => {
         console.log("infoautorizacion = ", data.length);
         console.log("infoautorizacion = ", data);
         if (this.codigoProcedimientoTupa === "DSTT-033") {
            if (data.length > 0) {
               this.funcionesMtcService.ocultarCargando().mensajeError('No puede continuar con el trámite porque la empresa ya cuenta con autorización vigente para el ' + this.nombreEmpresaServicio);
            } else {
               this.formulario.controls["autorizacion"].setValue(true);
               this.formulario.updateValueAndValidity();
            }
         } else {
            if (data.length == 0) {
               this.funcionesMtcService.ocultarCargando().mensajeError('La empresa no cuenta con autorización vigente para el ' + this.nombreEmpresaServicio);
            } else {
               this.formulario.controls["autorizacion"].setValue(true);
               this.formulario.updateValueAndValidity();
            }
         }
      }, error => {
         this.funcionesMtcService.ocultarCargando().mensajeError('Problemas para verificar la autorización de la Empresa.');
      });
   }

   cargarOficinaRegistral() {
      this._oficinaRegistral.oficinaRegistral().subscribe(
         (dataOficinaRegistral) => {
            this.oficinasRegistral = dataOficinaRegistral;
            this.funcionesMtcService.ocultarCargando();
         },
         error => {
            this.funcionesMtcService.ocultarCargando().mensajeError('Problemas para conectarnos con el servicio de SUNARP y recuperar datos de la oficina registral. Vuelva a intentarlo más tarde.');
         });
   }

   onChangeTipoDocumento(opcion: string = 'RepresentanteLegal') {
      if (opcion == "RepresentanteLegal") {
         const tipoDocumento: string = this.formulario.controls['tipoDocumento'].value.trim();
         const apellMatR = this.formulario.controls['apeMaternoRepresentante'];

         if (tipoDocumento === '04') {

            this.disabled = false;
            apellMatR.setValidators(null);
            apellMatR.updateValueAndValidity();
         } else {
            apellMatR.setValidators([Validators.required]);
            apellMatR.updateValueAndValidity();
            this.disabled = true;
         }

         this.formulario.controls['numeroDocumento'].setValue('');
         this.inputNumeroDocumento();
      } else {
         if (opcion == "Conductor") {
            const tipoDocumentoConductor: string = this.formulario.controls['tipoDocumentoConductor'].value.trim();
            this.formulario.controls['numeroDocumentoConductor'].setValue('');
            this.formulario.controls['nombresApellidos'].setValue('');
            this.formulario.controls['numeroLicencia'].setValue('');
            this.formulario.controls['claseCategoria'].setValue('');
         }
      }
   }

   onChangeNumeroDocumentoConductor(opcion: string = 'RepresentanteLegal') {
      if (opcion == "RepresentanteLegal") {
         const tipoDocumento: string = this.formulario.controls['tipoDocumento'].value.trim();
         const apellMatR = this.formulario.controls['apeMaternoRepresentante'];

         if (tipoDocumento === '04') {

            this.disabled = false;
            apellMatR.setValidators(null);
            apellMatR.updateValueAndValidity();
         } else {
            apellMatR.setValidators([Validators.required]);
            apellMatR.updateValueAndValidity();
            this.disabled = true;
         }

         this.formulario.controls['numeroDocumento'].setValue('');
         this.inputNumeroDocumento();
      } else {
         if (opcion == "Conductor") {
            const tipoDocumentoConductor: string = this.formulario.controls['tipoDocumentoConductor'].value.trim();
            this.formulario.controls['nombresApellidos'].setValue('');
            this.formulario.controls['numeroLicencia'].setValue('');
            this.formulario.controls['claseCategoria'].setValue('');
         }
      }
   }

   onChangeEstatutoSocial(): void {
      this.visibleButtonEstatutoSocial = this.formulario.controls['estatutoSocial'].value.trim();
      if (this.visibleButtonEstatutoSocial === true) {
         this.funcionesMtcService
            .mensajeConfirmar('¿Declaro que la información adjunta en el archivo es verídica?', 'DECLARACIÓN')
            .catch(() => {
               this.visibleButtonEstatutoSocial = false;
               this.formulario.controls['estatutoSocial'].setValue(false);
            });
      } else {
         this.filePdfEstatutoSocialSeleccionado = null;
         this.pathPdfEstatutoSocialSeleccionado = null;
      }
   }

   onChangeInputEstatutoSocial(event): void {
      if (event.target.files.length === 0) {
         return;
      }
      if (event.target.files[0].type !== 'application/pdf') {
         event.target.value = '';
         this.funcionesMtcService.mensajeError('Solo puede adjuntar archivos PDF');
         return;
      }
      this.filePdfEstatutoSocialSeleccionado = event.target.files[0];
      event.target.value = '';
   }

   vistaPreviaEstatutoSocial(): void {
      if (this.pathPdfEstatutoSocialSeleccionado === null || this.filePdfEstatutoSocialSeleccionado !== null) {
         const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
         const urlPdf = URL.createObjectURL(this.filePdfEstatutoSocialSeleccionado);
         modalRef.componentInstance.pdfUrl = urlPdf;
         modalRef.componentInstance.titleModal = 'Vista Previa - Estatuto Social';
      } else {
         this.funcionesMtcService.mostrarCargando();

         this.visorPdfArchivosService.get(this.pathPdfEstatutoSocialSeleccionado)
            .subscribe(
               (file: Blob) => {
                  this.funcionesMtcService.ocultarCargando();
                  const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
                  const urlPdf = URL.createObjectURL(file);
                  modalRef.componentInstance.pdfUrl = urlPdf;
                  modalRef.componentInstance.titleModal = 'Vista Previa - Estatuto Social';
               },
               error => {
                  this.funcionesMtcService
                     .ocultarCargando()
                     .mensajeError('Problemas para descargar Pdf');
               }
            );
      }
   }

   getMaxLengthNumeroDocumento(opcion: string = 'RepresentanteLegal') {
      let tipoDocumento: string = "";
      if (opcion == "RepresentanteLegal") {
         tipoDocumento = this.formulario.controls['tipoDocumento'].value.trim();
      }
      else {
         tipoDocumento = this.formulario.controls['tipoDocumentoConductor'].value.trim();
      }

      if (tipoDocumento === '01')//N° de DNI
         return 8;
      else if (tipoDocumento === '04')//Carnet de extranjería
         return 12;
      else if (tipoDocumento === '05' || tipoDocumento === '06')//CPP/PTP
         return 9;
      return 0
   }

   inputNumeroDocumento(event = undefined) {
      if (event)
         event.target.value = event.target.value.replace(/[^0-9]/g, '');

      this.formulario.controls['nombreRepresentante'].setValue('');
      this.formulario.controls['apePaternoRepresentante'].setValue('');
      this.formulario.controls['apeMaternoRepresentante'].setValue('');
      this.formulario.controls['nombreRepresentante'].disable();
      this.formulario.controls['apePaternoRepresentante'].disable();
      this.formulario.controls['apeMaternoRepresentante'].disable();
   }

   buscarNumeroDocumento() {

      const tipoDocumento: string = this.formulario.controls['tipoDocumento'].value.trim();
      const numeroDocumento: string = this.formulario.controls['numeroDocumento'].value.trim();

      if (tipoDocumento.length === 0 || numeroDocumento.length === 0)
         return this.funcionesMtcService.mensajeError('Debe ingresar Tipo de Documento y/o Número de Documento');

      if (tipoDocumento === '01' && numeroDocumento.length !== 8)
         return this.funcionesMtcService.mensajeError('DNI debe tener 8 caracteres');

      if (tipoDocumento === '04' && numeroDocumento.length !== 9)
         return this.funcionesMtcService.mensajeError('Carnet de extranjería debe tener 9 caracteres');

      if (tipoDocumento === '05' && numeroDocumento.length !== 9)
         return this.funcionesMtcService.mensajeError('Carnet de Permiso Temp. Perman. debe tener 9 caracteres');

      if (tipoDocumento === '06' && numeroDocumento.length !== 9)
         return this.funcionesMtcService.mensajeError('Permiso Temp. Perman. debe tener 9 caracteres');

      const resultado = this.representanteLegal.find(representante => ('0' + representante.tipoDocumento.trim()).toString() === tipoDocumento && representante.nroDocumento.trim() === numeroDocumento);
      console.log(resultado);
      if (resultado) {//DNI
         /* this.esRepresentante = false;
        }else{
          this.esRepresentante = true;
           // return this.funcionesMtcService.mensajeError('Representante legal no encontrado');
        }*/
         this.funcionesMtcService.mostrarCargando();

         if (tipoDocumento === '01') {//DNI
            try {
               this.reniecService.getDni(numeroDocumento).subscribe(
                  (respuesta) => {
                     this.funcionesMtcService.ocultarCargando();

                     if (respuesta.reniecConsultDniResponse.listaConsulta.coResultado !== '0000') {
                        /*this.formulario.controls["nombreRepresentante"].enable();
                        this.formulario.controls["apePaternoRepresentante"].enable();
                        this.formulario.controls["apeMaternoRepresentante"].enable();*/
                        return this.funcionesMtcService.mensajeError('Número de documento no registrado en Reniec');
                     }
                     const datosPersona = respuesta.reniecConsultDniResponse.listaConsulta.datosPersona;
                     let ubigeo = datosPersona.ubigeo.split('/');
                     let cargo = resultado.cargo.split('-');
                     this.cargoRepresentanteLegal = cargo[cargo.length - 1].trim();
                     this.addPersona(tipoDocumento,
                        datosPersona.prenombres,
                        datosPersona.apPrimer,
                        datosPersona.apSegundo,
                        datosPersona.direccion,
                        ubigeo[2],
                        ubigeo[1],
                        ubigeo[0]);
                  },
                  (error) => {
                     this.funcionesMtcService.ocultarCargando().mensajeError('En este momento el servicio de RENIEC no se encuentra disponible. Vuelva a intentarlo más tarde.');
                     this.formulario.controls["nombreRepresentante"].enable();
                     this.formulario.controls["apePaternoRepresentante"].enable();
                     this.formulario.controls["apeMaternoRepresentante"].enable();
                  }
               );
            }
            catch {

            }
         } else if (tipoDocumento === '04') {//CARNÉ DE EXTRANJERÍA
            console.log("=====>");
            this.extranjeriaService.getCE(numeroDocumento).subscribe(
               (respuesta) => {
                  this.funcionesMtcService.ocultarCargando();

                  if (respuesta.CarnetExtranjeria.numRespuesta !== '0000')
                     return this.funcionesMtcService.mensajeError('Número de documento no registrado en Migraciones');

                  this.addPersona(tipoDocumento,
                     respuesta.CarnetExtranjeria.nombres,
                     respuesta.CarnetExtranjeria.primerApellido,
                     respuesta.CarnetExtranjeria.segundoApellido,
                     '',
                     '',
                     '',
                     '');
               },
               (error) => {
                  this.funcionesMtcService.ocultarCargando().mensajeError('En este momento el servicio de MIGRACIONES no se encuentra disponible. Vuelva a intentarlo más tarde.');
                  this.formulario.controls["nombreRepresentante"].enable();
                  this.formulario.controls["apePaternoRepresentante"].enable();
                  this.formulario.controls["apeMaternoRepresentante"].enable();
               }
            );
         } else if (tipoDocumento === '05' || tipoDocumento === '06') {//CPP
            this.funcionesMtcService.ocultarCargando();
            let apellidosNombres = resultado.nombresApellidos.split(' ');
            let tamano = apellidosNombres.length;
            let nombres: string = "";
            if(tamano>3){
               for(let i=3;i<tamano;i++){
                  nombres+=apellidosNombres[i]+" ";
               }
               apellidosNombres[2]+= " "+nombres;
            }
            this.addPersona(tipoDocumento,
               apellidosNombres[2],
               apellidosNombres[0],
               apellidosNombres[1],
               '',
               '',
               '',
               '');

            this.formulario.controls["nombreRepresentante"].enable();
            this.formulario.controls["apePaternoRepresentante"].enable();
            this.formulario.controls["apeMaternoRepresentante"].enable();
         }
      } else {
         this.esRepresentante = false;
         return this.funcionesMtcService.mensajeError('Representante legal no encontrado');
      }

   }

   addPersona(tipoDocumento: string, nombres: string, ap_paterno: string, ap_materno: string, direccion: string, distrito: string, provincia: string, departamento: string) {
      if(tipoDocumento=="05" || tipoDocumento=="06"  || tipoDocumento=="08" || tipoDocumento=="07"){
         this.funcionesMtcService.mensajeConfirmar(`Los datos ingresados corresponden a la persona ${nombres} ${ap_paterno} ${ap_materno}. ¿Está seguro de agregarlo?`)
         .then(() => {
            this.formulario.controls['nombreRepresentante'].setValue(nombres);
            this.formulario.controls['apePaternoRepresentante'].setValue(ap_paterno);
            this.formulario.controls['apeMaternoRepresentante'].setValue(ap_materno);
            this.formulario.controls['domicilioRepresentante'].setValue(direccion);
            this.formulario.controls['distritoRepresentante'].setValue(distrito);
            this.formulario.controls['provinciaRepresentante'].setValue(provincia);
            this.formulario.controls['departamentoRepresentante'].setValue(departamento);
         });
      }else{
         this.funcionesMtcService.mensajeConfirmar(`Los datos ingresados fueron validados por ${tipoDocumento === '01' ? 'RENIEC' : 'MIGRACIONES'} corresponden a la persona ${nombres} ${ap_paterno} ${ap_materno}. ¿Está seguro de agregarlo?`)
         .then(() => {
            this.formulario.controls['nombreRepresentante'].setValue(nombres);
            this.formulario.controls['apePaternoRepresentante'].setValue(ap_paterno);
            this.formulario.controls['apeMaternoRepresentante'].setValue(ap_materno);
            this.formulario.controls['domicilioRepresentante'].setValue(direccion);
            this.formulario.controls['distritoRepresentante'].setValue(distrito);
            this.formulario.controls['provinciaRepresentante'].setValue(provincia);
            this.formulario.controls['departamentoRepresentante'].setValue(departamento);
         });
      }
      
   }

   cargarDatos() {
      this.funcionesMtcService.mostrarCargando();

      this.formulario.controls["nombreRepresentante"].disable();
      this.formulario.controls["apePaternoRepresentante"].disable();
      this.formulario.controls["apeMaternoRepresentante"].disable();

      switch (this.seguridadService.getNameId()) {
         case '00001': this.tipoSolicitante = 'PN'; //persona natural
            this.formulario.controls['tipoDocumentoSolicitante'].setValue('DNI');
            this.tipoDocumentoSolicitante = '01';
            this.nombreTipoDocumentoSolicitante = "DNI";
            this.numeroDocumentoSolicitante = this.nroDocumentoLogin;
            this.nombreSolicitante = this.seguridadService.getUserName();
            break;

         case '00002': this.tipoSolicitante = 'PJ'; // persona juridica
            this.formulario.controls['tipoDocumentoSolicitante'].setValue('DNI');
            break;

         case '00004': this.tipoSolicitante = 'PE'; // persona extranjera
            this.nombreSolicitante = this.seguridadService.getUserName();

            switch (this.seguridadService.getTipoDocumento()) {
               case "00003": this.tipoDocumentoSolicitante = "04";
                  this.nombreTipoDocumentoSolicitante = "CE";
                  this.numeroDocumentoSolicitante = this.nroDocumentoLogin;
                  this.formulario.controls['tipoDocumentoSolicitante'].setValue('CARNET DE EXTRANJERIA');
                  break;
               case "00101": this.tipoDocumentoSolicitante = "05";
                  this.nombreTipoDocumentoSolicitante = "CARNÉ SOLICITANTE DE REFUGIO";
                  this.numeroDocumentoSolicitante = this.nroDocumentoLogin;
                  this.formulario.controls['tipoDocumentoSolicitante'].setValue('CARNÉ SOLICITANTE DE REFUGIO');
                  break;
               case "00102": this.tipoDocumentoSolicitante = "06";
                  this.nombreTipoDocumentoSolicitante = "CARNÉ DE PERMISO TEMPORAL DE PERMANENCIA";
                  this.numeroDocumentoSolicitante = this.nroDocumentoLogin;
                  this.formulario.controls['tipoDocumentoSolicitante'].setValue('CARNÉ DE PERMISO TEMPORAL DE PERMANENCIA');
                  break;
               case "00103": this.tipoDocumentoSolicitante = "07";
                  this.nombreTipoDocumentoSolicitante = "CARNÉ DE IDENTIFICACION";
                  this.numeroDocumentoSolicitante = this.nroDocumentoLogin;
                  this.formulario.controls['tipoDocumentoSolicitante'].setValue('CARNÉ DE IDENTIFICACION');
                  break;
            }
            break;

         case '00005': this.tipoSolicitante = 'PNR'; // persona natural con ruc
            if (this.nroDocumentoLogin.length == 8) {
               this.tipoDocumentoSolicitante = "01";
               this.nombreTipoDocumentoSolicitante = "DNI";
               this.formulario.controls['tipoDocumentoSolicitante'].setValue('DNI');
            }

            if (this.nroDocumentoLogin.length == 9) {
               this.tipoDocumentoSolicitante = "04";
               this.nombreTipoDocumentoSolicitante = "CE";
               this.formulario.controls['tipoDocumentoSolicitante'].setValue('CE');
            }
            this.numeroDocumentoSolicitante = this.nroDocumentoLogin;
            this.nombreSolicitante = this.seguridadService.getUserName();
            this.nroRuc = this.seguridadService.getCompanyCode();
            break;
      }

      if (this.dataInput != null && this.dataInput.movId > 0) {

         this.formularioTramiteService.get<any>(this.dataInput.tramiteReqId).subscribe(
            (dataFormulario: Formulario003_17_2Response) => {

               this.funcionesMtcService.ocultarCargando();
               const metaData: any = JSON.parse(dataFormulario.metaData);

               console.dir(metaData);
               this.id = dataFormulario.formularioId;
               this.filePdfPathName = metaData.pathName;
               this.pathPdfEstatutoSocialSeleccionado = metaData.seccion4.pathNameEstatutoSocial;

               if (this.activarPN) {
                  this.formulario.controls["nombresPersona"].setValue(metaData.seccion3.nombresApellidos);
                  this.formulario.controls["tipoDocumentoSolicitante"].setValue(this.nombreTipoDocumentoSolicitante);
                  this.formulario.controls["nroDocumentoSolicitante"].setValue(metaData.seccion3.numeroDocumento);
                  this.formulario.controls["rucPersona"].setValue(metaData.seccion3.ruc);
                  this.formulario.controls["domicilioPersona"].setValue(metaData.seccion3.domicilioLegal);
                  this.formulario.controls["distritoPersona"].setValue(metaData.seccion3.distrito);
                  this.formulario.controls["provinciaPersona"].setValue(metaData.seccion3.provincia);
                  this.formulario.controls["departamentoPersona"].setValue(metaData.seccion3.departamento);
                  this.formulario.controls["correoPersona"].setValue(metaData.seccion3.email);
                  this.formulario.controls["celularPersona"].setValue(metaData.seccion3.celular);
                  this.formulario.controls["telefonoPersona"].setValue(metaData.seccion3.telefono);


                  this.formulario.controls["nroDocumentoSolicitante"].disable();
                  this.formulario.controls["tipoDocumentoSolicitante"].disable();
                  this.formulario.controls["rucPersona"].disable();
                  this.formulario.controls["nombresPersona"].disable();
                  this.formulario.controls["domicilioPersona"].disable();
                  this.formulario.controls["distritoPersona"].disable();
                  this.formulario.controls["provinciaPersona"].disable();
                  this.formulario.controls["departamentoPersona"].disable();
               }

               if (this.activarPJ) {
                  this.formulario.controls["ruc"].setValue(metaData.seccion3.numeroDocumento);
                  this.formulario.controls["razonSocial"].setValue(metaData.seccion3.razonSocial);
                  this.formulario.controls["domicilio"].setValue(metaData.seccion3.domicilioLegal);
                  this.formulario.controls["distrito"].setValue(metaData.seccion3.distrito);
                  this.formulario.controls["provincia"].setValue(metaData.seccion3.provincia);
                  this.formulario.controls["departamento"].setValue(metaData.seccion3.departamento);
                  this.formulario.controls["telefonoRepresentante"].setValue(metaData.seccion3.telefono);
                  this.formulario.controls["celularRepresentante"].setValue(metaData.seccion3.celular);
                  this.formulario.controls["correoRepresentante"].setValue(metaData.seccion3.email);
                  //this.formulario.controls["marcadoObligatorio"].setValue(metaData.DatosSolicitante.MarcadoObligatorio);
                  this.formulario.controls["tipoDocumento"].setValue(metaData.seccion3.RepresentanteLegal.tipoDocumento.id);
                  this.formulario.controls["numeroDocumento"].setValue(metaData.seccion3.RepresentanteLegal.numeroDocumento);
                  this.formulario.controls["nombreRepresentante"].setValue(metaData.seccion3.RepresentanteLegal.nombres);
                  this.formulario.controls["apePaternoRepresentante"].setValue(metaData.seccion3.RepresentanteLegal.apellidoPaterno);
                  this.formulario.controls["apeMaternoRepresentante"].setValue(metaData.seccion3.RepresentanteLegal.apellidoMaterno);
                  this.formulario.controls["domicilioRepresentante"].setValue(metaData.seccion3.RepresentanteLegal.domicilioLegal);
                  this.formulario.controls['distritoRepresentante'].setValue(metaData.seccion3.RepresentanteLegal.distrito);
                  this.formulario.controls['provinciaRepresentante'].setValue(metaData.seccion3.RepresentanteLegal.provincia);
                  this.formulario.controls['departamentoRepresentante'].setValue(metaData.seccion3.RepresentanteLegal.departamento);
                  this.formulario.controls['oficinaRepresentante'].setValue(metaData.seccion3.RepresentanteLegal.oficinaRegistral.id);
                  this.formulario.controls['partidaRepresentante'].setValue(metaData.seccion3.RepresentanteLegal.partida);
                  this.formulario.controls['asientoRepresentante'].setValue(metaData.seccion3.RepresentanteLegal.asiento);

               }
               this.formulario.controls['oficinaEmpresa'].setValue(metaData.seccion4.oficina_registral.id);
               this.formulario.controls['partidaEmpresa'].setValue(metaData.seccion4.partida_registral);
               this.formulario.controls['asientoEmpresa'].setValue(metaData.seccion4.asiento);

               if (metaData.seccion4.opcion1)
                  this.formulario.controls['tipoServicio'].setValue("1");
               if (metaData.seccion4.opcion2)
                  this.formulario.controls['tipoServicio'].setValue("2");
               if (metaData.seccion4.opcion3)
                  this.formulario.controls['tipoServicio'].setValue("3");
               if (metaData.seccion4.opcion4)
                  this.formulario.controls['tipoServicio'].setValue("4");

               this.formulario.controls["declaracion_61"].setValue(metaData.seccion6.declaracion_61);
               this.formulario.controls["declaracion_62"].setValue(metaData.seccion6.declaracion_62);
               this.formulario.controls["declaracion_63"].setValue(metaData.seccion6.declaracion_63);
               this.formulario.controls["declaracion_64"].setValue(metaData.seccion6.declaracion_64);
               this.formulario.controls["declaracion_65"].setValue(metaData.seccion6.declaracion_65);
               this.formulario.controls["declaracion_66"].setValue(metaData.seccion6.declaracion_66);
               this.formulario.controls["declaracion_67"].setValue(metaData.seccion6.declaracion_67);
               this.formulario.controls["declaracion_68"].setValue(metaData.seccion6.declaracion_68);
               this.formulario.controls["declaracion_69"].setValue(metaData.seccion6.declaracion_69);
               if (metaData.DatosSolicitante != null) {
                  setTimeout(() => {
                     this.formulario.controls["oficinaRegistral"].setValue(metaData.DatosSolicitante.RepresentanteLegal.OficinaRegistral.id);
                  });
               }

               let i = 0;
               if (this.habilitarSeccion5) {
                  for (i = 0; i < metaData.seccion5.RelacionConductores.length; i++) {
                     this.conductores.push({
                        tipoDocumentoConductor: metaData.seccion5.RelacionConductores[i].tipoDocumentoConductor,
                        numeroDocumentoConductor: metaData.seccion5.RelacionConductores[i].numeroDocumentoConductor,
                        nombresApellidos: metaData.seccion5.RelacionConductores[i].nombresApellidos,
                        edad: metaData.seccion5.RelacionConductores[i].edad,
                        numeroLicencia: metaData.seccion5.RelacionConductores[i].numeroLicencia,
                        categoria: metaData.seccion5.RelacionConductores[i].categoria,
                        subcategoria: metaData.seccion5.RelacionConductores[i].subCategoria
                     } as Conductor);
                  }
               }

            }, (error) => {
               this.funcionesMtcService.ocultarCargando().mensajeError('Problemas para recuperar los datos guardados');
            }
         );
      } else {

         switch (this.tipoSolicitante) {
            case "PN":
               console.log(this.datosUsuarioLogin);
               this.funcionesMtcService.ocultarCargando();
               this.formulario.controls["nroDocumentoSolicitante"].setValue(this.numeroDocumentoSolicitante.trim());
               this.formulario.controls["rucPersona"].setValue('');
               this.formulario.controls["nombresPersona"].setValue(this.datosUsuarioLogin.nombres + " " + this.datosUsuarioLogin.apePaterno.trim() + " " + this.datosUsuarioLogin.apeMaterno.trim());
               this.formulario.controls["domicilioPersona"].setValue(this.datosUsuarioLogin.direccion.trim());
               this.formulario.controls["distritoPersona"].setValue(this.datosUsuarioLogin.distrito.trim());
               this.formulario.controls["provinciaPersona"].setValue(this.datosUsuarioLogin.provincia.trim());
               this.formulario.controls["departamentoPersona"].setValue(this.datosUsuarioLogin.departamento.trim());
               this.formulario.controls['telefonoPersona'].setValue(this.datosUsuarioLogin.telefono.trim());
               this.formulario.controls['celularPersona'].setValue(this.datosUsuarioLogin.celular.trim());
               this.formulario.controls['correoPersona'].setValue(this.datosUsuarioLogin.correo.trim());

               this.formulario.controls["nroDocumentoSolicitante"].disable();
               this.formulario.controls["tipoDocumentoSolicitante"].disable();
               this.formulario.controls["rucPersona"].disable();
               this.formulario.controls["nombresPersona"].disable();
               this.formulario.controls["domicilioPersona"].disable();
               this.formulario.controls["distritoPersona"].disable();
               this.formulario.controls["provinciaPersona"].disable();
               this.formulario.controls["departamentoPersona"].disable();
               //this.formulario.controls['telefonoPersona'].disable();
               //this.formulario.controls['celularPersona'].disable();
               //this.formulario.controls['correoPersona'].disable();

               break;

            case "PJ": this.sunatService.getDatosPrincipales(this.nroRuc).subscribe(
               (response) => {
                  this.funcionesMtcService.ocultarCargando();
                  this.formulario.controls['razonSocial'].setValue(response.razonSocial.trim());
                  this.formulario.controls['ruc'].setValue(response.nroDocumento.trim());
                  this.formulario.controls['domicilio'].setValue(response.domicilioLegal.trim());
                  this.formulario.controls['distrito'].setValue(response.nombreDistrito.trim());
                  this.formulario.controls['provincia'].setValue(response.nombreProvincia.trim());
                  this.formulario.controls['departamento'].setValue(response.nombreDepartamento.trim());
                  this.formulario.controls['telefonoRepresentante'].setValue(response.telefono.trim());
                  this.formulario.controls['celularRepresentante'].setValue(response.celular.trim());
                  this.formulario.controls['correoRepresentante'].setValue(response.correo.trim());

                  this.formulario.controls['razonSocial'].disable();
                  this.formulario.controls['ruc'].disable();
                  this.formulario.controls['domicilio'].disable();
                  this.formulario.controls["distrito"].disable();
                  this.formulario.controls["provincia"].disable();
                  this.formulario.controls["departamento"].disable();

                  this.representanteLegal = response.representanteLegal;
               }, (error) => {
                  this.funcionesMtcService.ocultarCargando().mensajeError('Error al consultar el Servicio de Sunat');
                  this.formulario.controls['razonSocial'].setValue(this.razonSocial);
                  this.formulario.controls['ruc'].setValue(this.nroRuc);

                  this.formulario.controls["domicilio"].enable();
                  this.formulario.controls["distrito"].enable();
                  this.formulario.controls["provincia"].enable();
                  this.formulario.controls["departamento"].enable();
               });
               break;

            case "PNR": this.funcionesMtcService.ocultarCargando();
               this.formulario.controls["nroDocumentoSolicitante"].setValue(this.numeroDocumentoSolicitante);
               this.formulario.controls["rucPersona"].setValue(this.nroRuc.trim());
               this.formulario.controls["nombresPersona"].setValue(this.datosUsuarioLogin.nombres + " " + this.datosUsuarioLogin.apePaterno.trim() + " " + this.datosUsuarioLogin.apeMaterno.trim());
               this.formulario.controls["domicilioPersona"].setValue(this.datosUsuarioLogin.direccion.trim());
               this.formulario.controls["distritoPersona"].setValue(this.datosUsuarioLogin.distrito.trim());
               this.formulario.controls["provinciaPersona"].setValue(this.datosUsuarioLogin.provincia.trim());
               this.formulario.controls["departamentoPersona"].setValue(this.datosUsuarioLogin.departamento.trim());
               this.formulario.controls['telefonoPersona'].setValue(this.datosUsuarioLogin.telefono.trim());
               this.formulario.controls['celularPersona'].setValue(this.datosUsuarioLogin.celular.trim());
               this.formulario.controls['correoPersona'].setValue(this.datosUsuarioLogin.correo.trim());

               this.formulario.controls["nroDocumentoSolicitante"].disable();
               this.formulario.controls["tipoDocumentoSolicitante"].disable();
               this.formulario.controls["rucPersona"].disable();
               this.formulario.controls["nombresPersona"].disable();
               this.formulario.controls["domicilioPersona"].disable();
               this.formulario.controls["distritoPersona"].disable();
               this.formulario.controls["provinciaPersona"].disable();
               this.formulario.controls["departamentoPersona"].disable();
               break;

            case "PE": this.funcionesMtcService.ocultarCargando();
               this.formulario.controls["nroDocumentoSolicitante"].setValue(this.numeroDocumentoSolicitante);
               this.formulario.controls["rucPersona"].setValue(this.nroRuc.trim());
               this.formulario.controls["nombresPersona"].setValue(this.datosUsuarioLogin.nombres + " " + this.datosUsuarioLogin.apePaterno.trim() + " " + this.datosUsuarioLogin.apeMaterno.trim());
               this.formulario.controls["domicilioPersona"].setValue(this.datosUsuarioLogin.direccion.trim());
               this.formulario.controls["distritoPersona"].setValue(this.datosUsuarioLogin.distrito.trim());
               this.formulario.controls["provinciaPersona"].setValue(this.datosUsuarioLogin.provincia.trim());
               this.formulario.controls["departamentoPersona"].setValue(this.datosUsuarioLogin.departamento.trim());
               this.formulario.controls['telefonoPersona'].setValue(this.datosUsuarioLogin.telefono.trim());
               this.formulario.controls['celularPersona'].setValue(this.datosUsuarioLogin.celular.trim());
               this.formulario.controls['correoPersona'].setValue(this.datosUsuarioLogin.correo.trim());

               this.formulario.controls["nroDocumentoSolicitante"].disable();
               this.formulario.controls["tipoDocumentoSolicitante"].disable();
               this.formulario.controls["rucPersona"].disable();
               this.formulario.controls["nombresPersona"].disable();
               this.formulario.controls["domicilioPersona"].disable();
               this.formulario.controls["distritoPersona"].disable();
               this.formulario.controls["provinciaPersona"].disable();
               this.formulario.controls["departamentoPersona"].disable();
               break;
         }
      }
   }

   recuperarDatosUsuario() {
      this.reniecService.getDni(this.nroDocumentoLogin).subscribe(
         (response) => {
            const datos = response.reniecConsultDniResponse.listaConsulta.datosPersona;
            if (datos.prenombres !== null && datos.prenombres !== '')
               this.nombreUsuario = (datos.prenombres.trim() + ' ' + datos.apPrimer.trim() + ' ' + datos.apSegundo.trim());
         },
         (error) => {
            this.nombreUsuario = "";
         }
      );
   }

   private confirmarConductor(datos: string, licencia: string, claseCategoria: string): void {
      this.funcionesMtcService
         .mensajeConfirmar(`Los datos fueron validados por el SNC y corresponden a la persona ${datos}. ¿Está seguro de agregarlo?`)
         .then(() => {
            this.formulario.controls.nombresApellidos.setValue(datos);
            this.formulario.controls.numeroLicencia.setValue(licencia);
            this.formulario.controls.claseCategoria.setValue(claseCategoria);
         });
   }

   async buscarNumeroLicencia(dato: DatosPersona): Promise<void> {

      const tipoDocumento = 2;
      const numeroDocumento: string = this.formulario.controls.numeroDocumentoConductor.value.trim();

      if (tipoDocumento === 2 && numeroDocumento.length !== 8) {
         this.funcionesMtcService.mensajeError('DNI debe tener 8 caracteres');
         return;
      }

      this.funcionesMtcService.mostrarCargando();
      try {
         const respuesta = await this.mtcService.getLicenciasConducir(tipoDocumento, numeroDocumento).toPromise();
         this.funcionesMtcService.ocultarCargando();
         const datos: any = respuesta[0];
         console.log('DATOS getLicenciasConducir:', JSON.stringify(datos, null, 10));

         if (datos.GetDatosLicenciaMTCResult.CodigoRespuesta === 'MSJ01') {
            return this.funcionesMtcService.mensajeError('El número de documento no cuenta con licencia de conducir');
         }

         if (datos.GetDatosLicenciaMTCResult.CodigoRespuesta === 'MSJ02' || datos.GetDatosLicenciaMTCResult.CodigoRespuesta === 'MSJ03') {
            return this.funcionesMtcService.mensajeError('El número de documento no cuenta con licencia de conducir');
         }

         if (datos.GetDatosLicenciaMTCResult.Licencia.Estadolicencia === 'Vencida') {
            return this.funcionesMtcService.mensajeError('Su licencia esta  Vencida');
         }

         if (datos.GetDatosLicenciaMTCResult.Licencia.Estadolicencia === 'Bloqueado') {
            return this.funcionesMtcService.mensajeError('Su licencia esta  Bloqueado');
         }

         // VALIDAMOS LA CATEGORIA DE LAS LICENCIAS DE CONDUCIR
         if (this.paValidaLicenciaConductor.indexOf(this.codigoProcedimientoTupa) > -1) {
            let categoriaValida = true;
            const categoriaConductor = datos.GetDatosLicenciaMTCResult.Licencia.Categoria?.trim() ?? '';
            console.log('categoriaConductor:', categoriaConductor);
            if (categoriaConductor !== 'A IIIa') {
               categoriaValida = false;
            }
            /*  
            if (!categoriaValida) {
              this.funcionesMtcService.mensajeError('La licencia de conducir de clase/categoría '+ categoriaConductor + ' no corresponde al servicio solicitado.');
              return;
            }*/
         }
         const ApellidoPaterno = datos.GetDatosLicenciaMTCResult.Licencia.ApellidoPaterno.trim();
         const ApellidoMaterno = datos.GetDatosLicenciaMTCResult.Licencia.ApellidoMaterno.trim();
         const Nombres = datos.GetDatosLicenciaMTCResult.Licencia.Nombre.trim();
         const Licencia = datos.GetDatosLicenciaMTCResult.Licencia.NroLicencia.trim();
         const ClaseCategoria = datos.GetDatosLicenciaMTCResult.Licencia.Categoria?.trim();

         this.confirmarConductor(`${ApellidoPaterno} ${ApellidoMaterno} ${Nombres}`, Licencia, ClaseCategoria);
      } catch (error) {
         console.error(error);
         this.funcionesMtcService
            .ocultarCargando()
            .mensajeError('Error al consultar el Servicio MTC Licencias Conducir');
      }
   }
   /*
   async validaConductor(dato: DatosPersona): Promise<void> {
     const dni = this.formulario.get('numeroDni').value;
     try {
       const data: any = await this.renatService.estaEnNomina(this.ruc, dni).toPromise();
       if (data === 0) {
         this.funcionesMtcService.mensajeError('Conductor no está en nómina');
         return;
       }
       this.buscarNumeroLicencia(dato);
     } catch (error) {
       this.funcionesMtcService
         .ocultarCargando()
         .mensajeError('Problemas al consultar servicio.');
     }
   }*/

   async addConductor(): Promise<void> {
      if (
         this.formulario.get('numeroDocumentoConductor').value.trim() === '' ||
         this.formulario.get('nombresApellidos').value.trim() === '' ||
         this.formulario.get('numeroLicencia').value.trim() === ''
      ) {
         this.funcionesMtcService.mensajeError('Debe ingresar los campos faltantes');
         return;
      }
      const numeroDocumentoConductor = this.formulario.get('numeroDocumentoConductor').value;
      const indexFound = this.conductores.findIndex(item => item.numeroDocumentoConductor === numeroDocumentoConductor);

      if (indexFound !== -1) {
         if (indexFound !== this.recordIndexToEditConductores) {
            this.funcionesMtcService.mensajeError('El conductor ya se encuentra registrado');
            return;
         }
      }
      const tipoDocumentoConductor = this.formulario.get('tipoDocumentoConductor').value;
      const nombresApellidos = this.formulario.get('nombresApellidos').value;
      const edad = '';
      const numeroLicencia = this.formulario.get('numeroLicencia').value;
      const categoria = this.formulario.get('claseCategoria').value;
      const subcategoria = '';

      if (this.recordIndexToEditConductores === -1) {
         console.log("nuevo");
         this.conductores.push({
            nombresApellidos,
            tipoDocumentoConductor,
            numeroDocumentoConductor,
            edad,
            numeroLicencia,
            categoria,
            subcategoria
         });
      } else {
         this.conductores[this.recordIndexToEditConductores].nombresApellidos = nombresApellidos;
         this.conductores[this.recordIndexToEditConductores].tipoDocumentoConductor = tipoDocumentoConductor;
         this.conductores[this.recordIndexToEditConductores].numeroDocumentoConductor = numeroDocumentoConductor;
         this.conductores[this.recordIndexToEditConductores].edad = edad;
         this.conductores[this.recordIndexToEditConductores].numeroLicencia = numeroLicencia;
         this.conductores[this.recordIndexToEditConductores].categoria = categoria;
         this.conductores[this.recordIndexToEditConductores].subcategoria = subcategoria;
      }

      this.clearConductorData();
   }

   private clearConductorData(): void {
      this.recordIndexToEditConductores = -1;

      this.formulario.controls.nombresApellidos.setValue('');
      this.formulario.controls.numeroDocumentoConductor.setValue('');
      this.formulario.controls.numeroLicencia.setValue('');
      this.formulario.controls.claseCategoria.setValue('');
   }

   editConductor(conductor: any, i: number): void {
      if (this.recordIndexToEditConductores !== -1) {
         return;
      }
      this.recordIndexToEditConductores = i;
      this.formulario.controls.nombresApellidos.setValue(conductor.nombresApellidos);
      this.formulario.controls.tipoDocumentoConductor.setValue(conductor.tipoDocumentoConductor);
      this.formulario.controls.numeroDocumentoConductor.setValue(conductor.numeroDocumentoConductor);
      this.formulario.controls.numeroLicencia.setValue(conductor.numeroLicencia);
      this.formulario.controls.claseCategoria.setValue(conductor.categoria);
   }

   deleteConductor(conductor: any, i: number): void {
      if (this.recordIndexToEditConductores === -1) {
         this.funcionesMtcService
            .mensajeConfirmar('¿Está seguro de eliminar el registro seleccionado?')
            .then(() => {
               this.conductores.splice(i, 1);
            });
      }
   }

   soloNumeros(event) {
      event.target.value = event.target.value.replace(/[^0-9]/g, '');
   }

   guardarFormulario() {

      if (this.CIIU === false)
         return this.funcionesMtcService.mensajeError('La actividad principal del administrado no corresponde al procedimiento solicitado.');

      if (this.formulario.invalid === true)
         return this.funcionesMtcService.mensajeError('Debe ingresar todos los campos obligatorios');

      if (this.activarEstatuto) {
         if (this.activarPJ && !this.filePdfEstatutoSocialSeleccionado && !this.pathPdfEstatutoSocialSeleccionado) {
            this.funcionesMtcService.mensajeError('Debe adjuntar el Estatuto Social.');
            return;
         }
      }

      if (this.conductores.length === 0 && this.RelacionConductores) {
         this.funcionesMtcService.mensajeError('Debe ingresar al menos un conductor habilitado.');
         return;
      }

      // SECCION (Relación de Conductores)
      const relacionConductores: Conductor[] = this.conductores.map(conductor => {
         return {
            tipoDocumentoConductor: conductor.tipoDocumentoConductor,
            numeroDocumentoConductor: conductor.numeroDocumentoConductor,
            nombresApellidos: conductor.nombresApellidos,
            edad: '',
            numeroLicencia: conductor.numeroLicencia,
            categoria: conductor.categoria,
            subcategoria: conductor.subcategoria
         } as Conductor;
      });

      //const fecha_pago_aux= this.formulario.controls['fecha_pago'].value;
      //let representante=this.formulario.controls['nombre_representante'].value;

      let oficinaRepresentante = this.formulario.controls['oficinaRepresentante'].value;
      let oficinaEmpresa = this.formulario.controls['oficinaEmpresa'].value;
      /*
      if (this.tipoPersona===2 && (representante==="" || partida==="" || oficina==="")){
        //verificar que ingrese oficina, partida y representante
        return  this.funcionesMtcService.mensajeError('Debe ingresar todos los campos');
      }*/
      //const fecha_pago_aux= parseDate(this.formulario.controls['fecha_Pago'].value.toStringFecha());
      //const fecha_pago_aux= this.formulario.controls['fecha_pago'].value.toStringFecha();

      let dataGuardar: Formulario003_17_2Request = new Formulario003_17_2Request();

      dataGuardar.id = this.id;
      dataGuardar.codigo = 'F003-17.2';
      dataGuardar.formularioId = 2;
      dataGuardar.codUsuario = this.nroDocumentoLogin;
      dataGuardar.idTramiteReq = this.dataInput.tramiteReqId,
         dataGuardar.estado = 1;
      dataGuardar.metaData.seccion1.dstt_025 = (this.codigoProcedimientoTupa === "DSTT-025" ? "1" : "0");
      dataGuardar.metaData.seccion1.dstt_026 = (this.codigoProcedimientoTupa === "DSTT-026" ? "1" : "0");
      dataGuardar.metaData.seccion1.dstt_027 = (this.codigoProcedimientoTupa === "DSTT-027" ? "1" : "0");
      dataGuardar.metaData.seccion1.dstt_028 = (this.codigoProcedimientoTupa === "DSTT-028" ? "1" : "0");
      dataGuardar.metaData.seccion1.dstt_029 = (this.codigoProcedimientoTupa === "DSTT-029" ? "1" : "0");
      dataGuardar.metaData.seccion1.dstt_030 = (this.codigoProcedimientoTupa === "DSTT-030" ? "1" : "0");
      dataGuardar.metaData.seccion1.dstt_031 = (this.codigoProcedimientoTupa === "DSTT-031" ? "1" : "0");
      dataGuardar.metaData.seccion1.dstt_032 = (this.codigoProcedimientoTupa === "DSTT-032" ? "1" : "0");
      dataGuardar.metaData.seccion1.dstt_033 = (this.codigoProcedimientoTupa === "DSTT-033" ? "1" : "0");
      dataGuardar.metaData.seccion1.dstt_034 = (this.codigoProcedimientoTupa === "DSTT-034" ? "1" : "0");
      dataGuardar.metaData.seccion1.dstt_035 = (this.codigoProcedimientoTupa === "DSTT-035" ? "1" : "0");
      dataGuardar.metaData.seccion1.dstt_036 = (this.codigoProcedimientoTupa === "DSTT-036" ? "1" : "0");
      dataGuardar.metaData.seccion1.dstt_037 = (this.codigoProcedimientoTupa === "DSTT-037" ? "1" : "0");
      dataGuardar.metaData.seccion1.dstt_038 = (this.codigoProcedimientoTupa === "DSTT-038" ? "1" : "0");
      dataGuardar.metaData.seccion1.dstt_039 = (this.codigoProcedimientoTupa === "DSTT-039" ? "1" : "0");
      dataGuardar.metaData.seccion1.dstt_040 = (this.codigoProcedimientoTupa === "DSTT-040" ? "1" : "0");
      dataGuardar.metaData.seccion1.dstt_041 = (this.codigoProcedimientoTupa === "DSTT-041" ? "1" : "0");
      dataGuardar.metaData.seccion1.dstt_042 = (this.codigoProcedimientoTupa === "DSTT-042" ? "1" : "0");
      dataGuardar.metaData.seccion1.dstt_043 = (this.codigoProcedimientoTupa === "DSTT-043" ? "1" : "0");
      dataGuardar.metaData.seccion3.tipoSolicitante = this.tipoSolicitante;
      dataGuardar.metaData.seccion3.nombresApellidos = (this.tipoSolicitante === 'PN' || this.tipoSolicitante === 'PNR' || this.tipoSolicitante === 'PE' ? this.formulario.controls['nombresPersona'].value : '');
      dataGuardar.metaData.seccion3.tipoDocumento = (this.tipoSolicitante === "PJ" ? this.formulario.controls['tipoDocumento'].value : this.tipoDocumentoSolicitante); //codDocumento
      dataGuardar.metaData.seccion3.numeroDocumento = (this.tipoSolicitante === "PJ" ? this.formulario.controls['ruc'].value : this.formulario.controls['nroDocumentoSolicitante'].value); //nroDocumento
      dataGuardar.metaData.seccion3.ruc = (this.tipoSolicitante === "PJ" ? "" : this.formulario.controls['rucPersona'].value);
      dataGuardar.metaData.seccion3.razonSocial = (this.tipoSolicitante === 'PJ' ? this.formulario.controls['razonSocial'].value : '');
      dataGuardar.metaData.seccion3.domicilioLegal = (this.tipoSolicitante === 'PJ' ? this.formulario.controls['domicilio'].value : this.formulario.controls['domicilioPersona'].value);
      dataGuardar.metaData.seccion3.distrito = (this.tipoSolicitante === 'PJ' ? this.formulario.controls['distrito'].value : this.formulario.controls['distritoPersona'].value);
      dataGuardar.metaData.seccion3.provincia = (this.tipoSolicitante === 'PJ' ? this.formulario.controls['provincia'].value : this.formulario.controls['provinciaPersona'].value);
      dataGuardar.metaData.seccion3.departamento = (this.tipoSolicitante === 'PJ' ? this.formulario.controls['departamento'].value : this.formulario.controls['departamentoPersona'].value);
      dataGuardar.metaData.seccion3.representanteLegal.nombres = this.formulario.controls['nombreRepresentante'].value;
      dataGuardar.metaData.seccion3.representanteLegal.apellidoPaterno = this.formulario.controls['apePaternoRepresentante'].value;
      dataGuardar.metaData.seccion3.representanteLegal.apellidoMaterno = this.formulario.controls['apeMaternoRepresentante'].value;
      dataGuardar.metaData.seccion3.representanteLegal.tipoDocumento.id = this.formulario.controls['tipoDocumento'].value;
      dataGuardar.metaData.seccion3.representanteLegal.tipoDocumento.documento = (this.tipoSolicitante === "PJ" ? this.listaTiposDocumentos.filter(item => item.id == this.formulario.get('tipoDocumento').value)[0].documento : "");
      dataGuardar.metaData.seccion3.representanteLegal.numeroDocumento = this.formulario.controls['numeroDocumento'].value;
      dataGuardar.metaData.seccion3.representanteLegal.domicilioLegal = this.formulario.controls['domicilioRepresentante'].value;
      dataGuardar.metaData.seccion3.representanteLegal.oficinaRegistral.id = oficinaRepresentante;
      dataGuardar.metaData.seccion3.representanteLegal.oficinaRegistral.descripcion = (this.tipoSolicitante === "PJ" ? this.oficinasRegistral.filter(item => item.value == oficinaRepresentante)[0].text : "");
      dataGuardar.metaData.seccion3.representanteLegal.partida = this.formulario.controls['partidaRepresentante'].value;
      dataGuardar.metaData.seccion3.representanteLegal.asiento = this.formulario.controls['asientoRepresentante'].value;
      dataGuardar.metaData.seccion3.representanteLegal.distrito = this.formulario.controls['distritoRepresentante'].value;
      dataGuardar.metaData.seccion3.representanteLegal.provincia = this.formulario.controls['provinciaRepresentante'].value;
      dataGuardar.metaData.seccion3.representanteLegal.departamento = this.formulario.controls['departamentoRepresentante'].value;
      dataGuardar.metaData.seccion3.representanteLegal.cargo = this.cargoRepresentanteLegal;
      dataGuardar.metaData.seccion3.telefono = (this.tipoSolicitante === 'PJ' ? this.formulario.controls['telefonoRepresentante'].value : this.formulario.controls['telefonoPersona'].value);
      dataGuardar.metaData.seccion3.celular = (this.tipoSolicitante === 'PJ' ? this.formulario.controls['celularRepresentante'].value : this.formulario.controls['celularPersona'].value);
      dataGuardar.metaData.seccion3.email = (this.tipoSolicitante === 'PJ' ? this.formulario.controls['correoRepresentante'].value : this.formulario.controls['correoPersona'].value);
      dataGuardar.metaData.seccion4.opcion1 = (this.formulario.controls['tipoServicio'].value == "1" ? true : false);
      dataGuardar.metaData.seccion4.opcion2 = (this.formulario.controls['tipoServicio'].value == "2" ? true : false);
      dataGuardar.metaData.seccion4.opcion3 = (this.formulario.controls['tipoServicio'].value == "3" ? true : false);
      dataGuardar.metaData.seccion4.opcion4 = (this.formulario.controls['tipoServicio'].value == "4" ? true : false);
      dataGuardar.metaData.seccion4.oficina_registral.id = oficinaEmpresa;
      dataGuardar.metaData.seccion4.oficina_registral.descripcion = (this.tipoSolicitante === "PJ" ? this.oficinasRegistral.filter(item => item.value == oficinaEmpresa)[0].text : "");
      dataGuardar.metaData.seccion4.partida_registral = (this.tipoSolicitante === "PJ" ? this.formulario.controls['partidaEmpresa'].value : "");
      dataGuardar.metaData.seccion4.asiento = (this.tipoSolicitante === "PJ" ? this.formulario.controls['asientoEmpresa'].value : "");

      dataGuardar.metaData.seccion4.fileEstatutoSocial = this.filePdfEstatutoSocialSeleccionado;
      dataGuardar.metaData.seccion4.pathNameEstatutoSocial = this.pathPdfEstatutoSocialSeleccionado;

      dataGuardar.metaData.seccion5.relacionConductores = relacionConductores;

      dataGuardar.metaData.seccion6.declaracion_61 = this.formulario.controls['declaracion_61'].value;
      dataGuardar.metaData.seccion6.declaracion_62 = this.formulario.controls['declaracion_62'].value;
      dataGuardar.metaData.seccion6.declaracion_63 = this.formulario.controls['declaracion_63'].value;
      dataGuardar.metaData.seccion6.declaracion_64 = this.formulario.controls['declaracion_64'].value;
      dataGuardar.metaData.seccion6.declaracion_65 = this.formulario.controls['declaracion_65'].value;
      dataGuardar.metaData.seccion6.declaracion_66 = this.formulario.controls['declaracion_66'].value;
      dataGuardar.metaData.seccion6.declaracion_67 = this.formulario.controls['declaracion_67'].value;
      dataGuardar.metaData.seccion6.declaracion_68 = this.formulario.controls['declaracion_68'].value;
      dataGuardar.metaData.seccion6.declaracion_69 = this.formulario.controls['declaracion_69'].value;

      dataGuardar.metaData.seccion7.tipoDocumentoSolicitante = (this.tipoSolicitante === 'PJ' ? this.formulario.controls['tipoDocumento'].value : this.tipoDocumentoSolicitante);
      dataGuardar.metaData.seccion7.nombreTipoDocumentoSolicitante = (this.tipoSolicitante === 'PJ' ? this.listaTiposDocumentos.filter(item => item.id == this.formulario.get('tipoDocumento').value)[0].documento : this.formulario.controls['tipoDocumentoSolicitante'].value);
      dataGuardar.metaData.seccion7.numeroDocumentoSolicitante = (this.tipoSolicitante === 'PJ' ? this.formulario.controls['numeroDocumento'].value : this.formulario.controls['nroDocumentoSolicitante'].value);
      dataGuardar.metaData.seccion7.nombresApellidosSolicitante = (this.tipoSolicitante === 'PJ' ? this.formulario.controls['nombreRepresentante'].value + ' ' + this.formulario.controls['apePaternoRepresentante'].value + ' ' + this.formulario.controls['apeMaternoRepresentante'].value : this.formulario.controls['nombresPersona'].value);

      const dataGuardarFormData = this.funcionesMtcService.jsonToFormData(dataGuardar);

      this.funcionesMtcService.mensajeConfirmar(`¿Está seguro de ${this.id === 0 ? 'guardar' : 'modificar'} los datos ingresados?`)
         .then(() => {

            console.log(JSON.stringify(dataGuardar));

            if (this.id === 0) {
               this.funcionesMtcService.mostrarCargando();
               //GUARDAR:
               this.formularioService.post<any>(dataGuardarFormData)
                  .subscribe(
                     data => {
                        this.funcionesMtcService.ocultarCargando();
                        this.id = data.id;
                        this.uriArchivo = data.uriArchivo;
                        console.log(this.dataInput.tramiteReqId);
                        //this.idTramiteReq=data.idTramiteReq;
                        this.graboUsuario = true;
                        //this.funcionesMtcService.mensajeOk(`Los datos fueron guardados exitosamente (idFormularioMovimiento = ${this.idFormularioMovimiento})`);
                        this.funcionesMtcService.mensajeOk('Los datos fueron guardados exitosamente ');
                     },
                     error => {
                        this.funcionesMtcService.ocultarCargando().mensajeError('Problemas para realizar el guardado de datos');
                     }
                  );
            } else {
               //Evalua anexos a actualizar
               let listarequisitos = this.dataRequisitosInput;
               let cadenaAnexos = "";
               for (let i = 0; i < listarequisitos.length; i++) {
                  if (this.dataInput.tramiteReqId === listarequisitos[i].tramiteReqRefId) {
                     if (listarequisitos[i].movId > 0) {
                        const nombreAnexo = listarequisitos[i].codigoFormAnexo.split("_");
                        cadenaAnexos += nombreAnexo[0] + " " + nombreAnexo[1] + "-" + nombreAnexo[2] + " ";
                     }
                  }
               }

               if (cadenaAnexos.length > 0) {
                  //ACTUALIZA FORMULARIO Y ANEXOS
                  this.funcionesMtcService.mensajeConfirmar("Deberá volver a grabar los anexos " + cadenaAnexos + "¿Desea continuar?")
                     .then(() => {
                        this.funcionesMtcService.mostrarCargando();
                        this.formularioService.put<any>(dataGuardarFormData)
                           .subscribe(
                              data => {
                                 this.funcionesMtcService.ocultarCargando();
                                 this.id = data.id;
                                 this.uriArchivo = data.uriArchivo;
                                 this.graboUsuario = true;
                                 this.funcionesMtcService.ocultarCargando();
                                 this.funcionesMtcService.mensajeOk(`Los datos fueron modificados exitosamente`);

                                 for (let i = 0; i < listarequisitos.length; i++) {
                                    if (this.dataInput.tramiteReqId === listarequisitos[i].tramiteReqRefId) {
                                       if (listarequisitos[i].movId > 0) {
                                          console.log('Actualizando Anexos');
                                          console.log(listarequisitos[i].tramiteReqRefId);
                                          console.log(listarequisitos[i].movId);
                                          //ACTUALIZAR ESTADO DEL ANEXO Y LIMPIAR URI ARCHIVO
                                          this.formularioTramiteService.uriArchivo<number>(listarequisitos[i].movId)
                                             .subscribe(
                                                data => { },
                                                error => {
                                                   this.funcionesMtcService.ocultarCargando().mensajeError('Problemas para realizar la modificación de los anexos');
                                                }
                                             );
                                       }
                                    }
                                 }

                              },
                              error => {
                                 this.funcionesMtcService.ocultarCargando().mensajeError('Problemas para realizar la modificación de datos');
                              }
                           );

                     });
               } else {
                  //actualiza formulario
                  this.funcionesMtcService.mostrarCargando();
                  this.formularioService.put<any>(dataGuardarFormData)
                     .subscribe(
                        data => {
                           this.funcionesMtcService.ocultarCargando();
                           this.id = data.id;
                           this.uriArchivo = data.uriArchivo;
                           this.graboUsuario = true;
                           this.funcionesMtcService.ocultarCargando();
                           this.funcionesMtcService.mensajeOk(`Los datos fueron modificados exitosamente`);
                        },
                        error => {
                           this.funcionesMtcService.ocultarCargando().mensajeError('Problemas para realizar la modificación de datos');
                        }
                     );
               }

            }
         });
   }

   descargarPdf() { // OK
      if (this.id === 0)
         return this.funcionesMtcService.mensajeError('Debe guardar previamente los datos ingresados');

      if (!this.uriArchivo || this.uriArchivo == "" || this.uriArchivo == null)
         return this.funcionesMtcService.mensajeError('No se logró ubicar el archivo PDF');

      this.funcionesMtcService.mostrarCargando();

      this.visorPdfArchivosService.get(this.uriArchivo)
         //this.anexoService.readPostFie(this.idAnexo)
         .subscribe(
            (file: Blob) => {
               this.funcionesMtcService.ocultarCargando();

               const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
               const urlPdf = URL.createObjectURL(file);
               modalRef.componentInstance.pdfUrl = urlPdf;
               modalRef.componentInstance.titleModal = "Vista Previa - Formulario 003/17.2";

            },
            error => {
               this.funcionesMtcService
                  .ocultarCargando()
                  .mensajeError('Problemas para descargar Pdf');
            }
         );
   }

   formInvalid(control: string): boolean {
      if (this.formulario.get(control))
         return this.formulario.get(control).invalid && (this.formulario.get(control).dirty || this.formulario.get(control).touched);
   }
}