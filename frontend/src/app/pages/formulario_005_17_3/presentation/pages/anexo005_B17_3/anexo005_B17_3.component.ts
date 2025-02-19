/**
 * Anexo 005-B/17.03 DCV-015 DCV-016 DCV-017 Y DCV-18
 * @author Alicia Toquila
 * @version 1.0 21.03.2024
 */

import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, Input, OnInit, Injectable, ViewChild } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, AbstractControlOptions,  AbstractControl,  UntypedFormControl, FormArray, Form } from '@angular/forms';
import { NgbActiveModal, NgbAccordionDirective, NgbModal, NgbDateStruct, NgbDatepickerI18n, NgbDateParserFormatter, NgbDateAdapter } from '@ng-bootstrap/ng-bootstrap';
import { FuncionesMtcService } from '../../../../../core/services/funciones-mtc.service';
import { AnexoTramiteService } from '../../../../../core/services/tramite/anexo-tramite.service';
import { VisorPdfArchivosService } from '../../../../../core/services/tramite/visor-pdf-archivos.service';
import { VistaPdfComponent } from '../../../../../shared/components/vista-pdf/vista-pdf.component';
import { noWhitespaceValidator } from '../../../../../helpers/validator';
import { SeguridadService } from '../../../../../core/services/seguridad.service';
import { Anexo005_B17_3Response } from '../../../domain/anexo005_B17_3/anexo005_B17_3Response';
import { Anexo005_B17_3Request, MetaData, Seccion1 } from '../../../domain/anexo005_B17_3/anexo005_B17_3Request';
import { CONSTANTES } from '../../../../../enums/constants';
import { Anexo005_B17_3Service } from '../../../application/usecases';
import { TipoDocumentoModel } from '../../../../../core/models/TipoDocumentoModel';
import { FormularioTramiteService } from '../../../../../core/services/tramite/formulario-tramite.service';
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
	// tslint:disable-next-line: component-selector
	selector: 'app-anexo005_B17_3',
	templateUrl: './anexo005_B17_3.component.html',
	styleUrls: ['./anexo005_B17_3.component.css'],
	providers: [
      { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
      I18n, { provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n } // define custom NgbDatepickerI18n provider
   ]
})

export class Anexo005_B17_3_Component implements OnInit, AfterViewInit, AfterViewChecked { //,  
	@Input() public dataInput: any;
	@ViewChild('acc') acc: NgbAccordionDirective;

	txtTitulo = 'ANEXO 005-B/17.03 RELACION DE EQUIPAMIENTO DEL TALLER DE CONVERSION A GAS LICUADO DE PETROLEO - GLP O TALLER DE CONVERSION A GAS NATURAL VEHICULAR - GNV';

	graboUsuario = false;

	idAnexo = 0;
	uriArchivo = ''; // PARA SABER EL NOMBRE DEL PDF (COMPLETO CON TODO Y ADJUNTOS)
	errorAlCargarData = false; // VARIABLE PARA CONTROLAR CUANDO OCURRE UN ERROR AL RECUPERAR LOS DATOS GUARDADOS DEL ANEXO

	anexoFG: UntypedFormGroup;

	tipoSolicitante: string;

	tipoDocumentoSolicitante: string;
	nombreTipoDocumentoSolicitante: string;
	numeroDocumentoSolicitante: string;
	nombresApellidosSolicitante: string;

	visibleButtonDocumentos = true;
	filePdfDocumentosSeleccionado: any = null;
	pathPdfDocumentosSeleccionado: any = null;

	// CODIGO Y NOMBRE DEL PROCEDIMIENTO:
	codigoProcedimientoTupa: string;
	descProcedimientoTupa: string;

	tipoDocumento = '';
	nroDocumento = '';
	nroRuc = '';
	nombreCompleto = '';
	razonSocial = '';
	domicilioLegal = '';

	paGNV = ["DCV-015","DCV-016"];
	paGLP = ["DCV-017","DCV-018"];

	activarGNV:boolean = true;
	activarGLP:boolean = true;

	fechaGases: string = "";
	fechaCertificado: string = "";

	constructor(
		private fb: UntypedFormBuilder,
		private funcionesMtcService: FuncionesMtcService,
		private modalService: NgbModal,
		private anexoService: Anexo005_B17_3Service,
		private seguridadService: SeguridadService,
		private anexoTramiteService: AnexoTramiteService,
		private visorPdfArchivosService: VisorPdfArchivosService,
		public activeModal: NgbActiveModal,
		private readonly changeDetectorRef: ChangeDetectorRef,
		private formularioTramiteService: FormularioTramiteService
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

		// ==================================================================================

		if (this.paGNV.indexOf(this.codigoProcedimientoTupa) > -1) this.activarGNV = true; else this.activarGNV = false;
		if (this.paGLP.indexOf(this.codigoProcedimientoTupa) > -1) this.activarGLP = true; else this.activarGLP = false;

		this.uriArchivo = this.dataInput.rutaDocumento;
		//Validators.requiredTrue
		this.anexoFG = this.fb.group({
			a_Seccion1: this.fb.group({ 
				a_s1_resolucionGases: this.fb.control('', [Validators.required]),
				a_s1_fechaResolucionGases: this.fb.control(null,[Validators.required]),
				a_s1_certificado: (this.activarGLP ? ['', [Validators.required]] : ['']),
				a_s1_fechaCertificado: (this.activarGLP ? [{ value: null, disabled: false }, [Validators.required]] : this.fb.control(null)),
				a_s1_declaracion_1: [{ value: false, disabled: false }, [Validators.requiredTrue]],
				a_s1_declaracion_2: (this.activarGLP ? [{ value: false, disabled: false }, [Validators.requiredTrue]] : [{ value: false, disabled: false }]),
				a_s1_declaracion_3: (this.activarGNV ? [{ value: false, disabled: false }, [Validators.requiredTrue]] : [{ value: false, disabled: false }]),
				a_s1_declaracion_4: (this.activarGNV ? [{ value: false, disabled: false }, [Validators.requiredTrue]] : [{ value: false, disabled: false }]),
				a_s1_declaracion_5: (this.activarGNV ? [{ value: false, disabled: false }, [Validators.requiredTrue]] : [{ value: false, disabled: false }]),
				a_s1_declaracion_6: (this.activarGNV ? [{ value: false, disabled: false }, [Validators.requiredTrue]] : [{ value: false, disabled: false }]),
				a_s1_declaracion_7: [{ value: false, disabled: false }, [Validators.requiredTrue]],
				a_s1_declaracion_81: [{ value: false, disabled: false }, [Validators.requiredTrue]],
				a_s1_declaracion_82: [{ value: false, disabled: false }, [Validators.requiredTrue]],
				a_s1_declaracion_83: [{ value: false, disabled: false }, [Validators.requiredTrue]],
				a_s1_declaracion_84: [{ value: false, disabled: false }, [Validators.requiredTrue]],
				a_s1_declaracion_85: [{ value: false, disabled: false }, [Validators.requiredTrue]],
				a_s1_declaracion_86: [{ value: false, disabled: false }, [Validators.requiredTrue]],
				a_s1_declaracion_87: [{ value: false, disabled: false }, [Validators.requiredTrue]],
				a_s1_declaracion_88: [{ value: false, disabled: false }, [Validators.requiredTrue]],
				a_s1_declaracion_89: [{ value: false, disabled: false }, [Validators.requiredTrue]],
				a_s1_declaracion_810: [{ value: false, disabled: false }, [Validators.requiredTrue]],
				a_s1_declaracion_811: [{ value: false, disabled: false }, [Validators.requiredTrue]],
				a_s1_declaracion_812: [{ value: false, disabled: false }, [Validators.requiredTrue]],
				a_s1_declaracion_813: [{ value: false, disabled: false }, [Validators.requiredTrue]],
				a_s1_declaracion_814: [{ value: false, disabled: false }, [Validators.requiredTrue]],
				a_s1_declaracion_815: (this.activarGNV ? [{ value: false, disabled: false }, [Validators.requiredTrue]] : [{ value: false, disabled: false }]),
				a_s1_declaracion_816: [{ value: false, disabled: false }, [Validators.requiredTrue]],
				a_s1_declaracion_817: [{ value: false, disabled: false }, [Validators.requiredTrue]],
				a_s1_declaracion_818: [{ value: false, disabled: false }, [Validators.requiredTrue]],
				a_s1_declaracion_819: [{ value: false, disabled: false }, [Validators.requiredTrue]],
				a_s1_declaracion_9: [{ value: false, disabled: false }, [Validators.requiredTrue]],
				a_s1_declaracion_10: [{ value: false, disabled: false }, [Validators.requiredTrue]],
				a_s1_declaracion_111: [{ value: false, disabled: false }, [Validators.requiredTrue]],
				a_s1_declaracion_112: [{ value: false, disabled: false }, [Validators.requiredTrue]],
				a_s1_declaracion_113: [{ value: false, disabled: false }, [Validators.requiredTrue]],
				a_s1_declaracion_114: [{ value: false, disabled: false }, [Validators.requiredTrue]],
				a_s1_declaracion_115: [{ value: false, disabled: false }, [Validators.requiredTrue]],
				a_s1_declaracion_12: [{ value: false, disabled: false }, [Validators.requiredTrue]],
				a_s1_declaracion_13: (this.activarGLP ? [{ value: false, disabled: false }, [Validators.requiredTrue]] : [{ value: false, disabled: false }]),
			}),
		});
	}

	async ngAfterViewInit(): Promise<void> {
		this.nroRuc = this.seguridadService.getCompanyCode();
		this.nombreCompleto = this.seguridadService.getUserName();          // nombre de usuario login
		this.nroDocumento = this.seguridadService.getNumDoc();      // nro de documento usuario login
		this.tipoDocumento = this.seguridadService.getNameId();

		this.tipoSolicitante = 'PJ'; // persona juridica
		this.tipoDocumento = '01';
		await this.cargarDatos();
	}

	get a_Seccion1(): UntypedFormGroup { return this.anexoFG.get('a_Seccion1') as UntypedFormGroup; }
	get a_s1_resolucionGases(): AbstractControl { return this.a_Seccion1.get(['a_s1_resolucionGases']);}
	get a_s1_fechaResolucionGases(): AbstractControl { return this.a_Seccion1.get(['a_s1_fechaResolucionGases']);}
	get a_s1_certificado(): AbstractControl { return this.a_Seccion1.get(['a_s1_certificado']);}
	get a_s1_fechaCertificado(): AbstractControl { return this.a_Seccion1.get(['a_s1_fechaCertificado']);}
	get a_s1_declaracion_1(): AbstractControl { return this.a_Seccion1.get(['a_s1_declaracion_1']);}
	get a_s1_declaracion_2(): AbstractControl { return this.a_Seccion1.get(['a_s1_declaracion_2']);}
	get a_s1_declaracion_3(): AbstractControl { return this.a_Seccion1.get(['a_s1_declaracion_3']);}
	get a_s1_declaracion_4(): AbstractControl { return this.a_Seccion1.get(['a_s1_declaracion_4']);}
	get a_s1_declaracion_5(): AbstractControl { return this.a_Seccion1.get(['a_s1_declaracion_5']);}
	get a_s1_declaracion_6(): AbstractControl { return this.a_Seccion1.get(['a_s1_declaracion_6']);}
	get a_s1_declaracion_7(): AbstractControl { return this.a_Seccion1.get(['a_s1_declaracion_7']);}
	get a_s1_declaracion_81(): AbstractControl { return this.a_Seccion1.get(['a_s1_declaracion_81']);}
	get a_s1_declaracion_82(): AbstractControl { return this.a_Seccion1.get(['a_s1_declaracion_82']);}
	get a_s1_declaracion_83(): AbstractControl { return this.a_Seccion1.get(['a_s1_declaracion_83']);}
	get a_s1_declaracion_84(): AbstractControl { return this.a_Seccion1.get(['a_s1_declaracion_84']);}
	get a_s1_declaracion_85(): AbstractControl { return this.a_Seccion1.get(['a_s1_declaracion_85']);}
	get a_s1_declaracion_86(): AbstractControl { return this.a_Seccion1.get(['a_s1_declaracion_86']);}
	get a_s1_declaracion_87(): AbstractControl { return this.a_Seccion1.get(['a_s1_declaracion_87']);}
	get a_s1_declaracion_88(): AbstractControl { return this.a_Seccion1.get(['a_s1_declaracion_88']);}
	get a_s1_declaracion_89(): AbstractControl { return this.a_Seccion1.get(['a_s1_declaracion_89']);}
	get a_s1_declaracion_810(): AbstractControl { return this.a_Seccion1.get(['a_s1_declaracion_810']);}
	get a_s1_declaracion_811(): AbstractControl { return this.a_Seccion1.get(['a_s1_declaracion_811']);}
	get a_s1_declaracion_812(): AbstractControl { return this.a_Seccion1.get(['a_s1_declaracion_812']);}
	get a_s1_declaracion_813(): AbstractControl { return this.a_Seccion1.get(['a_s1_declaracion_813']);}
	get a_s1_declaracion_814(): AbstractControl { return this.a_Seccion1.get(['a_s1_declaracion_814']);}
	get a_s1_declaracion_815(): AbstractControl { return this.a_Seccion1.get(['a_s1_declaracion_815']);}
	get a_s1_declaracion_816(): AbstractControl { return this.a_Seccion1.get(['a_s1_declaracion_816']);}
	get a_s1_declaracion_817(): AbstractControl { return this.a_Seccion1.get(['a_s1_declaracion_817']);}
	get a_s1_declaracion_818(): AbstractControl { return this.a_Seccion1.get(['a_s1_declaracion_818']);}
	get a_s1_declaracion_819(): AbstractControl { return this.a_Seccion1.get(['a_s1_declaracion_819']);}
	get a_s1_declaracion_9(): AbstractControl { return this.a_Seccion1.get(['a_s1_declaracion_9']);}
	get a_s1_declaracion_10(): AbstractControl { return this.a_Seccion1.get(['a_s1_declaracion_10']);}
	get a_s1_declaracion_111(): AbstractControl { return this.a_Seccion1.get(['a_s1_declaracion_111']);}
	get a_s1_declaracion_112(): AbstractControl { return this.a_Seccion1.get(['a_s1_declaracion_112']);}
	get a_s1_declaracion_113(): AbstractControl { return this.a_Seccion1.get(['a_s1_declaracion_113']);}
	get a_s1_declaracion_114(): AbstractControl { return this.a_Seccion1.get(['a_s1_declaracion_114']);}
	get a_s1_declaracion_115(): AbstractControl { return this.a_Seccion1.get(['a_s1_declaracion_115']);}
	get a_s1_declaracion_12(): AbstractControl { return this.a_Seccion1.get(['a_s1_declaracion_12']);}
	get a_s1_declaracion_13(): AbstractControl { return this.a_Seccion1.get(['a_s1_declaracion_13']);}

	async cargarDatos(): Promise<void> {
		this.funcionesMtcService.mostrarCargando();

		if (this.dataInput.movId > 0) {
			// RECUPERAMOS LOS DATOS
			try {
				const dataAnexo = await this.anexoTramiteService.get<Anexo005_B17_3Response>(this.dataInput.tramiteReqId).toPromise();
				console.log(JSON.parse(dataAnexo.metaData));
				const {
					tipoDocumentoSolicitante,
					nombreTipoDocumentoSolicitante,
					nombresApellidosSolicitante,
					numeroDocumentoSolicitante,
					seccion1
				} = JSON.parse(dataAnexo.metaData) as MetaData;

				this.idAnexo = dataAnexo.anexoId;

				this.a_s1_resolucionGases.setValue(seccion1.resolucionGases);
				this.a_s1_certificado.setValue(seccion1.certificado);
				this.a_s1_declaracion_1.setValue(seccion1.declaracion_1);
				this.a_s1_declaracion_2.setValue(seccion1.declaracion_2);
				this.a_s1_declaracion_3.setValue(seccion1.declaracion_3);
				this.a_s1_declaracion_4.setValue(seccion1.declaracion_4);
				this.a_s1_declaracion_5.setValue(seccion1.declaracion_5);
				this.a_s1_declaracion_6.setValue(seccion1.declaracion_6);
				this.a_s1_declaracion_7.setValue(seccion1.declaracion_7);
				this.a_s1_declaracion_81.setValue(seccion1.declaracion_81);
				this.a_s1_declaracion_82.setValue(seccion1.declaracion_82);
				this.a_s1_declaracion_83.setValue(seccion1.declaracion_83);
				this.a_s1_declaracion_84.setValue(seccion1.declaracion_84);
				this.a_s1_declaracion_85.setValue(seccion1.declaracion_85);
				this.a_s1_declaracion_86.setValue(seccion1.declaracion_86);
				this.a_s1_declaracion_87.setValue(seccion1.declaracion_87);
				this.a_s1_declaracion_88.setValue(seccion1.declaracion_88);
				this.a_s1_declaracion_89.setValue(seccion1.declaracion_89);
				this.a_s1_declaracion_810.setValue(seccion1.declaracion_810);
				this.a_s1_declaracion_811.setValue(seccion1.declaracion_811);
				this.a_s1_declaracion_812.setValue(seccion1.declaracion_812);
				this.a_s1_declaracion_813.setValue(seccion1.declaracion_813);
				this.a_s1_declaracion_814.setValue(seccion1.declaracion_814);
				this.a_s1_declaracion_815.setValue(seccion1.declaracion_815);
				this.a_s1_declaracion_816.setValue(seccion1.declaracion_816);
				this.a_s1_declaracion_817.setValue(seccion1.declaracion_817);
				this.a_s1_declaracion_818.setValue(seccion1.declaracion_818);
				this.a_s1_declaracion_819.setValue(seccion1.declaracion_819);
				this.a_s1_declaracion_9.setValue(seccion1.declaracion_9);
				this.a_s1_declaracion_10.setValue(seccion1.declaracion_10);
				this.a_s1_declaracion_111.setValue(seccion1.declaracion_111);
				this.a_s1_declaracion_112.setValue(seccion1.declaracion_112);
				this.a_s1_declaracion_113.setValue(seccion1.declaracion_113);
				this.a_s1_declaracion_114.setValue(seccion1.declaracion_114);
				this.a_s1_declaracion_115.setValue(seccion1.declaracion_115);
				this.a_s1_declaracion_12.setValue(seccion1.declaracion_12);
				this.a_s1_declaracion_13.setValue(seccion1.declaracion_13);
				this.pathPdfDocumentosSeleccionado = seccion1.pathNameDocumentos;

				this.setDateValue(this.a_s1_fechaResolucionGases, seccion1.fechaResolucionGases);

				if(this.activarGLP){
					this.setDateValue(this.a_s1_fechaCertificado, seccion1.fechaCertificado);
					this.fechaCertificado = seccion1.fechaCertificado;
				}
				
				this.fechaGases = seccion1.fechaResolucionGases;

				this.tipoDocumentoSolicitante = tipoDocumentoSolicitante;
				this.nombreTipoDocumentoSolicitante = nombreTipoDocumentoSolicitante;
				this.nombresApellidosSolicitante = nombresApellidosSolicitante;
				this.numeroDocumentoSolicitante = numeroDocumentoSolicitante;

				await this.cargarDatosSolicitante(this.dataInput.tramiteReqRefId);

			}
			catch (e) {
				console.error(e);
				this.errorAlCargarData = true;
				this.funcionesMtcService
					.ocultarCargando()
					.mensajeError('Problemas para recuperar los datos guardados del anexo');
			}
		} else {  // SI ES NUEVO
			await this.cargarDatosSolicitante(this.dataInput.tramiteReqRefId);
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
			modalRef.componentInstance.titleModal = 'Vista Previa - Anexo 005-B/17.03';
		}
		catch (e) {
			console.error(e);
			this.funcionesMtcService
				.ocultarCargando()
				.mensajeError('Problemas para descargar el archivo PDF');
		}
	}

	async cargarDatosSolicitante(FormularioId: number): Promise<void> {
		this.funcionesMtcService.mostrarCargando();

		try {
			const dataForm: any = await this.formularioTramiteService.get(FormularioId).toPromise();
			this.funcionesMtcService.ocultarCargando();

			const metaDataForm: any = JSON.parse(dataForm.metaData);
			const seccion4 = metaDataForm.seccion4;
			const seccion3 = metaDataForm.seccion3;
			const seccion6 = metaDataForm.seccion6;

			console.log("Datos Formulario");
			console.log(metaDataForm);

			this.tipoDocumentoSolicitante = seccion6.tipoDocumentoSolicitante;
			this.nombreTipoDocumentoSolicitante = seccion6.nombreTipoDocumentoSolicitante;
			this.numeroDocumentoSolicitante = seccion6.numeroDocumentoSolicitante;
			this.nombresApellidosSolicitante = seccion6.nombresApellidosSolicitante;

		} catch (error) {
			console.error(error);
			this.funcionesMtcService
				.ocultarCargando()
				.mensajeError('Debe ingresar primero el Formulario');
		}
		this.funcionesMtcService.ocultarCargando();
	}

	onChangeDocumentos(): void {
		this.visibleButtonDocumentos = this.anexoFG.controls['Documentos'].value.trim();

		if (this.visibleButtonDocumentos === true) {
			this.funcionesMtcService
				.mensajeConfirmar('¿Declaro que la información adjunta en el archivo es verídica?', 'DECLARACIÓN')
				.catch(() => {
					this.visibleButtonDocumentos = false;
					this.anexoFG.controls['Documentos'].setValue(false);
				});
		} else {
			this.filePdfDocumentosSeleccionado = null;
			this.pathPdfDocumentosSeleccionado = null;
		}
	}

	onChangeInputDocumentos(event): void {
		if (event.target.files.length === 0) {
			return;
		}
		if (event.target.files[0].type !== 'application/pdf') {
			event.target.value = '';
			this.funcionesMtcService.mensajeError('Solo puede adjuntar archivos PDF');
			return;
		}
		this.filePdfDocumentosSeleccionado = event.target.files[0];
		event.target.value = '';
	}

	vistaPreviaDocumentos(): void {
		if (this.pathPdfDocumentosSeleccionado === null || this.filePdfDocumentosSeleccionado !== null) {
			const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
			const urlPdf = URL.createObjectURL(this.filePdfDocumentosSeleccionado);
			modalRef.componentInstance.pdfUrl = urlPdf;
			modalRef.componentInstance.titleModal = 'Vista Previa - Documentos sustentatorios';
		} else {
			this.funcionesMtcService.mostrarCargando();

			this.visorPdfArchivosService.get(this.pathPdfDocumentosSeleccionado)
				.subscribe(
					(file: Blob) => {
						this.funcionesMtcService.ocultarCargando();
						const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
						const urlPdf = URL.createObjectURL(file);
						modalRef.componentInstance.pdfUrl = urlPdf;
						modalRef.componentInstance.titleModal = 'Vista Previa - Documentos sustentatorios';
					},
					error => {
						this.funcionesMtcService
							.ocultarCargando()
							.mensajeError('Problemas para descargar Pdf');
					}
				);
		}
	}

	async guardarAnexo(): Promise<void> {
		this.findInvalidControls();
		//console.log("FG: " + this.fechaGases);

		let fechaResolucionGases: string = "";
		let fechaCertificado: string = "";

		if (this.anexoFG.invalid === true) {
			this.funcionesMtcService.mensajeError('Debe ingresar todos los campos obligatorios');
			return;
		}

		//if (this.activarDocumentos) {
			if (!this.filePdfDocumentosSeleccionado && !this.pathPdfDocumentosSeleccionado) {
				this.funcionesMtcService.mensajeError('Debe adjuntar los documentos sustentatorios.');
				return;
			}
		//}

		fechaResolucionGases = (String(this.a_s1_fechaResolucionGases.value.day).length > 1 ? this.a_s1_fechaResolucionGases.value.day : "0" + this.a_s1_fechaResolucionGases.value.day) + "/" + (String(this.a_s1_fechaResolucionGases.value.month).length > 1 ? this.a_s1_fechaResolucionGases.value.month : "0" + this.a_s1_fechaResolucionGases.value.month) + "/" + this.a_s1_fechaResolucionGases.value.year;
		if(this.activarGLP)
		fechaCertificado = (String(this.a_s1_fechaCertificado.value.day).length > 1 ? this.a_s1_fechaCertificado.value.day : "0" + this.a_s1_fechaCertificado.value.day) + "/" + (String(this.a_s1_fechaCertificado.value.month).length > 1 ? this.a_s1_fechaCertificado.value.month : "0" + this.a_s1_fechaCertificado.value.month) + "/" + this.a_s1_fechaCertificado.value.year;

		const dataGuardar = new Anexo005_B17_3Request();
		// -------------------------------------
		dataGuardar.id = this.idAnexo;
		dataGuardar.movimientoFormularioId = this.dataInput.tramiteReqRefId;
		dataGuardar.anexoId = 5;
		dataGuardar.codigo = 'B';
		dataGuardar.tramiteReqId = this.dataInput.tramiteReqId;
		// -------------------------------------
		dataGuardar.metaData.tipoDocumentoSolicitante = this.tipoDocumentoSolicitante;
		dataGuardar.metaData.nombreTipoDocumentoSolicitante = this.nombreTipoDocumentoSolicitante;
		dataGuardar.metaData.nombresApellidosSolicitante = this.nombresApellidosSolicitante;
		dataGuardar.metaData.numeroDocumentoSolicitante = this.numeroDocumentoSolicitante;

		const {
			seccion1
		} = dataGuardar.metaData;

		//seccion 1
		seccion1.resolucionGases = this.a_s1_resolucionGases.value;
		seccion1.fechaResolucionGases = fechaResolucionGases;
		seccion1.certificado = this.a_s1_certificado.value;
		seccion1.fechaCertificado = fechaCertificado;
		seccion1.declaracion_1 = this.a_s1_declaracion_1.value;
		seccion1.declaracion_2 = this.a_s1_declaracion_2.value;
		seccion1.declaracion_3 = this.a_s1_declaracion_3.value;
		seccion1.declaracion_4 = this.a_s1_declaracion_4.value;
		seccion1.declaracion_5 = this.a_s1_declaracion_5.value;
		seccion1.declaracion_6 = this.a_s1_declaracion_6.value;
		seccion1.declaracion_7 = this.a_s1_declaracion_7.value;
		seccion1.declaracion_81 = this.a_s1_declaracion_81.value;
		seccion1.declaracion_82 = this.a_s1_declaracion_82.value;
		seccion1.declaracion_83 = this.a_s1_declaracion_83.value;
		seccion1.declaracion_84 = this.a_s1_declaracion_84.value;
		seccion1.declaracion_85 = this.a_s1_declaracion_85.value;
		seccion1.declaracion_86 = this.a_s1_declaracion_86.value;
		seccion1.declaracion_87 = this.a_s1_declaracion_87.value;
		seccion1.declaracion_88 = this.a_s1_declaracion_88.value;
		seccion1.declaracion_89 = this.a_s1_declaracion_89.value;
		seccion1.declaracion_810 = this.a_s1_declaracion_810.value;
		seccion1.declaracion_811 = this.a_s1_declaracion_811.value;
		seccion1.declaracion_812 = this.a_s1_declaracion_812.value;
		seccion1.declaracion_813 = this.a_s1_declaracion_813.value;
		seccion1.declaracion_814 = this.a_s1_declaracion_814.value;
		seccion1.declaracion_815 = this.a_s1_declaracion_815.value;
		seccion1.declaracion_816 = this.a_s1_declaracion_816.value;
		seccion1.declaracion_817 = this.a_s1_declaracion_817.value;
		seccion1.declaracion_818 = this.a_s1_declaracion_818.value;
		seccion1.declaracion_819 = this.a_s1_declaracion_819.value;
		seccion1.declaracion_9 = this.a_s1_declaracion_9.value;
		seccion1.declaracion_10 = this.a_s1_declaracion_10.value;
		seccion1.declaracion_111 = this.a_s1_declaracion_111.value;
		seccion1.declaracion_112 = this.a_s1_declaracion_112.value;
		seccion1.declaracion_113 = this.a_s1_declaracion_113.value;
		seccion1.declaracion_114 = this.a_s1_declaracion_114.value;
		seccion1.declaracion_115 = this.a_s1_declaracion_115.value;
		seccion1.declaracion_12 = this.a_s1_declaracion_12.value;
		seccion1.declaracion_13 = this.a_s1_declaracion_13.value;

		seccion1.fileDocumentos = this.filePdfDocumentosSeleccionado;
		seccion1.pathNameDocumentos = this.pathPdfDocumentosSeleccionado;

		seccion1.codigoProcedimiento = this.codigoProcedimientoTupa;
		dataGuardar.metaData.seccion1 = seccion1;

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

	formInvalid(control: string): boolean | undefined {
		if (this.anexoFG.get(control))
			return this.anexoFG.get(control)!.invalid;
	}

	onSelectFechaGases(event): void {
		let year = event.year.toString();
		let month = ('0' + event.month).slice(-2);
		let day = ('0' + event.day).slice(-2);
		this.fechaGases = day + "/" + month + "/" + year;
		//console.log("Fecha Gases: " + this.fechaGases);*/
	}

	onSelectFechaCertificado(event): void {
		let year = event.year.toString();
		let month = ('0' + event.month).slice(-2);
		let day = ('0' + event.day).slice(-2);
		this.fechaCertificado = day + "/" + month + "/" + year;
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

	public findInvalidControls() {
      const invalid = [];
      const controls = this.anexoFG.controls;
      for (const name in controls) {
         if (controls[name].invalid) {
            invalid.push(name);
         }
      }
      console.log(invalid);
   }
}
