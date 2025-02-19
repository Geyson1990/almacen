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
import { Anexo007_A17_3Response } from '../../../domain/anexo007_A17_3/anexo007_A17_3Response';
import { UbigeoComponent } from '../../../../../shared/components/forms/ubigeo/ubigeo.component';
import { Anexo007_A17_3Request, MetaData, Seccion2, Personal, Funcion, Colegiatura } from '../../../domain/anexo007_A17_3/anexo007_A17_3Request';
import { ExtranjeriaService } from '../../../../../core/services/servicios/extranjeria.service';
import { ReniecService } from '../../../../../core/services/servicios/reniec.service';
import { SunatService } from '../../../../../core/services/servicios/sunat.service';
import { CONSTANTES } from '../../../../../enums/constants';
import { Anexo007_A17_3Service } from '../../../application/usecases';
import { TipoDocumentoModel } from '../../../../../core/models/TipoDocumentoModel';
import { FormularioTramiteService } from '../../../../../core/services/tramite/formulario-tramite.service';

@Component({
	// tslint:disable-next-line: component-selector
	selector: 'app-anexo007_A17_3',
	templateUrl: './anexo007_A17_3.component.html',
	styleUrls: ['./anexo007_A17_3.component.css']
})

// tslint:disable-next-line: class-name
export class Anexo007_A17_3_Component implements OnInit, AfterViewInit, AfterViewChecked {
	@Input() public dataInput: any;
	@ViewChild('acc') acc: NgbAccordionDirective ;

	@ViewChild('ubigeoCmpEstFija1') ubigeoEstFija1Component: UbigeoComponent;


	txtTitulo = 'ANEXO 007-A/17.03 NOMINA DEL PERSONAL DEL CENTRO DE INSPECCION TECNICA VEHICULAR - CITV FIJO O MOVIL';

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

	listaPersonal: Personal[] = [];

	listaTiposDocumentos: TipoDocumentoModel[] = [
		{ id: "1", documento: 'DNI' },
		{ id: "2", documento: 'Carné de Extranjería' }
	];

	listaFuncion: Funcion[] = [
		{ value: "1", text: 'Ingeniero supervisor' },
		{ value: "2", text: 'Inspector' },
	];

	listaColegiado: Colegiatura[] = [
		{ value: "1", text: 'Sí' },
		{ value: "2", text: 'No' },
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
		private anexoService: Anexo007_A17_3Service,
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
				a_s1_declaracion_1: (this.codigoProcedimientoTupa === 'DCV-011' || this.codigoProcedimientoTupa === 'DCV-012') ? "" : [{ value: false, disabled: false }, []],
				a_s1_declaracion_2: (this.codigoProcedimientoTupa === 'DCV-013' || this.codigoProcedimientoTupa === 'DCV-014') ? "" : [{ value: false, disabled: false }, []],
			}),

			a_Seccion2: this.fb.group({
				a_s2_tipoDocumento: [''],
				a_s2_numeroDocumento: [''],
				a_s2_nombresApellidos: [''],
				a_s2_funcion: [''],
				a_s2_colegiatura: [''],
				a_s2_cip: ['']
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

	get a_Seccion2(): UntypedFormGroup { return this.anexoFG.get('a_Seccion2') as UntypedFormGroup; }
	get a_s2_tipoDocumento(): UntypedFormControl { return this.a_Seccion2.get('a_s2_tipoDocumento') as UntypedFormControl }
	get a_s2_numeroDocumento(): UntypedFormControl { return this.a_Seccion2.get('a_s2_numeroDocumento') as UntypedFormControl }
	get a_s2_nombresApellidos(): UntypedFormControl { return this.a_Seccion2.get('a_s2_nombresApellidos') as UntypedFormControl }
	get a_s2_funcion(): UntypedFormControl { return this.a_Seccion2.get('a_s2_funcion') as UntypedFormControl }
	get a_s2_colegiatura(): UntypedFormControl { return this.a_Seccion2.get('a_s2_colegiatura') as UntypedFormControl }
	get a_s2_cip(): UntypedFormControl { return this.a_Seccion2.get('a_s2_cip') as UntypedFormControl }

	async cargarDatos(): Promise<void> {
		this.funcionesMtcService.mostrarCargando();

		if (this.dataInput.movId > 0) {
			// RECUPERAMOS LOS DATOS
			try {
				const dataAnexo = await this.anexoTramiteService.get<Anexo007_A17_3Response>(this.dataInput.tramiteReqId).toPromise();
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
				this.a_s1_declaracion_1.setValue(true);
				this.a_s1_declaracion_2.setValue(true);
				this.listaPersonal = seccion2.listaPersonal;
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
			modalRef.componentInstance.titleModal = 'Vista Previa - Anexo 007-A/17.03';
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

	getMaxLengthNumeroDocumento() {
		const tipoDocumento: string = this.a_s2_tipoDocumento.value.trim();

		if (tipoDocumento === '1')//DNI
			return 8;
		else if (tipoDocumento === '2')//CE
			return 12;
		return 0
	}

	changeTipoDocumento() {
		this.a_s2_numeroDocumento.setValue('');
		this.a_s2_funcion.setValue('');
		this.a_s2_colegiatura.setValue('');
		this.a_s2_cip.setValue('');
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

		/*if (this.formularioCompleto() === false)
		  return this.funcionesMtcService.mensajeError('Debe agregar todos los campos faltantes');*/

		const tipoDocumento: string = this.a_s2_tipoDocumento.value.trim();
		const numeroDocumento: string = this.a_s2_numeroDocumento.value.trim();

		const indexFind = this.listaPersonal.findIndex(item => item.tipoDocumento.id === tipoDocumento && item.nroDocumento === numeroDocumento);

		if (indexFind !== -1) {
			if (indexFind !== this.indexEditTabla)
				return this.funcionesMtcService.mensajeError('El tipo y número de documento ya existen. No pueden ser agregados.');
		}

		if (this.indexEditTabla === -1) {

			this.listaPersonal.push({
				tipoDocumento: {
					id: this.a_s2_tipoDocumento.value,
					documento: this.listaTiposDocumentos.filter(item => item.id == this.a_s2_tipoDocumento.value)[0].documento
				},
				nroDocumento: this.a_s2_numeroDocumento.value,
				apellidosNombres: this.a_s2_nombresApellidos.value,
				funcion: {
					value: this.a_s2_funcion.value,
					text: this.listaFuncion.filter(item => item.value == this.a_s2_funcion.value)[0].text
				},
				colegiado: {
					value : this.a_s2_colegiatura.value,
					text : this.listaColegiado.filter(item => item.value == this.a_s2_colegiatura.value)[0].text
				},
				cip: this.a_s2_cip.value
			});
		} else {
			this.listaPersonal[this.indexEditTabla].tipoDocumento = {
				id: this.a_s2_tipoDocumento.value,
				documento: this.listaTiposDocumentos.filter(item => item.id == this.a_s2_tipoDocumento.value)[0].documento
			};

			this.listaPersonal[this.indexEditTabla].apellidosNombres = this.a_s2_nombresApellidos.value;
			this.listaPersonal[this.indexEditTabla].tipoDocumento = this.a_s2_tipoDocumento.value;
			this.listaPersonal[this.indexEditTabla].nroDocumento = this.a_s2_numeroDocumento.value;
			this.listaPersonal[this.indexEditTabla].funcion = {
				value: this.a_s2_funcion.value,
				text: this.listaFuncion.filter(item => item.value == this.a_s2_funcion.value)[0].text
			};
			this.listaPersonal[this.indexEditTabla].colegiado = {
				value: this.a_s2_colegiatura.value,
				text: this.listaColegiado.filter(item => item.value == this.a_s2_colegiatura.value)[0].text
			};
			this.listaPersonal[this.indexEditTabla].cip = this.a_s2_cip.value;

		}

		this.cancelarModificacion();
	}

	cancelarModificacion() {
		this.a_s2_tipoDocumento.setValue('');
		this.a_s2_numeroDocumento.setValue('');
		this.a_s2_nombresApellidos.setValue('');
		this.a_s2_funcion.setValue('');
		this.a_s2_colegiatura.setValue('');
		this.a_s2_cip.setValue('');

		this.indexEditTabla = -1;
	}

	modificarPersonal(item: Personal, index) {
		if (this.indexEditTabla !== -1)
			return;

		this.indexEditTabla = index;

		this.a_s2_tipoDocumento.setValue(item.tipoDocumento.id);
		this.a_s2_numeroDocumento.setValue(item.nroDocumento);
		this.a_s2_nombresApellidos.setValue(item.apellidosNombres);
		this.a_s2_funcion.setValue(item.funcion.value);
		this.a_s2_colegiatura.setValue(item.colegiado.value);
		this.a_s2_cip.setValue(item.cip);
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

		const dataGuardar = new Anexo007_A17_3Request();
		// -------------------------------------
		dataGuardar.id = this.idAnexo;
		dataGuardar.movimientoFormularioId = this.dataInput.tramiteReqRefId;
		dataGuardar.anexoId = 4;
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
		seccion1.declaracion_1 = true;
		seccion1.declaracion_2 = true;
		seccion1.codigoProcedimiento = this.codigoProcedimientoTupa;
		dataGuardar.metaData.seccion1 = seccion1;
		//seccion 2
		seccion2.listaPersonal = this.listaPersonal;

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
