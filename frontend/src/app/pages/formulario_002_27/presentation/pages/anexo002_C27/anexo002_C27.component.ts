/**
 * Anexo 002-C/27
 * @author Mackenneddy Melendez Coral
 * @version 1.0 17.09.2022
 */

import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { AbstractControlOptions, UntypedFormBuilder, UntypedFormGroup, Validators, UntypedFormControl, FormArray, Form, AbstractControl } from '@angular/forms';
import { NgbAccordionDirective , NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { AnexoTramiteService } from 'src/app/core/services/tramite/anexo-tramite.service';
import { VisorPdfArchivosService } from 'src/app/core/services/tramite/visor-pdf-archivos.service';
import { VistaPdfComponent } from 'src/app/shared/components/vista-pdf/vista-pdf.component';
import { noWhitespaceValidator, requireCheckboxesToBeCheckedValidator } from 'src/app/helpers/validator';
import { SeguridadService } from '../../../../../core/services/seguridad.service';
//  import { MetaData } from 'src/app/core/models/Anexos/Anexo002_C27/MetaData';
import { UbigeoComponent } from 'src/app/shared/components/forms/ubigeo/ubigeo.component';
import { ExtranjeriaService } from 'src/app/core/services/servicios/extranjeria.service';
import { ReniecService } from 'src/app/core/services/servicios/reniec.service';
import { SunatService } from 'src/app/core/services/servicios/sunat.service';
import { CONSTANTES } from 'src/app/enums/constants';

import { TipoDocumentoModel } from '../../../../../core/models/TipoDocumentoModel';
import { Anexo002_C27Request } from '../../../domain/anexo002_C27/anexo002_C27Request';
import { Anexo002_C27Response } from '../../../domain/anexo002_C27/anexo002_C27Response';
import { Anexo002_C27Service } from '../../../application/usecases';
 //import { DatosContacto, Seccion4 } from '../../../../../core/models/Anexos/Anexo002_C27/Secciones';


 @Component({
   // tslint:disable-next-line: component-selector
   selector: 'app-anexo002_C27',
   templateUrl: './anexo002_C27.component.html',
   styleUrls: ['./anexo002_C27.component.css']
 })

 export class Anexo002_C27Component implements OnInit, AfterViewInit, AfterViewChecked {
   @Input() public dataInput: any;
   @ViewChild('acc') acc: NgbAccordionDirective ;

   @ViewChild('ubigeoCmpEstFija1') ubigeoEstFija1Component: UbigeoComponent;


   txtTitulo = 'ANEXO 002-C/27 ESTACIONES BASE - Descripción de las Estaciones, Ubicación y Equipamiento';

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


   indexEditPostulante = -1;

   defaultTipoTramite = '';

   constructor(
     private fb: UntypedFormBuilder,
     private funcionesMtcService: FuncionesMtcService,
     private modalService: NgbModal,
     private anexoService: Anexo002_C27Service,
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

     if (this.codigoProcedimientoTupa == "DCV-001") {
       this.defaultTipoTramite = "Otorgamiento";
     } else if (this.codigoProcedimientoTupa == "DCV-002") {
       this.defaultTipoTramite = "Renovación";
     }
     // ==================================================================================

     this.uriArchivo = this.dataInput.rutaDocumento;

     this.anexoFG = this.fb.group({
       d_Seccion1: this.fb.group({
         d_s1_empresa: [{ value: '', disabled: true }, [Validators.required]],
         d_s1_nervicio: ['', [Validators.required]],
         d_s1_nombre_estacion: ['', [Validators.required]],
         d_s1_indicativo: ['', [Validators.required]],
         d_s1_ubicacion_estacion: ['', [Validators.required]],
         d_s1_departamento: ['', [Validators.required]],
         d_s1_provincia: ['', [Validators.required]],
         d_s1_distrito: ['', [Validators.required]],
         d_s1_localidad: ['', [Validators.required]],

         d_s1_corGradoLO: ['', [Validators.required]],
         d_s1_corMinutoLO: ['', [Validators.required]],
         d_s1_corSegundosLO: ['', [Validators.required]],

         d_s1_corGradoLS: ['', [Validators.required]],
         d_s1_corMinutoLS: ['', [Validators.required]],
         d_s1_corSegundosLS: ['', [Validators.required]],

         d_s1_altitud: ['', [Validators.required]],
         d_s1_bloqueHorario: ['', [Validators.required]],

       }),

       e_Seccion2: this.fb.group({
         d_s2_marca: ['', [Validators.required]],
         d_s2_modelo: ['', [Validators.required]],
         d_s2_potenciaW: ['', [Validators.required]],
         d_s2_potenciadBm: ['', [Validators.required]],
         d_s2_rangoFrecuenciaTx: ['', [Validators.required]],
         d_s2_rangoFrecuenciaRx: ['', [Validators.required]],
         d_s2_capacidadPortadora: ['', [Validators.required]],
         d_s2_tipoEmision: ['', [Validators.required]],
         d_s2_tecMovil: ['', [Validators.required]],

       }),

       s_Seccion3: this.fb.group({
         d_s3_tipoAntenaSector1: [''],
         d_s3_tipoAntenaSector2: [''],
         d_s3_tipoAntenaSector3: [''],
         d_s3_tipoAntenaSector4: [''],

         d_s3_marcaSector1: [''],
         d_s3_marcaSector2: [''],
         d_s3_marcaSector3: [''],
         d_s3_marcaSector4: [''],

         d_s3_modeloSector1: [''],
         d_s3_modeloSector2: [''],
         d_s3_modeloSector3: [''],
         d_s3_modeloSector4: [''],

         d_s3_gananciadBiSector1: [''],
         d_s3_gananciadBiSector2: [''],
         d_s3_gananciadBiSector3: [''],
         d_s3_gananciadBiSector4: [''],

         d_s3_pireWSector1: [''],
         d_s3_pireWSector2: [''],
         d_s3_pireWSector3: [''],
         d_s3_pireWSector4: [''],

         d_s3_pireDbmSector1: [''],
         d_s3_pireDbmSector2: [''],
         d_s3_pireDbmSector3: [''],
         d_s3_pireDbmSector4: [''],

         d_s3_alturaInstaladaSector1: [''],
         d_s3_alturaInstaladaSector2: [''],
         d_s3_alturaInstaladaSector3: [''],
         d_s3_alturaInstaladaSector4: [''],

         d_s3_distanciaDeAnteanaSector1: [''],
         d_s3_distanciaDeAnteanaSector2: [''],
         d_s3_distanciaDeAnteanaSector3: [''],
         d_s3_distanciaDeAnteanaSector4: [''],

         d_s3_alturaTorre: ['', [Validators.required]],
         d_s3_alturaEdificio: ['', [Validators.required]],
         d_s3_numeroSectores: ['', [Validators.required]],

       }),

       s_Seccion4: this.fb.group({
         DatosContacto: this.fb.group({
           dc_tipoDocumento: ['', [Validators.required, Validators.maxLength(10)]],
           dc_numeroDocumento: ['', [Validators.required, Validators.maxLength(11)]],
           dc_nombre: [{ value: '', disabled: true }, [Validators.required, Validators.maxLength(30)]],
           dc_apePaterno: [{ value: '', disabled: true }, [Validators.required, Validators.maxLength(30)]],
           dc_apeMaterno: [{ value: '', disabled: true }, [Validators.required, Validators.maxLength(30)]],
           dc_telefono: ['', [Validators.required, Validators.maxLength(20)]],
           dc_celular: ['', [Validators.required, Validators.maxLength(9)]],
           dc_cip: ['', [Validators.required, Validators.maxLength(30)]],
         })


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




   //seccion 1
   get d_Seccion1(): UntypedFormGroup { return this.anexoFG.get('d_Seccion1') as UntypedFormGroup; }

   get d_s1_empresa(): UntypedFormControl { return this.d_Seccion1.get('d_s1_empresa') as UntypedFormControl }
   get d_s1_nervicio(): UntypedFormControl { return this.d_Seccion1.get('d_s1_nervicio') as UntypedFormControl }
   get d_s1_nombre_estacion(): UntypedFormControl { return this.d_Seccion1.get('d_s1_nombre_estacion') as UntypedFormControl }
   get d_s1_indicativo(): UntypedFormControl { return this.d_Seccion1.get('d_s1_indicativo') as UntypedFormControl }
   get d_s1_ubicacion_estacion(): UntypedFormControl { return this.d_Seccion1.get('d_s1_ubicacion_estacion') as UntypedFormControl }
   get d_s1_departamento(): UntypedFormControl { return this.d_Seccion1.get('d_s1_departamento') as UntypedFormControl }
   get d_s1_provincia(): UntypedFormControl { return this.d_Seccion1.get('d_s1_provincia') as UntypedFormControl }
   get d_s1_distrito(): UntypedFormControl { return this.d_Seccion1.get('d_s1_distrito') as UntypedFormControl }
   get d_s1_localidad(): UntypedFormControl { return this.d_Seccion1.get('d_s1_localidad') as UntypedFormControl }

   get d_s1_corGradoLO(): UntypedFormControl { return this.d_Seccion1.get('d_s1_corGradoLO') as UntypedFormControl }
   get d_s1_corMinutoLO(): UntypedFormControl { return this.d_Seccion1.get('d_s1_corMinutoLO') as UntypedFormControl }
   get d_s1_corSegundosLO(): UntypedFormControl { return this.d_Seccion1.get('d_s1_corSegundosLO') as UntypedFormControl }

   get d_s1_corGradoLS(): UntypedFormControl { return this.d_Seccion1.get('d_s1_corGradoLS') as UntypedFormControl }
   get d_s1_corMinutoLS(): UntypedFormControl { return this.d_Seccion1.get('d_s1_corMinutoLS') as UntypedFormControl }
   get d_s1_corSegundosLS(): UntypedFormControl { return this.d_Seccion1.get('d_s1_corSegundosLS') as UntypedFormControl }

   get d_s1_altitud(): UntypedFormControl { return this.d_Seccion1.get('d_s1_altitud') as UntypedFormControl }
   get d_s1_bloqueHorario(): UntypedFormControl { return this.d_Seccion1.get('d_s1_bloqueHorario') as UntypedFormControl }


   //seccion 2
   get e_Seccion2(): UntypedFormGroup { return this.anexoFG.get('e_Seccion2') as UntypedFormGroup; }
   get d_s2_marca(): UntypedFormControl { return this.e_Seccion2.get('d_s2_marca') as UntypedFormControl }
   get d_s2_modelo(): UntypedFormControl { return this.e_Seccion2.get('d_s2_modelo') as UntypedFormControl }
   get d_s2_potenciaW(): UntypedFormControl { return this.e_Seccion2.get('d_s2_potenciaW') as UntypedFormControl }
   get d_s2_potenciadBm(): UntypedFormControl { return this.e_Seccion2.get('d_s2_potenciadBm') as UntypedFormControl }
   get d_s2_rangoFrecuenciaTx(): UntypedFormControl { return this.e_Seccion2.get('d_s2_rangoFrecuenciaTx') as UntypedFormControl }
   get d_s2_rangoFrecuenciaRx(): UntypedFormControl { return this.e_Seccion2.get('d_s2_rangoFrecuenciaRx') as UntypedFormControl }
   get d_s2_capacidadPortadora(): UntypedFormControl { return this.e_Seccion2.get('d_s2_capacidadPortadora') as UntypedFormControl }

   get d_s2_tipoEmision(): UntypedFormControl { return this.e_Seccion2.get('d_s2_tipoEmision') as UntypedFormControl }
   get d_s2_tecMovil(): UntypedFormControl { return this.e_Seccion2.get('d_s2_tecMovil') as UntypedFormControl }


   //seccion 3
   get s_Seccion3(): UntypedFormGroup { return this.anexoFG.get('s_Seccion3') as UntypedFormGroup; }

   get d_s3_tipoAntenaSector1(): UntypedFormControl { return this.s_Seccion3.get('d_s3_tipoAntenaSector1') as UntypedFormControl }
   get d_s3_tipoAntenaSector2(): UntypedFormControl { return this.s_Seccion3.get('d_s3_tipoAntenaSector2') as UntypedFormControl }
   get d_s3_tipoAntenaSector3(): UntypedFormControl { return this.s_Seccion3.get('d_s3_tipoAntenaSector3') as UntypedFormControl }
   get d_s3_tipoAntenaSector4(): UntypedFormControl { return this.s_Seccion3.get('d_s3_tipoAntenaSector4') as UntypedFormControl }

   get d_s3_marcaSector1(): UntypedFormControl { return this.s_Seccion3.get('d_s3_marcaSector1') as UntypedFormControl }
   get d_s3_marcaSector2(): UntypedFormControl { return this.s_Seccion3.get('d_s3_marcaSector2') as UntypedFormControl }
   get d_s3_marcaSector3(): UntypedFormControl { return this.s_Seccion3.get('d_s3_marcaSector3') as UntypedFormControl }
   get d_s3_marcaSector4(): UntypedFormControl { return this.s_Seccion3.get('d_s3_marcaSector4') as UntypedFormControl }

   get d_s3_modeloSector1(): UntypedFormControl { return this.s_Seccion3.get('d_s3_modeloSector1') as UntypedFormControl }
   get d_s3_modeloSector2(): UntypedFormControl { return this.s_Seccion3.get('d_s3_modeloSector2') as UntypedFormControl }
   get d_s3_modeloSector3(): UntypedFormControl { return this.s_Seccion3.get('d_s3_modeloSector3') as UntypedFormControl }
   get d_s3_modeloSector4(): UntypedFormControl { return this.s_Seccion3.get('d_s3_modeloSector4') as UntypedFormControl }

   get d_s3_gananciadBiSector1(): UntypedFormControl { return this.s_Seccion3.get('d_s3_gananciadBiSector1') as UntypedFormControl }
   get d_s3_gananciadBiSector2(): UntypedFormControl { return this.s_Seccion3.get('d_s3_gananciadBiSector2') as UntypedFormControl }
   get d_s3_gananciadBiSector3(): UntypedFormControl { return this.s_Seccion3.get('d_s3_gananciadBiSector3') as UntypedFormControl }
   get d_s3_gananciadBiSector4(): UntypedFormControl { return this.s_Seccion3.get('d_s3_gananciadBiSector4') as UntypedFormControl }

   get d_s3_pireWSector1(): UntypedFormControl { return this.s_Seccion3.get('d_s3_pireWSector1') as UntypedFormControl }
   get d_s3_pireWSector2(): UntypedFormControl { return this.s_Seccion3.get('d_s3_pireWSector2') as UntypedFormControl }
   get d_s3_pireWSector3(): UntypedFormControl { return this.s_Seccion3.get('d_s3_pireWSector3') as UntypedFormControl }
   get d_s3_pireWSector4(): UntypedFormControl { return this.s_Seccion3.get('d_s3_pireWSector4') as UntypedFormControl }

   get d_s3_pireDbmSector1(): UntypedFormControl { return this.s_Seccion3.get('d_s3_pireDbmSector1') as UntypedFormControl }
   get d_s3_pireDbmSector2(): UntypedFormControl { return this.s_Seccion3.get('d_s3_pireDbmSector2') as UntypedFormControl }
   get d_s3_pireDbmSector3(): UntypedFormControl { return this.s_Seccion3.get('d_s3_pireDbmSector3') as UntypedFormControl }
   get d_s3_pireDbmSector4(): UntypedFormControl { return this.s_Seccion3.get('d_s3_pireDbmSector4') as UntypedFormControl }

   get d_s3_alturaInstaladaSector1(): UntypedFormControl { return this.s_Seccion3.get('d_s3_alturaInstaladaSector1') as UntypedFormControl }
   get d_s3_alturaInstaladaSector2(): UntypedFormControl { return this.s_Seccion3.get('d_s3_alturaInstaladaSector2') as UntypedFormControl }
   get d_s3_alturaInstaladaSector3(): UntypedFormControl { return this.s_Seccion3.get('d_s3_alturaInstaladaSector3') as UntypedFormControl }
   get d_s3_alturaInstaladaSector4(): UntypedFormControl { return this.s_Seccion3.get('d_s3_alturaInstaladaSector4') as UntypedFormControl }

   get d_s3_distanciaDeAnteanaSector1(): UntypedFormControl { return this.s_Seccion3.get('d_s3_distanciaDeAnteanaSector1') as UntypedFormControl }
   get d_s3_distanciaDeAnteanaSector2(): UntypedFormControl { return this.s_Seccion3.get('d_s3_distanciaDeAnteanaSector2') as UntypedFormControl }
   get d_s3_distanciaDeAnteanaSector3(): UntypedFormControl { return this.s_Seccion3.get('d_s3_distanciaDeAnteanaSector3') as UntypedFormControl }
   get d_s3_distanciaDeAnteanaSector4(): UntypedFormControl { return this.s_Seccion3.get('d_s3_distanciaDeAnteanaSector4') as UntypedFormControl }

   get d_s3_alturaTorre(): UntypedFormControl { return this.s_Seccion3.get('d_s3_alturaTorre') as UntypedFormControl }
   get d_s3_alturaEdificio(): UntypedFormControl { return this.s_Seccion3.get('d_s3_alturaEdificio') as UntypedFormControl }
   get d_s3_numeroSectores(): UntypedFormControl { return this.s_Seccion3.get('d_s3_numeroSectores') as UntypedFormControl }

   //seccion 4
   get s_Seccion4(): UntypedFormGroup { return this.anexoFG.get('s_Seccion4') as UntypedFormGroup; }

   get f_s4_DatosContacto(): UntypedFormGroup { return this.s_Seccion4.get('DatosContacto') as UntypedFormGroup; }
   get f_s4_dc_TipoDocumento(): UntypedFormControl { return this.f_s4_DatosContacto.get('dc_tipoDocumento') as UntypedFormControl }
   get f_s4_dc_NumeroDocumento(): UntypedFormControl { return this.f_s4_DatosContacto.get('dc_numeroDocumento') as UntypedFormControl }
   get f_s4_dc_Nombre(): UntypedFormControl { return this.f_s4_DatosContacto.get('dc_nombre') as UntypedFormControl }
   get f_s4_dc_ApePaterno(): UntypedFormControl { return this.f_s4_DatosContacto.get('dc_apePaterno') as UntypedFormControl }
   get f_s4_dc_ApeMaterno(): UntypedFormControl { return this.f_s4_DatosContacto.get('dc_apeMaterno') as UntypedFormControl }
   get f_s4_dc_Telefono(): UntypedFormControl { return this.f_s4_DatosContacto.get('dc_telefono') as UntypedFormControl }
   get f_s4_dc_Celular(): UntypedFormControl { return this.f_s4_DatosContacto.get('dc_celular') as UntypedFormControl }
   get f_s4_dc_Cip(): UntypedFormControl { return this.f_s4_DatosContacto.get('dc_cip') as UntypedFormControl }


   //seccion 5
   get a_Seccion5FG(): UntypedFormGroup { return this.anexoFG.get('a_Seccion5FG') as UntypedFormGroup; }
   get a_s5_declaracion1FC(): UntypedFormControl { return this.a_Seccion5FG.get('a_s5_declaracion1FC') as UntypedFormControl; }


   async cargarDatos(): Promise<void> {// carga si existe datos
     this.funcionesMtcService.mostrarCargando();

     if (this.dataInput.movId > 0) {
       // RECUPERAMOS LOS DATOS
       try {
         const dataAnexo = await this.anexoTramiteService.get<Anexo002_C27Response>(this.dataInput.tramiteReqId).toPromise();
        // console.log(JSON.parse(dataAnexo.metaData));
         const metaData = JSON.parse(dataAnexo.metaData);
       const seccion1= metaData.seccion1
       const seccion2= metaData.seccion2
       const seccion3= metaData.seccion3
       const seccion4= metaData.seccion4
       const seccion5= metaData.seccion5;

        /* const {
           seccion1,
           seccion2,
           seccion3,
           seccion4,
           seccion5
         } = JSON.parse(dataAnexo.metaData) as MetaData; */

         this.idAnexo = dataAnexo.anexoId;


         // SECCION 1:

         this.d_s1_empresa.setValue(seccion1.empresa);
         this.d_s1_nervicio.setValue(seccion1.servicio);
         this.d_s1_nombre_estacion.setValue(seccion1.nombreEstacion);
         this.d_s1_indicativo.setValue(seccion1.indicativo);
         this.d_s1_ubicacion_estacion.setValue(seccion1.ubicacionEstacion);
         this.d_s1_departamento.setValue(seccion1.departamento);
         this.d_s1_provincia.setValue(seccion1.provincia);
         this.d_s1_distrito.setValue(seccion1.distrito);

         await this.ubigeoEstFija1Component?.setUbigeoByText(
           seccion1.departamento,
           seccion1.provincia,
           seccion1.distrito
         );

         this.d_s1_localidad.setValue(seccion1.localidad);
         this.d_s1_corGradoLO.setValue(seccion1.corGradoLO);
         this.d_s1_corMinutoLO.setValue(seccion1.corMinutoLO);
         this.d_s1_corSegundosLO.setValue(seccion1.corSegundosLO);
         this.d_s1_corGradoLS.setValue(seccion1.corGradoLS);
         this.d_s1_corMinutoLS.setValue(seccion1.corMinutoLS);
         this.d_s1_corSegundosLS.setValue(seccion1.corSegundosLS);
         this.d_s1_altitud.setValue(seccion1.altitud);
         this.d_s1_bloqueHorario.setValue(seccion1.bloqueHorario);

         // SECCION 2:
         this.d_s2_marca.setValue(seccion2.marca);
         this.d_s2_modelo.setValue(seccion2.modelo);
         this.d_s2_potenciaW.setValue(seccion2.potenciaW);
         this.d_s2_potenciadBm.setValue(seccion2.potenciadBm);
         this.d_s2_rangoFrecuenciaTx.setValue(seccion2.rangoFrecuenciaTx);
         this.d_s2_rangoFrecuenciaRx.setValue(seccion2.rangoFrecuenciaRx);
         this.d_s2_capacidadPortadora.setValue(seccion2.capacidadPortadora);
         this.d_s2_tipoEmision.setValue(seccion2.tipoEmision);
         this.d_s2_tecMovil.setValue(seccion2.tipoEmision);
         this.d_s2_tecMovil.setValue(seccion2.tecMovil);

         // SECCION 3:
         this.d_s3_tipoAntenaSector1.setValue(seccion3.tipoAntenaSector1);
         this.d_s3_tipoAntenaSector2.setValue(seccion3.tipoAntenaSector2);
         this.d_s3_tipoAntenaSector3.setValue(seccion3.tipoAntenaSector3);
         this.d_s3_tipoAntenaSector4.setValue(seccion3.tipoAntenaSector4);

         this.d_s3_marcaSector1.setValue(seccion3.marcaSector1);
         this.d_s3_marcaSector2.setValue(seccion3.marcaSector2);
         this.d_s3_marcaSector3.setValue(seccion3.marcaSector3);
         this.d_s3_marcaSector4.setValue(seccion3.marcaSector4);

         this.d_s3_modeloSector1.setValue(seccion3.modeloSector1);
         this.d_s3_modeloSector2.setValue(seccion3.modeloSector2);
         this.d_s3_modeloSector3.setValue(seccion3.modeloSector3);
         this.d_s3_modeloSector4.setValue(seccion3.modeloSector4);

         this.d_s3_gananciadBiSector1.setValue(seccion3.gananciadBiSector1);
         this.d_s3_gananciadBiSector2.setValue(seccion3.gananciadBiSector2);
         this.d_s3_gananciadBiSector3.setValue(seccion3.gananciadBiSector3);
         this.d_s3_gananciadBiSector4.setValue(seccion3.gananciadBiSector4);

         this.d_s3_pireWSector1.setValue(seccion3.pireWSector1);
         this.d_s3_pireWSector2.setValue(seccion3.pireWSector2);
         this.d_s3_pireWSector3.setValue(seccion3.pireWSector3);
         this.d_s3_pireWSector4.setValue(seccion3.pireWSector4);

         this.d_s3_pireDbmSector1.setValue(seccion3.pireDbmSector1);
         this.d_s3_pireDbmSector2.setValue(seccion3.pireDbmSector2);
         this.d_s3_pireDbmSector3.setValue(seccion3.pireDbmSector3);
         this.d_s3_pireDbmSector4.setValue(seccion3.pireDbmSector4);

         this.d_s3_alturaInstaladaSector1.setValue(seccion3.alturaInstaladaSector1);
         this.d_s3_alturaInstaladaSector2.setValue(seccion3.alturaInstaladaSector2);
         this.d_s3_alturaInstaladaSector3.setValue(seccion3.alturaInstaladaSector3);
         this.d_s3_alturaInstaladaSector4.setValue(seccion3.alturaInstaladaSector4);

         this.d_s3_distanciaDeAnteanaSector1.setValue(seccion3.distanciaDeAnteanaSector1);
         this.d_s3_distanciaDeAnteanaSector2.setValue(seccion3.distanciaDeAnteanaSector2);
         this.d_s3_distanciaDeAnteanaSector3.setValue(seccion3.distanciaDeAnteanaSector3);
         this.d_s3_distanciaDeAnteanaSector4.setValue(seccion3.distanciaDeAnteanaSector4);

         this.d_s3_alturaTorre.setValue(seccion3.alturaTorre);
         this.d_s3_alturaEdificio.setValue(seccion3.alturaEdificio);
         this.d_s3_numeroSectores.setValue(seccion3.numeroSectores);

         // SECCION 4:

         this.f_s4_dc_Nombre.setValue(seccion4.DatosContacto.nombres);
         this.f_s4_dc_ApePaterno.setValue(seccion4.DatosContacto.apellidoPaterno);
          this.f_s4_dc_ApeMaterno.setValue(seccion4.DatosContacto.apellidoMaterno);
          this.f_s4_dc_TipoDocumento.setValue(seccion4.DatosContacto.tipoDocumento.id);
          this.f_s4_dc_NumeroDocumento.setValue(seccion4.DatosContacto.numeroDocumento);
          this.f_s4_dc_Telefono.setValue(seccion4.DatosContacto.telefono);
          this.f_s4_dc_Celular.setValue(seccion4.DatosContacto.celular);
          this.f_s4_dc_Cip.setValue(seccion4.DatosContacto.cip);


         // SECCION 5:
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
       modalRef.componentInstance.titleModal = 'Vista Previa - Anexo 002-C/27';
     }
     catch (e) {
       console.error(e);
       this.funcionesMtcService
         .ocultarCargando()
         .mensajeError('Problemas para descargar el archivo PDF');
     }
   }

   downloadPlantEquipa(): void {

   }

   async cargarDatosSolicitante(): Promise<void> {
     this.funcionesMtcService.mostrarCargando();
     // Obtenemos los datos del Solicitante
     if (this.tipoSolicitante === 'PJ') {
       try {
         const response = await this.sunatService.getDatosPrincipales(this.nroRuc).toPromise();
         console.log('SUNAT: ', response);

         this.razonSocial = response.razonSocial?.trim() ?? '';
         this.d_s1_empresa.setValue(this.razonSocial);

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

   async guardarAnexo(): Promise<void> {
     if (this.anexoFG.invalid === true) {
       this.funcionesMtcService.mensajeError('Debe ingresar todos los campos obligatorios');
       return;
     }

     const dataGuardar = new Anexo002_C27Request();
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
       seccion4,
       seccion5
     } = dataGuardar.metaData;

     //console.log(dataGuardar.metaData);
     // -------------------------------------
     // SECCION 1:

     seccion1.empresa = this.d_s1_empresa.value;
     seccion1.servicio = this.d_s1_nervicio.value;
     seccion1.nombreEstacion = this.d_s1_nombre_estacion.value;
     seccion1.indicativo = this.d_s1_indicativo.value;
     seccion1.ubicacionEstacion = this.d_s1_ubicacion_estacion.value;

     seccion1.departamento = this.ubigeoEstFija1Component.getDepartamentoText();
     seccion1.provincia = this.ubigeoEstFija1Component.getProvinciaText();
     seccion1.distrito = this.ubigeoEstFija1Component.getDistritoText();

     seccion1.localidad = this.d_s1_localidad.value;

     seccion1.corGradoLO = this.d_s1_corGradoLO.value;
     seccion1.corMinutoLO = this.d_s1_corMinutoLO.value;
     seccion1.corSegundosLO = this.d_s1_corSegundosLO.value;
     seccion1.corGradoLS = this.d_s1_corGradoLS.value;
     seccion1.corMinutoLS = this.d_s1_corMinutoLS.value;
     seccion1.corSegundosLS = this.d_s1_corSegundosLS.value;

     seccion1.altitud = this.d_s1_altitud.value;
     seccion1.bloqueHorario = this.d_s1_bloqueHorario.value;

     // SECCION 2:
     seccion2.marca = this.d_s2_marca.value;
     seccion2.modelo = this.d_s2_modelo.value;
     seccion2.potenciaW = this.d_s2_potenciaW.value;
     seccion2.potenciadBm = this.d_s2_potenciadBm.value;
     seccion2.rangoFrecuenciaTx = this.d_s2_rangoFrecuenciaTx.value;
     seccion2.rangoFrecuenciaRx = this.d_s2_rangoFrecuenciaRx.value;
     seccion2.capacidadPortadora = this.d_s2_capacidadPortadora.value;
     seccion2.tipoEmision = this.d_s2_tipoEmision.value;
     seccion2.tipoEmision = this.d_s2_tecMovil.value;
     seccion2.tecMovil = this.d_s2_tecMovil.value;

     // SECCION 3:
     seccion3.tipoAntenaSector1 = this.d_s3_tipoAntenaSector1.value;
     seccion3.tipoAntenaSector2 = this.d_s3_tipoAntenaSector2.value;
     seccion3.tipoAntenaSector3 = this.d_s3_tipoAntenaSector3.value;
     seccion3.tipoAntenaSector4 = this.d_s3_tipoAntenaSector4.value;

     seccion3.marcaSector1 = this.d_s3_marcaSector1.value;
     seccion3.marcaSector2 = this.d_s3_marcaSector2.value;
     seccion3.marcaSector3 = this.d_s3_marcaSector3.value;
     seccion3.marcaSector4 = this.d_s3_marcaSector4.value;

     seccion3.modeloSector1 = this.d_s3_modeloSector1.value;
     seccion3.modeloSector2 = this.d_s3_modeloSector2.value;
     seccion3.modeloSector3 = this.d_s3_modeloSector3.value;
     seccion3.modeloSector4 = this.d_s3_modeloSector4.value;

     seccion3.gananciadBiSector1 = this.d_s3_gananciadBiSector1.value;
     seccion3.gananciadBiSector2 = this.d_s3_gananciadBiSector2.value;
     seccion3.gananciadBiSector3 = this.d_s3_gananciadBiSector3.value;
     seccion3.gananciadBiSector4 = this.d_s3_gananciadBiSector4.value;

     seccion3.pireWSector1 = this.d_s3_pireWSector1.value;
     seccion3.pireWSector2 = this.d_s3_pireWSector2.value;
     seccion3.pireWSector3 = this.d_s3_pireWSector3.value;
     seccion3.pireWSector4 = this.d_s3_pireWSector4.value;

     seccion3.pireDbmSector1 = this.d_s3_pireDbmSector1.value;
     seccion3.pireDbmSector2 = this.d_s3_pireDbmSector2.value;
     seccion3.pireDbmSector3 = this.d_s3_pireDbmSector3.value;
     seccion3.pireDbmSector4 = this.d_s3_pireDbmSector4.value;

     seccion3.alturaInstaladaSector1 = this.d_s3_alturaInstaladaSector1.value;
     seccion3.alturaInstaladaSector2 = this.d_s3_alturaInstaladaSector2.value;
     seccion3.alturaInstaladaSector3 = this.d_s3_alturaInstaladaSector3.value;
     seccion3.alturaInstaladaSector4 = this.d_s3_alturaInstaladaSector4.value;

     seccion3.distanciaDeAnteanaSector1 = this.d_s3_distanciaDeAnteanaSector1.value;
     seccion3.distanciaDeAnteanaSector2 = this.d_s3_distanciaDeAnteanaSector2.value;
     seccion3.distanciaDeAnteanaSector3 = this.d_s3_distanciaDeAnteanaSector3.value;
     seccion3.distanciaDeAnteanaSector4 = this.d_s3_distanciaDeAnteanaSector4.value;

     seccion3.alturaTorre = this.d_s3_alturaTorre.value;
     seccion3.alturaEdificio = this.d_s3_alturaEdificio.value;
     seccion3.numeroSectores = this.d_s3_numeroSectores.value;

     // SECCION 4:
     seccion4.datosContacto.nombres = this.f_s4_dc_Nombre.value;
     seccion4.datosContacto.apellidoPaterno = this.f_s4_dc_ApePaterno.value;
     seccion4.datosContacto.apellidoMaterno = this.f_s4_dc_ApeMaterno.value;
     seccion4.datosContacto.tipoDocumento.id = this.f_s4_dc_TipoDocumento.value;
     seccion4.datosContacto.tipoDocumento.documento = (this.tipoSolicitante === "PJ" ? this.listaTiposDocumentos.filter(item => item.id == this.f_s4_dc_TipoDocumento.value)[0].documento : "");
     seccion4.datosContacto.numeroDocumento = this.f_s4_dc_NumeroDocumento.value;
     seccion4.datosContacto.telefono = this.f_s4_dc_Telefono.value;
     seccion4.datosContacto.celular = this.f_s4_dc_Celular.value;
     seccion4.datosContacto.cip = this.f_s4_dc_Cip.value;

     // -----------------------------------------------------------
     // SECCION 5:
     seccion5.declaracion_1 = this.a_s5_declaracion1FC.value ?? false;
     // -------------------------------------------------------------

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
       return this.anexoFG.get(control)!.invalid && (this.anexoFG.get(control)!.dirty || this.anexoFG.get(control)!.touched);
   }



   async buscarNumeroDocumentoDatosContacto(): Promise<void> {
     const tipoDocumento: string = this.f_s4_dc_TipoDocumento.value.trim();
     const numeroDocumento: string = this.f_s4_dc_NumeroDocumento.value.trim();
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

         this.addContacto(tipoDocumento,
           datosPersona.prenombres,
           datosPersona.apPrimer,
           datosPersona.apSegundo);

       }
       catch (e) {
         console.error(e);

         this.funcionesMtcService.ocultarCargando().mensajeError('Error al consultar al servicio');
         this.f_s4_dc_Nombre.enable();
         this.f_s4_dc_ApePaterno.enable();
         this.f_s4_dc_ApeMaterno.enable();
       }
     } else if (tipoDocumento === '04') {// CARNÉ DE EXTRANJERÍA
       try {
         const respuesta = await this.extranjeriaService.getCE(numeroDocumento).toPromise();

         this.funcionesMtcService.ocultarCargando();

         if (respuesta.CarnetExtranjeria.numRespuesta !== '0000') {
           return this.funcionesMtcService.mensajeError('Número de documento no registrado en Migraciones');
         }

         this.addContacto(tipoDocumento,
           respuesta.CarnetExtranjeria.nombres,
           respuesta.CarnetExtranjeria.primerApellido,
           respuesta.CarnetExtranjeria.segundoApellido);
       }
       catch (e) {
         console.error(e);

         this.funcionesMtcService.ocultarCargando().mensajeError('Error al consultar al servicio');
         this.f_s4_dc_Nombre.disable({ emitEvent: false });
         this.f_s4_dc_ApePaterno.disable({ emitEvent: false });
         this.f_s4_dc_ApeMaterno.disable({ emitEvent: false });
       }
     }

   }


   async addContacto(
     tipoDocumento: string,
     nombres: string,
     apPaterno: string,
     apMaterno: string,): Promise<void> {

     this.funcionesMtcService
       .mensajeConfirmar(`Los datos ingresados fueron validados por ${tipoDocumento === '01' ? 'RENIEC' : 'MIGRACIONES'} corresponden a la persona ${nombres} ${apPaterno} ${apMaterno}. ¿Está seguro de agregarlo?`)
       .then(async () => {
         this.f_s4_dc_Nombre.setValue(nombres);
         this.f_s4_dc_ApePaterno.setValue(apPaterno);
         this.f_s4_dc_ApeMaterno.setValue(apMaterno);


         this.f_s4_dc_Nombre.disable({ emitEvent: false });
         this.f_s4_dc_ApePaterno.disable({ emitEvent: false });
         this.f_s4_dc_ApeMaterno.disable({ emitEvent: false });

       });

   }


 }
