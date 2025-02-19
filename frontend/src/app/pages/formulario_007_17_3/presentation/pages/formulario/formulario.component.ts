/**
 * Formulario 004/17.03 utilizado por los procedimientos DCV-011, DCV-012, DCV-013 y DCV-014
 * @author Alicia Toquila Quispe
 * @version 1.0 29.03.2023
*/
import { Component, OnInit, Input, ViewChild, AfterViewInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, AbstractControl, FormArray } from '@angular/forms';
import { NgbActiveModal, NgbAccordionDirective , NgbModal, NgbDateStruct, NgbDatepickerI18n, NgbDateParserFormatter, NgbDateAdapter } from '@ng-bootstrap/ng-bootstrap';
import { TramiteService } from 'src/app/core/services/tramite/tramite.service';
import { OficinaRegistralService } from '../../../../../core/services/servicios/oficinaregistral.service';
import { FuncionesMtcService } from '../../../../../core/services/funciones-mtc.service';
import { SeguridadService } from '../../../../../core/services/seguridad.service';
import { TipoDocumentoModel } from '../../../../../core/models/TipoDocumentoModel';
import { RepresentanteLegal } from 'src/app/core/models/SunatModel';
import { ReniecService } from '../../../../../core/services/servicios/reniec.service';
import { ExtranjeriaService } from '../../../../../core/services/servicios/extranjeria.service';
import { FormularioTramiteService } from '../../../../../core/services/tramite/formulario-tramite.service';
import { Formulario007_17_3Request } from '../../../domain/formulario007_17_3/formulario007_17_3Request';
import { Formulario007_17_3Response } from '../../../domain/formulario007_17_3/formulario007_17_3Response';
import { Formulario007_17_3Service } from '../../../application/usecases';
import { SunatService } from '../../../../../core/services/servicios/sunat.service';
import { exactLengthValidator, noWhitespaceValidator } from 'src/app/helpers/validator';
import { VisorPdfArchivosService } from '../../../../../core/services/tramite/visor-pdf-archivos.service';
import { VistaPdfComponent } from '../../../../../shared/components/vista-pdf/vista-pdf.component';
import { UbigeoComponent } from '../../../../../shared/components/forms/ubigeo/ubigeo.component';
import { DatosUsuarioLogin } from 'src/app/core/models/Autenticacion/DatosUsuarioLogin';
import { defaultRadioGroupAppearanceProvider } from 'pdf-lib';

@Component({
	selector: 'app-formulario',
	templateUrl: './formulario.component.html',
	styleUrls: ['./formulario.component.css']
})
export class FormularioComponent implements OnInit, AfterViewInit {

	@Input() public dataInput: any;
	@Input() public dataRequisitosInput: any;
	@ViewChild('acc') acc: NgbAccordionDirective ;

	@ViewChild('ubigeoCmpPerNat') ubigeoPerNatComponent: UbigeoComponent;
	@ViewChild('ubigeoCmpRepLeg') ubigeoRepLegComponent: UbigeoComponent;

	disabled: boolean = true;
	graboUsuario: boolean = false;

	codigoProcedimientoTupa: string;
	descProcedimientoTupa: string;
	tramiteSelected: string;
	codigoTipoSolicitudTupa: string;
	descTipoSolicitudTupa: string;

	datosUsuarioLogin: DatosUsuarioLogin;

	txtTitulo: string = '';
	id: number = 0;
	uriArchivo: string = '';//PARA SABER EL NOMBRE DEL PDF (COMPLETO CON TODO Y ADJUNTOS)
	tipoDocumentoValidForm: string;
	formulario: UntypedFormGroup;
	listaTiposDocumentos: TipoDocumentoModel[] = [
		{ id: "01", documento: 'DNI' },
		{ id: "04", documento: 'Carnet de Extranjería' },
	];
	representanteLegal: RepresentanteLegal[] = [];
	activarDatosGenerales: boolean = false;
	txtTituloCompleto: string = "FORMULARIO 007/17.03 AUTORIZACION COMO CENTRO DE INSPECCION VEHICULAR FIJO O MOVIL - CITV FIJO O CITV MOVIL";
	esRepresentante: boolean = false;
	tipoDocumento: TipoDocumentoModel;
	oficinasRegistral: any = [];

	nroDocumentoLogin: string;
	nombreUsuario: string;
	personaJuridica: boolean = false;
	nroRuc: string = "";
	razonSocial: string;
	filePdfPathName: string = null;
	cargoRepresentanteLegal: string = "";

	tipoSolicitante: string = "";
	codTipoDocSolicitante: string = ""; // 01 DNI  03 CI  04 CE   

	//Datos de Formulario
	tituloFormulario = 'AUTORIZACION COMO CENTRO DE INSPECCION VEHICULAR FIJO O MOVIL - CITV FIJO O CITV MOVIL';
	tipoPersona: number = 1;

	paDJ1: string[] = ["DCV-021", "DCV-022", "DCV-023", "DCV-024"];
	paDJ2: string[] = ["DCV-021", "DCV-022", "DCV-023", "DCV-024"];
	paDJ3: string[] = ["DCV-021", "DCV-022", "DCV-023", "DCV-024"];
	paDJ4: string[] = ["DCV-021", "DCV-022", "DCV-023", "DCV-024"];
	paDJ5: string[] = ["DCV-021"];
	paDJ6: string[] = ["DCV-022"];
	paDJ7: string[] = ["DCV-024"];
	paDJ8: string[] = ["DCV-024"];

	activarDJ1: boolean = false;
	activarDJ2: boolean = false;
	activarDJ3: boolean = false;
	activarDJ4: boolean = false;
	activarDJ5: boolean = false;
	activarDJ6: boolean = false;
	activarDJ7: boolean = false;
	activarDJ8: boolean = false;

	activarPN: boolean = false;
	activarPJ: boolean = false;

	maxLengthNumeroDocumentoRepLeg: number;
	maxLengthNumeroDocumentoDatCont: number;

	disableBtnBuscarRepLegal = false;


	constructor(
		private fb: UntypedFormBuilder,
		public activeModal: NgbActiveModal,
		public tramiteService: TramiteService,
		private _oficinaRegistral: OficinaRegistralService,
		private funcionesMtcService: FuncionesMtcService,
		private seguridadService: SeguridadService,
		private reniecService: ReniecService,
		private extranjeriaService: ExtranjeriaService,
		private formularioTramiteService: FormularioTramiteService,
		private formularioService: Formulario007_17_3Service,
		private visorPdfArchivosService: VisorPdfArchivosService,
		private modalService: NgbModal,
		private sunatService: SunatService) {
	}

	async ngOnInit(): Promise<void> {
		const tramiteSelected: any = JSON.parse(localStorage.getItem('tramite-selected'));
		console.log("Codigo de procedimiento: " + tramiteSelected.codigo);
		this.codigoProcedimientoTupa = tramiteSelected.codigo;
		this.descProcedimientoTupa = tramiteSelected.nombre;
		this.codigoTipoSolicitudTupa = (this.dataInput.tipoSolicitudTupaCod == "" ? "0" : this.dataInput.tipoSolicitudTupaCod);
		this.descTipoSolicitudTupa = this.dataInput.tipoSolicitudTupaDesc;

		this.uriArchivo = this.dataInput.rutaDocumento;
		this.id = this.dataInput.movId;

		if (this.paDJ1.indexOf(this.codigoProcedimientoTupa) > -1) this.activarDJ1 = true; else this.activarDJ1 = false;
		if (this.paDJ2.indexOf(this.codigoProcedimientoTupa) > -1) this.activarDJ2 = true; else this.activarDJ2 = false;
		if (this.paDJ3.indexOf(this.codigoProcedimientoTupa) > -1) this.activarDJ3 = true; else this.activarDJ3 = false;
		if (this.paDJ4.indexOf(this.codigoProcedimientoTupa) > -1) this.activarDJ4 = true; else this.activarDJ4 = false;
		if (this.paDJ5.indexOf(this.codigoProcedimientoTupa) > -1) this.activarDJ5 = true; else this.activarDJ5 = false;
		if (this.paDJ6.indexOf(this.codigoProcedimientoTupa) > -1) this.activarDJ6 = true; else this.activarDJ6 = false;
		if (this.paDJ7.indexOf(this.codigoProcedimientoTupa) > -1) {
			if(this.codigoTipoSolicitudTupa=="1" || this.codigoTipoSolicitudTupa=="2" || this.codigoTipoSolicitudTupa=="3" || this.codigoTipoSolicitudTupa=="4")
				this.activarDJ7 = true;
			else
				this.activarDJ7 = false;
		}
		else 
			this.activarDJ7 = false;

		if (this.paDJ8.indexOf(this.codigoProcedimientoTupa) > -1) {
			if(this.codigoTipoSolicitudTupa=="5" || this.codigoTipoSolicitudTupa=="6" || this.codigoTipoSolicitudTupa=="7" || this.codigoTipoSolicitudTupa=="8")
				this.activarDJ8 = true; 
			else 
				this.activarDJ8 = false; 
		}
		else
			this.activarDJ8 = false;

		this.formulario = this.fb.group({
			tipoDocumentoSolicitante: ['', [Validators.required]],
			nroDocumentoSolicitante: ['', [Validators.required]],

			modalidad: ['casilla'],

			Seccion3: this.fb.group({
				f_s3_personaNatural: this.fb.group({
					f_s3_pn_tipoDocumento: ['', [Validators.required, Validators.maxLength(11)]],
					f_s3_pn_numeroDocumento: ['', [Validators.required, Validators.maxLength(11)]],
					f_s3_pn_nombresApellidos: ['', [Validators.required, Validators.maxLength(50)]],
					f_s3_pn_ruc: ['', [Validators.required, Validators.maxLength(50)]],
					f_s3_pn_telefono: ['', [Validators.maxLength(11)]],
					f_s3_pn_celular: ['', [Validators.required, Validators.maxLength(10)]],
					f_s3_pn_correo: ['', [Validators.required, Validators.maxLength(50)]],
					f_s3_pn_domicilio: ['', [Validators.required, Validators.maxLength(10)]],
					f_s3_pn_departamento: ['', [Validators.required, Validators.maxLength(10)]],
					f_s3_pn_provincia: ['', [Validators.required, Validators.maxLength(10)]],
					f_s3_pn_distrito: ['', [Validators.required, Validators.maxLength(10)]],
				}),
				f_s3_personaJuridica: this.fb.group({
					f_s3_pj_ruc: ['', [Validators.required, Validators.maxLength(11)]],
					f_s3_pj_razonSocial: ['', [Validators.required, Validators.maxLength(80)]],
					f_s3_pj_domicilio: ['', [Validators.required, Validators.maxLength(150)]],
					f_s3_pj_distrito: ['', [Validators.required, Validators.maxLength(20)]],
					f_s3_pj_provincia: ['', [Validators.required, Validators.maxLength(20)]],
					f_s3_pj_departamento: ['', [Validators.required, Validators.maxLength(20)]],
				}),
				f_s3_representanteLegal: this.fb.group({
					f_s3_rl_tipoDocumento: ['', [Validators.required, Validators.maxLength(10)]],
					f_s3_rl_numeroDocumento: ['', [Validators.required, Validators.maxLength(11)]],
					f_s3_rl_nombre: ['', [Validators.required, Validators.maxLength(30)]],
					f_s3_rl_apePaterno: ['', [Validators.required, Validators.maxLength(30)]],
					f_s3_rl_apeMaterno: ['', [Validators.required, Validators.maxLength(30)]],
					f_s3_rl_domicilio: ['', [Validators.required, Validators.maxLength(80)]],
					f_s3_rl_telefono: ['', [Validators.maxLength(11)]],
					f_s3_rl_celular: ['', [Validators.required, Validators.maxLength(9)]],
					f_s3_rl_correo: ['', [Validators.required, Validators.email, noWhitespaceValidator(), Validators.maxLength(50)]],
					f_s3_rl_distrito: ['', [Validators.required, Validators.maxLength(20)]],
					f_s3_rl_provincia: ['', [Validators.required, Validators.maxLength(20)]],
					f_s3_rl_departamento: ['', [Validators.required, Validators.maxLength(20)]],
					f_s3_rl_zona: ['', [Validators.required, Validators.maxLength(20)]],
					f_s3_rl_oficina: ['', [Validators.required, Validators.maxLength(50)]],
					f_s3_rl_partida: ['', [Validators.required, Validators.maxLength(9)]],
					f_s3_rl_asiento: ['', [Validators.required, Validators.maxLength(9)]],
				}),
			}),
			Seccion4: this.fb.group({
				f_s4_declaracion_1: this.fb.control(false, [Validators.requiredTrue]),
				f_s4_declaracion_2: this.fb.control(false, [Validators.requiredTrue]),
				f_s4_declaracion_3: this.fb.control(false, [Validators.requiredTrue]),
				f_s4_declaracion_4: this.fb.control(false, [Validators.requiredTrue]),
				f_s4_declaracion_5: (this.codigoProcedimientoTupa == "DCV-022" ? this.fb.control(false, [Validators.requiredTrue]) : this.fb.control(false)),
				f_s4_declaracion_6: (this.codigoProcedimientoTupa == "DCV-021" ? this.fb.control(false, [Validators.requiredTrue]) : this.fb.control(false)),
				f_s4_declaracion_7: (this.codigoProcedimientoTupa == "DCV-024" && this.activarDJ7 ? this.fb.control(false, [Validators.requiredTrue]) : this.fb.control(false)),
				f_s4_declaracion_8: (this.codigoProcedimientoTupa == "DCV-024" && this.activarDJ8 ? this.fb.control(false, [Validators.requiredTrue]) : this.fb.control(false))
			})
		});
	}

	async ngAfterViewInit(): Promise<void> {

		this.nroRuc = this.seguridadService.getCompanyCode();
		this.nombreUsuario = this.seguridadService.getUserName();       //nombre de usuario login
		const tipoDocumento = this.seguridadService.getNameId();   //tipo de documento usuario login
		this.nroDocumentoLogin = this.seguridadService.getNumDoc();    //nro de documento usuario login
		this.datosUsuarioLogin = this.seguridadService.getDatosUsuarioLogin(); // Datos personales del usuario
		this.tipoDocumentoValidForm = tipoDocumento;
		console.log("TIPO DOCUMENTO", tipoDocumento); //00001
		console.log("NUMERO", this.nroDocumentoLogin);

		switch (tipoDocumento) {
			case "00001":
			case "00004":
			case "00005": for (const key in this.f_s3_personaJuridica.controls) {
				this.f_s3_personaJuridica.get(key).clearValidators();
				this.f_s3_personaJuridica.get(key).updateValueAndValidity();
			}

				for (const key in this.f_s3_representanteLegal.controls) {
					this.f_s3_representanteLegal.get(key).clearValidators();
					this.f_s3_representanteLegal.get(key).updateValueAndValidity();
				}

				if (tipoDocumento == "00001") {
					this.f_s3_pn_ruc.clearValidators();
					this.f_s3_pn_ruc.updateValueAndValidity();
				}

				this.formulario.updateValueAndValidity();

				this.activarPN = true;
				this.activarPJ = false;
				break;

			case "00002": for (const key in this.f_s3_personaNatural.controls) {
				this.f_s3_personaNatural.get(key).clearValidators();
				this.f_s3_personaNatural.get(key).updateValueAndValidity();
			}

				this.activarPN = false;
				this.activarPJ = true;
				break;
		}

		await this.cargarOficinaRegistral();
		setTimeout(async () => {
			await this.cargarDatos();
		});
	}

	// GET FORM formularioFG

	get f_TipoDocumentoSolicitante(): AbstractControl { return this.formulario.get(['tipoDocumentoSolicitante']); }
	get f_NroDocumentoSolicitante(): AbstractControl { return this.formulario.get(['nroDocumentoSolicitante']); }

	get f_modalidad(): AbstractControl { return this.formulario.get(['modalidad']); }

	get f_Seccion1(): UntypedFormGroup { return this.formulario.get('Seccion1') as UntypedFormGroup; }

	get f_Seccion3(): UntypedFormGroup { return this.formulario.get('Seccion3') as UntypedFormGroup; }

	get f_s3_personaNatural(): UntypedFormGroup { return this.f_Seccion3.get('f_s3_personaNatural') as UntypedFormGroup; }
	get f_s3_pn_tipoDocumento(): AbstractControl { return this.f_s3_personaNatural.get('f_s3_pn_tipoDocumento'); }
	get f_s3_pn_numeroDocumento(): AbstractControl { return this.f_s3_personaNatural.get(['f_s3_pn_numeroDocumento']); }
	get f_s3_pn_nombresApellidos(): AbstractControl { return this.f_s3_personaNatural.get(['f_s3_pn_nombresApellidos']); }
	get f_s3_pn_ruc(): AbstractControl { return this.f_s3_personaNatural.get(['f_s3_pn_ruc']); }
	get f_s3_pn_telefono(): AbstractControl { return this.f_s3_personaNatural.get(['f_s3_pn_telefono']); }
	get f_s3_pn_celular(): AbstractControl { return this.f_s3_personaNatural.get(['f_s3_pn_celular']); }
	get f_s3_pn_correo(): AbstractControl { return this.f_s3_personaNatural.get(['f_s3_pn_correo']); }
	get f_s3_pn_domicilio(): AbstractControl { return this.f_s3_personaNatural.get(['f_s3_pn_domicilio']); }
	get f_s3_pn_departamento(): AbstractControl { return this.f_s3_personaNatural.get(['f_s3_pn_departamento']); }
	get f_s3_pn_provincia(): AbstractControl { return this.f_s3_personaNatural.get(['f_s3_pn_provincia']); }
	get f_s3_pn_distrito(): AbstractControl { return this.f_s3_personaNatural.get(['f_s3_pn_distrito']); }

	get f_s3_personaJuridica(): UntypedFormGroup { return this.f_Seccion3.get('f_s3_personaJuridica') as UntypedFormGroup; }
	get f_s3_pj_ruc(): AbstractControl { return this.f_s3_personaJuridica.get(['f_s3_pj_ruc']); }
	get f_s3_pj_razonSocial(): AbstractControl { return this.f_s3_personaJuridica.get(['f_s3_pj_razonSocial']); }
	get f_s3_pj_domicilio(): AbstractControl { return this.f_s3_personaJuridica.get(['f_s3_pj_domicilio']); }
	get f_s3_pj_departamento(): AbstractControl { return this.f_s3_personaJuridica.get(['f_s3_pj_departamento']); }
	get f_s3_pj_provincia(): AbstractControl { return this.f_s3_personaJuridica.get(['f_s3_pj_provincia']); }
	get f_s3_pj_distrito(): AbstractControl { return this.f_s3_personaJuridica.get(['f_s3_pj_distrito']); }

	get f_s3_representanteLegal(): UntypedFormGroup { return this.f_Seccion3.get('f_s3_representanteLegal') as UntypedFormGroup; }
	get f_s3_rl_tipoDocumento(): AbstractControl { return this.f_s3_representanteLegal.get(['f_s3_rl_tipoDocumento']); }
	get f_s3_rl_numeroDocumento(): AbstractControl { return this.f_s3_representanteLegal.get(['f_s3_rl_numeroDocumento']); }
	get f_s3_rl_nombre(): AbstractControl { return this.f_s3_representanteLegal.get(['f_s3_rl_nombre']); }
	get f_s3_rl_apePaterno(): AbstractControl { return this.f_s3_representanteLegal.get(['f_s3_rl_apePaterno']); }
	get f_s3_rl_apeMaterno(): AbstractControl { return this.f_s3_representanteLegal.get(['f_s3_rl_apeMaterno']); }
	get f_s3_rl_telefono(): AbstractControl { return this.f_s3_representanteLegal.get(['f_s3_rl_telefono']); }
	get f_s3_rl_celular(): AbstractControl { return this.f_s3_representanteLegal.get(['f_s3_rl_celular']); }
	get f_s3_rl_correo(): AbstractControl { return this.f_s3_representanteLegal.get(['f_s3_rl_correo']); }
	get f_s3_rl_domicilio(): AbstractControl { return this.f_s3_representanteLegal.get(['f_s3_rl_domicilio']); }
	get f_s3_rl_departamento(): AbstractControl { return this.f_s3_representanteLegal.get(['f_s3_rl_departamento']); }
	get f_s3_rl_provincia(): AbstractControl { return this.f_s3_representanteLegal.get(['f_s3_rl_provincia']); }
	get f_s3_rl_distrito(): AbstractControl { return this.f_s3_representanteLegal.get(['f_s3_rl_distrito']); }
	get f_s3_rl_zona(): AbstractControl { return this.f_s3_representanteLegal.get(['f_s3_rl_zona']); }
	get f_s3_rl_oficina(): AbstractControl { return this.f_s3_representanteLegal.get(['f_s3_rl_oficina']); }
	get f_s3_rl_partida(): AbstractControl { return this.f_s3_representanteLegal.get(['f_s3_rl_partida']); }
	get f_s3_rl_asiento(): AbstractControl { return this.f_s3_representanteLegal.get(['f_s3_rl_asiento']); }

	get f_Seccion4(): UntypedFormGroup { return this.formulario.get('Seccion4') as UntypedFormGroup; }
	get f_s4_declaracion_1(): AbstractControl { return this.f_Seccion4.get(['f_s4_declaracion_1']); }
	get f_s4_declaracion_2(): AbstractControl { return this.f_Seccion4.get(['f_s4_declaracion_2']); }
	get f_s4_declaracion_3(): AbstractControl { return this.f_Seccion4.get(['f_s4_declaracion_3']); }
	get f_s4_declaracion_4(): AbstractControl { return this.f_Seccion4.get(['f_s4_declaracion_4']); }
	get f_s4_declaracion_5(): AbstractControl { return this.f_Seccion4.get(['f_s4_declaracion_5']); }
	get f_s4_declaracion_6(): AbstractControl { return this.f_Seccion4.get(['f_s4_declaracion_6']); }
	get f_s4_declaracion_7(): AbstractControl { return this.f_Seccion4.get(['f_s4_declaracion_7']); }
	get f_s4_declaracion_8(): AbstractControl { return this.f_Seccion4.get(['f_s4_declaracion_8']); }
	// FIN GET FORM formularioFG


	async cargarOficinaRegistral(): Promise<void> {
		try {
			const dataOficinaRegistral = await this._oficinaRegistral.oficinaRegistral().toPromise();
			this.oficinasRegistral = dataOficinaRegistral;
			this.funcionesMtcService.ocultarCargando();
		}
		catch (e) {
			this.funcionesMtcService
				.ocultarCargando()
				.mensajeError('Problemas para conectarnos con el servicio y recuperar datos de la oficina registral');
		}
	}

	onChangeTipoDocumento() {
		this.f_s3_rl_tipoDocumento.valueChanges.subscribe((tipoDocumento: string) => {
			if (tipoDocumento?.trim() === '04') { // carnet de extranejria
				this.f_s3_rl_apeMaterno.clearValidators();
				this.f_s3_rl_apeMaterno.updateValueAndValidity();

				this.f_s3_rl_numeroDocumento.setValidators([Validators.required, exactLengthValidator([9])]);
				this.f_s3_rl_numeroDocumento.updateValueAndValidity();
				this.maxLengthNumeroDocumentoRepLeg = 9;
				this.maxLengthNumeroDocumentoDatCont = 9;
			} else {
				this.f_s3_rl_apeMaterno.setValidators([Validators.required]);
				this.f_s3_rl_apeMaterno.updateValueAndValidity();

				this.f_s3_rl_numeroDocumento.setValidators([Validators.required, exactLengthValidator([8])]);
				this.f_s3_rl_numeroDocumento.updateValueAndValidity();
				this.maxLengthNumeroDocumentoRepLeg = 8;
				this.maxLengthNumeroDocumentoDatCont = 8;
			}

			this.f_s3_rl_numeroDocumento.reset('', { emitEvent: false });
			this.inputNumeroDocumento();
		});
	}

	getMaxLengthNumeroDocumento() {
		const tipoDocumento: string = this.formulario.controls['tipoDocumento'].value.trim();

		if (tipoDocumento === '01')//N° de DNI
			return 8;
		else if (tipoDocumento === '04')//Carnet de extranjería
			return 12;
		return 0
	}

	inputNumeroDocumento(event?): void {
		if (event) {
			event.target.value = event.target.value.replace(/[^0-9]/g, '');
		}

		this.f_s3_rl_nombre.reset('', { emitEvent: false });
		this.f_s3_rl_apePaterno.reset('', { emitEvent: false });
		this.f_s3_rl_apeMaterno.reset('', { emitEvent: false });
	}

	async buscarNumeroDocumento(): Promise<void> {
		const tipoDocumento: string = this.f_s3_rl_tipoDocumento.value.trim();
		const numeroDocumento: string = this.f_s3_rl_numeroDocumento.value.trim();
		console.log("TipoDocumento: " + tipoDocumento);
		console.log("Numero Documento: " + numeroDocumento);

		if (tipoDocumento.length === 0 || numeroDocumento.length === 0) {
			this.funcionesMtcService.mensajeError('Debe ingresar Tipo de Documento y/o Número de Documento');
			return;
		}
		if (tipoDocumento === '01' && numeroDocumento.length !== 8) {
			this.funcionesMtcService.mensajeError('DNI debe tener 8 caracteres');
			return;
		}

		const resultado = this.representanteLegal?.find(
			representante => (
				'0' + representante.tipoDocumento.trim()).toString() === tipoDocumento &&
				representante.nroDocumento.trim() === numeroDocumento
		);

		if (resultado || this.tipoSolicitante === 'PNR') {
			this.funcionesMtcService.mostrarCargando();

			if (tipoDocumento === '01') {// DNI
				try {
					const respuesta = await this.reniecService.getDni(numeroDocumento).toPromise();
					console.log(respuesta);
					this.funcionesMtcService.ocultarCargando();

					if (respuesta.reniecConsultDniResponse.listaConsulta.coResultado !== '0000') {
						return this.funcionesMtcService.mensajeError('Número de documento no registrado en Reniec');
					}

					const datosPersona = respuesta.reniecConsultDniResponse.listaConsulta.datosPersona;
					const ubigeo = datosPersona.ubigeo.split('/');
					const cargo = resultado?.cargo?.split('-');
					if (cargo) {
						this.cargoRepresentanteLegal = cargo[cargo.length - 1].trim();
					}
					this.addPersona(tipoDocumento,
						datosPersona.prenombres,
						datosPersona.apPrimer,
						datosPersona.apSegundo,
						datosPersona.direccion,
						ubigeo[2],
						ubigeo[1],
						ubigeo[0]);

					this.f_TipoDocumentoSolicitante.setValue(tipoDocumento);
					this.f_NroDocumentoSolicitante.setValue(numeroDocumento);
				}
				catch (e) {
					console.error(e);

					this.funcionesMtcService.ocultarCargando().mensajeError('Error al consultar al servicio');
					this.f_s3_rl_nombre.enable();
					this.f_s3_rl_apePaterno.enable();
					this.f_s3_rl_apeMaterno.enable();
				}
			} else if (tipoDocumento === '04') {// CARNÉ DE EXTRANJERÍA
				try {
					const respuesta = await this.extranjeriaService.getCE(numeroDocumento).toPromise();

					this.funcionesMtcService.ocultarCargando();

					if (respuesta.CarnetExtranjeria.numRespuesta !== '0000') {
						return this.funcionesMtcService.mensajeError('Número de documento no registrado en Migraciones');
					}

					this.addPersona(tipoDocumento,
						respuesta.CarnetExtranjeria.nombres,
						respuesta.CarnetExtranjeria.primerApellido,
						respuesta.CarnetExtranjeria.segundoApellido,
						'',
						'',
						'',
						'');
				}
				catch (e) {
					console.error(e);

					this.funcionesMtcService.ocultarCargando().mensajeError('Error al consultar al servicio');
					this.f_s3_rl_nombre.enable();
					this.f_s3_rl_apePaterno.enable();
					this.f_s3_rl_apeMaterno.enable();
				}
			}
		} else {
			return this.funcionesMtcService.mensajeError('Representante legal no encontrado');
		}
	}

	async addPersona(
		tipoDocumento: string,
		nombres: string,
		apPaterno: string,
		apMaterno: string,
		direccion: string,
		distrito: string,
		provincia: string,
		departamento: string): Promise<void> {

		if (this.tipoSolicitante === 'PNR') {
			this.f_s3_rl_nombre.setValue(nombres);
			this.f_s3_rl_apePaterno.setValue(apPaterno);
			this.f_s3_rl_apeMaterno.setValue(apMaterno);
			this.f_s3_rl_domicilio.setValue(direccion);

			this.f_s3_rl_nombre.disable({ emitEvent: false });
			this.f_s3_rl_apePaterno.disable({ emitEvent: false });
			this.f_s3_rl_apeMaterno.disable({ emitEvent: false });

			await this.ubigeoRepLegComponent?.setUbigeoByText(
				departamento,
				provincia,
				distrito);
		}
		else {
			this.funcionesMtcService
				.mensajeConfirmar(`Los datos ingresados fueron validados por ${tipoDocumento === '01' ? 'RENIEC' : 'MIGRACIONES'} corresponden a la persona ${nombres} ${apPaterno} ${apMaterno}. ¿Está seguro de agregarlo?`)
				.then(async () => {
					this.f_s3_rl_nombre.setValue(nombres);
					this.f_s3_rl_apePaterno.setValue(apPaterno);
					this.f_s3_rl_apeMaterno.setValue(apMaterno);
					this.f_s3_rl_domicilio.setValue(direccion);

					this.f_s3_rl_nombre.disable({ emitEvent: false });
					this.f_s3_rl_apePaterno.disable({ emitEvent: false });
					this.f_s3_rl_apeMaterno.disable({ emitEvent: false });

					await this.ubigeoRepLegComponent?.setUbigeoByText(
						departamento,
						provincia,
						distrito);
				});
		}
	}

	async cargarDatos(): Promise<void> {
		this.funcionesMtcService.mostrarCargando();

		switch (this.seguridadService.getNameId()) {
			case '00001': this.tipoSolicitante = 'PN'; //persona natural
				this.f_TipoDocumentoSolicitante.setValue('DNI');
				this.f_NroDocumentoSolicitante.setValue(this.nroDocumentoLogin);
				this.codTipoDocSolicitante = '01';
				this.actualizarValidaciones(this.tipoSolicitante);
				break;

			case '00002': this.tipoSolicitante = 'PJ'; // persona juridica
				this.f_TipoDocumentoSolicitante.setValue('DNI');
				this.codTipoDocSolicitante = '01';
				this.f_NroDocumentoSolicitante.setValue(this.nroDocumentoLogin);
				this.actualizarValidaciones(this.tipoSolicitante);
				break;

			case '00004': this.tipoSolicitante = 'PE'; // persona extranjera
				this.f_TipoDocumentoSolicitante.setValue('CARNET DE EXTRANJERIA');
				this.codTipoDocSolicitante = '04';
				this.f_NroDocumentoSolicitante.setValue(this.nroDocumentoLogin);
				break;

			case '00005': this.tipoSolicitante = 'PNR'; // persona natural con ruc
				this.f_TipoDocumentoSolicitante.setValue('DNI');
				this.codTipoDocSolicitante = '01';
				this.f_NroDocumentoSolicitante.setValue(this.nroDocumentoLogin);
				break;
		}

		if (this.dataInput != null && this.dataInput.movId > 0) {
			try {
				const dataFormulario = await this.formularioTramiteService.get<Formulario007_17_3Response>(this.dataInput.tramiteReqId).toPromise();
				this.funcionesMtcService.ocultarCargando();
				const metaData = JSON.parse(dataFormulario.metaData);
				console.log(metaData);
				this.id = dataFormulario.formularioId;

				(metaData.seccion2.modalidad) ? this.f_modalidad.setValue(metaData.seccion2.modalidad) : "";

				this.f_s3_pj_ruc.setValue(metaData.seccion3.numeroDocumento);
				this.f_s3_pj_razonSocial.setValue(metaData.seccion3.razonSocial);
				this.f_s3_pj_domicilio.setValue(metaData.seccion3.domicilioLegal);

				this.f_s3_pj_departamento.setValue(metaData.seccion3.departamento.trim());
				this.f_s3_pj_provincia.setValue(metaData.seccion3.provincia.trim());
				this.f_s3_pj_distrito.setValue(metaData.seccion3.distrito.trim());

				this.f_s3_rl_telefono.setValue(metaData.seccion3.telefono);
				this.f_s3_rl_celular.setValue(metaData.seccion3.celular);
				this.f_s3_rl_correo.setValue(metaData.seccion3.email);
				this.f_s3_rl_tipoDocumento.setValue(metaData.seccion3.representanteLegal.tipoDocumento.id);
				this.f_s3_rl_numeroDocumento.setValue(metaData.seccion3.representanteLegal.numeroDocumento);
				this.f_s3_rl_nombre.setValue(metaData.seccion3.representanteLegal.nombres);
				this.f_s3_rl_apePaterno.setValue(metaData.seccion3.representanteLegal.apellidoPaterno);
				this.f_s3_rl_apeMaterno.setValue(metaData.seccion3.representanteLegal.apellidoMaterno);
				this.f_s3_rl_domicilio.setValue(metaData.seccion3.representanteLegal.domicilioLegal);

				this.f_s3_rl_oficina.setValue(metaData.seccion3.representanteLegal.oficinaRegistral.id);
				this.f_s3_rl_partida.setValue(metaData.seccion3.representanteLegal.partida);
				this.f_s3_rl_asiento.setValue(metaData.seccion3.representanteLegal.asiento);
				this.f_s3_rl_zona.setValue(metaData.seccion3.representanteLegal.zona);

				this.f_s3_pj_razonSocial.disable();
				this.f_s3_pj_ruc.disable();
				this.f_s3_pj_domicilio.disable();
				this.f_s3_pj_distrito.disable({ emitEvent: false });
				this.f_s3_pj_provincia.disable({ emitEvent: false });
				this.f_s3_pj_departamento.disable({ emitEvent: false });

				this.f_s3_rl_departamento.setValue(metaData.seccion3.representanteLegal.departamento.id);
				this.f_s3_rl_provincia.setValue(metaData.seccion3.representanteLegal.provincia.id);
				this.f_s3_rl_distrito.setValue(metaData.seccion3.representanteLegal.distrito.id);

				this.f_s4_declaracion_1.setValue(metaData.seccion4.declaracion_1);
				this.f_s4_declaracion_2.setValue(metaData.seccion4.declaracion_2);
				this.f_s4_declaracion_3.setValue(metaData.seccion4.declaracion_3);
				this.f_s4_declaracion_4.setValue(metaData.seccion4.declaracion_4);
				this.f_s4_declaracion_5.setValue(metaData.seccion4.dcv_021_dj_1);
				this.f_s4_declaracion_6.setValue(metaData.seccion4.dcv_022_dj_1);
				this.f_s4_declaracion_7.setValue(metaData.seccion4.dcv_024_dj_1);
				this.f_s4_declaracion_8.setValue(metaData.seccion4.dcv_024_dj_2);

			}
			catch (e) {
				console.error(e);
				this.funcionesMtcService.ocultarCargando().mensajeError('Problemas para recuperar los datos guardados');
			}

		} else {
			try {
				this.funcionesMtcService.mostrarCargando();
				switch (this.tipoSolicitante) {
					case "PN":
						console.log(this.datosUsuarioLogin);
						this.funcionesMtcService.ocultarCargando();
						this.f_s3_pn_tipoDocumento.setValue(this.f_TipoDocumentoSolicitante.value);
						this.f_s3_pn_numeroDocumento.setValue(this.datosUsuarioLogin.nroDocumento.trim());
						this.f_s3_pn_ruc.setValue('10404923426');
						this.f_s3_pn_nombresApellidos.setValue(this.datosUsuarioLogin.nombres + " " + this.datosUsuarioLogin.apePaterno.trim() + " " + this.datosUsuarioLogin.apeMaterno.trim());
						this.f_s3_pn_domicilio.setValue(this.datosUsuarioLogin.direccion.trim());
						this.f_s3_pn_distrito.setValue(this.datosUsuarioLogin.distrito.trim());
						this.f_s3_pn_provincia.setValue(this.datosUsuarioLogin.provincia.trim());
						this.f_s3_pn_departamento.setValue(this.datosUsuarioLogin.departamento.trim());
						this.f_s3_pn_telefono.setValue(this.datosUsuarioLogin.telefono.trim());
						this.f_s3_pn_celular.setValue(this.datosUsuarioLogin.celular.trim());
						this.f_s3_pn_correo.setValue(this.datosUsuarioLogin.correo.trim());

						for (const key in this.f_s3_personaNatural.controls) {
							if (key != "f_s3_pn_telefono" && key != "f_s3_pn_celular" && key != "f_s3_pn_correo") {
								this.f_s3_personaNatural.get(key).disable();
							}
						}
						break;

					case "PJ": this.sunatService.getDatosPrincipales(this.nroRuc).subscribe(
						(response) => {
							this.funcionesMtcService.ocultarCargando();
							this.f_s3_pj_razonSocial.setValue(response.razonSocial.trim());
							this.f_s3_pj_ruc.setValue(response.nroDocumento.trim());
							this.f_s3_pj_domicilio.setValue(response.domicilioLegal.trim());
							this.f_s3_pj_distrito.setValue(response.nombreDistrito.trim());
							this.f_s3_pj_provincia.setValue(response.nombreProvincia.trim());
							this.f_s3_pj_departamento.setValue(response.nombreDepartamento.trim());
							this.f_s3_rl_telefono.setValue(response.telefono.trim());
							this.f_s3_rl_celular.setValue(response.celular.trim());
							this.f_s3_rl_correo.setValue(response.correo.trim());

							for (const key in this.f_s3_personaJuridica.controls) {
								this.f_s3_personaJuridica.get(key).disable();
							}

							this.representanteLegal = response.representanteLegal;
						}, (error) => {
							this.funcionesMtcService.ocultarCargando().mensajeError('Error al consultar el Servicio de Sunat');
							this.f_s3_pj_razonSocial.setValue(this.razonSocial);
							this.f_s3_pj_ruc.setValue(this.nroRuc);

							this.f_s3_pj_domicilio.enable();
							this.f_s3_pj_distrito.enable();
							this.f_s3_pj_provincia.enable();
							this.f_s3_pj_departamento.enable();
						});
						break;

					case "PNR": this.funcionesMtcService.ocultarCargando();
						this.f_s3_pn_tipoDocumento.setValue(this.f_TipoDocumentoSolicitante.value);
						this.f_s3_pn_numeroDocumento.setValue(this.datosUsuarioLogin.nroDocumento.trim());
						this.f_s3_pn_ruc.setValue(this.datosUsuarioLogin.ruc.trim());
						this.f_s3_pn_nombresApellidos.setValue(this.datosUsuarioLogin.nombres + " " + this.datosUsuarioLogin.apePaterno.trim() + " " + this.datosUsuarioLogin.apeMaterno.trim());
						this.f_s3_pn_domicilio.setValue(this.datosUsuarioLogin.direccion.trim());
						this.f_s3_pn_distrito.setValue(this.datosUsuarioLogin.distrito.trim());
						this.f_s3_pn_provincia.setValue(this.datosUsuarioLogin.provincia.trim());
						this.f_s3_pn_departamento.setValue(this.datosUsuarioLogin.departamento.trim());
						this.f_s3_pn_telefono.setValue(this.datosUsuarioLogin.telefono.trim());
						this.f_s3_pn_celular.setValue(this.datosUsuarioLogin.celular.trim());
						this.f_s3_pn_correo.setValue(this.datosUsuarioLogin.correo.trim());

						for (const key in this.f_s3_personaNatural.controls) {
							if (key != "f_s3_pn_telefono" && key != "f_s3_pn_celular" && key != "f_s3_pn_correo") {
								this.f_s3_personaNatural.get(key).disable();
							}
						}
						break;

					case "PE": this.funcionesMtcService.ocultarCargando();
						this.f_s3_pn_tipoDocumento.setValue(this.f_TipoDocumentoSolicitante.value);
						this.f_s3_pn_numeroDocumento.setValue(this.datosUsuarioLogin.nroDocumento.trim());
						this.f_s3_pn_ruc.setValue(this.datosUsuarioLogin.ruc.trim());
						this.f_s3_pn_nombresApellidos.setValue(this.datosUsuarioLogin.nombres + " " + this.datosUsuarioLogin.apePaterno.trim() + " " + this.datosUsuarioLogin.apeMaterno.trim());
						this.f_s3_pn_domicilio.setValue(this.datosUsuarioLogin.direccion.trim());
						this.f_s3_pn_distrito.setValue(this.datosUsuarioLogin.distrito.trim());
						this.f_s3_pn_provincia.setValue(this.datosUsuarioLogin.provincia.trim());
						this.f_s3_pn_departamento.setValue(this.datosUsuarioLogin.departamento.trim());
						this.f_s3_pn_telefono.setValue(this.datosUsuarioLogin.telefono.trim());
						this.f_s3_pn_celular.setValue(this.datosUsuarioLogin.celular.trim());
						this.f_s3_pn_correo.setValue(this.datosUsuarioLogin.correo.trim());

						for (const key in this.f_s3_personaNatural.controls) {
							if (key != "f_s3_pn_telefono" && key != "f_s3_pn_celular" && key != "f_s3_pn_correo") {
								this.f_s3_personaNatural.get(key).disable();
							}
						}
						break;
				}

				/*
				const response = await this.sunatService.getDatosPrincipales(this.nroRuc).toPromise();
				console.log('SUNAT: ', response);
				this.f_s3_pj_razonSocial.setValue(response.razonSocial.trim());
				this.f_s3_pj_ruc.setValue(response.nroDocumento.trim());
				this.f_s3_pj_domicilio.setValue(response.domicilioLegal.trim());

				this.f_s3_pj_departamento.setValue(response.nombreDepartamento.trim());
				this.f_s3_pj_provincia.setValue(response.nombreProvincia.trim());
				this.f_s3_pj_distrito.setValue(response.nombreDistrito.trim());

				this.f_s3_rl_telefono.setValue(response.telefono.trim());
				this.f_s3_rl_celular.setValue(response.celular.trim());
				this.f_s3_rl_correo.setValue(response.correo.trim());

				this.representanteLegal = response.representanteLegal;

				// Cargamos el Representante Legal
				for (const repLegal of this.representanteLegal) {
					if (repLegal.nroDocumento === this.nroDocumentoLogin) {
						if (repLegal.tipoDocumento === '01') {  // DNI
							this.f_s3_rl_tipoDocumento.setValue('01', { emitEvent: false });

							this.f_s3_rl_apeMaterno.setValidators([Validators.required, noWhitespaceValidator(), Validators.maxLength(50)]);
							this.f_s3_rl_numeroDocumento.setValidators([Validators.required, exactLengthValidator([8])]);

							this.f_s3_rl_numeroDocumento.setValue(repLegal.nroDocumento, { emitEvent: false });
							this.buscarNumeroDocumentoRepLeg(true);
						}
						break;
					}
				}
				this.funcionesMtcService.ocultarCargando();*/
			}
			catch (e) {
				console.error(e);
				this.funcionesMtcService.ocultarCargando().mensajeError('No se encuentra');

				this.formulario.disable();
				//this.disableGuardar = true;
			}

		}
	}

	async buscarNumeroDocumentoRepLeg(cargarDatos = false): Promise<void> {
		const tipoDocumento: string = this.f_s3_rl_tipoDocumento.value.trim();
		const numeroDocumento: string = this.f_s3_rl_numeroDocumento.value.trim();
		console.log("TipoDocumento: " + tipoDocumento);
		console.log("Numero Documento: " + numeroDocumento);
		const resultado = this.representanteLegal?.find(
			representante => (
				'0' + representante.tipoDocumento.trim()).toString() === tipoDocumento &&
				representante.nroDocumento.trim() === numeroDocumento
		);

		if (resultado) {
			this.funcionesMtcService.mostrarCargando();

			if (tipoDocumento === '01') {// DNI
				try {
					const respuesta = await this.reniecService.getDni(numeroDocumento).toPromise();
					console.log(respuesta);

					this.funcionesMtcService.ocultarCargando();

					if (respuesta.reniecConsultDniResponse.listaConsulta.coResultado !== '0000') {
						return this.funcionesMtcService.mensajeError('Número de documento no registrado en RENIEC');
					}

					const { prenombres, apPrimer, apSegundo, direccion, ubigeo } = respuesta.reniecConsultDniResponse.listaConsulta.datosPersona;
					const [departamento, provincia, distrito] = ubigeo.split('/');

					this.setRepLegal(
						tipoDocumento,
						prenombres,
						apPrimer,
						apSegundo,
						direccion,
						departamento,
						provincia,
						distrito,
						cargarDatos
					);

					const cargo = resultado?.cargo?.split('-');
					if (cargo) {
						this.cargoRepresentanteLegal = cargo[cargo.length - 1].trim();
					}
				}
				catch (e) {
					console.error(e);
					//this.funcionesMtcService.ocultarCargando().mensajeError(CONSTANTES.MensajeError.Reniec);
				}
			} else if (tipoDocumento === '04') {// CARNÉ DE EXTRANJERÍA
				try {
					const { CarnetExtranjeria } = await this.extranjeriaService.getCE(numeroDocumento).toPromise();
					console.log(CarnetExtranjeria);
					const { numRespuesta, nombres, primerApellido, segundoApellido } = CarnetExtranjeria;

					this.funcionesMtcService.ocultarCargando();

					if (numRespuesta !== '0000') {
						return this.funcionesMtcService.mensajeError('Número de documento no registrado en MIGRACIONES');
					}

					this.setRepLegal(
						tipoDocumento,
						nombres,
						primerApellido,
						segundoApellido,
						'',
						'',
						'',
						'',
						cargarDatos
					);
				}
				catch (e) {
					console.error(e);
					this.funcionesMtcService.ocultarCargando().mensajeError('Número de documento no registrado en MIGRACIONES');
				}
			}
		} else {
			return this.funcionesMtcService.mensajeError('Representante legal no encontrado.');
		}
	}

	async setRepLegal(
		tipoDocumento: string,
		nombres: string,
		apPaterno: string,
		apMaterno: string,
		direccion: string,
		departamento: string,
		provincia: string,
		distrito: string,
		cargarDatos = false): Promise<void> {

		if (cargarDatos) {
			this.f_s3_rl_nombre.setValue(nombres);
			this.f_s3_rl_apePaterno.setValue(apPaterno);
			this.f_s3_rl_apeMaterno.setValue(apMaterno);
			this.f_s3_rl_domicilio.setValue(direccion);

			await this.ubigeoRepLegComponent?.setUbigeoByText(
				departamento,
				provincia,
				distrito);
		}
		else {
			this.funcionesMtcService
				.mensajeConfirmar(`Los datos ingresados fueron validados por ${tipoDocumento === '01' ? 'RENIEC' : 'MIGRACIONES'} corresponden a la persona ${nombres} ${apPaterno} ${apMaterno}. ¿Está seguro de agregarlo?`)
				.then(async () => {
					this.f_s3_rl_nombre.setValue(nombres);
					this.f_s3_rl_apePaterno.setValue(apPaterno);
					this.f_s3_rl_apeMaterno.setValue(apMaterno);
					this.f_s3_rl_domicilio.setValue(direccion);

					await this.ubigeoRepLegComponent?.setUbigeoByText(
						departamento,
						provincia,
						distrito);
				});
		}
	}

	recuperarDatosUsuario() {
		this.reniecService.getDni(this.nroDocumentoLogin).subscribe(
			(response) => {
				const datos = response.reniecConsultDniResponse.listaConsulta.datosPersona;
				if (datos.prenombres !== null && datos.prenombres !== '')
					this.nombreUsuario = (datos.prenombres.trim() + ' ' + datos.apPrimer.trim() + ' ' + datos.apSegundo.trim());
			},
			(error) => {
				this.nombreUsuario = "";
			}
		);
	}

	actualizarValidaciones(tipoSolicitante) {
		this.f_s3_pj_razonSocial.disable();
		this.f_s3_pj_ruc.disable();
		this.f_s3_pj_domicilio.disable();
		this.f_s3_pj_distrito.disable();
		this.f_s3_pj_provincia.disable();
		this.f_s3_pj_departamento.disable();
	}

	soloNumeros(event) {
		event.target.value = event.target.value.replace(/[^0-9]/g, '');
	}

	guardarFormulario() {

		if (this.formulario.invalid === true)
			return this.funcionesMtcService.mensajeError('Debe ingresar todos los campos obligatorios');
		let oficinaRepresentante = this.f_s3_rl_oficina.value;
		//let departamento = this.f_s3_pn_Departamento.filter(item => item.value == oficinaRepresentante)[0].text;

		let dataGuardar: Formulario007_17_3Request = new Formulario007_17_3Request();

		dataGuardar.id = this.id;
		dataGuardar.codigo = 'F007-17.3';
		dataGuardar.formularioId = 7;
		dataGuardar.codUsuario = this.nroDocumentoLogin;
		dataGuardar.idTramiteReq = this.dataInput.tramiteReqId,
			dataGuardar.estado = 1;

		//Seccion1
		dataGuardar.metaData.seccion1.codigoProcedimiento = this.codigoProcedimientoTupa;

		//Seccion2
		dataGuardar.metaData.seccion2.modalidad = this.f_modalidad.value;

		//Seccion3
		dataGuardar.metaData.seccion3.tipoSolicitante = this.tipoSolicitante;
		dataGuardar.metaData.seccion3.tipoDocumento = (this.tipoSolicitante == "PJ" ? this.f_s3_rl_tipoDocumento.value : this.f_s3_pn_tipoDocumento.value); //codDocumento
		dataGuardar.metaData.seccion3.numeroDocumento = (this.tipoSolicitante == "PJ" ? this.f_s3_pj_ruc.value : this.f_s3_pn_numeroDocumento.value); //nroDocumento
		dataGuardar.metaData.seccion3.ruc = (this.tipoSolicitante == "PJ" || this.tipoSolicitante == "PNR" ? this.f_s3_pj_ruc.value : null);
		dataGuardar.metaData.seccion3.nombresApellidos = (this.tipoSolicitante == "PJ" ? "" : this.f_s3_pn_nombresApellidos.value);
		dataGuardar.metaData.seccion3.razonSocial = (this.tipoSolicitante == "PJ" ? this.f_s3_pj_razonSocial.value : "");
		dataGuardar.metaData.seccion3.domicilioLegal = (this.tipoSolicitante == "PJ" ? this.f_s3_pj_domicilio.value : this.f_s3_pn_domicilio.value);
		dataGuardar.metaData.seccion3.departamento = (this.tipoSolicitante == "PJ" ? this.f_s3_pj_departamento.value : this.f_s3_pn_departamento.value);
		dataGuardar.metaData.seccion3.provincia = (this.tipoSolicitante == "PJ" ? this.f_s3_pj_provincia.value : this.f_s3_pn_provincia.value);
		dataGuardar.metaData.seccion3.distrito = (this.tipoSolicitante == "PJ" ? this.f_s3_pj_distrito.value : this.f_s3_pn_distrito.value);
		dataGuardar.metaData.seccion3.telefono = (this.tipoSolicitante == "PJ" ? this.f_s3_rl_telefono.value : this.f_s3_pn_telefono.value);
		dataGuardar.metaData.seccion3.celular = (this.tipoSolicitante == "PJ" ? this.f_s3_rl_celular.value : this.f_s3_pn_celular.value);
		dataGuardar.metaData.seccion3.email = (this.tipoSolicitante == "PJ" ? this.f_s3_rl_correo.value : this.f_s3_pn_correo.value);
		dataGuardar.metaData.seccion3.representanteLegal.nombres = (this.tipoSolicitante == "PJ" ? this.f_s3_rl_nombre.value : "");
		dataGuardar.metaData.seccion3.representanteLegal.apellidoPaterno = (this.tipoSolicitante == "PJ" ? this.f_s3_rl_apePaterno.value : "");
		dataGuardar.metaData.seccion3.representanteLegal.apellidoMaterno = (this.tipoSolicitante == "PJ" ? this.f_s3_rl_apeMaterno.value : "");
		dataGuardar.metaData.seccion3.representanteLegal.tipoDocumento.id = (this.tipoSolicitante == "PJ" ? this.f_s3_rl_tipoDocumento.value : "");
		dataGuardar.metaData.seccion3.representanteLegal.tipoDocumento.documento = (this.tipoSolicitante == "PJ" ? this.listaTiposDocumentos.filter(item => item.id == this.f_s3_rl_tipoDocumento.value)[0].documento : "");
		dataGuardar.metaData.seccion3.representanteLegal.numeroDocumento = (this.tipoSolicitante == "PJ" ? this.f_s3_rl_numeroDocumento.value : "");
		dataGuardar.metaData.seccion3.representanteLegal.domicilioLegal = (this.tipoSolicitante == "PJ" ? this.f_s3_rl_domicilio.value : "");
		dataGuardar.metaData.seccion3.representanteLegal.oficinaRegistral.id = oficinaRepresentante;
		dataGuardar.metaData.seccion3.representanteLegal.oficinaRegistral.descripcion = (this.tipoSolicitante == "PJ" ? this.oficinasRegistral.filter(item => item.value == oficinaRepresentante)[0].text : "");
		dataGuardar.metaData.seccion3.representanteLegal.partida = (this.tipoSolicitante == "PJ" ? this.f_s3_rl_partida.value : "");
		dataGuardar.metaData.seccion3.representanteLegal.asiento = (this.tipoSolicitante == "PJ" ? this.f_s3_rl_asiento.value : "");
		dataGuardar.metaData.seccion3.representanteLegal.zona = (this.tipoSolicitante == "PJ" ? this.f_s3_rl_zona.value : "");
		dataGuardar.metaData.seccion3.representanteLegal.distrito.id = (this.tipoSolicitante == "PJ" ? this.f_s3_rl_distrito.value : "");
		dataGuardar.metaData.seccion3.representanteLegal.distrito.descripcion = (this.tipoSolicitante == "PJ" ? this.ubigeoRepLegComponent.getDistritoText() : "");
		dataGuardar.metaData.seccion3.representanteLegal.provincia.id = (this.tipoSolicitante == "PJ" ? this.f_s3_rl_provincia.value : "");
		dataGuardar.metaData.seccion3.representanteLegal.provincia.descripcion = (this.tipoSolicitante == "PJ" ? this.ubigeoRepLegComponent.getProvinciaText() : "");
		dataGuardar.metaData.seccion3.representanteLegal.departamento.id = (this.tipoSolicitante == "PJ" ? this.f_s3_rl_departamento.value : "");
		dataGuardar.metaData.seccion3.representanteLegal.departamento.descripcion = (this.tipoSolicitante == "PJ" ? this.ubigeoRepLegComponent.getDepartamentoText() : "");
		//Seccion4
		dataGuardar.metaData.seccion4.declaracion_1 = this.f_s4_declaracion_1.value;
		dataGuardar.metaData.seccion4.declaracion_2 = this.f_s4_declaracion_2.value;
		dataGuardar.metaData.seccion4.declaracion_3 = this.f_s4_declaracion_3.value;
		dataGuardar.metaData.seccion4.declaracion_4 = this.f_s4_declaracion_4.value;
		dataGuardar.metaData.seccion4.dcv_021_dj_1 = this.f_s4_declaracion_5.value;
		dataGuardar.metaData.seccion4.dcv_022_dj_1 = this.f_s4_declaracion_6.value;
		dataGuardar.metaData.seccion4.dcv_024_dj_1 = this.f_s4_declaracion_7.value;
		dataGuardar.metaData.seccion4.dcv_024_dj_2 = this.f_s4_declaracion_8.value;

		//Seccion5
		dataGuardar.metaData.seccion5.tipoDocumentoSolicitante = this.f_TipoDocumentoSolicitante.value;
		dataGuardar.metaData.seccion5.nombreTipoDocumentoSolicitante = this.listaTiposDocumentos.filter(item => item.id == this.codTipoDocSolicitante)[0].documento;
		dataGuardar.metaData.seccion5.numeroDocumentoSolicitante = this.f_NroDocumentoSolicitante.value;
		dataGuardar.metaData.seccion5.nombresApellidosSolicitante = this.nombreUsuario;

		console.log(JSON.stringify(dataGuardar));
		this.funcionesMtcService.mensajeConfirmar(`¿Está seguro de ${this.id === 0 ? 'guardar' : 'modificar'} los datos ingresados?`)
			.then(() => {
				if (this.id === 0) {
					this.funcionesMtcService.mostrarCargando();
					//GUARDAR:
					this.formularioService.post(dataGuardar)
						.subscribe(
							data => {
								this.funcionesMtcService.ocultarCargando();
								this.id = data.id;
								this.uriArchivo = data.uriArchivo;
								console.log(this.dataInput.tramiteReqId);
								//this.idTramiteReq=data.idTramiteReq;
								this.graboUsuario = true;
								//this.funcionesMtcService.mensajeOk(`Los datos fueron guardados exitosamente (idFormularioMovimiento = ${this.idFormularioMovimiento})`);
								this.funcionesMtcService.mensajeOk('Los datos fueron guardados exitosamente ');
							},
							error => {
								this.funcionesMtcService.ocultarCargando().mensajeError('Problemas para realizar el guardado de datos');
							}
						);
				} else {
					//Evalua anexos a actualizar
					let listarequisitos = this.dataRequisitosInput;
					let cadenaAnexos = "";
					for (let i = 0; i < listarequisitos.length; i++) {
						if (this.dataInput.tramiteReqId === listarequisitos[i].tramiteReqRefId) {
							if (listarequisitos[i].movId > 0) {
								const nombreAnexo = listarequisitos[i].codigoFormAnexo.split("_");
								cadenaAnexos += nombreAnexo[0] + " " + nombreAnexo[1] + "-" + nombreAnexo[2] + " ";
							}
						}
					}

					if (cadenaAnexos.length > 0) {
						//ACTUALIZA FORMULARIO Y ANEXOS
						this.funcionesMtcService.mensajeConfirmar("Deberá volver a grabar los anexos " + cadenaAnexos + "¿Desea continuar?")
							.then(() => {
								this.funcionesMtcService.mostrarCargando();
								this.formularioService.put(dataGuardar)
									.subscribe(
										data => {
											this.funcionesMtcService.ocultarCargando();
											this.id = data.id;
											this.uriArchivo = data.uriArchivo;
											this.graboUsuario = true;
											this.funcionesMtcService.ocultarCargando();
											this.funcionesMtcService.mensajeOk(`Los datos fueron modificados exitosamente`);

											for (let i = 0; i < listarequisitos.length; i++) {
												if (this.dataInput.tramiteReqId === listarequisitos[i].tramiteReqRefId) {
													if (listarequisitos[i].movId > 0) {
														console.log('Actualizando Anexos');
														console.log(listarequisitos[i].tramiteReqRefId);
														console.log(listarequisitos[i].movId);
														//ACTUALIZAR ESTADO DEL ANEXO Y LIMPIAR URI ARCHIVO
														this.formularioTramiteService.uriArchivo<number>(listarequisitos[i].movId)
															.subscribe(
																data => { },
																error => {
																	this.funcionesMtcService.ocultarCargando().mensajeError('Problemas para realizar la modificación de los anexos');
																}
															);
													}
												}
											}

										},
										error => {
											this.funcionesMtcService.ocultarCargando().mensajeError('Problemas para realizar la modificación de datos');
										}
									);

							});
					} else {
						//actualiza formulario
						this.funcionesMtcService.mostrarCargando();
						this.formularioService.put(dataGuardar)
							.subscribe(
								data => {
									this.funcionesMtcService.ocultarCargando();
									this.id = data.id;
									this.uriArchivo = data.uriArchivo;
									this.graboUsuario = true;
									this.funcionesMtcService.ocultarCargando();
									this.funcionesMtcService.mensajeOk(`Los datos fueron modificados exitosamente`);
								},
								error => {
									this.funcionesMtcService.ocultarCargando().mensajeError('Problemas para realizar la modificación de datos');
								}
							);
					}

				}
			});
	}

	descargarPdf() { // OK
		if (this.id === 0)
			return this.funcionesMtcService.mensajeError('Debe guardar previamente los datos ingresados');

		if (!this.uriArchivo || this.uriArchivo == "" || this.uriArchivo == null)
			return this.funcionesMtcService.mensajeError('No se logró ubicar el archivo PDF');

		this.funcionesMtcService.mostrarCargando();

		this.visorPdfArchivosService.get(this.uriArchivo)
			//this.anexoService.readPostFie(this.idAnexo)
			.subscribe(
				(file: Blob) => {
					this.funcionesMtcService.ocultarCargando();

					const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
					const urlPdf = URL.createObjectURL(file);
					modalRef.componentInstance.pdfUrl = urlPdf;
					modalRef.componentInstance.titleModal = "Vista Previa - Formulario 007/17.03";

				},
				error => {
					this.funcionesMtcService
						.ocultarCargando()
						.mensajeError('Problemas para descargar Pdf');
				}
			);
	}

	formInvalid(control: string): boolean {
		if (this.formulario.get(control))
			return this.formulario.get(control).invalid && (this.formulario.get(control).dirty || this.formulario.get(control).touched);
	}

	public findInvalidControls() {
		const invalid = [];
		const controls = this.formulario.controls;
		for (const name in controls) {
			if (controls[name].invalid) {
				invalid.push(name);
			}
		}
		console.log(invalid);
		const c = this.f_s3_personaNatural.controls;
		for (const name in c) {
			if (c[name].invalid) {
				invalid.push(name);
			}
		}
		console.log(invalid);

		const d = this.f_s3_personaJuridica.controls;
		for (const name in d) {
			if (d[name].invalid) {
				invalid.push(name);
			}
		}
		console.log(invalid);

		const e = this.f_s3_representanteLegal.controls;
		for (const name in e) {
			if (e[name].invalid) {
				invalid.push(name);
			}
		}
		console.log(invalid);
	}
}