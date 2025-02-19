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
import { Anexo009_B17_3Response } from '../../../domain/anexo009_B17_3/anexo009_B17_3Response';
import { UbigeoComponent } from '../../../../../shared/components/forms/ubigeo/ubigeo.component';
import { Anexo009_B17_3Request, MetaData, FlotaVehicular, Opciones } from '../../../domain/anexo009_B17_3/anexo009_B17_3Request';
import { ExtranjeriaService } from '../../../../../core/services/servicios/extranjeria.service';
import { ReniecService } from '../../../../../core/services/servicios/reniec.service';
import { SunatService } from '../../../../../core/services/servicios/sunat.service';
import { CONSTANTES } from '../../../../../enums/constants';
import { Anexo009_B17_3Service } from '../../../application/usecases';
import { TipoDocumentoModel } from '../../../../../core/models/TipoDocumentoModel';
import { FormularioTramiteService } from '../../../../../core/services/tramite/formulario-tramite.service';
import { RenatService } from 'src/app/core/services/servicios/renat.service';
import { VehiculoService } from 'src/app/core/services/servicios/vehiculo.service';
import { ValidateFileSize_Formulario } from 'src/app/helpers/file';

@Component({
	// tslint:disable-next-line: component-selector
	selector: 'app-anexo009_B17_3',
	templateUrl: './anexo009_B17_3.component.html',
	styleUrls: ['./anexo009_B17_3.component.css']
})

// tslint:disable-next-line: class-name
export class Anexo009_B17_3_Component implements OnInit, AfterViewInit, AfterViewChecked {
	@Input() public dataInput: any;
	@ViewChild('acc') acc: NgbAccordionDirective ;

	@ViewChild('ubigeoCmpEstFija1') ubigeoEstFija1Component: UbigeoComponent;


	txtTitulo = 'ANEXO 009-B/17.03 ESCUELA DE CONDUCTORES FLOTA VEHICULAR';

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

	listaFlotaVehicular: FlotaVehicular[] = [];

	listaCategoriaLicencias: Opciones[] = [
		{ value: "A I",    text: 'A I',   id : 1, categoria:'M1' },
		{ value: "A IIa",  text: 'A IIa', id : 1, categoria:'M1' },
		{ value: "A IIb",  text: 'A IIb', id : 2, categoria:'M2' },
		{ value: "A IIb",  text: 'A IIb', id : 2, categoria:'N2' },
		{ value: "A IIIa", text: 'A IIIa', id: 3, categoria:'M3' },
		{ value: "A IIIb", text: 'A IIIb', id: 4, categoria:'N3' },
		{ value: "A IIIc", text: 'A IIIc', id: 5, categoria:'M3' },
		{ value: "A IIIc", text: 'A IIIc', id: 5, categoria:'N3' },
		{ value: "B IIc",  text: 'B IIc',  id: 6, categoria:'L5' },
	];

	listaCategoriaLicenciaFormulario:any = [];
	mayorCategoriaFormulario:number = 0;

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

	indexEditTabla = -1;

	filePdfPathName: string = null;
	filePdfSeleccionado: any = null;
	val = 0;

	filePdfCertificadoPathName: string = null;
	filePdfCertificadoSeleccionado: any = null;
	valCertificado = 0;

	certificadoDobleComando: boolean =  false;

	constructor(
		private fb: UntypedFormBuilder,
		private funcionesMtcService: FuncionesMtcService,
		private modalService: NgbModal,
		private anexoService: Anexo009_B17_3Service,
		private seguridadService: SeguridadService,
		private anexoTramiteService: AnexoTramiteService,
		private visorPdfArchivosService: VisorPdfArchivosService,
		public activeModal: NgbActiveModal,
		private reniecService: ReniecService,
		private extranjeriaService: ExtranjeriaService,
		private sunatService: SunatService,
		private readonly changeDetectorRef: ChangeDetectorRef,
		private renatService: RenatService,
		private formularioTramiteService: FormularioTramiteService,
		private vehiculoService: VehiculoService
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
				a_s1_marca: [''],
				a_s1_modelo: [''],
				a_s1_clase: [''],
				a_s1_vin: [''],
				a_s1_serieChasis: [''],
				a_s1_serieMotor: [''],
				a_s1_anioFabricacion: [''],
				a_s1_placa: ['']
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
	get a_s1_marca(): UntypedFormControl { return this.a_Seccion1.get('a_s1_marca') as UntypedFormControl }
	get a_s1_modelo(): UntypedFormControl { return this.a_Seccion1.get('a_s1_modelo') as UntypedFormControl }
	get a_s1_clase(): UntypedFormControl { return this.a_Seccion1.get('a_s1_clase') as UntypedFormControl }
	get a_s1_vin(): UntypedFormControl { return this.a_Seccion1.get('a_s1_vin') as UntypedFormControl }
	get a_s1_serieChasis(): UntypedFormControl { return this.a_Seccion1.get('a_s1_serieChasis') as UntypedFormControl }
	get a_s1_serieMotor(): UntypedFormControl { return this.a_Seccion1.get('a_s1_serieMotor') as UntypedFormControl }
	get a_s1_anioFabricacion(): UntypedFormControl { return this.a_Seccion1.get('a_s1_anioFabricacion') as UntypedFormControl }
	get a_s1_placa(): UntypedFormControl { return this.a_Seccion1.get('a_s1_placa') as UntypedFormControl }

	async cargarDatos(): Promise<void> {
		this.funcionesMtcService.mostrarCargando();

		if (this.dataInput.movId > 0) {
			// RECUPERAMOS LOS DATOS
			try {
				const dataAnexo = await this.anexoTramiteService.get<Anexo009_B17_3Response>(this.dataInput.tramiteReqId).toPromise();
				console.log(JSON.parse(dataAnexo.metaData));
				const {
					tipoDocumentoSolicitante,
					nombreTipoDocumentoSolicitante,
					nombresApellidosSolicitante,
					numeroDocumentoSolicitante,
					seccion1
				} = JSON.parse(dataAnexo.metaData) as MetaData;

				this.idAnexo = dataAnexo.anexoId;
				this.listaFlotaVehicular = seccion1.listaFlotaVehicular;
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
			modalRef.componentInstance.titleModal = 'Vista Previa - Anexo 009-B/17.03';
		}
		catch (e) {
			console.error(e);
			this.funcionesMtcService
				.ocultarCargando()
				.mensajeError('Problemas para descargar el archivo PDF');
		}
	}

	getMaxLengthNumeroDocumento() {
		const tipoDocumento: string = this.a_s1_placa.value.trim();

		if (tipoDocumento === '6')//PLACA
			return 6;

		return 0
	}

	changeTipoDocumento() {
		this.a_s1_marca.setValue('');
		this.a_s1_modelo.setValue('');
		this.a_s1_clase.setValue('');
		this.a_s1_vin.setValue('');
		this.a_s1_serieChasis.setValue('');
		this.a_s1_serieMotor.setValue('');
		this.a_s1_anioFabricacion.setValue('');
		this.a_s1_placa.setValue('')
		this.inputNumeroDocumento();
	}

	inputNumeroDocumento(event = undefined) {
		if (event)
			event.target.value = event.target.value.replace(/[^0-9]/g, '');

		//this.a_s2_nombresApellidos.setValue('');
	}

	buscarPlacaRodaje(): void {
		const placaRodaje = this.a_s1_placa.value.trim();
		let categoria:string = "";

		if (placaRodaje.length !== 6) {
			return;
		}

		this.changePlacaRodaje();

		this.funcionesMtcService.mostrarCargando();
		this.vehiculoService.getPlacaRodaje(placaRodaje).subscribe(
			respuesta => {
				console.log(respuesta);
				this.funcionesMtcService.ocultarCargando();

				categoria = respuesta.categoria?.trim();
				if(categoria !=""){
					if(categoria.length>2){
						categoria = categoria.substring(0,2);
					}

					if(this.listaCategoriaLicencias.find(i => i.categoria.trim() == categoria)== undefined){
						return this.funcionesMtcService.mensajeError('La categoria vehicular '+ categoria + ' no está permitida.');
					}

					if(this.listaCategoriaLicenciaFormulario.find(i => i.categoria.trim() == categoria)== undefined){
						return this.funcionesMtcService.mensajeError('La categoria vehicular '+ categoria + ' no corresponde a ninguna categoría a la que postula.');
					}else{
						if(categoria == "M1")
							this.certificadoDobleComando = true;
						else
							this.certificadoDobleComando = false;
					}
				}else{
					return this.funcionesMtcService.mensajeError('La unidad vehicular no cuenta con categoría definida.');
				}

				this.a_s1_marca.setValue(respuesta.marca);
				this.a_s1_modelo.setValue(respuesta.modelo);
				this.a_s1_clase.setValue(respuesta.clase);			
				this.a_s1_vin.setValue(respuesta.vin);
				this.a_s1_serieChasis.setValue(respuesta.chasis);
				this.a_s1_serieMotor.setValue(respuesta.motor);
				if(respuesta.anioFabricacion!="0" && respuesta.anioModelo!="0"){
					this.a_s1_anioFabricacion.setValue("AF:" +respuesta.anioFabricacion + " AM:" +  respuesta.anioModelo);
				}else{
					if(respuesta.anioFabricacion!="0"){
						this.a_s1_anioFabricacion.setValue("AF:" +respuesta.anioFabricacion);
					}
					if(respuesta.anioFabricacion!="0"){
						this.a_s1_anioFabricacion.setValue("AM:" +respuesta.anioModelo);
					}
				}
				this.a_s1_placa.setValue(placaRodaje);
				
				
			},
			error => {
				this.funcionesMtcService
					.ocultarCargando()
					.mensajeError('Error al consultar al servicio');
			}
		);
	}

	changePlacaRodaje(): void {
		this.a_s1_marca.setValue('');
		this.a_s1_modelo.setValue('');
		this.a_s1_clase.setValue('')
		this.a_s1_vin.setValue('');
		this.a_s1_serieChasis.setValue('');
		this.a_s1_serieMotor.setValue('');
		this.a_s1_anioFabricacion.setValue('');
		
	 }

	addFlotaVehicular() {
		/*if (this.formularioCompleto() === false)
		  return this.funcionesMtcService.mensajeError('Debe agregar todos los campos faltantes');*/
		  const fileDirector = this.filePdfSeleccionado;
		  const pathNameDirector = null;

		  const fileCertificado = this.filePdfCertificadoSeleccionado;
		  const pathNameCertificado = null;

		if(this.a_s1_placa.value == "" || this.a_s1_marca.value == "" || this.a_s1_modelo.value == "" || this.a_s1_serieMotor.value == "")
		return this.funcionesMtcService.mensajeError('Debe agregar todos los campos faltantes');


		const placa: string = this.a_s1_placa.value.trim();
		const indexFind = this.listaFlotaVehicular.findIndex(item => item.placa === placa);

		if (indexFind !== -1) {
			if (indexFind !== this.indexEditTabla)
				return this.funcionesMtcService.mensajeError('El número de placa ya existen. No pueden ser agregados.');
		}

		if (this.indexEditTabla === -1) {
			this.listaFlotaVehicular.push({
				marca: this.a_s1_marca.value,
				modelo: this.a_s1_modelo.value,
				clase: this.a_s1_clase.value,
				vin: this.a_s1_vin.value,
				serieChasis: this.a_s1_serieChasis.value,
				serieMotor: this.a_s1_serieMotor.value,
				anioFabricacion: this.a_s1_anioFabricacion.value,
				placa: this.a_s1_placa.value,
				file: fileDirector,
				pathName: pathNameDirector,
				fileCertificado:fileCertificado,
				pathNameCertificado: pathNameCertificado
			});
		} else {
			this.listaFlotaVehicular[this.indexEditTabla].marca = this.a_s1_marca.value;
			this.listaFlotaVehicular[this.indexEditTabla].modelo = this.a_s1_modelo.value;
			this.listaFlotaVehicular[this.indexEditTabla].clase = this.a_s1_clase.value;
			this.listaFlotaVehicular[this.indexEditTabla].vin = this.a_s1_vin.value;
			this.listaFlotaVehicular[this.indexEditTabla].serieChasis = this.a_s1_serieChasis.value;
			this.listaFlotaVehicular[this.indexEditTabla].serieMotor = this.a_s1_serieMotor.value;
			this.listaFlotaVehicular[this.indexEditTabla].anioFabricacion = this.a_s1_anioFabricacion.value;
			this.listaFlotaVehicular[this.indexEditTabla].placa = this.a_s1_placa.value;
			this.listaFlotaVehicular[this.indexEditTabla].file = fileDirector;
			this.listaFlotaVehicular[this.indexEditTabla].fileCertificado = fileCertificado;
		}

		this.cancelarModificacion();
	}

	cancelarModificacion() {
		this.a_s1_placa.setValue('');
		this.a_s1_marca.setValue('');
		this.a_s1_modelo.setValue('');
		this.a_s1_clase.setValue('')
		this.a_s1_vin.setValue('');
		this.a_s1_serieChasis.setValue('');
		this.a_s1_serieMotor.setValue('');
		this.a_s1_anioFabricacion.setValue('');
		this.filePdfSeleccionado = null;
		this.val = 0;
		this.filePdfCertificadoSeleccionado = null;
		this.valCertificado = 0;

		this.indexEditTabla = -1;
	}

	eliminarFlotaVehicular(item: FlotaVehicular, index) {
		if (this.indexEditTabla === -1) {

			this.funcionesMtcService
				.mensajeConfirmar('¿Está seguro de eliminar el registro seleccionado?')
				.then(() => {
					this.listaFlotaVehicular.splice(index, 1);
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

		this.filePdfSeleccionado = event.target.files[0];
		console.log('====> ' + this.filePdfSeleccionado);
		event.target.value = '';
		this.val = 1;
	}

	onChangeInputCertificado(event): void {
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

		this.filePdfCertificadoSeleccionado = event.target.files[0];
		console.log('====> ' + this.filePdfCertificadoSeleccionado);
		event.target.value = '';
		this.valCertificado = 1;
	}

	async vistaPreviaDirector(): Promise<void> {
		if (this.filePdfSeleccionado) {
			const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
			const urlPdf = URL.createObjectURL(this.filePdfSeleccionado);
			modalRef.componentInstance.pdfUrl = urlPdf;
			modalRef.componentInstance.titleModal = 'Vista Previa';
		} else {
			this.funcionesMtcService.mostrarCargando();

			try {
				const file: Blob = await this.visorPdfArchivosService.get(this.filePdfPathName).toPromise();
				this.funcionesMtcService.ocultarCargando();

				// this.visualizarGrillaPdf(file, item.placaRodaje);
				const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
				const urlPdf = URL.createObjectURL(file);
				modalRef.componentInstance.pdfUrl = urlPdf;
				modalRef.componentInstance.titleModal = 'Vista Previa';
			} catch (error) {
				console.error(error);
				this.funcionesMtcService
					.ocultarCargando()
					.mensajeError('Problemas para descargar PDF');
			}
		}
	}

	async vistaPreviaCertificado(): Promise<void> {
		if (this.filePdfCertificadoSeleccionado) {
			const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
			const urlPdf = URL.createObjectURL(this.filePdfCertificadoSeleccionado);
			modalRef.componentInstance.pdfUrl = urlPdf;
			modalRef.componentInstance.titleModal = 'Vista Previa';
		} else {
			this.funcionesMtcService.mostrarCargando();

			try {
				const file: Blob = await this.visorPdfArchivosService.get(this.filePdfCertificadoPathName).toPromise();
				this.funcionesMtcService.ocultarCargando();

				// this.visualizarGrillaPdf(file, item.placaRodaje);
				const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
				const urlPdf = URL.createObjectURL(file);
				modalRef.componentInstance.pdfUrl = urlPdf;
				modalRef.componentInstance.titleModal = 'Vista Previa';
			} catch (error) {
				console.error(error);
				this.funcionesMtcService
					.ocultarCargando()
					.mensajeError('Problemas para descargar PDF');
			}
		}
	}

	async verPdfDirectorGrilla(item: FlotaVehicular): Promise<void> {
		if (item.file && this.dataInput.movId == 0) {
			const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
			const urlPdf = URL.createObjectURL(item.file);
			modalRef.componentInstance.pdfUrl = urlPdf;
			modalRef.componentInstance.titleModal = 'Vista Previa ';
		} else {
			this.funcionesMtcService.mostrarCargando();

			try {
				const file: Blob = await this.visorPdfArchivosService.get(item.pathName).toPromise();
				this.funcionesMtcService.ocultarCargando();
				const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
				const urlPdf = URL.createObjectURL(file);
				modalRef.componentInstance.pdfUrl = urlPdf;
				modalRef.componentInstance.titleModal = 'Vista Previa';
			} catch (error) {
				console.error(error);
				this.funcionesMtcService
					.ocultarCargando()
					.mensajeError('Problemas para descargar PDF');
			}
		}
	}

	async verPdfCertificadoGrilla(item: FlotaVehicular): Promise<void> {
		if (item.file && this.dataInput.movId == 0) {
			const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
			const urlPdf = URL.createObjectURL(item.file);
			modalRef.componentInstance.pdfUrl = urlPdf;
			modalRef.componentInstance.titleModal = 'Vista Previa ';
		} else {
			this.funcionesMtcService.mostrarCargando();

			try {
				const file: Blob = await this.visorPdfArchivosService.get(item.pathName).toPromise();
				this.funcionesMtcService.ocultarCargando();
				const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
				const urlPdf = URL.createObjectURL(file);
				modalRef.componentInstance.pdfUrl = urlPdf;
				modalRef.componentInstance.titleModal = 'Vista Previa';
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
			
			//if(seccion5.licencia_IIa){
				this.listaCategoriaLicenciaFormulario.push(
					{ id:1, text:'A I', categoria: 'M1'}
				);
			//}

			if(seccion5.licencia_IIa){
				this.listaCategoriaLicenciaFormulario.push(
					{ id:1, text:'A IIa', categoria: 'M1'}
				);
			}

			if(seccion5.licencia_IIb){
				this.listaCategoriaLicenciaFormulario.push(
					{ id:2, text:'A IIb', categoria: 'M2'},
					{ id:2, text:'A IIb', categoria: 'N2'}
				);
			}

			if(seccion5.licencia_IIIa){
				this.listaCategoriaLicenciaFormulario.push(
					{ id:3, text:'A IIIa', categoria: 'M3'}
				);
			}

			if(seccion5.licencia_IIIb){
				this.listaCategoriaLicenciaFormulario.push(
					{ id:4, text:'A IIIb', categoria: 'N3'}
				);
			}

			if(seccion5.licencia_IIIc){
				this.listaCategoriaLicenciaFormulario.push(
					{ id:5, text:'A IIIc', categoria: 'M3'},
					{ id:5, text:'A IIIc', categoria: 'N3'}
				);
			}

			if(seccion5.licencia_IIc){
				this.listaCategoriaLicenciaFormulario.push(
					{ id:6, text:'B IIc', categoria: 'L5'}
				);
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

		const dataGuardar = new Anexo009_B17_3Request();
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
			seccion1
		} = dataGuardar.metaData;

		//seccion 1
		seccion1.codigoProcedimiento = this.codigoProcedimientoTupa;
		seccion1.listaFlotaVehicular = this.listaFlotaVehicular;
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


}
