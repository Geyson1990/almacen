/**
 * Anexo 005-A/17.03
 * @author Alicia Toquila
 * @version 1.0 21.03.2024
  */

import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { AbstractControlOptions, UntypedFormBuilder, UntypedFormGroup, Validators, UntypedFormControl, FormArray, Form } from '@angular/forms';
import { NgbAccordionDirective, NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FuncionesMtcService } from '../../../../../core/services/funciones-mtc.service';
import { AnexoTramiteService } from '../../../../../core/services/tramite/anexo-tramite.service';
import { VisorPdfArchivosService } from '../../../../../core/services/tramite/visor-pdf-archivos.service';
import { VistaPdfComponent } from '../../../../../shared/components/vista-pdf/vista-pdf.component';
import { noWhitespaceValidator } from '../../../../../helpers/validator';
import { SeguridadService } from '../../../../../core/services/seguridad.service';
import { Anexo005_A17_3Response } from '../../../domain/anexo005_A17_3/anexo005_A17_3Response';
import { UbigeoComponent } from '../../../../../shared/components/forms/ubigeo/ubigeo.component';
import { Anexo005_A17_3Request, MetaData, Seccion2, Personal, Titulo } from '../../../domain/anexo005_A17_3/anexo005_A17_3Request';
import { ExtranjeriaService } from '../../../../../core/services/servicios/extranjeria.service';
import { ReniecService } from '../../../../../core/services/servicios/reniec.service';
import { SunatService } from '../../../../../core/services/servicios/sunat.service';
import { CONSTANTES } from '../../../../../enums/constants';
import { Anexo005_A17_3Service } from '../../../application/usecases';
import { TipoDocumentoModel } from '../../../../../core/models/TipoDocumentoModel';
import { FormularioTramiteService } from '../../../../../core/services/tramite/formulario-tramite.service';


@Component({
	// tslint:disable-next-line: component-selector
	selector: 'app-anexo005_A17_3',
	templateUrl: './anexo005_A17_3.component.html',
	styleUrls: ['./anexo005_A17_3.component.css']
})

// tslint:disable-next-line: class-name
export class Anexo005_A17_3_Component implements OnInit, AfterViewInit, AfterViewChecked {
	@Input() public dataInput: any;
	@ViewChild('acc') acc: NgbAccordionDirective;

	@ViewChild('ubigeoCmpEstFija1') ubigeoEstFija1Component: UbigeoComponent;


	txtTitulo = 'ANEXO 005-A/17.03 NOMINA DEL PERSONAL TECNICO DEL TALLER DE CONVERSION A GAS LICUADO DE PETROLEO - GLP O TALLER DE CONVERSION A GAS NATURAL VEHICULAR - GNV';

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

	visibleButtonDocumentos = true;
	filePdfDocumentosSeleccionado: any = null;
	pathPdfDocumentosSeleccionado: any = null;

	listaPersonal: Personal[] = [];

	listaTiposDocumentos: TipoDocumentoModel[] = [
		{ id: "1", documento: 'DNI' },
		{ id: "2", documento: 'Carné de Extranjería' }
	];

	listaFuncion: Titulo[] = [
		{ value: "1", text: 'Técnico en mecánica automotriz' },
		{ value: "2", text: 'Técnico en electrónica' },
		{ value: "3", text: 'Técnico en electricidad automotriz' },
		{ value: "4", text: 'Técnico calificado en mecánica automotriz' },
		{ value: "5", text: 'Técnico calificado en mecánica automotriz y electronica' },
		{ value: "6", text: 'Técnico calificado en electricidad automotriz' },
		{ value: "7", text: 'Otro' },
	];

	// CODIGO Y NOMBRE DEL PROCEDIMIENTO:
	codigoProcedimientoTupa: string;
	descProcedimientoTupa: string;
	codigoTipoSolicitudTupa: string;
	descTipoSolicitudTupa: string;

	dj_GLP: string[] = ["DCV-017", "DCV-018"];
	dj_GNV: string[] = ["DCV-015", "DCV-016"];

	activarGLP: boolean = true;
	activarGNV: boolean = true;

	activarDocumentos: boolean = true;
	paDocumentos: string[] = ["DCV-015", "DCV-016", "DCV-017", "DCV-018"];

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
		private anexoService: Anexo005_A17_3Service,
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
		this.nroRuc = this.seguridadService.getCompanyCode();
		this.nombreCompleto = this.seguridadService.getUserName();          // nombre de usuario login
		this.nroDocumento = this.seguridadService.getNumDoc();      // nro de documento usuario login
		this.tipoDocumento = this.seguridadService.getNameId();


		this.codigoProcedimientoTupa = tramiteSelected.codigo;
		this.descProcedimientoTupa = tramiteSelected.nombre;
		this.codigoTipoSolicitudTupa = (this.dataInput.tipoSolicitudTupaCod == "" ? "0" : this.dataInput.tipoSolicitudTupaCod);
		this.descTipoSolicitudTupa = this.dataInput.tipoSolicitudTupaDesc;

		console.log("Codigo Procedimiento:", this.paSeccion1.indexOf(this.codigoProcedimientoTupa));
		// ==================================================================================

		if (this.dj_GLP.indexOf(this.codigoProcedimientoTupa) > -1) this.activarGLP = true; else this.activarGLP = false;
		if (this.dj_GNV.indexOf(this.codigoProcedimientoTupa) > -1) this.activarGNV = true; else this.activarGNV = false;
		if (this.paDocumentos.indexOf(this.codigoProcedimientoTupa) > -1) this.activarDocumentos = true; else this.activarDocumentos = false;

		if (this.activarGLP) {
			this.listaFuncion = this.listaFuncion.filter(i => i.value !== "4" && i.value !== "5" && i.value !== "6");
		}

		this.uriArchivo = this.dataInput.rutaDocumento;
		//Validators.requiredTrue
		this.anexoFG = this.fb.group({
			a_Seccion1: this.fb.group({
				a_s1_declaracion_1: (this.activarGLP) ? [{ value: false, disabled: false }, [Validators.requiredTrue]] : [false],
				a_s1_declaracion_2: (this.activarGNV) ? [{ value: false, disabled: false }, [Validators.requiredTrue]] : [false]
			}),

			a_Seccion2: this.fb.group({
				a_s2_tipoDocumento: [''],
				a_s2_numeroDocumento: [''],
				a_s2_nombresApellidos: [{ value: '', disabled: true }],
				a_s2_titulo: [''],
				a_s2_otro: [''],
			}),
		});
	}

	async ngAfterViewInit(): Promise<void> {
		this.tipoSolicitante = 'PJ'; // persona juridica
		this.tipoDocumento = '01';
		await this.cargarDatos();
	}

	get a_Seccion1(): UntypedFormGroup { return this.anexoFG.get('a_Seccion1') as UntypedFormGroup; }
	get a_s1_declaracion_1(): UntypedFormControl { return this.a_Seccion1.get('a_s1_declaracion_1') as UntypedFormControl }
	get a_s1_declaracion_2(): UntypedFormControl { return this.a_Seccion1.get('a_s1_declaracion_2') as UntypedFormControl }

	get a_Seccion2(): UntypedFormGroup { return this.anexoFG.get('a_Seccion2') as UntypedFormGroup; }
	get a_s2_tipoDocumento(): UntypedFormControl { return this.a_Seccion2.get('a_s2_tipoDocumento') as UntypedFormControl }
	get a_s2_numeroDocumento(): UntypedFormControl { return this.a_Seccion2.get('a_s2_numeroDocumento') as UntypedFormControl }
	get a_s2_nombresApellidos(): UntypedFormControl { return this.a_Seccion2.get('a_s2_nombresApellidos') as UntypedFormControl }
	get a_s2_titulo(): UntypedFormControl { return this.a_Seccion2.get('a_s2_titulo') as UntypedFormControl }
	get a_s2_otro(): UntypedFormControl { return this.a_Seccion2.get('a_s2_otro') as UntypedFormControl }

	async cargarDatos(): Promise<void> {
		this.funcionesMtcService.mostrarCargando();

		if (this.dataInput.movId > 0) {
			// RECUPERAMOS LOS DATOS
			try {
				const dataAnexo = await this.anexoTramiteService.get<Anexo005_A17_3Response>(this.dataInput.tramiteReqId).toPromise();
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
				this.listaPersonal = seccion2.listaPersonal;
				this.pathPdfDocumentosSeleccionado = seccion2.pathNameDocumentos;

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
			modalRef.componentInstance.titleModal = 'Vista Previa - Anexo 005-A/17.03';
		}
		catch (e) {
			console.error(e);
			this.funcionesMtcService
				.ocultarCargando()
				.mensajeError('Problemas para descargar el archivo PDF');
		}
	}

	getMaxLengthNumeroDocumento() {
		const tipoDocumento: string = this.a_s2_tipoDocumento.value.trim();

		if (tipoDocumento === '1')//DNI
			return 8;
		else if (tipoDocumento === '2')//CE
			return 12;
		return 0
	}

	changeFuncion() {

	}

	changeTipoDocumento() {
		this.a_s2_numeroDocumento.setValue('');
		this.a_s2_titulo.setValue('');
		this.a_s2_otro.setValue('');
		this.inputNumeroDocumento();
	}

	inputNumeroDocumento(event = undefined) {
		if (event)
			event.target.value = event.target.value.replace(/[^0-9]/g, '');

		this.a_s2_nombresApellidos.setValue('');
	}

	buscarNumeroDocumento() {
		const tipoDocumento: string = this.a_s2_tipoDocumento.value.trim();
		const numeroDocumento: string = this.a_s2_numeroDocumento.value.trim();

		if (tipoDocumento.length === 0 || numeroDocumento.length === 0)
			return this.funcionesMtcService.mensajeError('Debe ingresar Tipo de Documento y/o Número de Documento');
		if (tipoDocumento === '1' && numeroDocumento.length !== 8)
			return this.funcionesMtcService.mensajeError('DNI debe tener 8 caracteres');

		this.funcionesMtcService.mostrarCargando();

		if (tipoDocumento === '1') {//DNI
			this.reniecService.getDni(numeroDocumento).subscribe(
				respuesta => {
					this.funcionesMtcService.ocultarCargando();

					if (respuesta.reniecConsultDniResponse.listaConsulta.coResultado !== '0000')
						return this.funcionesMtcService.mensajeError('Número de documento no registrado en Reniec');

					const datosPersona = respuesta.reniecConsultDniResponse.listaConsulta.datosPersona;
					this.a_s2_nombresApellidos.setValue(datosPersona.apPrimer + ' ' + datosPersona.apSegundo + ', ' + datosPersona.prenombres);
				},
				error => {
					this.funcionesMtcService
						.ocultarCargando()
						.mensajeError('Error al consultar al servicio');
				}
			);

		} else if (tipoDocumento === '2') {//CARNÉ DE EXTRANJERÍA
			this.extranjeriaService.getCE(numeroDocumento).subscribe(
				respuesta => {
					this.funcionesMtcService.ocultarCargando();

					if (respuesta.CarnetExtranjeria.numRespuesta !== '0000')
						return this.funcionesMtcService.mensajeError('Número de documento no registrado en Migraciones');

					this.a_s2_nombresApellidos.setValue(respuesta.CarnetExtranjeria.nombres + ' ' + respuesta.CarnetExtranjeria.primerApellido + ' ' + respuesta.CarnetExtranjeria.segundoApellido);
				},
				error => {
					this.funcionesMtcService
						.ocultarCargando()
						.mensajeError('Error al consultar al servicio');
				}
			);
		}
	}

	agregarPersonal() {
		this.anexoFG.markAllAsTouched();

		if (this.formularioCompleto() === false)
			return this.funcionesMtcService.mensajeError('Debe agregar todos los campos faltantes');

		const tipoDocumento: string = this.a_s2_tipoDocumento.value.trim();
		const numeroDocumento: string = this.a_s2_numeroDocumento.value.trim();

		const indexFind = this.listaPersonal.findIndex(item => item.tipoDocumento.id === tipoDocumento && item.nroDocumento === numeroDocumento);

		if (indexFind !== -1) {
			if (indexFind !== this.indexEditTabla)
				return this.funcionesMtcService.mensajeError('El tipo y número de documento ya existen. No pueden ser agregados.');
		}
		console.log(this.a_s2_otro.value);
		if (this.indexEditTabla === -1) {

			this.listaPersonal.push({
				tipoDocumento: {
					id: this.a_s2_tipoDocumento.value,
					documento: this.listaTiposDocumentos.filter(item => item.id == this.a_s2_tipoDocumento.value)[0].documento
				},
				nroDocumento: this.a_s2_numeroDocumento.value,
				apellidosNombres: this.a_s2_nombresApellidos.value,
				titulo: {
					value: this.a_s2_titulo.value,
					text: this.listaFuncion.filter(item => item.value == this.a_s2_titulo.value)[0].text
				},
				otroTitulo: this.a_s2_otro.value,
			});
		} else {
			this.listaPersonal[this.indexEditTabla].tipoDocumento = {
				id: this.a_s2_tipoDocumento.value,
				documento: this.listaTiposDocumentos.filter(item => item.id == this.a_s2_tipoDocumento.value)[0].documento
			};

			this.listaPersonal[this.indexEditTabla].apellidosNombres = this.a_s2_nombresApellidos.value;
			this.listaPersonal[this.indexEditTabla].nroDocumento = this.a_s2_numeroDocumento.value;
			this.listaPersonal[this.indexEditTabla].titulo = {
				value: this.a_s2_titulo.value,
				text: this.listaFuncion.filter(item => item.value == this.a_s2_titulo.value)[0].text
			};
			this.listaPersonal[this.indexEditTabla].otroTitulo = this.a_s2_otro.value;
		}

		this.cancelarModificacion();
	}

	formularioCompleto() {
		if (this.a_s2_tipoDocumento.value == "" || this.a_s2_numeroDocumento.value == "" || this.a_s2_nombresApellidos.value == "" ||
			this.a_s2_titulo.value == "" || this.a_s2_titulo.value == "") {

			return false;
		}
		else
			return true;
	}

	cancelarModificacion() {
		this.a_s2_tipoDocumento.setValue('');
		this.a_s2_numeroDocumento.setValue('');
		this.a_s2_nombresApellidos.setValue('');
		this.a_s2_titulo.setValue('');
		this.a_s2_otro.setValue('');

		this.indexEditTabla = -1;
	}

	modificarPersonal(item: Personal, index) {
		if (this.indexEditTabla !== -1)
			return;

		this.indexEditTabla = index;

		this.a_s2_tipoDocumento.setValue(item.tipoDocumento.id);
		this.a_s2_numeroDocumento.setValue(item.nroDocumento);
		this.a_s2_nombresApellidos.setValue(item.apellidosNombres);
		this.a_s2_titulo.setValue(item.titulo.value);
		this.a_s2_otro.setValue(item.otroTitulo);
	}

	eliminarPersonal(item: Personal, index) {
		if (this.indexEditTabla === -1) {

			this.funcionesMtcService
				.mensajeConfirmar('¿Está seguro de eliminar el registro seleccionado?')
				.then(() => {
					this.listaPersonal.splice(index, 1);
				});
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

		//let cantSupervisor = this.listaPersonal.filter(item => this.listaFuncion.some(f => f.value == item.funcion.value));

		if (this.anexoFG.invalid === true) {
			this.funcionesMtcService.mensajeError('Debe ingresar todos los campos obligatorios');
			return;
		}

		if (this.listaPersonal.length == 0) {
			this.funcionesMtcService.mensajeError('Debe ingresar al menos un personal de la Entidad Certificadora');
			return;
		}

		if (this.activarDocumentos) {
			if (!this.filePdfDocumentosSeleccionado && !this.pathPdfDocumentosSeleccionado) {
				this.funcionesMtcService.mensajeError('Debe adjuntar los documentos sustentatorios.');
				return;
			}
		}

		let cantTMA = this.listaPersonal.filter(item => item.titulo.value == "1"); //Técnico en mecánica automotriz
		let cantTE = this.listaPersonal.filter(item => item.titulo.value == "2"); //Técnico en electrónica 
		let cantTEA = this.listaPersonal.filter(item => item.titulo.value == "3"); //Técnico en electricidad automotriz
		let cantTCMA = this.listaPersonal.filter(item => item.titulo.value == "4"); //Técnico calificado en mecánica automotriz
		let cantTCMAE = this.listaPersonal.filter(item => item.titulo.value == "5"); //Técnico calificado en mecánica automotriz y  electronica
		let cantTCEA = this.listaPersonal.filter(item => item.titulo.value == "6"); //Técnico calificado en electricidad automotriz

		if (this.activarGLP) {
			if (cantTMA.length == 0) {
				return this.funcionesMtcService.mensajeError('Debe ingresar al menos un Técnico en mecánica automotriz');
			}

			if (cantTE.length == 0 && cantTEA.length == 0) {
				return this.funcionesMtcService.mensajeError('Debe ingresar al menos un Técnico en electrónica o Técnico en electricidad automotriz');
			}
		}

		if (this.activarGNV) {
			if (cantTMA.length == 0 && cantTCMA.length == 0 && cantTCMAE.length == 0 ) {
				return this.funcionesMtcService.mensajeError('Debe ingresar al menos un Técnico en mecánica automotriz o un técnico calificado en mecánica automotriz');
			}

			if (cantTE.length == 0 && cantTEA.length == 0 && cantTCMAE.length == 0 && cantTCEA.length == 0) {
				return this.funcionesMtcService.mensajeError('Debe ingresar al menos un Técnico en electrónica o Técnico en electricidad automotriz o  un Técnico especializado en electrónica o electricidad automotriz');
			}
		}

		const dataGuardar = new Anexo005_A17_3Request();
		// -------------------------------------
		dataGuardar.id = this.idAnexo;
		dataGuardar.movimientoFormularioId = this.dataInput.tramiteReqRefId;
		dataGuardar.anexoId = 5;
		dataGuardar.codigo = 'A';
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
		seccion1.codigoProcedimiento = this.codigoProcedimientoTupa;
		dataGuardar.metaData.seccion1 = seccion1;
		//seccion 2
		seccion2.listaPersonal = this.listaPersonal;
		seccion2.fileDocumentos = this.filePdfDocumentosSeleccionado;
		seccion2.pathNameDocumentos = this.pathPdfDocumentosSeleccionado;

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

	public findInvalidControls() {
		const invalid = [];
		const controls = this.anexoFG.controls;
		const seccion2 = this.a_Seccion2.controls;
		for (const name in controls) {
			if (controls[name].invalid) {
				invalid.push(name);
			}
		}

		for (const name in seccion2) {
			if (controls[name].invalid) {
				invalid.push(name);
			}
		}

		console.log(invalid);
	}
}
