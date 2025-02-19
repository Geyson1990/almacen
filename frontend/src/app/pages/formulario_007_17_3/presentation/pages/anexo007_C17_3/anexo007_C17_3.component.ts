/**
 * Anexo 007-C/17.03
 * @author Alicia Toquila
 * @version 1.0 16.04.2023
 */

import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { AbstractControlOptions, UntypedFormBuilder, UntypedFormGroup, Validators, UntypedFormControl, FormArray, Form } from '@angular/forms';
import { NgbAccordionDirective , NgbActiveModal, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FuncionesMtcService } from '../../../../../core/services/funciones-mtc.service';
import { AnexoTramiteService } from '../../../../../core/services/tramite/anexo-tramite.service';
import { VisorPdfArchivosService } from '../../../../../core/services/tramite/visor-pdf-archivos.service';
import { VistaPdfComponent } from '../../../../../shared/components/vista-pdf/vista-pdf.component';
import { noWhitespaceValidator } from '../../../../../helpers/validator';
import { SeguridadService } from '../../../../../core/services/seguridad.service';
import { Anexo007_C17_3Response } from '../../../domain/anexo007_C17_3/anexo007_C17_3Response';
import { UbigeoComponent } from '../../../../../shared/components/forms/ubigeo/ubigeo.component';
import { Anexo007_C17_3Request, MetaData, Seccion2, ListaUbigeos, ListaCronograma} from '../../../domain/anexo007_C17_3/anexo007_C17_3Request';
import { ExtranjeriaService } from '../../../../../core/services/servicios/extranjeria.service';
import { ReniecService } from '../../../../../core/services/servicios/reniec.service';
import { SunatService } from '../../../../../core/services/servicios/sunat.service';
import { CONSTANTES } from '../../../../../enums/constants';
import { Anexo007_C17_3Service } from '../../../application/usecases';
import { TipoDocumentoModel } from '../../../../../core/models/TipoDocumentoModel';
import { FormularioTramiteService } from '../../../../../core/services/tramite/formulario-tramite.service';


@Component({
	// tslint:disable-next-line: component-selector
	selector: 'app-anexo007_C17_3',
	templateUrl: './anexo007_C17_3.component.html',
	styleUrls: ['./anexo007_C17_3.component.css']
})

// tslint:disable-next-line: class-name
export class Anexo007_C17_3_Component implements OnInit, AfterViewInit, AfterViewChecked {
	@Input() public dataInput: any;
	@ViewChild('acc') acc: NgbAccordionDirective ;

	@ViewChild('ubigeoCmpSeccion1') ubigeoSeccion1Component: UbigeoComponent;
	@ViewChild('ubigeoCmpSeccion2') ubigeoSeccion2Component: UbigeoComponent;


	txtTitulo = 'ANEXO 007-C/17.03 NOMINA DEL PERSONAL DEL CENTRO DE INSPECCION TECNICA VEHICULAR - CITV FIJO O MOVIL';

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

	listaUbigeos: ListaUbigeos[] = [];
	listaCronograma: ListaCronograma[] = [];

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
		private anexoService: Anexo007_C17_3Service,
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
				a_s1_departamento: [''],
				a_s1_provincia:  [''],
				a_s1_distrito:  [''],
			}),

			a_Seccion2: this.fb.group({
				a_s2_departamento: [''],
				a_s2_provincia:  [''],
				a_s2_distrito:  [''],
				a_s2_fechaInicial: [''],
				a_s2_fechaFinal:['']
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
	get a_s1_departamento(): UntypedFormControl { return this.a_Seccion1.get('a_s1_departamento') as UntypedFormControl }
	get a_s1_provincia(): UntypedFormControl { return this.a_Seccion1.get('a_s1_provincia') as UntypedFormControl }
	get a_s1_distrito(): UntypedFormControl { return this.a_Seccion1.get('a_s1_distrito') as UntypedFormControl }

	get a_Seccion2(): UntypedFormGroup { return this.anexoFG.get('a_Seccion2') as UntypedFormGroup; }
	get a_s2_departamento(): UntypedFormControl { return this.a_Seccion2.get('a_s2_departamento') as UntypedFormControl }
	get a_s2_provincia(): UntypedFormControl { return this.a_Seccion2.get('a_s2_provincia') as UntypedFormControl }
	get a_s2_distrito(): UntypedFormControl { return this.a_Seccion2.get('a_s2_distrito') as UntypedFormControl }
	get a_s2_fechaInicial(): UntypedFormControl { return this.a_Seccion2.get('a_s2_fechaInicial') as UntypedFormControl }
	get a_s2_fechaFinal(): UntypedFormControl { return this.a_Seccion2.get('a_s2_fechaFinal') as UntypedFormControl }

	async cargarDatos(): Promise<void> {
		this.funcionesMtcService.mostrarCargando();

		if (this.dataInput.movId > 0) {
			// RECUPERAMOS LOS DATOS
			try {
				const dataAnexo = await this.anexoTramiteService.get<Anexo007_C17_3Response>(this.dataInput.tramiteReqId).toPromise();
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
				this.listaUbigeos = seccion1.listaUbigeos;
				this.listaCronograma = seccion2.listaCronograma;
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
			modalRef.componentInstance.titleModal = 'Vista Previa - Anexo 007-C/17.03';
		}
		catch (e) {
			console.error(e);
			this.funcionesMtcService
				.ocultarCargando()
				.mensajeError('Problemas para descargar el archivo PDF');
		}
	}

	agregarUbigeo() {
		/*if (this.formularioCompleto() === false)
		  return this.funcionesMtcService.mensajeError('Debe agregar todos los campos faltantes');*/
		const departamento: string = this.a_s1_departamento.value.trim();
		const provincia: string = this.a_s1_provincia.value.trim();
		const distrito: string = this.a_s1_distrito.value.trim();

		const indexFind = this.listaUbigeos.findIndex(item => item.departamento.id === departamento && item.provincia.id === provincia && item.distrito.id === distrito);

		if (indexFind !== -1) {
			if (indexFind !== this.indexEditTabla)
				return this.funcionesMtcService.mensajeError('El departamento, provincia y distrito ya existen. No pueden ser agregados.');
		}

		if (this.indexEditTabla === -1) {

			this.listaUbigeos.push({
				departamento: {
					id: this.a_s1_departamento.value,
					descripcion: this.ubigeoSeccion1Component.getDepartamentoText()
				},
				provincia: {
					id: this.a_s1_provincia.value,
					descripcion: this.ubigeoSeccion1Component.getProvinciaText()
				},
				distrito: {
					id: this.a_s1_distrito.value,
					descripcion: this.ubigeoSeccion1Component.getDistritoText()
				}
			});
		} else {
			this.listaUbigeos[this.indexEditTabla].departamento = {
				id: this.a_s1_departamento.value,
				descripcion: this.ubigeoSeccion1Component.getDepartamentoText()
			};

			this.listaUbigeos[this.indexEditTabla].provincia = {
				id: this.a_s1_provincia.value,
				descripcion: this.ubigeoSeccion1Component.getProvinciaText()
			};

			this.listaUbigeos[this.indexEditTabla].distrito = {
				id: this.a_s1_distrito.value,
				descripcion: this.ubigeoSeccion1Component.getDistritoText()
			};
		}
		this.cancelarModificacion();
	}

	cancelarModificacion() {
		this.indexEditTabla = -1;
	}

	eliminarUbigeo(item: ListaUbigeos, index) {
		if (this.indexEditTabla === -1) {

			this.funcionesMtcService
				.mensajeConfirmar('¿Está seguro de eliminar el registro seleccionado?')
				.then(() => {
					this.listaUbigeos.splice(index, 1);
				});
		}
	}
	/******************************* */
	agregarCronograma() {
		/*if (this.formularioCompleto() === false)
		  return this.funcionesMtcService.mensajeError('Debe agregar todos los campos faltantes');*/
		const departamento: string = this.a_s2_departamento.value.trim();
		const provincia: string = this.a_s2_provincia.value.trim();
		const distrito: string = this.a_s2_distrito.value.trim();
		const fechaInicial: any = this.formatoFecha(this.a_s2_fechaInicial.value); 
		const fechaFinal: any = this.formatoFecha(this.a_s2_fechaFinal.value);

		const date_1:any = new Date(this.formatoYMDFecha(this.a_s2_fechaInicial.value));
		const date_2:any = new Date(this.formatoYMDFecha(this.a_s2_fechaFinal.value));

		const day_as_milliseconds = 86400000;
		let diff_in_millisenconds:any = date_2 - date_1;
		let diff_in_days = diff_in_millisenconds / day_as_milliseconds;
		diff_in_days = diff_in_days + 1;
		//console.log("Días: " + diff_in_days );

		const indexFind = this.listaCronograma.findIndex(item => item.departamento.id === departamento && item.provincia.id === provincia && item.distrito.id === distrito);

		if (indexFind !== -1) {
			if (indexFind !== this.indexEditTabla)
				return this.funcionesMtcService.mensajeError('El departamento, provincia y distrito ya existen. No pueden ser agregados.');
		}

		if (diff_in_days < 7) {
			return this.funcionesMtcService.mensajeError('El periodo mínimo debe ser 7 días calendarios consecutivos.');
		}

		if (this.indexEditTabla === -1) {
			this.listaCronograma.push({
				departamento: {
					id: this.a_s2_departamento.value,
					descripcion: this.ubigeoSeccion2Component.getDepartamentoText()
				},
				provincia: {
					id: this.a_s2_provincia.value,
					descripcion: this.ubigeoSeccion2Component.getProvinciaText()
				},
				distrito: {
					id: this.a_s2_distrito.value,
					descripcion: this.ubigeoSeccion2Component.getDistritoText()
				},
				desde: fechaInicial,
				hasta: fechaFinal
			});
		} 
		this.cancelarModificacionCronograma();
	}

	cancelarModificacionCronograma() {
		this.indexEditTabla = -1;
	}

	eliminarCronograma(item: ListaCronograma, index) {
		if (this.indexEditTabla === -1) {
			this.funcionesMtcService
				.mensajeConfirmar('¿Está seguro de eliminar el registro seleccionado?')
				.then(() => {
					this.listaCronograma.splice(index, 1);
				});
		}
	}
/*************************************** */
	async cargarDatosSolicitante(FormularioId: number): Promise<void> {
		this.funcionesMtcService.mostrarCargando();

		try {
			const dataForm: any = await this.formularioTramiteService.get(FormularioId).toPromise();
			this.funcionesMtcService.ocultarCargando();

			const metaDataForm: any = JSON.parse(dataForm.metaData);
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

		const dataGuardar = new Anexo007_C17_3Request();
		// -------------------------------------
		dataGuardar.id = this.idAnexo;
		dataGuardar.movimientoFormularioId = this.dataInput.tramiteReqRefId;
		dataGuardar.anexoId = 7;
		dataGuardar.codigo = 'C';
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
		seccion1.listaUbigeos = this.listaUbigeos;
	
		dataGuardar.metaData.seccion1 = seccion1;
		//seccion 2
		seccion2.listaCronograma = this.listaCronograma;

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

	formatoFecha(fecha: Date){
		var dia = (fecha.getDate()<10 ? '0' + (fecha.getDate()) : fecha.getDate());
		var mes = (fecha.getMonth() + 1) < 10 ? '0'+(fecha.getMonth() + 1) : (fecha.getMonth() + 1);
		var anio= fecha.getFullYear();

		return `${dia}/${mes}/${anio}`;
	}

	formatoYMDFecha(fecha: Date){
		var dia = (fecha.getDate()<10 ? '0' + (fecha.getDate()) : fecha.getDate());
		var mes = (fecha.getMonth() + 1) < 10 ? '0'+(fecha.getMonth() + 1) : (fecha.getMonth() + 1);
		var anio= fecha.getFullYear();

		return `${anio}-${mes}-${dia}`;
	}

}
