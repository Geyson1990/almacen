/**
 * Formulario 003/17.2 utilizado por los procedimientos DSTT-028, DSTT-029, DSTT-030, DSTT-031, DSTT-032, DSTT-033, DSTT-034, DSTT-035, DSTT-036, DSTT-037, DSTT-038, DSTT-039, DSTT-040 y DSTT-041
 * @author Alicia Toquila Quispe
 * @version 1.0 07.05.2021
 * @version 1.1 11.06.2021
 * @version 2.0 15.11.2023
 * @version 2.1 25.01.2024
*/
import { Component, OnInit, Injectable, ViewChild, AfterViewInit, Input } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, AbstractControl } from '@angular/forms';
import { NgbActiveModal, NgbAccordionDirective, NgbModal, NgbDateStruct, NgbDatepickerI18n, NgbDateParserFormatter, NgbDateAdapter } from '@ng-bootstrap/ng-bootstrap';
import { TramiteService } from 'src/app/core/services/tramite/tramite.service';
import { OficinaRegistralService } from 'src/app/core/services/servicios/oficinaregistral.service';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { SeguridadService } from 'src/app/core/services/seguridad.service';
import { TipoDocumentoModel } from 'src/app/core/models/TipoDocumentoModel';
import { RepresentanteLegal } from 'src/app/core/models/SunatModel';
import { ReniecService } from 'src/app/core/services/servicios/reniec.service';
import { ExtranjeriaService } from 'src/app/core/services/servicios/extranjeria.service';
import { FormularioTramiteService } from 'src/app/core/services/tramite/formulario-tramite.service';
import { Formulario003_17_2Request } from '../../../domain/formulario003_17_2/formulario003_17_2Request';
import { Formulario003_17_2Response } from '../../../domain/formulario003_17_2/formulario003_17_2Response';
import { Formulario003_17_2Service } from '../../../application/usecases';
import { SunatService } from 'src/app/core/services/servicios/sunat.service';
import { VisorPdfArchivosService } from 'src/app/core/services/tramite/visor-pdf-archivos.service';
import { VistaPdfComponent } from 'src/app/shared/components/vista-pdf/vista-pdf.component';
import { defaultRadioGroupAppearanceProvider, utf8Encode } from 'pdf-lib';
import { RenatService } from 'src/app/core/services/servicios/renat.service';
import { DatosPersona } from 'src/app/core/models/ReniecModel';
import { MtcService } from 'src/app/core/services/servicios/mtc.service';
import { Seccion1, Seccion3, Seccion4, Seccion5, Conductor, Vin, Opciones } from '../../../domain/formulario003_17_2/formulario003_17_2Request';
import { DatosUsuarioLogin } from 'src/app/core/models/Autenticacion/DatosUsuarioLogin';
import { UI_SWITCH_OPTIONS } from 'ngx-ui-switch/ui-switch/ui-switch.token';
import { stringToDate } from 'src/app/helpers/functions';
import { exactLengthValidator, noWhitespaceValidator } from 'src/app/helpers/validator';
import { UbigeoComponent } from 'src/app/shared/components/forms/ubigeo/ubigeo.component';

@Component({
   selector: 'app-formulario',
   templateUrl: './formulario.component.html',
   styleUrls: ['./formulario.component.css']
})
export class FormularioComponent implements OnInit, AfterViewInit {

   @Input() public dataInput: any;
   @Input() public dataRequisitosInput: any;
   @ViewChild('acc') acc: NgbAccordionDirective;
   @ViewChild('ubigeoCmpPerNat') ubigeoPerNatComponent: UbigeoComponent;
   @ViewChild('ubigeoCmpRepLeg') ubigeoRepLegComponent: UbigeoComponent;

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
   //formulario: UntypedFormGroup;
   formularioFG: UntypedFormGroup;

   ubigeo: boolean = false;
   maxLengthNumeroDocumentoRepLeg: number;

   listaTiposDocumentos: TipoDocumentoModel[] = [
      { id: "01", documento: 'DNI' },
      { id: "04", documento: 'Carnet de Extranjería' },
      { id: "05", documento: 'Carnet de Permiso Temp. Perman.' },
      { id: "06", documento: 'Permiso Temporal de Permanencia' },
   ];

   listaCategoriaLicencias: Opciones[] = [
      { value: "A I", text: 'A I', id: 7 },
      { value: "A IIa", text: 'A IIa', id: 1 },
      { value: "A IIb", text: 'A IIb', id: 2 },
      { value: "A IIIa", text: 'A IIIa', id: 3 },
      { value: "A IIIb", text: 'A IIIb', id: 4 },
      { value: "A IIIc", text: 'A IIIc', id: 5 },
      { value: "B IIc", text: 'B IIc', id: 6 },

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

   servicio_snc: boolean = true;
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


   tipoServicioEmpresa = [
      { pa: 'DSTT-025', servicio: '1', tipoSolicitud: '0', tipoServicio: '1', nomServicio: 'Servicio de Transporte de Pasajeros Nacional Regular', diasPrevios: 0, maxDiasPrevios: 0, necesitaAutorizacion: false, incrementoFlota: 'DSTT-032', paExcluyente: '', tipoServicioExcluyente: '', preText: '', exonerarFechaFin: false, seccion5: false, seccion6: false, relacionConductores: false },
      { pa: 'DSTT-026', servicio: '1', tipoSolicitud: '0', tipoServicio: '1', nomServicio: 'Servicio de Transporte de Pasajeros Nacional Regular', diasPrevios: 0, maxDiasPrevios: 0, necesitaAutorizacion: true, incrementoFlota: 'DSTT-032', paExcluyente: '', tipoServicioExcluyente: '', preText: '', exonerarFechaFin: false, seccion5: false, seccion6: false, relacionConductores: false },
      { pa: 'DSTT-027', servicio: '1', tipoSolicitud: '0', tipoServicio: '1', nomServicio: 'Servicio de Transporte de Pasajeros Nacional Regular', diasPrevios: 0, maxDiasPrevios: 0, necesitaAutorizacion: true, incrementoFlota: 'DSTT-032', paExcluyente: '', tipoServicioExcluyente: '', preText: '', exonerarFechaFin: false, seccion5: true, seccion6: false, relacionConductores: true },
      { pa: 'DSTT-028', servicio: '1', tipoSolicitud: '0', tipoServicio: '2', nomServicio: 'Servicio de Transporte de Pasajeros Nacional Turístico', diasPrevios: 0, maxDiasPrevios: 0, necesitaAutorizacion: false, incrementoFlota: 'DSTT-032', paExcluyente: '', tipoServicioExcluyente: '', preText: '', exonerarFechaFin: false, seccion5: false, seccion6: false, relacionConductores: false },
      { pa: 'DSTT-029', servicio: '1', tipoSolicitud: '0', tipoServicio: '5', nomServicio: 'Servicio de Transporte de Pasajeros Nacional Turístico', diasPrevios: 0, maxDiasPrevios: 0, necesitaAutorizacion: false, incrementoFlota: 'DSTT-032', paExcluyente: '', tipoServicioExcluyente: '', preText: '', exonerarFechaFin: false, seccion5: false, seccion6: false, relacionConductores: false },
      { pa: 'DSTT-030', servicio: '1', tipoSolicitud: '0', tipoServicio: '10', nomServicio: 'Servicio de Transporte de Pasajeros Nacional Turístico', diasPrevios: 0, maxDiasPrevios: 0, necesitaAutorizacion: false, incrementoFlota: 'DSTT-032', paExcluyente: '', tipoServicioExcluyente: '', preText: '', exonerarFechaFin: false, seccion5: false, seccion6: false, relacionConductores: false },
      { pa: 'DSTT-031', servicio: '1', tipoSolicitud: '1', tipoServicio: '', nomServicio: '', diasPrevios: 0, maxDiasPrevios: 0, necesitaAutorizacion: false, incrementoFlota: '', paExcluyente: '', tipoServicioExcluyente: '', preText: '', exonerarFechaFin: false, seccion5: false, seccion6: false, relacionConductores: false },
      { pa: 'DSTT-031', servicio: '1', tipoSolicitud: '2', tipoServicio: '', nomServicio: '', diasPrevios: 0, maxDiasPrevios: 0, necesitaAutorizacion: false, incrementoFlota: '', paExcluyente: '', tipoServicioExcluyente: '', preText: '', exonerarFechaFin: false, seccion5: false, seccion6: false, relacionConductores: false },
      { pa: 'DSTT-031', servicio: '1', tipoSolicitud: '3', tipoServicio: '', nomServicio: '', diasPrevios: 0, maxDiasPrevios: 0, necesitaAutorizacion: false, incrementoFlota: '', paExcluyente: '', tipoServicioExcluyente: '', preText: '', exonerarFechaFin: false, seccion5: false, seccion6: false, relacionConductores: false },
      { pa: 'DSTT-031', servicio: '1', tipoSolicitud: '4', tipoServicio: '', nomServicio: '', diasPrevios: 0, maxDiasPrevios: 0, necesitaAutorizacion: false, incrementoFlota: '', paExcluyente: '', tipoServicioExcluyente: '', preText: '', exonerarFechaFin: false, seccion5: false, seccion6: false, relacionConductores: false },

      { pa: 'DSTT-032', servicio: '1', tipoSolicitud: '1', tipoServicio: '1', nomServicio: 'Servicio de Transporte de Pasajeros Nacional Regular', diasPrevios: 0, maxDiasPrevios: 0, necesitaAutorizacion: true, incrementoFlota: '', paExcluyente: '', tipoServicioExcluyente: '', preText: 'prestar', exonerarFechaFin: false, seccion5: true, seccion6: false, relacionConductores: true },
      { pa: 'DSTT-032', servicio: '1', tipoSolicitud: '2', tipoServicio: '2', nomServicio: 'Servicio de Transporte de pasajeros nacional Turístico', diasPrevios: 0, maxDiasPrevios: 0, necesitaAutorizacion: true, incrementoFlota: '', paExcluyente: '', tipoServicioExcluyente: '', preText: 'prestar', exonerarFechaFin: false, seccion5: true, seccion6: false, relacionConductores: true },
      { pa: 'DSTT-032', servicio: '1', tipoSolicitud: '3', tipoServicio: '5', nomServicio: 'Servicio de Transporte de Trabajadores por carretera nacional', diasPrevios: 0, maxDiasPrevios: 0, necesitaAutorizacion: true, incrementoFlota: '', paExcluyente: '', tipoServicioExcluyente: '', preText: 'prestar', exonerarFechaFin: false, seccion5: true, seccion6: false, relacionConductores: true },
      { pa: 'DSTT-032', servicio: '1', tipoSolicitud: '5', tipoServicio: '10', nomServicio: 'Servicio de Transporte de Pasajeros Nacional Privado', diasPrevios: 0, maxDiasPrevios: 0, necesitaAutorizacion: true, incrementoFlota: '', paExcluyente: '', tipoServicioExcluyente: '', preText: 'prestar', exonerarFechaFin: false, seccion5: true, seccion6: false, relacionConductores: true },
      { pa: 'DSTT-032', servicio: '2', tipoSolicitud: '6', tipoServicio: '12', nomServicio: 'Servicio de Transporte Público de Mercancías en general', diasPrevios: 0, maxDiasPrevios: 0, necesitaAutorizacion: true, incrementoFlota: '', paExcluyente: '', tipoServicioExcluyente: '', preText: 'prestar', exonerarFechaFin: false, seccion5: false, seccion6: false, relacionConductores: false },
      { pa: 'DSTT-032', servicio: '4', tipoSolicitud: '7', tipoServicio: '13', nomServicio: 'Actividad Privada de Transporte de Mercancías', diasPrevios: 0, maxDiasPrevios: 0, necesitaAutorizacion: true, incrementoFlota: '', paExcluyente: '', tipoServicioExcluyente: '', preText: 'prestar', exonerarFechaFin: true, seccion5: false, seccion6: false, relacionConductores: false },

      { pa: 'DSTT-033', servicio: '2', tipoSolicitud: '0', tipoServicio: '12', nomServicio: 'Servicio de Transporte Público de Mercancías en general', diasPrevios: 0, maxDiasPrevios: 0, necesitaAutorizacion: false, incrementoFlota: 'DSTT-032', paExcluyente: 'DSTT-034', tipoServicioExcluyente: '13', preText: 'prestar', exonerarFechaFin: false, seccion5: false, seccion6: false, relacionConductores: false },
      { pa: 'DSTT-034', servicio: '4', tipoSolicitud: '0', tipoServicio: '13', nomServicio: 'Actividad Privada de Transporte de Mercancías', diasPrevios: 0, maxDiasPrevios: 0, necesitaAutorizacion: false, incrementoFlota: 'DSTT-032', paExcluyente: 'DSTT-033', tipoServicioExcluyente: '12', preText: 'realizar la', exonerarFechaFin: true, seccion5: false, seccion6: false, relacionConductores: false },

      { pa: 'DSTT-035', servicio: '1', tipoSolicitud: '1', tipoServicio: '1', nomServicio: 'Servicio de Transporte de Pasajeros Nacional Regular', diasPrevios: 0, maxDiasPrevios: 60, necesitaAutorizacion: true, incrementoFlota: '', paExcluyente: '', tipoServicioExcluyente: '', preText: 'prestar', exonerarFechaFin: false, seccion5: false, seccion6: false, relacionConductores: false },
      { pa: 'DSTT-035', servicio: '1', tipoSolicitud: '2', tipoServicio: '2', nomServicio: 'Servicio de Transporte de pasajeros nacional Turístico', diasPrevios: 0, maxDiasPrevios: 60, necesitaAutorizacion: true, incrementoFlota: '', paExcluyente: '', tipoServicioExcluyente: '', preText: 'prestar', exonerarFechaFin: false, seccion5: false, seccion6: false, relacionConductores: false },
      { pa: 'DSTT-035', servicio: '1', tipoSolicitud: '3', tipoServicio: '5', nomServicio: 'Servicio de Transporte de Trabajadores por carretera nacional', diasPrevios: 0, maxDiasPrevios: 60, necesitaAutorizacion: true, incrementoFlota: '', paExcluyente: '', tipoServicioExcluyente: '', preText: 'prestar', exonerarFechaFin: false, seccion5: false, seccion6: false, relacionConductores: false },
      { pa: 'DSTT-035', servicio: '1', tipoSolicitud: '5', tipoServicio: '10', nomServicio: 'Servicio de Transporte de Pasajeros Nacional Privado', diasPrevios: 0, maxDiasPrevios: 60, necesitaAutorizacion: true, incrementoFlota: '', paExcluyente: '', tipoServicioExcluyente: '', preText: 'prestar', exonerarFechaFin: false, seccion5: false, seccion6: false, relacionConductores: false },
      { pa: 'DSTT-035', servicio: '2', tipoSolicitud: '6', tipoServicio: '12', nomServicio: 'Servicio de Transporte Público de Mercancías en general', diasPrevios: 0, maxDiasPrevios: 60, necesitaAutorizacion: true, incrementoFlota: '', paExcluyente: '', tipoServicioExcluyente: '', preText: 'prestar', exonerarFechaFin: false, seccion5: false, seccion6: false, relacionConductores: false },
      { pa: 'DSTT-035', servicio: '4', tipoSolicitud: '7', tipoServicio: '13', nomServicio: 'Actividad Privada de Transporte de Mercancías', diasPrevios: 0, maxDiasPrevios: 60, necesitaAutorizacion: true, incrementoFlota: '', paExcluyente: '', tipoServicioExcluyente: '', preText: 'prestar', exonerarFechaFin: true, seccion5: false, seccion6: false, relacionConductores: false },

      { pa: 'DSTT-036', servicio: '3', tipoSolicitud: '0', tipoServicio: '14', nomServicio: 'Servicio de Transporte de Materiales y/o Residuos Peligrosos Público', diasPrevios: 0, maxDiasPrevios: 0, necesitaAutorizacion: false, incrementoFlota: '', paExcluyente: '', tipoServicioExcluyente: '', preText: '', exonerarFechaFin: false, seccion5: false, seccion6: false, relacionConductores: false },
      { pa: 'DSTT-037', servicio: '3', tipoSolicitud: '0', tipoServicio: '14', nomServicio: 'Servicio de Transporte de Materiales y/o Residuos Peligrosos Público', diasPrevios: 60, maxDiasPrevios: 365, necesitaAutorizacion: true, incrementoFlota: '', paExcluyente: '', tipoServicioExcluyente: '', preText: '', exonerarFechaFin: false, seccion5: false, seccion6: false, relacionConductores: false },
      { pa: 'DSTT-038', servicio: '3', tipoSolicitud: '1', tipoServicio: '14', nomServicio: 'Servicio de Transporte de Materiales y/o Residuos Peligrosos Público', diasPrevios: 0, maxDiasPrevios: 0, necesitaAutorizacion: true, incrementoFlota: '', paExcluyente: '', tipoServicioExcluyente: '', preText: '', exonerarFechaFin: false, seccion5: false, seccion6: false, relacionConductores: false },
      { pa: 'DSTT-038', servicio: '4', tipoSolicitud: '2', tipoServicio: '15', nomServicio: 'Servicio de Transporte de Materiales y/o Residuos Peligrosos Privado', diasPrevios: 0, maxDiasPrevios: 0, necesitaAutorizacion: true, incrementoFlota: '', paExcluyente: '', tipoServicioExcluyente: '', preText: '', exonerarFechaFin: false, seccion5: false, seccion6: false, relacionConductores: false },
      { pa: 'DSTT-039', servicio: '4', tipoSolicitud: '0', tipoServicio: '15', nomServicio: 'Servicio de Transporte de Materiales y/o Residuos Peligrosos Privado', diasPrevios: 0, maxDiasPrevios: 0, necesitaAutorizacion: false, incrementoFlota: '', paExcluyente: '', tipoServicioExcluyente: '', preText: '', exonerarFechaFin: false, seccion5: false, seccion6: false, relacionConductores: false },
      { pa: 'DSTT-040', servicio: '4', tipoSolicitud: '0', tipoServicio: '15', nomServicio: 'Servicio de Transporte de Materiales y/o Residuos Peligrosos Privado', diasPrevios: 60, maxDiasPrevios: 365, necesitaAutorizacion: true, incrementoFlota: '', paExcluyente: '', tipoServicioExcluyente: '', preText: '', exonerarFechaFin: false, seccion5: false, seccion6: false, relacionConductores: false },
      { pa: 'DSTT-041', servicio: '4', tipoSolicitud: '0', tipoServicio: '', nomServicio: '', diasPrevios: 0, maxDiasPrevios: 0, necesitaAutorizacion: false, incrementoFlota: '', paExcluyente: '', tipoServicioExcluyente: '', preText: '', exonerarFechaFin: false, seccion5: false, seccion6: true, relacionConductores: false }
   ];

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

   paAutorizacion: string[] = ["DSTT-027", "DSTT-033", "DSTT-034", "DSTT-037", "DSTT-038", "DSTT-040"]; // PA que deben ser validados si tienen AUTORIZACION
   autorizacion = false;

   paTipoServicio: string[] = []; // PA que tienen habilitado la opción para seleccionar el tipo de servicio
   activarTipoServicio = false;
   servicio: string = "1";

   //paSeccion5: string[] = ['DSTT-027'];
   //paSeccion6: string[] = ['DSTT-041'];

   //paRelacionConductores: string[] = ['DSTT-027'];

   paValidarNomina: string[] = ["DSTT-027"];
   paCategoriaM3: string[] = ['DSTT-027'];
   paValidaLicenciaConductor: string[] = ['DSTT-027'];

   habilitarSeccion5 = true;
   habilitarSeccion6 = true;
   RelacionConductores: boolean = false;

   CIIU: boolean = true;

   public conductores: Conductor[] = [];
   public recordIndexToEditConductores: number;

   public vin: Vin[] = [];
   public recordIndexToEditVin: number;

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
      private formularioService: Formulario003_17_2Service,
      private visorPdfArchivosService: VisorPdfArchivosService,
      private modalService: NgbModal,
      private sunatService: SunatService,
      private renatService: RenatService,
      private mtcService: MtcService) {

      this.conductores = [];
      this.vin = [];
   }

   async ngOnInit(): Promise<void> {
      const tramiteSelected: any = JSON.parse(localStorage.getItem('tramite-selected'));
      this.codigoProcedimientoTupa = tramiteSelected.codigo;
      this.descProcedimientoTupa = tramiteSelected.nombre;
      this.codigoTipoSolicitudTupa = (this.dataInput.tipoSolicitudTupaCod == "" ? "0" : this.dataInput.tipoSolicitudTupaCod);
      this.descTipoSolicitudTupa = this.dataInput.tipoSolicitudTupaDesc;

      this.nroRuc = this.seguridadService.getCompanyCode();
      this.razonSocial = this.seguridadService.getUserName();       //nombre de usuario login
      const tipoDocumento = this.seguridadService.getNameId();      //tipo de documento usuario login
      this.nroDocumentoLogin = this.seguridadService.getNumDoc();   //nro de documento usuario login
      this.datosUsuarioLogin = this.seguridadService.getDatosUsuarioLogin(); // Datos personales del usuario
      this.tipoDocumentoValidForm = tipoDocumento;

      this.recordIndexToEditConductores = -1;
      this.recordIndexToEditVin = -1;

      this.uriArchivo = this.dataInput.rutaDocumento;
      this.id = this.dataInput.movId;



      if (this.paTipoServicio.indexOf(this.codigoProcedimientoTupa) > -1) this.activarTipoServicio = true; else this.activarTipoServicio = false;

      if (this.paDJ63.indexOf(this.codigoProcedimientoTupa) > -1) this.activarDJ63 = true; else this.activarDJ63 = false;
      if (this.paDJ64.indexOf(this.codigoProcedimientoTupa) > -1) this.activarDJ64 = true; else this.activarDJ64 = false;
      if (this.paDJ65.indexOf(this.codigoProcedimientoTupa) > -1) this.activarDJ65 = true; else this.activarDJ65 = false;
      if (this.paDJ66.indexOf(this.codigoProcedimientoTupa) > -1) this.activarDJ66 = true; else this.activarDJ66 = false;
      if (this.paDJ67.indexOf(this.codigoProcedimientoTupa) > -1) this.activarDJ67 = true; else this.activarDJ67 = false;
      if (this.paDJ68.indexOf(this.codigoProcedimientoTupa) > -1) this.activarDJ68 = true; else this.activarDJ68 = false;
      if (this.paDJ69.indexOf(this.codigoProcedimientoTupa) > -1) this.activarDJ69 = true; else this.activarDJ69 = false;

      if (this.paEstatuto.indexOf(this.codigoProcedimientoTupa) > -1) this.activarEstatuto = false; else this.activarEstatuto = true;

      const tipoServicio = this.tipoServicioEmpresa.find(i => i.pa === this.codigoProcedimientoTupa && i.tipoSolicitud == this.codigoTipoSolicitudTupa);
      this.servicio = tipoServicio.servicio;
      this.habilitarSeccion5 = tipoServicio.seccion5;
      this.habilitarSeccion6 = tipoServicio.seccion6;
      this.RelacionConductores = tipoServicio.relacionConductores;

      this.formularioFG = this.fb.group({
         f_Seccion2FG: this.fb.group({
            f_s2_PerNatFG: this.fb.group({
               f_s2_pn_NombresFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(100)]],
               f_s2_pn_TipoDocSolicitanteFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(50)]],
               f_s2_pn_NroDocSolicitanteFC: ['', [Validators.required, exactLengthValidator([8, 9])]],
               f_s2_pn_RucFC: ['', [Validators.required, exactLengthValidator([11])]],
               f_s2_pn_TelefonoFC: ['', [Validators.maxLength(12)]],
               f_s2_pn_CelularFC: ['', [Validators.required, exactLengthValidator([9])]],
               f_s2_pn_CorreoFC: ['', [Validators.required, Validators.email, noWhitespaceValidator(), Validators.maxLength(50)]],
               f_s2_pn_DomicilioFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(150)]],
               f_s2_pn_DepartamentoFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(50)]],
               f_s2_pn_ProvinciaFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(50)]],
               f_s2_pn_DistritoFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(50)]],
            }),
            f_s2_PerJurFG: this.fb.group({
               f_s2_pj_RazonSocialFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(150)]],
               f_s2_pj_RucFC: ['', [Validators.required, noWhitespaceValidator(), exactLengthValidator([11])]],
               f_s2_pj_DomicilioFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(200)]],
               f_s2_pj_DepartamentoFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(50)]],
               f_s2_pj_ProvinciaFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(50)]],
               f_s2_pj_DistritoFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(50)]],
               f_s2_pj_RepLegalFG: this.fb.group({
                  f_s2_pj_rl_TipoDocFC: ['', [Validators.required]],
                  f_s2_pj_rl_NroDocFC: ['', [Validators.required]],
                  f_s2_pj_rl_NombreFC: [{ value: '', disabled: true }, [Validators.required, noWhitespaceValidator(), Validators.maxLength(50)]],
                  f_s2_pj_rl_ApePaternoFC: [{ value: '', disabled: true }, [Validators.required, noWhitespaceValidator(), Validators.maxLength(50)]],
                  f_s2_pj_rl_ApeMaternoFC: [{ value: '', disabled: true }, [Validators.maxLength(50)]],
                  f_s2_pj_rl_TelefonoFC: ['', [Validators.maxLength(12)]],
                  f_s2_pj_rl_CelularFC: ['', [Validators.required, exactLengthValidator([9])]],
                  f_s2_pj_rl_CorreoFC: ['', [Validators.required, noWhitespaceValidator(), Validators.email, Validators.maxLength(50)]],
                  f_s2_pj_rl_DomicilioFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(100)]],
                  f_s2_pj_rl_DepartamentoFC: ['', [Validators.required]],
                  f_s2_pj_rl_ProvinciaFC: ['', [Validators.required]],
                  f_s2_pj_rl_DistritoFC: ['', [Validators.required]],
                  f_s2_pj_rl_OficinaFC: ['', [Validators.required]],
                  f_s2_pj_rl_PartidaFC: ['', [Validators.required]],
                  f_s2_pj_rl_AsientoFC: ['', [Validators.required]]
               })
            }),
         }),
         f_Seccion3FG: this.fb.group({
            f_s3_OficinaFC: ['', [Validators.required]],
            f_s3_PartidaFC: ['', [Validators.required]],
            f_s3_AsientoFC: ['', [Validators.required]],
            f_s3_TipoServicioFC: [{ value: this.servicio, disabled: true }, [Validators.required]],
         }),
         f_Seccion4FG: this.fb.group({
            f_s4_Declaracion_61FC: [false, [Validators.requiredTrue]],
            f_s4_Declaracion_62FC: [false, [Validators.requiredTrue]],
            f_s4_Declaracion_63FC: [false, [Validators.requiredTrue]],
            f_s4_Declaracion_64FC: [false, [Validators.requiredTrue]],
            f_s4_Declaracion_65FC: [false, [Validators.requiredTrue]],
            f_s4_Declaracion_66FC: [false, [Validators.requiredTrue]],
            f_s4_Declaracion_67FC: [false, [Validators.requiredTrue]],
            f_s4_Declaracion_68FC: [false, [Validators.requiredTrue]],
            f_s4_Declaracion_69FC: [false, [Validators.requiredTrue]],
         }),
         f_Seccion5FG: this.fb.group({
            f_s5_TipoDocumentoConductorFC: [''],
            f_s5_NumeroDocumentoConductorFC: [''],
            f_s5_NombresApellidosFC: [{ value: '', disabled: true }],
            f_s5_NumeroLicenciaFC: [{ value: '', disabled: true }],
            f_s5_ClaseCategoriaFC: [{ value: '', disabled: true }]
         }),
         f_Seccion6FG: this.fb.group({
            f_s6_NumeroVinFC: [''],
            f_s6_NumeroChasisSerieFC: ['']
         })
      });

      this.cargarOficinaRegistral();

      console.log(this.seguridadService.getDatosUsuarioLogin());
      switch (tipoDocumento) {
         case "00001":
         case "00004":
         case "00005": this.f_s2_pj_RucFC.clearValidators();
            this.f_s2_pj_RazonSocialFC.clearValidators();
            this.f_s2_pj_DomicilioFC.clearValidators();
            this.f_s2_pj_DepartamentoFC.clearValidators();
            this.f_s2_pj_ProvinciaFC.clearValidators();
            this.f_s2_pj_DistritoFC.clearValidators();
            this.f_s2_pj_rl_TipoDocFC.clearValidators();
            this.f_s2_pj_rl_NroDocFC.clearValidators();
            this.f_s2_pj_rl_NombreFC.clearValidators();
            this.f_s2_pj_rl_ApePaternoFC.clearValidators();
            this.f_s2_pj_rl_ApeMaternoFC.clearValidators();
            this.f_s2_pj_rl_TelefonoFC.clearValidators();
            this.f_s2_pj_rl_CelularFC.clearValidators();
            this.f_s2_pj_rl_CorreoFC.clearValidators();
            this.f_s2_pj_rl_DomicilioFC.clearValidators();
            this.f_s2_pj_rl_DepartamentoFC.clearValidators();
            this.f_s2_pj_rl_ProvinciaFC.clearValidators();
            this.f_s2_pj_rl_DistritoFC.clearValidators();
            this.f_s2_pj_rl_OficinaFC.clearValidators();
            this.f_s2_pj_rl_PartidaFC.clearValidators();
            this.f_s2_pj_rl_AsientoFC.clearValidators();
            this.f_s3_OficinaFC.clearValidators();
            this.f_s3_PartidaFC.clearValidators();
            this.f_s3_AsientoFC.clearValidators();
            this.f_s3_TipoServicioFC.clearValidators();

            this.formularioFG.updateValueAndValidity();

            this.activarPN = true;
            this.activarPJ = false;
            break;

         case "00002": this.f_s2_pn_TipoDocSolicitanteFC.clearValidators();
            this.f_s2_pn_NroDocSolicitanteFC.clearValidators();
            this.f_s2_pn_RucFC.clearValidators();
            this.f_s2_pn_NombresFC.clearValidators();
            this.f_s2_pn_DomicilioFC.clearValidators();
            this.f_s2_pn_DepartamentoFC.clearValidators();
            this.f_s2_pn_ProvinciaFC.clearValidators();
            this.f_s2_pn_DistritoFC.clearValidators();
            this.f_s2_pn_TelefonoFC.clearValidators();
            this.f_s2_pn_CelularFC.clearValidators();
            this.f_s2_pn_CorreoFC.clearValidators();
            this.formularioFG.updateValueAndValidity();

            this.activarPN = false;
            this.activarPJ = true;

            break;

      }
      if (!this.activarDJ63) { this.f_s4_Declaracion_63FC.clearValidators(); }
      if (!this.activarDJ64) { this.f_s4_Declaracion_64FC.clearValidators(); }
      if (!this.activarDJ65) { this.f_s4_Declaracion_65FC.clearValidators(); }
      if (!this.activarDJ66) { this.f_s4_Declaracion_66FC.clearValidators(); }
      if (!this.activarDJ67) { this.f_s4_Declaracion_67FC.clearValidators(); }
      if (!this.activarDJ68) { this.f_s4_Declaracion_68FC.clearValidators(); }
      if (!this.activarDJ69) { this.f_s4_Declaracion_69FC.clearValidators(); }

   }

   async ngAfterViewInit(): Promise<void> {
      this.funcionesMtcService.mostrarCargando();
      await this.cargarDatos();
      if (!this.formularioFG.disabled) {
         await this.verificarCIUU(this.codigoProcedimientoTupa);
         if (!this.formularioFG.disabled) {
            if (this.paAutorizacion.indexOf(this.codigoProcedimientoTupa) > -1) {
               const dataAuto = this.tipoServicioEmpresa.find(i => i.pa === this.codigoProcedimientoTupa && i.tipoSolicitud == this.codigoTipoSolicitudTupa);
               await this.validaAutorizacion(this.nroRuc, dataAuto);
            }
         }
      }

      setTimeout(async () => {
         if (this.habilitarSeccion5 === true) {
            this.acc.expand('seccion-5');
         } else {
            this.acc.collapse('seccion-5');
         }

         if (this.habilitarSeccion6 === true) {
            this.acc.expand('seccion-6');
         } else {
            this.acc.collapse('seccion-6');
         }
      });
   }

   // GET FORM formularioFG
   get f_Seccion2FG(): UntypedFormGroup { return this.formularioFG.get('f_Seccion2FG') as UntypedFormGroup; }
   get f_s2_PerNatFG(): UntypedFormGroup { return this.f_Seccion2FG.get('f_s2_PerNatFG') as UntypedFormGroup; }
   get f_s2_pn_NombresFC(): AbstractControl { return this.f_s2_PerNatFG.get(['f_s2_pn_NombresFC']); }
   get f_s2_pn_TipoDocSolicitanteFC(): AbstractControl { return this.f_s2_PerNatFG.get(['f_s2_pn_TipoDocSolicitanteFC']); }
   get f_s2_pn_NroDocSolicitanteFC(): AbstractControl { return this.f_s2_PerNatFG.get(['f_s2_pn_NroDocSolicitanteFC']); }
   get f_s2_pn_RucFC(): AbstractControl { return this.f_s2_PerNatFG.get(['f_s2_pn_RucFC']); }
   get f_s2_pn_TelefonoFC(): AbstractControl { return this.f_s2_PerNatFG.get(['f_s2_pn_TelefonoFC']); }
   get f_s2_pn_CelularFC(): AbstractControl { return this.f_s2_PerNatFG.get(['f_s2_pn_CelularFC']); }
   get f_s2_pn_CorreoFC(): AbstractControl { return this.f_s2_PerNatFG.get(['f_s2_pn_CorreoFC']); }
   get f_s2_pn_DomicilioFC(): AbstractControl { return this.f_s2_PerNatFG.get(['f_s2_pn_DomicilioFC']); }
   get f_s2_pn_DepartamentoFC(): AbstractControl { return this.f_s2_PerNatFG.get(['f_s2_pn_DepartamentoFC']); }
   get f_s2_pn_ProvinciaFC(): AbstractControl { return this.f_s2_PerNatFG.get(['f_s2_pn_ProvinciaFC']); }
   get f_s2_pn_DistritoFC(): AbstractControl { return this.f_s2_PerNatFG.get(['f_s2_pn_DistritoFC']); }
   get f_s2_PerJurFG(): UntypedFormGroup { return this.f_Seccion2FG.get('f_s2_PerJurFG') as UntypedFormGroup; }
   get f_s2_pj_RazonSocialFC(): AbstractControl { return this.f_s2_PerJurFG.get(['f_s2_pj_RazonSocialFC']); }
   get f_s2_pj_RucFC(): AbstractControl { return this.f_s2_PerJurFG.get(['f_s2_pj_RucFC']); }
   get f_s2_pj_DomicilioFC(): AbstractControl { return this.f_s2_PerJurFG.get(['f_s2_pj_DomicilioFC']); }
   get f_s2_pj_DepartamentoFC(): AbstractControl { return this.f_s2_PerJurFG.get(['f_s2_pj_DepartamentoFC']); }
   get f_s2_pj_ProvinciaFC(): AbstractControl { return this.f_s2_PerJurFG.get(['f_s2_pj_ProvinciaFC']); }
   get f_s2_pj_DistritoFC(): AbstractControl { return this.f_s2_PerJurFG.get(['f_s2_pj_DistritoFC']); }
   get f_s2_pj_RepLegalFG(): UntypedFormGroup { return this.f_s2_PerJurFG.get('f_s2_pj_RepLegalFG') as UntypedFormGroup; }
   get f_s2_pj_rl_TipoDocFC(): AbstractControl { return this.f_s2_pj_RepLegalFG.get(['f_s2_pj_rl_TipoDocFC']); }
   get f_s2_pj_rl_NroDocFC(): AbstractControl { return this.f_s2_pj_RepLegalFG.get(['f_s2_pj_rl_NroDocFC']); }
   get f_s2_pj_rl_NombreFC(): AbstractControl { return this.f_s2_pj_RepLegalFG.get(['f_s2_pj_rl_NombreFC']); }
   get f_s2_pj_rl_ApePaternoFC(): AbstractControl { return this.f_s2_pj_RepLegalFG.get(['f_s2_pj_rl_ApePaternoFC']); }
   get f_s2_pj_rl_ApeMaternoFC(): AbstractControl { return this.f_s2_pj_RepLegalFG.get(['f_s2_pj_rl_ApeMaternoFC']); }
   get f_s2_pj_rl_TelefonoFC(): AbstractControl { return this.f_s2_pj_RepLegalFG.get(['f_s2_pj_rl_TelefonoFC']); }
   get f_s2_pj_rl_CelularFC(): AbstractControl { return this.f_s2_pj_RepLegalFG.get(['f_s2_pj_rl_CelularFC']); }
   get f_s2_pj_rl_CorreoFC(): AbstractControl { return this.f_s2_pj_RepLegalFG.get(['f_s2_pj_rl_CorreoFC']); }
   get f_s2_pj_rl_DomicilioFC(): AbstractControl { return this.f_s2_pj_RepLegalFG.get(['f_s2_pj_rl_DomicilioFC']); }
   get f_s2_pj_rl_DepartamentoFC(): AbstractControl { return this.f_s2_pj_RepLegalFG.get(['f_s2_pj_rl_DepartamentoFC']); }
   get f_s2_pj_rl_ProvinciaFC(): AbstractControl { return this.f_s2_pj_RepLegalFG.get(['f_s2_pj_rl_ProvinciaFC']); }
   get f_s2_pj_rl_DistritoFC(): AbstractControl { return this.f_s2_pj_RepLegalFG.get(['f_s2_pj_rl_DistritoFC']); }
   get f_s2_pj_rl_OficinaFC(): AbstractControl { return this.f_s2_pj_RepLegalFG.get(['f_s2_pj_rl_OficinaFC']); }
   get f_s2_pj_rl_PartidaFC(): AbstractControl { return this.f_s2_pj_RepLegalFG.get(['f_s2_pj_rl_PartidaFC']); }
   get f_s2_pj_rl_AsientoFC(): AbstractControl { return this.f_s2_pj_RepLegalFG.get(['f_s2_pj_rl_AsientoFC']); }

   get f_Seccion3FG(): UntypedFormGroup { return this.formularioFG.get('f_Seccion3FG') as UntypedFormGroup; }
   get f_s3_OficinaFC(): AbstractControl { return this.f_Seccion3FG.get(['f_s3_OficinaFC']); }
   get f_s3_PartidaFC(): AbstractControl { return this.f_Seccion3FG.get(['f_s3_PartidaFC']); }
   get f_s3_AsientoFC(): AbstractControl { return this.f_Seccion3FG.get(['f_s3_AsientoFC']); }
   get f_s3_TipoServicioFC(): AbstractControl { return this.f_Seccion3FG.get(['f_s3_TipoServicioFC']) }

   get f_Seccion4FG(): UntypedFormGroup { return this.formularioFG.get('f_Seccion4FG') as UntypedFormGroup; }
   get f_s4_Declaracion_61FC(): AbstractControl { return this.f_Seccion4FG.get(['f_s4_Declaracion_61FC']); }
   get f_s4_Declaracion_62FC(): AbstractControl { return this.f_Seccion4FG.get(['f_s4_Declaracion_62FC']); }
   get f_s4_Declaracion_63FC(): AbstractControl { return this.f_Seccion4FG.get(['f_s4_Declaracion_63FC']); }
   get f_s4_Declaracion_64FC(): AbstractControl { return this.f_Seccion4FG.get(['f_s4_Declaracion_64FC']); }
   get f_s4_Declaracion_65FC(): AbstractControl { return this.f_Seccion4FG.get(['f_s4_Declaracion_65FC']); }
   get f_s4_Declaracion_66FC(): AbstractControl { return this.f_Seccion4FG.get(['f_s4_Declaracion_66FC']); }
   get f_s4_Declaracion_67FC(): AbstractControl { return this.f_Seccion4FG.get(['f_s4_Declaracion_67FC']); }
   get f_s4_Declaracion_68FC(): AbstractControl { return this.f_Seccion4FG.get(['f_s4_Declaracion_68FC']); }
   get f_s4_Declaracion_69FC(): AbstractControl { return this.f_Seccion4FG.get(['f_s4_Declaracion_69FC']); }

   get f_Seccion5FG(): UntypedFormGroup { return this.formularioFG.get('f_Seccion5FG') as UntypedFormGroup; }
   get f_s5_TipoDocumentoConductorFC(): AbstractControl { return this.f_Seccion5FG.get(['f_s5_TipoDocumentoConductorFC']); }
   get f_s5_NumeroDocumentoConductorFC(): AbstractControl { return this.f_Seccion5FG.get(['f_s5_NumeroDocumentoConductorFC']); }
   get f_s5_NombresApellidosFC(): AbstractControl { return this.f_Seccion5FG.get(['f_s5_NombresApellidosFC']); }
   get f_s5_NumeroLicenciaFC(): AbstractControl { return this.f_Seccion5FG.get(['f_s5_NumeroLicenciaFC']); }
   get f_s5_ClaseCategoriaFC(): AbstractControl { return this.f_Seccion5FG.get(['f_s5_ClaseCategoriaFC']); }

   get f_Seccion6FG(): UntypedFormGroup { return this.formularioFG.get('f_Seccion6FG') as UntypedFormGroup; }
   get f_s6_NumeroVinFC(): AbstractControl { return this.f_Seccion6FG.get(['f_s6_NumeroVinFC']); }
   get f_s6_NumeroChasisSerieFC(): AbstractControl { return this.f_Seccion6FG.get(['f_s6_NumeroChasisSerieFC']); }

   // FIN GET FORM formularioFG

   /* VALIDACIÓN DE ACTIVIDAD PRINCIPAL DEL ADMINISTRADO */
   async verificarCIUU(codigoTupa: string): Promise<void> {
      //this.funcionesMtcService.mostrarCargando();
      try {
         if (this.tipoSolicitante == "PJ" || this.tipoSolicitante == "PNR") {
            const resp: any = await this.sunatService.getDatosPrincipales(this.nroRuc).toPromise();
            console.log(resp);
            if (!resp) {
               this.funcionesMtcService.ocultarCargando();
               this.funcionesMtcService.mensajeError('El servicio de la SUNAT no responde. No se puede validar el CIUU de la(s) actividad(es) económica(s).');
               this.formularioFG.disable();
               return;
            } else {
               switch (codigoTupa) {
                  case "DSTT-027":
                  case "DSTT-025":
                  case "DSTT-029": if (resp.CIIU !== "4922" && resp.CIIU !== "60214") {
                     this.funcionesMtcService.ocultarCargando();
                     this.funcionesMtcService.mensajeError('Para continuar, el administrado debe tener como actividad principal CIIU (60214 o 4922) OTRAS ACTIVIDADES DE TRANSPORTE POR VÍA TERRESTRE.');
                     this.CIIU = false;
                     this.formularioFG.disable();
                  }
                     break;

                  case "DSTT-032": if (this.codigoTipoSolicitudTupa == "6") {
                     if (resp.CIIU !== "4923" && resp.CIIU !== "60230") {
                        if (resp.ciiu2 !== "4923" && resp.ciiu2 !== "60230") {
                           if (resp.ciiu3 !== "4923" && resp.ciiu3 !== "60230") {
                              this.funcionesMtcService.ocultarCargando();
                              this.funcionesMtcService.mensajeError('Para continuar, el administrado debe tener como actividad principal o secundaria, el CIIU (60230 o 4923) TRANSPORTE DE CARGA POR CARRETERA.');
                              this.CIIU = false;
                              this.formularioFG.disable();
                           }
                        }
                     }
                  }
                     break;

                  case "DSTT-033": if (resp.CIIU !== "4923" && resp.CIIU !== "60230") {
                     if (resp.ciiu2 !== "4923" && resp.ciiu2 !== "60230") {
                        if (resp.ciiu3 !== "4923" && resp.ciiu3 !== "60230") {
                           this.funcionesMtcService.ocultarCargando();
                           this.funcionesMtcService.mensajeError('Para continuar, el administrado debe tener como actividad principal o secundaria, el CIIU (60230 o 4923) TRANSPORTE DE CARGA POR CARRETERA.');
                           this.CIIU = false;
                           this.formularioFG.disable();
                        }
                     }
                  }
                     break;


                  case "DSTT-034": if (resp.CIIU === "4923" || resp.CIIU === "60230") {
                     this.funcionesMtcService.ocultarCargando();
                     this.funcionesMtcService.mensajeError('Para continuar, el administrado NO debe tener como actividad principal el CIIU (60230 o 4923) TRANSPORTE DE CARGA POR CARRETERA.');
                     this.CIIU = false;
                     this.formularioFG.disable();
                  }
                     break;


                  case "DSTT-036":
                  case "DSTT-037": if (resp.CIIU !== "4923" && resp.CIIU !== "60230") {
                     this.funcionesMtcService.ocultarCargando();
                     this.funcionesMtcService.mensajeInfo('Debe tomar en cuenta que para este procedimiento su actividad principal o CIIU debe ser (60230 o 4923) TRANSPORTE DE CARGA POR CARRETERA.');
                     this.CIIU = true;
                     //this.formulario.disable();
                  }
                     break;

                  case "DSTT-038": {
                     if (this.codigoTipoSolicitudTupa == "1") {
                        if (resp.CIIU !== "4923" && resp.CIIU !== "60230") {
                           this.funcionesMtcService.ocultarCargando();
                           this.funcionesMtcService.mensajeInfo('Debe tomar en cuenta que para este procedimiento su actividad principal o CIIU debe ser (60230 o 4923) TRANSPORTE DE CARGA POR CARRETERA.');
                           this.CIIU = true;
                           //this.formulario.disable();
                        }
                     }

                     if (this.codigoTipoSolicitudTupa == "2") {
                        if (resp.CIIU === "4923" || resp.CIIU === "60230") {
                           this.funcionesMtcService.ocultarCargando();
                           this.funcionesMtcService.mensajeInfo('Debe tomar en cuenta que para este procedimiento su actividad principal o CIIU NO debe ser(60230 o 4923) TRANSPORTE DE CARGA POR CARRETERA.');
                           this.CIIU = true;
                           //this.formulario.disable();
                        }
                     }
                  }
                     break;

                  case "DSTT-039":
                  case "DSTT-040": if (resp.CIIU === "4923" || resp.CIIU === "60230") {
                     this.funcionesMtcService.ocultarCargando();
                     this.funcionesMtcService.mensajeInfo('Debe tomar en cuenta que para este procedimiento su actividad principal o CIIU NO debe ser (60230 o 4923) TRANSPORTE DE CARGA POR CARRETERA.');
                     this.CIIU = true;
                     //this.formulario.disable();
                  }
                     break;

                  default: this.funcionesMtcService.ocultarCargando(); break;
               }
            }
         }
      } catch (error) {
         console.log(error);
         this.funcionesMtcService.ocultarCargando();
         this.funcionesMtcService.mensajeError('Error al consultar el CIIU del administrado.');
         this.formularioFG.disable();
      }
   }
   /** Valida la vigencia de la autorización de los procedimientos de la DSTT definidos en el array paAutorizacion  */
   async validaAutorizacion(ruc: string, dAuto: any): Promise<void> {
      try {
         const data: any = await this.renatService.EmpresaServicioVigencia(ruc, parseInt(dAuto.tipoServicio), dAuto.diasPrevios, dAuto.maxDiasPrevios, dAuto.exonerarFechaFin).toPromise();
         if (data.length > 0) {
            if (dAuto.necesitaAutorizacion) {
               if (dAuto.diasPrevios > 0) {
                  if (data[0].debePresentar == false) {
                     this.funcionesMtcService.ocultarCargando().mensajeError('No puede continuar con el trámite porque debe ser presentado ' + dAuto.diasPrevios + ' días previos a la fecha de vencimiento de la autorización: ' + data[0].fechaFinVigencia);
                     this.formularioFG.disable();
                  }
               }
            }
            else {
               if (dAuto.paExcluyente != "") {
                  const dataPAEx = this.tipoServicioEmpresa.find(i => i.pa === dAuto.paExcluyente);
                  this.renatService.EmpresaServicioVigencia(ruc, parseInt(dataPAEx.tipoServicio), 0, 0, dataPAEx.exonerarFechaFin).subscribe((dataEx: any) => {
                     if (dataEx.length > 0) {
                        this.funcionesMtcService.ocultarCargando().mensajeError('Usted cuenta con una autorización vigente para ' + dataPAEx.preText + ' ' +
                           dataPAEx.nomServicio + ', si desea solicitar la autorización para prestar ' + dAuto.nomServicio + ', primero deberá solicitar su cese de operaciones.');
                        this.formularioFG.disable();
                     } else {
                        this.funcionesMtcService.ocultarCargando().mensajeError('Usted cuenta con una autorización vigente para ' + dAuto.preText + ' ' + dAuto.nomServicio + ', si desea incrementar un vehículo en su flota deberá solicitar el procedimiento ' + dAuto.incrementoFlota);
                        this.formularioFG.disable();
                     }
                  });
               } else {
                  this.funcionesMtcService.ocultarCargando().mensajeError('No puede continuar con el trámite porque la empresa ya cuenta con autorización vigente para el ' + dAuto.nomServicio);
                  this.formularioFG.disable();
               }
            }
         }
         else {
            if (dAuto.necesitaAutorizacion) {
               this.funcionesMtcService.ocultarCargando().mensajeError('La empresa no cuenta con autorización vigente para el ' + dAuto.nomServicio);
               this.formularioFG.disable();
            } else {
               if (dAuto.paExcluyente != "") {
                  const dataPAEx = this.tipoServicioEmpresa.find(i => i.pa === dAuto.paExcluyente);
                  this.renatService.EmpresaServicioVigencia(ruc, parseInt(dataPAEx.tipoServicio), 0, 0, dataPAEx.exonerarFechaFin).subscribe((dataEx: any) => {
                     if (dataEx.length > 0) {
                        this.funcionesMtcService.ocultarCargando().mensajeError('Usted cuenta con una autorización vigente para ' + dataPAEx.preText + ' ' +
                           dataPAEx.nomServicio + ', si desea solicitar la autorización para prestar ' + dAuto.nomServicio + ', primero deberá solicitar su cese de operaciones.');
                        this.formularioFG.disable();
                     }
                  });
               }
            }
         }
      }
      catch (error) {
         console.log(error);
         this.funcionesMtcService.ocultarCargando().mensajeError('Problemas para verificar la autorización de la Empresa en RENAT. Inténtelo más tarde.');
      }
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
         const tipoDocumento: string = this.f_s2_pj_rl_TipoDocFC.value.trim();
         if (tipoDocumento === '04' || tipoDocumento === '05' || tipoDocumento === '06') {
            this.disabled = false;
            this.maxLengthNumeroDocumentoRepLeg = 9;
         } else {
            this.disabled = true;
            this.maxLengthNumeroDocumentoRepLeg = 8;
         }

         this.f_s2_pj_rl_NroDocFC.setValue('');
         this.inputNumeroDocumento();
      } else {
         if (opcion == "Conductor") {
            const tipoDocumentoConductor: string = this.f_s5_TipoDocumentoConductorFC.value.trim();
            this.f_s5_NumeroDocumentoConductorFC.setValue('');
            this.f_s5_NombresApellidosFC.setValue('');
            this.f_s5_NumeroLicenciaFC.setValue('');
            this.f_s5_ClaseCategoriaFC.setValue('');
         }
      }
   }

   onChangeNumeroDocumentoConductor(opcion: string = 'RepresentanteLegal') {
      if (opcion == "RepresentanteLegal") {
         const tipoDocumento: string = this.f_s2_pj_rl_TipoDocFC.value.trim();
         if (tipoDocumento === '04' || tipoDocumento === '05' || tipoDocumento === '06') {
            this.maxLengthNumeroDocumentoRepLeg = 9;
            this.disabled = false;
         } else {
            this.maxLengthNumeroDocumentoRepLeg = 8;
            this.disabled = true;
         }

         this.f_s2_pj_rl_NroDocFC.setValue('');
         this.inputNumeroDocumento();
      } else {
         if (opcion == "Conductor") {
            const tipoDocumentoConductor: string = this.f_s5_TipoDocumentoConductorFC.value.trim();
            this.f_s5_NombresApellidosFC.setValue('');
            this.f_s5_NumeroLicenciaFC.setValue('');
            this.f_s5_ClaseCategoriaFC.setValue('');
         }
      }
   }

   onChangeEstatutoSocial(): void {
      this.visibleButtonEstatutoSocial = this.formularioFG.controls['estatutoSocial'].value.trim();

      if (this.visibleButtonEstatutoSocial === true) {
         this.funcionesMtcService
            .mensajeConfirmar('¿Declaro que la información adjunta en el archivo es verídica?', 'DECLARACIÓN')
            .catch(() => {
               this.visibleButtonEstatutoSocial = false;
               this.formularioFG.controls['estatutoSocial'].setValue(false);
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
         tipoDocumento = this.f_s2_pj_rl_TipoDocFC.value.trim();
      }
      else {
         tipoDocumento = this.f_s5_TipoDocumentoConductorFC.value.trim();
      }

      if (tipoDocumento === '01')//N° de DNI
         return 8;
      else if (tipoDocumento === '04')//Carnet de extranjería
         return 9;
      else if (tipoDocumento === '05' || tipoDocumento === '06')//CPP/PTP
         return 9;
      return 0
   }

   inputNumeroDocumento(event = undefined) {
      if (event)
         event.target.value = event.target.value.replace(/[^0-9]/g, '');

      this.f_s2_pj_rl_NombreFC.setValue('');
      this.f_s2_pj_rl_ApePaternoFC.setValue('');
      this.f_s2_pj_rl_ApeMaternoFC.setValue('');

      /* this.f_s2_pj_rl_NombreFC.disable();
       this.f_s2_pj_rl_ApePaternoFC.disable();
       this.f_s2_pj_rl_ApeMaternoFC.disable();*/
   }

   buscarNumeroDocumento() {

      const tipoDocumento: string = this.f_s2_pj_rl_TipoDocFC.value.trim();
      const numeroDocumento: string = this.f_s2_pj_rl_NroDocFC.value.trim();

      if (tipoDocumento.length === 0 || numeroDocumento.length === 0)
         return this.funcionesMtcService.mensajeError('Debe ingresar Tipo de Documento y/o Número de Documento');

      if (tipoDocumento === '01' && numeroDocumento.length !== 8)
         return this.funcionesMtcService.mensajeError('DNI debe tener 8 dígitos');

      if (tipoDocumento === '04' && numeroDocumento.length !== 9)
         return this.funcionesMtcService.mensajeError('Carnet de extranjería debe tener 9 dígitos');

      if (tipoDocumento === '05' && numeroDocumento.length !== 9)
         return this.funcionesMtcService.mensajeError('Carnet de Permiso Temp. Perman. debe tener 9 dígitos');

      if (tipoDocumento === '06' && numeroDocumento.length !== 9)
         return this.funcionesMtcService.mensajeError('Permiso Temp. Perman. debe tener 9 dígitos');

      const resultado = this.representanteLegal.find(representante => ('0' + representante.tipoDocumento.trim()).toString() === tipoDocumento && representante.nroDocumento.trim() === numeroDocumento);
      console.log(resultado);
      if (resultado) {//DNI
         this.funcionesMtcService.mostrarCargando();

         if (tipoDocumento === '01') {//DNI
            try {
               this.reniecService.getDni(numeroDocumento).subscribe(
                  (respuesta) => {
                     this.funcionesMtcService.ocultarCargando();

                     if (respuesta.reniecConsultDniResponse.listaConsulta.coResultado !== '0000') {
                        return this.funcionesMtcService.mensajeError('Número de documento no registrado en Reniec');
                     }
                     const datosPersona = respuesta.reniecConsultDniResponse.listaConsulta.datosPersona;
                     if (datosPersona.restriccion.trim() == "FALLECIMIENTO") {
                        this.esRepresentante = false;
                        return this.funcionesMtcService.mensajeError('No puede registrar un Representante Legal fallecido');
                     }
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
                     this.funcionesMtcService.ocultarCargando().mensajeError('En este momento el servicio de RENIEC no se encuentra disponible. Debe ingresar los datos en los campos correspondientes.');
                     this.f_s2_pj_rl_NombreFC.enable();
                     this.f_s2_pj_rl_ApePaternoFC.enable();
                     this.f_s2_pj_rl_ApeMaternoFC.enable();
                     this.f_s2_pj_rl_DomicilioFC.enable();
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
                  this.f_s2_pj_rl_NombreFC.enable();
                  this.f_s2_pj_rl_ApePaternoFC.enable();
                  this.f_s2_pj_rl_ApeMaternoFC.enable();
               }
            );
         } else if (tipoDocumento === '05' || tipoDocumento === '06') {//CPP
            this.funcionesMtcService.ocultarCargando();
            let apellidosNombres = resultado.nombresApellidos.split(' ');
            let tamano = apellidosNombres.length;
            let nombres: string = "";
            if (tamano > 3) {
               for (let i = 3; i < tamano; i++) {
                  nombres += apellidosNombres[i] + " ";
               }
               apellidosNombres[2] += " " + nombres;
            }
            this.addPersona(tipoDocumento,
               apellidosNombres[2],
               apellidosNombres[0],
               apellidosNombres[1],
               '',
               '',
               '',
               '');

            this.f_s2_pj_rl_NombreFC.enable();
            this.f_s2_pj_rl_ApePaternoFC.enable();
            this.f_s2_pj_rl_ApeMaternoFC.enable();
         }
      } else {

         if (numeroDocumento == this.datosUsuarioLogin.nroDocumento) {
            this.esRepresentante = true;
            this.addPersona(tipoDocumento,
               this.datosUsuarioLogin.nombres,
               this.datosUsuarioLogin.apePaterno,
               this.datosUsuarioLogin.apeMaterno,
               this.datosUsuarioLogin.direccion,
               this.datosUsuarioLogin.distrito,
               this.datosUsuarioLogin.provincia,
               this.datosUsuarioLogin.departamento);
         } else {
            this.esRepresentante = false;
            return this.funcionesMtcService.mensajeError('El Representante Legal no esta registrado en SUNAT.');
         }
      }

   }

   addPersona(tipoDocumento: string, nombres: string, ap_paterno: string, ap_materno: string, direccion: string, distrito: string, provincia: string, departamento: string) {
      if (tipoDocumento == "05" || tipoDocumento == "06" || tipoDocumento == "08" || tipoDocumento == "07") {
         this.funcionesMtcService.mensajeConfirmar(`Los datos ingresados corresponden a la persona ${nombres} ${ap_paterno} ${ap_materno}. ¿Está seguro de agregarlo?`)
            .then(() => {
               this.f_s2_pj_rl_NombreFC.setValue(nombres);
               this.f_s2_pj_rl_ApePaternoFC.setValue(ap_paterno);
               this.f_s2_pj_rl_ApeMaternoFC.setValue(ap_materno);
               this.f_s2_pj_rl_DomicilioFC.setValue(direccion);
               this.f_s2_pj_rl_DistritoFC.setValue(distrito);
               this.f_s2_pj_rl_ProvinciaFC.setValue(provincia);
               this.f_s2_pj_rl_DepartamentoFC.setValue(departamento);
            });
      } else {
         this.funcionesMtcService.mensajeConfirmar(`Los datos ingresados fueron validados por ${tipoDocumento === '01' ? 'RENIEC' : 'MIGRACIONES'} corresponden a la persona ${nombres} ${ap_paterno} ${ap_materno}. ¿Está seguro de agregarlo?`)
            .then(() => {
               this.f_s2_pj_rl_NombreFC.setValue(nombres);
               this.f_s2_pj_rl_ApePaternoFC.setValue(ap_paterno);
               this.f_s2_pj_rl_ApeMaternoFC.setValue(ap_materno);
               this.f_s2_pj_rl_DomicilioFC.setValue(direccion);
               this.f_s2_pj_rl_DistritoFC.setValue(distrito);
               this.f_s2_pj_rl_ProvinciaFC.setValue(provincia);
               this.f_s2_pj_rl_DepartamentoFC.setValue(departamento);
            });
      }

   }

   async cargarDatos(): Promise<void> {
      this.funcionesMtcService.mostrarCargando();
      /*
            this.f_s2_pj_rl_NombreFC.disable();
            this.f_s2_pj_rl_ApePaternoFC.disable();
            this.f_s2_pj_rl_ApeMaternoFC.disable();*/

      switch (this.seguridadService.getNameId()) {
         case '00001': this.tipoSolicitante = 'PN'; //persona natural
            this.f_s2_pn_TipoDocSolicitanteFC.setValue('DNI');
            this.tipoDocumentoSolicitante = '01';
            this.nombreTipoDocumentoSolicitante = "DNI";
            this.numeroDocumentoSolicitante = this.nroDocumentoLogin;
            this.nombreSolicitante = this.seguridadService.getUserName();
            this.funcionesMtcService.ocultarCargando();
            break;

         case '00002': this.tipoSolicitante = 'PJ'; // persona juridica
            this.f_s2_pn_TipoDocSolicitanteFC.setValue('DNI');
            this.funcionesMtcService.ocultarCargando();

            break;

         case '00004': this.tipoSolicitante = 'PE'; // persona extranjera
            this.nombreSolicitante = this.seguridadService.getUserName();

            switch (this.seguridadService.getTipoDocumento()) {
               case "00003": this.tipoDocumentoSolicitante = "04";
                  this.nombreTipoDocumentoSolicitante = "CE";
                  this.numeroDocumentoSolicitante = this.nroDocumentoLogin;
                  this.f_s2_pn_TipoDocSolicitanteFC.setValue('CARNET DE EXTRANJERIA');
                  break;
               case "00101": this.tipoDocumentoSolicitante = "05";
                  this.nombreTipoDocumentoSolicitante = "CARNÉ SOLICITANTE DE REFUGIO";
                  this.numeroDocumentoSolicitante = this.nroDocumentoLogin;
                  this.f_s2_pn_TipoDocSolicitanteFC.setValue('CARNÉ SOLICITANTE DE REFUGIO');
                  break;
               case "00102": this.tipoDocumentoSolicitante = "06";
                  this.nombreTipoDocumentoSolicitante = "CARNÉ DE PERMISO TEMPORAL DE PERMANENCIA";
                  this.numeroDocumentoSolicitante = this.nroDocumentoLogin;
                  this.f_s2_pn_TipoDocSolicitanteFC.setValue('CARNÉ DE PERMISO TEMPORAL DE PERMANENCIA');
                  break;
               case "00103": this.tipoDocumentoSolicitante = "07";
                  this.nombreTipoDocumentoSolicitante = "CARNÉ DE IDENTIFICACION";
                  this.numeroDocumentoSolicitante = this.nroDocumentoLogin;
                  this.f_s2_pn_TipoDocSolicitanteFC.setValue('CARNÉ DE IDENTIFICACION');
                  break;
            }
            this.funcionesMtcService.ocultarCargando();
            break;

         case '00005':
            this.tipoSolicitante = 'PNR'; // persona natural con ruc
            if (this.nroDocumentoLogin.length == 8) {
               this.tipoDocumentoSolicitante = "01";
               this.nombreTipoDocumentoSolicitante = "DNI";
               this.f_s2_pn_TipoDocSolicitanteFC.setValue('DNI');
            }

            if (this.nroDocumentoLogin.length == 9) {
               this.tipoDocumentoSolicitante = "04";
               this.nombreTipoDocumentoSolicitante = "CE";
               this.f_s2_pn_TipoDocSolicitanteFC.setValue('CE');
            }
            this.numeroDocumentoSolicitante = this.nroDocumentoLogin;
            this.nombreSolicitante = this.seguridadService.getUserName();
            this.nroRuc = this.seguridadService.getCompanyCode();
            this.funcionesMtcService.ocultarCargando();
            break;
      }

      if (this.dataInput != null && this.dataInput.movId > 0) {
         const dataFormulario = await this.formularioTramiteService.get<any>(this.dataInput.tramiteReqId).toPromise();
         this.funcionesMtcService.ocultarCargando();
         const metaData = JSON.parse(dataFormulario.metaData);
         console.log(metaData);

         this.id = dataFormulario.formularioId;
         this.filePdfPathName = metaData.pathName;
         this.pathPdfEstatutoSocialSeleccionado = metaData.seccion4.pathNameEstatutoSocial;

         if (this.activarPN) {
            this.f_s2_pn_NombresFC.setValue(metaData.seccion3.nombresApellidos);
            this.f_s2_pn_TipoDocSolicitanteFC.setValue(this.nombreTipoDocumentoSolicitante);
            this.f_s2_pn_NroDocSolicitanteFC.setValue(metaData.seccion3.numeroDocumento);
            this.f_s2_pn_RucFC.setValue(metaData.seccion3.ruc);
            this.f_s2_pn_DomicilioFC.setValue(metaData.seccion3.domicilioLegal);
            this.f_s2_pn_DistritoFC.setValue(metaData.seccion3.distrito);
            this.f_s2_pn_ProvinciaFC.setValue(metaData.seccion3.provincia);
            this.f_s2_pn_DepartamentoFC.setValue(metaData.seccion3.departamento);
            this.f_s2_pn_CorreoFC.setValue(metaData.seccion3.email);
            this.f_s2_pn_CelularFC.setValue(metaData.seccion3.celular);
            this.f_s2_pn_TelefonoFC.setValue(metaData.seccion3.telefono);

            this.setFormPN();
         }

         if (this.activarPJ) {
            this.f_s2_pj_RucFC.setValue(metaData.seccion3.numeroDocumento);
            this.f_s2_pj_RazonSocialFC.setValue(metaData.seccion3.razonSocial);
            this.f_s2_pj_DomicilioFC.setValue(metaData.seccion3.domicilioLegal);
            this.f_s2_pj_DistritoFC.setValue(metaData.seccion3.distrito);
            this.f_s2_pj_ProvinciaFC.setValue(metaData.seccion3.provincia);
            this.f_s2_pj_DepartamentoFC.setValue(metaData.seccion3.departamento);

            //this.formulario.controls["marcadoObligatorio"].setValue(metaData.DatosSolicitante.MarcadoObligatorio);
            this.f_s2_pj_rl_TipoDocFC.setValue(metaData.seccion3.RepresentanteLegal.tipoDocumento.id);
            this.f_s2_pj_rl_NroDocFC.setValue(metaData.seccion3.RepresentanteLegal.numeroDocumento);
            this.f_s2_pj_rl_NombreFC.setValue(metaData.seccion3.RepresentanteLegal.nombres);
            this.f_s2_pj_rl_ApePaternoFC.setValue(metaData.seccion3.RepresentanteLegal.apellidoPaterno);
            this.f_s2_pj_rl_ApeMaternoFC.setValue(metaData.seccion3.RepresentanteLegal.apellidoMaterno);
            this.f_s2_pj_rl_DomicilioFC.setValue(metaData.seccion3.RepresentanteLegal.domicilioLegal);
            this.f_s2_pj_rl_DistritoFC.setValue(metaData.seccion3.RepresentanteLegal.distrito);
            this.f_s2_pj_rl_ProvinciaFC.setValue(metaData.seccion3.RepresentanteLegal.provincia);
            this.f_s2_pj_rl_DepartamentoFC.setValue(metaData.seccion3.RepresentanteLegal.departamento);
            this.f_s2_pj_rl_TelefonoFC.setValue(metaData.seccion3.telefono);
            this.f_s2_pj_rl_CelularFC.setValue(metaData.seccion3.celular);
            this.f_s2_pj_rl_CorreoFC.setValue(metaData.seccion3.email);
            this.f_s2_pj_rl_OficinaFC.setValue(metaData.seccion3.RepresentanteLegal.oficinaRegistral.id);
            this.f_s2_pj_rl_PartidaFC.setValue(metaData.seccion3.RepresentanteLegal.partida);
            this.f_s2_pj_rl_AsientoFC.setValue(metaData.seccion3.RepresentanteLegal.asiento);

            this.setFormPJ();

            this.sunatService.getDatosPrincipales(this.nroRuc).subscribe(
               (response) => {
                  this.funcionesMtcService.ocultarCargando();
                  this.representanteLegal = response.representanteLegal;
               }, (error) => {
                  this.funcionesMtcService.ocultarCargando().mensajeError('Error al consultar el Servicio de Sunat para validar el representante legal.');
               });

         }
         this.f_s3_OficinaFC.setValue(metaData.seccion4.oficina_registral.id);
         this.f_s3_PartidaFC.setValue(metaData.seccion4.partida_registral);
         this.f_s3_AsientoFC.setValue(metaData.seccion4.asiento);

         if (metaData.seccion4.opcion1)
            this.f_s3_TipoServicioFC.setValue("1");
         if (metaData.seccion4.opcion2)
            this.f_s3_TipoServicioFC.setValue("2");
         if (metaData.seccion4.opcion3)
            this.f_s3_TipoServicioFC.setValue("3");
         if (metaData.seccion4.opcion4)
            this.f_s3_TipoServicioFC.setValue("4");

         this.f_s4_Declaracion_61FC.setValue(metaData.seccion6.declaracion_61);
         this.f_s4_Declaracion_62FC.setValue(metaData.seccion6.declaracion_62);
         this.f_s4_Declaracion_63FC.setValue(metaData.seccion6.declaracion_63);
         this.f_s4_Declaracion_64FC.setValue(metaData.seccion6.declaracion_64);
         this.f_s4_Declaracion_65FC.setValue(metaData.seccion6.declaracion_65);
         this.f_s4_Declaracion_66FC.setValue(metaData.seccion6.declaracion_66);
         this.f_s4_Declaracion_67FC.setValue(metaData.seccion6.declaracion_67);
         this.f_s4_Declaracion_68FC.setValue(metaData.seccion6.declaracion_68);
         this.f_s4_Declaracion_69FC.setValue(metaData.seccion6.declaracion_69);

         if (metaData.DatosSolicitante != null) {
            setTimeout(() => {
               this.f_s2_pj_rl_OficinaFC.setValue(metaData.DatosSolicitante.RepresentanteLegal.OficinaRegistral.id);
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

         i = 0;
         if (this.habilitarSeccion6) {
            for (i = 0; i < metaData.seccion8.RelacionVin.length; i++) {
               this.vin.push({
                  numeroVin: metaData.seccion8.RelacionVin[i].numeroVin,
                  numeroChasisSerie: metaData.seccion8.RelacionVin[i].numeroChasisSerie,
               } as Vin);
            }
         }
         /*
      }, (error) => {
         this.funcionesMtcService.ocultarCargando().mensajeError('Problemas para recuperar los datos guardados');
      }*/
         //)
      } else {
         this.funcionesMtcService.mostrarCargando();

         switch (this.tipoSolicitante) {
            case "PN":
               console.log(this.datosUsuarioLogin);
               this.funcionesMtcService.ocultarCargando();
               this.f_s2_pn_NroDocSolicitanteFC.setValue(this.numeroDocumentoSolicitante.trim());
               this.f_s2_pn_RucFC.setValue('');
               this.f_s2_pn_NombresFC.setValue(this.datosUsuarioLogin.nombres + " " + this.datosUsuarioLogin.apePaterno.trim() + " " + this.datosUsuarioLogin.apeMaterno.trim());
               this.f_s2_pn_DomicilioFC.setValue(this.datosUsuarioLogin.direccion.trim());
               this.f_s2_pn_DistritoFC.setValue(this.datosUsuarioLogin.distrito.trim());
               this.f_s2_pn_ProvinciaFC.setValue(this.datosUsuarioLogin.provincia.trim());
               this.f_s2_pn_DepartamentoFC.setValue(this.datosUsuarioLogin.departamento.trim());
               this.f_s2_pn_TelefonoFC.setValue(this.datosUsuarioLogin.telefono.trim());
               this.f_s2_pn_CelularFC.setValue(this.datosUsuarioLogin.celular.trim());
               this.f_s2_pn_CorreoFC.setValue(this.datosUsuarioLogin.correo.trim());

               this.setFormPN();
               break;

            case "PJ":
               try {
                  const response = await this.sunatService.getDatosPrincipales(this.nroRuc).toPromise();
                  if (response.esHabido == false || response.esActivo == false) {
                     this.formularioFG.disable();
                     return this.funcionesMtcService
                        .ocultarCargando()
                        .mensajeError('No puede continuar con el registro porque ' + (!response.esHabido ? ((!response.esActivo) ? 'el estado del contribuyente es NO ACTIVO y su condición es NO HABIDO' : 'la condición del contribuyente es NO HABIDO') : 'el estado del contribuyente es NO ACTIVO'));
                  }
                  console.log(response.razonSocial.trim().replace(/[^\w\s]/gi, ''));
                  console.log(this.datosUsuarioLogin.razonSocial.trim().replace(/[^\w\s]/gi, ''));
                  /*if (response.razonSocial.trim().replace(/[^\w\s]/gi, '') !== this.datosUsuarioLogin.razonSocial.trim().replace(/[^\w\s]/gi, '')) {

                     return this.funcionesMtcService
                        .ocultarCargando()
                        .mensajeError('La razón social es diferente a la registrada en la casilla electrónica. Debe solicitar la actualización de sus datos enviando un correo a soportecasillaelectronica@mtc.gob.pe');
                  }*/

                  this.funcionesMtcService.ocultarCargando();
                  this.f_s2_pj_RazonSocialFC.setValue(response.razonSocial.trim());
                  this.f_s2_pj_RucFC.setValue(response.nroDocumento.trim());
                  this.f_s2_pj_DomicilioFC.setValue(response.domicilioLegal.trim());
                  this.f_s2_pj_DistritoFC.setValue(response.nombreDistrito.trim());
                  this.f_s2_pj_ProvinciaFC.setValue(response.nombreProvincia.trim());
                  this.f_s2_pj_DepartamentoFC.setValue(response.nombreDepartamento.trim());
                  this.f_s2_pj_rl_TelefonoFC.setValue(this.datosUsuarioLogin.telefono.trim());
                  this.f_s2_pj_rl_CelularFC.setValue(this.datosUsuarioLogin.celular.trim());
                  this.f_s2_pj_rl_CorreoFC.setValue(this.datosUsuarioLogin.correo.trim());

                  this.setFormPJ();

                  this.representanteLegal = response.representanteLegal;
               }
               catch (error) {
                  this.funcionesMtcService.ocultarCargando().mensajeError('Error al consultar el Servicio de SUNAT.');
               };
               break;

            case "PNR":
               try {
                  this.funcionesMtcService.mostrarCargando();
                  const response = await this.sunatService.getDatosPrincipales(this.nroRuc).toPromise();

                  if (response.esHabido == false || response.esActivo == false) {
                     this.formularioFG.disable();
                     return this.funcionesMtcService
                        .ocultarCargando()
                        .mensajeError('No puede continuar con el registro porque ' + (!response.esHabido ? ((!response.esActivo) ? 'el estado del contribuyente es NO ACTIVO y su condición es NO HABIDO' : 'la condición del contribuyente es NO HABIDO') : 'el estado del contribuyente es NO ACTIVO'));
                  }

                  if (response.tipoEmpresa != "02" && response.tipoEmpresa != "04" ) { // PERSONAL NATURAL CON NEGOCIO, SOCIEDAD CONYUGAL CON NEGOCIO
                     this.formularioFG.disable();
                     return this.funcionesMtcService
                        .ocultarCargando()
                        .mensajeError('El Tipo de Contribuyente no corresponde, debe indicar PERSONA NATURAL CON NEGOCIO o SOCIEDAD CONYUGAL CON NEGOCIO.');
                  }

                  this.funcionesMtcService.ocultarCargando();

                  this.f_s2_pn_NroDocSolicitanteFC.setValue(this.numeroDocumentoSolicitante);
                  this.f_s2_pn_RucFC.setValue(this.nroRuc.trim());
                  this.f_s2_pn_NombresFC.setValue(this.datosUsuarioLogin.nombres + " " + this.datosUsuarioLogin.apePaterno.trim() + " " + this.datosUsuarioLogin.apeMaterno.trim());
                  this.f_s2_pn_DomicilioFC.setValue(this.datosUsuarioLogin.direccion.trim());
                  this.f_s2_pn_DistritoFC.setValue(this.datosUsuarioLogin.distrito.trim());
                  this.f_s2_pn_ProvinciaFC.setValue(this.datosUsuarioLogin.provincia.trim());
                  this.f_s2_pn_DepartamentoFC.setValue(this.datosUsuarioLogin.departamento.trim());
                  this.f_s2_pn_TelefonoFC.setValue(this.datosUsuarioLogin.telefono.trim());
                  this.f_s2_pn_CelularFC.setValue(this.datosUsuarioLogin.celular.trim());
                  this.f_s2_pn_CorreoFC.setValue(this.datosUsuarioLogin.correo.trim());

                  this.setFormPN();
               }
               catch (error) {
                  this.setFormPN();
                  this.funcionesMtcService.ocultarCargando().mensajeError('Error al consultar el Servicio de SUNAT');

               }
               break;

            case "PE": this.funcionesMtcService.ocultarCargando();
               this.f_s2_pn_NroDocSolicitanteFC.setValue(this.numeroDocumentoSolicitante);
               this.f_s2_pn_RucFC.setValue(this.nroRuc.trim());
               this.f_s2_pn_NombresFC.setValue(this.datosUsuarioLogin.nombres + " " + this.datosUsuarioLogin.apePaterno.trim() + " " + this.datosUsuarioLogin.apeMaterno.trim());
               this.f_s2_pn_DomicilioFC.setValue(this.datosUsuarioLogin.direccion.trim());
               this.f_s2_pn_DistritoFC.setValue(this.datosUsuarioLogin.distrito.trim());
               this.f_s2_pn_ProvinciaFC.setValue(this.datosUsuarioLogin.provincia.trim());
               this.f_s2_pn_DepartamentoFC.setValue(this.datosUsuarioLogin.departamento.trim());
               this.f_s2_pn_TelefonoFC.setValue(this.datosUsuarioLogin.telefono.trim());
               this.f_s2_pn_CelularFC.setValue(this.datosUsuarioLogin.celular.trim());
               this.f_s2_pn_CorreoFC.setValue(this.datosUsuarioLogin.correo.trim());

               this.setFormPN();
               break;
         }
      }
   }

   setFormPN() {
      this.f_s2_pn_NroDocSolicitanteFC.disable();
      this.f_s2_pn_TipoDocSolicitanteFC.disable();
      this.f_s2_pn_RucFC.disable();
      this.f_s2_pn_NombresFC.disable();
      this.f_s2_pn_DomicilioFC.disable();
      this.f_s2_pn_DistritoFC.disable();
      this.f_s2_pn_ProvinciaFC.disable();
      this.f_s2_pn_DepartamentoFC.disable();
   }

   setFormPJ() {
      this.f_s2_pj_RazonSocialFC.disable();
      this.f_s2_pj_RucFC.disable();
      this.f_s2_pj_DomicilioFC.disable();
      this.f_s2_pj_DistritoFC.disable();
      this.f_s2_pj_ProvinciaFC.disable();
      this.f_s2_pj_DepartamentoFC.disable();
   }

   private confirmarConductor(datos: string, licencia: string, claseCategoria: string): void {
      this.funcionesMtcService
         .mensajeConfirmar(`Los datos fueron validados por el SNC y corresponden a la persona ${datos}. ¿Está seguro de agregarlo?`)
         .then(() => {
            this.f_s5_NombresApellidosFC.setValue(datos);
            this.f_s5_NumeroLicenciaFC.setValue(licencia);
            this.f_s5_ClaseCategoriaFC.setValue(claseCategoria);
         });
   }

   async buscarNumeroLicencia(dato: DatosPersona): Promise<void> {
      /** Servicio de SNC
       * 1: RUC
       * 2: DNI
       * 4: CE
       * 5: CS
       * 6: Pasaporte
       * 13: TI (Tarjeta de identidad)
       * 14: PTP Permiso Temporal de permanencia
       */
      let tipoDocumento: string = this.f_s5_TipoDocumentoConductorFC.value;
      let nombreTipoDocumento: string = "";
      const numeroDocumento: string = this.f_s5_NumeroDocumentoConductorFC.value.trim();

      let validaNomina: boolean = true;
      console.log(tipoDocumento);
      console.log(numeroDocumento);

      if (tipoDocumento == "01") { tipoDocumento = "2"; nombreTipoDocumento = "L.E."; }
      if (tipoDocumento == "04") { tipoDocumento = "4"; nombreTipoDocumento = "C.E."; }
      if (tipoDocumento == "05" || tipoDocumento == "06") { tipoDocumento = "14"; nombreTipoDocumento = "P.T.P."; }

      if (tipoDocumento == "2" && numeroDocumento.length !== 8) {
         this.funcionesMtcService.mensajeError('DNI debe tener 8 dígitos');
         return;
      }

      if (tipoDocumento == "4" && numeroDocumento.length !== 9) {
         this.funcionesMtcService.mensajeError('Carnet de Extranjería debe tener 9 dígitos');
         return;
      }

      if (tipoDocumento == "14" && numeroDocumento.length !== 9) {
         this.funcionesMtcService.mensajeError('PTP debe tener 9 dígitos');
         return;
      }

      this.funcionesMtcService.mostrarCargando();
      try {

         if (this.paValidarNomina.indexOf(this.codigoProcedimientoTupa) > -1) {

            const nominaConductor = await this.renatService.validarConductorPerteneceNominaConductores(this.nroRuc, nombreTipoDocumento, numeroDocumento).toPromise();
            if (!nominaConductor) {
               this.funcionesMtcService.ocultarCargando();
               return this.funcionesMtcService.mensajeError('El conductor no está registrado en la nómina de la empresa.');
            }
            console.log(nominaConductor);
         }
         const respuesta = await this.mtcService.getLicenciasConducir(parseInt(tipoDocumento), numeroDocumento).toPromise();

         this.funcionesMtcService.ocultarCargando();
         const datos: any = respuesta[0];
         console.log('DATOS getLicenciasConducir:', JSON.stringify(datos, null, 10));

         if (datos.GetDatosLicenciaMTCResult.CodigoRespuesta === 'MSJ01') {
            return this.funcionesMtcService.mensajeError('El número de documento no cuenta con licencia de conducir');
         }

         if (datos.GetDatosLicenciaMTCResult.CodigoRespuesta === 'MSJ02' || datos.GetDatosLicenciaMTCResult.CodigoRespuesta === 'MSJ03') {
            this.servicio_snc = false;
            if (tipoDocumento == "2") {
               this.reniecService.getDni(numeroDocumento).subscribe(
                  (respuesta) => {
                     this.funcionesMtcService.ocultarCargando();

                     if (respuesta.reniecConsultDniResponse.listaConsulta.coResultado !== '0000') {
                        return this.funcionesMtcService.mensajeError('Número de documento no registrado en Reniec');
                     }
                     const datosPersona = respuesta.reniecConsultDniResponse.listaConsulta.datosPersona;
                     if (datosPersona.restriccion.trim() == "FALLECIMIENTO") {
                        return this.funcionesMtcService.mensajeError('No puede registrar un conductor fallecido');
                     }

                     this.f_s5_NombresApellidosFC.setValue(datosPersona.apPrimer + " " + datosPersona.apSegundo + ", " + datosPersona.prenombres);
                  },
                  (error) => {
                     this.funcionesMtcService.ocultarCargando().mensajeError('En este momento el servicio de RENIEC no se encuentra disponible. Debe ingresar los datos en los campos correspondientes.');
                     this.f_s5_NombresApellidosFC.enable();
                  }
               );
            } else {
               if (tipoDocumento == "4") {
                  this.extranjeriaService.getCE(numeroDocumento).subscribe(
                     (respuesta) => {
                        this.funcionesMtcService.ocultarCargando();

                        if (respuesta.CarnetExtranjeria.numRespuesta !== '0000')
                           return this.funcionesMtcService.mensajeError('Número de documento no registrado en Migraciones');
                        this.f_s5_NombresApellidosFC.setValue(respuesta.CarnetExtranjeria.primerApellido + " " + respuesta.CarnetExtranjeria.segundoApellido + ", " + respuesta.CarnetExtranjeria.nombres);
                     },
                     (error) => {
                        this.funcionesMtcService.ocultarCargando().mensajeError('En este momento el servicio de MIGRACIONES no se encuentra disponible. Vuelva a intentarlo más tarde.');
                        this.f_s5_NombresApellidosFC.enable();
                     }
                  );
               } else {
                  this.f_s5_NombresApellidosFC.enable();
               }
            }
            this.f_s5_NumeroLicenciaFC.enable();
            this.f_s5_ClaseCategoriaFC.enable();
            return this.funcionesMtcService.mensajeError('No se encuentra información de la licencia de conducir. Deberá ingresar los datos en los campos correspondientes.');
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
            let categoriaConductor: string = "";

            categoriaConductor = datos.GetDatosLicenciaMTCResult.Licencia.Categoria?.trim() ?? '';
            if (categoriaConductor !== 'A IIIa') {
               categoriaValida = false;
            }

            console.log('categoriaConductor:', categoriaConductor);

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

   async validaConductorNomina(ruc: string, tipodocumento: string, numeroDocumento: string): Promise<boolean> {
      try {
         this.renatService.validarConductorPerteneceNominaConductores(ruc, tipodocumento, numeroDocumento).subscribe((data: any) => {
            console.log("nomina: ");
            console.log(data);
            if (data == "false") {
               //this.funcionesMtcService.mensajeError('El conductor no está registrado en la nómina de la empresa.');
               return false;
            }
            else
               return true;
         });
      } catch (error) {
         this.funcionesMtcService
            .ocultarCargando()
            .mensajeError('Problemas al consultar servicio de RENAT. Por favor, vuelva a intentar más tarde.');
         return false;
      }
   }

   async addConductor(): Promise<void> {
      if (
         this.f_s5_NumeroDocumentoConductorFC.value.trim() === '' ||
         this.f_s5_NombresApellidosFC.value.trim() === '' ||
         this.f_s5_NumeroLicenciaFC.value.trim() === ''
      ) {
         this.funcionesMtcService.mensajeError('Debe ingresar los campos faltantes');
         return;
      }
      const numeroDocumentoConductor = this.f_s5_NumeroDocumentoConductorFC.value;
      const indexFound = this.conductores.findIndex(item => item.numeroDocumentoConductor === numeroDocumentoConductor);

      if (indexFound !== -1) {
         if (indexFound !== this.recordIndexToEditConductores) {
            this.funcionesMtcService.mensajeError('El conductor ya se encuentra registrado');
            return;
         }
      }
      const tipoDocumentoConductor = this.f_s5_TipoDocumentoConductorFC.value;
      const nombresApellidos = this.f_s5_NombresApellidosFC.value;
      const edad = '';
      const numeroLicencia = this.f_s5_NumeroLicenciaFC.value;
      const categoria = this.f_s5_ClaseCategoriaFC.value;
      const subcategoria = '';

      if (this.recordIndexToEditConductores === -1) {
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

      this.f_s5_NombresApellidosFC.setValue('');
      this.f_s5_NumeroDocumentoConductorFC.setValue('');
      this.f_s5_NumeroLicenciaFC.setValue('');
      this.f_s5_ClaseCategoriaFC.setValue('');

      this.f_s5_NombresApellidosFC.disable();
      this.f_s5_NumeroLicenciaFC.disable();
      this.f_s5_ClaseCategoriaFC.disable();
   }

   editConductor(conductor: any, i: number): void {
      if (this.recordIndexToEditConductores !== -1) {
         return;
      }
      this.recordIndexToEditConductores = i;
      this.f_s5_NombresApellidosFC.setValue(conductor.nombresApellidos);
      this.f_s5_TipoDocumentoConductorFC.setValue(conductor.tipoDocumentoConductor);
      this.f_s5_NumeroDocumentoConductorFC.setValue(conductor.numeroDocumentoConductor);
      this.f_s5_NumeroLicenciaFC.setValue(conductor.numeroLicencia);
      this.f_s5_ClaseCategoriaFC.setValue(conductor.categoria);
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
   /********************************* */

   async addVin(): Promise<void> {
      if (
         this.f_s6_NumeroVinFC.value.trim() === '' &&
         this.f_s6_NumeroChasisSerieFC.value.trim() === ''
      ) {
         this.funcionesMtcService.mensajeError('Debe ingresar el número de VIN o el número de Chasis/Serie.');
         return;
      }

      if (
         this.f_s6_NumeroVinFC.value.trim() !== '' &&
         this.f_s6_NumeroVinFC.value.length !== 17
      ) {
         this.funcionesMtcService.mensajeError('El número de VIN debe tener 17 caracteres.');
         return;
      }

      const numeroVin = this.f_s6_NumeroVinFC.value ?? '';
      const numeroChasisSerie = this.f_s6_NumeroChasisSerieFC.value ?? '';
      const indexFoundVin = this.vin.findIndex(item => item.numeroVin === (numeroVin == '' ? '-' : numeroVin));
      const indexFoundChasis = this.vin.findIndex(item => item.numeroChasisSerie === (numeroChasisSerie == '' ? '-' : numeroChasisSerie));

      if (indexFoundVin !== -1) {
         if (indexFoundVin !== this.recordIndexToEditVin) {
            this.funcionesMtcService.mensajeError('El número de VIN ya se encuentra registrado.');
            return;
         }
      }

      if (indexFoundChasis !== -1) {
         if (indexFoundChasis !== this.recordIndexToEditVin) {
            this.funcionesMtcService.mensajeError('El número de Chasis/Serie ya se encuentra registrado.');
            return;
         }
      }

      if (this.recordIndexToEditVin === -1) {
         this.vin.push({
            numeroVin,
            numeroChasisSerie
         });
      } else {
         this.vin[this.recordIndexToEditVin].numeroVin = numeroVin;
         this.vin[this.recordIndexToEditVin].numeroChasisSerie = numeroChasisSerie;
      }

      this.clearVinData();
   }

   private clearVinData(): void {
      this.recordIndexToEditVin = -1;

      this.f_s6_NumeroVinFC.setValue('');
      this.f_s6_NumeroChasisSerieFC.setValue('');
   }

   editVin(vin: any, i: number): void {
      if (this.recordIndexToEditVin !== -1) {
         return;
      }
      this.recordIndexToEditVin = i;
      this.f_s6_NumeroVinFC.setValue(vin.numeroVin);
      this.f_s6_NumeroChasisSerieFC.setValue(vin.numeroChasisSerie);
   }

   deleteVin(vin: any, i: number): void {
      if (this.recordIndexToEditVin === -1) {
         this.funcionesMtcService
            .mensajeConfirmar('¿Está seguro de eliminar el registro seleccionado?')
            .then(() => {
               this.vin.splice(i, 1);
            });
      }
   }

   soloNumeros(event) {
      event.target.value = event.target.value.replace(/[^0-9]/g, '');
   }

   guardarFormulario() {

      this.formularioFG.markAllAsTouched();

      if (this.activarPJ) {
         if (this.f_s2_pj_rl_NombreFC.value == "" || this.f_s2_pj_rl_ApePaternoFC.value == "") {
            return this.funcionesMtcService.mensajeError('Debe ingresar todos los campos obligatorios');
         }
      }

      if (this.CIIU === false)
         return this.funcionesMtcService.mensajeError('La actividad principal del administrado no corresponde al procedimiento solicitado.');

      if (this.formularioFG.invalid) {
         return this.funcionesMtcService.mensajeError('Debe ingresar todos los campos obligatorios');
      }
      /*if (this.paAutorizacion.indexOf(this.codigoProcedimientoTupa) > -1) {
         if(!this.autorizacion){
            return this.funcionesMtcService.mensajeError('Debe ingresar todos los campos obligatorios');
         }
      }*/
      //this.formulario.disabled

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

      if (this.habilitarSeccion6) {
         if (this.vin.length == 0) {
            this.funcionesMtcService.mensajeError('Debe registrar la flota vehicular.');
            return;
         }
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

      const relacionVin: Vin[] = this.vin.map(vin => {
         return {
            numeroVin: vin.numeroVin,
            numeroChasisSerie: vin.numeroChasisSerie
         } as Vin;
      });

      let oficinaRepresentante = this.f_s2_pj_rl_OficinaFC.value;
      let oficinaEmpresa = this.f_s3_OficinaFC.value;
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
      dataGuardar.metaData.seccion3.nombresApellidos = (this.tipoSolicitante === 'PN' || this.tipoSolicitante === 'PNR' || this.tipoSolicitante === 'PE' ? this.f_s2_pn_NombresFC.value : '');
      dataGuardar.metaData.seccion3.tipoDocumento = (this.tipoSolicitante === "PJ" ? this.f_s2_pj_rl_TipoDocFC.value : this.tipoDocumentoSolicitante); //codDocumento
      dataGuardar.metaData.seccion3.numeroDocumento = (this.tipoSolicitante === "PJ" ? this.f_s2_pj_RucFC.value : this.f_s2_pn_NroDocSolicitanteFC.value); //nroDocumento
      dataGuardar.metaData.seccion3.ruc = (this.tipoSolicitante === "PJ" ? "" : this.f_s2_pn_RucFC.value);
      dataGuardar.metaData.seccion3.razonSocial = (this.tipoSolicitante === 'PJ' ? this.f_s2_pj_RazonSocialFC.value : '');
      dataGuardar.metaData.seccion3.domicilioLegal = (this.tipoSolicitante === 'PJ' ? this.f_s2_pj_DomicilioFC.value : this.f_s2_pn_DomicilioFC.value);
      dataGuardar.metaData.seccion3.distrito = (this.tipoSolicitante === 'PJ' ? this.f_s2_pj_DistritoFC.value : this.f_s2_pn_DistritoFC.value);
      dataGuardar.metaData.seccion3.provincia = (this.tipoSolicitante === 'PJ' ? this.f_s2_pj_ProvinciaFC.value : this.f_s2_pn_ProvinciaFC.value);
      dataGuardar.metaData.seccion3.departamento = (this.tipoSolicitante === 'PJ' ? this.f_s2_pj_DepartamentoFC.value : this.f_s2_pn_DepartamentoFC.value);

      dataGuardar.metaData.seccion3.representanteLegal.nombres = this.f_s2_pj_rl_NombreFC.value;
      dataGuardar.metaData.seccion3.representanteLegal.apellidoPaterno = this.f_s2_pj_rl_ApePaternoFC.value;
      dataGuardar.metaData.seccion3.representanteLegal.apellidoMaterno = this.f_s2_pj_rl_ApeMaternoFC.value;
      dataGuardar.metaData.seccion3.representanteLegal.tipoDocumento.id = this.f_s2_pj_rl_TipoDocFC.value;
      dataGuardar.metaData.seccion3.representanteLegal.tipoDocumento.documento = (this.tipoSolicitante === "PJ" ? this.listaTiposDocumentos.filter(item => item.id == this.f_s2_pj_rl_TipoDocFC.value)[0].documento : "");
      dataGuardar.metaData.seccion3.representanteLegal.numeroDocumento = this.f_s2_pj_rl_NroDocFC.value;
      dataGuardar.metaData.seccion3.representanteLegal.domicilioLegal = this.f_s2_pj_rl_DomicilioFC.value;
      dataGuardar.metaData.seccion3.representanteLegal.oficinaRegistral.id = oficinaRepresentante;
      dataGuardar.metaData.seccion3.representanteLegal.oficinaRegistral.descripcion = (this.tipoSolicitante === "PJ" ? this.oficinasRegistral.filter(item => item.value == oficinaRepresentante)[0].text : "");
      dataGuardar.metaData.seccion3.representanteLegal.partida = this.f_s2_pj_rl_PartidaFC.value;
      dataGuardar.metaData.seccion3.representanteLegal.asiento = this.f_s2_pj_rl_AsientoFC.value;
      dataGuardar.metaData.seccion3.representanteLegal.distrito = this.f_s2_pj_rl_DistritoFC.value;
      dataGuardar.metaData.seccion3.representanteLegal.provincia = this.f_s2_pj_rl_ProvinciaFC.value;
      dataGuardar.metaData.seccion3.representanteLegal.departamento = this.f_s2_pj_rl_DepartamentoFC.value;
      dataGuardar.metaData.seccion3.representanteLegal.cargo = this.cargoRepresentanteLegal;
      dataGuardar.metaData.seccion3.telefono = (this.tipoSolicitante === 'PJ' ? this.f_s2_pj_rl_TelefonoFC.value : this.f_s2_pn_TelefonoFC.value);
      dataGuardar.metaData.seccion3.celular = (this.tipoSolicitante === 'PJ' ? this.f_s2_pj_rl_CelularFC.value : this.f_s2_pn_CelularFC.value);
      dataGuardar.metaData.seccion3.email = (this.tipoSolicitante === 'PJ' ? this.f_s2_pj_rl_CorreoFC.value : this.f_s2_pn_CorreoFC.value);

      dataGuardar.metaData.seccion4.opcion1 = (this.f_s3_TipoServicioFC.value == "1" ? true : false);
      dataGuardar.metaData.seccion4.opcion2 = (this.f_s3_TipoServicioFC.value == "2" ? true : false);
      dataGuardar.metaData.seccion4.opcion3 = (this.f_s3_TipoServicioFC.value == "3" ? true : false);
      dataGuardar.metaData.seccion4.opcion4 = (this.f_s3_TipoServicioFC.value == "4" ? true : false);
      dataGuardar.metaData.seccion4.oficina_registral.id = oficinaEmpresa;
      dataGuardar.metaData.seccion4.oficina_registral.descripcion = (this.tipoSolicitante === "PJ" ? this.oficinasRegistral.filter(item => item.value == oficinaEmpresa)[0].text : "");
      dataGuardar.metaData.seccion4.partida_registral = (this.tipoSolicitante === "PJ" ? this.f_s3_PartidaFC.value : "");
      dataGuardar.metaData.seccion4.asiento = (this.tipoSolicitante === "PJ" ? this.f_s3_AsientoFC.value : "");

      dataGuardar.metaData.seccion4.fileEstatutoSocial = this.filePdfEstatutoSocialSeleccionado;
      dataGuardar.metaData.seccion4.pathNameEstatutoSocial = this.pathPdfEstatutoSocialSeleccionado;

      dataGuardar.metaData.seccion5.relacionConductores = relacionConductores;

      dataGuardar.metaData.seccion6.declaracion_61 = this.f_s4_Declaracion_61FC.value;
      dataGuardar.metaData.seccion6.declaracion_62 = this.f_s4_Declaracion_62FC.value;
      dataGuardar.metaData.seccion6.declaracion_63 = this.f_s4_Declaracion_63FC.value;
      dataGuardar.metaData.seccion6.declaracion_64 = this.f_s4_Declaracion_64FC.value;
      dataGuardar.metaData.seccion6.declaracion_65 = this.f_s4_Declaracion_65FC.value;
      dataGuardar.metaData.seccion6.declaracion_66 = this.f_s4_Declaracion_66FC.value;
      dataGuardar.metaData.seccion6.declaracion_67 = this.f_s4_Declaracion_67FC.value;
      dataGuardar.metaData.seccion6.declaracion_68 = this.f_s4_Declaracion_68FC.value;
      dataGuardar.metaData.seccion6.declaracion_69 = this.f_s4_Declaracion_69FC.value;

      dataGuardar.metaData.seccion7.tipoDocumentoSolicitante = (this.tipoSolicitante === 'PJ' ? this.f_s2_pj_rl_TipoDocFC.value : this.tipoDocumentoSolicitante);
      dataGuardar.metaData.seccion7.nombreTipoDocumentoSolicitante = (this.tipoSolicitante === 'PJ' ? this.listaTiposDocumentos.filter(item => item.id == this.f_s2_pj_rl_TipoDocFC.value)[0].documento : this.f_s2_pn_TipoDocSolicitanteFC.value);
      dataGuardar.metaData.seccion7.numeroDocumentoSolicitante = (this.tipoSolicitante === 'PJ' ? this.f_s2_pj_rl_NroDocFC.value : this.f_s2_pn_NroDocSolicitanteFC.value);
      dataGuardar.metaData.seccion7.nombresApellidosSolicitante = (this.tipoSolicitante === 'PJ' ? this.f_s2_pj_rl_NombreFC.value + ' ' + this.f_s2_pj_rl_ApePaternoFC.value + ' ' + this.f_s2_pj_rl_ApeMaternoFC.value : this.f_s2_pn_NombresFC.value);

      dataGuardar.metaData.seccion8.relacionVin = relacionVin;

      const dataGuardarFormData = this.funcionesMtcService.jsonToFormData(dataGuardar);
      console.log(dataGuardar);

      this.funcionesMtcService.mensajeConfirmar(`¿Está seguro de ${this.id === 0 ? 'guardar' : 'modificar'} los datos ingresados?`)
         .then(() => {

            console.log(JSON.stringify(dataGuardar));

            if (this.id === 0) {
               this.funcionesMtcService.mostrarCargando();
               //GUARDAR:
               this.formularioService.post(dataGuardarFormData)
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
                        this.formularioService.put(dataGuardarFormData)
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
                  this.formularioService.put(dataGuardarFormData)
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
      if (this.formularioFG.get(control))
         return this.formularioFG.get(control).invalid && (this.formularioFG.get(control).dirty || this.formularioFG.get(control).touched);
   }
}