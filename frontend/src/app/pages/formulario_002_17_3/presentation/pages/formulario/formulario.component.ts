/**
 * Formulario 002/17.3 utilizado por los procedimientos DCV-004, DCV-005 y DCV-006
 * @modify Alicia Toquila Q.
 * @version 1.0 07.09.2022
 * @modify Alicia Toquila Q.
 * @version 2.0 04.03.2024
 * 
 * Se agregó las secciones de placas, pasajeros y conductores
 */

import { Component, OnInit, Input, ViewChild, AfterViewInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, AbstractControl } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
//import { TouchSequence } from 'selenium-webdriver';
import { Formulario002_17_3Request } from '../../../domain/formulario002_17_3/formulario002_17_3Request';
import { Formulario002_17_3Response } from '../../../domain/formulario002_17_3/formulario002_17_3Response';
import { Certificado } from '../../../domain/formulario002_17_3/formulario002_17_3Request';
import { RepresentanteLegal } from 'src/app/core/models/SunatModel';
import { TipoDocumentoModel } from 'src/app/core/models/TipoDocumentoModel';
import { Formulario002_17_3Service } from '../../../application/usecases';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { SeguridadService } from 'src/app/core/services/seguridad.service';
import { ExtranjeriaService } from 'src/app/core/services/servicios/extranjeria.service';
import { OficinaRegistralService } from 'src/app/core/services/servicios/oficinaregistral.service';
import { ReniecService } from 'src/app/core/services/servicios/reniec.service';
import { SunatService } from 'src/app/core/services/servicios/sunat.service';
import { FormularioTramiteService } from 'src/app/core/services/tramite/formulario-tramite.service';
import { TramiteService } from 'src/app/core/services/tramite/tramite.service';
import { VisorPdfArchivosService } from 'src/app/core/services/tramite/visor-pdf-archivos.service';
import { exactLengthValidator, noWhitespaceValidator } from 'src/app/helpers/validator';
import { UbigeoComponent } from 'src/app/shared/components/forms/ubigeo/ubigeo.component';
import { VistaPdfComponent } from 'src/app/shared/components/vista-pdf/vista-pdf.component';
import { ValidateFileSize_Formulario } from 'src/app/helpers/file';
import { DatosPersona } from 'src/app/core/models/ReniecModel';
import { MtcService } from 'src/app/core/services/servicios/mtc.service';
import { DatosUsuarioLogin } from 'src/app/core/models/Autenticacion/DatosUsuarioLogin';


@Component({
   selector: 'app-formulario',
   templateUrl: './formulario.component.html',
   styleUrls: ['./formulario.component.css']
})
export class FormularioComponent implements OnInit, AfterViewInit {

   @Input() public dataInput: any;
   @Input() public dataRequisitosInput: any;

   @ViewChild('ubigeoCmpRepLeg') ubigeoRepLegComponent: UbigeoComponent;

   formularioFG: UntypedFormGroup;
   graboUsuario = false;

   id = 0;

   codigoProcedimientoTupa: string;
   descProcedimientoTupa: string;
   tramiteSelected: string;
   codigoTipoSolicitudTupa: string;
   descTipoSolicitudTupa: string;

   uriArchivo = ''; // PARA SABER EL NOMBRE DEL PDF (COMPLETO CON TODO Y ADJUNTOS)
   listaTiposDocumentos: TipoDocumentoModel[] = [
      { id: '01', documento: 'DNI' },
      { id: '04', documento: 'Carnet de Extranjería' },
   ];

   listaTiposVehiculo: TipoDocumentoModel[] = [
      { id: '01', documento: 'Locomotora' },
      { id: '02', documento: 'Coche' },
      { id: '03', documento: 'Vagón' },
      { id: '04', documento: 'Autovagón' },
      { id: '05', documento: 'Unidad e inspección' },
      { id: '06', documento: 'Equipo de mantenimiento' },
   ];

   representanteLegal: Array<RepresentanteLegal>;
   txtTitulo = 'FORMULARIO 002-17.03 CERTIFICADO DE HABILITACIÓN FERROVIARIA / HABILITACIÓN FERROVIARIA ESPECIAL';
   oficinasRegistral: Array<any>;

   nroDocumentoLogin: string;
   nroRuc = '';
   razonSocial: string;
   cargoRepresentanteLegal = '';

   disableBtnBuscarRepLegal = false;
   disableBtnBuscarContacto = false;

   maxLengthNumeroDocumentoRepLeg: number;

   tipoSolicitante: string;
   //codTipoDocSolicitante: string; // 01 DNI  03 CI  04 CE

   tipoDocumentoSolicitante: string;
   nombreTipoDocumentoSolicitante: string;
   numeroDocumentoSolicitante: string;
   nombreSolicitante: string;
   datosUsuarioLogin: DatosUsuarioLogin;

   public certificados: Certificado[] = [];
   public recordIndexToEditCertificado: number;

   paDJ1: string[] = ['DCV-004', 'DCV-005', 'DCV-006'];
   paDJ2: string[] = ['DCV-004', 'DCV-005', 'DCV-006'];


   /*  paSeccion4: string[] = ['DSTT-015','DSTT-022','DSTT-023'];
     paSeccion5: string[] = ['DSTT-023'];
     paSeccion6: string[] = ['DSTT-023'];*/

   paValidaLicenciaConductor: string[] = ['DSTT-027'];
   RelacionConductores: boolean = false;
   RelacionPlacas: boolean = false;
   RelacionPasajeros: boolean = false;

   habilitarSeccion4 = true; // Sección de placas
   habilitarSeccion5 = true; // Sección de conductores
   habilitarSeccion6 = true; // Seccion de pasajeros

   habilitarPN: boolean = false;
   habilitarPJ: boolean = false;

   disabled = false
   ubigeo: boolean = false;

   constructor(
      private formBuilder: UntypedFormBuilder,
      public activeModal: NgbActiveModal,
      public tramiteService: TramiteService,
      private oficinaRegistralService: OficinaRegistralService,
      private funcionesMtcService: FuncionesMtcService,
      private seguridadService: SeguridadService,
      private reniecService: ReniecService,
      private extranjeriaService: ExtranjeriaService,
      private formularioTramiteService: FormularioTramiteService,
      private formularioService: Formulario002_17_3Service,
      private visorPdfArchivosService: VisorPdfArchivosService,
      private modalService: NgbModal,
      private sunatService: SunatService,
      private mtcService: MtcService) {

      this.certificados = [];
   }

   ngOnInit(): void {
      const tramiteSelected: any = JSON.parse(localStorage.getItem('tramite-selected'));
      this.codigoProcedimientoTupa = tramiteSelected.codigo;
      this.descProcedimientoTupa = tramiteSelected.nombre;
      this.codigoTipoSolicitudTupa = (this.dataInput.tipoSolicitudTupaCod === '' ? '0' : this.dataInput.tipoSolicitudTupaCod);
      this.descTipoSolicitudTupa = this.dataInput.tipoSolicitudTupaDesc;

      this.recordIndexToEditCertificado = -1;

      console.log('dataInput: ', this.dataInput);

      this.uriArchivo = this.dataInput.rutaDocumento;
      this.id = this.dataInput.movId;

      this.formularioFG = this.formBuilder.group({
         f_Seccion3FG: this.formBuilder.group({
            f_s3_ContactoFG: this.formBuilder.group({
               f_s3_pn_NombresFC: [{ value: '', disabled: true }, [Validators.required, noWhitespaceValidator(), Validators.maxLength(50)]],
               f_s3_pn_ApellidoPaternoFC: [{ value: '', disabled: true }, [Validators.required, noWhitespaceValidator(), Validators.maxLength(50)]],
               f_s3_pn_ApellidoMaternoFC: [{ value: '', disabled: true }, [Validators.maxLength(50)]],
               f_s3_pn_TipoDocSolicitanteFC: [''],
               f_s3_pn_NroDocSolicitanteFC: ['', [Validators.required, exactLengthValidator([8, 9])]],
               f_s3_pn_RucFC: ['', [exactLengthValidator([11])]],
               f_s3_pn_TelefonoFC: ['', [Validators.maxLength(12)]],
               f_s3_pn_CelularFC: ['', [Validators.required, exactLengthValidator([9])]],
               f_s3_pn_CorreoFC: ['', [Validators.required, Validators.email, noWhitespaceValidator(), Validators.maxLength(50)]],
            }),
            f_s3_PerJurFG: this.formBuilder.group({
               f_s3_pj_RazonSocialFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(100)]],
               f_s3_pj_RucFC: ['', [Validators.required, exactLengthValidator([11])]],
               f_s3_pj_DomicilioFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(100)]],
               f_s3_pj_DepartamentoFC: ['', [Validators.required]],
               f_s3_pj_ProvinciaFC: ['', [Validators.required]],
               f_s3_pj_DistritoFC: ['', [Validators.required]],
               f_s3_pj_RepLegalFG: this.formBuilder.group({
                  f_s3_pj_rl_TipoDocumentoFC: ['', [Validators.required]],
                  f_s3_pj_rl_NumeroDocumentoFC: ['', [Validators.required]], // at runtime maxlength
                  f_s3_pj_rl_NombreFC: [{ value: '', disabled: true }, [Validators.required, noWhitespaceValidator(), Validators.maxLength(50)]],
                  f_s3_pj_rl_ApePaternoFC: [{ value: '', disabled: true }, [Validators.required, noWhitespaceValidator(), Validators.maxLength(50)]],
                  f_s3_pj_rl_ApeMaternoFC: [{ value: '', disabled: true }, [noWhitespaceValidator(), Validators.maxLength(50)]],
                  f_s3_pj_rl_TelefonoFC: ['', [Validators.maxLength(12)]],
                  f_s3_pj_rl_CelularFC: ['', [Validators.required, exactLengthValidator([9])]],
                  f_s3_pj_rl_CorreoFC: ['', [Validators.required, noWhitespaceValidator(), Validators.email, Validators.maxLength(50)]],
                  f_s3_pj_rl_DomicilioFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(100)]],
                  f_s3_pj_rl_DepartamentoFC: ['', [Validators.required]],
                  f_s3_pj_rl_ProvinciaFC: ['', [Validators.required]],
                  f_s3_pj_rl_DistritoFC: ['', [Validators.required]],
                  f_s3_pj_rl_ZonaFC: ['', [Validators.required, Validators.maxLength(50)]],
                  f_s3_pj_rl_SedeFC: ['', [Validators.required, Validators.maxLength(50)]],
                  f_s3_pj_rl_PartidaFC: ['', [Validators.required, Validators.maxLength(15)]],
                  f_s3_pj_rl_AsientoFC: ['', [Validators.required, Validators.maxLength(15)]],
               }),
            }),
         }),
         f_Seccion5FG: this.formBuilder.group({
            f_s5_TipoVehiculo: this.formBuilder.control(''),
            f_s5_NumeroUnidad: this.formBuilder.control(''),
            f_s5_MaterialPeligroso: this.formBuilder.control(''),
         }),
         f_Seccion6FG: this.formBuilder.group({
            f_s6_declaracion_1: [{ value: false, disabled: false }, [Validators.requiredTrue]],
            f_s6_declaracion_2: [{ value: false, disabled: false }, [Validators.requiredTrue]],
         }),
      });

   }

   async ngAfterViewInit(): Promise<void> {
      await this.cargarOficinaRegistral();

      this.nroRuc = this.seguridadService.getCompanyCode();
      this.razonSocial = this.seguridadService.getUserName();       // nombre de usuario login
      const tipoDocumento = this.seguridadService.getNameId();   // tipo de documento usuario login
      this.nroDocumentoLogin = this.seguridadService.getNumDoc();    // nro de documento usuario login
      this.datosUsuarioLogin = this.seguridadService.getDatosUsuarioLogin(); // Datos personales del usuario

      switch (tipoDocumento) {
         case '00001':
            this.habilitarPJ = false;
            this.habilitarPN = true;
            this.ubigeo = false;
            break;
         case '00004':
            this.habilitarPJ = false;
            this.habilitarPN = true;
            this.ubigeo = true;
            break;
         case '00005':
         case '00002':
            this.habilitarPJ = true;
            this.habilitarPN = false;
            this.ubigeo = false;
            break;
      }

      this.onChangeTipoDocumento();
      await this.cargarDatos();
   }

   // GET FORM formularioFG
   get f_Seccion3FG(): UntypedFormGroup { return this.formularioFG.get('f_Seccion3FG') as UntypedFormGroup; }
   get f_s3_Contacto(): UntypedFormGroup { return this.f_Seccion3FG.get('f_s3_ContactoFG') as UntypedFormGroup; }
   get f_s3_pn_NombresFC(): AbstractControl { return this.f_s3_Contacto.get(['f_s3_pn_NombresFC']); }
   get f_s3_pn_ApellidoPaternoFC(): AbstractControl { return this.f_s3_Contacto.get(['f_s3_pn_ApellidoPaternoFC']); }
   get f_s3_pn_ApellidoMaternoFC(): AbstractControl { return this.f_s3_Contacto.get(['f_s3_pn_ApellidoMaternoFC']); }
   get f_s3_pn_TipoDocSolicitanteFC(): AbstractControl { return this.f_s3_Contacto.get(['f_s3_pn_TipoDocSolicitanteFC']); }
   get f_s3_pn_NroDocSolicitanteFC(): AbstractControl { return this.f_s3_Contacto.get(['f_s3_pn_NroDocSolicitanteFC']); }
   get f_s3_pn_RucFC(): AbstractControl { return this.f_s3_Contacto.get(['f_s3_pn_RucFC']); }
   get f_s3_pn_TelefonoFC(): AbstractControl { return this.f_s3_Contacto.get(['f_s3_pn_TelefonoFC']); }
   get f_s3_pn_CelularFC(): AbstractControl { return this.f_s3_Contacto.get(['f_s3_pn_CelularFC']); }
   get f_s3_pn_CorreoFC(): AbstractControl { return this.f_s3_Contacto.get(['f_s3_pn_CorreoFC']); }
   get f_s3_PerJurFG(): UntypedFormGroup { return this.f_Seccion3FG.get('f_s3_PerJurFG') as UntypedFormGroup; }
   get f_s3_pj_RazonSocialFC(): AbstractControl { return this.f_s3_PerJurFG.get(['f_s3_pj_RazonSocialFC']); }
   get f_s3_pj_RucFC(): AbstractControl { return this.f_s3_PerJurFG.get(['f_s3_pj_RucFC']); }
   get f_s3_pj_DomicilioFC(): AbstractControl { return this.f_s3_PerJurFG.get(['f_s3_pj_DomicilioFC']); }
   get f_s3_pj_DepartamentoFC(): AbstractControl { return this.f_s3_PerJurFG.get(['f_s3_pj_DepartamentoFC']); }
   get f_s3_pj_ProvinciaFC(): AbstractControl { return this.f_s3_PerJurFG.get(['f_s3_pj_ProvinciaFC']); }
   get f_s3_pj_DistritoFC(): AbstractControl { return this.f_s3_PerJurFG.get(['f_s3_pj_DistritoFC']); }
   get f_s3_pj_RepLegalFG(): UntypedFormGroup { return this.f_s3_PerJurFG.get('f_s3_pj_RepLegalFG') as UntypedFormGroup; }
   get f_s3_pj_rl_TipoDocumentoFC(): AbstractControl { return this.f_s3_pj_RepLegalFG.get(['f_s3_pj_rl_TipoDocumentoFC']); }
   get f_s3_pj_rl_NumeroDocumentoFC(): AbstractControl { return this.f_s3_pj_RepLegalFG.get(['f_s3_pj_rl_NumeroDocumentoFC']); }
   get f_s3_pj_rl_NombreFC(): AbstractControl { return this.f_s3_pj_RepLegalFG.get(['f_s3_pj_rl_NombreFC']); }
   get f_s3_pj_rl_ApePaternoFC(): AbstractControl { return this.f_s3_pj_RepLegalFG.get(['f_s3_pj_rl_ApePaternoFC']); }
   get f_s3_pj_rl_ApeMaternoFC(): AbstractControl { return this.f_s3_pj_RepLegalFG.get(['f_s3_pj_rl_ApeMaternoFC']); }
   get f_s3_pj_rl_TelefonoFC(): AbstractControl { return this.f_s3_pj_RepLegalFG.get(['f_s3_pj_rl_TelefonoFC']); }
   get f_s3_pj_rl_CelularFC(): AbstractControl { return this.f_s3_pj_RepLegalFG.get(['f_s3_pj_rl_CelularFC']); }
   get f_s3_pj_rl_CorreoFC(): AbstractControl { return this.f_s3_pj_RepLegalFG.get(['f_s3_pj_rl_CorreoFC']); }
   get f_s3_pj_rl_DomicilioFC(): AbstractControl { return this.f_s3_pj_RepLegalFG.get(['f_s3_pj_rl_DomicilioFC']); }
   get f_s3_pj_rl_DepartamentoFC(): AbstractControl { return this.f_s3_pj_RepLegalFG.get(['f_s3_pj_rl_DepartamentoFC']); }
   get f_s3_pj_rl_ProvinciaFC(): AbstractControl { return this.f_s3_pj_RepLegalFG.get(['f_s3_pj_rl_ProvinciaFC']); }
   get f_s3_pj_rl_DistritoFC(): AbstractControl { return this.f_s3_pj_RepLegalFG.get(['f_s3_pj_rl_DistritoFC']); }
   get f_s3_pj_rl_ZonaFC(): AbstractControl { return this.f_s3_pj_RepLegalFG.get(['f_s3_pj_rl_ZonaFC']); }
   get f_s3_pj_rl_SedeFC(): AbstractControl { return this.f_s3_pj_RepLegalFG.get(['f_s3_pj_rl_SedeFC']); }
   get f_s3_pj_rl_PartidaFC(): AbstractControl { return this.f_s3_pj_RepLegalFG.get(['f_s3_pj_rl_PartidaFC']); }
   get f_s3_pj_rl_AsientoFC(): AbstractControl { return this.f_s3_pj_RepLegalFG.get(['f_s3_pj_rl_AsientoFC']); }
   get f_Seccion6FG(): UntypedFormGroup { return this.formularioFG.get('f_Seccion6FG') as UntypedFormGroup; }
   get f_s6_declaracion_1(): AbstractControl { return this.f_Seccion6FG.get(['f_s6_declaracion_1']); }
   get f_s6_declaracion_2(): AbstractControl { return this.f_Seccion6FG.get(['f_s6_declaracion_2']); }
   get f_Seccion5FG(): UntypedFormGroup { return this.formularioFG.get('f_Seccion5FG') as UntypedFormGroup; }
   get f_s5_TipoVehiculo(): AbstractControl { return this.f_Seccion5FG.get(['f_s5_TipoVehiculo']); }
   get f_s5_NumeroUnidad(): AbstractControl { return this.f_Seccion5FG.get(['f_s5_NumeroUnidad']); }
   get f_s5_MaterialPeligroso(): AbstractControl { return this.f_Seccion5FG.get(['f_s5_MaterialPeligroso']); }

   async cargarOficinaRegistral(): Promise<void> {
      try {
         const dataOficinaRegistral = await this.oficinaRegistralService.oficinaRegistral().toPromise();
         this.oficinasRegistral = dataOficinaRegistral;
         this.funcionesMtcService.ocultarCargando();
      }
      catch (e) {
         this.funcionesMtcService
            .ocultarCargando()
            .mensajeError('Problemas para conectarnos con el servicio y recuperar datos de la oficina registral');
      }
   }

   onChangeTipoDocumento(): void {
      this.f_s3_pj_rl_TipoDocumentoFC.valueChanges.subscribe((tipoDocumento: string) => {
         if (tipoDocumento?.trim() === '04') {
            this.f_s3_pj_rl_ApeMaternoFC.clearValidators();
            this.f_s3_pj_rl_ApeMaternoFC.updateValueAndValidity();

            this.f_s3_pj_rl_NumeroDocumentoFC.setValidators([Validators.required, exactLengthValidator([9])]);
            this.f_s3_pj_rl_NumeroDocumentoFC.updateValueAndValidity();
            this.maxLengthNumeroDocumentoRepLeg = 9;
         } else {
            this.f_s3_pj_rl_ApeMaternoFC.setValidators([Validators.required]);
            this.f_s3_pj_rl_ApeMaternoFC.updateValueAndValidity();

            this.f_s3_pj_rl_NumeroDocumentoFC.setValidators([Validators.required, exactLengthValidator([8])]);
            this.f_s3_pj_rl_NumeroDocumentoFC.updateValueAndValidity();
            this.maxLengthNumeroDocumentoRepLeg = 8;
         }

         this.f_s3_pj_rl_NumeroDocumentoFC.reset('', { emitEvent: false });
         this.inputNumeroDocumento();
      });
   }

   inputNumeroDocumento(event?): void {
      if (event) {
         event.target.value = event.target.value.replace(/[^0-9]/g, '');
      }

      this.f_s3_pj_rl_NombreFC.reset('', { emitEvent: false });
      this.f_s3_pj_rl_ApePaternoFC.reset('', { emitEvent: false });
      this.f_s3_pj_rl_ApeMaternoFC.reset('', { emitEvent: false });
   }

   async buscarNumeroDocumento(): Promise<void> {
      const tipoDocumento: string = this.f_s3_pj_rl_TipoDocumentoFC.value.trim();
      const numeroDocumento: string = this.f_s3_pj_rl_NumeroDocumentoFC.value.trim();

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

               this.funcionesMtcService.ocultarCargando();

               if (respuesta.reniecConsultDniResponse.listaConsulta.coResultado !== '0000') {
                  this.f_s3_pj_rl_NombreFC.setValue('nombres');
                  this.f_s3_pj_rl_ApePaternoFC.setValue('apPaterno');
                  this.f_s3_pj_rl_ApeMaternoFC.setValue('apMaterno');
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
            }
            catch (e) {
               console.error(e);

               this.funcionesMtcService.ocultarCargando().mensajeError('Error al consultar al servicio');
               this.f_s3_pj_rl_NombreFC.enable();
               this.f_s3_pj_rl_ApePaternoFC.enable();
               this.f_s3_pj_rl_ApeMaternoFC.enable();
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
               this.f_s3_pj_rl_NombreFC.enable();
               this.f_s3_pj_rl_ApePaternoFC.enable();
               this.f_s3_pj_rl_ApeMaternoFC.enable();
            }
         }
      } else {
         this.f_s3_pj_rl_ApeMaternoFC.enable();
         this.f_s3_pj_rl_ApePaternoFC.enable();
         this.f_s3_pj_rl_NombreFC.enable();
         return this.funcionesMtcService.mensajeError('Representante legal no encontrado');

      }
   }

   async buscarNumeroDocumentoContacto(): Promise<void> {
      const tipoDocumento: string = this.f_s3_pn_TipoDocSolicitanteFC.value.trim();
      const numeroDocumento: string = this.f_s3_pn_NroDocSolicitanteFC.value.trim();

      if (tipoDocumento.length === 0 || numeroDocumento.length === 0) {
         this.funcionesMtcService.mensajeError('Debe ingresar Tipo de Documento y/o Número de Documento');
         return;
      }
      if (tipoDocumento === '01' && numeroDocumento.length !== 8) {
         this.funcionesMtcService.mensajeError('DNI debe tener 8 caracteres');
         return;
      }

      if (tipoDocumento === '01') {// DNI
         try {
            this.funcionesMtcService.mostrarCargando();
            const respuesta = await this.reniecService.getDni(numeroDocumento).toPromise();
            this.funcionesMtcService.ocultarCargando();

            if (respuesta.reniecConsultDniResponse.listaConsulta.coResultado !== '0000') {
               this.f_s3_pn_NombresFC.setValue('datosPersona.prenombres');
               this.f_s3_pn_ApellidoPaternoFC.setValue('datosPersona.apPrimer');
               this.f_s3_pn_ApellidoMaternoFC.setValue('datosPersona.apSegundo');
               return this.funcionesMtcService.mensajeError('Número de documento no registrado en Reniec');
            }

            const datosPersona = respuesta.reniecConsultDniResponse.listaConsulta.datosPersona;
            this.f_s3_pn_NombresFC.setValue(datosPersona.prenombres);
            this.f_s3_pn_ApellidoPaternoFC.setValue(datosPersona.apPrimer);
            this.f_s3_pn_ApellidoMaternoFC.setValue(datosPersona.apSegundo);
         }
         catch (e) {
            this.funcionesMtcService.ocultarCargando().mensajeError('No se puede validar el Número de DNI. Por favor ingresar los datos del contacto.');
            this.f_s3_pn_NombresFC.enable();
            this.f_s3_pn_ApellidoPaternoFC.enable();
            this.f_s3_pn_ApellidoMaternoFC.enable();
         }
      } else if (tipoDocumento === '04') {// CARNÉ DE EXTRANJERÍA
         try {
            this.funcionesMtcService.mostrarCargando();
            const respuesta = await this.extranjeriaService.getCE(numeroDocumento).toPromise();
            this.funcionesMtcService.ocultarCargando();

            if (respuesta.CarnetExtranjeria.numRespuesta !== '0000') {
               return this.funcionesMtcService.mensajeError('Número de documento no registrado en Migraciones');
            }

            this.f_s3_pn_NombresFC.setValue(respuesta.CarnetExtranjeria.nombres);
            this.f_s3_pn_ApellidoPaternoFC.setValue(respuesta.CarnetExtranjeria.primerApellido);
            this.f_s3_pn_ApellidoMaternoFC.setValue(respuesta.CarnetExtranjeria.segundoApellido);
         }
         catch (e) {
            this.funcionesMtcService.ocultarCargando().mensajeError('Error al consultar al servicio');
            this.f_s3_pn_NombresFC.enable();
            this.f_s3_pn_ApellidoPaternoFC.enable();
            this.f_s3_pn_ApellidoMaternoFC.enable();
         }
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
         this.f_s3_pj_rl_NombreFC.setValue(nombres);
         this.f_s3_pj_rl_ApePaternoFC.setValue(apPaterno);
         this.f_s3_pj_rl_ApeMaternoFC.setValue(apMaterno);
         this.f_s3_pj_rl_DomicilioFC.setValue(direccion);

         this.f_s3_pj_rl_NombreFC.disable({ emitEvent: false });
         this.f_s3_pj_rl_ApePaternoFC.disable({ emitEvent: false });
         this.f_s3_pj_rl_ApeMaternoFC.disable({ emitEvent: false });

         await this.ubigeoRepLegComponent?.setUbigeoByText(
            departamento,
            provincia,
            distrito);
      }
      else {
         this.funcionesMtcService
            .mensajeConfirmar(`Los datos ingresados fueron validados por ${tipoDocumento === '01' ? 'RENIEC' : 'MIGRACIONES'} corresponden a la persona ${nombres} ${apPaterno} ${apMaterno}. ¿Está seguro de agregarlo?`)
            .then(async () => {
               this.f_s3_pj_rl_NombreFC.setValue(nombres);
               this.f_s3_pj_rl_ApePaternoFC.setValue(apPaterno);
               this.f_s3_pj_rl_ApeMaternoFC.setValue(apMaterno);
               this.f_s3_pj_rl_DomicilioFC.setValue(direccion);

               this.f_s3_pj_rl_NombreFC.disable({ emitEvent: false });
               this.f_s3_pj_rl_ApePaternoFC.disable({ emitEvent: false });
               this.f_s3_pj_rl_ApeMaternoFC.disable({ emitEvent: false });

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
         case '00001':
            this.tipoSolicitante = 'PN'; // persona natural
            this.f_s3_pn_TipoDocSolicitanteFC.setValue('DNI');

            this.tipoDocumentoSolicitante = "01";
            this.nombreTipoDocumentoSolicitante = "DNI";
            this.numeroDocumentoSolicitante = this.nroDocumentoLogin;
            this.nombreSolicitante = this.seguridadService.getUserName();

            break;

         case '00002':
            this.tipoSolicitante = 'PJ'; // persona juridica
            this.f_s3_pn_TipoDocSolicitanteFC.setValue('DNI');

            break;

         case '00004':
            this.tipoSolicitante = 'PE'; // persona extranjera
            this.nombreSolicitante = this.seguridadService.getUserName();

            switch (this.seguridadService.getTipoDocumento()) {
               case "00003": this.tipoDocumentoSolicitante = "04";
                  this.nombreTipoDocumentoSolicitante = "CE";
                  this.numeroDocumentoSolicitante = this.nroDocumentoLogin;
                  this.f_s3_pn_TipoDocSolicitanteFC.setValue('CARNET DE EXTRANJERIA');
                  break;
               case "00101": this.tipoDocumentoSolicitante = "05";
                  this.nombreTipoDocumentoSolicitante = "CARNÉ SOLICITANTE DE REFUGIO";
                  this.numeroDocumentoSolicitante = this.nroDocumentoLogin;
                  this.f_s3_pn_TipoDocSolicitanteFC.setValue('CARNÉ SOLICITANTE DE REFUGIO');
                  break;
               case "00102": this.tipoDocumentoSolicitante = "06";
                  this.nombreTipoDocumentoSolicitante = "CARNÉ DE PERMISO TEMPORAL DE PERMANENCIA";
                  this.numeroDocumentoSolicitante = this.nroDocumentoLogin;
                  this.f_s3_pn_TipoDocSolicitanteFC.setValue('CARNÉ DE PERMISO TEMPORAL DE PERMANENCIA');
                  break;
               case "00103": this.tipoDocumentoSolicitante = "07";
                  this.nombreTipoDocumentoSolicitante = "CARNÉ DE IDENTIFICACION";
                  this.numeroDocumentoSolicitante = this.nroDocumentoLogin;
                  this.f_s3_pn_TipoDocSolicitanteFC.setValue('CARNÉ DE IDENTIFICACION');
                  break;
            }
            break;

         case '00005':
            this.tipoSolicitante = 'PNR'; // persona natural con ruc
            this.f_s3_pn_TipoDocSolicitanteFC.setValue('DNI');
            this.tipoDocumentoSolicitante = "01";
            this.nombreTipoDocumentoSolicitante = "DNI";
            this.numeroDocumentoSolicitante = this.nroDocumentoLogin;
            break;
      }

      if (this.dataInput != null && this.dataInput.movId > 0) {
         try {
            const dataFormulario = await this.formularioTramiteService.get<Formulario002_17_3Response>(this.dataInput.tramiteReqId).toPromise();

            this.funcionesMtcService.ocultarCargando();
            const metaData = JSON.parse(dataFormulario.metaData);
            console.log(metaData);
            this.id = dataFormulario.formularioId;

            if (this.f_s3_Contacto.enabled) {
               this.f_s3_pn_TipoDocSolicitanteFC.setValue(metaData.seccion3.contacto.tipoDocumento.id);
               this.f_s3_pn_NroDocSolicitanteFC.setValue(metaData.seccion3.contacto.numeroDocumento);
               this.f_s3_pn_NombresFC.setValue(metaData.seccion3.contacto.nombres);
               this.f_s3_pn_ApellidoPaternoFC.setValue(metaData.seccion3.contacto.apellidoPaterno);
               this.f_s3_pn_ApellidoMaternoFC.setValue(metaData.seccion3.contacto.apellidoMaterno);
               this.f_s3_pn_TelefonoFC.setValue(metaData.seccion3.contacto.telefono);
               this.f_s3_pn_CelularFC.setValue(metaData.seccion3.contacto.celular);
               this.f_s3_pn_CorreoFC.setValue(metaData.seccion3.contacto.email);
               this.f_s3_pn_RucFC.clearValidators();
               this.f_s3_pn_RucFC.updateValueAndValidity();
            }

            if (this.f_s3_PerJurFG.enabled) {
               this.f_s3_pj_RucFC.setValue(metaData.seccion3.ruc);
               this.f_s3_pj_RazonSocialFC.setValue(metaData.seccion3.razonSocial);
               this.f_s3_pj_DomicilioFC.setValue(metaData.seccion3.domicilioLegal);

               this.f_s3_pj_DepartamentoFC.setValue(metaData.seccion3.departamento.trim());
               this.f_s3_pj_ProvinciaFC.setValue(metaData.seccion3.provincia.trim());
               this.f_s3_pj_DistritoFC.setValue(metaData.seccion3.distrito.trim());

               this.f_s3_pj_rl_TelefonoFC.setValue(metaData.seccion3.telefono);
               this.f_s3_pj_rl_CelularFC.setValue(metaData.seccion3.celular);
               this.f_s3_pj_rl_CorreoFC.setValue(metaData.seccion3.email);
               this.f_s3_pj_rl_TipoDocumentoFC.setValue(metaData.seccion3.RepresentanteLegal.tipoDocumento.id);
               this.f_s3_pj_rl_NumeroDocumentoFC.setValue(metaData.seccion3.RepresentanteLegal.numeroDocumento);
               this.f_s3_pj_rl_NombreFC.setValue(metaData.seccion3.RepresentanteLegal.nombres);
               this.f_s3_pj_rl_ApePaternoFC.setValue(metaData.seccion3.RepresentanteLegal.apellidoPaterno);
               this.f_s3_pj_rl_ApeMaternoFC.setValue(metaData.seccion3.RepresentanteLegal.apellidoMaterno);
               this.f_s3_pj_rl_DomicilioFC.setValue(metaData.seccion3.RepresentanteLegal.domicilioLegal);

               this.f_s3_pj_rl_DepartamentoFC.setValue(metaData.seccion3.RepresentanteLegal.departamento.id);
               this.f_s3_pj_rl_ProvinciaFC.setValue(metaData.seccion3.RepresentanteLegal.provincia.id);
               this.f_s3_pj_rl_DistritoFC.setValue(metaData.seccion3.RepresentanteLegal.distrito.id);

               this.f_s3_pj_rl_ZonaFC.setValue(metaData.seccion3.RepresentanteLegal.zona);
               this.f_s3_pj_rl_SedeFC.setValue(metaData.seccion3.RepresentanteLegal.oficinaRegistral.id);
               this.f_s3_pj_rl_PartidaFC.setValue(metaData.seccion3.RepresentanteLegal.partida);
               this.f_s3_pj_rl_AsientoFC.setValue(metaData.seccion3.RepresentanteLegal.asiento);

               this.f_s3_pj_RazonSocialFC.disable();
               this.f_s3_pj_RucFC.disable();
               this.f_s3_pj_DomicilioFC.disable();
               this.f_s3_pj_DistritoFC.disable({ emitEvent: false });
               this.f_s3_pj_ProvinciaFC.disable({ emitEvent: false });
               this.f_s3_pj_DepartamentoFC.disable({ emitEvent: false });

            }
            if (metaData.seccion5 != null) {
               for (let item of metaData.seccion5.certificados) {
                  this.certificados.push({
                     tipoVehiculo: item.tipoVehiculo,
                     nombreTipoVehiculo: item.nombreTipoVehiculo,
                     numeroUnidad: item.numeroUnidad,
                     materialPeligroso: item.materialPeligroso
                  });
               }
            }
            this.f_s6_declaracion_1.setValue(metaData.seccion6.declaracion_1);
            this.f_s6_declaracion_2.setValue(metaData.seccion6.declaracion_2);
         }
         catch (e) {
            console.error(e);
            this.funcionesMtcService.ocultarCargando().mensajeError('Problemas para recuperar los datos guardados');
         }
      } else {
         switch (this.tipoSolicitante) {
            case "PNR":
               this.f_s3_pj_rl_TipoDocumentoFC.setValue('01');
               this.f_s3_pj_rl_NumeroDocumentoFC.setValue(this.nroDocumentoLogin);
               await this.buscarNumeroDocumento();
               this.f_s3_pj_rl_TipoDocumentoFC.disable({ emitEvent: false });
               this.f_s3_pj_rl_NumeroDocumentoFC.disable({ emitEvent: false });
               this.disableBtnBuscarRepLegal = true;

               this.f_s3_pj_RucFC.clearValidators();
               this.f_s3_pj_RucFC.updateValueAndValidity();
               this.f_s3_pj_RucFC.disable({ emitEvent: false });

               this.f_s3_pj_DepartamentoFC.clearValidators();
               this.f_s3_pj_DepartamentoFC.updateValueAndValidity({ emitEvent: false });
               this.f_s3_pj_DepartamentoFC.disable({ emitEvent: false });
               this.f_s3_pj_ProvinciaFC.clearValidators();
               this.f_s3_pj_ProvinciaFC.updateValueAndValidity({ emitEvent: false });
               this.f_s3_pj_ProvinciaFC.disable({ emitEvent: false });
               this.f_s3_pj_DistritoFC.clearValidators();
               this.f_s3_pj_DistritoFC.updateValueAndValidity({ emitEvent: false });
               this.f_s3_pj_DistritoFC.disable({ emitEvent: false });
               break;

            case "PN":
               try {
                  const respuesta = await this.reniecService.getDni(this.numeroDocumentoSolicitante).toPromise();
                  this.funcionesMtcService.ocultarCargando();

                  if (respuesta.reniecConsultDniResponse.listaConsulta.coResultado !== '0000') {
                     return this.funcionesMtcService.mensajeError('Número de documento no registrado en Reniec');
                  }
                  const datosPersona = respuesta.reniecConsultDniResponse.listaConsulta.datosPersona;
                  this.f_s3_pn_NombresFC.setValue(datosPersona.prenombres + ' ' + datosPersona.apPrimer + ' ' + datosPersona.apSegundo);

                  this.f_s3_pn_NroDocSolicitanteFC.setValue(this.numeroDocumentoSolicitante);

                  this.f_s3_pn_NombresFC.disable();
                  this.f_s3_pn_NroDocSolicitanteFC.disable();
                  this.f_s3_pn_TipoDocSolicitanteFC.disable();

                  this.f_s3_pn_RucFC.clearValidators();
                  this.f_s3_pn_RucFC.updateValueAndValidity();
                  this.f_s3_pn_RucFC.disable();
               }
               catch (e) {
                  console.error(e);
                  this.funcionesMtcService.ocultarCargando().mensajeError('El servicio de la RENIEC no se encuentra disponible, deberá ingresar los datos completos.');
                  this.f_s3_pn_NombresFC.enable();
               }
               break;

            case "PJ":
               try {
                  this.funcionesMtcService.mostrarCargando();
                  const response = await this.sunatService.getDatosPrincipales(this.nroRuc).toPromise();
                  this.funcionesMtcService.ocultarCargando();
                  this.f_s3_pj_RazonSocialFC.setValue(this.datosUsuarioLogin.razonSocial.trim());
                  this.f_s3_pj_RucFC.setValue(this.datosUsuarioLogin.ruc.trim());
                  this.f_s3_pj_DomicilioFC.setValue(this.datosUsuarioLogin.direccion.trim());
                  this.f_s3_pj_DepartamentoFC.setValue(this.datosUsuarioLogin.departamento.trim());
                  this.f_s3_pj_ProvinciaFC.setValue(this.datosUsuarioLogin.provincia.trim());
                  this.f_s3_pj_DistritoFC.setValue(this.datosUsuarioLogin.distrito.trim());

                  this.f_s3_pj_rl_TelefonoFC.setValue(this.datosUsuarioLogin.telefono.trim());
                  this.f_s3_pj_rl_CelularFC.setValue(this.datosUsuarioLogin.celular.trim());
                  this.f_s3_pj_rl_CorreoFC.setValue(this.datosUsuarioLogin.correo.trim());

                  this.f_s3_pj_RazonSocialFC.disable();
                  this.f_s3_pj_RucFC.disable();
                  this.f_s3_pj_DomicilioFC.disable();
                  this.f_s3_pj_DistritoFC.disable({ emitEvent: false });
                  this.f_s3_pj_ProvinciaFC.disable({ emitEvent: false });
                  this.f_s3_pj_DepartamentoFC.disable({ emitEvent: false });

                  this.f_s3_pn_TipoDocSolicitanteFC.setValue('');

                  this.representanteLegal = response.representanteLegal;
               } catch (e) {
                  this.funcionesMtcService.ocultarCargando().mensajeError('Error al consultar el Servicio ');

                  this.f_s3_pj_RazonSocialFC.setValue(this.razonSocial);
                  this.f_s3_pj_RucFC.setValue(this.nroRuc);

                  this.f_s3_pj_DomicilioFC.enable();
                  this.f_s3_pj_DistritoFC.enable();
                  this.f_s3_pj_ProvinciaFC.enable();
                  this.f_s3_pj_DepartamentoFC.enable();
               }
               break;
            case "PE":
               this.funcionesMtcService.ocultarCargando();
               this.f_s3_pn_NroDocSolicitanteFC.setValue(this.numeroDocumentoSolicitante);
               this.f_s3_pn_NombresFC.setValue(this.nombreSolicitante);

               this.f_s3_pn_RucFC.clearValidators();
               this.f_s3_pn_RucFC.updateValueAndValidity();
               this.f_s3_pn_RucFC.disable();

               this.f_s3_pn_NroDocSolicitanteFC.disable();
               this.f_s3_pn_NombresFC.disable();
               this.f_s3_pn_TipoDocSolicitanteFC.disable();
               break;
         }
      }
   }

   soloNumeros(event): void {
      event.target.value = event.target.value.replace(/[^0-9]/g, '');
   }

   guardarFormulario(): void {
      this.formularioFG.markAllAsTouched();
      if (this.formularioFG.invalid === true) {
         this.funcionesMtcService.mensajeError('Debe ingresar todos los campos obligatorios.');
         return;
      }

      if (this.f_s3_pj_rl_ApePaternoFC.value == "" || this.f_s3_pj_rl_NombreFC.value == "") {
         this.funcionesMtcService.mensajeError('Debe ingresar todos los campos obligatorios.');
         return;
      }

      if (this.certificados && this.certificados.length === 0) {
         this.funcionesMtcService.mensajeError('Debe ingresar la relación de CERTIFICADOS.');
         return;
      }

      const sede = this.f_s3_pj_rl_SedeFC.value;

      const dataGuardar = new Formulario002_17_3Request();
      dataGuardar.id = this.id;
      dataGuardar.codigo = 'F002-17.3';
      dataGuardar.formularioId = 2;
      dataGuardar.codUsuario = this.nroDocumentoLogin;
      dataGuardar.tramiteReqId = this.dataInput.tramiteReqId;
      (dataGuardar.idTramiteReq = this.dataInput.tramiteReqId),
         dataGuardar.estado = 1;

      dataGuardar.metaData.seccion1.dcv_004 = this.codigoProcedimientoTupa === 'DCV-004';
      dataGuardar.metaData.seccion1.dcv_005 = this.codigoProcedimientoTupa === 'DCV-005';
      dataGuardar.metaData.seccion1.dcv_006 = this.codigoProcedimientoTupa === 'DCV-006';

      dataGuardar.metaData.seccion3.ruc = this.f_s3_pj_RucFC.value;
      dataGuardar.metaData.seccion3.razonSocial = this.f_s3_pj_RazonSocialFC.value;
      dataGuardar.metaData.seccion3.domicilioLegal = this.f_s3_pj_DomicilioFC.value;
      dataGuardar.metaData.seccion3.distrito = this.f_s3_pj_DistritoFC.value;
      dataGuardar.metaData.seccion3.provincia = this.f_s3_pj_ProvinciaFC.value;
      dataGuardar.metaData.seccion3.departamento = this.f_s3_pj_DepartamentoFC.value;

      dataGuardar.metaData.seccion3.tipoSolicitante = this.tipoSolicitante;

      dataGuardar.metaData.seccion3.contacto.tipoDocumento.id = this.f_s3_pn_TipoDocSolicitanteFC.value;
      dataGuardar.metaData.seccion3.contacto.tipoDocumento.documento = this.listaTiposDocumentos.filter((item) => item.id === this.f_s3_pj_rl_TipoDocumentoFC.value)[0].documento;
      dataGuardar.metaData.seccion3.contacto.numeroDocumento = this.f_s3_pn_NroDocSolicitanteFC.value; // nroDocumento
      dataGuardar.metaData.seccion3.contacto.nombres = this.f_s3_pn_NombresFC.value;
      dataGuardar.metaData.seccion3.contacto.apellidoPaterno = this.f_s3_pn_ApellidoPaternoFC.value;
      dataGuardar.metaData.seccion3.contacto.apellidoMaterno = this.f_s3_pn_ApellidoMaternoFC.value;
      dataGuardar.metaData.seccion3.contacto.telefono = this.f_s3_pn_TelefonoFC.value;
      dataGuardar.metaData.seccion3.contacto.celular = this.f_s3_pn_CelularFC.value;
      dataGuardar.metaData.seccion3.contacto.email = this.f_s3_pn_CorreoFC.value;

      dataGuardar.metaData.seccion3.representanteLegal.nombres = this.f_s3_pj_rl_NombreFC.value;
      dataGuardar.metaData.seccion3.representanteLegal.apellidoPaterno = this.f_s3_pj_rl_ApePaternoFC.value;
      dataGuardar.metaData.seccion3.representanteLegal.apellidoMaterno = this.f_s3_pj_rl_ApeMaternoFC.value;
      dataGuardar.metaData.seccion3.representanteLegal.tipoDocumento.id = this.f_s3_pj_rl_TipoDocumentoFC.value;
      dataGuardar.metaData.seccion3.representanteLegal.tipoDocumento.documento =
         this.listaTiposDocumentos.filter(
            (item) => item.id === this.f_s3_pj_rl_TipoDocumentoFC.value
         )[0].documento;
      dataGuardar.metaData.seccion3.representanteLegal.numeroDocumento = this.f_s3_pj_rl_NumeroDocumentoFC.value;
      dataGuardar.metaData.seccion3.representanteLegal.domicilioLegal = this.f_s3_pj_rl_DomicilioFC.value;
      dataGuardar.metaData.seccion3.representanteLegal.oficinaRegistral.id = sede;
      dataGuardar.metaData.seccion3.representanteLegal.oficinaRegistral.descripcion =
         this.oficinasRegistral.filter(
            (item) => item.value === sede
         )[0].text;
      dataGuardar.metaData.seccion3.representanteLegal.zona = this.f_s3_pj_rl_ZonaFC.value;
      dataGuardar.metaData.seccion3.representanteLegal.partida = this.f_s3_pj_rl_PartidaFC.value;
      dataGuardar.metaData.seccion3.representanteLegal.asiento = this.f_s3_pj_rl_AsientoFC.value;
      dataGuardar.metaData.seccion3.representanteLegal.departamento.id = this.f_s3_pj_rl_DepartamentoFC.value;
      dataGuardar.metaData.seccion3.representanteLegal.departamento.descripcion = this.ubigeoRepLegComponent?.getDepartamentoText() ?? '';
      dataGuardar.metaData.seccion3.representanteLegal.provincia.id = this.f_s3_pj_rl_ProvinciaFC.value;
      dataGuardar.metaData.seccion3.representanteLegal.provincia.descripcion = this.ubigeoRepLegComponent?.getProvinciaText() ?? '';
      dataGuardar.metaData.seccion3.representanteLegal.distrito.id = this.f_s3_pj_rl_ProvinciaFC.value;
      dataGuardar.metaData.seccion3.representanteLegal.distrito.descripcion = this.ubigeoRepLegComponent?.getDistritoText() ?? '';

      dataGuardar.metaData.seccion3.telefono = this.f_s3_pj_rl_TelefonoFC.value;
      dataGuardar.metaData.seccion3.celular = this.f_s3_pj_rl_CelularFC.value;
      dataGuardar.metaData.seccion3.email = this.f_s3_pj_rl_CorreoFC.value;

      dataGuardar.metaData.seccion6.declaracion_1 = this.f_s6_declaracion_1.value;
      dataGuardar.metaData.seccion6.declaracion_2 = this.f_s6_declaracion_2.value;

      dataGuardar.metaData.seccion7.tipoDocumentoSolicitante = this.f_s3_pj_rl_TipoDocumentoFC.value;
      dataGuardar.metaData.seccion7.nombreTipoDocumentoSolicitante = this.f_s3_pj_rl_TipoDocumentoFC.value == "01" ? "DNI" : "CE";
      dataGuardar.metaData.seccion7.numeroDocumentoSolicitante = this.f_s3_pj_rl_NumeroDocumentoFC.value;
      dataGuardar.metaData.seccion7.nombresApellidosSolicitante = this.f_s3_pj_rl_NombreFC.value + " " + this.f_s3_pj_rl_ApePaternoFC.value + " " + this.f_s3_pj_rl_ApeMaternoFC.value;

      // SECCION (Relación de Conductores)
      const relacionCertificados: Certificado[] = this.certificados.map(certificado => {
         return {
            tipoVehiculo: certificado.tipoVehiculo,
            nombreTipoVehiculo: certificado.nombreTipoVehiculo,
            numeroUnidad: certificado.numeroUnidad,
            materialPeligroso: certificado.materialPeligroso
         } as Certificado;
      });

      dataGuardar.metaData.seccion5.Certificados = relacionCertificados;

      const dataGuardarFormData = this.funcionesMtcService.jsonToFormData(dataGuardar);

      this.funcionesMtcService.mensajeConfirmar(`¿Está seguro de ${this.id === 0 ? 'guardar' : 'modificar'} los datos ingresados?`)
         .then(async () => {
            if (this.id === 0) {
               this.funcionesMtcService.mostrarCargando();
               // GUARDAR:
               try {
                  console.log(JSON.stringify(dataGuardar));
                  const data = await this.formularioService.post(dataGuardarFormData).toPromise();
                  this.funcionesMtcService.ocultarCargando();
                  this.id = data.id;
                  this.uriArchivo = data.uriArchivo;
                  this.graboUsuario = true;
                  this.funcionesMtcService.mensajeOk('Los datos fueron guardados exitosamente ');
               }
               catch (e) {
                  this.funcionesMtcService.ocultarCargando().mensajeError('Problemas para realizar el guardado de datos');
               }
            } else {
               // Evalua anexos a actualizar
               const listarequisitos = this.dataRequisitosInput;
               let cadenaAnexos = '';
               for (const requisito of listarequisitos) {
                  if (this.dataInput.tramiteReqId === requisito.tramiteReqRefId) {
                     if (requisito.movId > 0) {
                        const nombreAnexo = requisito.codigoFormAnexo.split('_');
                        cadenaAnexos += nombreAnexo[0] + ' ' + nombreAnexo[1] + '-' + nombreAnexo[2] + ' ';
                     }
                  }
               }
               if (cadenaAnexos.length > 0) {
                  // ACTUALIZA FORMULARIO Y ANEXOS
                  this.funcionesMtcService.mensajeConfirmar('Deberá volver a grabar los anexos ' + cadenaAnexos + '¿Desea continuar?')
                     .then(async () => {
                        this.funcionesMtcService.mostrarCargando();

                        try {
                           const data = await this.formularioService.put(dataGuardarFormData).toPromise();
                           this.funcionesMtcService.ocultarCargando();
                           this.id = data.id;
                           this.uriArchivo = data.uriArchivo;
                           this.graboUsuario = true;
                           this.funcionesMtcService.ocultarCargando();
                           this.funcionesMtcService.mensajeOk(`Los datos fueron modificados exitosamente`);

                           for (const requisito of listarequisitos) {
                              if (this.dataInput.tramiteReqId === requisito.tramiteReqRefId) {
                                 if (requisito.movId > 0) {
                                    console.log('Actualizando Anexos');
                                    console.log(requisito.tramiteReqRefId);
                                    console.log(requisito.movId);
                                    // ACTUALIZAR ESTADO DEL ANEXO Y LIMPIAR URI ARCHIVO
                                    try {
                                       await this.formularioTramiteService.uriArchivo<number>(requisito.movId).toPromise();
                                    }
                                    catch (e) {
                                       this.funcionesMtcService.ocultarCargando().mensajeError('Problemas para realizar la modificación de los anexos');
                                    }
                                 }
                              }
                           }
                        }
                        catch (e) {
                           this.funcionesMtcService.ocultarCargando().mensajeError('Problemas para realizar la modificación de datos');
                        }
                     });
               } else {
                  // actualiza formulario
                  this.funcionesMtcService.mostrarCargando();
                  try {
                     const data = await this.formularioService.put(dataGuardarFormData).toPromise();
                     console.log("Guardar");
                     console.log(data);
                     this.funcionesMtcService.ocultarCargando();
                     this.id = data.id;
                     this.uriArchivo = data.uriArchivo;
                     this.graboUsuario = true;
                     this.funcionesMtcService.ocultarCargando();
                     this.funcionesMtcService.mensajeOk(`Los datos fueron modificados exitosamente`);
                  }
                  catch (e) {
                     this.funcionesMtcService.ocultarCargando().mensajeError('Problemas para realizar la modificación de datos');
                  }
               }
            }
         });
   }

   async descargarPdf(): Promise<void> { // OK
      if (this.id === 0) {
         this.funcionesMtcService.mensajeError('Debe guardar previamente los datos ingresados');
         return;
      }

      if (!this.uriArchivo || this.uriArchivo === '' || this.uriArchivo == null) {
         this.funcionesMtcService.mensajeError('No se logró ubicar el archivo PDF');
         return;
      }

      this.funcionesMtcService.mostrarCargando();

      try {
         const file: Blob = await this.visorPdfArchivosService.get(this.uriArchivo).toPromise();
         this.funcionesMtcService.ocultarCargando();

         const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
         const urlPdf = URL.createObjectURL(file);
         modalRef.componentInstance.pdfUrl = urlPdf;
         modalRef.componentInstance.titleModal = 'Vista Previa - Formulario 002/17.03';
      }
      catch (e) {
         this.funcionesMtcService
            .ocultarCargando()
            .mensajeError('Problemas para descargar Pdf');
      }
   }

   /*************SECCION PLACAS***************** */

   agregarCertificado(): void {

      if (
         this.f_s5_TipoVehiculo.value.trim() === '' ||
         this.f_s5_NumeroUnidad.value.trim() === '' ||
         this.f_s5_MaterialPeligroso.value.trim() === ''
      ) {
         this.funcionesMtcService.mensajeError('Debe completar los campos.');
         return;
      }

      const tipoVehiculo = this.f_s5_TipoVehiculo.value.trim().toUpperCase();
      const nroUnidad = this.f_s5_NumeroUnidad.value.trim();
      const indexFind = this.certificados.findIndex(item => item.tipoVehiculo === tipoVehiculo && item.numeroUnidad == nroUnidad);
      const nombreVehiculo = this.listaTiposVehiculo.filter((item) => item.id === tipoVehiculo)[0].documento;
      // Validamos que la placa de rodaje no esté incluida en la grilla
      if (indexFind !== -1) {
         if (indexFind !== this.recordIndexToEditCertificado) {
            this.funcionesMtcService.mensajeError('El tipo de vehículo '+nombreVehiculo+' y número de unidad '+ nroUnidad +' ya se encuentra registrado');
            return;
         }
      }

      if (this.recordIndexToEditCertificado === -1) {
         this.certificados.push({
            tipoVehiculo: this.f_s5_TipoVehiculo.value,
            nombreTipoVehiculo: nombreVehiculo,
            numeroUnidad: this.f_s5_NumeroUnidad.value,
            materialPeligroso: this.f_s5_MaterialPeligroso.value
         });
      } else {
         this.certificados[this.recordIndexToEditCertificado].tipoVehiculo = tipoVehiculo;
         this.certificados[this.recordIndexToEditCertificado].nombreTipoVehiculo = nombreVehiculo,
            this.certificados[this.recordIndexToEditCertificado].numeroUnidad = this.f_s5_NumeroUnidad.value ?? '',
            this.certificados[this.recordIndexToEditCertificado].materialPeligroso = this.f_s5_MaterialPeligroso.value;
      }

      this.cancelarCertificado();

   }

   eliminarCertificado(item: Certificado, index): void {
      if (this.recordIndexToEditCertificado === -1) {

         this.funcionesMtcService
            .mensajeConfirmar('¿Está seguro de eliminar el registro seleccionado?')
            .then(() => {
               this.certificados.splice(index, 1);
            });
      }
   }

   cancelarCertificado() {
      this.f_s5_TipoVehiculo.setValue('');
      this.f_s5_NumeroUnidad.setValue('');
      this.f_s5_MaterialPeligroso.setValue('');
   }

   formInvalid(control: AbstractControl): boolean {
      if (control) {
         return control.invalid && (control.dirty || control.touched);
      }
   }

   public findInvalidControls() {
      const invalid = [];
      const controls = this.formularioFG.controls;
      for (const name in controls) {
         if (controls[name].invalid) {
            invalid.push(name);
         }
      }
      console.log(invalid);
   }
}