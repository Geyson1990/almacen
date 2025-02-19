/**
 * Anexo 003-A/27
 * @author Mackenneddy Melendez Coral
 * @version 1.0 30.10.2022
 */

import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { AbstractControlOptions, UntypedFormBuilder, UntypedFormGroup, Validators, UntypedFormControl, FormArray, Form } from '@angular/forms';
import { NgbAccordionDirective , NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
//import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { FuncionesMtcService } from '../../../../../core/services/funciones-mtc.service';
//import { AnexoTramiteService } from 'src/app/core/services/tramite/anexo-tramite.service';
import { AnexoTramiteService } from '../../../../../core/services/tramite/anexo-tramite.service';
//import { VisorPdfArchivosService } from 'src/app/core/services/tramite/visor-pdf-archivos.service';
import { VisorPdfArchivosService } from '../../../../../core/services/tramite/visor-pdf-archivos.service';
//import { VistaPdfComponent } from 'src/app/shared/components/vista-pdf/vista-pdf.component';
import { VistaPdfComponent } from '../../../../../shared/components/vista-pdf/vista-pdf.component';
//import { noWhitespaceValidator, requireCheckboxesToBeCheckedValidator } from 'src/app/helpers/validator';
import { noWhitespaceValidator } from '../../../../../helpers/validator';
import { SeguridadService } from '../../../../../core/services/seguridad.service';
//import { Anexo003_A27Response } from '../../../../../core/models/Anexos/Anexo003_a27/Anexo003_a27Response';
import { Anexo003_A27Response } from '../../../domain/anexo003_A27/anexo003_A27Response';
//import { MetaData } from 'src/app/core/models/Anexos/Anexo003_A27/MetaData';
//import { UbigeoComponent } from 'src/app/shared/components/forms/ubigeo/ubigeo.component';
import { UbigeoComponent } from '../../../../../shared/components/forms/ubigeo/ubigeo.component';
//import { Anexo003_A27Request } from 'src/app/core/models/Anexos/Anexo003_A27/Anexo003_A27Request';
import { Anexo003_A27Request, MetaData, Seccion2, Seccion3 } from '../../../domain/anexo003_A27/anexo003_A27Request';
//import { ExtranjeriaService } from 'src/app/core/services/servicios/extranjeria.service';
import { ExtranjeriaService } from '../../../../../core/services/servicios/extranjeria.service';
//import { ReniecService } from 'src/app/core/services/servicios/reniec.service';
import { ReniecService } from '../../../../../core/services/servicios/reniec.service';
//import { SunatService } from 'src/app/core/services/servicios/sunat.service';
import { SunatService } from '../../../../../core/services/servicios/sunat.service';
//import { CONSTANTES } from 'src/app/enums/constants';
import { CONSTANTES } from '../../../../../enums/constants';
//import { Anexo003A27Service } from 'src/app/core/services/anexos/anexo003-a27.service';
import { Anexo003_A27Service } from '../../../application/usecases';
import { TipoDocumentoModel } from '../../../../../core/models/TipoDocumentoModel';
//import { Seccion2, Seccion3 } from '../../../../../core/models/Anexos/Anexo003_A27/Secciones';



@Component({
   // tslint:disable-next-line: component-selector
   selector: 'app-anexo003_A27',
   templateUrl: './anexo003_A27.component.html',
   styleUrls: ['./anexo003_A27.component.css']
})

// tslint:disable-next-line: class-name
export class Anexo003_A27_Component implements OnInit, AfterViewInit, AfterViewChecked {
   @Input() public dataInput: any;
   @ViewChild('acc') acc: NgbAccordionDirective ;

   @ViewChild('ubigeoCmpEstFija1') ubigeoEstFija1Component: UbigeoComponent;


   txtTitulo = 'ANEXO 003-A/27 ANEXO PARA FORMULARIO "SERVICIO POSTALES"';

   paSeccion1: string[] = ["DGPPC-023"];
   habilitarSeccion1: boolean = true;

   graboUsuario = false;

   idAnexo = 0;
   uriArchivo = ''; // PARA SABER EL NOMBRE DEL PDF (COMPLETO CON TODO Y ADJUNTOS)
   errorAlCargarData = false; // VARIABLE PARA CONTROLAR CUANDO OCURRE UN ERROR AL RECUPERAR LOS DATOS GUARDADOS DEL ANEXO

   anexoFG: UntypedFormGroup;
   tipoDocFG: UntypedFormGroup;
   postulanteFG: UntypedFormGroup;

   tipoSolicitante: string;

   listaTiposDocumentos: TipoDocumentoModel[] = [
      { id: "01", documento: 'DNI' },
      { id: "04", documento: 'Carnet de Extranjería' },
   ];

   listaEsBienPrestadoPostal: any[] = [
      { id: "si", nombre: 'SI' },
      { id: "no", nombre: 'NO' },
   ];

   listaEsBienPrestadoTransporte: any[] = [
      { id: "si", nombre: 'SI' },
      { id: "no", nombre: 'NO' },
   ];




   listaTipoVehiculos: any = [
      { id: 1, descripcion: 'Unidad Múltiple Eléctrica' },
      { id: 2, descripcion: 'Unidad Múltiple Diésel' },
      { id: 3, descripcion: 'Locomotora' },
      { id: 4, descripcion: 'Coche Tractivo con Cabina de Comando' },
      { id: 5, descripcion: 'Equipo Auxiliar de Mantenimiento de Vía' }
   ];

   listaRestricciones: any = [
      { id: 1, descripcion: 'Ninguna' },
      { id: 2, descripcion: 'Lentes' },
      { id: 3, descripcion: 'Locomotora' },
      { id: 4, descripcion: 'Otros (Audífonos)' },
   ];

   // CODIGO Y NOMBRE DEL PROCEDIMIENTO:
   codigoProcedimientoTupa: string;
   descProcedimientoTupa: string;

   tipoDocumento = '';
   nroDocumento = '';
   nroRuc = '';
   nombreCompleto = '';
   razonSocial = '';
   domicilioLegal = '';

   indexEditPostulante = -1;

   defaultTipoTramite = '';

   constructor(
      private fb: UntypedFormBuilder,
      private funcionesMtcService: FuncionesMtcService,
      private modalService: NgbModal,
      private anexoService: Anexo003_A27Service,
      private seguridadService: SeguridadService,
      private anexoTramiteService: AnexoTramiteService,
      private visorPdfArchivosService: VisorPdfArchivosService,
      public activeModal: NgbActiveModal,
      private reniecService: ReniecService,
      private extranjeriaService: ExtranjeriaService,
      private sunatService: SunatService,
      private readonly changeDetectorRef: ChangeDetectorRef
   ) { }

   ngAfterViewChecked(): void {
      this.changeDetectorRef.detectChanges();
   }

   ngOnInit(): void {
      // ==================================================================================
      // RECUPERAMOS NOMBRE DEL TUPA:
      const tramiteSelected = JSON.parse(localStorage.getItem('tramite-selected'));
      this.codigoProcedimientoTupa = tramiteSelected.codigo;
      this.descProcedimientoTupa = tramiteSelected.nombre;

      // if (this.codigoProcedimientoTupa == "DCV-001") {
      //   this.defaultTipoTramite = "Otorgamiento";
      // } else if (this.codigoProcedimientoTupa == "DCV-003") {
      //   this.defaultTipoTramite = "Renovación";
      // }
      console.log("Codigo Procedimiento:", this.paSeccion1.indexOf(this.codigoProcedimientoTupa));
      // ==================================================================================

      this.uriArchivo = this.dataInput.rutaDocumento;

      if (this.paSeccion1.indexOf(this.codigoProcedimientoTupa) > -1) this.habilitarSeccion1 = false; else this.habilitarSeccion1 = true;

      this.anexoFG = this.fb.group({
         d_Seccion1: this.fb.group({

            //nroResolucion: (this.codigoProcedimientoTupa === 'DGAAM-003') ? this.fb.control("", [Validators.required, Validators.minLength(2)]) : "",
            d_s1_razon_social: (this.codigoProcedimientoTupa === 'DGPPC-023') ? "" : [{ value: '', disabled: true }, [Validators.required]],
            d_s1_direccion: (this.codigoProcedimientoTupa === 'DGPPC-023') ? "" : [{ value: '', disabled: true }, [Validators.required]],

         }),

         d_Seccion2: this.fb.group({
            d_s2_desc_ambito_geo: ['', [Validators.required]],
            d_s2_desc_tipo_servicio_prestar: ['', [Validators.required]],
            d_s2_desc_infraesctructura: ['', [Validators.required]],

            d_s2_servicio_postal: ['', [Validators.required]],
            d_s2_fecha_inicio: ['', [Validators.required]],
            d_s2_nro_rd: ['', [Validators.required]],
            d_s2_fecha_ultima_autoriza: ['', [Validators.required]],

            d_s2_prestado_servicio_transporte: ['', [Validators.required]],
            d_s2_nro_reso_autoriza: ['', [Validators.required]],
            d_s2_fecha_resolucion_ultima_autoriza: ['', [Validators.required]],

            d_s2_entidad_emite_carta_fianza: ['', [Validators.required]],
            d_s2_monto_carta_fianza: ['', [Validators.required]],
            d_s2_fecha_vence_carta_fianza: ['', [Validators.required]],
         }),
         a_Seccion5FG: this.fb.group({
            a_s5_declaracion1FC: [false, [Validators.requiredTrue]],
         })

      });
   }

   cambio() {
      console.log(this.anexoFG, "---Datos ini");
      return;
   }

   async ngAfterViewInit(): Promise<void> {
      this.nroRuc = this.seguridadService.getCompanyCode();
      this.nombreCompleto = this.seguridadService.getUserName();          // nombre de usuario login
      this.nroDocumento = this.seguridadService.getNumDoc();      // nro de documento usuario login
      this.tipoDocumento = this.seguridadService.getNameId();

      switch (this.seguridadService.getNameId()) {
         case '00001':
            this.tipoSolicitante = 'PN'; // persona natural
            this.tipoDocumento = '01';  // 01 DNI  03 CI  04 CE

            break;
         case '00002':
            this.tipoSolicitante = 'PJ'; // persona juridica
            this.tipoDocumento = '01';
            break;
         case '00004':
            this.tipoSolicitante = 'PE'; // persona extranjera
            this.tipoDocumento = '04';  // 01 DNI  03 CI  04 CE
            break;
         case '00005':
            this.tipoSolicitante = 'PNR'; // persona natural con ruc
            this.tipoDocumento = '01';  // 01 DNI  03 CI  04 CE
            break;
      }

      await this.cargarDatos();
   }

   get d_Seccion1(): UntypedFormGroup { return this.anexoFG.get('d_Seccion1') as UntypedFormGroup; }
   get d_s1_razon_social(): UntypedFormControl { return this.d_Seccion1.get('d_s1_razon_social') as UntypedFormControl }
   get d_s1_direccion(): UntypedFormControl { return this.d_Seccion1.get('d_s1_direccion') as UntypedFormControl }

   ///---
   get d_Seccion2(): UntypedFormGroup { return this.anexoFG.get('d_Seccion2') as UntypedFormGroup; }
   get d_s2_desc_ambito_geo(): UntypedFormControl { return this.d_Seccion2.get('d_s2_desc_ambito_geo') as UntypedFormControl }
   get d_s2_desc_tipo_servicio_prestar(): UntypedFormControl { return this.d_Seccion2.get('d_s2_desc_tipo_servicio_prestar') as UntypedFormControl }
   get d_s2_desc_infraesctructura(): UntypedFormControl { return this.d_Seccion2.get('d_s2_desc_infraesctructura') as UntypedFormControl }

   get d_s2_servicio_postal(): UntypedFormControl { return this.d_Seccion2.get('d_s2_servicio_postal') as UntypedFormControl }
   get d_s2_fecha_inicio(): UntypedFormControl { return this.d_Seccion2.get('d_s2_fecha_inicio') as UntypedFormControl }
   get d_s2_nro_rd(): UntypedFormControl { return this.d_Seccion2.get('d_s2_nro_rd') as UntypedFormControl }
   get d_s2_fecha_ultima_autoriza(): UntypedFormControl { return this.d_Seccion2.get('d_s2_fecha_ultima_autoriza') as UntypedFormControl }

   get d_s2_prestado_servicio_transporte(): UntypedFormControl { return this.d_Seccion2.get('d_s2_prestado_servicio_transporte') as UntypedFormControl }
   get d_s2_nro_reso_autoriza(): UntypedFormControl { return this.d_Seccion2.get('d_s2_nro_reso_autoriza') as UntypedFormControl }
   get d_s2_fecha_resolucion_ultima_autoriza(): UntypedFormControl { return this.d_Seccion2.get('d_s2_fecha_resolucion_ultima_autoriza') as UntypedFormControl }

   get d_s2_entidad_emite_carta_fianza(): UntypedFormControl { return this.d_Seccion2.get('d_s2_entidad_emite_carta_fianza') as UntypedFormControl }
   get d_s2_monto_carta_fianza(): UntypedFormControl { return this.d_Seccion2.get('d_s2_monto_carta_fianza') as UntypedFormControl }
   get d_s2_fecha_vence_carta_fianza(): UntypedFormControl { return this.d_Seccion2.get('d_s2_fecha_vence_carta_fianza') as UntypedFormControl }


   get a_Seccion5FG(): UntypedFormGroup { return this.anexoFG.get('a_Seccion5FG') as UntypedFormGroup; }
   get a_s5_declaracion1FC(): UntypedFormControl { return this.a_Seccion5FG.get('a_s5_declaracion1FC') as UntypedFormControl; }

   async cargarDatos(): Promise<void> {
      this.funcionesMtcService.mostrarCargando();

      if (this.dataInput.movId > 0) {
         // RECUPERAMOS LOS DATOS
         try {
            const dataAnexo = await this.anexoTramiteService.get<Anexo003_A27Response>(this.dataInput.tramiteReqId).toPromise();
            console.log(JSON.parse(dataAnexo.metaData));
            const {
               seccion1,
               seccion2,
               seccion3,
               seccion5
            } = JSON.parse(dataAnexo.metaData) as MetaData;

            this.idAnexo = dataAnexo.anexoId;


            //seccion 1

            this.d_s1_razon_social.setValue(seccion1.razonSocial);
            this.d_s1_direccion.setValue(seccion1.direccion);
            //seccion 2
            this.d_s2_desc_ambito_geo.setValue(seccion2.descAmbitoGeografico);
            this.d_s2_desc_tipo_servicio_prestar.setValue(seccion2.descTipoServicio);
            this.d_s2_desc_infraesctructura.setValue(seccion2.descInfraestructura);
            this.d_s2_servicio_postal.setValue(seccion2.prestadoServicioPostal);
            this.d_s2_fecha_inicio.setValue(seccion2.fechaInicio);
            this.d_s2_nro_rd.setValue(seccion2.nroRd);
            this.d_s2_fecha_ultima_autoriza.setValue(seccion2.fechaUltimaAutoriza);
            this.d_s2_prestado_servicio_transporte.setValue(seccion2.prestadoServicioTransporte);

            this.d_s2_nro_reso_autoriza.setValue(seccion2.nroResoAutoriza);
            this.d_s2_fecha_resolucion_ultima_autoriza.setValue(seccion2.fechaResolucionUltimaAutoriza);
            this.d_s2_entidad_emite_carta_fianza.setValue(seccion2.entidadEmiteCartaFianza);
            this.d_s2_monto_carta_fianza.setValue(seccion2.montoCartaFianza);
            this.d_s2_fecha_vence_carta_fianza.setValue(seccion2.fechaVenceCartaFianza);
            //seccion 3

            if (this.a_Seccion5FG.enabled) {
               const { declaracion_1 } = seccion5;

               this.a_s5_declaracion1FC.setValue(declaracion_1);
            }
         }
         catch (e) {
            console.error(e);
            this.errorAlCargarData = true;
            this.funcionesMtcService
               .ocultarCargando()
               .mensajeError('Problemas para recuperar los datos guardados del anexo');
         }
      } else {  // SI ES NUEVO

         await this.cargarDatosSolicitante();

         await this.ubigeoEstFija1Component?.setUbigeoByText(
            '',
            '',
            ''
         );
      }
      this.funcionesMtcService.ocultarCargando();
   }

   async vistaPreviaAdjunto(fileAdjuntoFC: UntypedFormControl, pathNameAdjuntoFC: UntypedFormControl): Promise<void> {
      const pathNameAdjunto = pathNameAdjuntoFC.value;
      if (pathNameAdjunto) {
         this.funcionesMtcService.mostrarCargando();
         try {
            const file: Blob = await this.visorPdfArchivosService.get(pathNameAdjunto).toPromise();
            this.funcionesMtcService.ocultarCargando();
            this.visualizarPdf(file as File);
         }
         catch (e) {
            this.funcionesMtcService
               .ocultarCargando()
               .mensajeError('Problemas para descargar Pdf');
         }
      } else {
         this.visualizarPdf(fileAdjuntoFC.value);
      }
   }

   visualizarPdf(file: File): void {
      const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
      const urlPdf = URL.createObjectURL(file);
      modalRef.componentInstance.pdfUrl = urlPdf;
      modalRef.componentInstance.titleModal = 'Vista Previa Documento Adjunto';
   }

   eliminarAdjunto(fileAdjuntoFC: UntypedFormControl, pathNameAdjuntoFC: UntypedFormControl): void {
      this.funcionesMtcService
         .mensajeConfirmar('¿Está seguro de eliminar el archivo adjunto?')
         .then(() => {
            fileAdjuntoFC.setValue(null);
            pathNameAdjuntoFC.setValue(null);
         });
   }

   async descargarPdf(): Promise<void> {
      if (this.idAnexo === 0) {
         this.funcionesMtcService.mensajeError('Debe guardar previamente los datos ingresados');
         return;
      }
      this.funcionesMtcService.mostrarCargando();
      try {
         const file: Blob = await this.visorPdfArchivosService.get(this.uriArchivo).toPromise();
         this.funcionesMtcService.ocultarCargando();

         const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
         const urlPdf = URL.createObjectURL(file);
         modalRef.componentInstance.pdfUrl = urlPdf;
         modalRef.componentInstance.titleModal = 'Vista Previa - Anexo 003-C/27';
      }
      catch (e) {
         console.error(e);
         this.funcionesMtcService
            .ocultarCargando()
            .mensajeError('Problemas para descargar el archivo PDF');
      }
   }

   async cargarDatosSolicitante(): Promise<void> {
      this.funcionesMtcService.mostrarCargando();
      // Obtenemos los datos del Solicitante
      if (this.tipoSolicitante === 'PJ') {
         try {
            const response = await this.sunatService.getDatosPrincipales(this.nroRuc).toPromise();
            console.log('SUNAT: ', response);

            this.razonSocial = response.razonSocial?.trim() ?? '';
            this.domicilioLegal = response.domicilioLegal?.trim() ?? '';

            this.d_s1_razon_social.setValue(this.razonSocial);
            this.d_s1_direccion.setValue(this.domicilioLegal);


            // Cargamos el Representante Legal
            for (const repLegal of response.representanteLegal) {
               if (repLegal.nroDocumento === this.nroDocumento) {
                  if (repLegal.tipoDocumento === '1') {  // DNI
                     this.tipoDocumento = '01';
                     this.nroDocumento = repLegal.nroDocumento;
                  }
                  break;
               }
            }
         }
         catch (e) {
            console.error(e);
            this.funcionesMtcService
               .ocultarCargando()
               .mensajeError(CONSTANTES.MensajeError.Sunat);
         }
      }
      if (this.tipoDocumento === '01') {// DNI
         try {
            const respuesta = await this.reniecService.getDni(this.nroDocumento).toPromise();
            console.log(respuesta);

            if (respuesta.reniecConsultDniResponse.listaConsulta.coResultado !== '0000') {
               return this.funcionesMtcService.mensajeError('Número de documento no registrado en RENIEC');
            }

            const { prenombres, apPrimer, apSegundo } = respuesta.reniecConsultDniResponse.listaConsulta.datosPersona;
            this.nombreCompleto = `${prenombres} ${apPrimer} ${apSegundo}`;
         }
         catch (e) {
            console.error(e);
            this.funcionesMtcService
               .ocultarCargando()
               .mensajeError(CONSTANTES.MensajeError.Reniec);
         }
      } else if (this.tipoDocumento === '04') {// CARNÉ DE EXTRANJERÍA
         try {
            const { CarnetExtranjeria } = await this.extranjeriaService.getCE(this.nroDocumento).toPromise();
            console.log(CarnetExtranjeria);
            const { numRespuesta, nombres, primerApellido, segundoApellido } = CarnetExtranjeria;

            if (numRespuesta !== '0000') {
               return this.funcionesMtcService.mensajeError('Número de documento no registrado en Migraciones');
            }

            this.nombreCompleto = `${nombres} ${primerApellido} ${segundoApellido}`;
         }
         catch (e) {
            console.error(e);
            this.funcionesMtcService
               .ocultarCargando()
               .mensajeError(CONSTANTES.MensajeError.Migraciones);
         }
      }
      this.funcionesMtcService.ocultarCargando();
   }

   onChangeServicioPostal(){
      if(this.d_s2_servicio_postal.value=="si"){

         this.d_s2_fecha_inicio.enable();
         this.d_s2_fecha_inicio.setValidators([Validators.required]);
         this.d_s2_fecha_inicio.updateValueAndValidity();

         this.d_s2_nro_rd.enable();
         this.d_s2_nro_rd.setValidators([Validators.required]);;
         this.d_s2_nro_rd.updateValueAndValidity();

         this.d_s2_fecha_ultima_autoriza.enable();
         this.d_s2_fecha_ultima_autoriza.setValidators([Validators.required]);;
         this.d_s2_fecha_ultima_autoriza.updateValueAndValidity();

         this.habilitarCartaFianza();

      }else{
         this.d_s2_fecha_inicio.disable();
         this.d_s2_fecha_inicio.clearValidators();
         this.d_s2_fecha_inicio.updateValueAndValidity();

         this.d_s2_nro_rd.disable();
         this.d_s2_nro_rd.clearValidators();
         this.d_s2_nro_rd.updateValueAndValidity();

         this.d_s2_fecha_ultima_autoriza.disable();
         this.d_s2_fecha_ultima_autoriza.clearValidators();
         this.d_s2_fecha_ultima_autoriza.updateValueAndValidity();

         this.d_s2_fecha_inicio.setValue('');
         this.d_s2_nro_rd.setValue('');
         this.d_s2_fecha_ultima_autoriza.setValue('');

         this.habilitarCartaFianza();
      }
   }

   onChangeServicioTransporte(){
      if(this.d_s2_prestado_servicio_transporte.value=="si"){

         this.d_s2_nro_reso_autoriza.enable();
         this.d_s2_nro_reso_autoriza.setValidators([Validators.required]);
         this.d_s2_nro_reso_autoriza.updateValueAndValidity();

         this.d_s2_fecha_resolucion_ultima_autoriza.enable();
         this.d_s2_fecha_resolucion_ultima_autoriza.setValidators([Validators.required]);;
         this.d_s2_fecha_resolucion_ultima_autoriza.updateValueAndValidity();

         this.habilitarCartaFianza();

      }else{
         this.d_s2_nro_reso_autoriza.disable();
         this.d_s2_nro_reso_autoriza.clearValidators();
         this.d_s2_nro_reso_autoriza.updateValueAndValidity();

         this.d_s2_fecha_resolucion_ultima_autoriza.disable();
         this.d_s2_fecha_resolucion_ultima_autoriza.clearValidators();
         this.d_s2_fecha_resolucion_ultima_autoriza.updateValueAndValidity();

         this.d_s2_nro_reso_autoriza.setValue('');
         this.d_s2_fecha_resolucion_ultima_autoriza.setValue('');

         this.habilitarCartaFianza();
      }
   }

   habilitarCartaFianza(){
      if(this.d_s2_servicio_postal.value=="no" && this.d_s2_prestado_servicio_transporte.value=="no"){
         this.d_s2_entidad_emite_carta_fianza.disable();
         this.d_s2_entidad_emite_carta_fianza.setValue('');
         this.d_s2_entidad_emite_carta_fianza.clearValidators();
         this.d_s2_entidad_emite_carta_fianza.updateValueAndValidity();


         this.d_s2_monto_carta_fianza.disable();
         this.d_s2_monto_carta_fianza.setValue('');
         this.d_s2_monto_carta_fianza.clearValidators();
         this.d_s2_monto_carta_fianza.updateValueAndValidity();

         this.d_s2_fecha_vence_carta_fianza.disable();
         this.d_s2_fecha_vence_carta_fianza.setValue('');
         this.d_s2_fecha_vence_carta_fianza.clearValidators();
         this.d_s2_fecha_vence_carta_fianza.updateValueAndValidity();

      }else{

         this.d_s2_entidad_emite_carta_fianza.enable();
         this.d_s2_entidad_emite_carta_fianza.setValidators([Validators.required]);
         this.d_s2_entidad_emite_carta_fianza.updateValueAndValidity();

         this.d_s2_monto_carta_fianza.enable();
         this.d_s2_monto_carta_fianza.setValidators([Validators.required]);
         this.d_s2_monto_carta_fianza.updateValueAndValidity();

         this.d_s2_fecha_vence_carta_fianza.enable();
         this.d_s2_fecha_vence_carta_fianza.setValidators([Validators.required]);
         this.d_s2_fecha_vence_carta_fianza.updateValueAndValidity();

      }
   }

   async guardarAnexo(): Promise<void> {
      if (this.anexoFG.invalid === true) {
         this.funcionesMtcService.mensajeError('Debe ingresar todos los campos obligatorios');
         return;
      }

      const dataGuardar = new Anexo003_A27Request();
      // -------------------------------------
      dataGuardar.id = this.idAnexo;
      dataGuardar.movimientoFormularioId = this.dataInput.tramiteReqRefId;
      dataGuardar.anexoId = 1;
      dataGuardar.codigo = 'A';
      dataGuardar.tramiteReqId = this.dataInput.tramiteReqId;
      // -------------------------------------

      const {
         seccion1,
         seccion2,
         seccion3,

         seccion5
      } = dataGuardar.metaData;

      //console.log(dataGuardar.metaData);
      // -------------------------------------

      //seccion 1

      seccion1.razonSocial = this.d_s1_razon_social.value;
      seccion1.direccion = this.d_s1_direccion.value;
      //seccion 2
      seccion2.descAmbitoGeografico = this.d_s2_desc_ambito_geo.value;
      seccion2.descTipoServicio = this.d_s2_desc_tipo_servicio_prestar.value;
      seccion2.descInfraestructura = this.d_s2_desc_infraesctructura.value;
      seccion2.prestadoServicioPostal = this.d_s2_servicio_postal.value;
      seccion2.fechaInicio = this.d_s2_fecha_inicio.value;
      seccion2.nroRd = this.d_s2_nro_rd.value;
      seccion2.fechaUltimaAutoriza = this.d_s2_fecha_ultima_autoriza.value;
      seccion2.prestadoServicioTransporte = this.d_s2_prestado_servicio_transporte.value;

      seccion2.nroResoAutoriza = this.d_s2_nro_reso_autoriza.value;
      seccion2.fechaResolucionUltimaAutoriza = this.d_s2_fecha_resolucion_ultima_autoriza.value;
      seccion2.entidadEmiteCartaFianza = this.d_s2_entidad_emite_carta_fianza.value;
      seccion2.montoCartaFianza = this.d_s2_monto_carta_fianza.value;
      seccion2.fechaVenceCartaFianza = this.d_s2_fecha_vence_carta_fianza.value;

      //seccion 3
      seccion3.apellidosNombres = this.nombreCompleto;
      console.log(this.tipoDocumento, "dddoc");
      seccion3.tipoDocumento = this.listaTiposDocumentos.filter(item => item.id == this.tipoDocumento)[0].documento;
      seccion3.nroDocumento = this.nroDocumento;


      // -------------------------------------
      // SECCION 5:
      seccion5.declaracion_1 = this.a_s5_declaracion1FC.value ?? false;
      // -------------------------------------

      const dataGuardarFormData = this.funcionesMtcService.jsonToFormData(dataGuardar);

      this.funcionesMtcService.mensajeConfirmar(`¿Está seguro de ${this.idAnexo === 0 ? 'guardar' : 'modificar'} los datos ingresados?`)
         .then(async () => {
            this.funcionesMtcService.mostrarCargando();
            if (this.idAnexo === 0) {
               // GUARDAR:
               try {
                  const data = await this.anexoService.post(dataGuardarFormData).toPromise();
                  this.funcionesMtcService.ocultarCargando();
                  this.idAnexo = data.id;
                  this.uriArchivo = data.uriArchivo;

                  this.graboUsuario = true;
                  this.funcionesMtcService.mensajeOk(`Los datos fueron guardados exitosamente`);
               }
               catch (e) {
                  this.funcionesMtcService.ocultarCargando().mensajeError('Problemas para realizar el guardado de datos');
               }
            } else {
               // MODIFICAR
               try {
                  const data = await this.anexoService.put(dataGuardarFormData).toPromise();
                  this.funcionesMtcService.ocultarCargando();
                  this.idAnexo = data.id;
                  this.uriArchivo = data.uriArchivo;

                  this.graboUsuario = true;
                  this.funcionesMtcService.mensajeOk(`Los datos fueron modificados exitosamente`);
               }
               catch (e) {
                  this.funcionesMtcService.ocultarCargando().mensajeError('Problemas para realizar la modificación de datos');
               }
            }
         });
   }

   formInvalid(control: string): boolean | undefined {
      if (this.anexoFG.get(control))
         return this.anexoFG.get(control)!.invalid;
   }


}
