/**
 * Anexo 002-D/27
 * @author Mackenneddy Melendez Coral
 * @version 1.0 26.08.2022
 */

import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { AbstractControlOptions, UntypedFormBuilder, UntypedFormGroup, Validators, UntypedFormControl, FormArray, Form } from '@angular/forms';
import { NgbAccordionDirective , NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { AnexoTramiteService } from 'src/app/core/services/tramite/anexo-tramite.service';
import { VisorPdfArchivosService } from 'src/app/core/services/tramite/visor-pdf-archivos.service';
import { VistaPdfComponent } from 'src/app/shared/components/vista-pdf/vista-pdf.component';
import { noWhitespaceValidator, requireCheckboxesToBeCheckedValidator } from 'src/app/helpers/validator';
import { SeguridadService } from '../../../../../core/services/seguridad.service';
//  import { Anexo002_D27Response } from '../../../../../core/models/Anexos/Anexo002_d27/Anexo002_D27Response';
//  import { MetaData } from 'src/app/core/models/Anexos/Anexo002_D27/MetaData';
import { UbigeoComponent } from 'src/app/shared/components/forms/ubigeo/ubigeo.component';
//  import { Anexo002_D27Request } from 'src/app/core/models/Anexos/Anexo002_D27/Anexo002_D27Request';
import { ExtranjeriaService } from 'src/app/core/services/servicios/extranjeria.service';
import { ReniecService } from 'src/app/core/services/servicios/reniec.service';
import { SunatService } from 'src/app/core/services/servicios/sunat.service';
import { CONSTANTES } from 'src/app/enums/constants';
//  import { Anexo002D27Service } from 'src/app/core/services/anexos/anexo002-d27.service';

import { TipoDocumentoModel } from '../../../../../core/models/TipoDocumentoModel';
import { Anexo002_D27Request } from '../../../domain/anexo002_D27/anexo002_D27Request';
import { Anexo002_D27Response } from '../../../domain/anexo002_D27/anexo002_D27Response';
import { Anexo002_D27Service } from '../../../application/usecases';
 //import { Seccion2, Seccion3 } from '../../../../../core/models/Anexos/Anexo002_D27/Secciones';

 @Component({
   // tslint:disable-next-line: component-selector
   selector: 'app-anexo002_D27',
   templateUrl: './anexo002_D27.component.html',
   styleUrls: ['./anexo002_D27.component.css']
 })

 // tslint:disable-next-line: class-name
 export class Anexo002_D27Component implements OnInit, AfterViewInit, AfterViewChecked {
   @Input() public dataInput: any;
   @ViewChild('acc') acc: NgbAccordionDirective ;

   @ViewChild('ubigeoCmpEstFija1') ubigeoEstFija1Component: UbigeoComponent;

   txtTitulo = 'ANEXO 002-D/27 ESTACIONES FIJAS SATELITALES - Descripción de las Estaciones, Asignación de Frecuencias, Ubicación y Equipamiento';

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
     private anexoService: Anexo002_D27Service,
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
         d_s1_empresa: [{ value: '', disabled: true }, [Validators.required,]],
         d_s1_servicio: ['', [Validators.required]],
         d_s1_nombre_estacion: ['', [Validators.required]],

         d_s1_tipo: ['', [Validators.required]],

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

         d_s1_indicativo: [''],
         d_s1_nroportadorastransmision: ['', [Validators.required]],

         d_s1_frecuenciaUplink: ['', [Validators.required]],
         d_s1_frecuenciaDownlink: ['', [Validators.required]],

         d_s1_bloqueHorario: ['', [Validators.required]],
         d_s1_fechaInstalacion: ['', [Validators.required]],

       }),

       e_Seccion2: this.fb.group({
         d_s2_marca: ['', [Validators.required]],
         d_s2_modelo: ['', [Validators.required]],
         d_s2_potenciaW: ['', [Validators.required]],
         d_s2_potenciadBm: ['', [Validators.required]],
         d_s2_rangoFrecuencia: ['', [Validators.required]],
         d_s2_capacidadPortadora: ['', [Validators.required]],
         d_s2_tipoEmision: ['', [Validators.required]],
         d_s2_nroTranspondedor: ['', [Validators.required]],
         d_s2_amplificadorHPA: ['', [Validators.required]],
         d_s2_amplificadorSSPA: ['', [Validators.required]],
       }),

       s_Seccion3: this.fb.group({ //13

         d_s3_tipoAntena: ['', [Validators.required]],
         d_s3_marca: ['', [Validators.required]],
         d_s3_modelo: ['', [Validators.required]],
         d_s3_ganancia: ['', [Validators.required]],
         d_s3_diametroAntena: ['', [Validators.required]],
         d_s3_anguloEleva: ['', [Validators.required]],
         d_s3_azimut: ['', [Validators.required]],
         //pires
         d_s3_pireW: ['', [Validators.required]],
         d_s3_pireDbm: ['', [Validators.required]],
         d_s3_alturaTorre: ['', [Validators.required]],
         d_s3_alturaEdificio: ['', [Validators.required]],
         d_s3_alturaInstalada: ['', [Validators.required]],
         d_s3_distanciaDeAnteanaPuntoAccesible: ['', [Validators.required]],

       }),

       s_Seccion4: this.fb.group({
         d_s4_orbitalSatelite: ['', [Validators.required]],
       }),

       s_Seccion5: this.fb.group({
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

       a_Seccion6: this.fb.group({
         a_s6_declaracion1FC: [false, [Validators.requiredTrue]],
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


   ///---
   get d_Seccion1(): UntypedFormGroup { return this.anexoFG.get('d_Seccion1') as UntypedFormGroup; }

   get d_s1_empresa(): UntypedFormControl { return this.d_Seccion1.get('d_s1_empresa') as UntypedFormControl }
   get d_s1_servicio(): UntypedFormControl { return this.d_Seccion1.get('d_s1_servicio') as UntypedFormControl }
   get d_s1_nombre_estacion(): UntypedFormControl { return this.d_Seccion1.get('d_s1_nombre_estacion') as UntypedFormControl }
   get d_s1_tipo(): UntypedFormControl { return this.d_Seccion1.get('d_s1_tipo') as UntypedFormControl }

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
   get d_s1_indicativo(): UntypedFormControl { return this.d_Seccion1.get('d_s1_indicativo') as UntypedFormControl }
   get d_s1_nroportadorastransmision(): UntypedFormControl { return this.d_Seccion1.get('d_s1_nroportadorastransmision') as UntypedFormControl }

   get d_s1_frecuenciaUplink(): UntypedFormControl { return this.d_Seccion1.get('d_s1_frecuenciaUplink') as UntypedFormControl }
   get d_s1_frecuenciaDownlink(): UntypedFormControl { return this.d_Seccion1.get('d_s1_frecuenciaDownlink') as UntypedFormControl }
   get d_s1_bloqueHorario(): UntypedFormControl { return this.d_Seccion1.get('d_s1_bloqueHorario') as UntypedFormControl }
   get d_s1_fechaInstalacion(): UntypedFormControl { return this.d_Seccion1.get('d_s1_fechaInstalacion') as UntypedFormControl }

   ///---

   get e_Seccion2(): UntypedFormGroup { return this.anexoFG.get('e_Seccion2') as UntypedFormGroup; }

   get d_s2_marca(): UntypedFormControl { return this.e_Seccion2.get('d_s2_marca') as UntypedFormControl }
   get d_s2_modelo(): UntypedFormControl { return this.e_Seccion2.get('d_s2_modelo') as UntypedFormControl }
   get d_s2_potenciaW(): UntypedFormControl { return this.e_Seccion2.get('d_s2_potenciaW') as UntypedFormControl }
   get d_s2_potenciadBm(): UntypedFormControl { return this.e_Seccion2.get('d_s2_potenciadBm') as UntypedFormControl }

   get d_s2_rangoFrecuencia(): UntypedFormControl { return this.e_Seccion2.get('d_s2_rangoFrecuencia') as UntypedFormControl }
   get d_s2_capacidadPortadora(): UntypedFormControl { return this.e_Seccion2.get('d_s2_capacidadPortadora') as UntypedFormControl }
   get d_s2_tipoEmision(): UntypedFormControl { return this.e_Seccion2.get('d_s2_tipoEmision') as UntypedFormControl }

   get d_s2_nroTranspondedor(): UntypedFormControl { return this.e_Seccion2.get('d_s2_nroTranspondedor') as UntypedFormControl }
   get d_s2_amplificadorHPA(): UntypedFormControl { return this.e_Seccion2.get('d_s2_amplificadorHPA') as UntypedFormControl }
   get d_s2_amplificadorSSPA(): UntypedFormControl { return this.e_Seccion2.get('d_s2_amplificadorSSPA') as UntypedFormControl }


   ///---
   get s_Seccion3(): UntypedFormGroup { return this.anexoFG.get('s_Seccion3') as UntypedFormGroup; }
   get d_s3_tipoAntena(): UntypedFormControl { return this.s_Seccion3.get('d_s3_tipoAntena') as UntypedFormControl }

   get d_s3_marca(): UntypedFormControl { return this.s_Seccion3.get('d_s3_marca') as UntypedFormControl }
   get d_s3_modelo(): UntypedFormControl { return this.s_Seccion3.get('d_s3_modelo') as UntypedFormControl }
   get d_s3_ganancia(): UntypedFormControl { return this.s_Seccion3.get('d_s3_ganancia') as UntypedFormControl }
   get d_s3_diametroAntena(): UntypedFormControl { return this.s_Seccion3.get('d_s3_diametroAntena') as UntypedFormControl }
   get d_s3_anguloEleva(): UntypedFormControl { return this.s_Seccion3.get('d_s3_anguloEleva') as UntypedFormControl }

   get d_s3_azimut(): UntypedFormControl { return this.s_Seccion3.get('d_s3_azimut') as UntypedFormControl }

   get d_s3_pireW(): UntypedFormControl { return this.s_Seccion3.get('d_s3_pireW') as UntypedFormControl }
   get d_s3_pireDbm(): UntypedFormControl { return this.s_Seccion3.get('d_s3_pireDbm') as UntypedFormControl }

   get d_s3_alturaTorre(): UntypedFormControl { return this.s_Seccion3.get('d_s3_alturaTorre') as UntypedFormControl }
   get d_s3_alturaEdificio(): UntypedFormControl { return this.s_Seccion3.get('d_s3_alturaEdificio') as UntypedFormControl }
   get d_s3_alturaInstalada(): UntypedFormControl { return this.s_Seccion3.get('d_s3_alturaInstalada') as UntypedFormControl }
   get d_s3_distanciaDeAnteanaPuntoAccesible(): UntypedFormControl { return this.s_Seccion3.get('d_s3_distanciaDeAnteanaPuntoAccesible') as UntypedFormControl }


   ///---
   get s_Seccion4(): UntypedFormGroup { return this.anexoFG.get('s_Seccion4') as UntypedFormGroup; }
   get d_s4_orbitalSatelite(): UntypedFormControl { return this.s_Seccion4.get('d_s4_orbitalSatelite') as UntypedFormControl }

   ///---
   get s_Seccion5(): UntypedFormGroup { return this.anexoFG.get('s_Seccion5') as UntypedFormGroup; }

   get f_s5_DatosContacto(): UntypedFormGroup { return this.s_Seccion5.get('DatosContacto') as UntypedFormGroup; }
   get f_s5_dc_TipoDocumento(): UntypedFormControl { return this.f_s5_DatosContacto.get('dc_tipoDocumento') as UntypedFormControl }
   get f_s5_dc_NumeroDocumento(): UntypedFormControl { return this.f_s5_DatosContacto.get('dc_numeroDocumento') as UntypedFormControl }
   get f_s5_dc_Nombre(): UntypedFormControl { return this.f_s5_DatosContacto.get('dc_nombre') as UntypedFormControl }
   get f_s5_dc_ApePaterno(): UntypedFormControl { return this.f_s5_DatosContacto.get('dc_apePaterno') as UntypedFormControl }
   get f_s5_dc_ApeMaterno(): UntypedFormControl { return this.f_s5_DatosContacto.get('dc_apeMaterno') as UntypedFormControl }
   get f_s5_dc_Telefono(): UntypedFormControl { return this.f_s5_DatosContacto.get('dc_telefono') as UntypedFormControl }
   get f_s5_dc_Celular(): UntypedFormControl { return this.f_s5_DatosContacto.get('dc_celular') as UntypedFormControl }
   get f_s5_dc_Cip(): UntypedFormControl { return this.f_s5_DatosContacto.get('dc_cip') as UntypedFormControl }

   //---
   get a_Seccion6(): UntypedFormGroup { return this.anexoFG.get('a_Seccion6') as UntypedFormGroup; }
   get a_s6_declaracion1FC(): UntypedFormControl { return this.a_Seccion6.get('a_s6_declaracion1FC') as UntypedFormControl; }




   async cargarDatos(): Promise<void> {
     this.funcionesMtcService.mostrarCargando();

     if (this.dataInput.movId > 0) {
       // RECUPERAMOS LOS DATOS
       try {
         const dataAnexo = await this.anexoTramiteService.get<Anexo002_D27Response>(this.dataInput.tramiteReqId).toPromise();
         //console.log(JSON.parse(dataAnexo.metaData));
        //  const {
        //    seccion1,
        //    seccion2,
        //    seccion3,
        //    seccion4,
        //    seccion5,
        //    seccion6,
        //  } = JSON.parse(dataAnexo.metaData) as MetaData;

         const metaData = JSON.parse(dataAnexo.metaData);
         const seccion1= metaData.seccion1
         const seccion2= metaData.seccion2
         const seccion3= metaData.seccion3
         const seccion4= metaData.seccion4
         const seccion5= metaData.seccion5;
         const seccion6= metaData.seccion6;

         this.idAnexo = dataAnexo.anexoId;

         //seccion 1
         this.d_s1_empresa.setValue(seccion1.empresa);
         this.d_s1_servicio.setValue(seccion1.servicio);
         this.d_s1_nombre_estacion.setValue(seccion1.nombreEstacion);
         this.d_s1_tipo.setValue(seccion1.tipo)
         this.d_s1_ubicacion_estacion.setValue(seccion1.ubicacionEstacion);
         this.d_s1_departamento.setValue(seccion1.departamento);
         this.d_s1_provincia.setValue(seccion1.provincia);
         this.d_s1_distrito.setValue(seccion1.distrito);
         this.d_s1_localidad.setValue(seccion1.localidad);

         await this.ubigeoEstFija1Component?.setUbigeoByText(
           seccion1.departamento,
           seccion1.provincia,
           seccion1.distrito
         );

         this.d_s1_corGradoLO.setValue(seccion1.corGradoLO);
         this.d_s1_corMinutoLO.setValue(seccion1.corMinutoLO);
         this.d_s1_corSegundosLO.setValue(seccion1.corSegundosLO);
         this.d_s1_corGradoLS.setValue(seccion1.corGradoLS);
         this.d_s1_corMinutoLS.setValue(seccion1.corMinutoLS);
         this.d_s1_corSegundosLS.setValue(seccion1.corSegundosLS);
         this.d_s1_altitud.setValue(seccion1.altitud);
         this.d_s1_indicativo.setValue(seccion1.indicativo);
         this.d_s1_nroportadorastransmision.setValue(seccion1.nroportadorastransmision);
         this.d_s1_frecuenciaUplink.setValue(seccion1.frecuenciaUplink);
         this.d_s1_frecuenciaDownlink.setValue(seccion1.frecuenciaDownlink);
         this.d_s1_bloqueHorario.setValue(seccion1.bloqueHorario);
         this.d_s1_fechaInstalacion.setValue(seccion1.fechaInstalacion);

         //seccion2

         this.d_s2_marca.setValue(seccion2.marca);
         this.d_s2_modelo.setValue(seccion2.modelo);
         this.d_s2_potenciaW.setValue(seccion2.potenciaW);
         this.d_s2_potenciadBm.setValue(seccion2.potenciadBm);
         this.d_s2_rangoFrecuencia.setValue(seccion2.rangoFrecuencia);
         this.d_s2_capacidadPortadora.setValue(seccion2.capacidadPortadora);
         this.d_s2_tipoEmision.setValue(seccion2.tipoEmision);
         this.d_s2_nroTranspondedor.setValue(seccion2.nroTranspondedor);
         this.d_s2_amplificadorHPA.setValue(seccion2.amplificadorHPA);
         this.d_s2_amplificadorSSPA.setValue(seccion2.amplificadorSSPA);

         //seccion 3

         this.d_s3_tipoAntena.setValue(seccion3.tipoAntena);
         this.d_s3_marca.setValue(seccion3.marca);
         this.d_s3_modelo.setValue(seccion3.modelo);
         this.d_s3_ganancia.setValue(seccion3.ganancia);
         this.d_s3_diametroAntena.setValue(seccion3.diametroAntena);
         this.d_s3_anguloEleva.setValue(seccion3.anguloEleva);
         this.d_s3_azimut.setValue(seccion3.azimut);
         this.d_s3_pireW.setValue(seccion3.pireW);
         this.d_s3_pireDbm.setValue(seccion3.pireDbm);
         this.d_s3_alturaTorre.setValue(seccion3.alturaTorre);
         this.d_s3_alturaEdificio.setValue(seccion3.alturaEdificio);
         this.d_s3_alturaInstalada.setValue(seccion3.alturaInstalada);
         this.d_s3_distanciaDeAnteanaPuntoAccesible.setValue(seccion3.distanciaDeAnteanaPuntoAccesible);

         // seccion 4
         this.d_s4_orbitalSatelite.setValue(seccion4.orbitalSatelite);

         //seccion 5
         this.f_s5_dc_Nombre.setValue(seccion5.DatosContacto.nombres);
         this.f_s5_dc_ApePaterno.setValue(seccion5.DatosContacto.apellidoPaterno);
         this.f_s5_dc_ApeMaterno.setValue(seccion5.DatosContacto.apellidoMaterno);
         this.f_s5_dc_TipoDocumento.setValue(seccion5.DatosContacto.tipoDocumento.id);
         this.f_s5_dc_NumeroDocumento.setValue(seccion5.DatosContacto.numeroDocumento);
         this.f_s5_dc_Telefono.setValue(seccion5.DatosContacto.telefono);
         this.f_s5_dc_Celular.setValue(seccion5.DatosContacto.celular);
         this.f_s5_dc_Cip.setValue(seccion5.DatosContacto.cip);




         if (this.a_Seccion6.enabled) {
           const { declaracion_1 } = seccion6;
           this.a_s6_declaracion1FC.setValue(declaracion_1);
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
     console.log(this.defaultTipoTramite, "ddd")

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
       modalRef.componentInstance.titleModal = 'Vista Previa - Anexo 002-D/27';
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

     const dataGuardar = new Anexo002_D27Request();
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
       seccion5,
       seccion6
     } = dataGuardar.metaData;

     // -------------------------------------
     //seccion 1

     seccion1.empresa = this.d_s1_empresa.value;
     seccion1.servicio = this.d_s1_servicio.value;
     seccion1.nombreEstacion = this.d_s1_nombre_estacion.value;
     seccion1.tipo = this.d_s1_tipo.value;
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
     seccion1.indicativo = this.d_s1_indicativo.value;

     seccion1.nroportadorastransmision = this.d_s1_nroportadorastransmision.value;
     seccion1.frecuenciaUplink = this.d_s1_frecuenciaUplink.value;
     seccion1.frecuenciaDownlink = this.d_s1_frecuenciaDownlink.value;

     seccion1.bloqueHorario = this.d_s1_bloqueHorario.value;
     seccion1.fechaInstalacion = this.d_s1_fechaInstalacion.value;


     //seccion2

     seccion2.marca = this.d_s2_marca.value;
     seccion2.modelo = this.d_s2_modelo.value;
     seccion2.potenciaW = this.d_s2_potenciaW.value;
     seccion2.potenciadBm = this.d_s2_potenciadBm.value;
     seccion2.rangoFrecuencia = this.d_s2_rangoFrecuencia.value;
     seccion2.capacidadPortadora = this.d_s2_capacidadPortadora.value;
     seccion2.tipoEmision = this.d_s2_tipoEmision.value;
     seccion2.nroTranspondedor = this.d_s2_nroTranspondedor.value;
     seccion2.amplificadorHPA = this.d_s2_amplificadorHPA.value;
     seccion2.amplificadorSSPA = this.d_s2_amplificadorSSPA.value;

     //seccion 3

     seccion3.tipoAntena = this.d_s3_tipoAntena.value;
     seccion3.marca = this.d_s3_marca.value;
     seccion3.modelo = this.d_s3_modelo.value;
     seccion3.ganancia = this.d_s3_ganancia.value;
     seccion3.diametroAntena = this.d_s3_diametroAntena.value;
     seccion3.anguloEleva = this.d_s3_anguloEleva.value;
     seccion3.azimut = this.d_s3_azimut.value;
     seccion3.pireW = this.d_s3_pireW.value;
     seccion3.pireDbm = this.d_s3_pireDbm.value;
     seccion3.alturaTorre = this.d_s3_alturaTorre.value;
     seccion3.alturaEdificio = this.d_s3_alturaEdificio.value;
     seccion3.alturaInstalada = this.d_s3_alturaInstalada.value;
     seccion3.distanciaDeAnteanaPuntoAccesible = this.d_s3_distanciaDeAnteanaPuntoAccesible.value;

     // seccion 4
     seccion4.orbitalSatelite = this.d_s4_orbitalSatelite.value;


     //seccion 5
     seccion5.datosContacto.nombres = this.f_s5_dc_Nombre.value;
     seccion5.datosContacto.apellidoPaterno = this.f_s5_dc_ApePaterno.value;
     seccion5.datosContacto.apellidoMaterno = this.f_s5_dc_ApeMaterno.value;
     seccion5.datosContacto.tipoDocumento.id = this.f_s5_dc_TipoDocumento.value;
     seccion5.datosContacto.tipoDocumento.documento = (this.tipoSolicitante === "PJ" ? this.listaTiposDocumentos.filter(item => item.id == this.f_s5_dc_TipoDocumento.value)[0].documento : "");
     seccion5.datosContacto.numeroDocumento = this.f_s5_dc_NumeroDocumento.value;
     seccion5.datosContacto.telefono = this.f_s5_dc_Telefono.value;
     seccion5.datosContacto.celular = this.f_s5_dc_Celular.value;
     seccion5.datosContacto.cip = this.f_s5_dc_Cip.value;
     // -------------------------------------
     // SECCION 6:
     seccion6.declaracion_1 = this.a_s6_declaracion1FC.value ?? false;
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
       return this.anexoFG.get(control)!.invalid && (this.anexoFG.get(control)!.dirty || this.anexoFG.get(control)!.touched);
   }




   async buscarNumeroDocumentoDatosContacto(): Promise<void> {
     const tipoDocumento: string = this.f_s5_dc_TipoDocumento.value.trim();
     const numeroDocumento: string = this.f_s5_dc_NumeroDocumento.value.trim();
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
         this.f_s5_dc_Nombre.enable();
         this.f_s5_dc_ApePaterno.enable();
         this.f_s5_dc_ApeMaterno.enable();
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
         this.f_s5_dc_Nombre.disable({ emitEvent: false });
         this.f_s5_dc_ApePaterno.disable({ emitEvent: false });
         this.f_s5_dc_ApeMaterno.disable({ emitEvent: false });
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
         this.f_s5_dc_Nombre.setValue(nombres);
         this.f_s5_dc_ApePaterno.setValue(apPaterno);
         this.f_s5_dc_ApeMaterno.setValue(apMaterno);


         this.f_s5_dc_Nombre.disable({ emitEvent: false });
         this.f_s5_dc_ApePaterno.disable({ emitEvent: false });
         this.f_s5_dc_ApeMaterno.disable({ emitEvent: false });

       });

   }

 }
