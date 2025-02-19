/**
 * Formulario 001-A/17.03
 * @author Mackenneddy Melendez Coral
 * @version 1.0 26.05.2022
 */

import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { AbstractControlOptions, UntypedFormBuilder, UntypedFormGroup, Validators, UntypedFormControl, UntypedFormArray, Form } from '@angular/forms';
import { NgbAccordionDirective, NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FuncionesMtcService } from '../../../../../core/services/funciones-mtc.service';
import { AnexoTramiteService } from '../../../../../core/services/tramite/anexo-tramite.service';
import { VisorPdfArchivosService } from '../../../../../core/services/tramite/visor-pdf-archivos.service';
import { VistaPdfComponent } from '../../../../../shared/components/vista-pdf/vista-pdf.component';
import { exactLengthValidator, noWhitespaceValidator } from '../../../../../helpers/validator';
import { SeguridadService } from '../../../../../core/services/seguridad.service';
import { Anexo001_A17_03Response } from '../../../domain/anexo001_A17_03/anexo001_A17_03Response';
import { Anexo001_A17_03Request, MetaData, Postulante } from '../../../domain/anexo001_A17_03/anexo001_A17_03Request';
import { UbigeoComponent } from '../../../../../shared/components/forms/ubigeo/ubigeo.component';
import { ExtranjeriaService } from '../../../../../core/services/servicios/extranjeria.service';
import { ReniecService } from '../../../../../core/services/servicios/reniec.service';
import { SunatService } from '../../../../../core/services/servicios/sunat.service';
import { CONSTANTES } from '../../../../../enums/constants';
import { Anexo001_A17_03Service } from '../../../application/usecases';
import { TipoDocumentoModel } from '../../../../../core/models/TipoDocumentoModel';
import { FormularioTramiteService } from 'src/app/core/services/tramite/formulario-tramite.service';


@Component({
   selector: 'app-anexo001_A17_03',
   templateUrl: './anexo001_A17_03.component.html',
   styleUrls: ['./anexo001_A17_03.component.css']
})

// tslint:disable-next-line: class-name
export class Anexo001_A17_03_Component implements OnInit, AfterViewInit {
   @Input() public dataInput: any;
   @ViewChild('acc') acc: NgbAccordionDirective;

   @ViewChild('ubigeoCmpEstFija1') ubigeoEstFija1Component: UbigeoComponent;
   @ViewChild('ubigeoCmpEstFija2') ubigeoEstFija2Component: UbigeoComponent;

   txtTitulo = 'ANEXO 001-A/17.03 RELACIÓN DE POSTULANTES PARA EL OTORGAMIENTO O RENOVACIÓN DE LA LICENCIA PARA CONDUCIR VEHÍCULOS FERROVIARIOS / OTORGAMIENTO DE LA LC VEHÍCULOS FERROVIARIOS DE CATEGORIA ESPECIAL';

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


   listaTipoVehiculos: any = [
      { id: 1, descripcion: 'Unidad Múltiple Eléctrica', value:'A' },
      { id: 2, descripcion: 'Unidad Múltiple Diésel', value:'B' },
      { id: 3, descripcion: 'Locomotora', value:'C' },
      { id: 4, descripcion: 'Coche Tractivo con Cabina de Comando', value:'D' },
      { id: 5, descripcion: 'Equipo Auxiliar de Mantenimiento de Vía', value:'E' }
   ];

   listaRestricciones: any = [
      { id: 1, descripcion: 'Ninguna', value:'N' },
      { id: 2, descripcion: 'Lentes', value:'L' },
      { id: 4, descripcion: 'Otros (Audífonos)', value:'T' },
   ];

   // CODIGO Y NOMBRE DEL PROCEDIMIENTO:
   codigoProcedimientoTupa: string;
   descProcedimientoTupa: string;

   tipoDocumento = '';
   nroDocumento = '';
   nroRuc = '';
   nombreCompleto = '';
   razonSocial = '';

   tipoDocumentoSolicitante:string = "";
   nombreTipoDocumentoSolicitante:string = "";
   numeroDocumentoSolicitante: string = "";
   nombresApellidosSolicitante: string = "";

   indexEditPostulante = -1;

   defaultTipoTramite = '';

   constructor(
      private fb: UntypedFormBuilder,
      private funcionesMtcService: FuncionesMtcService,
      private modalService: NgbModal,
      private anexoService: Anexo001_A17_03Service,
      private seguridadService: SeguridadService,
      private anexoTramiteService: AnexoTramiteService,
      private visorPdfArchivosService: VisorPdfArchivosService,
      public activeModal: NgbActiveModal,
      private reniecService: ReniecService,
      private extranjeriaService: ExtranjeriaService,
      private sunatService: SunatService,
      private formularioTramiteService: FormularioTramiteService,
   ) { }

   ngOnInit(): void {
      // ==================================================================================
      // RECUPERAMOS NOMBRE DEL TUPA:
      const tramiteSelected = JSON.parse(localStorage.getItem('tramite-selected'));
      this.codigoProcedimientoTupa = tramiteSelected.codigo;
      this.descProcedimientoTupa = tramiteSelected.nombre;

      if (this.codigoProcedimientoTupa == "DCV-001") {
         this.defaultTipoTramite = "Otorgamiento";
      } else if (this.codigoProcedimientoTupa == "DCV-002") {
         this.defaultTipoTramite = "Renovación";
      }
      else if (this.codigoProcedimientoTupa == "DCV-003") {
         this.defaultTipoTramite = "Especial";
      }
      // ==================================================================================

      this.uriArchivo = this.dataInput.rutaDocumento;

      this.anexoFG = this.fb.group({

         a_Seccion3aFG: this.fb.group({
            a_s3a_Postulante: this.fb.array([], [Validators.required]),
         }),

         a_Seccion5FG: this.fb.group({
            a_s5_declaracion1FC: [false, [Validators.requiredTrue]],
         })

      });

      this.postulanteFG = this.fb.group({
         pt_tipoDocumento: ['', [Validators.required]],
         pt_tipoDocumentoAbrev: [''],
         pt_numeroDocumento: ['', [Validators.required, exactLengthValidator([8, 9])]],
         pt_nombre: [{ value: '', disabled: true }, [Validators.required, Validators.maxLength(50)]],
         pt_apePaterno: [{ value: '', disabled: true }, [Validators.required, Validators.maxLength(50)]],
         pt_apeMaterno: [{ value: '', disabled: true }, [Validators.maxLength(50)]],
         pt_tipoVehiculo: ['', [Validators.required]],
         pt_restricciones: ['', [Validators.required]],
         pt_lcFerroviaria: ['', [Validators.required, Validators.maxLength(20)]],
         pt_viaFerrea: ['', [Validators.required, Validators.maxLength(100)]],
         pt_tramite: [''],
         pt_codTipoVehiculo:[''],
         pt_codRestriccion:['']
      });

   }

   async ngAfterViewInit(): Promise<void> {
      this.nroRuc = this.seguridadService.getCompanyCode();
      this.nombreCompleto = this.seguridadService.getUserName();          // nombre de usuario login
      this.nroDocumento = this.seguridadService.getNumDoc();      // nro de documento usuario login

      switch (this.seguridadService.getNameId()) {
         case '00001':
            this.tipoSolicitante = 'PN'; // persona natural
            this.tipoDocumento = '01';  // 01 DNI  03 CI  04 CE

            break;
         case '00002':
            this.tipoSolicitante = 'PJ'; // persona juridica
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

   // GET FORM anexoFG
   get a_Seccion3aFG(): UntypedFormGroup { return this.anexoFG.get('a_Seccion3aFG') as UntypedFormGroup; }
   get a_s3a_Postulante(): UntypedFormArray { return this.a_Seccion3aFG.get('a_s3a_Postulante') as UntypedFormArray; }
   get a_Seccion5FG(): UntypedFormGroup { return this.anexoFG.get('a_Seccion5FG') as UntypedFormGroup; }
   get a_s5_declaracion1FC(): UntypedFormControl { return this.a_Seccion5FG.get('a_s5_declaracion1FC') as UntypedFormControl; }
   get pt_tipoDocumento(): UntypedFormControl { return this.postulanteFG.get('pt_tipoDocumento') as UntypedFormControl; }
   get pt_tipoDocumentoAbrev(): UntypedFormControl { return this.postulanteFG.get('pt_tipoDocumentoAbrev') as UntypedFormControl; }
   get pt_numeroDocumento(): UntypedFormControl { return this.postulanteFG.get('pt_numeroDocumento') as UntypedFormControl; }
   get pt_nombre(): UntypedFormControl { return this.postulanteFG.get('pt_nombre') as UntypedFormControl; }
   get pt_apePaterno(): UntypedFormControl { return this.postulanteFG.get('pt_apePaterno') as UntypedFormControl; }
   get pt_apeMaterno(): UntypedFormControl { return this.postulanteFG.get('pt_apeMaterno') as UntypedFormControl; }
   get pt_tipoVehiculo(): UntypedFormControl { return this.postulanteFG.get('pt_tipoVehiculo') as UntypedFormControl; }
   get pt_restricciones(): UntypedFormControl { return this.postulanteFG.get('pt_restricciones') as UntypedFormControl; }
   get pt_lcFerroviaria(): UntypedFormControl { return this.postulanteFG.get('pt_lcFerroviaria') as UntypedFormControl; }
   get pt_viaFerrea(): UntypedFormControl { return this.postulanteFG.get('pt_viaFerrea') as UntypedFormControl; }
   get pt_tramite(): UntypedFormControl { return this.postulanteFG.get('pt_tramite') as UntypedFormControl; }
   get pt_codTipoVehiculo(): UntypedFormControl { return this.postulanteFG.get('pt_codTipoVehiculo') as UntypedFormControl; }
   get pt_codRestriccion(): UntypedFormControl { return this.postulanteFG.get('pt_codRestriccion') as UntypedFormControl; }

   a_s3a_pt_Nombres(index: number): UntypedFormControl { return this.a_s3a_Postulante.get([index, 'pt_Nombres']) as UntypedFormControl; }
   a_s3a_pt_ApePaterno(index: number): UntypedFormControl { return this.a_s3a_Postulante.get([index, 'pt_ApePaterno']) as UntypedFormControl; }
   a_s3a_pt_ApeMaterno(index: number): UntypedFormControl { return this.a_s3a_Postulante.get([index, 'pt_ApeMaterno']) as UntypedFormControl; }
   a_s3a_pt_TipoDocumento(index: number): UntypedFormControl { return this.a_s3a_Postulante.get([index, 'pt_TipoDocumento']) as UntypedFormControl; }
   a_s3a_pt_TipoDocumentoAbrev(index: number): UntypedFormControl { return this.a_s3a_Postulante.get([index, 'pt_TipoDocumentoAbrev']) as UntypedFormControl; }
   a_s3a_pt_NroDocumento(index: number): UntypedFormControl { return this.a_s3a_Postulante.get([index, 'pt_NroDocumento']) as UntypedFormControl; }
   a_s3a_pt_TipoVehiculo(index: number): UntypedFormControl { return this.a_s3a_Postulante.get([index, 'pt_TipoVehiculo']) as UntypedFormControl; }
   a_s3a_pt_Restricciones(index: number): UntypedFormControl { return this.a_s3a_Postulante.get([index, 'pt_Restricciones']) as UntypedFormControl; }
   a_s3a_pt_LcFerroviaria(index: number): UntypedFormControl { return this.a_s3a_Postulante.get([index, 'pt_LcFerroviaria']) as UntypedFormControl; }
   a_s3a_pt_ViaFerrea(index: number): UntypedFormControl { return this.a_s3a_Postulante.get([index, 'pt_ViaFerrea']) as UntypedFormControl; }
   a_s3a_pt_Tramite(index: number): UntypedFormControl { return this.a_s3a_Postulante.get([index, 'pt_Tramite']) as UntypedFormControl; }
   a_s3a_pt_CodTipoVehiculo(index: number): UntypedFormControl { return this.a_s3a_Postulante.get([index, 'pt_CodTipoVehiculo']) as UntypedFormControl; }
   a_s3a_pt_CodRestriccion(index: number): UntypedFormControl { return this.a_s3a_Postulante.get([index, 'pt_CodRestriccion']) as UntypedFormControl; }

   async cargarDatos(): Promise<void> {
      this.funcionesMtcService.mostrarCargando();

      if (this.dataInput.movId > 0) {
         // RECUPERAMOS LOS DATOS
         try {
            const dataAnexo = await this.anexoTramiteService.get<Anexo001_A17_03Response>(this.dataInput.tramiteReqId).toPromise();
            console.log(JSON.parse(dataAnexo.metaData), "Secciones");
            const {
               seccion3a,
               seccion5,
               seccion6,
            } = JSON.parse(dataAnexo.metaData) as MetaData;

            this.idAnexo = dataAnexo.anexoId;

            if (this.a_Seccion3aFG.enabled) {
               const { listaPostulante } = seccion3a;
               for (const postulante of listaPostulante) {
                  this.addEditPostulanteFG(postulante);
               }
            }

            if (this.a_Seccion5FG.enabled) {
               const { declaracion1 } = seccion5;
               this.a_s5_declaracion1FC.setValue(declaracion1);
            }

            this.nroDocumento = seccion6.nroDocumento;
            this.nombreCompleto = seccion6.nombreCompleto;
            this.razonSocial = seccion6.razonSocial;

            this.tipoDocumentoSolicitante = seccion6.tipoDocumentoSolicitante;
            this.nombreTipoDocumentoSolicitante = seccion6.nombreTipoDocumentoSolicitante;
            this.numeroDocumentoSolicitante = seccion6.numeroDocumentoSolicitante;
            this.nombresApellidosSolicitante = seccion6.nombresApellidosSolicitante;
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
      }
      this.pt_tramite.setValue(this.defaultTipoTramite);
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
         modalRef.componentInstance.titleModal = 'Vista Previa - Anexo 001-A/17.03';
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
      try {
         const dataForm: any = await this.formularioTramiteService.get(this.dataInput.tramiteReqRefId).toPromise();
         this.funcionesMtcService.ocultarCargando();

         const metaDataForm: any = JSON.parse(dataForm.metaData);
         const seccion6 = metaDataForm.seccion6;

         console.log("Datos Formulario");
         console.log(metaDataForm);

         this.tipoDocumentoSolicitante = seccion6.tipoDocumentoSolicitante;
         this.nombreTipoDocumentoSolicitante = seccion6.documento;
         this.numeroDocumentoSolicitante = seccion6.numeroDocumentoSolicitante;
         this.nombresApellidosSolicitante = seccion6.nombreSolicitante;

      } catch (error) {
         console.error(error);
         this.funcionesMtcService
            .ocultarCargando()
            .mensajeError('Debe ingresar primero el Formulario del primer requisito.');
      }
   }

   async guardarAnexo(): Promise<void> {
      if (this.anexoFG.invalid === true) {
         this.funcionesMtcService.mensajeError('Debe ingresar todos los campos obligatorios');
         return;
      }

      const dataGuardar = new Anexo001_A17_03Request();
      // -------------------------------------
      dataGuardar.id = this.idAnexo;
      dataGuardar.movimientoFormularioId = this.dataInput.tramiteReqRefId;
      dataGuardar.anexoId = 1;
      dataGuardar.codigo = 'A';
      dataGuardar.tramiteReqId = this.dataInput.tramiteReqId;
      // -------------------------------------

      const {
         seccion3a,
         seccion5,
         seccion6
      } = dataGuardar.metaData;

      // -------------------------------------
      // SECCION 3a:
      const { listaPostulante } = seccion3a;

      for (const controlFG of this.a_s3a_Postulante.controls) {
         const postulante: Postulante = {
            nombres: controlFG.get('pt_Nombres').value,
            apePaterno: controlFG.get('pt_ApePaterno').value,
            apeMaterno: controlFG.get('pt_ApeMaterno').value,
            tipoDocumento: controlFG.get('pt_TipoDocumento').value,
            tipoDocumentoAbrev: controlFG.get('pt_TipoDocumentoAbrev').value,
            nroDocumento: controlFG.get('pt_NroDocumento').value,
            tipoVehiculo: controlFG.get('pt_TipoVehiculo').value,
            restricciones: controlFG.get('pt_Restricciones').value,
            lcFerroviaria: controlFG.get('pt_LcFerroviaria').value,
            viaFerrea: controlFG.get('pt_ViaFerrea').value,
            tramite: controlFG.get('pt_Tramite').value,
            codTipoVehiculo: controlFG.get('pt_CodTipoVehiculo').value,
            codRestriccion: controlFG.get('pt_CodRestriccion').value,
         };
         listaPostulante.push(postulante);
      }

      dataGuardar.metaData.seccion3a.codigoProcedimiento=this.codigoProcedimientoTupa;
      // -------------------------------------
      // SECCION 5:
      seccion5.declaracion1 = this.a_s5_declaracion1FC.value ?? false;
      // -------------------------------------
      // SECCION 6:
      seccion6.nroDocumento = this.nroDocumento;
      seccion6.nombreCompleto = this.nombreCompleto;
      seccion6.razonSocial = this.razonSocial;
      seccion6.tipoDocumentoSolicitante = this.tipoDocumentoSolicitante; 
      seccion6.nombreTipoDocumentoSolicitante = this.nombreTipoDocumentoSolicitante;
      seccion6.numeroDocumentoSolicitante = this.numeroDocumentoSolicitante;
      seccion6.nombresApellidosSolicitante = this.nombresApellidosSolicitante;
      // -------------------------------------
      console.log(dataGuardar);
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


   //Buscar documento postulante
   async buscarNumeroDocumentoPostulante(): Promise<void> {
      const tipoDocumento: string = this.pt_tipoDocumento.value.trim();
      const numeroDocumento: string = this.pt_numeroDocumento.value.trim();
      console.log("TipoDocumento: " + tipoDocumento);
      console.log("Numero Documento: " + numeroDocumento);

      if (tipoDocumento.length === 0 || numeroDocumento.length === 0) {
         this.funcionesMtcService.mensajeError('Debe ingresar Tipo de Documento y/o Número de Documento');
         return;
      }
      if (tipoDocumento === '01' && numeroDocumento.length !== 8) {
         this.funcionesMtcService.mensajeError('DNI debe tener 8 dígitos');
         return;
      }

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

            this.addPostulanteFG(tipoDocumento,
               datosPersona.prenombres,
               datosPersona.apPrimer,
               datosPersona.apSegundo,);

         }
         catch (e) {
            console.error(e);

            this.funcionesMtcService.ocultarCargando().mensajeError('Error al consultar al servicio');
            this.pt_nombre.enable();
            this.pt_apePaterno.enable();
            this.pt_apeMaterno.enable();
         }
      } else if (tipoDocumento === '04') {// CARNÉ DE EXTRANJERÍA
         try {
            const respuesta = await this.extranjeriaService.getCE(numeroDocumento).toPromise();

            this.funcionesMtcService.ocultarCargando();

            if (respuesta.CarnetExtranjeria.numRespuesta !== '0000') {
               return this.funcionesMtcService.mensajeError('Número de documento no registrado en Migraciones');
            }

            this.addPostulanteFG(tipoDocumento,
               respuesta.CarnetExtranjeria.nombres,
               respuesta.CarnetExtranjeria.primerApellido,
               respuesta.CarnetExtranjeria.segundoApellido,);
         }
         catch (e) {
            console.error(e);

            this.funcionesMtcService.ocultarCargando().mensajeError('Error al consultar al servicio');
            this.pt_nombre.enable();
            this.pt_apePaterno.enable();
            this.pt_apeMaterno.enable();
         }
      }

   }

   //nuevo agregado
   savePostulanteFG() {

      const postulante: any = {
         nombres: this.pt_nombre.value,
         apePaterno: this.pt_apePaterno.value,
         apeMaterno: this.pt_apeMaterno.value,
         tipoDocumento: this.pt_tipoDocumento.value,
         tipoDocumentoAbrev: (this.pt_tipoDocumento.value=="01" ? "DNI" : (this.pt_tipoDocumento.value=="04" ? "CE" : "" )),
         nroDocumento: this.pt_numeroDocumento.value,
         tipoVehiculo: this.listaTipoVehiculos.filter(item=> item.value == this.pt_tipoVehiculo.value)[0].descripcion,
         restricciones: this.listaRestricciones.filter(item=> item.value == this.pt_restricciones.value)[0].descripcion,
         lcFerroviaria: this.pt_lcFerroviaria.value,
         viaFerrea: this.pt_viaFerrea.value,
         tramite: this.pt_tramite.value,
         codTipoVehiculo: this.pt_tipoVehiculo.value,
         codRestriccion: this.pt_restricciones.value
      };

      const dataArrayLista = this.a_s3a_Postulante.value;
      console.log(dataArrayLista, this.indexEditPostulante);
      let lentExiste = [];
      if (this.indexEditPostulante === -1) {
         //cuando es nuevo
         console.log("emtramdp");
         lentExiste = dataArrayLista.filter(item => item.pt_NroDocumento === this.pt_numeroDocumento.value && item.pt_TipoVehiculo === this.pt_tipoVehiculo.value);

      } else {
         //cuando edita 
         const tempList = dataArrayLista.slice();
         let tempList2 = tempList.splice(this.indexEditPostulante, 1);
         lentExiste = tempList.filter(item => item.pt_NroDocumento === this.pt_numeroDocumento.value && item.pt_TipoVehiculo === this.pt_tipoVehiculo.value);
      }

      console.log(lentExiste, "val-");
      if (lentExiste.length > 0) {

         this.funcionesMtcService.mensajeError('El postulante ya fue agregado')
            .then(() => {
               this.indexEditPostulante = -1;
               this.postulanteFG.reset();

               this.pt_tipoDocumento.setValue('');
               this.pt_tipoVehiculo.setValue('');
               this.pt_restricciones.setValue('');

               this.pt_nombre.disable({ emitEvent: false });
               this.pt_apePaterno.disable({ emitEvent: false });
               this.pt_apeMaterno.disable({ emitEvent: false });
            });
         return;

      } else {
         this.funcionesMtcService.mensajeConfirmar(`¿Desea ${this.indexEditPostulante === -1 ? 'guardar' : 'modificar'} la información del postulante?`)
            .then(() => {
               this.addEditPostulanteFG(postulante, this.indexEditPostulante);
               this.indexEditPostulante = -1;
               this.postulanteFG.reset();

               this.pt_tipoDocumento.setValue('');
               this.pt_tipoVehiculo.setValue('');
               this.pt_restricciones.setValue('');

               this.pt_nombre.disable({ emitEvent: false });
               this.pt_apePaterno.disable({ emitEvent: false });
               this.pt_apeMaterno.disable({ emitEvent: false });
            });
         return;
      }
   }

   async addPostulanteFG(
      tipoDocumento: string,
      nombres: string,
      apPaterno: string,
      apMaterno: string,): Promise<void> {

      this.funcionesMtcService
         .mensajeConfirmar(`Los datos ingresados fueron validados por ${tipoDocumento === '01' ? 'RENIEC' : 'MIGRACIONES'} corresponden a la persona ${nombres} ${apPaterno} ${apMaterno}. ¿Está seguro de agregarlo?`)
         .then(async () => {

            this.pt_nombre.setValue(nombres);
            this.pt_apePaterno.setValue(apPaterno);
            this.pt_apeMaterno.setValue(apMaterno);

            this.pt_nombre.disable({ emitEvent: false });
            this.pt_apePaterno.disable({ emitEvent: false });
            this.pt_apeMaterno.disable({ emitEvent: false });

         });
   }


   private addEditPostulanteFG(postulante: any, index: number = -1): void {
      const { nombres, apePaterno, apeMaterno, tipoDocumento, tipoDocumentoAbrev, nroDocumento, tipoVehiculo, restricciones, lcFerroviaria, viaFerrea, tramite, codTipoVehiculo, codRestriccion } = postulante;

      const newPostulanteFG = this.fb.group({
         pt_Nombres: [nombres, [Validators.required, noWhitespaceValidator(), Validators.maxLength(30)]],
         pt_ApePaterno: [apePaterno, [Validators.required, noWhitespaceValidator(), Validators.maxLength(30)]],
         pt_ApeMaterno: [apeMaterno, [Validators.required, noWhitespaceValidator(), Validators.maxLength(30)]],
         pt_TipoDocumento: [tipoDocumento, [Validators.required, noWhitespaceValidator(), Validators.maxLength(30)]],
         pt_TipoDocumentoAbrev: [tipoDocumentoAbrev, [Validators.required, noWhitespaceValidator(), Validators.maxLength(30)]],
         pt_NroDocumento: [nroDocumento, [Validators.required, noWhitespaceValidator(), Validators.maxLength(30)]],
         pt_TipoVehiculo: [tipoVehiculo, [Validators.required, noWhitespaceValidator(), Validators.maxLength(100)]],
         pt_Restricciones: [restricciones, [Validators.required, noWhitespaceValidator(), Validators.maxLength(30)]],
         pt_LcFerroviaria: [lcFerroviaria, [Validators.required, noWhitespaceValidator(), Validators.maxLength(30)]],
         pt_ViaFerrea: [viaFerrea, [Validators.required, noWhitespaceValidator(), Validators.maxLength(30)]],
         pt_Tramite: [this.defaultTipoTramite],
         pt_CodTipoVehiculo:[codTipoVehiculo],
         pt_CodRestriccion:[codRestriccion]
      });

      if (index === -1) {
         this.a_s3a_Postulante.push(newPostulanteFG);
      }
      else {
         this.a_s3a_Postulante.setControl(index, newPostulanteFG);
      }
   }

   nosavePostulante(): void {
      this.indexEditPostulante = -1;
      this.postulanteFG.reset();
   }

   editPostulante(index: number): void {
      console.log(index, "editando tr");
      this.indexEditPostulante = index;

      const nombres = this.a_s3a_pt_Nombres(index).value;
      const apePaterno = this.a_s3a_pt_ApePaterno(index).value;
      const apeMaterno = this.a_s3a_pt_ApeMaterno(index).value;
      const tipoDoc = this.a_s3a_pt_TipoDocumento(index).value;
      const tipoDocAbrev = this.a_s3a_pt_TipoDocumentoAbrev(index).value;
      const nroDoc = this.a_s3a_pt_NroDocumento(index).value;
      const tipoVehiculo = this.a_s3a_pt_TipoVehiculo(index).value;
      const restricciones = this.a_s3a_pt_Restricciones(index).value;
      const lcFerroviaria = this.a_s3a_pt_LcFerroviaria(index).value;
      const viaFerrea = this.a_s3a_pt_ViaFerrea(index).value;
      const tramite = this.a_s3a_pt_Tramite(index).value;
      const codTipoVehiculo = this.a_s3a_pt_CodTipoVehiculo(index).value;
      const codRestriccion = this.a_s3a_pt_CodRestriccion(index).value;

      this.pt_nombre.setValue(nombres);
      this.pt_apePaterno.setValue(apePaterno);
      this.pt_apeMaterno.setValue(apeMaterno);
      this.pt_tipoDocumento.setValue(tipoDoc);
      this.pt_tipoDocumentoAbrev.setValue(tipoDocAbrev);
      this.pt_numeroDocumento.setValue(nroDoc);
      this.pt_tipoVehiculo.setValue(codTipoVehiculo);
      this.pt_restricciones.setValue(codRestriccion);
      this.pt_lcFerroviaria.setValue(lcFerroviaria);
      this.pt_viaFerrea.setValue(viaFerrea);
      this.pt_tramite.setValue(tramite);
      this.pt_codTipoVehiculo.setValue(codTipoVehiculo);
      this.pt_codRestriccion.setValue(codRestriccion);
   }

   removePostulante(index: number): void {
      this.funcionesMtcService.mensajeConfirmar('¿Está seguro de eliminar la información del postulante seleccionado?')
         .then(
            () => {
               this.a_s3a_Postulante.removeAt(index);
            });
   }
}