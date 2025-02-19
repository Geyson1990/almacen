import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, ValidationErrors, ValidatorFn, Validators, FormControl } from '@angular/forms';
import { NgbAccordionDirective , NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { A002_A17_2_Seccion1, A002_A17_2_Seccion2, A002_A17_2_Seccion3 } from 'src/app/core/models/Anexos/Anexo002_A17_2/Secciones';
import { Anexo002_A17_2Request } from 'src/app/core/models/Anexos/Anexo002_A17_2/Anexo002_A17_2Request';
import { PaisResponse } from 'src/app/core/models/Maestros/PaisResponse';
import { SelectionModel } from 'src/app/core/models/SelectionModel';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { PaisService } from 'src/app/core/services/maestros/pais.service';
import { VehiculoService } from 'src/app/core/services/servicios/vehiculo.service';
import { AnexoTramiteService } from 'src/app/core/services/tramite/anexo-tramite.service';
import { VisorPdfArchivosService } from 'src/app/core/services/tramite/visor-pdf-archivos.service';
import { ValidateFileSize_Formulario } from 'src/app/helpers/file';
import { VistaPdfComponent } from 'src/app/shared/components/vista-pdf/vista-pdf.component';
import { Anexo002A172Service } from 'src/app/core/services/anexos/anexo002-a17-2.service';
import { Anexo002B172Service } from 'src/app/core/services/anexos/anexo002-b17-2.service';
import { A002_B17_2_Seccion2, A002_B17_2_Seccion3, A002_B17_2_Seccion4, A002_B17_2_Seccion5 } from 'src/app/core/models/Anexos/Anexo002_B17_2/Secciones';
import { Anexo002_B17_2Request } from 'src/app/core/models/Anexos/Anexo002_B17_2/Anexo002_B17_2Request';
import { ReniecService } from '../../../../../core/services/servicios/reniec.service';
import { ExtranjeriaService } from '../../../../../core/services/servicios/extranjeria.service';
import { TipoDocumentoModel } from 'src/app/core/models/TipoDocumentoModel';
import { Tripulacion } from 'src/app/core/models/Anexos/Anexo003_B17_2/Tripulacion';
import { MetaData } from 'src/app/core/models/Anexos/Anexo002_B17_2/MetaData';
import { SeguridadService } from '../../../../../core/services/seguridad.service';
import { FormularioTramiteService } from '../../../../../core/services/tramite/formulario-tramite.service';

@Component({
	// tslint:disable-next-line: component-selector
	selector: 'app-anexo002_b17_2',
	templateUrl: './anexo002_b17_2.component.html',
	styleUrls: ['./anexo002_b17_2.component.css']
})

// tslint:disable-next-line: class-name
export class Anexo002_b17_2_Component implements OnInit, AfterViewInit {
	@Input() public dataInput: any;
	@ViewChild('acc') acc: NgbAccordionDirective ;

	graboUsuario = false;

	idAnexo = 0;
	uriArchivo = ''; // PARA SABER EL NOMBRE DEL PDF (COMPLETO CON TODO Y ADJUNTOS)
	errorAlCargarData = false; // VARIABLE PARA CONTROLAR CUANDO OCURRE UN ERROR AL RECUPERAR LOS DATOS GUARDADOS DEL ANEXO

	tipoDocumentoSolicitante: string;
	nombreTipoDocumentoSolicitante: string;
	numeroDocumentoSolicitante: string;
	nombresApellidosSolicitante: string;

	indexEditTabla = -1;
	indexEditTablaTripulacion = -1;
	indexEditTablaPasajeros = -1;

	disabledAcordion = 2;

	listaPlacaNumero: string[] = []
	listaPaises: PaisResponse[] = [];
	listaPasoFrontera: SelectionModel[] = [];

	anexoFG: UntypedFormGroup;
	visibleButtonCarf = false;
	visibleButtonVin = false;

	listaFlotaVehicular: A002_B17_2_Seccion3[] = [];
	listaTripulacion: A002_B17_2_Seccion4[] = [];
	listaPasajeros: A002_B17_2_Seccion5[] = [];

	filePdfCafSeleccionado: any = null;
	filePdfVinSeleccionado: any = null;
	filePdfCafPathName: string = null;
	filePdfVinPathName: string = null;

	cafVinculado = '';

	// CODIGO Y NOMBRE DEL PROCEDIMIENTO:
	codigoProcedimientoTupa: string;
	descProcedimientoTupa: string;
	codigoTipoSolicitudTupa: string;  //usado para las validaciones
	descTipoSolicitudTupa: string;

	paSeccion1: string[] = ['DSTT-016', 'DSTT-017', 'DSTT-008'];
	paSeccion2: string[] = ['DSTT-023'];
	paSeccion3: string[] = ['DSTT-016', 'DSTT-017', 'DSTT-018', 'DSTT-019', 'DSTT-020', 'DSTT-023', 'DSTT-024'];
	paSeccion4: string[] = ['DSTT-023'];
	paSeccion5: string[] = ['DSTT-023'];

	listaTiposDocumentos: TipoDocumentoModel[] = [
		{ id: '1', documento: 'DNI' },
		{ id: '2', documento: 'Carné de Extranjería' }
	];

	// este anexo solo lo usan los PA DSTT-009 y DSTT-015
	paTipoServicio = [
		{ pa: 'DSTT-016', tipoSolicitud: '0', tipoServicio: '9' },  // CITV TRANSPORTE DE MERCANCIAS EN GENERAL PUBLICO
		{ pa: 'DSTT-016', tipoSolicitud: '0', tipoServicio: '16' }, // CITV TRANSPORTE INTERNACIONAL DE MERCANCIAS POR CARRETERA DE 

		{ pa: 'DSTT-017', tipoSolicitud: '0', tipoServicio: '1' },  // CITV TRANSPORTE REGULAR DE PERSONAS
		{ pa: 'DSTT-017', tipoSolicitud: '0', tipoServicio: '2' },  // CITV TRANSPORTE PRIVADO DE PERSONAS
		{ pa: 'DSTT-017', tipoSolicitud: '0', tipoServicio: '3' },  // CITV TRANSPORTE ESPECIAL DE PERSONAS - TURISTICO
		{ pa: 'DSTT-017', tipoSolicitud: '0', tipoServicio: '4' },  // CITV TRANSPORTE ESPECIAL DE PERSONAS - TRABAJADORES
		{ pa: 'DSTT-017', tipoSolicitud: '0', tipoServicio: '6' },  // CITV TRANSPORTE ESPECIAL DE PERSONAS - SOCIAL
		{ pa: 'DSTT-017', tipoSolicitud: '0', tipoServicio: '22' },

		{ pa: 'DSTT-018', tipoSolicitud: '0', tipoServicio: '1' },  // CITV TRANSPORTE REGULAR DE PERSONAS
		{ pa: 'DSTT-018', tipoSolicitud: '0', tipoServicio: '2' },  // CITV TRANSPORTE PRIVADO DE PERSONAS
		{ pa: 'DSTT-018', tipoSolicitud: '0', tipoServicio: '3' },  // CITV TRANSPORTE ESPECIAL DE PERSONAS - TURISTICO
		{ pa: 'DSTT-018', tipoSolicitud: '0', tipoServicio: '4' },  // CITV TRANSPORTE ESPECIAL DE PERSONAS - TRABAJADORES
		{ pa: 'DSTT-018', tipoSolicitud: '0', tipoServicio: '6' },  // CITV TRANSPORTE ESPECIAL DE PERSONAS - SOCIAL
		{ pa: 'DSTT-018', tipoSolicitud: '0', tipoServicio: '22' },

		{ pa: 'DSTT-019', tipoSolicitud: '0', tipoServicio: '9' },  // CITV TRANSPORTE DE MERCANCIAS EN GENERAL PUBLICO
		{ pa: 'DSTT-019', tipoSolicitud: '0', tipoServicio: '10' }, // CITV TRANSPORTE DE MERCANCIAS PRIVADO
		{ pa: 'DSTT-019', tipoSolicitud: '0', tipoServicio: '16' }, // CITV TRANSPORTE INTERNACIONAL DE MERCANCIAS POR CARRETERA DE 

		{ pa: 'DSTT-020', tipoSolicitud: '0', tipoServicio: '9' },  // CITV TRANSPORTE DE MERCANCIAS EN GENERAL PUBLICO
		{ pa: 'DSTT-020', tipoSolicitud: '0', tipoServicio: '10' }, // CITV TRANSPORTE DE MERCANCIAS PRIVADO
		{ pa: 'DSTT-020', tipoSolicitud: '0', tipoServicio: '16' }, // CITV TRANSPORTE INTERNACIONAL DE MERCANCIAS POR CARRETERA DE 

		{ pa: 'DSTT-023', tipoSolicitud: '0', tipoServicio: '1' },  // CITV TRANSPORTE REGULAR DE PERSONAS
		{ pa: 'DSTT-023', tipoSolicitud: '0', tipoServicio: '2' },  // CITV TRANSPORTE PRIVADO DE PERSONAS
		{ pa: 'DSTT-023', tipoSolicitud: '0', tipoServicio: '3' },  // CITV TRANSPORTE ESPECIAL DE PERSONAS - TURISTICO
		{ pa: 'DSTT-023', tipoSolicitud: '0', tipoServicio: '4' },  // CITV TRANSPORTE ESPECIAL DE PERSONAS - TRABAJADORES
		{ pa: 'DSTT-023', tipoSolicitud: '0', tipoServicio: '6' },  // CITV TRANSPORTE ESPECIAL DE PERSONAS - SOCIAL
		{ pa: 'DSTT-023', tipoSolicitud: '0', tipoServicio: '22' },

		{ pa: 'DSTT-024', tipoSolicitud: '1', tipoServicio: '9' },  // CITV TRANSPORTE DE MERCANCIAS EN GENERAL PUBLICO
		{ pa: 'DSTT-024', tipoSolicitud: '1', tipoServicio: '10' }, // CITV TRANSPORTE DE MERCANCIAS PRIVADO
		{ pa: 'DSTT-024', tipoSolicitud: '1', tipoServicio: '16' }, // CITV TRANSPORTE INTERNACIONAL DE MERCANCIAS POR CARRETERA DE 
		{ pa: 'DSTT-024', tipoSolicitud: '2', tipoServicio: '1' },  // CITV TRANSPORTE REGULAR DE PERSONAS
		{ pa: 'DSTT-024', tipoSolicitud: '2', tipoServicio: '2' },  // CITV TRANSPORTE PRIVADO DE PERSONAS
		{ pa: 'DSTT-024', tipoSolicitud: '2', tipoServicio: '3' },  // CITV TRANSPORTE ESPECIAL DE PERSONAS - TURISTICO
		{ pa: 'DSTT-024', tipoSolicitud: '2', tipoServicio: '4' },  // CITV TRANSPORTE ESPECIAL DE PERSONAS - TRABAJADORES
		{ pa: 'DSTT-024', tipoSolicitud: '2', tipoServicio: '6' },  // CITV TRANSPORTE ESPECIAL DE PERSONAS - SOCIAL
		{ pa: 'DSTT-024', tipoSolicitud: '2', tipoServicio: '15' }, // CITV TRANSPORTE INTERNACIONAL DE PASAJEROS POR CARRETERA DE LA COMUNIDAD ANDINA
	];

	tipoServicio = '';
	tipoSolicitante: string;

	constructor(
		private formBuilder: UntypedFormBuilder,
		private funcionesMtcService: FuncionesMtcService,
		private modalService: NgbModal,
		private anexoService: Anexo002B172Service,
		private paisService: PaisService,
		private vehiculoService: VehiculoService,
		private anexoTramiteService: AnexoTramiteService,
		private reniecService: ReniecService,
		private extranjeriaService: ExtranjeriaService,
		private visorPdfArchivosService: VisorPdfArchivosService,
		public activeModal: NgbActiveModal,
		private seguridadService: SeguridadService,
		private formularioTramiteService: FormularioTramiteService
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

		this.uriArchivo = this.dataInput.rutaDocumento;

		this.listaPasoFrontera.push({ value: 1, text: 'Desaguadero' });
		this.listaPasoFrontera.push({ value: 2, text: 'Santa Rosa' });
		// if (this.dataInput.tipoSolicitud.codigo === 3) {//SOLO TRANSPORTE PERSONAL
		this.listaPasoFrontera.push({ value: 3, text: 'Kasani' });
		// }
		this.listaPasoFrontera.push({ value: 4, text: 'Iñapari' });

		this.anexoFG = this.formBuilder.group({
			a_Seccion1FG: this.formBuilder.group({
				a_s1_AmbitoOperacionFC: this.formBuilder.control(''),
				a_s1_PaisesOperarFA: this.formBuilder.array([], this.paisesOperarValidator()),
				a_s1_RutasFG: this.formBuilder.group({}),
			}),
			a_Seccion2FG: this.formBuilder.group({
				a_s2_PaisesOperarFA: this.formBuilder.array([], this.paisesOperarValidator()),
				a_s2_DestinoFC: this.formBuilder.control(''),
				a_s2_CiudadesOperarFC: this.formBuilder.control(''),
				a_s2_FrecuenciaFC: this.formBuilder.control(''),
				a_s2_NumeroFrecuenciaFC: this.formBuilder.control(''),
				a_s2_HorarioSalidaFC: this.formBuilder.control(''),
				a_s2_TiempoPromedioViajeFC: this.formBuilder.control(''),
			}),
			a_Seccion3FG: this.formBuilder.group({
				a_s3_PlacaRodajeFC: this.formBuilder.control(''),
				a_s3_SoatFC: this.formBuilder.control(''),
				a_s3_CitvFC: this.formBuilder.control(''),
				a_s3_NroVin: this.formBuilder.control(''),
				a_s3_CafFC: this.formBuilder.control(false),
				a_s3_VinculadoFC: this.formBuilder.control(false),
			}),
			a_Seccion4FG: this.formBuilder.group({
				a_s4_TipoDocumentoFC: this.formBuilder.control(''),
				a_s4_NumeroDocumentoFC: this.formBuilder.control(''),
				a_s4_ApellidosFC: this.formBuilder.control(''),
				a_s4_NombresFC: this.formBuilder.control(''),
				a_s4_LicenciaFC: this.formBuilder.control(''),
			}),
			a_Seccion5FG: this.formBuilder.group({
				a_s5_TipoDocumentoFC: this.formBuilder.control(''),
				a_s5_NumeroDocumentoFC: this.formBuilder.control(''),
				a_s5_ApellidosFC: this.formBuilder.control(''),
				a_s5_NombresFC: this.formBuilder.control(''),
			}),
		});

		//this.a_s3_CitvFC.disable();
	}

	async ngAfterViewInit(): Promise<void> {


		await this.datosSolicitante(this.dataInput.tramiteReqRefId);
		await this.cargarDatos();

		if (this.paSeccion1.indexOf(this.codigoProcedimientoTupa) > -1) {
			this.a_Seccion1FG.enable();
			this.acc.expand('seccion-1');
		} else {
			this.acc.collapse('seccion-1');
			this.a_Seccion1FG.disable();
		}

		if (this.paSeccion2.indexOf(this.codigoProcedimientoTupa) > -1) {
			this.a_Seccion2FG.enable();
			this.acc.expand('seccion-2');
		} else {
			this.acc.collapse('seccion-2');
			this.a_Seccion2FG.disable();
		}

		if (this.paSeccion3.indexOf(this.codigoProcedimientoTupa) > -1) {
			this.a_Seccion3FG.enable();
			this.acc.expand('seccion-3');
		} else {
			this.acc.collapse('seccion-3');
			this.a_Seccion3FG.disable();
		}

		if (this.paSeccion4.indexOf(this.codigoProcedimientoTupa) > -1) {
			this.a_Seccion4FG.enable();
			this.acc.expand('seccion-4');
		} else {
			this.acc.collapse('seccion-4');
			this.a_Seccion4FG.disable();
		}

		if (this.paSeccion5.indexOf(this.codigoProcedimientoTupa) > -1) {
			this.a_Seccion5FG.enable();
			this.acc.expand('seccion-5');
		} else {
			this.acc.collapse('seccion-5');
			this.a_Seccion5FG.disable();
		}

		this.a_s1_AmbitoOperacionFC.clearValidators();
		this.a_s1_AmbitoOperacionFC.updateValueAndValidity();
	}

	async datosSolicitante(FormularioId: number): Promise<void> {
		this.funcionesMtcService.mostrarCargando();
		try {
			const dataForm: any = await this.formularioTramiteService.get(FormularioId).toPromise();
			this.funcionesMtcService.ocultarCargando();

			const metaDataForm: any = JSON.parse(dataForm.metaData);
			//const seccion1 = metaDataForm.seccion1;
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
	}

	// GET FORM anexoFG
	get a_Seccion1FG(): UntypedFormGroup { return this.anexoFG.get('a_Seccion1FG') as UntypedFormGroup; }
	get a_s1_AmbitoOperacionFC(): AbstractControl { return this.a_Seccion1FG.get(['a_s1_AmbitoOperacionFC']); }
	get a_s1_PaisesOperarFA(): UntypedFormArray { return this.a_Seccion1FG.get(['a_s1_PaisesOperarFA']) as UntypedFormArray; }
	get a_s1_RutasFG(): UntypedFormGroup { return this.a_Seccion1FG.get(['a_s1_RutasFG']) as UntypedFormGroup; }
	get a_Seccion2FG(): UntypedFormGroup { return this.anexoFG.get('a_Seccion2FG') as UntypedFormGroup; }
	get a_s2_PaisesOperarFA(): UntypedFormArray { return this.a_Seccion2FG.get(['a_s2_PaisesOperarFA']) as UntypedFormArray; }
	get a_s2_DestinoFC(): AbstractControl { return this.a_Seccion2FG.get(['a_s2_DestinoFC']); }
	get a_s2_CiudadesOperarFC(): AbstractControl { return this.a_Seccion2FG.get(['a_s2_CiudadesOperarFC']); }
	get a_s2_FrecuenciaFC(): AbstractControl { return this.a_Seccion2FG.get(['a_s2_FrecuenciaFC']); }
	get a_s2_NumeroFrecuenciaFC(): AbstractControl { return this.a_Seccion2FG.get(['a_s2_NumeroFrecuenciaFC']); }
	get a_s2_HorarioSalidaFC(): AbstractControl { return this.a_Seccion2FG.get(['a_s2_HorarioSalidaFC']); }
	get a_s2_TiempoPromedioViajeFC(): AbstractControl { return this.a_Seccion2FG.get(['a_s2_TiempoPromedioViajeFC']); }
	get a_Seccion3FG(): UntypedFormGroup { return this.anexoFG.get('a_Seccion3FG') as UntypedFormGroup; }
	get a_s3_PlacaRodajeFC(): AbstractControl { return this.a_Seccion3FG.get(['a_s3_PlacaRodajeFC']); }
	get a_s3_SoatFC(): AbstractControl { return this.a_Seccion3FG.get(['a_s3_SoatFC']); }
	get a_s3_CitvFC(): AbstractControl { return this.a_Seccion3FG.get(['a_s3_CitvFC']); }
	get a_s3_NroVin(): AbstractControl { return this.a_Seccion3FG.get(['a_s3_NroVin']); }
	get a_s3_CafFC(): AbstractControl { return this.a_Seccion3FG.get(['a_s3_CafFC']); }
	get a_s3_VinculadoFC(): AbstractControl { return this.a_Seccion3FG.get(['a_s3_VinculadoFC']); }
	get a_Seccion4FG(): UntypedFormGroup { return this.anexoFG.get('a_Seccion4FG') as UntypedFormGroup; }
	get a_s4_TipoDocumentoFC(): AbstractControl { return this.a_Seccion4FG.get(['a_s4_TipoDocumentoFC']); }
	get a_s4_NumeroDocumentoFC(): AbstractControl { return this.a_Seccion4FG.get(['a_s4_NumeroDocumentoFC']); }
	get a_s4_ApellidosFC(): AbstractControl { return this.a_Seccion4FG.get(['a_s4_ApellidosFC']); }
	get a_s4_NombresFC(): AbstractControl { return this.a_Seccion4FG.get(['a_s4_NombresFC']); }
	get a_s4_LicenciaFC(): AbstractControl { return this.a_Seccion4FG.get(['a_s4_LicenciaFC']); }
	get a_Seccion5FG(): UntypedFormGroup { return this.anexoFG.get('a_Seccion5FG') as UntypedFormGroup; }
	get a_s5_TipoDocumentoFC(): AbstractControl { return this.a_Seccion5FG.get(['a_s5_TipoDocumentoFC']); }
	get a_s5_NumeroDocumentoFC(): AbstractControl { return this.a_Seccion5FG.get(['a_s5_NumeroDocumentoFC']); }
	get a_s5_ApellidosFC(): AbstractControl { return this.a_Seccion5FG.get(['a_s5_ApellidosFC']); }
	get a_s5_NombresFC(): AbstractControl { return this.a_Seccion5FG.get(['a_s5_NombresFC']); }
	getRutaFC(index: string): AbstractControl { return this.a_s1_RutasFG.get([index, 'ruta']); }
	getItinerarioFC(index: string): AbstractControl { return this.a_s1_RutasFG.get([index, 'itinerario']); }
	getFrecuenciaFC(index: string): AbstractControl { return this.a_s1_RutasFG.get([index, 'frecuencia']); }
	// FIN GET FORM anexoFG

	get seccion4Completo(): boolean {
		return this.a_s4_TipoDocumentoFC.value?.trim() !== '' &&
			this.a_s4_NumeroDocumentoFC.value?.trim() !== '' &&
			this.a_s4_ApellidosFC.value?.trim() !== '' &&
			this.a_s4_NombresFC.value?.trim() !== '';
	}
	get seccion5Completo(): boolean {
		return this.a_s5_TipoDocumentoFC.value?.trim() !== '' &&
			this.a_s5_NumeroDocumentoFC.value?.trim() !== '' &&
			this.a_s5_ApellidosFC.value?.trim() !== '' &&
			this.a_s5_NombresFC.value?.trim() !== '';
	}

	get maxLengthPlacaRodaje(): number {
		if (this.tipoSolicitante === 'PNR') {
			return 20;
		}
		else {
			return 6;
		}
	}

	changeNumeroFrecuencia(event: any): void {
		if (event.target.value) {
			this.a_s2_NumeroFrecuenciaFC.enable({ emitEvent: false });
			this.a_s2_NumeroFrecuenciaFC.reset('', { emitEvent: false });
		} else {
			this.a_s2_NumeroFrecuenciaFC.disable({ emitEvent: false });
		}
	}

	paisesOperarValidator(): ValidatorFn {
		return (formArray: UntypedFormArray): ValidationErrors | null => {
			let valid = true;
			formArray.value.forEach((item) => {
				if (item.checked === true) {
					//valid = item.checked;
					valid = true;
				}
			});
			return valid ? null : { errorChecked: 'Sin checked' };
			//return valid;
		};
	}

	formInvalid(control: AbstractControl): boolean {
		if (control) {
			return control.invalid && (control.dirty || control.touched);
		}
	}

	formInvalidForm(group: AbstractControl, control: string): boolean {
		return group.get(control).invalid &&
			(group.get(control).dirty || group.get(control).touched);
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

	// Seccion 4: Tripulacion
	agregarTripulacion(): void {


		if (this.a_Seccion4FG.invalid) {
			this.funcionesMtcService.mensajeError('Debe agregar todos los campos faltantes');
			return;
		}

		const tipoDocumento: string = this.a_s4_TipoDocumentoFC.value?.trim();
		const numeroDocumento: string = this.a_s4_NumeroDocumentoFC.value?.trim();
		const apellidos: string = this.a_s4_ApellidosFC.value?.trim();
		const nombres: string = this.a_s4_NombresFC.value?.trim();
		const licencia: string = this.a_s4_LicenciaFC.value?.trim() ?? '';

		const indexFind = this.listaTripulacion.findIndex(item =>
			item.tipoDocumento.id == tipoDocumento && item.numeroDocumento == numeroDocumento
		);

		if (indexFind !== -1) {
			if (indexFind !== this.indexEditTablaTripulacion) {
				this.funcionesMtcService.mensajeError('El tipo y número de documento ya existen. No pueden ser agregados.');
				return;
			}
		}

		if (this.indexEditTablaTripulacion === -1) {
			this.listaTripulacion.push({
				tipoDocumento: {
					id: tipoDocumento,
					documento: this.listaTiposDocumentos.filter(item => item.id == tipoDocumento)[0].documento
				},
				numeroDocumento,
				apellidos,
				nombres,
				licencia
			});
		} else {
			this.listaTripulacion[this.indexEditTablaTripulacion].tipoDocumento = {
				id: tipoDocumento,
				documento: this.listaTiposDocumentos.filter(item => item.id == tipoDocumento)[0].documento
			};

			this.listaTripulacion[this.indexEditTablaTripulacion].numeroDocumento = numeroDocumento;
			this.listaTripulacion[this.indexEditTablaTripulacion].apellidos = apellidos;
			this.listaTripulacion[this.indexEditTablaTripulacion].nombres = nombres;
			this.listaTripulacion[this.indexEditTablaTripulacion].licencia = licencia;
		}

		this.cancelarModificacionTripulacion();
	}

	modificarTripulacion(item: A002_B17_2_Seccion4, index): void {
		if (this.indexEditTablaTripulacion !== -1) {
			return;
		}

		this.indexEditTablaTripulacion = index;

		this.a_s4_TipoDocumentoFC.setValue(item.tipoDocumento.id);
		this.a_s4_NumeroDocumentoFC.setValue(item.numeroDocumento);
		this.a_s4_ApellidosFC.setValue(item.apellidos);
		this.a_s4_NombresFC.setValue(item.nombres);
		this.a_s4_LicenciaFC.setValue(item.licencia);
	}

	eliminarTripulacion(index): void {
		if (this.indexEditTablaTripulacion === -1) {

			this.funcionesMtcService
				.mensajeConfirmar('¿Está seguro de eliminar el registro seleccionado?')
				.then(() => {
					this.listaTripulacion.splice(index, 1);
				});
		}
	}

	cancelarModificacionTripulacion(): void {
		this.a_Seccion4FG.reset({
			a_s4_TipoDocumentoFC: ''
		});
		this.indexEditTablaTripulacion = -1;
	}

	async buscarNumeroDocumentoTripulacion(): Promise<void> {
		const tipoDocumento: string = this.a_s4_TipoDocumentoFC.value?.trim();
		const numeroDocumento: string = this.a_s4_NumeroDocumentoFC.value?.trim();

		if (tipoDocumento.length === 0 || numeroDocumento.length === 0) {
			this.funcionesMtcService.mensajeError('Debe ingresar Tipo de Documento y/o Número de Documento');
			return;
		}
		if (tipoDocumento === '1' && numeroDocumento.length !== 8) {
			this.funcionesMtcService.mensajeError('DNI debe tener 8 caracteres');
			return;
		}

		this.funcionesMtcService.mostrarCargando();

		if (tipoDocumento === '1') {// DNI
			try {
				const respuesta = await this.reniecService.getDni(numeroDocumento).toPromise();
				this.funcionesMtcService.ocultarCargando();

				if (respuesta.reniecConsultDniResponse.listaConsulta.coResultado !== '0000') {
					this.funcionesMtcService.mensajeError('Número de documento no registrado en Reniec');
					return;
				}

				const datosPersona = respuesta.reniecConsultDniResponse.listaConsulta.datosPersona;

				const nombres = datosPersona.prenombres;
				const apellidos = datosPersona.apPrimer + ' ' + datosPersona.apSegundo;

				const indexFind = this.listaTripulacion.findIndex(item =>
					item.tipoDocumento.id === tipoDocumento && item.numeroDocumento === numeroDocumento
				);

				if (indexFind !== -1) {
					if (indexFind !== this.indexEditTablaTripulacion) {
						this.funcionesMtcService.mensajeError('El tipo y número de documento ya existen. No pueden ser agregados');
						return;
					}
				}

				this.funcionesMtcService
					.mensajeConfirmar(`Los datos ingresados fueron validados por RENIEC y corresponden a la persona ${nombres + ' ' + apellidos}. ¿Está seguro de agregarlo?`)
					.then(() => {
						this.a_s4_ApellidosFC.setValue(apellidos);
						this.a_s4_NombresFC.setValue(nombres);
					});
			} catch (error) {
				console.error(error);
				this.funcionesMtcService
					.ocultarCargando()
					.mensajeError('Error al consultar al servicio');
			}
		} else if (tipoDocumento === '2') {// CARNÉ DE EXTRANJERÍA
			try {
				const respuesta = await this.extranjeriaService.getCE(numeroDocumento).toPromise();
				this.funcionesMtcService.ocultarCargando();

				if (respuesta.CarnetExtranjeria.numRespuesta !== '0000') {
					return this.funcionesMtcService.mensajeError('Número de documento no registrado en Migraciones');
				}

				const nombres = respuesta.CarnetExtranjeria.nombres;
				const apellidos = respuesta.CarnetExtranjeria.primerApellido + ' ' + respuesta.CarnetExtranjeria.segundoApellido;

				const indexFind = this.listaTripulacion.findIndex(item =>
					item.tipoDocumento.id == tipoDocumento && item.numeroDocumento == numeroDocumento
				);

				if (indexFind !== -1) {
					if (indexFind !== this.indexEditTablaTripulacion) {
						this.funcionesMtcService.mensajeError('El tipo y número de documento ya existen. No pueden ser agregados');
						return;
					}
				}

				this.funcionesMtcService
					.mensajeConfirmar(`Los datos ingresados fueron validados por MIGRACIONES y corresponden a la persona ${nombres + ' ' + apellidos}. ¿Está seguro de agregarlo?`)
					.then(() => {
						this.a_s4_ApellidosFC.setValue(apellidos);
						this.a_s4_NombresFC.setValue(nombres);
					});
			} catch (error) {
				console.error(error);
				this.funcionesMtcService
					.ocultarCargando()
					.mensajeError('En este momento el servicio de SUNARP no se encuentra disponible. Vuelva a intentarlo más tarde.');
			}
		}
	}

	getMaxLengthNumDocTripulacion(): number {
		const tipoDocumento: string = this.a_s4_TipoDocumentoFC.value?.trim() ?? '';

		if (tipoDocumento === '1') {// DNI
			return 8;
		}
		else if (tipoDocumento === '2') {// CE
			return 12;
		}
		return 0;
	}

	validarRegistroDeFormulario(index: number, item: Tripulacion): boolean {
		if (index === 0) {
			if (item.nombres.lastIndexOf(' *') !== -1) {
				return false;
			}
		}
		return true;
	}
	// FIN Seccion 4: Tripulacion

	// Seccion 5: Pasajeros
	agregarPasajeros(): void {
		if (this.a_Seccion5FG.invalid) {
			this.funcionesMtcService.mensajeError('Debe agregar todos los campos faltantes');
			return;
		}

		const tipoDocumento: string = this.a_s5_TipoDocumentoFC.value?.trim();
		const numeroDocumento: string = this.a_s5_NumeroDocumentoFC.value?.trim();
		const apellidos: string = this.a_s5_ApellidosFC.value?.trim();
		const nombres: string = this.a_s5_NombresFC.value?.trim();

		const indexFind = this.listaPasajeros.findIndex(item =>
			item.tipoDocumento.id == tipoDocumento && item.numeroDocumento == numeroDocumento
		);

		if (indexFind !== -1) {
			if (indexFind !== this.indexEditTablaPasajeros) {
				this.funcionesMtcService.mensajeError('El tipo y número de documento ya existen. No pueden ser agregados.');
				return;
			}
		}

		if (this.indexEditTablaPasajeros === -1) {
			this.listaPasajeros.push({
				tipoDocumento: {
					id: tipoDocumento,
					documento: this.listaTiposDocumentos.filter(item => item.id === tipoDocumento)[0].documento
				},
				numeroDocumento,
				apellidos,
				nombres
			});
		} else {
			this.listaPasajeros[this.indexEditTablaPasajeros].tipoDocumento = {
				id: tipoDocumento,
				documento: this.listaTiposDocumentos.filter(item => item.id === tipoDocumento)[0].documento
			};

			this.listaPasajeros[this.indexEditTablaPasajeros].numeroDocumento = numeroDocumento;
			this.listaPasajeros[this.indexEditTablaPasajeros].apellidos = apellidos;
			this.listaPasajeros[this.indexEditTablaPasajeros].nombres = nombres;
		}

		this.cancelarModificacionPasajeros();
	}

	modificarPasajeros(item: A002_B17_2_Seccion5, index): void {
		if (this.indexEditTablaPasajeros !== -1) {
			return;
		}

		this.indexEditTablaPasajeros = index;

		this.a_s5_TipoDocumentoFC.setValue(item.tipoDocumento.id);
		this.a_s5_NumeroDocumentoFC.setValue(item.numeroDocumento);
		this.a_s5_ApellidosFC.setValue(item.apellidos);
		this.a_s5_NombresFC.setValue(item.nombres);
	}

	eliminarPasajeros(index): void {
		if (this.indexEditTablaPasajeros === -1) {

			this.funcionesMtcService
				.mensajeConfirmar('¿Está seguro de eliminar el registro seleccionado?')
				.then(() => {
					this.listaPasajeros.splice(index, 1);
				});
		}
	}

	cancelarModificacionPasajeros(): void {
		this.a_Seccion5FG.reset({
			a_s5_TipoDocumentoFC: '',
		});
		this.indexEditTablaPasajeros = -1;
	}

	async buscarNumeroDocumentoPasajeros(): Promise<void> {
		const tipoDocumento: string = this.a_s5_TipoDocumentoFC.value?.trim();
		const numeroDocumento: string = this.a_s5_NumeroDocumentoFC.value?.trim();

		if (tipoDocumento.length === 0 || numeroDocumento.length === 0) {
			this.funcionesMtcService.mensajeError('Debe ingresar Tipo de Documento y/o Número de Documento');
			return;
		}
		if (tipoDocumento === '1' && numeroDocumento.length !== 8) {
			this.funcionesMtcService.mensajeError('DNI debe tener 8 caracteres');
			return;
		}

		this.funcionesMtcService.mostrarCargando();

		if (tipoDocumento === '1') {// DNI
			try {
				const respuesta = await this.reniecService.getDni(numeroDocumento).toPromise();
				this.funcionesMtcService.ocultarCargando();

				if (respuesta.reniecConsultDniResponse.listaConsulta.coResultado !== '0000') {
					this.funcionesMtcService.mensajeError('Número de documento no registrado en Reniec');
					return;
				}

				const datosPersona = respuesta.reniecConsultDniResponse.listaConsulta.datosPersona;

				const nombres = datosPersona.prenombres;
				const apellidos = datosPersona.apPrimer + ' ' + datosPersona.apSegundo;

				const indexFind = this.listaPasajeros.findIndex(item =>
					item.tipoDocumento.id === tipoDocumento && item.numeroDocumento === numeroDocumento
				);

				if (indexFind !== -1) {
					if (indexFind !== this.indexEditTablaPasajeros) {
						this.funcionesMtcService.mensajeError('El tipo y número de documento ya existen. No pueden ser agregados');
						return;
					}
				}

				this.funcionesMtcService
					.mensajeConfirmar(`Los datos ingresados fueron validados por RENIEC y corresponden a la persona ${nombres + ' ' + apellidos}. ¿Está seguro de agregarlo?`)
					.then(() => {
						this.a_s5_ApellidosFC.setValue(apellidos);
						this.a_s5_NombresFC.setValue(nombres);
					});
			} catch (error) {
				console.error(error);
				this.funcionesMtcService
					.ocultarCargando()
					.mensajeError('Error al consultar al servicio');
			}
		} else if (tipoDocumento === '2') {// CARNÉ DE EXTRANJERÍA
			try {
				const respuesta = await this.extranjeriaService.getCE(numeroDocumento).toPromise();
				this.funcionesMtcService.ocultarCargando();

				if (respuesta.CarnetExtranjeria.numRespuesta !== '0000') {
					return this.funcionesMtcService.mensajeError('Número de documento no registrado en Migraciones');
				}

				const nombres = respuesta.CarnetExtranjeria.nombres;
				const apellidos = respuesta.CarnetExtranjeria.primerApellido + ' ' + respuesta.CarnetExtranjeria.segundoApellido;

				const indexFind = this.listaPasajeros.findIndex(item =>
					item.tipoDocumento.id === tipoDocumento && item.numeroDocumento === numeroDocumento
				);

				if (indexFind !== -1) {
					if (indexFind !== this.indexEditTablaPasajeros) {
						this.funcionesMtcService.mensajeError('El tipo y número de documento ya existen. No pueden ser agregados');
						return;
					}
				}

				this.funcionesMtcService
					.mensajeConfirmar(`Los datos ingresados fueron validados por MIGRACIONES y corresponden a la persona ${nombres + ' ' + apellidos}. ¿Está seguro de agregarlo?`)
					.then(() => {
						this.a_s5_ApellidosFC.setValue(apellidos);
						this.a_s5_NombresFC.setValue(nombres);
					});
			} catch (error) {
				console.error(error);
				this.funcionesMtcService
					.ocultarCargando()
					.mensajeError('Error al consultar al servicio');
			}
		}
	}

	getMaxLengthNumDocPasajeros(): number {
		const tipoDocumento: string = this.a_s5_TipoDocumentoFC.value?.trim() ?? '';

		if (tipoDocumento === '1') {// DNI
			return 8;
		}
		else if (tipoDocumento === '2') {// CE
			return 12;
		}
		return 0;
	}
	// FIN Seccion 5: Pasajeros

	// Seccion 3: Flota Vehicular
	changePlacaRodaje(): void {
		this.a_s3_SoatFC.reset('');
		this.a_s3_CitvFC.reset('');
		this.a_s3_NroVin.reset();
		this.listaPlacaNumero = [];
		/*this.a_s3_AnioFabFC.reset('');
		this.a_s3_ChasisFC.reset('');
		this.a_s3_MarcaFC.reset('');
		this.a_s3_ModeloFC.reset('');*/
	}

	async buscarPlacaRodaje(): Promise<void> {
		const placaRodaje = this.a_s3_PlacaRodajeFC.value?.trim();
		if (placaRodaje.length !== 6) {
			return;
		}

		this.changePlacaRodaje();

		this.funcionesMtcService.mostrarCargando();

		try {
			const respuesta = await this.vehiculoService.getPlacaRodaje(placaRodaje).toPromise();
			this.funcionesMtcService.ocultarCargando();

			if (respuesta.categoria === '' || respuesta.categoria === '-') {
				this.funcionesMtcService.mensajeError('La placa de rodaje no tiene categoría definida.');
				return;
			} else {
				if (respuesta.categoria.charAt(0) === 'O') {
					this.a_s3_SoatFC.setValue(respuesta.soat.numero || '-');
				}
				if (respuesta.categoria.charAt(0) === 'N' || respuesta.categoria.charAt(0) === 'M') {
					if (respuesta.soat.estado === '') {
						this.funcionesMtcService.mensajeError('La placa de rodaje ingresada no cuenta con SOAT');
						return;
					}
					else if (respuesta.soat.estado !== 'VIGENTE') {
						this.funcionesMtcService.mensajeError('El número de SOAT del vehículo no se encuentra VIGENTE');
						return;
					}

					this.a_s3_SoatFC.setValue(respuesta.soat.numero);
				}
			}

			let band = false;
			//let placaNumero = '';
			let placasNumero: string[] = [];
			if (respuesta.citvs.length > 0) {
				for (const placa of respuesta.citvs) {
					if (this.paTipoServicio.find(i =>
						i.pa === this.codigoProcedimientoTupa &&
						i.tipoSolicitud == this.codigoTipoSolicitudTupa &&
						i.tipoServicio == placa.tipoId) !== undefined
					) {
						//this.listaPlacaNumero = placasNumero.length > 0 ? placasNumero : ['-']
						//placaNumero = placa.numero;
						placasNumero.push(placa.numero)
						band = true;
					}
				}
				if (!band) {
					this.funcionesMtcService.mensajeError('El número de CITV no es para el servicio ofertado');
					return;
				}
				else {
					//this.a_s3_CitvFC.setValue(placaNumero || '(FALTANTE)');
					this.listaPlacaNumero = placasNumero.length > 0 ? placasNumero : ['-']
					this.a_s3_CitvFC.setValue(this.listaPlacaNumero[0]);
				}
			} else {
				if (respuesta.nuevo) {
					this.listaPlacaNumero = ['-']
					this.a_s3_CitvFC.setValue(this.listaPlacaNumero[0]);
				} else {
					this.funcionesMtcService.mensajeError('La placa no cuenta con CITV');
					return;
				}
			}

			if (this.listaPlacaNumero.length > 1)
				this.a_s3_CitvFC.enable()
			else
				this.a_s3_CitvFC.disable()

			const fechaActual = new Date();
			const anioModelo = parseInt(respuesta.anioModelo, 10) || 0;
			const anioFabricacion = parseInt(respuesta.anioFabricacion, 10) || 0;
			const anioVerifico = anioModelo >= anioFabricacion ? anioModelo : anioFabricacion;

			if (fechaActual.getFullYear() - anioVerifico > 12) {
				this.funcionesMtcService.mensajeError('El vehículo cuenta con más de 12 años de antigüedad desde su fabricación');
				return;
			}

			/*this.a_s3_AnioFabFC.setValue(anioVerifico || '(FALTANTE)');
			this.a_s3_ChasisFC.setValue(respuesta.chasis || '(FALTANTE)');
			this.a_s3_MarcaFC.setValue(respuesta.marca || '(FALTANTE)');
			this.a_s3_ModeloFC.setValue(respuesta.modelo || '(FALTANTE)');*/
		} catch (error) {
			console.error(error);
			this.funcionesMtcService
				.ocultarCargando()
				.mensajeError('Error al consultar al servicio');
		}
	}

	onChangeCaf(event: boolean): void {
		this.visibleButtonCarf = event;

		if (event === true) {
			this.a_s3_VinculadoFC.setValue(false);

			this.funcionesMtcService
				.mensajeConfirmar('¿Declaro que la información adjunta en el archivo es verídica?', 'DECLARACIÓN')
				.catch(() => {
					this.visibleButtonCarf = false;
					this.a_s3_CafFC.setValue(false);
					this.cafVinculado = '';
					this.filePdfCafSeleccionado = null;
				});

			this.cafVinculado = 'C.A.F';
		} else {
			this.cafVinculado = '';
			this.filePdfCafSeleccionado = null;
			this.filePdfCafPathName = null;
		}

	}

	onChangeVinciulado(event: boolean): void {
		this.visibleButtonCarf = event;

		if (event === true) {
			this.a_s3_CafFC.setValue(false);

			this.funcionesMtcService
				.mensajeConfirmar('¿Declaro que la información adjunta en el archivo es verídica?', 'DECLARACIÓN')
				.catch(() => {
					this.visibleButtonCarf = false;
					this.a_s3_VinculadoFC.setValue(false);
					this.cafVinculado = '';
					this.filePdfCafSeleccionado = null;
				});

			this.cafVinculado = 'Vinculado';
		} else {
			this.cafVinculado = '';
			this.filePdfCafSeleccionado = null;
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

	async vistaPreviaCaf(): Promise<void> {
		if (this.filePdfCafPathName) {
			this.funcionesMtcService.mostrarCargando();
			try {
				const file: Blob = await this.visorPdfArchivosService.get(this.filePdfCafPathName).toPromise();
				this.funcionesMtcService.ocultarCargando();

				this.filePdfCafSeleccionado = (file as File);
				this.filePdfCafPathName = null;

				this.visualizarGrillaPdf(this.filePdfCafSeleccionado, this.a_s3_PlacaRodajeFC.value);
			} catch (error) {
				console.error(error);
				this.funcionesMtcService
					.ocultarCargando()
					.mensajeError('Problemas para descargar Pdf');
			}
		} else {
			this.visualizarGrillaPdf(this.filePdfCafSeleccionado, this.a_s3_PlacaRodajeFC.value);
		}
	}

	agregarFlotaVehicular(): void {
		this.findInvalidControls();
		if (this.tipoSolicitante !== 'PNR') {
			if (
				this.a_s3_PlacaRodajeFC.value?.trim() === '' ||
				this.a_s3_SoatFC.value?.trim() === '' ||
				this.a_s3_CitvFC.value?.trim() === '' /*||
        this.a_s3_AnioFabFC.value?.toString()?.trim() === '' ||
        this.a_s3_ChasisFC.value?.trim() === '' ||
        this.a_s3_MarcaFC.value?.trim() === '' ||
        this.a_s3_ModeloFC.value?.trim() === ''*/
			) {
				this.funcionesMtcService.mensajeError('Debe ingresar los campos faltantes');
				return;
			}
		} else {
			if (this.a_s3_PlacaRodajeFC.value.trim() === '') {
				this.funcionesMtcService.mensajeError('Debe ingresar la placa de rodaje');
				return;
			}
		}

		if (this.a_s3_CafFC.value === true || this.a_s3_VinculadoFC.value === true) {
			if (this.filePdfCafSeleccionado === null) {
				this.funcionesMtcService.mensajeError('Debe cargar un archivo PDF');
				return;
			}
		}

		const placaRodaje = this.a_s3_PlacaRodajeFC.value?.trim().toUpperCase();
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
				soat: this.a_s3_SoatFC.value,
				citv: this.a_s3_CitvFC.value,
				caf: this.a_s3_CafFC.value,
				vinculado: this.a_s3_VinculadoFC.value,
				file: this.filePdfCafSeleccionado,
				fileVin: this.filePdfVinSeleccionado,
				nroVinculado: this.a_s3_NroVin.value,
				vin: this.a_s3_VinculadoFC.value
			});
		} else {
			this.listaFlotaVehicular[this.indexEditTabla].placaRodaje = placaRodaje;
			this.listaFlotaVehicular[this.indexEditTabla].soat = this.a_s3_SoatFC.value;
			this.listaFlotaVehicular[this.indexEditTabla].citv = this.a_s3_CitvFC.value;
			this.listaFlotaVehicular[this.indexEditTabla].caf = this.a_s3_CafFC.value;
			this.listaFlotaVehicular[this.indexEditTabla].vinculado = this.a_s3_VinculadoFC.value;
			/*this.listaFlotaVehicular[this.indexEditTabla].anioFabricacion = this.a_s3_AnioFabFC.value;
			this.listaFlotaVehicular[this.indexEditTabla].chasis = this.a_s3_ChasisFC.value;
			this.listaFlotaVehicular[this.indexEditTabla].marca = this.a_s3_MarcaFC.value;
			this.listaFlotaVehicular[this.indexEditTabla].modelo = this.a_s3_ModeloFC.value;*/
			this.listaFlotaVehicular[this.indexEditTabla].file = this.filePdfCafSeleccionado;
		}

		this.cancelarFlotaVehicular();
	}

	cancelarFlotaVehicular(): void {
		this.indexEditTabla = -1;

		this.a_s3_PlacaRodajeFC.setValue('');
		this.a_s3_SoatFC.setValue('');
		this.a_s3_CitvFC.setValue('');
		this.a_s3_CafFC.setValue(false);
		this.a_s3_VinculadoFC.setValue(false);
		this.a_s3_NroVin.setValue('');
		/*this.a_s3_AnioFabFC.setValue('');
		this.a_s3_ChasisFC.setValue('');
		this.a_s3_MarcaFC.setValue('');
		this.a_s3_ModeloFC.setValue('');
  */
		this.filePdfCafSeleccionado = null;
		this.filePdfCafPathName = null;
		this.cafVinculado = '';
		this.visibleButtonCarf = false;
	}

	async verPdfCafGrilla(item: A002_B17_2_Seccion3): Promise<void> {
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
			} catch (error) {
				console.error(error);
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

	modificarFlotaVehicular(item: A002_B17_2_Seccion3, index: number): void {
		if (this.indexEditTabla !== -1) {
			return;
		}

		this.indexEditTabla = index;

		this.a_s3_PlacaRodajeFC.setValue(item.placaRodaje);
		this.a_s3_SoatFC.setValue(item.soat);
		this.a_s3_CitvFC.setValue(item.citv);
		this.a_s3_CafFC.setValue(item.caf);

		this.visibleButtonCarf = item.caf === true || item.vinculado === true ? true : false;

		this.a_s3_VinculadoFC.setValue(item.vinculado);
		this.a_s3_NroVin.setValue(item.nroVinculado);
		/*this.a_s3_AnioFabFC.setValue(item.anioFabricacion);
		this.a_s3_ChasisFC.setValue(item.chasis);
		this.a_s3_MarcaFC.setValue(item.marca);
		this.a_s3_ModeloFC.setValue(item.modelo);*/

		this.filePdfCafSeleccionado = item.file;
		this.filePdfCafPathName = item.pathName;
	}

	eliminarFlotaVehicular(item: A002_B17_2_Seccion3, index: number): void {
		if (this.indexEditTabla === -1) {
			this.funcionesMtcService
				.mensajeConfirmar('¿Está seguro de eliminar el registro seleccionado?')
				.then(() => {
					this.listaFlotaVehicular.splice(index, 1);
				});
		}
	}
	// Fin Seccion 3: Flota Vehicular

	// Seccion 1
	validarCheckPais(item: any): boolean {
		const pais = item.key;
		for (const control of this.a_s1_PaisesOperarFA.controls) {
			if (control.get('text').value === pais && control.get('checked').value === true) {
				return true;
			}
		}

		item.value.get('ruta').setValue('');
		item.value.get('itinerario').setValue('');
		item.value.get('frecuencia').setValue('');
		return false;
	}
	// Fin Seccion 1

	inputNumeroDocumentoS4(event: any): void {
		if (event) {
			event.target.value = event.target.value.replace(/[^0-9]/g, '');
		}

		this.a_s4_ApellidosFC.reset('');
		this.a_s4_NombresFC.reset('');
		this.a_s4_LicenciaFC.reset('');
	}

	inputNumeroDocumentoS5(event: any): void {
		if (event) {
			event.target.value = event.target.value.replace(/[^0-9]/g, '');
		}

		this.a_s5_ApellidosFC.reset('');
		this.a_s5_NombresFC.reset('');
	}

	async cargarDatos(): Promise<void> {
		this.funcionesMtcService.mostrarCargando();

		try {
			const data = await this.paisService.get<Array<PaisResponse>>('BOL,COL,ECU,PER').toPromise();
			this.funcionesMtcService.ocultarCargando();

			this.listaPaises = data;

			this.listaPaises.map((item, index) => {
				item.text = item.text.capitalize();

				const disablePaisesOperarS1FA = this.a_Seccion1FG.disabled;
				const disablePaisesOperarS2FA = this.a_Seccion2FG.disabled;

				this.a_s1_PaisesOperarFA.push(this.addPaisFormGroup(item, disablePaisesOperarS1FA));
				this.a_s2_PaisesOperarFA.push(this.addPaisFormGroup(item, disablePaisesOperarS2FA));

				this.a_s1_RutasFG.addControl(item.text,
					this.formBuilder.group({
						ruta: this.formBuilder.control(''), // [Validators.required]),
						itinerario: this.formBuilder.control(''), // [Validators.required]),
						frecuencia: this.formBuilder.control(''), // [Validators.required, Validators.pattern(/^[1-9]{1}[0-9]{0,1}?$/)]),
					}));
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
					this.a_s1_AmbitoOperacionFC.setValue(metaData.seccion1.ambitoOperacion || '');
					metaData.seccion1.paisesJson = {};
					// recorremos los paises:
					for (const paisOperar of metaData.seccion1.paisesOperar) {
						metaData.seccion1.paisesJson[paisOperar.value] = paisOperar;
					}

					let i = 0;
					for (const control of this.a_s1_PaisesOperarFA.controls) {
						const paisChecked = metaData.seccion1.paisesJson[control.get('value').value]?.checked ?? false;

						control.get('checked').setValue(paisChecked);

						if (paisChecked) {
							const rutaFG = this.a_s1_RutasFG.get(control.get('text').value);
							rutaFG.get('ruta').setValue(metaData.seccion1.rutas[i].ruta);
							rutaFG.get('itinerario').setValue(metaData.seccion1.rutas[i].itinerario);
							rutaFG.get('frecuencia').setValue(metaData.seccion1.rutas[i].frecuencia);
							i++;
						} else {
							i++;
						}
					}
				}

				if (this.a_Seccion2FG.enabled) {
					metaData.seccion2.paisesJson = {};

					for (const paisOperar of metaData.seccion2.paisesOperar) {
						metaData.seccion2.paisesJson[paisOperar.value] = paisOperar;
					}

					for (const control of this.a_s2_PaisesOperarFA.controls) {
						control.get('checked').setValue(metaData.seccion2.paisesJson[control.get('value').value].checked ?? false);
					}

					this.a_s2_DestinoFC.setValue(metaData.seccion2.destino.Value);
					this.a_s2_CiudadesOperarFC.setValue(metaData.seccion2.ciudadesOperar);
					this.a_s2_FrecuenciaFC.setValue(metaData.seccion2.numeroFrecuencias.split('-')[0].trim(), { emitEvent: false });
					this.a_s2_NumeroFrecuenciaFC.setValue(metaData.seccion2.numeroFrecuencias.split('-')[1].trim());
					this.a_s2_HorarioSalidaFC.setValue(metaData.seccion2.horariosSalida);
					this.a_s2_TiempoPromedioViajeFC.setValue(metaData.seccion2.tiempoPromedioViaje);
				}
				/*anioFabricacion: itemS3.anioFabricacion,
				  chasis: itemS3.chasis,
				  marca: itemS3.marca,
				  modelo: itemS3.modelo,*/

				if (this.a_Seccion3FG.enabled) {
					for (const itemS3 of metaData.seccion3) {
						this.listaFlotaVehicular.push({
							placaRodaje: itemS3.placaRodaje,
							soat: itemS3.soat,
							citv: itemS3.citv,
							caf: itemS3.caf,
							vinculado: itemS3.vinculado,
							file: null,
							pathName: itemS3.pathName,
							fileVin: null,
							pathNameVin: itemS3.pathNameVin,
							nroVinculado: itemS3.nroVinculado,
							vin: itemS3.vin
						});
					}
				}

				if (this.a_Seccion4FG.enabled) {
					if(metaData.seccion4!=null){
						for (const itemS4 of metaData.seccion4) {
							this.listaTripulacion.push({
								tipoDocumento: {
									id: itemS4.tipoDocumento.id,
									documento: itemS4.tipoDocumento.documento
								},
								numeroDocumento: itemS4.numeroDocumento,
								apellidos: itemS4.apellidos,
								nombres: itemS4.nombres,
								licencia: itemS4.licencia
							});
						}
					}
				}

				if (this.a_Seccion5FG.enabled) {
					if(metaData.seccion4!=null){
						for (const itemS5 of metaData.seccion5) {
							this.listaPasajeros.push({
								tipoDocumento: {
									id: itemS5.tipoDocumento.id,
									documento: itemS5.tipoDocumento.documento
								},
								numeroDocumento: itemS5.numeroDocumento,
								apellidos: itemS5.apellidos,
								nombres: itemS5.nombres
							});
						}
					}
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
	}

	soloNumeros(event): void {
		event.target.value = event.target.value.replace(/[^0-9]/g, '');
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
			modalRef.componentInstance.titleModal = 'Vista Previa - Anexo 002-B/17.02';
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

		if (this.a_Seccion1FG.enabled) {
			console.log("Seccion 1 enabled: " + this.a_Seccion1FG.enabled);
			let paisesSeleccionados: boolean = false;

			if (this.codigoProcedimientoTupa != "DSTT-016") {
				if (this.a_s1_AmbitoOperacionFC.value == "") {
					this.funcionesMtcService.mensajeError('Debe ingresar todos los campos obligatorios');
					return;
				}
			}
			for (const control of this.a_s1_PaisesOperarFA.controls) {
				if (control.get('checked').value === true) {
					paisesSeleccionados = true;
				}
			}

			if (!paisesSeleccionados) {
				this.funcionesMtcService.mensajeError('Debe seleccionar los paises con los que desea operar.');
				return;
			}
		}

		if (this.listaFlotaVehicular.length === 0) {
			this.funcionesMtcService.mensajeError('Debe ingresar al menos una flota vehicular');
			return;
		}


		const dataGuardar = new Anexo002_B17_2Request();
		// -------------------------------------
		dataGuardar.id = this.idAnexo;
		dataGuardar.movimientoFormularioId = this.dataInput.tramiteReqRefId;
		dataGuardar.anexoId = 1;
		dataGuardar.codigo = 'B';
		dataGuardar.tramiteReqId = this.dataInput.tramiteReqId;
		// -------------------------------------
		// SECCION 1:
		//if (this.a_Seccion1FG.enabled) {

		dataGuardar.metaData.seccion1.ambitoOperacion = this.a_s1_AmbitoOperacionFC.value?.trim()?.toUpperCase();

		for (const control of this.a_s1_PaisesOperarFA.controls) {
			const text = control.get('text').value;
			const value = control.get('value').value;
			const checked = control.get('checked').value;

			if (this.codigoProcedimientoTupa != "DSTT-016") {
				if (checked) {
					const rutaFG = this.a_s1_RutasFG.get(text);
					const ruta = rutaFG.get('ruta').value?.trim();
					const itinerario = rutaFG.get('itinerario').value?.trim();
					const frecuencia = rutaFG.get('frecuencia').value?.trim();


					if (ruta.length > 0 && itinerario.length > 0 && frecuencia.length > 0) {
						dataGuardar.metaData.seccion1.rutas.push({
							ruta,
							itinerario,
							frecuencia
						});
					} else {
						this.funcionesMtcService.mensajeError('Debe ingresar información en Ruta y/o Itinerario y/o Frecuencia para el país ' + text);
						return;
					}
				} else {
					console.log(text)
					const rutaFG = this.a_s1_RutasFG.get(text);
					const ruta = '';
					const itinerario = '';
					const frecuencia = '';

					dataGuardar.metaData.seccion1.rutas.push({
						ruta,
						itinerario,
						frecuencia
					});
				}
			} else {

				const rutaFG = this.a_s1_RutasFG.get(text);
				const ruta = '';
				const itinerario = '';
				const frecuencia = '';

				dataGuardar.metaData.seccion1.rutas.push({
					ruta,
					itinerario,
					frecuencia
				});
			}
			dataGuardar.metaData.seccion1.paisesOperar.push({ value, text, _checked: checked } as PaisResponse);
		}

		//}
		/*else {
		 dataGuardar.metaData.seccion1.ambitoOperacion = '';
		 dataGuardar.metaData.seccion1.paisesOperar = [];
		 dataGuardar.metaData.seccion1.rutas = [];
	  }*/
		console.log(dataGuardar.metaData.seccion1);
		// -------------------------------------
		const seccion2 = new A002_B17_2_Seccion2();
		seccion2.paisesOperar = this.a_s2_PaisesOperarFA.value.map(item => {
			return { value: item.value, text: item.text, _checked: item.checked } as PaisResponse;
		});
		seccion2.origen = 'PERÚ';
		seccion2.destino =
			{
				value: "",//this.a_s2_DestinoFC.value,
				text: "",//this.listaPaises.filter(item => item.value === this.a_s2_DestinoFC.value)[0].text
			} as PaisResponse;

		seccion2.ciudadesOperar = this.a_s2_CiudadesOperarFC.value?.trim();
		seccion2.numeroFrecuencias = `${this.a_s2_FrecuenciaFC.value} - ${this.a_s2_NumeroFrecuenciaFC.value}`;
		seccion2.horariosSalida = this.a_s2_HorarioSalidaFC.value?.trim();
		seccion2.tiempoPromedioViaje = 0;//parseInt(this.a_s2_TiempoPromedioViajeFC.value, 10);
		dataGuardar.metaData.seccion2 = seccion2;
		// -------------------------------------
		dataGuardar.metaData.seccion3 = this.listaFlotaVehicular;
		// -------------------------------------
		dataGuardar.metaData.seccion4 = this.listaTripulacion;
		// -------------------------------------
		dataGuardar.metaData.seccion5 = this.listaPasajeros;
		// -------------------------------------
		dataGuardar.metaData.nombreTipoDocumentoSolicitante = this.nombreTipoDocumentoSolicitante;
		dataGuardar.metaData.numeroDocumentoSolicitante = this.numeroDocumentoSolicitante;
		dataGuardar.metaData.nombresApellidosSolicitante = this.nombresApellidosSolicitante;

		const dataGuardarFormData = this.funcionesMtcService.jsonToFormData(dataGuardar);
		console.log(dataGuardar);
		this.funcionesMtcService.mensajeConfirmar(`¿Está seguro de ${this.idAnexo === 0 ? 'guardar' : 'modificar'} los datos ingresados?`)
			.then(async () => {
				this.funcionesMtcService.mostrarCargando();

				if (this.idAnexo === 0) {
					// GUARDAR:
					try {
						const data = await this.anexoService.post<any>(dataGuardarFormData).toPromise();
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
						const data = await this.anexoService.put<any>(dataGuardarFormData).toPromise();
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

	public findInvalidControls() {
		const invalid = [];
		const controls = this.anexoFG.controls;
		for (const name in controls) {
			if (controls[name].invalid) {
				invalid.push(name);
			}
		}

		const c = this.a_Seccion1FG.controls;
		for (const name in c) {
			if (c[name].invalid) {
				invalid.push(name);
			}
		}


		const d = this.a_Seccion2FG.controls;
		for (const name in d) {
			if (d[name].invalid) {
				invalid.push(name);
			}
		}


		const e = this.a_Seccion3FG.controls;
		for (const name in e) {
			if (e[name].invalid) {
				invalid.push(name);
			}
		}

		const f = this.a_Seccion4FG.controls;
		for (const name in f) {
			if (f[name].invalid) {
				invalid.push(name);
			}
		}



		const g = this.a_Seccion5FG.controls;
		for (const name in g) {
			if (g[name].invalid) {
				invalid.push(name);
			}
		}
		console.log(invalid);
	}


}
