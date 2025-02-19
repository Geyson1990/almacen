/**
 * Formulario 004/17.03 utilizado por los procedimientos DCV-011, DCV-012, DCV-013 y DCV-014
 * @author Alicia Toquila Quispe
 * @version 1.1 20.07.2023
*/
import { Component, OnInit, Input, ViewChild, AfterViewInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, AbstractControl, FormArray } from '@angular/forms';
import { NgbActiveModal, NgbAccordionDirective , NgbModal, NgbDateStruct, NgbDatepickerI18n, NgbDateParserFormatter, NgbDateAdapter } from '@ng-bootstrap/ng-bootstrap';
import { TramiteService } from 'src/app/core/services/tramite/tramite.service';
import { OficinaRegistralService } from '../../../../../core/services/servicios/oficinaregistral.service';
import { FuncionesMtcService } from '../../../../../core/services/funciones-mtc.service';
import { SeguridadService } from '../../../../../core/services/seguridad.service';
import { TipoDocumentoModel } from '../../../../../core/models/TipoDocumentoModel';
import { RepresentanteLegal } from 'src/app/core/models/SunatModel';
import { ReniecService } from '../../../../../core/services/servicios/reniec.service';
import { ExtranjeriaService } from '../../../../../core/services/servicios/extranjeria.service';
import { FormularioTramiteService } from '../../../../../core/services/tramite/formulario-tramite.service';
import { Formulario009_17_3Request, TipoLocal, Local } from '../../../domain/formulario009_17_3/formulario009_17_3Request';
import { Formulario009_17_3Response } from '../../../domain/formulario009_17_3/formulario009_17_3Response';
import { Formulario009_17_3Service } from '../../../application/usecases';
import { SunatService } from '../../../../../core/services/servicios/sunat.service';
import { exactLengthValidator, noWhitespaceValidator } from 'src/app/helpers/validator';
import { VisorPdfArchivosService } from '../../../../../core/services/tramite/visor-pdf-archivos.service';
import { VistaPdfComponent } from '../../../../../shared/components/vista-pdf/vista-pdf.component';
import { UbigeoComponent } from '../../../../../shared/components/forms/ubigeo/ubigeo.component';

import { defaultRadioGroupAppearanceProvider } from 'pdf-lib';


@Component({
   selector: 'app-formulario',
   templateUrl: './formulario.component.html',
   styleUrls: ['./formulario.component.css']
})
export class FormularioComponent implements OnInit, AfterViewInit {

   @Input() public dataInput: any;
   @Input() public dataRequisitosInput: any;
   @ViewChild('acc') acc: NgbAccordionDirective ;

   @ViewChild('ubigeoCmpPerNat') ubigeoPerNatComponent: UbigeoComponent;
   @ViewChild('ubigeoCmpRepLeg') ubigeoRepLegComponent: UbigeoComponent;
   @ViewChild('ubigeoCmpLocales') ubigeoLocalesComponent: UbigeoComponent;

   disabled: boolean = true;
   graboUsuario: boolean = false;

   codigoProcedimientoTupa: string;
   descProcedimientoTupa: string;
   tramiteSelected: string;
   codigoTipoSolicitudTupa: string;
   descTipoSolicitudTupa: string;

   txtTitulo: string = '';
   id: number = 0;
   uriArchivo: string = '';//PARA SABER EL NOMBRE DEL PDF (COMPLETO CON TODO Y ADJUNTOS)
   tipoDocumentoValidForm: string;
   formulario: UntypedFormGroup;
   listaTiposDocumentos: TipoDocumentoModel[] = [
      { id: "01", documento: 'DNI' },
      { id: "04", documento: 'Carnet de Extranjería' },
   ];

   listaTipoLocal: TipoLocal[] = [
      { value: '1', text: 'Enseñanza teórica de conocimiento' },
      { value: '2', text: 'Circuito de manejo' },
      { value: '3', text: 'Infraestructura cerrada a la circulación vial' }
   ];

   listaLocales: Local[] = [];

   representanteLegal: RepresentanteLegal[] = [];
   activarDatosGenerales: boolean = false;
   txtTituloCompleto: string = "FORMULARIO 009/17.03 AUTORIZACION Y MODIFICACION PARA EL FUNCIONAMIENTO DE ESCUELA DE CONDUCTORES";
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

   tituloFormulario = 'AUTORIZACION Y MODIFICACION PARA EL FUNCIONAMIENTO DE ESCUELA DE CONDUCTORES';
   tipoPersona: number = 1;

   paDJ1: string[] = ["DCV-027", "DCV-028", "DCV-029", "DCV-030", "DCV-031", "DCV-032"];
   paDJ2: string[] = ["DCV-033"];

   activarDJ1: boolean = false;
   activarDJ2: boolean = false;

   activarPN: boolean = false;
   activarPJ: boolean = false;

   maxLengthNumeroDocumentoRepLeg: number;
   maxLengthNumeroDocumentoDatCont: number;

   disableBtnBuscarRepLegal = false;

   indexEditTabla = -1;

   ProvinciaSeleccionada: number = 0;

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
      private formularioService: Formulario009_17_3Service,
      private visorPdfArchivosService: VisorPdfArchivosService,
      private modalService: NgbModal,
      private sunatService: SunatService) {
   }

   async ngOnInit(): Promise<void> {
      const tramiteSelected: any = JSON.parse(localStorage.getItem('tramite-selected'));
      
      this.codigoProcedimientoTupa = tramiteSelected.codigo;
      this.descProcedimientoTupa = tramiteSelected.nombre;
      this.codigoTipoSolicitudTupa = (this.dataInput.tipoSolicitudTupaCod == "" ? "0" : this.dataInput.tipoSolicitudTupaCod);
      this.descTipoSolicitudTupa = this.dataInput.tipoSolicitudTupaDesc;

      this.uriArchivo = this.dataInput.rutaDocumento;
      this.id = this.dataInput.movId;

      if (this.paDJ1.indexOf(this.codigoProcedimientoTupa) > -1) this.activarDJ1 = true; else this.activarDJ1 = false;
      if (this.paDJ2.indexOf(this.codigoProcedimientoTupa) > -1) this.activarDJ2 = true; else this.activarDJ2 = false;

      this.formulario = this.fb.group({
         tipoDocumentoSolicitante: ['', [Validators.required]],
         nroDocumentoSolicitante: ['', [Validators.required]],

         modalidad: ['casilla'],

         Seccion3: this.fb.group({
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
               rl_numeroDocumento: ['', [Validators.required, Validators.maxLength(11)]],
               rl_nombre: ['', [Validators.required, Validators.maxLength(30)]],
               rl_apePaterno: ['', [Validators.required, Validators.maxLength(30)]],
               rl_apeMaterno: ['', [Validators.required, Validators.maxLength(30)]],
               rl_domicilio: ['', [Validators.required, Validators.maxLength(80)]],
               rl_telefono: ['', [Validators.maxLength(11)]],
               rl_celular: ['', [Validators.required, Validators.maxLength(9)]],
               rl_correo: ['', [Validators.required, Validators.email, noWhitespaceValidator(), Validators.maxLength(50)]],
               rl_distrito: ['', [Validators.required, Validators.maxLength(20)]],
               rl_provincia: ['', [Validators.required, Validators.maxLength(20)]],
               rl_departamento: ['', [Validators.required, Validators.maxLength(20)]],
               rl_oficina: ['', [Validators.required, Validators.maxLength(20)]],
               rl_partida: ['', [Validators.required, Validators.maxLength(9)]],
               rl_asiento: ['', [Validators.required, Validators.maxLength(9)]],
            }),
         }),
         Seccion5: this.fb.group({
            f_s5_IIa: [false],
            f_s5_IIb: [false],
            f_s5_IIIa: [false],
            f_s5_IIIb: [false],
            f_s5_IIIc: [false],
            f_s5_IIc: [false],
            f_s5_tallerActitud: [false],
            f_s5_otro: [false],
            f_s5_OtroTaller: [''],
            f_s5_tipoLocal: ['', [Validators.maxLength(50)]],
            f_s5_departamento: [],
            f_s5_provincia: [],
            f_s5_distrito: [],
            f_s5_direccion: ['']
         }),
         f_declaracion_1: this.fb.control(false, [Validators.requiredTrue]),
         f_declaracion_2: this.fb.control(false, [Validators.requiredTrue]),
         f_declaracion_3: this.fb.control(false, [Validators.requiredTrue]),
         f_declaracion_4: this.fb.control(false, [Validators.requiredTrue]),
         f_declaracion_5: this.fb.control(false, [Validators.requiredTrue]),
         f_declaracion_6: (this.activarDJ2 ? this.fb.control(false, [Validators.requiredTrue]) : this.fb.control(false)),
      });
   }

   async ngAfterViewInit(): Promise<void> {

      this.nroRuc = this.seguridadService.getCompanyCode();
      this.nombreUsuario = this.seguridadService.getUserName();       //nombre de usuario login
      const tipoDocumento = this.seguridadService.getNameId();   //tipo de documento usuario login
      this.nroDocumentoLogin = this.seguridadService.getNumDoc();    //nro de documento usuario login
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
   get f_s3_de_asiento(): AbstractControl { return this.f_s3_datosEmpresa.get(['f_s3_de_asiento']); }
   get f_s3_de_resolucionGases(): AbstractControl { return this.f_s3_datosEmpresa.get(['f_s3_de_resolucionGases']); }
   get f_s3_de_resolucionAutorizacion(): AbstractControl { return this.f_s3_datosEmpresa.get(['f_s3_de_resolucionAutorizacion']); }
   get f_s3_de_fechaResolucionGases(): AbstractControl { return this.f_s3_datosEmpresa.get(['f_s3_de_fechaResolucionGases']); }
   get f_s3_de_fechaResolucionAutorizacion(): AbstractControl { return this.f_s3_datosEmpresa.get(['f_s3_de_fechaResolucionAutorizacion']); }

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
   get f_s3_rl_Oficina(): AbstractControl { return this.f_s3_RepresentanteLegal.get(['rl_oficina']); }
   get f_s3_rl_Partida(): AbstractControl { return this.f_s3_RepresentanteLegal.get(['rl_partida']); }
   get f_s3_rl_Asiento(): AbstractControl { return this.f_s3_RepresentanteLegal.get(['rl_asiento']); }

   get f_Seccion5(): UntypedFormGroup { return this.formulario.get('Seccion5') as UntypedFormGroup; }
   get f_s5_IIa(): AbstractControl { return this.f_Seccion5.get(['f_s5_IIa']); }
   get f_s5_IIb(): AbstractControl { return this.f_Seccion5.get(['f_s5_IIb']); }
   get f_s5_IIIa(): AbstractControl { return this.f_Seccion5.get(['f_s5_IIIa']); }
   get f_s5_IIIb(): AbstractControl { return this.f_Seccion5.get(['f_s5_IIIb']); }
   get f_s5_IIIc(): AbstractControl { return this.f_Seccion5.get(['f_s5_IIIc']); }
   get f_s5_IIc(): AbstractControl { return this.f_Seccion5.get(['f_s5_IIc']); }
   get f_s5_tallerActitud(): AbstractControl { return this.f_Seccion5.get(['f_s5_tallerActitud']); }
   get f_s5_otro(): AbstractControl { return this.f_Seccion5.get(['f_s5_otro']); }
   get f_s5_OtroTaller(): AbstractControl { return this.f_Seccion5.get(['f_s5_OtroTaller']); }
   get f_s5_tipoLocal(): AbstractControl { return this.f_Seccion5.get(['f_s5_tipoLocal']); }
   get f_s5_departamento(): AbstractControl { return this.f_Seccion5.get(['f_s5_departamento']); }
   get f_s5_provincia(): AbstractControl { return this.f_Seccion5.get(['f_s5_provincia']); }
   get f_s5_distrito(): AbstractControl { return this.f_Seccion5.get(['f_s5_distrito']); }
   get f_s5_direccion(): AbstractControl { return this.f_Seccion5.get(['f_s5_direccion']); }

   get f_declaracion_1(): AbstractControl { return this.formulario.get(['f_declaracion_1']); }
   get f_declaracion_2(): AbstractControl { return this.formulario.get(['f_declaracion_2']); }
   get f_declaracion_3(): AbstractControl { return this.formulario.get(['f_declaracion_3']); }
   get f_declaracion_4(): AbstractControl { return this.formulario.get(['f_declaracion_4']); }
   get f_declaracion_5(): AbstractControl { return this.formulario.get(['f_declaracion_5']); }
   get f_declaracion_6(): AbstractControl { return this.formulario.get(['f_declaracion_6']); }

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

   onChangeOtro() {
      if (!this.f_s5_otro.value) {
         this.f_s5_OtroTaller.setValue('');
      }
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

   addLocal() {

      const tipoLocal: string = this.f_s5_tipoLocal.value?.trim();
      const departamento: string = this.f_s5_departamento.value?.trim();
      const provincia: string = this.f_s5_provincia.value?.trim();
      const distrito: string = this.f_s5_distrito.value?.trim();
      const direccion: string = this.f_s5_direccion.value?.trim();

      console.log(this.f_s5_direccion.value);

      if (tipoLocal == "" || departamento == "" || provincia == "" || distrito == "" || direccion == "")
         return this.funcionesMtcService.mensajeError('Debe agregar todos los campos faltantes.');

      const indexFind = this.listaLocales.findIndex(item => item.tipoLocal.value === tipoLocal);

      if (indexFind !== -1) {
         if (indexFind !== this.indexEditTabla)
            return this.funcionesMtcService.mensajeError('El tipo de local ya existe.');
      }

      if (this.indexEditTabla === -1) {

         this.listaLocales.push({
            tipoLocal: {
               value: this.f_s5_tipoLocal.value,
               text: this.listaTipoLocal.filter(item => item.value == this.f_s5_tipoLocal.value)[0].text
            },
            departamento: {
               id: this.f_s5_departamento.value,
               descripcion: this.ubigeoLocalesComponent.getDepartamentoText()
            },
            provincia: {
               id: this.f_s5_provincia.value,
               descripcion: this.ubigeoLocalesComponent.getProvinciaText()
            },
            distrito: {
               id: this.f_s5_distrito.value,
               descripcion: this.ubigeoLocalesComponent.getDistritoText()
            },
            direccion: this.f_s5_direccion.value
         });
      }

      this.cancelarModificacion();
   }

   cancelarModificacion() {
      this.f_s5_tipoLocal.setValue('');
      this.f_s5_departamento.setValue('');
      this.f_s5_provincia.setValue('');
      this.f_s5_distrito.setValue('');
      this.f_s5_direccion.setValue('');

      this.indexEditTabla = -1;
   }

   eliminarLocal(item: TipoLocal, index) {
      if (this.indexEditTabla === -1) {

         this.funcionesMtcService
            .mensajeConfirmar('¿Está seguro de eliminar el registro seleccionado?')
            .then(() => {
               this.listaLocales.splice(index, 1);
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
      console.log(this.ubigeoLocalesComponent.listaDepartamento);
      console.log(parseInt(this.codigoTipoSolicitudTupa));
      switch (parseInt(this.codigoTipoSolicitudTupa)) {
         case 1: this.ubigeoLocalesComponent.listaDepartamento = [];
            this.ubigeoLocalesComponent.listaDepartamento = [
               { text: 'CALLAO', value: '7' },
               { text: 'LIMA', value: '15' },
            ];
            break;
         case 2: this.f_s5_departamento.setValue("15", { emitEvent: true });
            this.f_s5_departamento.disable();
            break;
         case 3: this.ubigeoLocalesComponent.listaDepartamento = [];
            this.ubigeoLocalesComponent.listaDepartamento = [
               { text: 'ÁNCASH', value: '2' },
               { text: 'HUANCAVELICA', value: '9' },
               { text: 'HUÁNUCO', value: '10' },
               { text: 'ICA', value: '11' },
               { text: 'JUNÍN', value: '12' },
               { text: 'LIMA', value: '15' },
               { text: 'PASCO', value: '19' },
            ];
            break;
         case 4: this.ubigeoLocalesComponent.listaDepartamento = [];
            this.ubigeoLocalesComponent.listaDepartamento = [
               { text: 'AMAZONAS', value: '1' },
               { text: 'APURÍMAC', value: '3' },
               { text: 'AREQUIPA', value: '4' },
               { text: 'AYACUCHO', value: '5' },
               { text: 'CAJAMARCA', value: '6' },
               { text: 'CUSCO', value: '8' },
               { text: 'LA LIBERTAD', value: '13' },
               { text: 'LAMBAYEQUE', value: '14' },
               { text: 'LORETO', value: '16' },
               { text: 'MADRE DE DIOS', value: '17' },
               { text: 'MOQUEGUA', value: '18' },
               { text: 'PIURA', value: '20' },
               { text: 'PUNO', value: '21' },
               { text: 'SAN MARTÍN', value: '22' },
               { text: 'TACNA', value: '23' },
               { text: 'TUMBES', value: '24' },
               { text: 'UCAYALI', value: '25' }
            ];
            break;
      }

      if (this.dataInput != null && this.dataInput.movId > 0) {
         try {
            const dataFormulario = await this.formularioTramiteService.get<Formulario009_17_3Response>(this.dataInput.tramiteReqId).toPromise();
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

            this.f_s5_IIa.setValue(metaData.seccion5.licencia_IIa ?? false);
            this.f_s5_IIb.setValue(metaData.seccion5.licencia_IIb ?? false);
            this.f_s5_IIc.setValue(metaData.seccion5.licencia_IIc ?? false);

            this.f_s5_IIIa.setValue(metaData.seccion5.licencia_IIIa ?? false);
            this.f_s5_IIIb.setValue(metaData.seccion5.licencia_IIIb ?? false);
            this.f_s5_IIIc.setValue(metaData.seccion5.licencia_IIIc ?? false);

            this.f_s5_tallerActitud.setValue(metaData.seccion5.licencia_tallerActitud ?? false);
            this.f_s5_otro.setValue(metaData.seccion5.licencia_otro ?? false);
            this.f_s5_OtroTaller.setValue(metaData.seccion5.licencia_OtroTaller ?? '');

            this.listaLocales = metaData.seccion5.locales;

            this.f_declaracion_1.setValue(metaData.seccion4.declaracion_1);
            this.f_declaracion_2.setValue(metaData.seccion4.declaracion_2);
            this.f_declaracion_3.setValue(metaData.seccion4.declaracion_3);
            this.f_declaracion_4.setValue(metaData.seccion4.declaracion_4);
            this.f_declaracion_5.setValue(metaData.seccion4.declaracion_5);
            this.f_declaracion_6.setValue(metaData.seccion4.declaracion_6);
         }
         catch (e) {
            console.error(e);
            this.funcionesMtcService.ocultarCargando().mensajeError('Problemas para recuperar los datos guardados');
         }

      } else {
         try {
            this.funcionesMtcService.mostrarCargando();
            const response = await this.sunatService.getDatosPrincipales(this.nroRuc).toPromise();
            console.log('SUNAT: ', response);
            this.f_s3_pj_RazonSocial.setValue(response.razonSocial.trim());
            this.f_s3_pj_Ruc.setValue(response.nroDocumento.trim());
            this.f_s3_pj_Domicilio.setValue(response.domicilioLegal.trim());

            this.f_s3_pj_Departamento.setValue(response.nombreDepartamento.trim());
            this.f_s3_pj_Provincia.setValue(response.nombreProvincia.trim());
            this.f_s3_pj_Distrito.setValue(response.nombreDistrito.trim());

            this.f_s3_rl_Telefono.setValue(response.telefono.trim());
            this.f_s3_rl_Celular.setValue(response.celular.trim());
            this.f_s3_rl_Correo.setValue(response.correo.trim());

            this.representanteLegal = response.representanteLegal;

            // Cargamos el Representante Legal
            for (const repLegal of this.representanteLegal) {
               if (repLegal.nroDocumento === this.nroDocumentoLogin) {
                  if (repLegal.tipoDocumento === '01') {  // DNI
                     this.f_s3_rl_TipoDocumento.setValue('01', { emitEvent: false });

                     this.f_s3_rl_ApeMaterno.setValidators([Validators.required, noWhitespaceValidator(), Validators.maxLength(50)]);
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
            this.funcionesMtcService.ocultarCargando().mensajeError('No se encuentra');

            this.formulario.disable();
            //this.disableGuardar = true;
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


   onChangeUbigeoLocal() {
      switch (parseInt(this.codigoTipoSolicitudTupa)) {
         case 1: if (this.f_s5_departamento.value == "15" && this.ProvinciaSeleccionada == 0) {
            this.f_s5_provincia.setValue("1");
            this.f_s5_provincia.disable({ emitEvent: false });
            this.ProvinciaSeleccionada = 1;
         } else {
            this.f_s5_provincia.enable({ emitEvent: false });
            this.ProvinciaSeleccionada = 0;
         }
            break;

         case 2: if (this.ProvinciaSeleccionada == 0) {
            this.ubigeoLocalesComponent.listaProvincia = [];
            this.ubigeoLocalesComponent.listaProvincia = [
               { text: 'BARRANCA', value: '2' },
               { text: 'CAJATAMBO', value: '3' },
               { text: 'CANTA', value: '4' },
               { text: 'CANETE', value: '5' },
               { text: 'HUARAL', value: '6' },
               { text: 'HUAROCHIRÍ', value: '7' },
               { text: 'HUAURA', value: '8' },
               { text: 'OYÓN', value: '9' },
               { text: 'YAUYOS', value: '10' }
            ];
         }
            this.ProvinciaSeleccionada = 1;
            break;

         case 3: console.log(this.f_s5_departamento.value);
            if (this.f_s5_departamento.value == 15) {
               setTimeout(() => {

                  if (this.ProvinciaSeleccionada == 0) {
                     this.ubigeoLocalesComponent.listaProvincia = [];
                     this.ubigeoLocalesComponent.listaProvincia = [
                        { text: 'BARRANCA', value: '2' },
                        { text: 'CAJATAMBO', value: '3' },
                        { text: 'CANTA', value: '4' },
                        { text: 'CANETE', value: '5' },
                        { text: 'HUARAL', value: '6' },
                        { text: 'HUAROCHIRÍ', value: '7' },
                        { text: 'HUAURA', value: '8' },
                        { text: 'OYÓN', value: '9' },
                        { text: 'YAUYOS', value: '10' }
                     ];
                  }
                  this.ProvinciaSeleccionada = 1;
               }, 1000)
            }
            //this.ProvinciaSeleccionada = 1;
            break;
      }
   }

   guardarFormulario() {

      //console.log(this.formulario); return;
      
      if (this.formulario.invalid === true)
         return this.funcionesMtcService.mensajeError('Debe ingresar todos los campos obligatorios');
      let oficinaRepresentante = this.f_s3_rl_Oficina.value;

      let dataGuardar: Formulario009_17_3Request = new Formulario009_17_3Request();

      dataGuardar.id = this.id;
      dataGuardar.codigo = 'F009-17.3';
      dataGuardar.formularioId = 2;
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
      dataGuardar.metaData.seccion4.declaracion_1 = this.f_declaracion_1.value;
      dataGuardar.metaData.seccion4.declaracion_2 = this.f_declaracion_2.value;
      dataGuardar.metaData.seccion4.declaracion_3 = this.f_declaracion_3.value;
      dataGuardar.metaData.seccion4.declaracion_4 = this.f_declaracion_4.value;
      dataGuardar.metaData.seccion4.declaracion_5 = this.f_declaracion_5.value;
      dataGuardar.metaData.seccion4.declaracion_6 = this.f_declaracion_6.value;

      //Seccion5
      dataGuardar.metaData.seccion5.licencia_IIa = this.f_s5_IIa.value ?? false;
      dataGuardar.metaData.seccion5.licencia_IIb = this.f_s5_IIb.value ?? false;
      dataGuardar.metaData.seccion5.licencia_IIIa = this.f_s5_IIIa.value ?? false;
      dataGuardar.metaData.seccion5.licencia_IIIb = this.f_s5_IIIb.value ?? false;
      dataGuardar.metaData.seccion5.licencia_IIIc = this.f_s5_IIIc.value ?? false;
      dataGuardar.metaData.seccion5.licencia_IIc = this.f_s5_IIc.value ?? false;
      dataGuardar.metaData.seccion5.licencia_tallerActitud = this.f_s5_tallerActitud.value ?? false;
      dataGuardar.metaData.seccion5.licencia_otro = this.f_s5_otro.value ?? false;
      dataGuardar.metaData.seccion5.licencia_OtroTaller = this.f_s5_OtroTaller.value ?? '';

      dataGuardar.metaData.seccion5.locales = this.listaLocales;

      dataGuardar.metaData.seccion5.tipoDocumentoSolicitante = this.f_TipoDocumentoSolicitante.value;
      dataGuardar.metaData.seccion5.nombreTipoDocumentoSolicitante = this.listaTiposDocumentos.filter(item => item.id == this.codTipoDocSolicitante)[0].documento;
      dataGuardar.metaData.seccion5.numeroDocumentoSolicitante = this.f_NroDocumentoSolicitante.value;
      dataGuardar.metaData.seccion5.nombresApellidosSolicitante = this.nombreUsuario;

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
               modalRef.componentInstance.titleModal = "Vista Previa - Formulario 009/17.03";

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