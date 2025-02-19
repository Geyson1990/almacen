/**
 * Anexo 007-A/17.03
 * @author Alicia Toquila
 * @version 1.0 16.04.2023
 */

import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { AbstractControlOptions, UntypedFormBuilder, UntypedFormGroup, Validators, UntypedFormControl, FormArray, Form } from '@angular/forms';
import { NgbAccordionDirective , NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FuncionesMtcService } from '../../../../../core/services/funciones-mtc.service';
import { AnexoTramiteService } from '../../../../../core/services/tramite/anexo-tramite.service';
import { VisorPdfArchivosService } from '../../../../../core/services/tramite/visor-pdf-archivos.service';
import { VistaPdfComponent } from '../../../../../shared/components/vista-pdf/vista-pdf.component';
import { noWhitespaceValidator } from '../../../../../helpers/validator';
import { SeguridadService } from '../../../../../core/services/seguridad.service';
import { Anexo007_B17_3Response } from '../../../domain/anexo007_B17_3/anexo007_B17_3Response';
import { UbigeoComponent } from '../../../../../shared/components/forms/ubigeo/ubigeo.component';
import { Anexo007_B17_3Request, MetaData, Seccion2 } from '../../../domain/anexo007_B17_3/anexo007_B17_3Request';
import { ExtranjeriaService } from '../../../../../core/services/servicios/extranjeria.service';
import { ReniecService } from '../../../../../core/services/servicios/reniec.service';
import { SunatService } from '../../../../../core/services/servicios/sunat.service';
import { CONSTANTES } from '../../../../../enums/constants';
import { Anexo007_B17_3Service } from '../../../application/usecases';
import { TipoDocumentoModel } from '../../../../../core/models/TipoDocumentoModel';
import { FormularioTramiteService } from '../../../../../core/services/tramite/formulario-tramite.service';

@Component({
	// tslint:disable-next-line: component-selector
	selector: 'app-anexo007_B17_3',
	templateUrl: './anexo007_B17_3.component.html',
	styleUrls: ['./anexo007_B17_3.component.css']
})

// tslint:disable-next-line: class-name
export class Anexo007_B17_3_Component implements OnInit, AfterViewInit, AfterViewChecked {
	@Input() public dataInput: any;
	@ViewChild('acc') acc: NgbAccordionDirective ;

	@ViewChild('ubigeoCmpEstFija1') ubigeoEstFija1Component: UbigeoComponent;


	txtTitulo = 'ANEXO 007-B/17.03 RELACION DE EQUIPAMIENTO DE LOS CENTROS DE INSPECCIÓN TECNICA VEHICULAR - CITV FIJO Y MOVIL';

	paSeccion1: string[] = ["DGPPC-023"];
	habilitarSeccion1: boolean = true;

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

	listaTiposDocumentos: TipoDocumentoModel[] = [
		{ id: "1", documento: 'DNI' },
		{ id: "2", documento: 'Carné de Extranjería' }
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

	indexEditTabla = -1;

	constructor(
		private fb: UntypedFormBuilder,
		private funcionesMtcService: FuncionesMtcService,
		private modalService: NgbModal,
		private anexoService: Anexo007_B17_3Service,
		private seguridadService: SeguridadService,
		private anexoTramiteService: AnexoTramiteService,
		private visorPdfArchivosService: VisorPdfArchivosService,
		public activeModal: NgbActiveModal,
		private reniecService: ReniecService,
		private extranjeriaService: ExtranjeriaService,
		private sunatService: SunatService,
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

		console.log("Codigo Procedimiento:", this.paSeccion1.indexOf(this.codigoProcedimientoTupa));
		// ==================================================================================

		this.uriArchivo = this.dataInput.rutaDocumento;
		//Validators.requiredTrue
		this.anexoFG = this.fb.group({
			a_Seccion1: this.fb.group({
				a_s1_declaracion_1:  [{ value: false, disabled: false }, []],
				a_s1_declaracion_2:  [{ value: false, disabled: false }, []],
				a_s1_declaracion_3:  [{ value: false, disabled: false }, []],
				a_s1_declaracion_4:  [{ value: false, disabled: false }, []],
				a_s1_declaracion_5:  [{ value: false, disabled: false }, []],
				a_s1_declaracion_6:  [{ value: false, disabled: false }, []],
				a_s1_declaracion_7:  [{ value: false, disabled: false }, []],
				a_s1_declaracion_8:  [{ value: false, disabled: false }, []],
				a_s1_declaracion_9:  [{ value: false, disabled: false }, []],
				a_s1_declaracion_10: [{ value: false, disabled: false }, []],
				a_s1_declaracion_11: [{ value: false, disabled: false }, []],
				a_s1_declaracion_12: [{ value: false, disabled: false }, []],
				a_s1_declaracion_13: [{ value: false, disabled: false }, []],
				a_s1_declaracion_14: [{ value: false, disabled: false }, []],
				a_s1_declaracion_15: [{ value: false, disabled: false }, []],
			}),

			a_Seccion2: this.fb.group({
				a_s2_declaracion_1:  [{ value: false, disabled: false }, []],
				a_s2_declaracion_2:  [{ value: false, disabled: false }, []],
				a_s2_declaracion_3:  [{ value: false, disabled: false }, []],
				a_s2_declaracion_4:  [{ value: false, disabled: false }, []],
				a_s2_declaracion_5:  [{ value: false, disabled: false }, []],
				a_s2_declaracion_6:  [{ value: false, disabled: false }, []],
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
	get a_s1_declaracion_1(): UntypedFormControl { return this.a_Seccion1.get('a_s1_declaracion_1') as UntypedFormControl }
	get a_s1_declaracion_2(): UntypedFormControl { return this.a_Seccion1.get('a_s1_declaracion_2') as UntypedFormControl }
	get a_s1_declaracion_3(): UntypedFormControl { return this.a_Seccion1.get('a_s1_declaracion_3') as UntypedFormControl }
	get a_s1_declaracion_4(): UntypedFormControl { return this.a_Seccion1.get('a_s1_declaracion_4') as UntypedFormControl }
	get a_s1_declaracion_5(): UntypedFormControl { return this.a_Seccion1.get('a_s1_declaracion_5') as UntypedFormControl }
	get a_s1_declaracion_6(): UntypedFormControl { return this.a_Seccion1.get('a_s1_declaracion_6') as UntypedFormControl }
	get a_s1_declaracion_7(): UntypedFormControl { return this.a_Seccion1.get('a_s1_declaracion_7') as UntypedFormControl }
	get a_s1_declaracion_8(): UntypedFormControl { return this.a_Seccion1.get('a_s1_declaracion_8') as UntypedFormControl }
	get a_s1_declaracion_9(): UntypedFormControl { return this.a_Seccion1.get('a_s1_declaracion_9') as UntypedFormControl }
	get a_s1_declaracion_10(): UntypedFormControl { return this.a_Seccion1.get('a_s1_declaracion_10') as UntypedFormControl }
	get a_s1_declaracion_11(): UntypedFormControl { return this.a_Seccion1.get('a_s1_declaracion_11') as UntypedFormControl }
	get a_s1_declaracion_12(): UntypedFormControl { return this.a_Seccion1.get('a_s1_declaracion_12') as UntypedFormControl }
	get a_s1_declaracion_13(): UntypedFormControl { return this.a_Seccion1.get('a_s1_declaracion_13') as UntypedFormControl }
	get a_s1_declaracion_14(): UntypedFormControl { return this.a_Seccion1.get('a_s1_declaracion_14') as UntypedFormControl }
	get a_s1_declaracion_15(): UntypedFormControl { return this.a_Seccion1.get('a_s1_declaracion_15') as UntypedFormControl }

	get a_Seccion2(): UntypedFormGroup { return this.anexoFG.get('a_Seccion2') as UntypedFormGroup; }
	get a_s2_declaracion_1(): UntypedFormControl { return this.a_Seccion2.get('a_s2_declaracion_1') as UntypedFormControl }
	get a_s2_declaracion_2(): UntypedFormControl { return this.a_Seccion2.get('a_s2_declaracion_2') as UntypedFormControl }
	get a_s2_declaracion_3(): UntypedFormControl { return this.a_Seccion2.get('a_s2_declaracion_3') as UntypedFormControl }
	get a_s2_declaracion_4(): UntypedFormControl { return this.a_Seccion2.get('a_s2_declaracion_4') as UntypedFormControl }
	get a_s2_declaracion_5(): UntypedFormControl { return this.a_Seccion2.get('a_s2_declaracion_5') as UntypedFormControl }
	get a_s2_declaracion_6(): UntypedFormControl { return this.a_Seccion2.get('a_s2_declaracion_6') as UntypedFormControl }

	async cargarDatos(): Promise<void> {
		this.funcionesMtcService.mostrarCargando();

		if (this.dataInput.movId > 0) {
			// RECUPERAMOS LOS DATOS
			try {
				const dataAnexo = await this.anexoTramiteService.get<Anexo007_B17_3Response>(this.dataInput.tramiteReqId).toPromise();
				console.log(JSON.parse(dataAnexo.metaData));
				const {
					tipoDocumentoSolicitante,
					nombreTipoDocumentoSolicitante,
					nombresApellidosSolicitante,
					numeroDocumentoSolicitante,
					seccion1,
					seccion2
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
				
				this.a_s2_declaracion_1.setValue(seccion2.declaracion_1);
				this.a_s2_declaracion_2.setValue(seccion2.declaracion_2);
				this.a_s2_declaracion_3.setValue(seccion2.declaracion_3);
				this.a_s2_declaracion_4.setValue(seccion2.declaracion_4);
				this.a_s2_declaracion_5.setValue(seccion2.declaracion_5);
				this.a_s2_declaracion_6.setValue(seccion2.declaracion_6);

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
			modalRef.componentInstance.titleModal = 'Vista Previa - Anexo 007-B/17.03';
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

	async guardarAnexo(): Promise<void> {
		if (this.anexoFG.invalid === true) {
			this.funcionesMtcService.mensajeError('Debe ingresar todos los campos obligatorios');
			return;
		}

		const dataGuardar = new Anexo007_B17_3Request();
		// -------------------------------------
		dataGuardar.id = this.idAnexo;
		dataGuardar.movimientoFormularioId = this.dataInput.tramiteReqRefId;
		dataGuardar.anexoId = 7;
		dataGuardar.codigo = 'B';
		dataGuardar.tramiteReqId = this.dataInput.tramiteReqId;
		// -------------------------------------
		dataGuardar.metaData.tipoDocumentoSolicitante = this.tipoDocumentoSolicitante;
		dataGuardar.metaData.nombreTipoDocumentoSolicitante = this.nombreTipoDocumentoSolicitante;
		dataGuardar.metaData.nombresApellidosSolicitante = this.nombresApellidosSolicitante;
		dataGuardar.metaData.numeroDocumentoSolicitante = this.numeroDocumentoSolicitante;

		const {
			seccion1,
			seccion2
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
		

		seccion1.codigoProcedimiento = this.codigoProcedimientoTupa;
		dataGuardar.metaData.seccion1 = seccion1;
		//seccion 2
		seccion2.declaracion_1 = this.a_s2_declaracion_1.value;
		seccion2.declaracion_2 = this.a_s2_declaracion_2.value;
		seccion2.declaracion_3 = this.a_s2_declaracion_3.value;
		seccion2.declaracion_4 = this.a_s2_declaracion_4.value;
		seccion2.declaracion_5 = this.a_s2_declaracion_5.value;
		seccion2.declaracion_6 = this.a_s2_declaracion_6.value;

		dataGuardar.metaData.seccion2 = seccion2;

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


}
