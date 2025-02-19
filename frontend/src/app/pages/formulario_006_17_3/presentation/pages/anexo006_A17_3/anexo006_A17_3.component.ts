/**
 * Anexo 006-A/17.03
 * @author Alicia Toquila
 * @version 1.0 21.03.2024
  */

import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { AbstractControlOptions, UntypedFormBuilder, UntypedFormGroup, Validators, UntypedFormControl, FormArray, Form } from '@angular/forms';
import { NgbAccordionDirective, NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FuncionesMtcService } from '../../../../../core/services/funciones-mtc.service';
import { AnexoTramiteService } from '../../../../../core/services/tramite/anexo-tramite.service';
import { VisorPdfArchivosService } from '../../../../../core/services/tramite/visor-pdf-archivos.service';
import { VistaPdfComponent } from '../../../../../shared/components/vista-pdf/vista-pdf.component';
import { noWhitespaceValidator } from '../../../../../helpers/validator';
import { SeguridadService } from '../../../../../core/services/seguridad.service';
import { Anexo006_A17_3Response } from '../../../domain/anexo006_A17_3/anexo006_A17_3Response';
import { UbigeoComponent } from '../../../../../shared/components/forms/ubigeo/ubigeo.component';
import { Anexo006_A17_3Request, MetaData, Seccion2, Personal, Titulo, Experiencia } from '../../../domain/anexo006_A17_3/anexo006_A17_3Request';
import { ExtranjeriaService } from '../../../../../core/services/servicios/extranjeria.service';
import { ReniecService } from '../../../../../core/services/servicios/reniec.service';
import { SunatService } from '../../../../../core/services/servicios/sunat.service';
import { CONSTANTES } from '../../../../../enums/constants';
import { Anexo006_A17_3Service } from '../../../application/usecases';
import { TipoDocumentoModel } from '../../../../../core/models/TipoDocumentoModel';
import { FormularioTramiteService } from '../../../../../core/services/tramite/formulario-tramite.service';
import { FormExperienciaLaboralComponent } from '../../components/form-experiencia-laboral/form-experiencia-laboral.component';


@Component({
	// tslint:disable-next-line: component-selector
	selector: 'app-anexo006_A17_3',
	templateUrl: './anexo006_A17_3.component.html',
	styleUrls: ['./anexo006_A17_3.component.css']
})

// tslint:disable-next-line: class-name
export class Anexo006_A17_3_Component implements OnInit, AfterViewInit, AfterViewChecked {
	@Input() public dataInput: any;
	@ViewChild('acc') acc: NgbAccordionDirective;

	@ViewChild('ubigeoCmpEstFija1') ubigeoEstFija1Component: UbigeoComponent;


	txtTitulo = 'ANEXO 006-A/17.03 RELACIÓN DE PERSONAL TÉCNICO DE LA ENTIDAD VERIFICADORA';

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

	visibleButtonDocumentosIng = true;
	filePdfDocumentosSeleccionadoIng: any = null;
	pathPdfDocumentosSeleccionadoIng: any = null;

	visibleButtonDocumentosTecAut = true;
	filePdfDocumentosSeleccionadoTecAut: any = null;
	pathPdfDocumentosSeleccionadoTecAut: any = null;

	visibleButtonDocumentosTecElec = true;
	filePdfDocumentosSeleccionadoTecElec: any = null;
	pathPdfDocumentosSeleccionadoTecElec: any = null;

	listaIngeniero: Personal[] = [];
	listaTecnicoAutomotriz: Personal[] = [];
	listaTecnicoElectronica: Personal[] = [];
	listaExperiencia: Experiencia[] = [];

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

	activarDocumentos: boolean = true;
	paDocumentos: string[] = ["DCV-015", "DCV-016", "DCV-017", "DCV-018"];

	tipoDocumento = '';
	nroDocumento = '';
	nroRuc = '';
	nombreCompleto = '';
	razonSocial = '';
	domicilioLegal = '';

	indexEditIngeniero = -1;
	indexEditTecAuto = -1;
	indexEditTecElec = -1;

	defaultTipoTramite = '';

	constructor(
		private fb: UntypedFormBuilder,
		private funcionesMtcService: FuncionesMtcService,
		private modalService: NgbModal,
		private anexoService: Anexo006_A17_3Service,
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

		// ==================================================================================

		if (this.paDocumentos.indexOf(this.codigoProcedimientoTupa) > -1) this.activarDocumentos = true; else this.activarDocumentos = false;

		/*if (this.activarGLP) {
			this.listaFuncion = this.listaFuncion.filter(i => i.value !== "4" && i.value !== "5" && i.value !== "6");
		}*/

		this.uriArchivo = this.dataInput.rutaDocumento;
		//Validators.requiredTrue
		this.anexoFG = this.fb.group({
			a_Seccion2: this.fb.group({
				a_s2_tipoDocumento: [''],
				a_s2_numeroDocumento: [''],
				a_s2_nombresApellidos: [{ value: '', disabled: true }],
				a_s2_titulo: [''],
				a_s2_cip: [''],
			}),
			a_Seccion3: this.fb.group({
				a_s3_tipoDocumento: [''],
				a_s3_numeroDocumento: [''],
				a_s3_nombresApellidos: [{ value: '', disabled: true }],
				a_s3_titulo: [''],
				a_s3_cip: [''],
			}),
			a_Seccion4: this.fb.group({
				a_s4_tipoDocumento: [''],
				a_s4_numeroDocumento: [''],
				a_s4_nombresApellidos: [{ value: '', disabled: true }],
				a_s4_titulo: [''],
				a_s4_cip: [''],
			}),
		});
	}

	async ngAfterViewInit(): Promise<void> {
		this.tipoSolicitante = 'PJ'; // persona juridica
		this.tipoDocumento = '01';
		await this.cargarDatos();
	}

	get a_Seccion1(): UntypedFormGroup { return this.anexoFG.get('a_Seccion1') as UntypedFormGroup; }

	get a_Seccion2(): UntypedFormGroup { return this.anexoFG.get('a_Seccion2') as UntypedFormGroup; }
	get a_s2_tipoDocumento(): UntypedFormControl { return this.a_Seccion2.get('a_s2_tipoDocumento') as UntypedFormControl }
	get a_s2_numeroDocumento(): UntypedFormControl { return this.a_Seccion2.get('a_s2_numeroDocumento') as UntypedFormControl }
	get a_s2_nombresApellidos(): UntypedFormControl { return this.a_Seccion2.get('a_s2_nombresApellidos') as UntypedFormControl }
	get a_s2_titulo(): UntypedFormControl { return this.a_Seccion2.get('a_s2_titulo') as UntypedFormControl }
	get a_s2_cip(): UntypedFormControl { return this.a_Seccion2.get('a_s2_cip') as UntypedFormControl }

	get a_Seccion3(): UntypedFormGroup { return this.anexoFG.get('a_Seccion3') as UntypedFormGroup; }
	get a_s3_tipoDocumento(): UntypedFormControl { return this.a_Seccion3.get('a_s3_tipoDocumento') as UntypedFormControl }
	get a_s3_numeroDocumento(): UntypedFormControl { return this.a_Seccion3.get('a_s3_numeroDocumento') as UntypedFormControl }
	get a_s3_nombresApellidos(): UntypedFormControl { return this.a_Seccion3.get('a_s3_nombresApellidos') as UntypedFormControl }
	get a_s3_titulo(): UntypedFormControl { return this.a_Seccion3.get('a_s3_titulo') as UntypedFormControl }
	get a_s3_cip(): UntypedFormControl { return this.a_Seccion3.get('a_s3_cip') as UntypedFormControl }

	get a_Seccion4(): UntypedFormGroup { return this.anexoFG.get('a_Seccion4') as UntypedFormGroup; }
	get a_s4_tipoDocumento(): UntypedFormControl { return this.a_Seccion4.get('a_s4_tipoDocumento') as UntypedFormControl }
	get a_s4_numeroDocumento(): UntypedFormControl { return this.a_Seccion4.get('a_s4_numeroDocumento') as UntypedFormControl }
	get a_s4_nombresApellidos(): UntypedFormControl { return this.a_Seccion4.get('a_s4_nombresApellidos') as UntypedFormControl }
	get a_s4_titulo(): UntypedFormControl { return this.a_Seccion4.get('a_s4_titulo') as UntypedFormControl }
	get a_s4_cip(): UntypedFormControl { return this.a_Seccion4.get('a_s4_cip') as UntypedFormControl }

	async cargarDatos(): Promise<void> {
		this.funcionesMtcService.mostrarCargando();

		if (this.dataInput.movId > 0) {
			// RECUPERAMOS LOS DATOS
			try {
				const dataAnexo = await this.anexoTramiteService.get<Anexo006_A17_3Response>(this.dataInput.tramiteReqId).toPromise();
				console.log(JSON.parse(dataAnexo.metaData));
				const {
					tipoDocumentoSolicitante,
					nombreTipoDocumentoSolicitante,
					nombresApellidosSolicitante,
					numeroDocumentoSolicitante,
					seccion1,
					seccion2,
					seccion3,
					seccion4
				} = JSON.parse(dataAnexo.metaData) as MetaData;

				this.idAnexo = dataAnexo.anexoId;

				this.listaIngeniero = seccion2.listaIngeniero;
				this.listaTecnicoAutomotriz = seccion3.listaTecnicoAutomotriz;
				this.listaTecnicoElectronica = seccion4.listaTecnicoElectronica;

				this.pathPdfDocumentosSeleccionadoIng = seccion2.pathNameDocumentos;
				this.pathPdfDocumentosSeleccionadoTecAut = seccion3.pathNameDocumentos;
				this.pathPdfDocumentosSeleccionadoTecElec = seccion4.pathNameDocumentos;

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
			modalRef.componentInstance.titleModal = 'Vista Previa - Anexo 006-A/17.03';
		}
		catch (e) {
			console.error(e);
			this.funcionesMtcService
				.ocultarCargando()
				.mensajeError('Problemas para descargar el archivo PDF');
		}
	}

	getMaxLengthNumeroDocumento(tipoPersonal: string) {
		let tipoDocumento: string = "";
		if (tipoPersonal == "Ingeniero") {
			tipoDocumento = this.a_s2_tipoDocumento.value.trim();
		}

		if (tipoPersonal == "TecnicoAutomotriz") {
			tipoDocumento = this.a_s3_tipoDocumento.value.trim();
		}

		if (tipoPersonal == "TecnicoElectronica") {
			tipoDocumento = this.a_s4_tipoDocumento.value.trim();
		}

		if (tipoDocumento === '1')//DNI
			return 8;
		else if (tipoDocumento === '2')//CE
			return 12;
		return 0

	}

	changeTipoDocumento(tipoPersonal: string) {
		if (tipoPersonal == "Ingeniero") {
			this.a_s2_numeroDocumento.setValue('');
			this.a_s2_titulo.setValue('');
			this.a_s2_cip.setValue('');
			this.inputNumeroDocumento(this.a_s2_nombresApellidos);
		}

		if (tipoPersonal == "TecnicoAutomotriz") {
			this.a_s3_numeroDocumento.setValue('');
			this.a_s3_titulo.setValue('');
			this.a_s3_cip.setValue('');
			this.inputNumeroDocumento(this.a_s3_nombresApellidos);
		}

		if (tipoPersonal == "TecnicoElectronica") {
			this.a_s4_numeroDocumento.setValue('');
			this.a_s4_titulo.setValue('');
			this.a_s4_cip.setValue('');
			this.inputNumeroDocumento(this.a_s4_nombresApellidos);
		}

		
	}

	inputNumeroDocumento(control:any, event = undefined) {
		if (event)
			event.target.value = event.target.value.replace(/[^0-9]/g, '');

		control.setValue('');
	}

	buscarNumeroDocumento(event, tipoPersonal: string, controlDatosPersonal: any) {

		let tipoDocumento: string = this.a_s2_tipoDocumento.value.trim();
		let numeroDocumento: string = this.a_s2_numeroDocumento.value.trim();

		if (tipoPersonal == "Ingeniero") {
			tipoDocumento = this.a_s2_tipoDocumento.value.trim();
			numeroDocumento = this.a_s2_numeroDocumento.value.trim();
		}

		if (tipoPersonal == "TecnicoAutomotriz") {
			tipoDocumento = this.a_s3_tipoDocumento.value.trim();
			numeroDocumento = this.a_s3_numeroDocumento.value.trim();
		}

		if (tipoPersonal == "TecnicoElectronica") {
			tipoDocumento = this.a_s4_tipoDocumento.value.trim();
			numeroDocumento = this.a_s4_numeroDocumento.value.trim();
		}


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
					controlDatosPersonal.setValue(datosPersona.apPrimer + ' ' + datosPersona.apSegundo + ', ' + datosPersona.prenombres);
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

					controlDatosPersonal.setValue(respuesta.CarnetExtranjeria.nombres + ' ' + respuesta.CarnetExtranjeria.primerApellido + ' ' + respuesta.CarnetExtranjeria.segundoApellido);
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

		if (this.formularioCompleto('Ingeniero') === false)
			return this.funcionesMtcService.mensajeError('Debe agregar todos los campos faltantes');

		const tipoDocumento: string = this.a_s2_tipoDocumento.value.trim();
		const numeroDocumento: string = this.a_s2_numeroDocumento.value.trim();

		const indexFind = this.listaIngeniero.findIndex(item => item.tipoDocumento.id === tipoDocumento && item.nroDocumento === numeroDocumento);

		if (indexFind !== -1) {
			if (indexFind !== this.indexEditIngeniero)
				return this.funcionesMtcService.mensajeError('El tipo y número de documento ya existen. No pueden ser agregados.');
		}
		console.log(this.a_s2_cip.value);
		if (this.indexEditIngeniero === -1) {

			this.listaIngeniero.push({
				tipoDocumento: {
					id: this.a_s2_tipoDocumento.value,
					documento: this.listaTiposDocumentos.filter(item => item.id == this.a_s2_tipoDocumento.value)[0].documento
				},
				nroDocumento: this.a_s2_numeroDocumento.value,
				apellidosNombres: this.a_s2_nombresApellidos.value,
				titulo: this.a_s2_titulo.value,
				cip: this.a_s2_cip.value,
				listaExperiencia: [],
			});
		} else {
			this.listaIngeniero[this.indexEditIngeniero].tipoDocumento = {
				id: this.a_s2_tipoDocumento.value,
				documento: this.listaTiposDocumentos.filter(item => item.id == this.a_s2_tipoDocumento.value)[0].documento
			};

			this.listaIngeniero[this.indexEditIngeniero].apellidosNombres = this.a_s2_nombresApellidos.value;
			this.listaIngeniero[this.indexEditIngeniero].nroDocumento = this.a_s2_numeroDocumento.value;
			this.listaIngeniero[this.indexEditIngeniero].titulo = this.a_s2_titulo.value;
			this.listaIngeniero[this.indexEditIngeniero].cip = this.a_s2_cip.value;
			//this.listaIngeniero[this.indexEditIngeniero].listaExperiencia = this.listaExperiencia;
		}
		this.cancelarModificacion("Ingeniero");
	}

	agregarTecnicoAutomotriz() {
		this.anexoFG.markAllAsTouched();

		if (this.formularioCompleto('TecnicoAutomotriz') === false)
			return this.funcionesMtcService.mensajeError('Debe agregar todos los campos faltantes');

		const tipoDocumento: string = this.a_s3_tipoDocumento.value.trim();
		const numeroDocumento: string = this.a_s3_numeroDocumento.value.trim();

		const indexFind = this.listaTecnicoAutomotriz.findIndex(item => item.tipoDocumento.id === tipoDocumento && item.nroDocumento === numeroDocumento);

		if (indexFind !== -1) {
			if (indexFind !== this.indexEditTecAuto)
				return this.funcionesMtcService.mensajeError('El tipo y número de documento ya existen. No pueden ser agregados.');
		}

		if (this.indexEditTecAuto === -1) {

			this.listaTecnicoAutomotriz.push({
				tipoDocumento: {
					id: this.a_s3_tipoDocumento.value,
					documento: this.listaTiposDocumentos.filter(item => item.id == this.a_s3_tipoDocumento.value)[0].documento
				},
				nroDocumento: this.a_s3_numeroDocumento.value,
				apellidosNombres: this.a_s3_nombresApellidos.value,
				titulo: this.a_s3_titulo.value,
				cip: this.a_s3_cip.value,
				listaExperiencia: [],
			});
		} else {
			this.listaTecnicoAutomotriz[this.indexEditTecAuto].tipoDocumento = {
				id: this.a_s3_tipoDocumento.value,
				documento: this.listaTiposDocumentos.filter(item => item.id == this.a_s3_tipoDocumento.value)[0].documento
			};

			this.listaTecnicoAutomotriz[this.indexEditTecAuto].apellidosNombres = this.a_s3_nombresApellidos.value;
			this.listaTecnicoAutomotriz[this.indexEditTecAuto].nroDocumento = this.a_s3_numeroDocumento.value;
			this.listaTecnicoAutomotriz[this.indexEditTecAuto].titulo = this.a_s3_titulo.value;
			this.listaTecnicoAutomotriz[this.indexEditTecAuto].cip = this.a_s3_cip.value;
		}
		this.cancelarModificacion("TecnicoAutomotriz");
	}

	agregarTecnicoElectronica() {
		this.anexoFG.markAllAsTouched();

		if (this.formularioCompleto('TecnicoElectronica') === false)
			return this.funcionesMtcService.mensajeError('Debe agregar todos los campos faltantes');

		const tipoDocumento: string = this.a_s4_tipoDocumento.value.trim();
		const numeroDocumento: string = this.a_s4_numeroDocumento.value.trim();

		const indexFind = this.listaTecnicoElectronica.findIndex(item => item.tipoDocumento.id === tipoDocumento && item.nroDocumento === numeroDocumento);

		if (indexFind !== -1) {
			if (indexFind !== this.indexEditTecElec)
				return this.funcionesMtcService.mensajeError('El tipo y número de documento ya existen. No pueden ser agregados.');
		}

		if (this.indexEditTecElec === -1) {

			this.listaTecnicoElectronica.push({
				tipoDocumento: {
					id: this.a_s4_tipoDocumento.value,
					documento: this.listaTiposDocumentos.filter(item => item.id == this.a_s4_tipoDocumento.value)[0].documento
				},
				nroDocumento: this.a_s4_numeroDocumento.value,
				apellidosNombres: this.a_s4_nombresApellidos.value,
				titulo: this.a_s4_titulo.value,
				cip: this.a_s4_cip.value,
				listaExperiencia: [],
			});
		} else {
			this.listaTecnicoElectronica[this.indexEditTecElec].tipoDocumento = {
				id: this.a_s4_tipoDocumento.value,
				documento: this.listaTiposDocumentos.filter(item => item.id == this.a_s4_tipoDocumento.value)[0].documento
			};

			this.listaTecnicoElectronica[this.indexEditTecElec].apellidosNombres = this.a_s4_nombresApellidos.value;
			this.listaTecnicoElectronica[this.indexEditTecElec].nroDocumento = this.a_s4_numeroDocumento.value;
			this.listaTecnicoElectronica[this.indexEditTecElec].titulo = this.a_s4_titulo.value;
			this.listaTecnicoElectronica[this.indexEditTecElec].cip = this.a_s4_cip.value;
		}

		this.cancelarModificacion("TecnicoElectronica");
	}

	formularioCompleto(tipoPersonal: string) {
		if (tipoPersonal == "Ingeniero") {
			if (this.a_s2_tipoDocumento.value == "" || this.a_s2_numeroDocumento.value == "" || this.a_s2_nombresApellidos.value == "" ||
				this.a_s2_titulo.value == "" || this.a_s2_titulo.value == "") {

				return false;
			}
			else
				return true;
		}

		if (tipoPersonal == "TecnicoAutomotriz") {
			if (this.a_s3_tipoDocumento.value == "" || this.a_s3_numeroDocumento.value == "" || this.a_s3_nombresApellidos.value == "" ||
				this.a_s3_titulo.value == "" || this.a_s3_titulo.value == "") {

				return false;
			}
			else
				return true;
		}

		if (tipoPersonal == "TecnicoElectronica") {
			if (this.a_s4_tipoDocumento.value == "" || this.a_s4_numeroDocumento.value == "" || this.a_s4_nombresApellidos.value == "" ||
				this.a_s4_titulo.value == "" || this.a_s4_titulo.value == "") {

				return false;
			}
			else
				return true;
		}
	}

	cancelarModificacion(tipoPersonal: string) {
		if (tipoPersonal == "Ingeniero") {
			this.a_s2_tipoDocumento.setValue('');
			this.a_s2_numeroDocumento.setValue('');
			this.a_s2_nombresApellidos.setValue('');
			this.a_s2_titulo.setValue('');
			this.a_s2_cip.setValue('');

			this.indexEditIngeniero = -1;
		}

		if (tipoPersonal == "TecnicoAutomotriz") {
			this.a_s3_tipoDocumento.setValue('');
			this.a_s3_numeroDocumento.setValue('');
			this.a_s3_nombresApellidos.setValue('');
			this.a_s3_titulo.setValue('');
			this.a_s3_cip.setValue('');

			this.indexEditTecAuto = -1;
		}

		if (tipoPersonal == "TecnicoElectronica") {
			this.a_s4_tipoDocumento.setValue('');
			this.a_s4_numeroDocumento.setValue('');
			this.a_s4_nombresApellidos.setValue('');
			this.a_s4_titulo.setValue('');
			this.a_s4_cip.setValue('');

			this.indexEditTecElec = -1;
		}
	}

	modificarPersonal(item: Personal, index, tipoPersonal: string) {
		if (tipoPersonal == "Ingeniero") {
			if (this.indexEditIngeniero !== -1)
				return;

			this.indexEditIngeniero = index;

			this.a_s2_tipoDocumento.setValue(item.tipoDocumento.id);
			this.a_s2_numeroDocumento.setValue(item.nroDocumento);
			this.a_s2_nombresApellidos.setValue(item.apellidosNombres);
			this.a_s2_titulo.setValue(item.titulo);
			this.a_s2_cip.setValue(item.cip);
		}

		if (tipoPersonal == "TecnicoAutomotriz") {
			if (this.indexEditTecAuto !== -1)
				return;

			this.indexEditTecAuto = index;

			this.a_s3_tipoDocumento.setValue(item.tipoDocumento.id);
			this.a_s3_numeroDocumento.setValue(item.nroDocumento);
			this.a_s3_nombresApellidos.setValue(item.apellidosNombres);
			this.a_s3_titulo.setValue(item.titulo);
			this.a_s3_cip.setValue(item.cip);
		}

		if (tipoPersonal == "TecnicoElectronica") {
			if (this.indexEditTecElec !== -1)
				return;

			this.indexEditTecElec = index;

			this.a_s4_tipoDocumento.setValue(item.tipoDocumento.id);
			this.a_s4_numeroDocumento.setValue(item.nroDocumento);
			this.a_s4_nombresApellidos.setValue(item.apellidosNombres);
			this.a_s4_titulo.setValue(item.titulo);
			this.a_s4_cip.setValue(item.cip);
		}
	}

	eliminarPersonal(item: Personal, index, tipoPersonal: string) {
		if (tipoPersonal == "Ingeniero") {
			if (this.indexEditIngeniero === -1) {

				this.funcionesMtcService
					.mensajeConfirmar('¿Está seguro de eliminar el registro ' + item.apellidosNombres + '?')
					.then(() => {
						this.listaIngeniero.splice(index, 1);
					});
			}
		}

		if (tipoPersonal == "TecnicoAutomotriz") {
			if (this.indexEditTecAuto === -1) {

				this.funcionesMtcService
					.mensajeConfirmar('¿Está seguro de eliminar el registro ' + item.apellidosNombres + '?')
					.then(() => {
						this.listaTecnicoAutomotriz.splice(index, 1);
					});
			}
		}

		if (tipoPersonal == "TecnicoElectronica") {
			if (this.indexEditTecElec === -1) {

				this.funcionesMtcService
					.mensajeConfirmar('¿Está seguro de eliminar el registro ' + item.apellidosNombres + '?')
					.then(() => {
						this.listaTecnicoElectronica.splice(index, 1);
					});
			}
		}
	}

	eliminarExperiencia(item: Experiencia, index, indexPersonal, tipoPersonal: string) {
		if (tipoPersonal == "Ingeniero") {
			this.funcionesMtcService
				.mensajeConfirmar('¿Está seguro de eliminar el registro ' + item.lugar + '?')
				.then(() => {
					this.listaIngeniero[indexPersonal].listaExperiencia.splice(index, 1);
				});
		}

		if (tipoPersonal == "TecnicoAutomotriz") {
			this.funcionesMtcService
				.mensajeConfirmar('¿Está seguro de eliminar el registro ' + item.lugar + '?')
				.then(() => {
					this.listaTecnicoAutomotriz[indexPersonal].listaExperiencia.splice(index, 1);
				});
		}

		if (tipoPersonal == "TecnicoElectronica") {
			this.funcionesMtcService
				.mensajeConfirmar('¿Está seguro de eliminar el registro ' + item.lugar + '?')
				.then(() => {
					this.listaTecnicoElectronica[indexPersonal].listaExperiencia.splice(index, 1);
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

	onChangeDocumentos(tipoPersonal: string): void {
		if (tipoPersonal == "Ingeniero") {
			if (this.visibleButtonDocumentosIng === true) {
				this.funcionesMtcService
					.mensajeConfirmar('¿Declaro que la información adjunta en el archivo es verídica?', 'DECLARACIÓN')
					.catch(() => {
						this.visibleButtonDocumentosIng = false;
						//this.anexoFG.controls['Documentos'].setValue(false);
					});
			} else {
				this.filePdfDocumentosSeleccionadoIng = null;
				this.pathPdfDocumentosSeleccionadoIng = null;
			}
		}

		if (tipoPersonal == "TecnicoAutomotriz") {
			if (this.visibleButtonDocumentosTecAut === true) {
				this.funcionesMtcService
					.mensajeConfirmar('¿Declaro que la información adjunta en el archivo es verídica?', 'DECLARACIÓN')
					.catch(() => {
						this.visibleButtonDocumentosTecAut = false;
						//this.anexoFG.controls['Documentos'].setValue(false);
					});
			} else {
				this.filePdfDocumentosSeleccionadoTecAut = null;
				this.pathPdfDocumentosSeleccionadoTecAut = null;
			}
		}

		if (tipoPersonal == "TecnicoElectronica") {
			if (this.visibleButtonDocumentosTecElec === true) {
				this.funcionesMtcService
					.mensajeConfirmar('¿Declaro que la información adjunta en el archivo es verídica?', 'DECLARACIÓN')
					.catch(() => {
						this.visibleButtonDocumentosTecElec = false;
						//this.anexoFG.controls['Documentos'].setValue(false);
					});
			} else {
				this.filePdfDocumentosSeleccionadoTecElec = null;
				this.pathPdfDocumentosSeleccionadoTecElec = null;
			}
		}

	}

	onChangeInputDocumentos(event, tipoPersonal: string): void {
		if (event.target.files.length === 0) {
			return;
		}
		if (event.target.files[0].type !== 'application/pdf') {
			event.target.value = '';
			this.funcionesMtcService.mensajeError('Solo puede adjuntar archivos PDF');
			return;
		}
		if (tipoPersonal == "Ingeniero")
			this.filePdfDocumentosSeleccionadoIng = event.target.files[0];
		if (tipoPersonal == "TecnicoAutomotriz")
			this.filePdfDocumentosSeleccionadoTecAut = event.target.files[0];
		if (tipoPersonal == "TecnicoElectronica")
			this.filePdfDocumentosSeleccionadoTecElec = event.target.files[0];

		event.target.value = '';
	}

	vistaPreviaDocumentos(tipoPersonal: string): void {
		let visor: boolean = false;
		var filePdf: any = null;
		var pathPdf: any = null;

		if (tipoPersonal == "Ingeniero") {
			visor = (this.pathPdfDocumentosSeleccionadoIng === null || this.filePdfDocumentosSeleccionadoIng !== null);
			filePdf = this.filePdfDocumentosSeleccionadoIng;
			pathPdf = this.pathPdfDocumentosSeleccionadoIng;
		}

		if (tipoPersonal == "TecnicoAutomotriz") {
			visor = (this.pathPdfDocumentosSeleccionadoTecAut === null || this.filePdfDocumentosSeleccionadoTecAut !== null);
			filePdf = this.filePdfDocumentosSeleccionadoTecAut;
			pathPdf = this.pathPdfDocumentosSeleccionadoTecAut;
		}

		if (tipoPersonal == "TecnicoElectronica") {
			visor = (this.pathPdfDocumentosSeleccionadoTecElec === null || this.filePdfDocumentosSeleccionadoTecElec !== null);
			filePdf = this.filePdfDocumentosSeleccionadoTecElec;
			pathPdf = this.pathPdfDocumentosSeleccionadoTecElec;
		}

		if (visor) {
			const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
			const urlPdf = URL.createObjectURL(filePdf);
			modalRef.componentInstance.pdfUrl = urlPdf;
			modalRef.componentInstance.titleModal = 'Vista Previa - Documentos sustentatorios';
		} else {
			this.funcionesMtcService.mostrarCargando();

			this.visorPdfArchivosService.get(pathPdf)
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

	agregarExperiencia(idxExperiencia: number | null = null, idxPersona: number, tipoPersona: string) {
		const modalRef: NgbModalRef = this.modalService.open(FormExperienciaLaboralComponent, { centered: true, size: "md", scrollable: false });
		modalRef.componentInstance.dataIdx = idxExperiencia
		modalRef.componentInstance.dataPersonalIdx = idxPersona
		modalRef.componentInstance.dataInput = this.dataInput

		if (tipoPersona == "Ingeniero") {
			modalRef.componentInstance.experienciaLaboral = this.listaIngeniero[idxPersona].listaExperiencia[idxExperiencia]
			modalRef.componentInstance.persona = this.listaIngeniero[idxPersona]

			console.log("idx", idxExperiencia)
			console.log(this.listaIngeniero[idxPersona]);
			console.log(this.listaIngeniero[idxPersona].listaExperiencia[idxExperiencia]);
		}

		if (tipoPersona == "TecnicoAutomotriz") {
			modalRef.componentInstance.experienciaLaboral = this.listaTecnicoAutomotriz[idxPersona].listaExperiencia[idxExperiencia]
			modalRef.componentInstance.persona = this.listaTecnicoAutomotriz[idxPersona]

			console.log("idx", idxExperiencia)
			console.log(this.listaTecnicoAutomotriz[idxPersona]);
			console.log(this.listaTecnicoAutomotriz[idxPersona].listaExperiencia[idxExperiencia]);
		}

		if (tipoPersona == "TecnicoElectronica") {
			modalRef.componentInstance.experienciaLaboral = this.listaTecnicoElectronica[idxPersona].listaExperiencia[idxExperiencia]
			modalRef.componentInstance.persona = this.listaTecnicoElectronica[idxPersona]

			console.log("idx", idxExperiencia)
			console.log(this.listaTecnicoElectronica[idxPersona]);
			console.log(this.listaTecnicoElectronica[idxPersona].listaExperiencia[idxExperiencia]);
		}

		modalRef.result.then((response: Experiencia) => {
			console.log(response);
			if (!response)
				return;
			console.log("--------------");
			console.log(this.listaIngeniero);
			console.log(this.listaExperiencia);
			if (tipoPersona == "Ingeniero") {
				if (idxExperiencia !== null && idxExperiencia >= 0)
					this.listaIngeniero[idxPersona].listaExperiencia[idxExperiencia] = response
				else
					this.listaIngeniero[idxPersona].listaExperiencia.push(response)
			}

			if (tipoPersona == "TecnicoAutomotriz") {
				if (idxExperiencia !== null && idxExperiencia >= 0)
					this.listaTecnicoAutomotriz[idxPersona].listaExperiencia[idxExperiencia] = response
				else
					this.listaTecnicoAutomotriz[idxPersona].listaExperiencia.push(response)
			}

			if (tipoPersona == "TecnicoElectronica") {
				if (idxExperiencia !== null && idxExperiencia >= 0)
					this.listaTecnicoElectronica[idxPersona].listaExperiencia[idxExperiencia] = response
				else
					this.listaTecnicoElectronica[idxPersona].listaExperiencia.push(response)
			}
		}, (error) => {
			this.funcionesMtcService.ocultarCargando().mensajeError('Ocurrió un error');
		});
	}

	async guardarAnexo(): Promise<void> {

		//let cantSupervisor = this.listaPersonal.filter(item => this.listaFuncion.some(f => f.value == item.funcion.value));



		if (this.anexoFG.invalid === true) {
			this.funcionesMtcService.mensajeError('Debe ingresar todos los campos obligatorios');
			return;
		}

		if (this.listaIngeniero.length == 0) {
			this.funcionesMtcService.mensajeError('Debe ingresar al menos un (01) Ingeniero Supervisor de la Entidad Verificadora');
			return;
		}

		if (this.listaTecnicoAutomotriz.length < 2) {
			this.funcionesMtcService.mensajeError('Debe ingresar al menos dos (02) Técnicos en Mecánica Automotriz de la Entidad Verificadora');
			return;
		}

		if (this.listaTecnicoElectronica.length == 0) {
			this.funcionesMtcService.mensajeError('Debe ingresar al menos un (01) Técnico en Electrónica o Electricidad Automotriz de la Entidad Verificadora');
			return;
		}

		for (let item of this.listaIngeniero) {
			if (item.listaExperiencia.length == 0)
				return this.funcionesMtcService.mensajeError('Debe ingresar la experienca laboral de ' + item.apellidosNombres);
		}

		for (let item of this.listaTecnicoAutomotriz) {
			if (item.listaExperiencia.length == 0)
				return this.funcionesMtcService.mensajeError('Debe ingresar la experienca laboral de ' + item.apellidosNombres);
		}

		for (let item of this.listaTecnicoElectronica) {
			if (item.listaExperiencia.length == 0)
				return this.funcionesMtcService.mensajeError('Debe ingresar la experienca laboral de ' + item.apellidosNombres);
		}

		if (!this.filePdfDocumentosSeleccionadoIng && !this.pathPdfDocumentosSeleccionadoIng) {
			this.funcionesMtcService.mensajeError('Debe adjuntar los documentos sustentatorios del Ingeniero Supervisor.');
			return;
		}

		if (!this.filePdfDocumentosSeleccionadoTecAut && !this.pathPdfDocumentosSeleccionadoTecAut) {
			this.funcionesMtcService.mensajeError('Debe adjuntar los documentos sustentatorios del Técnico en Mecánica Automotriz.');
			return;
		}

		if (!this.filePdfDocumentosSeleccionadoTecElec && !this.pathPdfDocumentosSeleccionadoTecElec) {
			this.funcionesMtcService.mensajeError('Debe adjuntar los documentos sustentatorios del Técnico en Electrónica o Electricicdad Automotriz.');
			return;
		}

		const dataGuardar = new Anexo006_A17_3Request();
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
			seccion2,
			seccion3,
			seccion4
		} = dataGuardar.metaData;

		//seccion 1
		seccion1.codigoProcedimiento = this.codigoProcedimientoTupa;
		dataGuardar.metaData.seccion1 = seccion1;
		//seccion 2
		seccion2.listaIngeniero = this.listaIngeniero;
		seccion2.fileDocumentos = this.filePdfDocumentosSeleccionadoIng;
		seccion2.pathNameDocumentos = this.pathPdfDocumentosSeleccionadoIng;

		seccion3.listaTecnicoAutomotriz = this.listaTecnicoAutomotriz;
		seccion3.fileDocumentos = this.filePdfDocumentosSeleccionadoTecAut;
		seccion3.pathNameDocumentos = this.pathPdfDocumentosSeleccionadoTecAut;

		seccion4.listaTecnicoElectronica = this.listaTecnicoElectronica;
		seccion4.fileDocumentos = this.filePdfDocumentosSeleccionadoTecElec;
		seccion4.pathNameDocumentos = this.pathPdfDocumentosSeleccionadoTecElec;

		dataGuardar.metaData.seccion2 = seccion2;
		dataGuardar.metaData.seccion3 = seccion3;
		dataGuardar.metaData.seccion4 = seccion4;

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
