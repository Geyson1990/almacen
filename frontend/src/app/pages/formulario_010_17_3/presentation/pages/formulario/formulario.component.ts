/**
 * Formulario 004/17.03 utilizado por los procedimientos DCV-015, DCV-016, DCV-017 y DCV-018
 * @author Alicia Toquila Quispe
 * @version 1.0 21.03.2024
*/
import { Component, OnInit, Input, Injectable, ViewChild, AfterViewInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, AbstractControl, FormArray } from '@angular/forms';
import { NgbActiveModal, NgbAccordionDirective, NgbModal, NgbDateStruct, NgbDatepickerI18n, NgbDateParserFormatter, NgbDateAdapter } from '@ng-bootstrap/ng-bootstrap';
import { TramiteService } from 'src/app/core/services/tramite/tramite.service';
import { OficinaRegistralService } from '../../../../../core/services/servicios/oficinaregistral.service';
import { FuncionesMtcService } from '../../../../../core/services/funciones-mtc.service';
import { SeguridadService } from '../../../../../core/services/seguridad.service';
import { TipoDocumentoModel } from '../../../../../core/models/TipoDocumentoModel';
import { RepresentanteLegal } from 'src/app/core/models/SunatModel';
import { ReniecService } from '../../../../../core/services/servicios/reniec.service';
import { ExtranjeriaService } from '../../../../../core/services/servicios/extranjeria.service';
import { FormularioTramiteService } from '../../../../../core/services/tramite/formulario-tramite.service';
import { Formulario010_17_3Request } from '../../../domain/formulario010_17_3/formulario010_17_3Request';
import { Formulario010_17_3Response } from '../../../domain/formulario010_17_3/formulario010_17_3Response';
import { Formulario010_17_3Service } from '../../../application/usecases';
import { SunatService } from '../../../../../core/services/servicios/sunat.service';
import { exactLengthValidator, noWhitespaceValidator } from 'src/app/helpers/validator';
import { VisorPdfArchivosService } from '../../../../../core/services/tramite/visor-pdf-archivos.service';
import { VistaPdfComponent } from '../../../../../shared/components/vista-pdf/vista-pdf.component';
import { UbigeoComponent } from '../../../../../shared/components/forms/ubigeo/ubigeo.component';
import { DatosUsuarioLogin } from 'src/app/core/models/Autenticacion/DatosUsuarioLogin';
import { defaultRadioGroupAppearanceProvider } from 'pdf-lib';
import { TranslationWidth } from '@angular/common';

//#region  CONSIGURACION DE FORMATO DE FECHA

@Injectable()
export class CustomDateParserFormatter extends NgbDateParserFormatter {

   readonly DELIMITER = '/';

   parse(value: string): NgbDateStruct | null {
      if (value) {
         let date = value.split(this.DELIMITER);
         return {
            day: parseInt(date[0], 10),
            month: parseInt(date[1], 10),
            year: parseInt(date[2], 10)
         };
      }
      return null;
   }

   format(date: NgbDateStruct | null): string {
      if (date) {
         const day = String(date.day).length > 1 ? date.day : "0" + date.day;
         const month = String(date.month).length > 1 ? date.month : "0" + date.month;
         return date ? day + this.DELIMITER + month + this.DELIMITER + date.year : '';
      } else {
         return "";
      }
   }
}

const I18N_VALUES = {
   'fr': {
      weekdays: ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'],
      months: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Set', 'Oct', 'Nov', 'Dic'],
   }
};

@Injectable()
export class I18n {
   language = 'fr';
}

@Injectable()
export class CustomDatepickerI18n extends NgbDatepickerI18n {

   constructor(private _i18n: I18n) {
      super();
   }

   getWeekdayLabel(weekday: number, width?: TranslationWidth): string {
      return I18N_VALUES[this._i18n.language].weekdays[weekday - 1];
   }
   getWeekdayShortName(weekday: number): string {
      return I18N_VALUES[this._i18n.language].weekdays[weekday - 1];
   }
   getMonthShortName(month: number): string {
      return I18N_VALUES[this._i18n.language].months[month - 1];
   }
   getMonthFullName(month: number): string {
      return this.getMonthShortName(month);
   }

   getDayAriaLabel(date: NgbDateStruct): string {
      return `${date.day}-${date.month}-${date.year}`;
   }
}
//#endregion

@Component({
   selector: 'app-formulario',
   templateUrl: './formulario.component.html',
   styleUrls: ['./formulario.component.css'],
   providers: [
      { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
      I18n, { provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n } // define custom NgbDatepickerI18n provider
   ]
})
export class FormularioComponent implements OnInit, AfterViewInit {

   @Input() public dataInput: any;
   @Input() public dataRequisitosInput: any;
   @ViewChild('acc') acc: NgbAccordionDirective;

   @ViewChild('ubigeoCmpPerNat') ubigeoPerNatComponent: UbigeoComponent;
   @ViewChild('ubigeoCmpRepLeg') ubigeoRepLegComponent: UbigeoComponent;
   @ViewChild('ubigeoCmpTaller') ubigeoTallerComponent: UbigeoComponent;

   disabled: boolean = true;
   graboUsuario: boolean = false;

   codigoProcedimientoTupa: string;
   descProcedimientoTupa: string;
   tramiteSelected: string;
   codigoTipoSolicitudTupa: string;
   descTipoSolicitudTupa: string;

   datosUsuarioLogin: DatosUsuarioLogin;

   txtTitulo: string = '';
   id: number = 0;
   uriArchivo: string = '';//PARA SABER EL NOMBRE DEL PDF (COMPLETO CON TODO Y ADJUNTOS)
   tipoDocumentoValidForm: string;
   formulario: UntypedFormGroup;
   listaTiposDocumentos: TipoDocumentoModel[] = [
      { id: "01", documento: 'DNI' },
      { id: "04", documento: 'Carnet de Extranjería' },
   ];
   representanteLegal: RepresentanteLegal[] = [];
   activarDatosGenerales: boolean = false;
   txtTituloCompleto: string = "FORMULARIO 010/17.03 TALLER DE CONVERSION A GAS NATURAL VEHICULAR - GNV O TALLER DE CONVERSIÓN A GAS LICUADO DE PETROLEO - GLP";
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
   codTipoDocSolicitante: string = ""; // 01 DNI  03 CI  04 CE   

   //Datos de Formulario
   tituloFormulario = "FORMULARIO 010/17.03 TALLER DE CONVERSION A GAS NATURAL VEHICULAR - GNV O TALLER DE CONVERSIÓN A GAS LICUADO DE PETROLEO - GLP";
   tipoPersona: number = 1;

   seccionDatosEmpresa: string[] = ["DCV-034"];
   activarDatosEmpresa: boolean = true;

   activarPN: boolean = false;
   activarPJ: boolean = false;

   maxLengthNumeroDocumentoRepLeg: number;
   maxLengthNumeroDocumentoDatCont: number;

   disableBtnBuscarRepLegal = false;

   fechaAutorizacion: string = "";
   oficinaRegistralDJ: string = "";

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
      private formularioService: Formulario010_17_3Service,
      private visorPdfArchivosService: VisorPdfArchivosService,
      private modalService: NgbModal,
      private sunatService: SunatService) {
   }

   async ngOnInit(): Promise<void> {
      const tramiteSelected: any = JSON.parse(localStorage.getItem('tramite-selected'));
      console.log("Codigo de procedimiento: " + tramiteSelected.codigo);
      this.codigoProcedimientoTupa = tramiteSelected.codigo;
      this.descProcedimientoTupa = tramiteSelected.nombre;
      this.codigoTipoSolicitudTupa = (this.dataInput.tipoSolicitudTupaCod == "" ? "0" : this.dataInput.tipoSolicitudTupaCod);
      this.descTipoSolicitudTupa = this.dataInput.tipoSolicitudTupaDesc;

      this.uriArchivo = this.dataInput.rutaDocumento;
      this.id = this.dataInput.movId;

      if (this.seccionDatosEmpresa.indexOf(this.codigoProcedimientoTupa) > -1) this.activarDatosEmpresa = true; else this.activarDatosEmpresa = false;

      this.formulario = this.fb.group({
         tipoDocumentoSolicitante: ['', [Validators.required]],
         nroDocumentoSolicitante: ['', [Validators.required]],

         modalidad: ['casilla'],

         Seccion3: this.fb.group({
            f_s3_datosEmpresa: this.fb.group({
               f_s3_de_partida: (this.activarDatosEmpresa ? this.fb.control('', [Validators.required, Validators.maxLength(11)]) : ['']),
               f_s3_de_oficina: (this.activarDatosEmpresa ? this.fb.control('', [Validators.required, Validators.maxLength(11)]) : ['']),
               f_s3_de_autorizacion: (this.activarDatosEmpresa ? this.fb.control('', [Validators.required, Validators.maxLength(100)]) : ['']),
               f_s3_de_fechaAutorizacion:(this.activarDatosEmpresa ? this.fb.control('', [Validators.required, Validators.maxLength(100)]) : this.fb.control(null))
            }),
            PersonaJuridica: this.fb.group({
               pj_ruc: ['', [Validators.required, Validators.maxLength(11)]],
               pj_razonSocial: ['', [Validators.required, Validators.maxLength(80)]],
               pj_domicilio: ['', [Validators.required, Validators.maxLength(150)]],
               pj_distrito: ['', [Validators.required, Validators.maxLength(20)]],
               pj_provincia: ['', [Validators.required, Validators.maxLength(20)]],
               pj_departamento: ['', [Validators.required, Validators.maxLength(20)]],
            }),
            RepresentanteLegal: this.fb.group({
               rl_tipoDocumento: ['', [Validators.required, Validators.maxLength(10)]],
               rl_numeroDocumento: ['', [Validators.required, exactLengthValidator([8, 9])]],
               rl_nombre: [{ value: '', disabled: true }, [Validators.required, Validators.maxLength(30)]],
               rl_apePaterno: [{ value: '', disabled: true }, [Validators.required, Validators.maxLength(30)]],
               rl_apeMaterno: [{ value: '', disabled: true }, [Validators.required, Validators.maxLength(30)]],
               rl_domicilio: ['', [Validators.required, Validators.maxLength(80)]],
               rl_telefono: ['', [Validators.maxLength(12)]],
               rl_celular: ['', [Validators.required, Validators.maxLength(9)]],
               rl_correo: ['', [Validators.required, Validators.email, noWhitespaceValidator(), Validators.maxLength(50)]],
               rl_distrito: ['', [Validators.required, Validators.maxLength(20)]],
               rl_provincia: ['', [Validators.required, Validators.maxLength(20)]],
               rl_departamento: ['', [Validators.required, Validators.maxLength(20)]],
               rl_zona: ['', [Validators.required, Validators.maxLength(20)]],
               rl_oficina: ['', [Validators.required, Validators.maxLength(20)]],
               rl_partida: ['', [Validators.required, Validators.maxLength(9)]],
               rl_asiento: ['', [Validators.required, Validators.maxLength(9)]],
            }),
         }),
         Seccion4: this.fb.group({
            taller_nombre: ['', [Validators.required, Validators.maxLength(150)]],
            taller_domicilio: ['', [Validators.required, Validators.maxLength(150)]],
            taller_distrito: ['', [Validators.required, Validators.maxLength(20)]],
            taller_provincia: ['', [Validators.required, Validators.maxLength(20)]],
            taller_departamento: ['', [Validators.required, Validators.maxLength(20)]],
         }),
         declaracion_1: this.fb.control(false, [Validators.requiredTrue]),
         declaracion_2: this.fb.control(false, [Validators.requiredTrue]),
         declaracion_3: this.fb.control(false, [Validators.requiredTrue]),
         declaracion_4: this.fb.control(false, [Validators.requiredTrue]),
         declaracion_5: this.fb.control(false, [Validators.requiredTrue]),
         declaracion_6: (this.codigoProcedimientoTupa == "DCV-035" ? this.fb.control(false, [Validators.requiredTrue]) : this.fb.control(false))
      });
   }

   async ngAfterViewInit(): Promise<void> {

      this.nroRuc = this.seguridadService.getCompanyCode();
      this.nombreUsuario = this.seguridadService.getUserName();       //nombre de usuario login
      const tipoDocumento = this.seguridadService.getNameId();   //tipo de documento usuario login
      this.nroDocumentoLogin = this.seguridadService.getNumDoc();    //nro de documento usuario login
      this.datosUsuarioLogin = this.seguridadService.getDatosUsuarioLogin(); // Datos personales del usuario

      this.tipoDocumentoValidForm = tipoDocumento;
      console.log("TIPO DOCUMENTO", tipoDocumento); //00001
      console.log("NUMERO", this.nroDocumentoLogin);

      await this.cargarOficinaRegistral();
      setTimeout(async () => {
         await this.cargarDatos();
      });
   }

   // GET FORM formularioFG

   get f_TipoDocumentoSolicitante(): AbstractControl { return this.formulario.get(['tipoDocumentoSolicitante']); }
   get f_NroDocumentoSolicitante(): AbstractControl { return this.formulario.get(['nroDocumentoSolicitante']); }

   get f_modalidad(): AbstractControl { return this.formulario.get(['modalidad']); }

   get f_Seccion3(): UntypedFormGroup { return this.formulario.get('Seccion3') as UntypedFormGroup; }
   get f_s3_datosEmpresa(): UntypedFormGroup { return this.f_Seccion3.get('f_s3_datosEmpresa') as UntypedFormGroup; }
   get f_s3_de_partida(): AbstractControl { return this.f_s3_datosEmpresa.get(['f_s3_de_partida']); }
   get f_s3_de_oficina(): AbstractControl { return this.f_s3_datosEmpresa.get(['f_s3_de_oficina']); }
   get f_s3_de_autorizacion(): AbstractControl { return this.f_s3_datosEmpresa.get(['f_s3_de_autorizacion']); }
   get f_s3_de_fechaAutorizacion(): AbstractControl { return this.f_s3_datosEmpresa.get(['f_s3_de_fechaAutorizacion']); }

   get f_s3_PersonaJuridica(): UntypedFormGroup { return this.f_Seccion3.get('PersonaJuridica') as UntypedFormGroup; }
   get f_s3_pj_Ruc(): AbstractControl { return this.f_s3_PersonaJuridica.get(['pj_ruc']); }
   get f_s3_pj_RazonSocial(): AbstractControl { return this.f_s3_PersonaJuridica.get(['pj_razonSocial']); }
   get f_s3_pj_Domicilio(): AbstractControl { return this.f_s3_PersonaJuridica.get(['pj_domicilio']); }
   get f_s3_pj_Departamento(): AbstractControl { return this.f_s3_PersonaJuridica.get(['pj_departamento']); }
   get f_s3_pj_Provincia(): AbstractControl { return this.f_s3_PersonaJuridica.get(['pj_provincia']); }
   get f_s3_pj_Distrito(): AbstractControl { return this.f_s3_PersonaJuridica.get(['pj_distrito']); }

   get f_s3_RepresentanteLegal(): UntypedFormGroup { return this.f_Seccion3.get('RepresentanteLegal') as UntypedFormGroup; }
   get f_s3_rl_TipoDocumento(): AbstractControl { return this.f_s3_RepresentanteLegal.get(['rl_tipoDocumento']); }
   get f_s3_rl_NumeroDocumento(): AbstractControl { return this.f_s3_RepresentanteLegal.get(['rl_numeroDocumento']); }
   get f_s3_rl_Nombre(): AbstractControl { return this.f_s3_RepresentanteLegal.get(['rl_nombre']); }
   get f_s3_rl_ApePaterno(): AbstractControl { return this.f_s3_RepresentanteLegal.get(['rl_apePaterno']); }
   get f_s3_rl_ApeMaterno(): AbstractControl { return this.f_s3_RepresentanteLegal.get(['rl_apeMaterno']); }
   get f_s3_rl_Telefono(): AbstractControl { return this.f_s3_RepresentanteLegal.get(['rl_telefono']); }
   get f_s3_rl_Celular(): AbstractControl { return this.f_s3_RepresentanteLegal.get(['rl_celular']); }
   get f_s3_rl_Correo(): AbstractControl { return this.f_s3_RepresentanteLegal.get(['rl_correo']); }
   get f_s3_rl_Domicilio(): AbstractControl { return this.f_s3_RepresentanteLegal.get(['rl_domicilio']); }
   get f_s3_rl_Departamento(): AbstractControl { return this.f_s3_RepresentanteLegal.get(['rl_departamento']); }
   get f_s3_rl_Provincia(): AbstractControl { return this.f_s3_RepresentanteLegal.get(['rl_provincia']); }
   get f_s3_rl_Distrito(): AbstractControl { return this.f_s3_RepresentanteLegal.get(['rl_distrito']); }
   get f_s3_rl_Zona(): AbstractControl { return this.f_s3_RepresentanteLegal.get(['rl_zona']); }
   get f_s3_rl_Oficina(): AbstractControl { return this.f_s3_RepresentanteLegal.get(['rl_oficina']); }
   get f_s3_rl_Partida(): AbstractControl { return this.f_s3_RepresentanteLegal.get(['rl_partida']); }
   get f_s3_rl_Asiento(): AbstractControl { return this.f_s3_RepresentanteLegal.get(['rl_asiento']); }

   get f_Seccion4(): UntypedFormGroup { return this.formulario.get('Seccion4') as UntypedFormGroup; }
   get f_s4_taller_Nombre(): AbstractControl { return this.f_Seccion4.get(['taller_nombre']); }
   get f_s4_taller_Domicilio(): AbstractControl { return this.f_Seccion4.get(['taller_domicilio']); }
   get f_s4_taller_Departamento(): AbstractControl { return this.f_Seccion4.get(['taller_departamento']); }
   get f_s4_taller_Provincia(): AbstractControl { return this.f_Seccion4.get(['taller_provincia']); }
   get f_s4_taller_Distrito(): AbstractControl { return this.f_Seccion4.get(['taller_distrito']); }

   get f_declaracion_1(): AbstractControl { return this.formulario.get(['declaracion_1']); }
   get f_declaracion_2(): AbstractControl { return this.formulario.get(['declaracion_2']); }
   get f_declaracion_3(): AbstractControl { return this.formulario.get(['declaracion_3']); }
   get f_declaracion_4(): AbstractControl { return this.formulario.get(['declaracion_4']); }
   get f_declaracion_5(): AbstractControl { return this.formulario.get(['declaracion_5']); }
   get f_declaracion_6(): AbstractControl { return this.formulario.get(['declaracion_6']); }
   
   // FIN GET FORM formularioFG


   async cargarOficinaRegistral(): Promise<void> {
      try {
         const dataOficinaRegistral = await this._oficinaRegistral.oficinaRegistral().toPromise();
         this.oficinasRegistral = dataOficinaRegistral;
         this.funcionesMtcService.ocultarCargando();
      }
      catch (e) {
         this.funcionesMtcService
            .ocultarCargando()
            .mensajeError('Problemas para conectarnos con el servicio y recuperar datos de la oficina registral');
      }
   }

   onChangeTipoDocumento() {
      this.f_s3_rl_TipoDocumento.valueChanges.subscribe((tipoDocumento: string) => {
         if (tipoDocumento?.trim() === '04') { // carnet de extranejria
            this.f_s3_rl_ApeMaterno.clearValidators();
            this.f_s3_rl_ApeMaterno.updateValueAndValidity();

            this.f_s3_rl_NumeroDocumento.setValidators([Validators.required, exactLengthValidator([9])]);
            this.f_s3_rl_NumeroDocumento.updateValueAndValidity();
            this.maxLengthNumeroDocumentoRepLeg = 9;
            this.maxLengthNumeroDocumentoDatCont = 9;
         } else {
            this.f_s3_rl_ApeMaterno.setValidators([Validators.required]);
            this.f_s3_rl_ApeMaterno.updateValueAndValidity();

            this.f_s3_rl_NumeroDocumento.setValidators([Validators.required, exactLengthValidator([8])]);
            this.f_s3_rl_NumeroDocumento.updateValueAndValidity();
            this.maxLengthNumeroDocumentoRepLeg = 8;
            this.maxLengthNumeroDocumentoDatCont = 8;
         }

         this.f_s3_rl_NumeroDocumento.reset('', { emitEvent: false });
         this.inputNumeroDocumento();
      });
   }

   onChangeOficina() {
      this.oficinaRegistralDJ = this.oficinasRegistral.filter(item => item.value == this.f_s3_de_oficina.value)[0].text;
   }

   getMaxLengthNumeroDocumento() {
      const tipoDocumento: string = this.formulario.controls['tipoDocumento'].value.trim();

      if (tipoDocumento === '01')//N° de DNI
         return 8;
      else if (tipoDocumento === '04')//Carnet de extranjería
         return 12;
      return 0
   }

   inputNumeroDocumento(event?): void {
      if (event) {
         event.target.value = event.target.value.replace(/[^0-9]/g, '');
      }

      this.f_s3_rl_Nombre.reset('', { emitEvent: false });
      this.f_s3_rl_ApePaterno.reset('', { emitEvent: false });
      this.f_s3_rl_ApeMaterno.reset('', { emitEvent: false });
   }

   async buscarNumeroDocumento(): Promise<void> {
      const tipoDocumento: string = this.f_s3_rl_TipoDocumento.value.trim();
      const numeroDocumento: string = this.f_s3_rl_NumeroDocumento.value.trim();
      console.log("TipoDocumento: " + tipoDocumento);
      console.log("Numero Documento: " + numeroDocumento);

      if (tipoDocumento.length === 0 || numeroDocumento.length === 0) {
         this.funcionesMtcService.mensajeError('Debe ingresar Tipo de Documento y/o Número de Documento');
         return;
      }
      if (tipoDocumento === '01' && numeroDocumento.length !== 8) {
         this.funcionesMtcService.mensajeError('DNI debe tener 8 caracteres');
         return;
      }

      const resultado = this.representanteLegal?.find(
         representante => (
            '0' + representante.tipoDocumento.trim()).toString() === tipoDocumento &&
            representante.nroDocumento.trim() === numeroDocumento
      );

      if (resultado || this.tipoSolicitante === 'PNR') {
         this.funcionesMtcService.mostrarCargando();

         if (tipoDocumento === '01') {// DNI
            try {
               const respuesta = await this.reniecService.getDni(numeroDocumento).toPromise();
               console.log(respuesta);
               this.funcionesMtcService.ocultarCargando();

               if (respuesta.reniecConsultDniResponse.listaConsulta.coResultado !== '0000') {
                  return this.funcionesMtcService.mensajeError('Número de documento no registrado en Reniec');
               }

               const datosPersona = respuesta.reniecConsultDniResponse.listaConsulta.datosPersona;
               const ubigeo = datosPersona.ubigeo.split('/');
               const cargo = resultado?.cargo?.split('-');
               if (cargo) {
                  this.cargoRepresentanteLegal = cargo[cargo.length - 1].trim();
               }
               this.addPersona(tipoDocumento,
                  datosPersona.prenombres,
                  datosPersona.apPrimer,
                  datosPersona.apSegundo,
                  datosPersona.direccion,
                  ubigeo[2],
                  ubigeo[1],
                  ubigeo[0]);

               this.f_TipoDocumentoSolicitante.setValue(tipoDocumento);
               this.f_NroDocumentoSolicitante.setValue(numeroDocumento);
            }
            catch (e) {
               console.error(e);

               this.funcionesMtcService.ocultarCargando().mensajeError('Error al consultar al servicio');
               this.f_s3_rl_Nombre.enable();
               this.f_s3_rl_ApePaterno.enable();
               this.f_s3_rl_ApeMaterno.enable();
            }
         } else if (tipoDocumento === '04') {// CARNÉ DE EXTRANJERÍA
            try {
               const respuesta = await this.extranjeriaService.getCE(numeroDocumento).toPromise();

               this.funcionesMtcService.ocultarCargando();

               if (respuesta.CarnetExtranjeria.numRespuesta !== '0000') {
                  return this.funcionesMtcService.mensajeError('Número de documento no registrado en Migraciones');
               }

               this.addPersona(tipoDocumento,
                  respuesta.CarnetExtranjeria.nombres,
                  respuesta.CarnetExtranjeria.primerApellido,
                  respuesta.CarnetExtranjeria.segundoApellido,
                  '',
                  '',
                  '',
                  '');
            }
            catch (e) {
               console.error(e);

               this.funcionesMtcService.ocultarCargando().mensajeError('Error al consultar al servicio');
               this.f_s3_rl_Nombre.enable();
               this.f_s3_rl_ApePaterno.enable();
               this.f_s3_rl_ApeMaterno.enable();
            }
         }
      } else {
         return this.funcionesMtcService.mensajeError('Representante legal no encontrado');
      }
   }

   async addPersona(
      tipoDocumento: string,
      nombres: string,
      apPaterno: string,
      apMaterno: string,
      direccion: string,
      distrito: string,
      provincia: string,
      departamento: string): Promise<void> {

      if (this.tipoSolicitante === 'PNR') {
         this.f_s3_rl_Nombre.setValue(nombres);
         this.f_s3_rl_ApePaterno.setValue(apPaterno);
         this.f_s3_rl_ApeMaterno.setValue(apMaterno);
         this.f_s3_rl_Domicilio.setValue(direccion);

         this.f_s3_rl_Nombre.disable({ emitEvent: false });
         this.f_s3_rl_ApePaterno.disable({ emitEvent: false });
         this.f_s3_rl_ApeMaterno.disable({ emitEvent: false });

         await this.ubigeoRepLegComponent?.setUbigeoByText(
            departamento,
            provincia,
            distrito);
      }
      else {
         this.funcionesMtcService
            .mensajeConfirmar(`Los datos ingresados fueron validados por ${tipoDocumento === '01' ? 'RENIEC' : 'MIGRACIONES'} corresponden a la persona ${nombres} ${apPaterno} ${apMaterno}. ¿Está seguro de agregarlo?`)
            .then(async () => {
               this.f_s3_rl_Nombre.setValue(nombres);
               this.f_s3_rl_ApePaterno.setValue(apPaterno);
               this.f_s3_rl_ApeMaterno.setValue(apMaterno);
               this.f_s3_rl_Domicilio.setValue(direccion);

               this.f_s3_rl_Nombre.disable({ emitEvent: false });
               this.f_s3_rl_ApePaterno.disable({ emitEvent: false });
               this.f_s3_rl_ApeMaterno.disable({ emitEvent: false });

               await this.ubigeoRepLegComponent?.setUbigeoByText(
                  departamento,
                  provincia,
                  distrito);
            });
      }
   }

   async cargarDatos(): Promise<void> {
      this.funcionesMtcService.mostrarCargando();

      switch (this.seguridadService.getNameId()) {
         case '00001': this.tipoSolicitante = 'PN'; //persona natural
            this.f_TipoDocumentoSolicitante.setValue('DNI');
            this.f_NroDocumentoSolicitante.setValue(this.nroDocumentoLogin);
            this.codTipoDocSolicitante = '01';
            this.actualizarValidaciones(this.tipoSolicitante);
            break;

         case '00002': this.tipoSolicitante = 'PJ'; // persona juridica
            this.f_TipoDocumentoSolicitante.setValue('DNI');
            this.codTipoDocSolicitante = '01';
            this.f_NroDocumentoSolicitante.setValue(this.nroDocumentoLogin);
            this.actualizarValidaciones(this.tipoSolicitante);
            break;

         case '00004': this.tipoSolicitante = 'PE'; // persona extranjera
            this.f_TipoDocumentoSolicitante.setValue('CARNET DE EXTRANJERIA');
            this.codTipoDocSolicitante = '04';
            this.f_NroDocumentoSolicitante.setValue(this.nroDocumentoLogin);
            break;

         case '00005': this.tipoSolicitante = 'PNR'; // persona natural con ruc
            this.f_TipoDocumentoSolicitante.setValue('DNI');
            this.codTipoDocSolicitante = '01';
            this.f_NroDocumentoSolicitante.setValue(this.nroDocumentoLogin);
            break;
      }
      
      if (this.dataInput != null && this.dataInput.movId > 0) {
         try {
            const response = await this.sunatService.getDatosPrincipales(this.nroRuc).toPromise();
            this.representanteLegal = response.representanteLegal;

            const dataFormulario = await this.formularioTramiteService.get<Formulario010_17_3Response>(this.dataInput.tramiteReqId).toPromise();
            this.funcionesMtcService.ocultarCargando();
            const metaData = JSON.parse(dataFormulario.metaData);
            console.log(metaData);
            this.id = dataFormulario.formularioId;
            (metaData.seccion2.modalidad) ? this.f_modalidad.setValue(metaData.seccion2.modalidad) : "";

            this.f_s3_pj_Ruc.setValue(metaData.seccion3.numeroDocumento);
            this.f_s3_pj_RazonSocial.setValue(metaData.seccion3.razonSocial);
            this.f_s3_pj_Domicilio.setValue(metaData.seccion3.domicilioLegal);

            this.f_s3_pj_Departamento.setValue(metaData.seccion3.departamento.trim());
            this.f_s3_pj_Provincia.setValue(metaData.seccion3.provincia.trim());
            this.f_s3_pj_Distrito.setValue(metaData.seccion3.distrito.trim());

            this.f_s3_rl_Telefono.setValue(metaData.seccion3.telefono);
            this.f_s3_rl_Celular.setValue(metaData.seccion3.celular);
            this.f_s3_rl_Correo.setValue(metaData.seccion3.email);
            this.f_s3_rl_TipoDocumento.setValue(metaData.seccion3.representanteLegal.tipoDocumento.id);
            this.f_s3_rl_NumeroDocumento.setValue(metaData.seccion3.representanteLegal.numeroDocumento);
            this.f_s3_rl_Nombre.setValue(metaData.seccion3.representanteLegal.nombres);
            this.f_s3_rl_ApePaterno.setValue(metaData.seccion3.representanteLegal.apellidoPaterno);
            this.f_s3_rl_ApeMaterno.setValue(metaData.seccion3.representanteLegal.apellidoMaterno);
            this.f_s3_rl_Domicilio.setValue(metaData.seccion3.representanteLegal.domicilioLegal);

            this.f_s3_rl_Zona.setValue(metaData.seccion3.representanteLegal.zona);
            this.f_s3_rl_Oficina.setValue(metaData.seccion3.representanteLegal.oficinaRegistral.id);
            this.f_s3_rl_Partida.setValue(metaData.seccion3.representanteLegal.partida);
            this.f_s3_rl_Asiento.setValue(metaData.seccion3.representanteLegal.asiento);

            this.f_s3_pj_RazonSocial.disable();
            this.f_s3_pj_Ruc.disable();
            this.f_s3_pj_Domicilio.disable();
            this.f_s3_pj_Distrito.disable({ emitEvent: false });
            this.f_s3_pj_Provincia.disable({ emitEvent: false });
            this.f_s3_pj_Departamento.disable({ emitEvent: false });

            this.f_s3_rl_Departamento.setValue(metaData.seccion3.representanteLegal.departamento.id);
            this.f_s3_rl_Provincia.setValue(metaData.seccion3.representanteLegal.provincia.id);
            this.f_s3_rl_Distrito.setValue(metaData.seccion3.representanteLegal.distrito.id);

            this.f_s3_de_partida.setValue(metaData.seccion5.partidaRegistral);
            this.f_s3_de_oficina.setValue(metaData.seccion5.oficina);
            this.f_s3_de_autorizacion.setValue(metaData.seccion5.autorizacion);

            this.setDateValue(this.f_s3_de_fechaAutorizacion, metaData.seccion5.fechaAutorizacion);

            this.fechaAutorizacion = metaData.seccion5.fechaAutorizacion;

            this.f_s4_taller_Nombre.setValue(metaData.seccion4.nombreTaller);
            this.f_s4_taller_Domicilio.setValue(metaData.seccion4.domicilioLegal);
            this.f_s4_taller_Departamento.setValue(metaData.seccion4.departamento.id);
            this.f_s4_taller_Provincia.setValue(metaData.seccion4.provincia.id);
            this.f_s4_taller_Distrito.setValue(metaData.seccion4.distrito.id);

            this.f_declaracion_1.setValue(metaData.seccion5.declaracion_1);
            this.f_declaracion_2.setValue(metaData.seccion5.declaracion_2);
            this.f_declaracion_3.setValue(metaData.seccion5.declaracion_3);
            this.f_declaracion_4.setValue(metaData.seccion5.declaracion_4);
            this.f_declaracion_5.setValue(metaData.seccion5.declaracion_5);
            this.f_declaracion_6.setValue(metaData.seccion5.declaracion_6);

         }
         catch (e) {
            console.error(e);
            this.funcionesMtcService.ocultarCargando().mensajeError('Problemas para recuperar los datos guardados');
         }

      } else {
         try {
            this.funcionesMtcService.mostrarCargando();
            const response = await this.sunatService.getDatosPrincipales(this.nroRuc).toPromise();

            this.f_s3_pj_RazonSocial.setValue(response.razonSocial.trim());
            this.f_s3_pj_Ruc.setValue(response.nroDocumento.trim());
            this.f_s3_pj_Domicilio.setValue(response.domicilioLegal.trim());

            this.f_s3_pj_Departamento.setValue(response.nombreDepartamento.trim());
            this.f_s3_pj_Provincia.setValue(response.nombreProvincia.trim());
            this.f_s3_pj_Distrito.setValue(response.nombreDistrito.trim());

            this.f_s3_rl_Telefono.setValue(this.datosUsuarioLogin.telefono.trim());
            this.f_s3_rl_Celular.setValue(this.datosUsuarioLogin.celular.trim());
            this.f_s3_rl_Correo.setValue(this.datosUsuarioLogin.correo.trim());

            this.representanteLegal = response.representanteLegal;

            // Cargamos el Representante Legal
            for (const repLegal of this.representanteLegal) {
               if (repLegal.nroDocumento === this.nroDocumentoLogin) {
                  if (repLegal.tipoDocumento === '01') {  // DNI
                     this.f_s3_rl_TipoDocumento.setValue('01', { emitEvent: false });

                     this.f_s3_rl_ApeMaterno.setValidators([noWhitespaceValidator(), Validators.maxLength(50)]);
                     this.f_s3_rl_NumeroDocumento.setValidators([Validators.required, exactLengthValidator([8])]);

                     this.f_s3_rl_NumeroDocumento.setValue(repLegal.nroDocumento, { emitEvent: false });
                     this.buscarNumeroDocumentoRepLeg(true);
                  }
                  break;
               }
            }
            this.funcionesMtcService.ocultarCargando();
         }
         catch (e) {
            console.error(e);
            this.funcionesMtcService.ocultarCargando().mensajeError('El servicio de la SUNAT no está disponible. Por favor, inténtelo más tarde.');
            this.formulario.disable();
         }
      }
   }

   async buscarNumeroDocumentoRepLeg(cargarDatos = false): Promise<void> {
      const tipoDocumento: string = this.f_s3_rl_TipoDocumento.value.trim();
      const numeroDocumento: string = this.f_s3_rl_NumeroDocumento.value.trim();
      console.log("TipoDocumento: " + tipoDocumento);
      console.log("Numero Documento: " + numeroDocumento);
      const resultado = this.representanteLegal?.find(
         representante => (
            '0' + representante.tipoDocumento.trim()).toString() === tipoDocumento &&
            representante.nroDocumento.trim() === numeroDocumento
      );

      if (resultado) {
         this.funcionesMtcService.mostrarCargando();

         if (tipoDocumento === '01') {// DNI
            try {
               const respuesta = await this.reniecService.getDni(numeroDocumento).toPromise();
               console.log(respuesta);

               this.funcionesMtcService.ocultarCargando();

               if (respuesta.reniecConsultDniResponse.listaConsulta.coResultado !== '0000') {
                  return this.funcionesMtcService.mensajeError('Número de documento no registrado en RENIEC');
               }

               const { prenombres, apPrimer, apSegundo, direccion, ubigeo } = respuesta.reniecConsultDniResponse.listaConsulta.datosPersona;
               const [departamento, provincia, distrito] = ubigeo.split('/');

               this.setRepLegal(
                  tipoDocumento,
                  prenombres,
                  apPrimer,
                  apSegundo,
                  direccion,
                  departamento,
                  provincia,
                  distrito,
                  cargarDatos
               );

               const cargo = resultado?.cargo?.split('-');
               if (cargo) {
                  this.cargoRepresentanteLegal = cargo[cargo.length - 1].trim();
               }
            }
            catch (e) {
               console.error(e);
               //this.funcionesMtcService.ocultarCargando().mensajeError(CONSTANTES.MensajeError.Reniec);
            }
         } else if (tipoDocumento === '04') {// CARNÉ DE EXTRANJERÍA
            try {
               const { CarnetExtranjeria } = await this.extranjeriaService.getCE(numeroDocumento).toPromise();
               console.log(CarnetExtranjeria);
               const { numRespuesta, nombres, primerApellido, segundoApellido } = CarnetExtranjeria;

               this.funcionesMtcService.ocultarCargando();

               if (numRespuesta !== '0000') {
                  return this.funcionesMtcService.mensajeError('Número de documento no registrado en MIGRACIONES');
               }

               this.setRepLegal(
                  tipoDocumento,
                  nombres,
                  primerApellido,
                  segundoApellido,
                  '',
                  '',
                  '',
                  '',
                  cargarDatos
               );
            }
            catch (e) {
               console.error(e);
               this.funcionesMtcService.ocultarCargando().mensajeError('Número de documento no registrado en MIGRACIONES');
            }
         }
      } else {
         return this.funcionesMtcService.mensajeError('Representante legal no encontrado.');
      }
   }

   async setRepLegal(
      tipoDocumento: string,
      nombres: string,
      apPaterno: string,
      apMaterno: string,
      direccion: string,
      departamento: string,
      provincia: string,
      distrito: string,
      cargarDatos = false): Promise<void> {

      if (cargarDatos) {
         this.f_s3_rl_Nombre.setValue(nombres);
         this.f_s3_rl_ApePaterno.setValue(apPaterno);
         this.f_s3_rl_ApeMaterno.setValue(apMaterno);
         this.f_s3_rl_Domicilio.setValue(direccion);

         await this.ubigeoRepLegComponent?.setUbigeoByText(
            departamento,
            provincia,
            distrito);
      }
      else {
         this.funcionesMtcService
            .mensajeConfirmar(`Los datos ingresados fueron validados por ${tipoDocumento === '01' ? 'RENIEC' : 'MIGRACIONES'} corresponden a la persona ${nombres} ${apPaterno} ${apMaterno}. ¿Está seguro de agregarlo?`)
            .then(async () => {
               this.f_s3_rl_Nombre.setValue(nombres);
               this.f_s3_rl_ApePaterno.setValue(apPaterno);
               this.f_s3_rl_ApeMaterno.setValue(apMaterno);
               this.f_s3_rl_Domicilio.setValue(direccion);

               await this.ubigeoRepLegComponent?.setUbigeoByText(
                  departamento,
                  provincia,
                  distrito);
            });
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

   actualizarValidaciones(tipoSolicitante) {
      this.f_s3_pj_RazonSocial.disable();
      this.f_s3_pj_Ruc.disable();
      this.f_s3_pj_Domicilio.disable();
      this.f_s3_pj_Distrito.disable();
      this.f_s3_pj_Provincia.disable();
      this.f_s3_pj_Departamento.disable();
   }

   soloNumeros(event) {
      event.target.value = event.target.value.replace(/[^0-9]/g, '');
   }

   guardarFormulario() {

      this.findInvalidControls();
      this.formulario.markAllAsTouched();

      if(this.f_s3_rl_Nombre.value=="" || this.f_s3_rl_ApePaterno.value==""){
         return this.funcionesMtcService.mensajeError('Debe indicar los nombres y apellidos del representante legal.');
      }

      let fechaAutorizacion: string = "";

      if (this.formulario.invalid === true)
         return this.funcionesMtcService.mensajeError('Debe ingresar todos los campos obligatorios');

      let oficinaRepresentante = this.f_s3_rl_Oficina.value;
      let oficinaEmpresa = this.f_s3_de_oficina.value;
      if (this.activarDatosEmpresa) {
         fechaAutorizacion = (String(this.f_s3_de_fechaAutorizacion.value.day).length > 1 ? this.f_s3_de_fechaAutorizacion.value.day : "0" + this.f_s3_de_fechaAutorizacion.value.day) + "/" + (String(this.f_s3_de_fechaAutorizacion.value.month).length > 1 ? this.f_s3_de_fechaAutorizacion.value.month : "0" + this.f_s3_de_fechaAutorizacion.value.month) + "/" + this.f_s3_de_fechaAutorizacion.value.year;
         console.log(fechaAutorizacion);
      }

      let dataGuardar: Formulario010_17_3Request = new Formulario010_17_3Request();

      dataGuardar.id = this.id;
      dataGuardar.codigo = 'F010-17.3';
      dataGuardar.formularioId = 10;
      dataGuardar.codUsuario = this.nroDocumentoLogin;
      dataGuardar.idTramiteReq = this.dataInput.tramiteReqId,
      dataGuardar.estado = 1;

      //Seccion1
      dataGuardar.metaData.seccion1.codigoProcedimiento = this.codigoProcedimientoTupa;

      //Seccion2
      dataGuardar.metaData.seccion2.modalidad = this.f_modalidad.value;

      //Seccion3
      dataGuardar.metaData.seccion3.tipoSolicitante = this.tipoSolicitante;
      dataGuardar.metaData.seccion3.tipoDocumento = this.f_s3_rl_TipoDocumento.value; //codDocumento
      dataGuardar.metaData.seccion3.numeroDocumento = this.f_s3_pj_Ruc.value; //nroDocumento
      dataGuardar.metaData.seccion3.ruc = this.f_s3_pj_Ruc.value;
      dataGuardar.metaData.seccion3.razonSocial = this.f_s3_pj_RazonSocial.value;
      dataGuardar.metaData.seccion3.domicilioLegal = this.f_s3_pj_Domicilio.value;
      dataGuardar.metaData.seccion3.departamento = this.f_s3_pj_Departamento.value;
      dataGuardar.metaData.seccion3.provincia = this.f_s3_pj_Provincia.value;
      dataGuardar.metaData.seccion3.distrito = this.f_s3_pj_Distrito.value;
      dataGuardar.metaData.seccion3.telefono = this.f_s3_rl_Telefono.value;
      dataGuardar.metaData.seccion3.celular = this.f_s3_rl_Celular.value;
      dataGuardar.metaData.seccion3.email = this.f_s3_rl_Correo.value;
      dataGuardar.metaData.seccion3.representanteLegal.nombres = this.f_s3_rl_Nombre.value;
      dataGuardar.metaData.seccion3.representanteLegal.apellidoPaterno = this.f_s3_rl_ApePaterno.value;
      dataGuardar.metaData.seccion3.representanteLegal.apellidoMaterno = this.f_s3_rl_ApeMaterno.value;
      dataGuardar.metaData.seccion3.representanteLegal.tipoDocumento.id = this.f_s3_rl_TipoDocumento.value;
      dataGuardar.metaData.seccion3.representanteLegal.tipoDocumento.documento = this.listaTiposDocumentos.filter(item => item.id == this.f_s3_rl_TipoDocumento.value)[0].documento;
      dataGuardar.metaData.seccion3.representanteLegal.numeroDocumento = this.f_s3_rl_NumeroDocumento.value;
      dataGuardar.metaData.seccion3.representanteLegal.domicilioLegal = this.f_s3_rl_Domicilio.value;
      dataGuardar.metaData.seccion3.representanteLegal.zona = this.f_s3_rl_Zona.value;
      dataGuardar.metaData.seccion3.representanteLegal.oficinaRegistral.id = oficinaRepresentante;
      dataGuardar.metaData.seccion3.representanteLegal.oficinaRegistral.descripcion = this.oficinasRegistral.filter(item => item.value == oficinaRepresentante)[0].text;
      dataGuardar.metaData.seccion3.representanteLegal.partida = this.f_s3_rl_Partida.value;
      dataGuardar.metaData.seccion3.representanteLegal.asiento = this.f_s3_rl_Asiento.value;
      dataGuardar.metaData.seccion3.representanteLegal.distrito.id = this.f_s3_rl_Distrito.value;
      dataGuardar.metaData.seccion3.representanteLegal.distrito.descripcion = this.ubigeoRepLegComponent.getDistritoText();
      dataGuardar.metaData.seccion3.representanteLegal.provincia.id = this.f_s3_rl_Provincia.value;
      dataGuardar.metaData.seccion3.representanteLegal.provincia.descripcion = this.ubigeoRepLegComponent.getProvinciaText();
      dataGuardar.metaData.seccion3.representanteLegal.departamento.id = this.f_s3_rl_Departamento.value;
      dataGuardar.metaData.seccion3.representanteLegal.departamento.descripcion = this.ubigeoRepLegComponent.getDepartamentoText();
      
      //Seccion4
      dataGuardar.metaData.seccion4.nombreTaller = this.f_s4_taller_Nombre.value;
      dataGuardar.metaData.seccion4.domicilioLegal = this.f_s4_taller_Domicilio.value;
      dataGuardar.metaData.seccion4.departamento.id = this.f_s4_taller_Departamento.value;
      dataGuardar.metaData.seccion4.departamento.descripcion = this.ubigeoTallerComponent.getDepartamentoText();
      dataGuardar.metaData.seccion4.provincia.id = this.f_s4_taller_Provincia.value;
      dataGuardar.metaData.seccion4.provincia.descripcion = this.ubigeoTallerComponent.getProvinciaText();
      dataGuardar.metaData.seccion4.distrito.id = this.f_s4_taller_Distrito.value;
      dataGuardar.metaData.seccion4.distrito.descripcion = this.ubigeoTallerComponent.getDistritoText();
      //Seccion5
      dataGuardar.metaData.seccion5.declaracion_1 = this.f_declaracion_1.value;
      dataGuardar.metaData.seccion5.declaracion_2 = this.f_declaracion_2.value;
      dataGuardar.metaData.seccion5.declaracion_3 = this.f_declaracion_3.value;
      dataGuardar.metaData.seccion5.declaracion_4 = this.f_declaracion_4.value;
      dataGuardar.metaData.seccion5.declaracion_5 = this.f_declaracion_5.value;
      dataGuardar.metaData.seccion5.declaracion_6 = this.f_declaracion_6.value;

      dataGuardar.metaData.seccion5.partidaRegistral = this.f_s3_de_partida.value;
      dataGuardar.metaData.seccion5.oficinaRegistral.id = oficinaEmpresa;
      dataGuardar.metaData.seccion5.oficinaRegistral.descripcion = this.oficinasRegistral.filter(item => item.value == oficinaEmpresa)[0].text;
      dataGuardar.metaData.seccion5.autorizacion = this.f_s3_de_autorizacion.value;
      dataGuardar.metaData.seccion5.fechaAutorizacion = fechaAutorizacion;
      
      //Seccion5
      dataGuardar.metaData.seccion6.tipoDocumentoSolicitante = this.f_TipoDocumentoSolicitante.value;
      dataGuardar.metaData.seccion6.nombreTipoDocumentoSolicitante = this.listaTiposDocumentos.filter(item => item.id == this.codTipoDocSolicitante)[0].documento;
      dataGuardar.metaData.seccion6.numeroDocumentoSolicitante = this.f_NroDocumentoSolicitante.value;
      dataGuardar.metaData.seccion6.nombresApellidosSolicitante = this.nombreUsuario;

      console.log(JSON.stringify(dataGuardar));
      this.funcionesMtcService.mensajeConfirmar(`¿Está seguro de ${this.id === 0 ? 'guardar' : 'modificar'} los datos ingresados?`)
         .then(() => {
            if (this.id === 0) {
               this.funcionesMtcService.mostrarCargando();
               //GUARDAR:
               this.formularioService.post(dataGuardar)
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
                        this.formularioService.put(dataGuardar)
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
                  this.formularioService.put(dataGuardar)
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
               modalRef.componentInstance.titleModal = "Vista Previa - Formulario 010/17.03";

            },
            error => {
               this.funcionesMtcService
                  .ocultarCargando()
                  .mensajeError('Problemas para descargar Pdf');
            }
         );
   }

   onSelectFechaAutorizacion(event): void {
      let year = event.year.toString();
      let month = ('0' + event.month).slice(-2);
      let day = ('0' + event.day).slice(-2);
      this.fechaAutorizacion = day + "/" + month + "/" + year;
   }

   setDateValue(control: any, date: string): string {
      const fecha = date.trim().substring(0, 10);
      const fec = fecha.split("/");
      console.log(control);
      control.setValue({
         day: parseInt(fec[0]),
         month: parseInt(fec[1]),
         year: parseInt(fec[2])
      });
      return fecha;
   }

   dateFormatString(date: string): string {
      const fecha = date.trim();
      const fec = fecha.substring(0, 10);
      return fec;
   }

   formInvalid(control: string): boolean {
      if (this.formulario.get(control))
         return this.formulario.get(control).invalid && (this.formulario.get(control).dirty || this.formulario.get(control).touched);
   }

   isValidField(name: string): boolean {
      const fieldName = this.formulario.get(name);
      return fieldName.invalid && fieldName.touched;
   }

   public findInvalidControls() {
      const invalid = [];
      const controls = this.formulario.controls;
      for (const name in controls) {
         if (controls[name].invalid) {
            invalid.push(name);
         }
      }
      console.log(invalid);
   }
}