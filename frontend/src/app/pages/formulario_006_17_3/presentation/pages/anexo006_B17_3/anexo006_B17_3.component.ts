/**
 * Anexo 006-B/17.03 DCV-019 y DCV-020
 * @author Alicia Toquila
 * @version 1.0 21.03.2024
 */

import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, Input, OnInit, Injectable, ViewChild } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, AbstractControlOptions, AbstractControl, UntypedFormControl, FormArray, Form } from '@angular/forms';
import { NgbActiveModal, NgbAccordionDirective, NgbModal, NgbDateStruct, NgbDatepickerI18n, NgbDateParserFormatter, NgbDateAdapter } from '@ng-bootstrap/ng-bootstrap';
import { FuncionesMtcService } from '../../../../../core/services/funciones-mtc.service';
import { AnexoTramiteService } from '../../../../../core/services/tramite/anexo-tramite.service';
import { VisorPdfArchivosService } from '../../../../../core/services/tramite/visor-pdf-archivos.service';
import { VistaPdfComponent } from '../../../../../shared/components/vista-pdf/vista-pdf.component';
import { noWhitespaceValidator } from '../../../../../helpers/validator';
import { SeguridadService } from '../../../../../core/services/seguridad.service';
import { Anexo006_B17_3Response } from '../../../domain/anexo006_B17_3/anexo006_B17_3Response';
import { Anexo006_B17_3Request, MetaData, Seccion1 } from '../../../domain/anexo006_B17_3/anexo006_B17_3Request';
import { CONSTANTES } from '../../../../../enums/constants';
import { Anexo006_B17_3Service } from '../../../application/usecases';
import { TipoDocumentoModel } from '../../../../../core/models/TipoDocumentoModel';
import { FormularioTramiteService } from '../../../../../core/services/tramite/formulario-tramite.service';
import { TranslationWidth } from '@angular/common';


@Component({
	// tslint:disable-next-line: component-selector
	selector: 'app-anexo006_B17_3',
	templateUrl: './anexo006_B17_3.component.html',
	styleUrls: ['./anexo006_B17_3.component.css'],
})

export class Anexo006_B17_3_Component implements OnInit, AfterViewInit, AfterViewChecked { //,  
	@Input() public dataInput: any;
	@ViewChild('acc') acc: NgbAccordionDirective;

	txtTitulo = "ANEXO 006-B/17.03 RELACIÓN DE EQUIPAMIENTO DE LA ENTIDAD VERIFICADORA";

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

	constructor(
		private fb: UntypedFormBuilder,
		private funcionesMtcService: FuncionesMtcService,
		private modalService: NgbModal,
		private anexoService: Anexo006_B17_3Service,
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

		this.uriArchivo = this.dataInput.rutaDocumento;
		//Validators.requiredTrue
		this.anexoFG = this.fb.group({
			a_Seccion1: this.fb.group({
				a_s1_declaracion_1: [{ value: false, disabled: false }, [Validators.requiredTrue]],
				a_s1_declaracion_2: [{ value: false, disabled: false }, [Validators.requiredTrue]],
				a_s1_declaracion_3: [{ value: false, disabled: false }, [Validators.requiredTrue]],
				a_s1_declaracion_4: [{ value: false, disabled: false }, [Validators.requiredTrue]],
				a_s1_declaracion_5: [{ value: false, disabled: false }, [Validators.requiredTrue]],
				a_s1_declaracion_6: [{ value: false, disabled: false }, [Validators.requiredTrue]],
				a_s1_declaracion_7: [{ value: false, disabled: false }, [Validators.requiredTrue]],
				a_s1_declaracion_8: [{ value: false, disabled: false }, [Validators.requiredTrue]],
				a_s1_declaracion_9: [{ value: false, disabled: false }, [Validators.requiredTrue]],
				a_s1_declaracion_10: [{ value: false, disabled: false }, [Validators.requiredTrue]],
				a_s1_declaracion_11: [{ value: false, disabled: false }, [Validators.requiredTrue]],
				a_s1_declaracion_12: [{ value: false, disabled: false }, [Validators.requiredTrue]],
				a_s1_declaracion_13: [{ value: false, disabled: false }, [Validators.requiredTrue]],
				a_s1_declaracion_14: [{ value: false, disabled: false }, [Validators.requiredTrue]],
				a_s1_declaracion_15: [{ value: false, disabled: false }, [Validators.requiredTrue]],
				a_s1_declaracion_16: [{ value: false, disabled: false }, [Validators.requiredTrue]],
				a_s1_declaracion_17: [{ value: false, disabled: false }, [Validators.requiredTrue]]
			}),
		});
	}

	async ngAfterViewInit(): Promise<void> {
		await this.cargarDatos();
	}

	get a_Seccion1(): UntypedFormGroup { return this.anexoFG.get('a_Seccion1') as UntypedFormGroup; }
	get a_s1_declaracion_1(): AbstractControl { return this.a_Seccion1.get(['a_s1_declaracion_1']); }
	get a_s1_declaracion_2(): AbstractControl { return this.a_Seccion1.get(['a_s1_declaracion_2']); }
	get a_s1_declaracion_3(): AbstractControl { return this.a_Seccion1.get(['a_s1_declaracion_3']); }
	get a_s1_declaracion_4(): AbstractControl { return this.a_Seccion1.get(['a_s1_declaracion_4']); }
	get a_s1_declaracion_5(): AbstractControl { return this.a_Seccion1.get(['a_s1_declaracion_5']); }
	get a_s1_declaracion_6(): AbstractControl { return this.a_Seccion1.get(['a_s1_declaracion_6']); }
	get a_s1_declaracion_7(): AbstractControl { return this.a_Seccion1.get(['a_s1_declaracion_7']); }
	get a_s1_declaracion_8(): AbstractControl { return this.a_Seccion1.get(['a_s1_declaracion_8']); }
	get a_s1_declaracion_9(): AbstractControl { return this.a_Seccion1.get(['a_s1_declaracion_9']); }
	get a_s1_declaracion_10(): AbstractControl { return this.a_Seccion1.get(['a_s1_declaracion_10']); }
	get a_s1_declaracion_11(): AbstractControl { return this.a_Seccion1.get(['a_s1_declaracion_11']); }
	get a_s1_declaracion_12(): AbstractControl { return this.a_Seccion1.get(['a_s1_declaracion_12']); }
	get a_s1_declaracion_13(): AbstractControl { return this.a_Seccion1.get(['a_s1_declaracion_13']); }
	get a_s1_declaracion_14(): AbstractControl { return this.a_Seccion1.get(['a_s1_declaracion_14']); }
	get a_s1_declaracion_15(): AbstractControl { return this.a_Seccion1.get(['a_s1_declaracion_15']); }
	get a_s1_declaracion_16(): AbstractControl { return this.a_Seccion1.get(['a_s1_declaracion_16']); }
	get a_s1_declaracion_17(): AbstractControl { return this.a_Seccion1.get(['a_s1_declaracion_17']); }

	async cargarDatos(): Promise<void> {
		this.funcionesMtcService.mostrarCargando();

		if (this.dataInput.movId > 0) {
			// RECUPERAMOS LOS DATOS
			try {
				const dataAnexo = await this.anexoTramiteService.get<Anexo006_B17_3Response>(this.dataInput.tramiteReqId).toPromise();
				console.log(JSON.parse(dataAnexo.metaData));
				const {
					tipoDocumentoSolicitante,
					nombreTipoDocumentoSolicitante,
					nombresApellidosSolicitante,
					numeroDocumentoSolicitante,
					seccion1
				} = JSON.parse(dataAnexo.metaData) as MetaData;

				this.idAnexo = dataAnexo.anexoId;
				this.a_s1_declaracion_1.setValue(seccion1.declaracion_1);
				this.a_s1_declaracion_2.setValue(seccion1.declaracion_2);
				this.a_s1_declaracion_3.setValue(seccion1.declaracion_3);
				this.a_s1_declaracion_4.setValue(seccion1.declaracion_4);
				this.a_s1_declaracion_5.setValue(seccion1.declaracion_5);
				this.a_s1_declaracion_6.setValue(seccion1.declaracion_6);
				this.a_s1_declaracion_7.setValue(seccion1.declaracion_7);
				this.a_s1_declaracion_8.setValue(seccion1.declaracion_8); 
				this.a_s1_declaracion_9.setValue(seccion1.declaracion_9);
				this.a_s1_declaracion_10.setValue(seccion1.declaracion_10);
				this.a_s1_declaracion_11.setValue(seccion1.declaracion_11);
				this.a_s1_declaracion_12.setValue(seccion1.declaracion_12);
				this.a_s1_declaracion_13.setValue(seccion1.declaracion_13);
				this.a_s1_declaracion_14.setValue(seccion1.declaracion_14);
				this.a_s1_declaracion_15.setValue(seccion1.declaracion_15);
				this.a_s1_declaracion_16.setValue(seccion1.declaracion_16);
				this.a_s1_declaracion_17.setValue(seccion1.declaracion_17);
				this.pathPdfDocumentosSeleccionado = seccion1.pathNameDocumentos;

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
			modalRef.componentInstance.titleModal = 'Vista Previa - Anexo 006-B/17.03';
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
			const seccion3 = metaDataForm.seccion3;
			const seccion4 = metaDataForm.seccion4;
			const seccion5 = metaDataForm.seccion5;

			console.log("Datos Formulario");
			console.log(metaDataForm);

			this.tipoDocumentoSolicitante = seccion5.tipoDocumentoSolicitante;
			this.nombreTipoDocumentoSolicitante = seccion5.nombreTipoDocumentoSolicitante;
			this.numeroDocumentoSolicitante = seccion5.numeroDocumentoSolicitante;
			this.nombresApellidosSolicitante = seccion5.nombresApellidosSolicitante;

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

		if (this.anexoFG.invalid === true) {
			this.funcionesMtcService.mensajeError('Debe ingresar todos los campos obligatorios');
			return;
		}
		
		if (!this.filePdfDocumentosSeleccionado && !this.pathPdfDocumentosSeleccionado) {
			this.funcionesMtcService.mensajeError('Debe adjuntar los documentos sustentatorios.');
			return;
		}

		const dataGuardar = new Anexo006_B17_3Request();
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
		seccion1.declaracion_1 = this.a_s1_declaracion_1.value;
		seccion1.declaracion_2 = this.a_s1_declaracion_2.value;
		seccion1.declaracion_3 = this.a_s1_declaracion_3.value;
		seccion1.declaracion_4 = this.a_s1_declaracion_4.value;
		seccion1.declaracion_5 = this.a_s1_declaracion_5.value;
		seccion1.declaracion_6 = this.a_s1_declaracion_6.value;
		seccion1.declaracion_7 = this.a_s1_declaracion_7.value;
		seccion1.declaracion_8 = this.a_s1_declaracion_8.value;
		seccion1.declaracion_9 = this.a_s1_declaracion_9.value;
		seccion1.declaracion_10 = this.a_s1_declaracion_10.value;
		seccion1.declaracion_11 = this.a_s1_declaracion_11.value;
		seccion1.declaracion_12 = this.a_s1_declaracion_12.value;
		seccion1.declaracion_13 = this.a_s1_declaracion_13.value;
		seccion1.declaracion_14 = this.a_s1_declaracion_14.value;
		seccion1.declaracion_15 = this.a_s1_declaracion_15.value;
		seccion1.declaracion_16 = this.a_s1_declaracion_16.value;
		seccion1.declaracion_17 = this.a_s1_declaracion_17.value;

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
