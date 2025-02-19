/**
 * Anexo 004-A/17.03
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
import { Anexo009_A17_3Response } from '../../../domain/anexo009_A17_3/anexo009_A17_3Response';
import { UbigeoComponent } from '../../../../../shared/components/forms/ubigeo/ubigeo.component';
import { Anexo009_A17_3Request, MetaData, Seccion2, Opciones, Director, InstructorConocimientos, InstructorHabilidades } from '../../../domain/anexo009_A17_3/anexo009_A17_3Request';
import { ExtranjeriaService } from '../../../../../core/services/servicios/extranjeria.service';
import { ReniecService } from '../../../../../core/services/servicios/reniec.service';
import { SunatService } from '../../../../../core/services/servicios/sunat.service';
import { CONSTANTES } from '../../../../../enums/constants';
import { Anexo009_A17_3Service } from '../../../application/usecases';
import { TipoDocumentoModel } from '../../../../../core/models/TipoDocumentoModel';
import { ValidateFileSize_Formulario } from 'src/app/helpers/file';
import { FormularioTramiteService } from '../../../../../core/services/tramite/formulario-tramite.service';
import { MtcService } from 'src/app/core/services/servicios/mtc.service';

@Component({
	// tslint:disable-next-line: component-selector
	selector: 'app-anexo009_A17_3',
	templateUrl: './anexo009_A17_3.component.html',
	styleUrls: ['./anexo009_A17_3.component.css']
})

// tslint:disable-next-line: class-name
export class Anexo009_A17_3_Component implements OnInit, AfterViewInit, AfterViewChecked {
	@Input() public dataInput: any;
	@ViewChild('acc') acc: NgbAccordionDirective ;

	@ViewChild('ubigeoCmpEstFija1') ubigeoEstFija1Component: UbigeoComponent;


	txtTitulo = 'ANEXO 009-A/17.03 ESCUELA DE CONDUCTORES RELACION DE PERSONAL';

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

	listaDirector: Director[] = [];
	listaInstructorConocimientos: InstructorConocimientos[] = [];
	listaInstructorHabilidades: InstructorHabilidades[] = [];

	listaTiposDocumentos: TipoDocumentoModel[] = [
		{ id: "1", documento: 'DNI' },
		{ id: "2", documento: 'Carné de Extranjería' }
	];

	listaEducacionSuperior: Opciones[] = [
		{ value: "tecnico", text: 'Técnico', id: 1 },
		{ value: "profesional", text: 'Profesional', id: 2 },
	];

	listaCategoriaLicencias: Opciones[] = [
		{ value: "A IIa",  text: 'A IIa', id : 1 },
		{ value: "A IIb",  text: 'A IIb', id : 2 },
		{ value: "A IIIa", text: 'A IIIa', id: 3 },
		{ value: "A IIIb", text: 'A IIIb', id: 4 },
		{ value: "A IIIc", text: 'A IIIc', id: 5 },
		{ value: "B IIc",  text: 'B IIc',  id: 6 },
	];

	listaCategoriaLicenciaFormulario:any = [];
	mayorCategoriaFormulario:number = 0;

   listaVigenciaExperiencia:Opciones[] = [
		{ value: "1", text: 'Sí', id : 1 },
		{ value: "2", text: 'No', id : 2 },
	]

	listaSecundaria:Opciones[] = [
		{ value: "1", text: 'Sí', id : 1 },
		{ value: "2", text: 'No', id : 2},
	]

	tipoDocumentoSNC:any = [
		{ id: "1", text: "RUC", tipoDocumento:0 },
		{ id: "2", text: "DNI", tipoDocumento:1 },
		{ id: "4", text: "CARNET EXTRANJERIA", tipoDocumento:2 },
		{ id: "5", text: "CARNET DE SOLICITANTE", tipoDocumento:0 },
		{ id: "6", text: "PASAPORTE", tipoDocumento:0 },
		{ id: "13", text:"TARJETA IDENTIDAD", tipoDocumento:0 },
		{ id: "14", text:"PERMISO TEMPORAL PERMANENCIA", tipoDocumento:0 },
	]

	// CODIGO Y NOMBRE DEL PROCEDIMIENTO:
	codigoProcedimientoTupa: string;
	descProcedimientoTupa: string;

	tipoDocumento = '';
	nroDocumento = '';
	nroRuc = '';
	nombreCompleto = '';
	razonSocial = '';
	domicilioLegal = '';

	defaultTipoTramite = '';

	indexEditTablaDirector = -1;
	indexEditTablaInstructorConocimientos = -1;
	indexEditTablaInstructorHabilidades = -1;

	filePdfDirectorPathName: string = null;
	filePdfInstructorConocimientosPathName: string = null;
	filePdfInstructorHabilidadesPathName: string = null;

	filePdfDirectorSeleccionado: any = null;
	filePdfInstructorConocimientosSeleccionado: any = null;
	filePdfInstructorHabilidadesSeleccionado: any = null;

	valDirector = 0;
	valInstructorConocimientos = 0;
	valInstructorHabilidades = 0;

	public visibleButtonDirector: boolean;
	public visibleButtonInstructorConocimientos: boolean;
	public visibleButtonInstructorHabilidades: boolean;

	visibleControlCert: boolean;
	visibleControlCel: boolean;

	constructor(
		private fb: UntypedFormBuilder,
		private funcionesMtcService: FuncionesMtcService,
		private modalService: NgbModal,
		private anexoService: Anexo009_A17_3Service,
		private seguridadService: SeguridadService,
		private anexoTramiteService: AnexoTramiteService,
		private visorPdfArchivosService: VisorPdfArchivosService,
		public activeModal: NgbActiveModal,
		private reniecService: ReniecService,
		private extranjeriaService: ExtranjeriaService,
		private sunatService: SunatService,
		private readonly changeDetectorRef: ChangeDetectorRef,
		private formularioTramiteService: FormularioTramiteService,
		private mtcService: MtcService
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
				a_s1_tipoDocumento: [''],
				a_s1_numeroDocumento: [''],
				a_s1_nombresApellidos: [''],
				a_s1_grado: [''],
				a_s1_experiencia_1: [false],
				a_s1_experiencia_2: [false]
			}),
			a_Seccion2: this.fb.group({
				a_s2_tipoDocumento: [''],
				a_s2_numeroDocumento: [''],
				a_s2_nombresApellidos: [''],
				a_s2_educacionSuperior: [''],
				a_s2_numeroLicenciaConducir: [''],
				a_s2_claseCategoriaLicenciaConducir:[''],
				a_s2_licenciaConducir: [''],
				a_s2_experiencia: ['']
			}),
			a_Seccion3: this.fb.group({
				a_s3_tipoDocumento: [''],
				a_s3_numeroDocumento: [''],
				a_s3_nombresApellidos: [''],
				a_s3_secundariaCompleta: [''],
				a_s3_licenciaConducir: [''],
				a_s3_numeroLicenciaConducir: [''],
				a_s3_categoriaLicencia: [''],
				a_s3_sancionado: ['']
			})
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
	get a_s1_tipoDocumento(): UntypedFormControl { return this.a_Seccion1.get('a_s1_tipoDocumento') as UntypedFormControl }
	get a_s1_numeroDocumento(): UntypedFormControl { return this.a_Seccion1.get('a_s1_numeroDocumento') as UntypedFormControl }
	get a_s1_nombresApellidos(): UntypedFormControl { return this.a_Seccion1.get('a_s1_nombresApellidos') as UntypedFormControl }
	get a_s1_grado(): UntypedFormControl { return this.a_Seccion1.get('a_s1_grado') as UntypedFormControl }
	get a_s1_experiencia_1(): UntypedFormControl { return this.a_Seccion1.get('a_s1_experiencia_1') as UntypedFormControl }
	get a_s1_experiencia_2(): UntypedFormControl { return this.a_Seccion1.get('a_s1_experiencia_2') as UntypedFormControl }

	get a_Seccion2(): UntypedFormGroup { return this.anexoFG.get('a_Seccion2') as UntypedFormGroup; }
	get a_s2_tipoDocumento(): UntypedFormControl { return this.a_Seccion2.get('a_s2_tipoDocumento') as UntypedFormControl }
	get a_s2_numeroDocumento(): UntypedFormControl { return this.a_Seccion2.get('a_s2_numeroDocumento') as UntypedFormControl }
	get a_s2_nombresApellidos(): UntypedFormControl { return this.a_Seccion2.get('a_s2_nombresApellidos') as UntypedFormControl }
	get a_s2_educacionSuperior(): UntypedFormControl { return this.a_Seccion2.get('a_s2_educacionSuperior') as UntypedFormControl }
	get a_s2_licenciaConducir(): UntypedFormControl { return this.a_Seccion2.get('a_s2_licenciaConducir') as UntypedFormControl }
	get a_s2_numeroLicenciaConducir(): UntypedFormControl { return this.a_Seccion2.get('a_s2_numeroLicenciaConducir') as UntypedFormControl }
	get a_s2_claseCategoriaLicenciaConducir(): UntypedFormControl { return this.a_Seccion2.get('a_s2_claseCategoriaLicenciaConducir') as UntypedFormControl }
	get a_s2_experiencia(): UntypedFormControl { return this.a_Seccion2.get('a_s2_experiencia') as UntypedFormControl }

	get a_Seccion3(): UntypedFormGroup { return this.anexoFG.get('a_Seccion3') as UntypedFormGroup; }
	get a_s3_tipoDocumento(): UntypedFormControl { return this.a_Seccion3.get('a_s3_tipoDocumento') as UntypedFormControl }
	get a_s3_numeroDocumento(): UntypedFormControl { return this.a_Seccion3.get('a_s3_numeroDocumento') as UntypedFormControl }
	get a_s3_nombresApellidos(): UntypedFormControl { return this.a_Seccion3.get('a_s3_nombresApellidos') as UntypedFormControl }
	get a_s3_secundariaCompleta(): UntypedFormControl { return this.a_Seccion3.get('a_s3_secundariaCompleta') as UntypedFormControl }
	get a_s3_licenciaConducir(): UntypedFormControl { return this.a_Seccion3.get('a_s3_licenciaConducir') as UntypedFormControl }
	get a_s3_categoriaLicencia(): UntypedFormControl { return this.a_Seccion3.get('a_s3_categoriaLicencia') as UntypedFormControl }
	get a_s3_numeroLicenciaConducir(): UntypedFormControl { return this.a_Seccion3.get('a_s3_numeroLicenciaConducir') as UntypedFormControl }
	get a_s3_sancionado(): UntypedFormControl { return this.a_Seccion3.get('a_s3_sancionado') as UntypedFormControl }

	async cargarDatos(): Promise<void> {
		this.funcionesMtcService.mostrarCargando();

		if (this.dataInput.movId > 0) {
			// RECUPERAMOS LOS DATOS
			try {
				const dataAnexo = await this.anexoTramiteService.get<Anexo009_A17_3Response>(this.dataInput.tramiteReqId).toPromise();
				console.log(JSON.parse(dataAnexo.metaData));
				const {
					tipoDocumentoSolicitante,
					nombreTipoDocumentoSolicitante,
					nombresApellidosSolicitante,
					numeroDocumentoSolicitante,
					seccion1,
					seccion2,
					seccion3
				} = JSON.parse(dataAnexo.metaData) as MetaData;

				this.idAnexo = dataAnexo.anexoId;

				this.listaDirector = seccion1.listaDirector;
				this.listaInstructorConocimientos = seccion2.listaInstructorConocimientos;
				this.listaInstructorHabilidades = seccion3.listaInstructorHabilidades;
				this.tipoDocumentoSolicitante = tipoDocumentoSolicitante;
				this.nombreTipoDocumentoSolicitante = nombreTipoDocumentoSolicitante;
				this.nombresApellidosSolicitante = nombresApellidosSolicitante;
				this.numeroDocumentoSolicitante = numeroDocumentoSolicitante;

				console.log(this.listaDirector);
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
			modalRef.componentInstance.titleModal = 'Vista Previa - Anexo 009-A/17.03';
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

	getMaxLengthNumeroDocumento(controlTipoDocumento: string) {
		let tipoDocumento: string = '';
		if (controlTipoDocumento == "a_s1_tipoDocumento") {
			tipoDocumento = this.a_s1_tipoDocumento.value.trim();
		}

		if (controlTipoDocumento == "a_s2_tipoDocumento") {
			tipoDocumento = this.a_s2_tipoDocumento.value.trim();
		}

		if (controlTipoDocumento == "a_s3_tipoDocumento") {
			tipoDocumento = this.a_s3_tipoDocumento.value.trim();
		}

		if (tipoDocumento === '1')//DNI
			return 8;
		else if (tipoDocumento === '2')//CE
			return 12;
		return 0
	}

	changeTipoDocumento(controlTipoDocumento: string) {
		if (controlTipoDocumento == "a_s1_tipoDocumento") {
			this.a_s1_numeroDocumento.setValue('');
			this.a_s1_nombresApellidos.setValue('');
			this.a_s1_grado.setValue('');
			this.a_s1_experiencia_1.setValue('');
			this.a_s1_experiencia_2.setValue('');
			this.inputNumeroDocumento(undefined, "a_s1_nombresApellidos");
		}

		if (controlTipoDocumento == "a_s2_tipoDocumento") {
			this.a_s2_numeroDocumento.setValue('');
			this.a_s2_nombresApellidos.setValue('');
			this.a_s2_educacionSuperior.setValue('');
			this.a_s2_numeroLicenciaConducir.setValue('');
			this.a_s2_claseCategoriaLicenciaConducir.setValue('');
			this.a_s2_licenciaConducir.setValue('');
			this.a_s2_experiencia.setValue('');
			this.inputNumeroDocumento(undefined, "a_s2_nombresApellidos");
		}

		if (controlTipoDocumento == "a_s3_tipoDocumento") {
			this.a_s3_numeroDocumento.setValue('');
			this.a_s3_nombresApellidos.setValue('');
			this.a_s3_secundariaCompleta.setValue('');
			this.a_s3_numeroLicenciaConducir.setValue('');
			this.a_s3_licenciaConducir.setValue('');
			this.a_s3_sancionado.setValue('');
			this.a_s3_categoriaLicencia.setValue('');
			this.inputNumeroDocumento(undefined, "a_s3_nombresApellidos");
		}
	}

	inputNumeroDocumento(event = undefined, controlNombresApellidos: string) {
		if (event)
			event.target.value = event.target.value.replace(/[^0-9]/g, '');

		if (controlNombresApellidos == "a_s1_nombresApellidos")
			this.a_s1_nombresApellidos.setValue('');

		if (controlNombresApellidos == "a_s2_nombresApellidos"){
			this.a_s2_nombresApellidos.setValue('');
			this.a_s2_licenciaConducir.setValue('');
			this.a_s2_numeroLicenciaConducir.setValue('');
			this.a_s2_claseCategoriaLicenciaConducir.setValue('');
			this.a_s2_educacionSuperior.setValue('');
			this.a_s2_experiencia.setValue('');
			this.filePdfInstructorConocimientosSeleccionado = null;
			this.valInstructorConocimientos = 0;
		}

		if (controlNombresApellidos == "a_s3_nombresApellidos")
			this.a_s3_nombresApellidos.setValue('');
			this.a_s3_licenciaConducir.setValue('');
			this.a_s3_numeroLicenciaConducir.setValue('');
			this.a_s3_secundariaCompleta.setValue('');
			this.a_s3_categoriaLicencia.setValue('');
			this.a_s3_sancionado.setValue('');
			this.filePdfInstructorHabilidadesSeleccionado = null;
			this.valInstructorHabilidades = 0;
	}

	buscarNumeroDocumento(controlTipoDocumento: string) {
		let tipoDocumento: string = "";
		let numeroDocumento: string = "";
		let nombresApellidos: any = "";
		let personal: string;

		if (controlTipoDocumento == "a_s1_tipoDocumento") {
			tipoDocumento = this.a_s1_tipoDocumento.value.trim();
			numeroDocumento = this.a_s1_numeroDocumento.value.trim();
			nombresApellidos = this.a_s1_nombresApellidos;
			personal = "Director";
		}

		if (controlTipoDocumento == "a_s2_tipoDocumento") {
			tipoDocumento = this.a_s2_tipoDocumento.value.trim();
			numeroDocumento = this.a_s2_numeroDocumento.value.trim();
			nombresApellidos = this.a_s2_nombresApellidos;
			personal = "InstructorConocimientos";
		}

		if (controlTipoDocumento == "a_s3_tipoDocumento") {
			tipoDocumento = this.a_s3_tipoDocumento.value.trim();
			numeroDocumento = this.a_s3_numeroDocumento.value.trim();
			nombresApellidos = this.a_s3_nombresApellidos;
			personal = "InstructorHabilidades";
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
					nombresApellidos.setValue(datosPersona.apPrimer + ' ' + datosPersona.apSegundo + ', ' + datosPersona.prenombres);

					if (controlTipoDocumento == "a_s2_tipoDocumento" || controlTipoDocumento == "a_s3_tipoDocumento"){
						this.buscarNumeroLicencia(tipoDocumento, numeroDocumento, personal);
					}
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

					nombresApellidos.setValue(respuesta.CarnetExtranjeria.nombres + ' ' + respuesta.CarnetExtranjeria.primerApellido + ' ' + respuesta.CarnetExtranjeria.segundoApellido);

					if (controlTipoDocumento == "a_s2_tipoDocumento" || controlTipoDocumento == "a_s3_tipoDocumento"){
						this.buscarNumeroLicencia(tipoDocumento, numeroDocumento, personal);
					}
				},
				error => {
					this.funcionesMtcService
						.ocultarCargando()
						.mensajeError('Error al consultar al servicio');
				}
			);
		}
	}

	async buscarNumeroLicencia(tipoDocumento:string, numeroDocumento:string, personal:string): Promise<void> {
		const tipoDoc = this.tipoDocumentoSNC.filter(item => item.tipoDocumento == tipoDocumento)[0].id;
		
      this.funcionesMtcService.mostrarCargando();
      try {
         const respuesta = await this.mtcService.getLicenciasConducir(tipoDoc, numeroDocumento).toPromise();
         this.funcionesMtcService.ocultarCargando();
         const datos: any = respuesta[0];
         console.log('DATOS getLicenciasConducir:', JSON.stringify(datos, null, 10));

         if (datos.GetDatosLicenciaMTCResult.CodigoRespuesta === 'MSJ01') {
				if(personal=="InstructorConocimientos"){
					this.a_s2_licenciaConducir.setValue('2');
					this.a_s2_licenciaConducir.disable();
				}
	
				if(personal=="InstructorHabilidades"){
					this.a_s3_licenciaConducir.setValue('2');
					this.a_s3_licenciaConducir.disable();
				}
				
            return this.funcionesMtcService.mensajeError('El número de documento no cuenta con licencia de conducir');
         }

         if (datos.GetDatosLicenciaMTCResult.CodigoRespuesta === 'MSJ02' || datos.GetDatosLicenciaMTCResult.CodigoRespuesta === 'MSJ03') {
				if(personal=="InstructorConocimientos"){
					this.a_s2_licenciaConducir.setValue('2');
					this.a_s2_licenciaConducir.disable();
				}
	
				if(personal=="InstructorHabilidades"){
					this.a_s3_licenciaConducir.setValue('2');
					this.a_s3_licenciaConducir.disable();
				}
            return this.funcionesMtcService.mensajeError('El número de documento no cuenta con licencia de conducir');
         }

         if (datos.GetDatosLicenciaMTCResult.Licencia.Estadolicencia === 'Vencida') {
				if(personal=="InstructorConocimientos"){
					this.a_s2_licenciaConducir.setValue('2');
					this.a_s2_licenciaConducir.disable();
				}
	
				if(personal=="InstructorHabilidades"){
					this.a_s3_licenciaConducir.setValue('2');
					this.a_s3_licenciaConducir.disable();
				}
            return this.funcionesMtcService.mensajeError('La licencia esta vencida');
         }

         if (datos.GetDatosLicenciaMTCResult.Licencia.Estadolicencia === 'Bloqueado') {
				if(personal=="InstructorConocimientos"){
					this.a_s2_licenciaConducir.setValue('2');
					this.a_s2_licenciaConducir.disable();
				}
	
				if(personal=="InstructorHabilidades"){
					this.a_s3_licenciaConducir.setValue('2');
					this.a_s3_licenciaConducir.disable();
				}
            return this.funcionesMtcService.mensajeError('La licencia esta bloqueada');
         }

         // VALIDAMOS LA CATEGORIA DE LAS LICENCIAS DE CONDUCIR

			const Licencia = datos.GetDatosLicenciaMTCResult.Licencia.NroLicencia.trim();
         const ClaseCategoria = datos.GetDatosLicenciaMTCResult.Licencia.Categoria?.trim();
			

			if(personal=="InstructorConocimientos"){
				this.a_s2_numeroLicenciaConducir.setValue(Licencia);
				this.a_s2_claseCategoriaLicenciaConducir.setValue(ClaseCategoria);
				this.a_s2_licenciaConducir.setValue('1');
				this.a_s2_licenciaConducir.disable();
			}

			if(personal=="InstructorHabilidades"){
				this.a_s3_numeroLicenciaConducir.setValue(Licencia);
				this.a_s3_licenciaConducir.setValue('1');
				this.a_s3_licenciaConducir.disable();
				this.a_s3_categoriaLicencia.disable();

				if(this.listaCategoriaLicencias.find(i => i.value.trim() == ClaseCategoria.trim())== undefined){
					this.a_s3_categoriaLicencia.setValue('');
					return this.funcionesMtcService.mensajeError('La categoria '+ ClaseCategoria + ' no esta permitida.');
				}else{
					if(this.mayorCategoriaFormulario > 0){
						if (this.listaCategoriaLicencias.filter(item => item.value == ClaseCategoria.trim())[0].id >= this.mayorCategoriaFormulario){
							console.log("aa:" + this.listaCategoriaLicencias.filter(item => item.value == ClaseCategoria.trim())[0].id);
							this.a_s3_categoriaLicencia.setValue(ClaseCategoria);
						}else{
							this.a_s3_categoriaLicencia.setValue(ClaseCategoria);
							return this.funcionesMtcService.mensajeError('La licencia de conducir vigente debe ser de la misma categoría a la que se postula o superior.');
						}
					}
					this.a_s3_categoriaLicencia.setValue(ClaseCategoria);
				}
			}

      } catch (error) {
         console.error(error);
         this.funcionesMtcService
            .ocultarCargando()
            .mensajeError('Error al consultar el Servicio MTC Licencias de Conducir');
      }
   }

	addDirector() {
		if (this.listaDirector.length == 3) {
			return this.funcionesMtcService.mensajeError('Solo puede agregar como máximo 3 directores.');
		}

		const tipoDocumento: string = this.a_s1_tipoDocumento.value.trim();
		const numeroDocumento: string = this.a_s1_numeroDocumento.value.trim();
		const apellidosNombres: string = this.a_s1_nombresApellidos.value?.trim();
		const grado: string = this.a_s1_grado.value?.trim();
		const fileDirector = this.filePdfDirectorSeleccionado;
		const pathNameDirector = null;

		if (tipoDocumento == "" || numeroDocumento == "" || apellidosNombres == "" || grado == "")
			return this.funcionesMtcService.mensajeError('Debe agregar todos los campos faltantes');

		const indexFind = this.listaDirector.findIndex(item => item.tipoDocumento.id === tipoDocumento && item.nroDocumento === numeroDocumento);

		console.log("valDirector:" + this.valDirector);
		if (this.valDirector === 0) {
			this.funcionesMtcService.mensajeError('Debe cargar el Currículo Vitae del Director');
			return;
		}

		if (indexFind !== -1) {
			if (indexFind !== this.indexEditTablaDirector)
				return this.funcionesMtcService.mensajeError('El tipo y número de documento ya existen. No pueden ser agregados.');
		}
		console.log(this.a_s1_experiencia_1.value);
		if (this.indexEditTablaDirector === -1) {

			this.listaDirector.push({
				tipoDocumento: {
					id: this.a_s1_tipoDocumento.value,
					documento: this.listaTiposDocumentos.filter(item => item.id == this.a_s1_tipoDocumento.value)[0].documento
				},
				nroDocumento: this.a_s1_numeroDocumento.value,
				apellidosNombres: this.a_s1_nombresApellidos.value,
				grado: this.a_s1_grado.value,
				experiencia_1: (this.a_s1_experiencia_1.value ? this.a_s1_experiencia_1.value : false),
				experiencia_2: (this.a_s1_experiencia_2.value ? this.a_s1_experiencia_2.value : false),
				fileDirector: fileDirector,
				pathNameDirector: pathNameDirector
			});
			console.log(this.listaDirector);
		} else {
			this.listaDirector[this.indexEditTablaDirector].tipoDocumento = {
				id: this.a_s1_tipoDocumento.value,
				documento: this.listaTiposDocumentos.filter(item => item.id == this.a_s1_tipoDocumento.value)[0].documento
			};

			this.listaDirector[this.indexEditTablaDirector].apellidosNombres = this.a_s1_nombresApellidos.value;
			this.listaDirector[this.indexEditTablaDirector].tipoDocumento = this.a_s1_tipoDocumento.value;
			this.listaDirector[this.indexEditTablaDirector].nroDocumento = this.a_s1_numeroDocumento.value;
			this.listaDirector[this.indexEditTablaDirector].grado = this.a_s1_grado.value;
			this.listaDirector[this.indexEditTablaDirector].experiencia_1 = this.a_s1_experiencia_1.value;
			this.listaDirector[this.indexEditTablaDirector].experiencia_2 = this.a_s1_experiencia_2.value;
			this.listaDirector[this.indexEditTablaDirector].fileDirector = fileDirector;

		}

		this.cancelarModificacion();
	}

	cancelarModificacion() {
		this.a_s1_tipoDocumento.setValue('');
		this.a_s1_numeroDocumento.setValue('');
		this.a_s1_nombresApellidos.setValue('');
		this.a_s1_grado.setValue('');
		this.a_s1_experiencia_1.setValue(false);
		this.a_s1_experiencia_2.setValue(false);
		this.filePdfDirectorSeleccionado = null;
		this.valDirector = 0;

		this.indexEditTablaDirector = -1;
	}

	modificarDirector(item: Director, index) {
		if (this.indexEditTablaDirector !== -1)
			return;

		this.indexEditTablaDirector = index;

		this.a_s1_tipoDocumento.setValue(item.tipoDocumento.id);
		this.a_s1_numeroDocumento.setValue(item.nroDocumento);
		this.a_s1_nombresApellidos.setValue(item.apellidosNombres);
		this.a_s1_grado.setValue(item.grado);
		this.a_s1_experiencia_1.setValue(item.experiencia_1);
		this.a_s1_experiencia_2.setValue(item.experiencia_2);
	}

	eliminarDirector(item: Director, index) {
		if (this.indexEditTablaDirector === -1) {

			this.funcionesMtcService
				.mensajeConfirmar('¿Está seguro de eliminar el registro seleccionado?')
				.then(() => {
					this.listaDirector.splice(index, 1);
				});
		}
	}

	addInstructorConocimientos() {
		if (this.listaInstructorConocimientos.length == 2) {
			return this.funcionesMtcService.mensajeError('Solo puede agregar como máximo 2 instructores de conocimientos.');
		}

		const tipoDocumento: string = this.a_s2_tipoDocumento.value?.trim();
		const numeroDocumento: string = this.a_s2_numeroDocumento.value?.trim();
		const apellidosNombres: string = this.a_s2_nombresApellidos.value?.trim();
		const instruccion: string = this.a_s2_educacionSuperior.value;
		const licenciaVigente: string = this.a_s2_licenciaConducir.value;
		const fileInstructorConocimientos = this.filePdfInstructorConocimientosSeleccionado;
		const pathNameInstructorConocimientos = null;

		const indexFind = this.listaInstructorConocimientos.findIndex(item => item.tipoDocumento.id === tipoDocumento && item.nroDocumento === numeroDocumento);

		if (licenciaVigente == "2"){
			return this.funcionesMtcService.mensajeError('Debe contar con licencia de conducir VIGENTE.');
		}

		if (tipoDocumento == "" || numeroDocumento == "" || apellidosNombres == "" || instruccion == "")
			return this.funcionesMtcService.mensajeError('Debe agregar todos los campos faltantes');

		if(fileInstructorConocimientos==null){
			return this.funcionesMtcService.mensajeError('Debe adjuntar el Currículo Vitae del Instructor de Conocimiento');
		}

		if (indexFind !== -1) {
			if (indexFind !== this.indexEditTablaInstructorConocimientos)
				return this.funcionesMtcService.mensajeError('El tipo y número de documento ya existen. No pueden ser agregados.');
		}

		if (this.indexEditTablaInstructorConocimientos === -1) {

			this.listaInstructorConocimientos.push({
				tipoDocumento: {
					id: this.a_s2_tipoDocumento.value,
					documento: this.listaTiposDocumentos.filter(item => item.id == this.a_s2_tipoDocumento.value)[0].documento
				},
				nroDocumento: this.a_s2_numeroDocumento.value,
				apellidosNombres: this.a_s2_nombresApellidos.value,
				educacionSuperior: {
					tecnico: (this.a_s2_educacionSuperior.value == "tecnico" ? true : false),
					profesional: (this.a_s2_educacionSuperior.value == "profesional" ? true : false)
				},
				licenciaVigente: (this.a_s2_licenciaConducir.value == "1" ? true : false),
				experiencia: (this.a_s2_experiencia.value == "1" ? true : false),
				fileInstructorConocimientos: fileInstructorConocimientos,
				pathNameInstructorConocimientos: pathNameInstructorConocimientos
			});
			console.log(this.listaInstructorConocimientos);
		} else {
			this.listaInstructorConocimientos[this.indexEditTablaInstructorConocimientos].tipoDocumento = {
				id: this.a_s2_tipoDocumento.value,
				documento: this.listaTiposDocumentos.filter(item => item.id == this.a_s2_tipoDocumento.value)[0].documento
			};

			this.listaInstructorConocimientos[this.indexEditTablaInstructorConocimientos].apellidosNombres = this.a_s2_nombresApellidos.value;
			this.listaInstructorConocimientos[this.indexEditTablaInstructorConocimientos].tipoDocumento = this.a_s2_tipoDocumento.value;
			this.listaInstructorConocimientos[this.indexEditTablaInstructorConocimientos].nroDocumento = this.a_s2_numeroDocumento.value;
			this.listaInstructorConocimientos[this.indexEditTablaInstructorConocimientos].educacionSuperior.tecnico = (this.a_s2_educacionSuperior.value == "tecnico" ? true : false);
			this.listaInstructorConocimientos[this.indexEditTablaInstructorConocimientos].educacionSuperior.profesional = (this.a_s2_educacionSuperior.value == "profesional" ? true : false);
			this.listaInstructorConocimientos[this.indexEditTablaInstructorConocimientos].licenciaVigente = (this.a_s2_licenciaConducir.value == "1" ? true : false);
			this.listaInstructorConocimientos[this.indexEditTablaInstructorConocimientos].experiencia = (this.a_s2_experiencia.value == "1" ? true : false);
			this.listaInstructorConocimientos[this.indexEditTablaInstructorConocimientos].fileInstructorConocimientos = fileInstructorConocimientos;
		}

		this.cancelarModificacionInstructorConocimientos();
	}

	cancelarModificacionInstructorConocimientos() {
		this.a_s2_tipoDocumento.setValue('');
		this.a_s2_numeroDocumento.setValue('');
		this.a_s2_nombresApellidos.setValue('');
		this.a_s2_educacionSuperior.setValue('');
		this.a_s2_licenciaConducir.setValue('');
		this.a_s2_numeroLicenciaConducir.setValue('');
		this.a_s2_claseCategoriaLicenciaConducir.setValue('');
		this.a_s2_experiencia.setValue('');
		this.filePdfInstructorConocimientosSeleccionado = null;
		this.valInstructorConocimientos = 0;

		this.indexEditTablaInstructorConocimientos = -1;
	}

	modificarInstructorConocimientos(item: InstructorConocimientos, index) {
		if (this.indexEditTablaInstructorConocimientos !== -1)
			return;

		this.indexEditTablaInstructorConocimientos = index;

		this.a_s2_tipoDocumento.setValue(item.tipoDocumento.id);
		this.a_s2_numeroDocumento.setValue(item.nroDocumento);
		this.a_s2_nombresApellidos.setValue(item.apellidosNombres);
		this.a_s2_educacionSuperior.setValue(item.educacionSuperior.profesional ? "profesional" : "tecnico");
		this.a_s2_licenciaConducir.setValue(item.licenciaVigente ?? false);
		this.a_s2_experiencia.setValue(item.experiencia ?? false);
	}

	eliminarInstructorConocimientos(item: InstructorConocimientos, index) {
		if (this.indexEditTablaInstructorConocimientos === -1) {

			this.funcionesMtcService
				.mensajeConfirmar('¿Está seguro de eliminar el registro seleccionado?')
				.then(() => {
					this.listaInstructorConocimientos.splice(index, 1);
				});
		}
	}

	addInstructorHabilidades() {

		if (this.listaInstructorHabilidades.length == 4) {
			return this.funcionesMtcService.mensajeError('Solo puede agregar como máximo 4 instructores de habilidades en la conducción.');
		}

		const tipoDocumento: string = this.a_s3_tipoDocumento.value.trim();
		const numeroDocumento: string = this.a_s3_numeroDocumento.value.trim();
		const apellidosNombres: string = this.a_s3_nombresApellidos.value?.trim();
		const categoria: string = this.a_s3_categoriaLicencia.value?.trim();
		const licenciaVigente: string = this.a_s3_licenciaConducir.value;
		const secundaria:string = this.a_s3_secundariaCompleta.value;
		const sancionado:string = this.a_s3_sancionado.value;
		const fileInstructorHabilidades = this.filePdfInstructorHabilidadesSeleccionado;
		const pathNameInstructorHabilidades = null;

		if (licenciaVigente == "2"){
			return this.funcionesMtcService.mensajeError('Debe contar con licencia de conducir VIGENTE.');
		}

		if (tipoDocumento == "" || numeroDocumento == "" || apellidosNombres == "" || secundaria == "" || sancionado == "")
			return this.funcionesMtcService.mensajeError('Debe agregar todos los campos faltantes');

		if (categoria == "") {
			return this.funcionesMtcService.mensajeError('Debe seleccionar la categoría de la licencia de conducir.');
		}

		if(this.mayorCategoriaFormulario>0){
			if (this.listaCategoriaLicencias.filter(item => item.value == categoria.trim())[0].id < this.mayorCategoriaFormulario){
				return this.funcionesMtcService.mensajeError('La licencia de conducir vigente debe ser de la misma categoría a la que se postula o superior.');
			}
		}

		if(sancionado=="1"){
			return this.funcionesMtcService.mensajeError('La licencia de conducir no debe tener sanciones.');
		}

		if(fileInstructorHabilidades == null){
			return this.funcionesMtcService.mensajeError('Debe adjuntar el Currículo Vitae del Instructor de Habilidades en la conducción.');
		}

		const indexFind = this.listaInstructorHabilidades.findIndex(item => item.tipoDocumento.id === tipoDocumento && item.nroDocumento === numeroDocumento);

		if (indexFind !== -1) {
			if (indexFind !== this.indexEditTablaInstructorHabilidades)
				return this.funcionesMtcService.mensajeError('El tipo y número de documento ya existen. No pueden ser agregados.');
		}

		if (this.indexEditTablaInstructorHabilidades === -1) {

			this.listaInstructorHabilidades.push({
				tipoDocumento: {
					id: this.a_s3_tipoDocumento.value,
					documento: this.listaTiposDocumentos.filter(item => item.id == this.a_s3_tipoDocumento.value)[0].documento
				},
				nroDocumento: this.a_s3_numeroDocumento.value,
				apellidosNombres: this.a_s3_nombresApellidos.value,
				secundariaCompleta: (this.a_s3_secundariaCompleta.value == "1" ? true : false),
				licenciaVigente: (this.a_s3_licenciaConducir.value == "1" ? true : false),
				categoria: this.a_s3_categoriaLicencia.value,
				sancionado: (this.a_s3_sancionado.value == "1" ? true : false),
				fileInstructorHabilidades: fileInstructorHabilidades,
				pathNameInstructorHabilidades: pathNameInstructorHabilidades
			});
			console.log(this.listaInstructorHabilidades);
		} else {
			this.listaInstructorHabilidades[this.indexEditTablaInstructorHabilidades].tipoDocumento = {
				id: this.a_s3_tipoDocumento.value,
				documento: this.listaTiposDocumentos.filter(item => item.id == this.a_s3_tipoDocumento.value)[0].documento
			};

			this.listaInstructorHabilidades[this.indexEditTablaInstructorHabilidades].apellidosNombres = this.a_s3_nombresApellidos.value;
			this.listaInstructorHabilidades[this.indexEditTablaInstructorHabilidades].tipoDocumento = this.a_s3_tipoDocumento.value;
			this.listaInstructorHabilidades[this.indexEditTablaInstructorHabilidades].nroDocumento = this.a_s3_numeroDocumento.value;
			this.listaInstructorHabilidades[this.indexEditTablaInstructorHabilidades].secundariaCompleta = (this.a_s3_secundariaCompleta.value == "1" ? true : false);
			this.listaInstructorHabilidades[this.indexEditTablaInstructorHabilidades].licenciaVigente = (this.a_s3_licenciaConducir.value == "1" ? true : false);
			this.listaInstructorHabilidades[this.indexEditTablaInstructorHabilidades].categoria = this.a_s3_categoriaLicencia.value;
			this.listaInstructorHabilidades[this.indexEditTablaInstructorHabilidades].sancionado = (this.a_s3_sancionado.value == "1" ? true : false);
			this.listaInstructorHabilidades[this.indexEditTablaInstructorHabilidades].fileInstructorHabilidades = fileInstructorHabilidades;
		}

		this.cancelarModificacionInstructorHabilidades();
	}

	cancelarModificacionInstructorHabilidades() {
		this.a_s3_tipoDocumento.setValue('');
		this.a_s3_numeroDocumento.setValue('');
		this.a_s3_nombresApellidos.setValue('');
		this.a_s3_secundariaCompleta.setValue('');
		this.a_s3_categoriaLicencia.setValue('');
		this.a_s3_licenciaConducir.setValue('');
		this.a_s3_numeroLicenciaConducir.setValue('');
		this.a_s3_sancionado.setValue('');
		this.filePdfInstructorHabilidadesSeleccionado = null;
		this.valInstructorHabilidades = 0;

		this.indexEditTablaInstructorHabilidades = -1;
	}

	eliminarInstructorHabilidades(item: InstructorHabilidades, index) {
		if (this.indexEditTablaInstructorHabilidades === -1) {

			this.funcionesMtcService
				.mensajeConfirmar('¿Está seguro de eliminar el registro seleccionado?')
				.then(() => {
					this.listaInstructorHabilidades.splice(index, 1);
				});
		}
	}

	onChangeInputDirector(event): void {
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

		this.filePdfDirectorSeleccionado = event.target.files[0];
		console.log('====> ' + this.filePdfDirectorSeleccionado);
		event.target.value = '';
		this.valDirector = 1;
	}

	onChangeInputInstructorConocimientos(event): void {
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

		this.filePdfInstructorConocimientosSeleccionado = event.target.files[0];
		console.log('====> ' + this.filePdfInstructorConocimientosSeleccionado);
		event.target.value = '';
		this.valInstructorConocimientos = 1;
	}

	onChangeInputInstructorHabilidades(event): void {
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

		this.filePdfInstructorHabilidadesSeleccionado = event.target.files[0];
		console.log('====> ' + this.filePdfInstructorHabilidadesSeleccionado);
		event.target.value = '';
		this.valInstructorHabilidades = 1;
	}

	async vistaPreviaDirector(): Promise<void> {
		if (this.filePdfDirectorSeleccionado) {
			const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
			const urlPdf = URL.createObjectURL(this.filePdfDirectorSeleccionado);
			modalRef.componentInstance.pdfUrl = urlPdf;
			modalRef.componentInstance.titleModal = 'Vista Previa - Director: Currículo Vitae';
		} else {
			this.funcionesMtcService.mostrarCargando();

			try {
				const file: Blob = await this.visorPdfArchivosService.get(this.filePdfDirectorPathName).toPromise();
				this.funcionesMtcService.ocultarCargando();

				// this.visualizarGrillaPdf(file, item.placaRodaje);
				const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
				const urlPdf = URL.createObjectURL(file);
				modalRef.componentInstance.pdfUrl = urlPdf;
				modalRef.componentInstance.titleModal = 'Vista Previa - Director: Currículo Vitae ';
			} catch (error) {
				console.error(error);
				this.funcionesMtcService
					.ocultarCargando()
					.mensajeError('Problemas para descargar PDF');
			}
		}
	}

	async vistaPreviaInstructorConocimientos(): Promise<void> {
		if (this.filePdfInstructorConocimientosSeleccionado) {
			const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
			const urlPdf = URL.createObjectURL(this.filePdfInstructorConocimientosSeleccionado);
			modalRef.componentInstance.pdfUrl = urlPdf;
			modalRef.componentInstance.titleModal = 'Vista Previa - InstructorConocimientos: Currículo Vitae';
		} else {
			this.funcionesMtcService.mostrarCargando();

			try {
				const file: Blob = await this.visorPdfArchivosService.get(this.filePdfInstructorConocimientosPathName).toPromise();
				this.funcionesMtcService.ocultarCargando();

				// this.visualizarGrillaPdf(file, item.placaRodaje);
				const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
				const urlPdf = URL.createObjectURL(file);
				modalRef.componentInstance.pdfUrl = urlPdf;
				modalRef.componentInstance.titleModal = 'Vista Previa - InstructorConocimientos: Currículo Vitae ';
			} catch (error) {
				console.error(error);
				this.funcionesMtcService
					.ocultarCargando()
					.mensajeError('Problemas para descargar PDF');
			}
		}
	}

	async vistaPreviaInstructorHabilidades(): Promise<void> {
		if (this.filePdfInstructorHabilidadesSeleccionado) {
			const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
			const urlPdf = URL.createObjectURL(this.filePdfInstructorHabilidadesSeleccionado);
			modalRef.componentInstance.pdfUrl = urlPdf;
			modalRef.componentInstance.titleModal = 'Vista Previa - Currículo Vitae';
		} else {
			this.funcionesMtcService.mostrarCargando();

			try {
				const file: Blob = await this.visorPdfArchivosService.get(this.filePdfInstructorHabilidadesPathName).toPromise();
				this.funcionesMtcService.ocultarCargando();

				// this.visualizarGrillaPdf(file, item.placaRodaje);
				const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
				const urlPdf = URL.createObjectURL(file);
				modalRef.componentInstance.pdfUrl = urlPdf;
				modalRef.componentInstance.titleModal = 'Vista Previa - Currículo Vitae ';
			} catch (error) {
				console.error(error);
				this.funcionesMtcService
					.ocultarCargando()
					.mensajeError('Problemas para descargar PDF');
			}
		}
	}

	async verPdfDirectorGrilla(item: Director): Promise<void> {
		if (item.fileDirector && this.dataInput.movId == 0) {
			const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
			const urlPdf = URL.createObjectURL(item.fileDirector);
			modalRef.componentInstance.pdfUrl = urlPdf;
			modalRef.componentInstance.titleModal = 'Vista Previa - CV: ' + item.apellidosNombres;
		} else {
			this.funcionesMtcService.mostrarCargando();

			try {
				const file: Blob = await this.visorPdfArchivosService.get(item.pathNameDirector).toPromise();
				this.funcionesMtcService.ocultarCargando();
				const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
				const urlPdf = URL.createObjectURL(file);
				modalRef.componentInstance.pdfUrl = urlPdf;
				modalRef.componentInstance.titleModal = 'Vista Previa - CV: ' + item.apellidosNombres;
			} catch (error) {
				console.error(error);
				this.funcionesMtcService
					.ocultarCargando()
					.mensajeError('Problemas para descargar PDF');
			}
		}
	}

	async verPdfInstructorConocimientosGrilla(item: InstructorConocimientos): Promise<void> {
		if (item.fileInstructorConocimientos && this.dataInput.movId == null) {
			const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
			const urlPdf = URL.createObjectURL(item.fileInstructorConocimientos);
			modalRef.componentInstance.pdfUrl = urlPdf;
			modalRef.componentInstance.titleModal = 'Vista Previa - CV: ' + item.apellidosNombres;
		} else {
			this.funcionesMtcService.mostrarCargando();

			try {
				const file: Blob = await this.visorPdfArchivosService.get(item.pathNameInstructorConocimientos).toPromise();
				this.funcionesMtcService.ocultarCargando();
				const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
				const urlPdf = URL.createObjectURL(file);
				modalRef.componentInstance.pdfUrl = urlPdf;
				modalRef.componentInstance.titleModal = 'Vista Previa - CV: ' + item.apellidosNombres;
			} catch (error) {
				console.error(error);
				this.funcionesMtcService
					.ocultarCargando()
					.mensajeError('Problemas para descargar PDF');
			}
		}
	}

	async verPdfInstructorHabilidadesGrilla(item: InstructorHabilidades): Promise<void> {
		console.log(item);
		if (item.fileInstructorHabilidades && item.pathNameInstructorHabilidades == null) {
			const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
			const urlPdf = URL.createObjectURL(item.fileInstructorHabilidades);
			modalRef.componentInstance.pdfUrl = urlPdf;
			modalRef.componentInstance.titleModal = 'Vista Previa - CV: ' + item.apellidosNombres;
		} else {
			this.funcionesMtcService.mostrarCargando();

			try {
				const file: Blob = await this.visorPdfArchivosService.get(item.pathNameInstructorHabilidades).toPromise();
				this.funcionesMtcService.ocultarCargando();
				const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
				const urlPdf = URL.createObjectURL(file);
				modalRef.componentInstance.pdfUrl = urlPdf;
				modalRef.componentInstance.titleModal = 'Vista Previa - CV: ' + item.apellidosNombres;
			} catch (error) {
				console.error(error);
				this.funcionesMtcService
					.ocultarCargando()
					.mensajeError('Problemas para descargar PDF');
			}
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

			if(seccion5.licencia_IIa){
				this.listaCategoriaLicenciaFormulario.push({
					id:1,
					text:'A IIa'
				});
			}

			if(seccion5.licencia_IIb){
				this.listaCategoriaLicenciaFormulario.push({
					id:2,
					text:'A IIb'
				});
			}

			if(seccion5.licencia_IIIa){
				this.listaCategoriaLicenciaFormulario.push({
					id:3,
					text:'A IIIa'
				});
			}

			if(seccion5.licencia_IIIb){
				this.listaCategoriaLicenciaFormulario.push({
					id:4,
					text:'A IIIb'
				});
			}

			if(seccion5.licencia_IIIc){
				this.listaCategoriaLicenciaFormulario.push({
					id:5,
					text:'A IIIc'
				});
			}

			if(seccion5.licencia_IIc){
				this.listaCategoriaLicenciaFormulario.push({
					id:6,
					text:'B IIc'
				});
			}
			if(this.listaCategoriaLicenciaFormulario.length > 0){
				const resultadosOrdenados = this.listaCategoriaLicenciaFormulario.sort((a,b) =>{
					return Number.parseInt(b.id) - Number.parseInt(a.id)
				});

				this.mayorCategoriaFormulario = resultadosOrdenados[0].id;
			}

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

		if(this.listaDirector.length==0){
			return this.funcionesMtcService.mensajeError('Debe registrar al menos un Director.');
		}

		if(this.listaInstructorConocimientos.length==0){
			return this.funcionesMtcService.mensajeError('Debe registrar al menos un Instructor de Conocimientos.');
		}

		if(this.listaInstructorHabilidades.length==0){
			return this.funcionesMtcService.mensajeError('Debe registrar al menos un Instructor de Habilidades en la conducción.');
		}

		const dataGuardar = new Anexo009_A17_3Request();
		// -------------------------------------
		dataGuardar.id = this.idAnexo;
		dataGuardar.movimientoFormularioId = this.dataInput.tramiteReqRefId;
		dataGuardar.anexoId = 9;
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
			seccion3
		} = dataGuardar.metaData;

		//seccion 1
		seccion1.listaDirector = this.listaDirector;
		seccion1.codigoProcedimiento = this.codigoProcedimientoTupa;
		dataGuardar.metaData.seccion1 = seccion1;
		//seccion 2
		seccion2.listaInstructorConocimientos = this.listaInstructorConocimientos;
		dataGuardar.metaData.seccion2 = seccion2;
		//seccion 3
		seccion3.listaInstructorHabilidades = this.listaInstructorHabilidades;
		dataGuardar.metaData.seccion3 = seccion3;

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
