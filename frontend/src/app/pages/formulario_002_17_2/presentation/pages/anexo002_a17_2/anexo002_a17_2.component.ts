import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { NgbAccordionDirective, NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { A002_A17_2_Seccion1, A002_A17_2_Seccion2, A002_A17_2_Seccion3 } from '../../../domain/anexo002_A17_2/anexo002_A17_2Request';
import { Anexo002_A17_2Request } from '../../../domain/anexo002_A17_2/anexo002_A17_2Request';
import { PaisResponse } from 'src/app/core/models/Maestros/PaisResponse';
import { SelectionModel } from 'src/app/core/models/SelectionModel';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { PaisService } from 'src/app/core/services/maestros/pais.service';
import { VehiculoService } from 'src/app/core/services/servicios/vehiculo.service';
import { AnexoTramiteService } from 'src/app/core/services/tramite/anexo-tramite.service';
import { VisorPdfArchivosService } from 'src/app/core/services/tramite/visor-pdf-archivos.service';
import { ValidateFileSize_Formulario } from 'src/app/helpers/file';
import { VistaPdfComponent } from 'src/app/shared/components/vista-pdf/vista-pdf.component';
import { Anexo002_A17_2Service } from '../../../application/usecases';
import { noWhitespaceValidator } from 'src/app/helpers/validator';
import { SeguridadService } from '../../../../../core/services/seguridad.service';
import { FormularioTramiteService } from '../../../../../core/services/tramite/formulario-tramite.service';

@Component({
   // tslint:disable-next-line: component-selector
   selector: 'app-anexo002_a17_2',
   templateUrl: './anexo002_a17_2.component.html',
   styleUrls: ['./anexo002_a17_2.component.css']
})

// tslint:disable-next-line: class-name
export class Anexo002_a17_2_Component implements OnInit, AfterViewInit {
   @Input() public dataInput: any;
   @ViewChild('acc') acc: NgbAccordionDirective;

   graboUsuario = false;

   idAnexo = 0;
   uriArchivo = ''; // PARA SABER EL NOMBRE DEL PDF (COMPLETO CON TODO Y ADJUNTOS)
   errorAlCargarData = false; // VARIABLE PARA CONTROLAR CUANDO OCURRE UN ERROR AL RECUPERAR LOS DATOS GUARDADOS DEL ANEXO

   tipoDocumentoSolicitante: string;
   nombreTipoDocumentoSolicitante: string;
   numeroDocumentoSolicitante: string;
   nombresApellidosSolicitante: string;

   indexEditTabla = -1;
   disabledAcordion = 2;

   listaPlacaNumero: string[] = [];
   listaPaises: PaisResponse[] = [];
   listaPasoFrontera: SelectionModel[] = [];

   anexoFG: UntypedFormGroup;
   visibleButtonCarf = false;

   listaFlotaVehicular: A002_A17_2_Seccion3[] = [];

   filePdfCafSeleccionado: any = null;
   filePdfCafPathName: string = null;

   tipoSolicitante: string;

   // CODIGO Y NOMBRE DEL PROCEDIMIENTO:
   codigoProcedimientoTupa: string;
   descProcedimientoTupa: string;
   codigoTipoSolicitudTupa: string;  //usado para las validaciones
   descTipoSolicitudTupa: string;

   paSeccion1: string[] = ['DSTT-006', 'DSTT-007', 'DSTT-010', 'DSTT-012', 'DSTT-013', 'DSTT-014'];
   paTransInternacional: string[] = ['DSTT-006', 'DSTT-007', 'DSTT-010', 'DSTT-012', 'DSTT-013'];
   paSeccion2: string[] = ['DSTT-014'];

   /*
   paTipoServicio = [
     { pa: 'DSTT-007', tipoSolicitud: '0', tipoServicio: '1' }, //   quitar
     { pa: 'DSTT-010', tipoSolicitud: '0', tipoServicio: '1' }, //   quitar
     { pa: 'DSTT-013', tipoSolicitud: '0', tipoServicio: '1' }, //   quitar
 
     { pa: 'DSTT-006', tipoSolicitud: '0', tipoServicio: '9' },
     { pa: 'DSTT-006', tipoSolicitud: '0', tipoServicio: '23'},
     { pa: 'DSTT-007', tipoSolicitud: '0', tipoServicio: '22'},
     { pa: 'DSTT-008', tipoSolicitud: '0', tipoServicio: '23'},
     { pa: 'DSTT-009', tipoSolicitud: '0', tipoServicio: '22'},
     { pa: 'DSTT-010', tipoSolicitud: '0', tipoServicio: '23'},
     { pa: 'DSTT-011', tipoSolicitud: '0', tipoServicio: '23'}, 
     { pa: 'DSTT-012', tipoSolicitud: '0', tipoServicio: '23'},
     { pa: 'DSTT-013', tipoSolicitud: '0', tipoServicio: '15'}, //   quitar
     { pa: 'DSTT-013', tipoSolicitud: '0', tipoServicio: '22'}, 
     { pa: 'DSTT-014', tipoSolicitud: '0', tipoServicio: '9' },
     { pa: 'DSTT-014', tipoSolicitud: '0', tipoServicio: '23'},
     { pa: 'DSTT-017', tipoSolicitud: '0', tipoServicio: '15'}, 
     { pa: 'DSTT-022', tipoSolicitud: '0', tipoServicio: '15'},
     { pa: 'DSTT-022', tipoSolicitud: '0', tipoServicio: '16'},
 
     
     { pa: 'DSTT-024', tipoSolicitud: '1', tipoServicio: '9' }, // CITV PERMISO MERCANCIA PUBLICO
     { pa: 'DSTT-024', tipoSolicitud: '1', tipoServicio: '10'}, // CITV PERMISO MERCANCIAS PRIVADO
     { pa: 'DSTT-024', tipoSolicitud: '1', tipoServicio: '9' }, // CITV PERMISO REGULAR DE PERSONAS
   ];*/

   paTipoServicio = [
      { pa: 'DSTT-006', tipoServicio: '9' },
      { pa: 'DSTT-006', tipoServicio: '23' },

      { pa: 'DSTT-007', tipoServicio: '22' },

      { pa: 'DSTT-008', tipoServicio: '9' },
      { pa: 'DSTT-008', tipoServicio: '23' },

      { pa: 'DSTT-009', tipoServicio: '22' },

      { pa: 'DSTT-010', tipoServicio: '10' },
      { pa: 'DSTT-010', tipoServicio: '23' },

      { pa: 'DSTT-011', tipoServicio: '9' },
      { pa: 'DSTT-011', tipoServicio: '23' },

      { pa: 'DSTT-012', tipoServicio: '9' },
      { pa: 'DSTT-012', tipoServicio: '23' },

      { pa: 'DSTT-013', tipoServicio: '1' }, //   quitar
      { pa: 'DSTT-013', tipoServicio: '15' }, //   quitar
      { pa: 'DSTT-013', tipoServicio: '22' },

      { pa: 'DSTT-014', tipoServicio: '1' },
      { pa: 'DSTT-014', tipoServicio: '9' },
      { pa: 'DSTT-014', tipoServicio: '10' },
      { pa: 'DSTT-014', tipoServicio: '22' },
      { pa: 'DSTT-014', tipoServicio: '23' },

      { pa: 'DSTT-016', tipoServicio: '9' },
      { pa: 'DSTT-016', tipoServicio: '23' },

      { pa: 'DSTT-017', tipoServicio: '15' },

      { pa: 'DSTT-022', tipoServicio: '15' },
      { pa: 'DSTT-022', tipoServicio: '16' },
      /*    
          { pa: 'DSTT-024', tipoServicio: '9' }, // CITV PERMISO MERCANCIA PUBLICO
          { pa: 'DSTT-024', tipoServicio: '10'}, // CITV PERMISO MERCANCIAS PRIVADO
          { pa: 'DSTT-024', tipoServicio: '9' }, // CITV PERMISO REGULAR DE PERSONAS*/
   ];
   tipoServicio = '';

   constructor(
      private formBuilder: UntypedFormBuilder,
      private funcionesMtcService: FuncionesMtcService,
      private modalService: NgbModal,
      private anexoService: Anexo002_A17_2Service,
      private paisService: PaisService,
      private vehiculoService: VehiculoService,
      private seguridadService: SeguridadService,
      private anexoTramiteService: AnexoTramiteService,
      private visorPdfArchivosService: VisorPdfArchivosService,
      public activeModal: NgbActiveModal,
      private formularioTramiteService: FormularioTramiteService,
   ) { }

   ngOnInit(): void {
      // ==================================================================================
      // RECUPERAMOS NOMBRE DEL TUPA:
      const tramiteSelected = JSON.parse(localStorage.getItem('tramite-selected'));
      this.codigoProcedimientoTupa = tramiteSelected.codigo;
      this.descProcedimientoTupa = tramiteSelected.nombre;
      this.codigoTipoSolicitudTupa = (this.dataInput.tipoSolicitudTupaCod === '' ? '0' : this.dataInput.tipoSolicitudTupaCod);
      this.descTipoSolicitudTupa = this.dataInput.tipoSolicitudTupaDesc;
      console.log("codigo tipo solicitus:" + this.codigoTipoSolicitudTupa);
      // ==================================================================================

      this.uriArchivo = this.dataInput.rutaDocumento;

      this.listaPasoFrontera.push({ value: 1, text: 'Desaguadero' });
      this.listaPasoFrontera.push({ value: 2, text: 'Santa Rosa' });
      // if (this.dataInput.tipoSolicitud.codigo === 3) {//SOLO TRANSPORTE PERSONAL
      this.listaPasoFrontera.push({ value: 3, text: 'Kasani' });
      // }
      this.listaPasoFrontera.push({ value: 4, text: 'Iñapari' });

      this.anexoFG = this.formBuilder.group({
         a_Seccion1FG: this.formBuilder.group({
            a_s1_PaisesOperarFA: this.formBuilder.array([], this.paisesOperarValidator()),
            a_s1_TransIntFG: this.formBuilder.group({
               a_s1_ti_DestinoFC: ['', [Validators.required]],
               a_s1_ti_CiudadesOperarFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(50)]],
               a_s1_ti_PaisesTransitoFA: this.formBuilder.array([], this.paisesOperarValidator()),
               a_s1_ti_FrecuenciaFC: ['', [Validators.required]],
               a_s1_ti_NumeroFrecuenciaFC: ['', [Validators.required, Validators.maxLength(2)]],
               a_s1_ti_HorarioSalidaFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(50)]],
               a_s1_ti_TiempoPromedioViajeFC: ['', [Validators.required, Validators.maxLength(2)]],
            }),
         }),
         a_Seccion2FG: this.formBuilder.group({
            a_s2_FlotaFC: ['', [Validators.required]],
         }),
         a_Seccion3FG: this.formBuilder.group({
            a_s3_PlacaRodajeFC: this.formBuilder.control(''),
            a_s3_SoatFC: this.formBuilder.control({ value: '', disabled: true }),
            a_s3_CitvFC: this.formBuilder.control({ value: '', disabled: true }),
            a_s3_CafFC: this.formBuilder.control(false),
         }),
      });
   }

   async ngAfterViewInit(): Promise<void> {
      await this.datosSolicitante(this.dataInput.tramiteReqRefId);

      switch (this.seguridadService.getNameId()) {
         case '00001':
            this.tipoSolicitante = 'PN'; // persona natural
            break;
         case '00002':
            this.tipoSolicitante = 'PJ'; // persona juridica
            break;
         case '00004':
            this.tipoSolicitante = 'PE'; // persona extranjera
            break;
         case '00005':
            this.tipoSolicitante = 'PNR'; // persona natural con ruc
            break;
      }

      if (this.paSeccion1.indexOf(this.codigoProcedimientoTupa) > -1) {
         console.log('seccion-1 enabled');
         this.a_Seccion1FG.enable();
         this.acc.expand('seccion-1');
      } else {
         console.log('seccion-1 disabled');
         this.acc.collapse('seccion-1');
         this.a_Seccion1FG.disable();
      }

      if (this.paSeccion2.indexOf(this.codigoProcedimientoTupa) > -1) {
         console.log('seccion-2 enabled');
         this.a_Seccion2FG.enable();
         this.acc.expand('seccion-2');
      } else {
         console.log('seccion-2 disabled');
         this.acc.collapse('seccion-2');
         this.a_Seccion2FG.disable();
      }

      if (this.paTransInternacional.indexOf(this.codigoProcedimientoTupa) > -1) {
         this.a_s1_TransIntFG.enable();
      } else {
         this.a_s1_TransIntFG.disable();
      }

      await this.cargarDatos();
   }

   async datosSolicitante(FormularioId: number): Promise<void> {
      this.funcionesMtcService.mostrarCargando();
      try {
         const dataForm: any = await this.formularioTramiteService.get(FormularioId).toPromise();
         this.funcionesMtcService.ocultarCargando();

         const metaDataForm: any = JSON.parse(dataForm.metaData);
         const seccion3 = metaDataForm.seccion3;
         const seccion5 = metaDataForm.seccion5;

         console.log("Datos Formulario");
         console.log(metaDataForm);

         //this.tipoDocumentoSolicitante = seccion5.tipoDocumentoSolicitante;
         //this.nombreTipoDocumentoSolicitante = seccion5.nombreTipoDocumentoSolicitante;
         this.numeroDocumentoSolicitante = seccion5.numeroDocumentoSolicitante;
         this.nombresApellidosSolicitante = seccion5.nombresApellidosSolicitante;

      } catch (error) {
         console.error(error);
         this.funcionesMtcService
            .ocultarCargando()
            .mensajeError('Debe ingresar primero el Formulario');
      }
   }

   // GET FORM anexoFG
   get a_Seccion1FG(): UntypedFormGroup { return this.anexoFG.get('a_Seccion1FG') as UntypedFormGroup; }
   get a_s1_PaisesOperarFA(): UntypedFormArray { return this.a_Seccion1FG.get(['a_s1_PaisesOperarFA']) as UntypedFormArray; }
   get a_s1_TransIntFG(): UntypedFormGroup { return this.a_Seccion1FG.get('a_s1_TransIntFG') as UntypedFormGroup; }
   get a_s1_ti_DestinoFC(): AbstractControl { return this.a_s1_TransIntFG.get(['a_s1_ti_DestinoFC']); }
   get a_s1_ti_CiudadesOperarFC(): AbstractControl { return this.a_s1_TransIntFG.get(['a_s1_ti_CiudadesOperarFC']); }
   get a_s1_ti_PaisesTransitoFA(): UntypedFormArray { return this.a_s1_TransIntFG.get(['a_s1_ti_PaisesTransitoFA']) as UntypedFormArray; }
   get a_s1_ti_FrecuenciaFC(): AbstractControl { return this.a_s1_TransIntFG.get(['a_s1_ti_FrecuenciaFC']); }
   get a_s1_ti_NumeroFrecuenciaFC(): AbstractControl { return this.a_s1_TransIntFG.get(['a_s1_ti_NumeroFrecuenciaFC']); }
   get a_s1_ti_HorarioSalidaFC(): AbstractControl { return this.a_s1_TransIntFG.get(['a_s1_ti_HorarioSalidaFC']); }
   get a_s1_ti_TiempoPromedioViajeFC(): AbstractControl { return this.a_s1_TransIntFG.get(['a_s1_ti_TiempoPromedioViajeFC']); }
   get a_Seccion2FG(): UntypedFormGroup { return this.anexoFG.get('a_Seccion2FG') as UntypedFormGroup; }
   get a_s2_FlotaFC(): AbstractControl { return this.a_Seccion2FG.get(['a_s2_FlotaFC']); }
   get a_Seccion3FG(): UntypedFormGroup { return this.anexoFG.get('a_Seccion3FG') as UntypedFormGroup; }
   get a_s3_PlacaRodajeFC(): AbstractControl { return this.a_Seccion3FG.get(['a_s3_PlacaRodajeFC']); }
   get a_s3_SoatFC(): AbstractControl { return this.a_Seccion3FG.get(['a_s3_SoatFC']); }
   get a_s3_CitvFC(): AbstractControl { return this.a_Seccion3FG.get(['a_s3_CitvFC']); }
   get a_s3_CafFC(): AbstractControl { return this.a_Seccion3FG.get(['a_s3_CafFC']); }

   // a_s1_po_CheckFC(index: string): AbstractControl { return this.a_s1_PaisesOperarFA.get([index, 'text']); }
   // a_s1_pt_CheckFC(index: string): AbstractControl { return this.a_s1_ti_PaisesTransitoFA.get([index, 'text']); }


   // FIN GET FORM anexoFG

   changeNumeroFrecuencia(event: any): void {
      if (event.target.value) {
         this.a_s1_ti_NumeroFrecuenciaFC.enable({ emitEvent: false });
         this.a_s1_ti_NumeroFrecuenciaFC.reset('', { emitEvent: false });
      } else {
         this.a_s1_ti_NumeroFrecuenciaFC.disable({ emitEvent: false });
      }
   }

   async vistaPreviaCaf(): Promise<void> {
      if (this.filePdfCafPathName) {
         this.funcionesMtcService.mostrarCargando();
         try {
            const file: Blob = await this.visorPdfArchivosService.get(this.filePdfCafPathName).toPromise();
            this.funcionesMtcService.ocultarCargando();

            this.filePdfCafSeleccionado = (file as File);
            this.filePdfCafPathName = null;

            this.visualizarGrillaPdf(this.filePdfCafSeleccionado, this.a_s3_PlacaRodajeFC.value);
         }
         catch (e) {
            this.funcionesMtcService
               .ocultarCargando()
               .mensajeError('Problemas para descargar Pdf');
         }
      } else {
         this.visualizarGrillaPdf(this.filePdfCafSeleccionado, this.a_s3_PlacaRodajeFC.value);
      }
   }

   onChangeInputCaf(event: any): void {
      if (event.target.files.length === 0) {
         return;
      }

      if (event.target.files[0].type !== 'application/pdf') {
         event.target.value = '';
         this.funcionesMtcService.mensajeError('Solo puede adjuntar archivos PDF');
         return;
      }

      const msg = ValidateFileSize_Formulario(event.target.files[0], 'Debe adjuntarlo como documento adicional');
      if (msg !== 'ok') {
         event.target.value = '';
         this.funcionesMtcService.mensajeError(msg);
         return;
      }

      this.filePdfCafSeleccionado = event.target.files[0];
      this.filePdfCafPathName = null;
      event.target.value = '';
   }

   onChangeCaf(event: boolean): void {
      this.visibleButtonCarf = event;

      if (this.visibleButtonCarf === true) {
         this.funcionesMtcService
            .mensajeConfirmar('¿Declaro que la información adjunta en el archivo es verídica?', 'DECLARACIÓN')
            .catch(() => {
               this.visibleButtonCarf = false;
               this.a_s3_CafFC.setValue(false);
            });
      } else {
         this.filePdfCafSeleccionado = null;
         this.filePdfCafPathName = null;
      }
   }

   paisesOperarValidator(): ValidatorFn {
      return (formArray: UntypedFormArray): ValidationErrors | null => {
         let valid = false;
         formArray.value.forEach((item) => {
            if (item.checked === true) {
               valid = item.checked;
            }
         });
         return valid ? null : { errorChecked: 'Sin checked' };
      };
   }

   formInvalid(control: AbstractControl): boolean {
      if (control) {
         return control.invalid && (control.dirty || control.touched);
      }
   }

   addPaisFormGroup(paisResponse: PaisResponse, disabled: boolean): UntypedFormGroup {
      const formGroup = this.formBuilder.group({
         checked: this.formBuilder.control(false),
         value: this.formBuilder.control(paisResponse.value),
         text: this.formBuilder.control(paisResponse.text),
      });
      if (disabled) {
         formGroup.disable();
      }
      return formGroup;
   }

   async cargarDatos(): Promise<void> {
      this.funcionesMtcService.mostrarCargando();

      try {
         const data = await this.paisService.get<Array<PaisResponse>>('ARG,BOL,BRA,CHL,PRY,URY').toPromise();
         this.funcionesMtcService.ocultarCargando();

         this.listaPaises = data;

         this.listaPaises.map((item, index) => {
            item.text = item.text.capitalize();

            const disablePaisesOperarFA = this.a_Seccion1FG.disabled;
            const disablePaisesTransitoFA = this.a_s1_TransIntFG.disabled;

            this.a_s1_PaisesOperarFA.push(this.addPaisFormGroup(item, disablePaisesOperarFA));
            this.a_s1_ti_PaisesTransitoFA.push(this.addPaisFormGroup(item, disablePaisesTransitoFA));
         });
      }
      catch (e) {
         console.error(e);
         this.errorAlCargarData = true;
         this.funcionesMtcService
            .ocultarCargando()
            .mensajeError('Problemas para cargar paises');
      }

      if (this.dataInput.movId > 0) {
         // RECUPERAMOS LOS DATOS
         try {
            const dataAnexo = await this.anexoTramiteService.get<any>(this.dataInput.tramiteReqId).toPromise();
            const metaData: any = JSON.parse(dataAnexo.metaData);

            console.log('metaData: ', metaData);

            this.idAnexo = dataAnexo.anexoId;

            if (this.a_Seccion1FG.enabled) {
               // PERMISO ORIGINARIO
               metaData.seccion1.paisesJson = {};

               for (const paisOperar of metaData.seccion1.paisesOperar) {
                  metaData.seccion1.paisesJson[paisOperar.value] = paisOperar;
               }

               for (const control of this.a_s1_PaisesOperarFA.controls) {
                  control.get('checked').setValue(metaData.seccion1.paisesJson[control.get('value').value]?.checked ?? false);
               }


               for (const control of this.a_s1_ti_PaisesTransitoFA.controls) {
                  if (metaData.seccion1.paisesTransito != null) {
                     if (metaData.seccion1.paisesTransito.indexOf(control.get('text').value) !== -1) {
                        control.get('checked').setValue(true);
                     }
                  }
               }


               // i = 0;
               // for (const control of this.a_s1_PaisesOperarFA.value) {
               //   if (metaData.seccion1.paisesJson[control.value]) {

               //     this.a_s1_po_CheckFC(i);
               //     this.a_s1_PaisesOperarFA.controls[i].setValue(metaData.seccion1.paisesJson[control.value].checked ?? false);
               //   }
               //   if (metaData.seccion1.paisesTransito.indexOf(control.text) !== -1) {
               //     this.a_s1_ti_PaisesTransitoFA.controls[i].setValue(true);
               //   }
               //   i++;
               // }

               this.a_s1_ti_DestinoFC.setValue(metaData.seccion1?.destino?.Value);
               this.a_s1_ti_CiudadesOperarFC.setValue(metaData.seccion1.ciudadesOperar);
               this.a_s1_ti_FrecuenciaFC.setValue(metaData.seccion1.numeroFrecuencias?.split('-')[0].trim(), { emitEvent: false });
               this.a_s1_ti_NumeroFrecuenciaFC.setValue(metaData.seccion1.numeroFrecuencias?.split('-')[1].trim());
               this.a_s1_ti_HorarioSalidaFC.setValue(metaData.seccion1.horariosSalida);
               this.a_s1_ti_TiempoPromedioViajeFC.setValue(metaData.seccion1.tiempoPromedioViaje);
            }

            if (this.a_Seccion2FG.enabled) {
               this.a_s2_FlotaFC.setValue(metaData.seccion2.flotaAlta === true ? '1' : '2');
            }

            for (const itemS3 of metaData.seccion3) {
               this.listaFlotaVehicular.push({
                  placaRodaje: itemS3.placaRodaje,
                  soat: itemS3.soat,
                  citv: itemS3.citv,
                  caf: itemS3.caf === true || itemS3.caf === 'true' ? true : false,
                  pathName: itemS3.pathName,
                  file: null
               });
            }
         }
         catch (e) {
            console.error(e);
            this.errorAlCargarData = true;
            this.funcionesMtcService
               .ocultarCargando()
               .mensajeError('Problemas para recuperar los datos guardados del anexo');
         }
      }

      // this.listaPaises.push(
      //   { value: "13", text: 'Argentina' } as PaisResponse,
      //   { value: "29", text: 'Bolivia' } as PaisResponse,
      //   { value: "33", text: 'Brasil' } as PaisResponse,
      //   { value: "46", text: 'Chile' } as PaisResponse,
      //   { value: "172", text: 'Paraguay' } as PaisResponse,
      //   { value: "229", text: 'Uruguay' } as PaisResponse
      // );

   }

   get maxLengthPlacaRodaje(): number {
      if (this.tipoSolicitante === 'PNR') {
         return 20;
      }
      else {
         return 6;
      }
   }

   changeTipo(value) {
      if (this.listaFlotaVehicular.length > 0) {
         this.funcionesMtcService
            .mensajeConfirmar('Se eliminarán las unidades vehiculares ingresadas. ¿Desea continuar?')
            .then(() => {
               this.listaFlotaVehicular = [];
            })
            .catch(() => {
               this.a_s2_FlotaFC.setValue(value);
            });

      }
   }

   changePlacaRodaje(): void {
      this.a_s3_SoatFC?.reset('');
      this.a_s3_CitvFC?.reset('');
      this.listaPlacaNumero = [];
   }

   async buscarPlacaRodaje(): Promise<void> {
      const placaRodaje = this.a_s3_PlacaRodajeFC.value.trim();
      if (placaRodaje.length !== 6) {
         return;
      }

      if (this.a_s2_FlotaFC.value == "") {
         this.funcionesMtcService.mensajeError('Debe seleccionar si corresponde a ALTA o BAJA en la sección II.');
         return;
      }

      this.changePlacaRodaje();

      this.funcionesMtcService.mostrarCargando();

      try {
         const respuesta = await this.vehiculoService.getPlacaRodaje(placaRodaje).toPromise();
         console.log(respuesta);
         this.funcionesMtcService.ocultarCargando();

         if (respuesta.categoria === '' || respuesta.categoria === '-' || respuesta.categoria === null) {
            this.funcionesMtcService.mensajeError('La placa de rodaje no tiene categoría definida.');
            return;
         }

         if (respuesta.categoria.charAt(0) === 'N' || respuesta.categoria.charAt(0) === 'M') {
            if (this.a_s2_FlotaFC.value == 2) {
               if (respuesta.soat.estado === '') {
                  this.a_s3_SoatFC.setValue('-');
               }
            } else {

               if (respuesta.soat.estado === '') {
                  this.funcionesMtcService.mensajeError('La placa de rodaje ingresada no cuenta con SOAT');
                  return;
               }
               if (respuesta.soat.estado !== 'VIGENTE') {
                  this.funcionesMtcService.mensajeError('El número de SOAT del vehículo no se encuentra VIGENTE');
                  return;
               }
            }
         }

         this.a_s3_SoatFC.setValue(respuesta.soat.numero || '-');

         let band = false;
         let placasNumero: string[] = [];
         if (this.a_s2_FlotaFC.value == 2) {
            this.a_s3_CitvFC.setValue('-');
         } else {
            if (respuesta.citvs.length > 0) {
               for (const placa of respuesta.citvs) {
                  if (this.paTipoServicio.find(i => i.pa === this.codigoProcedimientoTupa && i.tipoServicio === placa.tipoId) !== undefined) {
                     placasNumero.push(placa.numero)
                     band = true;
                  }
               }

               if (respuesta.nuevo) {

                  this.listaPlacaNumero = placasNumero.length > 0 ? placasNumero : ['-']
                  this.a_s3_CitvFC.setValue(this.listaPlacaNumero[0]);
               } else {
                  if (!band) {
                     return this.funcionesMtcService.mensajeError('El número de CITV no es para el servicio ofertado');
                  }
                  else {
                     //this.listaPlacaNumero = ['-']

                     this.listaPlacaNumero = placasNumero.length > 0 ? placasNumero : ['-'];
                     this.a_s3_CitvFC.setValue(this.listaPlacaNumero[0]);
                  }
               }
            } else {
               if (respuesta.nuevo) {
                  this.listaPlacaNumero = ['-']
                  this.a_s3_CitvFC.setValue(this.listaPlacaNumero[0]);
               } else {
                  return this.funcionesMtcService.mensajeError('La placa no cuenta con CITV');
               }
            }
            if (this.listaPlacaNumero.length > 1)
               this.a_s3_CitvFC.enable()
            else
               this.a_s3_CitvFC.disable()
         }




      }
      catch (e) {
         this.funcionesMtcService
            .ocultarCargando()
            .mensajeError('En este momento el servicio de SUNARP no se encuentra disponible. Vuelva a intentarlo más tarde.');
      }
   }

   cancelarFlotaVehicular(): void {
      this.indexEditTabla = -1;

      this.a_s3_PlacaRodajeFC.reset('', { emitEvent: false });
      this.a_s3_SoatFC?.reset('');
      this.a_s3_CitvFC?.reset('');
      this.a_s3_CafFC.reset(false);
      this.listaPlacaNumero = [];
      this.a_s3_CitvFC.disable();

      this.filePdfCafSeleccionado = null;
      this.filePdfCafPathName = null;
      this.visibleButtonCarf = false;
   }

   agregarFlotaVehicular(): void {
      if (this.tipoSolicitante !== 'PNR') {

         if (
            this.a_s3_PlacaRodajeFC.value.trim() === '' ||
            this.a_s3_SoatFC.value.trim() === '' ||
            this.a_s3_CitvFC.value.trim() === ''
         ) {
            this.funcionesMtcService.mensajeError('La placa de rodaje no es válida o no cuenta con SOAT y/o CITV');
            return;
         }
      }
      else {
         if (this.a_s3_PlacaRodajeFC.value.trim() === '') {
            this.funcionesMtcService.mensajeError('Debe ingresar la placa de rodaje');
            return;
         }
      }

      if (this.a_s3_CafFC.value === true && (!this.filePdfCafSeleccionado && !this.filePdfCafPathName)) {
         this.funcionesMtcService.mensajeError('A seleccionado C.A.F, debe cargar un archivo PDF');
         return;
      }

      const placaRodaje = this.a_s3_PlacaRodajeFC.value.trim().toUpperCase();
      const indexFind = this.listaFlotaVehicular.findIndex(item => item.placaRodaje === placaRodaje);

      // Validamos que la placa de rodaje no esté incluida en la grilla
      if (indexFind !== -1) {
         if (indexFind !== this.indexEditTabla) {
            this.funcionesMtcService.mensajeError('El vehículo ya se encuentra registrado');
            return;
         }
      }

      if (this.indexEditTabla === -1) {
         this.listaFlotaVehicular.push({
            placaRodaje,
            soat: this.a_s3_SoatFC?.value ?? '',
            citv: this.a_s3_CitvFC?.value ?? '',
            caf: this.a_s3_CafFC.value,
            file: this.filePdfCafSeleccionado
         });
      } else {
         this.listaFlotaVehicular[this.indexEditTabla].placaRodaje = placaRodaje;
         this.listaFlotaVehicular[this.indexEditTabla].soat = this.a_s3_SoatFC?.value ?? '',
            this.listaFlotaVehicular[this.indexEditTabla].citv = this.a_s3_CitvFC?.value ?? '',
            this.listaFlotaVehicular[this.indexEditTabla].caf = this.a_s3_CafFC.value;
         this.listaFlotaVehicular[this.indexEditTabla].file = this.filePdfCafSeleccionado;
      }

      this.cancelarFlotaVehicular();
   }

   modificarFlotaVehicular(item: A002_A17_2_Seccion3, index): void {
      if (this.indexEditTabla !== -1) {
         return;
      }

      this.indexEditTabla = index;

      this.a_s3_PlacaRodajeFC.setValue(item.placaRodaje);
      this.a_s3_SoatFC.setValue(item.soat);
      this.a_s3_CitvFC.setValue(item.citv);

      this.a_s3_CafFC.setValue(item.caf);
      this.visibleButtonCarf = item.caf;

      this.filePdfCafSeleccionado = item.file;
      this.filePdfCafPathName = item.pathName;
   }

   eliminarFlotaVehicular(item: A002_A17_2_Seccion3, index): void {
      if (this.indexEditTabla === -1) {

         this.funcionesMtcService
            .mensajeConfirmar('¿Está seguro de eliminar el registro seleccionado?')
            .then(() => {
               this.listaFlotaVehicular.splice(index, 1);
            });
      }
   }

   soloNumeros(event): void {
      event.target.value = event.target.value.replace(/[^0-9]/g, '');
   }

   async verPdfCafGrilla(item: A002_A17_2_Seccion3): Promise<void> {
      if (this.indexEditTabla !== -1) {
         return;
      }

      if (item.pathName) {
         this.funcionesMtcService.mostrarCargando();
         try {
            const file: Blob = await this.visorPdfArchivosService.get(item.pathName).toPromise();
            this.funcionesMtcService.ocultarCargando();

            item.file = (file as File);
            item.pathName = null;

            this.visualizarGrillaPdf(item.file, item.placaRodaje);
         }
         catch (e) {
            this.funcionesMtcService
               .ocultarCargando()
               .mensajeError('Problemas para descargar Pdf');
         }
      } else {
         this.visualizarGrillaPdf(item.file, item.placaRodaje);
      }
   }

   visualizarGrillaPdf(file: File, placaRodaje: string): void {
      const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
      const urlPdf = URL.createObjectURL(file);
      modalRef.componentInstance.pdfUrl = urlPdf;
      modalRef.componentInstance.titleModal = 'Vista Previa - Placa Rodaje: ' + placaRodaje;
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
         modalRef.componentInstance.titleModal = 'Vista Previa - Anexo 002-A/17.02';
      }
      catch (e) {
         console.error(e);
         this.funcionesMtcService
            .ocultarCargando()
            .mensajeError('Problemas para descargar Pdf');
      }
   }

   guardarAnexo(): void {
      if (this.anexoFG.invalid === true) {
         this.funcionesMtcService.mensajeError('Debe ingresar todos los campos obligatorios');
         return;
      }

      if (this.listaFlotaVehicular.length === 0) {
         this.funcionesMtcService.mensajeError('Debe ingresar al menos una flota vehicular');
         return;
      }

      const dataGuardar = new Anexo002_A17_2Request();
      // -------------------------------------
      dataGuardar.id = this.idAnexo;
      dataGuardar.movimientoFormularioId = this.dataInput.tramiteReqRefId;
      dataGuardar.anexoId = 1;
      dataGuardar.codigo = 'A';
      dataGuardar.tramiteReqId = this.dataInput.tramiteReqId;
      // -------------------------------------
      // SECCION 1:
      if (this.a_Seccion1FG.enabled) {
         const seccion1: A002_A17_2_Seccion1 = new A002_A17_2_Seccion1();
         seccion1.paisesOperar = this.a_s1_PaisesOperarFA.value.map(item => {
            return { value: item.value, text: item.text, _checked: item.checked } as PaisResponse;
         });
         if (this.a_s1_TransIntFG.enabled) {
            seccion1.origen = 'PERÚ';
            seccion1.destino =
               {
                  value: this.a_s1_ti_DestinoFC.value,
                  text: this.listaPaises.filter(item => item.value === this.a_s1_ti_DestinoFC.value)[0].text
               } as PaisResponse;

            seccion1.ciudadesOperar = this.a_s1_ti_CiudadesOperarFC.value.trim().toUpperCase();
            seccion1.numeroFrecuencias = `${this.a_s1_ti_FrecuenciaFC.value} - ${this.a_s1_ti_NumeroFrecuenciaFC.value}`;
            seccion1.horariosSalida = this.a_s1_ti_HorarioSalidaFC.value.trim();
            seccion1.tiempoPromedioViaje = parseInt(this.a_s1_ti_TiempoPromedioViajeFC.value, 10);
            seccion1.paisesTransito = this.a_s1_ti_PaisesTransitoFA.value.filter(item => item.checked).map(item => item.text).join(', ');
         }
         dataGuardar.metaData.seccion1 = seccion1;
      }
      console.log(dataGuardar.metaData.seccion1);
      // -------------------------------------
      if (this.a_Seccion2FG.enabled) {
         const seccion2 = new A002_A17_2_Seccion2();
         seccion2.flotaAlta = this.a_s2_FlotaFC.value === '1';
         seccion2.flotaBaja = this.a_s2_FlotaFC.value === '2';
         dataGuardar.metaData.seccion2 = seccion2;
      }
      console.log("Seccion2: " + this.a_s2_FlotaFC.value);
      // -------------------------------------
      if (this.a_Seccion3FG.enabled) {
         dataGuardar.metaData.seccion3 = this.listaFlotaVehicular.map(item => {
            return {
               placaRodaje: item.placaRodaje,
               soat: item.soat,
               citv: item.citv,
               caf: item.caf,
               file: item.file,
               pathName: item.pathName
            } as A002_A17_2_Seccion3;
         });
      }

      //dataGuardar.metaData.tipoDocumentoSolicitante:string;
      //dataGuardar.metaData.nombreTipoDocumentoSolicitante:string;
      dataGuardar.metaData.numeroDocumentoSolicitante = this.numeroDocumentoSolicitante;
      dataGuardar.metaData.nombresApellidosSolicitante = this.nombresApellidosSolicitante;
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

}
