/**
 * Formulario 001/16 utilizado por los procedimientos DGAAM-001, DGAAM-002 Y DGAAM-003
 * @author Mackenneddy Meléndez Coral
 * @version 1.0 25.10.2022
 * @author Alicia Toquila
 * @version 1.1 03/04/2023
*/
import { Component, OnInit, Input, ViewChild, AfterViewInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, AbstractControl, FormArray } from '@angular/forms';
import { NgbActiveModal, NgbAccordionDirective , NgbModal, NgbDateStruct, NgbDatepickerI18n, NgbDateParserFormatter, NgbDateAdapter } from '@ng-bootstrap/ng-bootstrap';
import { TramiteService } from 'src/app/core/services/tramite/tramite.service';
// import { OficinaRegistralService } from '../../../../core/services/servicios/oficinaregistral.service';
// import { FuncionesMtcService } from '../../../../core/services/funciones-mtc.service';
// import { SeguridadService } from '../../../../core/services/seguridad.service';
import { TipoDocumentoModel } from 'src/app/core/models/TipoDocumentoModel';
import { RepresentanteLegal } from 'src/app/core/models/SunatModel';
import { ReniecService } from 'src/app/core/services/servicios/reniec.service';
import { ExtranjeriaService } from 'src/app/core/services/servicios/extranjeria.service';
import { FormularioTramiteService } from 'src/app/core/services/tramite/formulario-tramite.service';
// import { Formulario001_16Request } from 'src/app/core/models/Formularios/Formulario001_16/Formulario001_16Request';
// import { Formulario001_16Response } from 'src/app/core/models/Formularios/Formulario001_16/Formulario001_16Response';
// import { Formulario00116Service } from '../../../../core/services/formularios/formulario001-16.service';
import { SunatService } from 'src/app/core/services/servicios/sunat.service';
import { exactLengthValidator, noWhitespaceValidator } from 'src/app/helpers/validator';
// import { VisorPdfArchivosService } from '../../../../core/services/tramite/visor-pdf-archivos.service';
// import { VistaPdfComponent } from '../../../../shared/components/vista-pdf/vista-pdf.component';
import { UbigeoComponent } from 'src/app/shared/components/forms/ubigeo/ubigeo.component';
import { defaultRadioGroupAppearanceProvider } from 'pdf-lib';
import { SnipService } from '../../../../../core/services/servicios/snip.service';
import { OficinaRegistralService } from 'src/app/core/services/servicios/oficinaregistral.service';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { SeguridadService } from 'src/app/core/services/seguridad.service';
import { Formulario001_16Service } from '../../../application/usecases';
import { VisorPdfArchivosService } from 'src/app/core/services/tramite/visor-pdf-archivos.service';
import { Formulario001_16Request } from '../../../domain/formulario001_16/formulario001_16Request';
import { Formulario001_16Response } from '../../../domain/formulario001_16/formulario001_16Response';
import { VistaPdfComponent } from 'src/app/shared/components/vista-pdf/vista-pdf.component';
import { DatosUsuarioLogin } from 'src/app/core/models/Autenticacion/DatosUsuarioLogin';



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

  datosUsuarioLogin: DatosUsuarioLogin;
  codigoProcedimientoTupa: string;
  descProcedimientoTupa: string;
  tramiteSelected: string;
  codigoTipoSolicitudTupa: string;
  descTipoSolicitudTupa: string;

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
  txtTituloCompleto: string = "FORMULARIO 001/16 PROCEDIMIENTOS ADMINISTRATIVOS A CARGO DE LA DIRECCIÓN GENERAL DE ASUNTOS AMBIENTALES";
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
  tituloFormulario = 'PROCEDIMIENTOS ADMINISTRATIVOS A CARGO DE LA DIRECCIÓN GENERAL DE ASUNTOS AMBIENTALES';
  tipoPersona: number = 1;

  paSeccion1: string[] = ["DGAAM-001","DGAAM-002","DGAAM-003","DGAAM-004","DGAAM-005","DGAAM-006","DGAAM-008"];
  paSeccion111: string[] = ["DGAAM-003"];
  paSeccion112: string[] = ["DGAAM-010"];
  paSeccion12: string[] = ["DGAAM-007","DGAAM-010"];

  habilitarSeccion1: boolean = true;
  habilitarSeccion111: boolean = true;
  habilitarSeccion112: boolean = true;
  habilitarSeccion12: boolean = true;

  activarPN: boolean = false;
  activarPJ: boolean = false;

  maxLengthNumeroDocumentoRepLeg: number;

  disableBtnBuscarRepLegal = false;

  anioMaximo:any = new Date().getFullYear();

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
    private formularioService: Formulario001_16Service,
    private visorPdfArchivosService: VisorPdfArchivosService,
    private modalService: NgbModal,
    private sunatService: SunatService,
    private snipService: SnipService
  ) {
  }

  async ngOnInit(): Promise<void> {
    const tramiteSelected: any = JSON.parse(localStorage.getItem('tramite-selected'));
    this.codigoProcedimientoTupa = tramiteSelected.codigo;
    this.descProcedimientoTupa = tramiteSelected.nombre;
    this.codigoTipoSolicitudTupa = (this.dataInput.tipoSolicitudTupaCod == "" ? "0" : this.dataInput.tipoSolicitudTupaCod);
    this.descTipoSolicitudTupa = this.dataInput.tipoSolicitudTupaDesc;

    this.uriArchivo = this.dataInput.rutaDocumento;
    this.id = this.dataInput.movId;

    console.log("Codigo Procedimiento:", this.paSeccion111.indexOf(this.codigoProcedimientoTupa));

    if (this.paSeccion1.indexOf(this.codigoProcedimientoTupa) > -1) this.habilitarSeccion1 = true; else this.habilitarSeccion1 = false;
    if (this.paSeccion111.indexOf(this.codigoProcedimientoTupa) > -1) this.habilitarSeccion111 = true; else this.habilitarSeccion111 = false;
    if (this.paSeccion112.indexOf(this.codigoProcedimientoTupa) > -1) this.habilitarSeccion112 = true; else this.habilitarSeccion112 = false;
    if (this.paSeccion12.indexOf(this.codigoProcedimientoTupa) > -1) this.habilitarSeccion12 = true; else this.habilitarSeccion12 = false;


    this.formulario = this.fb.group({

      codigoSnip: this.fb.control("", [Validators.maxLength(7)]),
      nombreProyecto:(this.habilitarSeccion1) ? this.fb.control({ value: '', disabled: true }, [Validators.required]) : "",
      nroResolucion: (this.habilitarSeccion111) ? this.fb.control("", [Validators.required, Validators.minLength(2)]) : "",
      nroResHomologacion: (this.habilitarSeccion112) ? this.fb.control("", [Validators.required, Validators.minLength(2)]) : "",
      marca: (this.habilitarSeccion12) ? this.fb.control("", [Validators.required, Validators.maxLength(100)]) : "",
      modelo:(this.habilitarSeccion12) ? this.fb.control("", [Validators.required, Validators.maxLength(100)]) : "",
      procedencia:(this.habilitarSeccion12) ? this.fb.control("", [Validators.required, Validators.maxLength(100)]) : "",
      anio:(this.habilitarSeccion12) ? this.fb.control("", [Validators.required, Validators.maxLength(4), Validators.max(this.anioMaximo)]) : "",
      serie:(this.habilitarSeccion12) ? this.fb.control("", [Validators.required, Validators.maxLength(30)]) : "",
      usoEquipo:(this.habilitarSeccion12) ? this.fb.control("", [Validators.required, Validators.maxLength(200)]) : "",
      lugarOperacion:(this.habilitarSeccion12) ? this.fb.control("", [Validators.required, Validators.maxLength(200)]) : "",
      caracteristicas:(this.habilitarSeccion12) ? this.fb.control("", [Validators.required, Validators.maxLength(300)]) : "",
      modalidad: ['personal'],

      tipoDocumentoSolicitante: ['', [Validators.required]],
      nroDocumentoSolicitante: ['', [Validators.required]],
      Seccion3: this.fb.group({
        PersonaNatural: this.fb.group({
          pn_ruc: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(50)]],
          pn_nombres: ['', [Validators.required, Validators.maxLength(50)]],
          pn_domicilio: ['', [Validators.required, Validators.maxLength(50)]],
          pn_distrito: ['', [Validators.required]],
          pn_provincia: ['', [Validators.required]],
          pn_departamento: ['', [Validators.required]],
          pn_telefono: ['', [Validators.maxLength(15)]],
          pn_celular: ['', [Validators.required, exactLengthValidator([9])]],
          pn_correo: ['', [Validators.required, Validators.email, noWhitespaceValidator(), Validators.maxLength(50)]]
        }),
        PersonaJuridica: this.fb.group({
          pj_ruc: ['', [Validators.required, Validators.maxLength(11)]],
          pj_razonSocial: ['', [Validators.required, Validators.maxLength(100)]],
          pj_domicilio: ['', [Validators.required, Validators.maxLength(150)]],
          pj_distrito: ['', [Validators.required, Validators.maxLength(20)]],
          pj_provincia: ['', [Validators.required, Validators.maxLength(20)]],
          pj_departamento: ['', [Validators.required, Validators.maxLength(20)]],
        }),
        RepresentanteLegal: this.fb.group({
          rl_tipoDocumento: ['', [Validators.required, Validators.maxLength(10)]],
          rl_numeroDocumento: ['', [Validators.required, Validators.maxLength(11)]],
          rl_nombre: ['', [Validators.required, Validators.maxLength(30)]],
          rl_apePaterno: ['', [Validators.required, Validators.maxLength(30)]],
          rl_apeMaterno: ['', [Validators.required, Validators.maxLength(30)]],
          rl_domicilio: ['', [Validators.required, Validators.maxLength(100)]],
          rl_telefono: ['', [Validators.maxLength(15)]],
          rl_celular: ['', [Validators.required, Validators.maxLength(9)]],
          rl_correo: ['', [Validators.required, Validators.email, noWhitespaceValidator(), Validators.maxLength(50)]],
          rl_distrito: ['', [Validators.required, Validators.maxLength(20)]],
          rl_provincia: ['', [Validators.required, Validators.maxLength(20)]],
          rl_departamento: ['', [Validators.required, Validators.maxLength(20)]],
          rl_oficina: ['', [Validators.required, Validators.maxLength(20)]],
          rl_partida: ['', [Validators.required, Validators.maxLength(9)]],
          rl_asiento: ['', [Validators.required, Validators.maxLength(9)]],
        })
      }),
      declaracion_1: this.fb.control(true, [Validators.requiredTrue]),
      declaracion_2: this.fb.control(true, [Validators.requiredTrue]),

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
      case "00005": //this.formulario.enable({emitEvent: false});
        this.f_s3_PersonaNatural.enable({ emitEvent: false });
        this.f_s3_PersonaJuridica.disable({ emitEvent: false });
        this.f_s3_RepresentanteLegal.disable({ emitEvent: false });
        this.f_TipoDocumentoSolicitante.disable();
        this.f_NroDocumentoSolicitante.disable();
        this.activarPN = true;
        this.activarPJ = false;
        break;

      case "00002": this.f_s3_PersonaNatural.disable({ emitEvent: false });
        this.f_s3_PersonaJuridica.enable({ emitEvent: false });
        this.f_s3_RepresentanteLegal.enable({ emitEvent: false });
        this.activarPN = false;
        this.activarPJ = true;

        break;
    }

    await this.cargarOficinaRegistral();
    setTimeout(async () => {
      await this.cargarDatos();
    });
    //await this.cargarDatos();

    //this.acc.expand('seccion-2');
    //this.acc.expand('seccion-3');
    //this.acc.expand('seccion-4');
    //this.acc.expand('seccion-5');
    this.acc.expand('seccion-3');
    //this.acc.expand('seccion-7');
  }

  // GET FORM formularioFG
  get f_codigoSnip(): AbstractControl { return this.formulario.get(['codigoSnip']); }

  get f_nombreProyecto(): AbstractControl { return this.formulario.get(['nombreProyecto']); }

  get f_nroResolucion(): AbstractControl { return this.formulario.get(['nroResolucion']); }
  get f_nroResHomologacion():  AbstractControl { return this.formulario.get(['nroResHomologacion']); }
  get f_marca(): AbstractControl { return this.formulario.get(['marca']);}
  get f_modelo(): AbstractControl { return this.formulario.get(['modelo']);}
  get f_procedencia(): AbstractControl { return this.formulario.get(['procedencia']);}
  get f_anio(): AbstractControl { return this.formulario.get(['anio']);}
  get f_serie(): AbstractControl { return this.formulario.get(['serie']);}
  get f_usoEquipo(): AbstractControl { return this.formulario.get(['usoEquipo']);}
  get f_lugarOperacion(): AbstractControl { return this.formulario.get(['lugarOperacion']);}
  get f_caracteristicas(): AbstractControl { return this.formulario.get(['caracteristicas']);}

  get f_modalidad(): AbstractControl { return this.formulario.get(['modalidad']); }

  get f_TipoDocumentoSolicitante(): AbstractControl { return this.formulario.get(['tipoDocumentoSolicitante']); }
  get f_NroDocumentoSolicitante(): AbstractControl { return this.formulario.get(['nroDocumentoSolicitante']); }
  get f_Seccion3(): UntypedFormGroup { return this.formulario.get('Seccion3') as UntypedFormGroup; }
  get f_s3_PersonaNatural(): UntypedFormGroup { return this.f_Seccion3.get('PersonaNatural') as UntypedFormGroup; }
  get f_s3_pn_Ruc(): AbstractControl { return this.f_s3_PersonaNatural.get(['pn_ruc']); }
  get f_s3_pn_Nombres(): AbstractControl { return this.f_s3_PersonaNatural.get(['pn_nombres']); }
  get f_s3_pn_Domicilio(): AbstractControl { return this.f_s3_PersonaNatural.get(['pn_domicilio']); }
  get f_s3_pn_Distrito(): AbstractControl { return this.f_s3_PersonaNatural.get(['pn_distrito']); }
  get f_s3_pn_Provincia(): AbstractControl { return this.f_s3_PersonaNatural.get(['pn_provincia']); }
  get f_s3_pn_Departamento(): AbstractControl { return this.f_s3_PersonaNatural.get(['pn_departamento']); }
  get f_s3_pn_Telefono(): AbstractControl { return this.f_s3_PersonaNatural.get(['pn_telefono']); }
  get f_s3_pn_Celular(): AbstractControl { return this.f_s3_PersonaNatural.get(['pn_celular']); }
  get f_s3_pn_Correo(): AbstractControl { return this.f_s3_PersonaNatural.get(['pn_correo']); }
  get f_s3_PersonaJuridica(): UntypedFormGroup { return this.f_Seccion3.get('PersonaJuridica') as UntypedFormGroup; }
  get f_s3_pj_Ruc(): AbstractControl { return this.f_s3_PersonaJuridica.get(['pj_ruc']); }
  get f_s3_pj_RazonSocial(): AbstractControl { return this.f_s3_PersonaJuridica.get(['pj_razonSocial']); }
  get f_s3_pj_Domicilio(): AbstractControl { return this.f_s3_PersonaJuridica.get(['pj_domicilio']); }
  get f_s3_pj_Departamento(): AbstractControl { return this.f_s3_PersonaJuridica.get(['pj_departamento']); }
  get f_s3_pj_Provincia(): AbstractControl { return this.f_s3_PersonaJuridica.get(['pj_provincia']); }
  get f_s3_pj_Distrito(): AbstractControl { return this.f_s3_PersonaJuridica.get(['pj_distrito']); }
  get f_s3_RepresentanteLegal(): UntypedFormGroup { return this.f_Seccion3.get('RepresentanteLegal') as UntypedFormGroup; }
  get f_s3_rl_TipoDocumento(): AbstractControl { return this.f_s3_RepresentanteLegal.get(['rl_tipoDocumento']); }
  get f_s3_rl_NumeroDocumento(): AbstractControl { return this.f_s3_RepresentanteLegal.get(['rl_numeroDocumento']); }
  get f_s3_rl_Nombre(): AbstractControl { return this.f_s3_RepresentanteLegal.get(['rl_nombre']); }
  get f_s3_rl_ApePaterno(): AbstractControl { return this.f_s3_RepresentanteLegal.get(['rl_apePaterno']); }
  get f_s3_rl_ApeMaterno(): AbstractControl { return this.f_s3_RepresentanteLegal.get(['rl_apeMaterno']); }
  get f_s3_rl_Telefono(): AbstractControl { return this.f_s3_RepresentanteLegal.get(['rl_telefono']); }
  get f_s3_rl_Celular(): AbstractControl { return this.f_s3_RepresentanteLegal.get(['rl_celular']); }
  get f_s3_rl_Correo(): AbstractControl { return this.f_s3_RepresentanteLegal.get(['rl_correo']); }
  get f_s3_rl_Domicilio(): AbstractControl { return this.f_s3_RepresentanteLegal.get(['rl_domicilio']); }
  get f_s3_rl_Departamento(): AbstractControl { return this.f_s3_RepresentanteLegal.get(['rl_departamento']); }
  get f_s3_rl_Provincia(): AbstractControl { return this.f_s3_RepresentanteLegal.get(['rl_provincia']); }
  get f_s3_rl_Distrito(): AbstractControl { return this.f_s3_RepresentanteLegal.get(['rl_distrito']); }
  get f_s3_rl_Oficina(): AbstractControl { return this.f_s3_RepresentanteLegal.get(['rl_oficina']); }
  get f_s3_rl_Partida(): AbstractControl { return this.f_s3_RepresentanteLegal.get(['rl_partida']); }
  get f_s3_rl_Asiento(): AbstractControl { return this.f_s3_RepresentanteLegal.get(['rl_asiento']); }

  get f_declaracion_1(): AbstractControl { return this.formulario.get(['declaracion_1']); }
  get f_declaracion_2(): AbstractControl { return this.formulario.get(['declaracion_2']); }
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
    this.f_s3_rl_TipoDocumento.valueChanges.subscribe((tipoDocumento: string) => {
      if (tipoDocumento?.trim() === '04') { // carnet de extranejria
        this.f_s3_rl_ApeMaterno.clearValidators();
        this.f_s3_rl_ApeMaterno.updateValueAndValidity();

        this.f_s3_rl_NumeroDocumento.setValidators([Validators.required, exactLengthValidator([9])]);
        this.f_s3_rl_NumeroDocumento.updateValueAndValidity();
        this.maxLengthNumeroDocumentoRepLeg = 9;
      } else {
        this.f_s3_rl_ApeMaterno.setValidators([Validators.required]);
        this.f_s3_rl_ApeMaterno.updateValueAndValidity();

        this.f_s3_rl_NumeroDocumento.setValidators([Validators.required, exactLengthValidator([8])]);
        this.f_s3_rl_NumeroDocumento.updateValueAndValidity();
        this.maxLengthNumeroDocumentoRepLeg = 8;
      }

      this.f_s3_rl_NumeroDocumento.reset('', { emitEvent: false });
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

    this.f_s3_rl_Nombre.reset('', { emitEvent: false });
    this.f_s3_rl_ApePaterno.reset('', { emitEvent: false });
    this.f_s3_rl_ApeMaterno.reset('', { emitEvent: false });
  }

  async buscarNumeroDocumento(): Promise<void> {
    const tipoDocumento: string = this.f_s3_rl_TipoDocumento.value.trim();
    const numeroDocumento: string = this.f_s3_rl_NumeroDocumento.value.trim();
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
          this.f_s3_rl_Nombre.enable();
          this.f_s3_rl_ApePaterno.enable();
          this.f_s3_rl_ApeMaterno.enable();
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
          this.f_s3_rl_Nombre.enable();
          this.f_s3_rl_ApePaterno.enable();
          this.f_s3_rl_ApeMaterno.enable();
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
      this.f_s3_rl_Nombre.setValue(nombres);
      this.f_s3_rl_ApePaterno.setValue(apPaterno);
      this.f_s3_rl_ApeMaterno.setValue(apMaterno);
      this.f_s3_rl_Domicilio.setValue(direccion);

      this.f_s3_rl_Nombre.disable({ emitEvent: false });
      this.f_s3_rl_ApePaterno.disable({ emitEvent: false });
      this.f_s3_rl_ApeMaterno.disable({ emitEvent: false });

      await this.ubigeoRepLegComponent?.setUbigeoByText(
        departamento,
        provincia,
        distrito);
    }
    else {
      this.funcionesMtcService
        .mensajeConfirmar(`Los datos ingresados fueron validados por ${tipoDocumento === '01' ? 'RENIEC' : 'MIGRACIONES'} corresponden a la persona ${nombres} ${apPaterno} ${apMaterno}. ¿Está seguro de agregarlo?`)
        .then(async () => {
          this.f_s3_rl_Nombre.setValue(nombres);
          this.f_s3_rl_ApePaterno.setValue(apPaterno);
          this.f_s3_rl_ApeMaterno.setValue(apMaterno);
          this.f_s3_rl_Domicilio.setValue(direccion);

          this.f_s3_rl_Nombre.disable({ emitEvent: false });
          this.f_s3_rl_ApePaterno.disable({ emitEvent: false });
          this.f_s3_rl_ApeMaterno.disable({ emitEvent: false });

          await this.ubigeoRepLegComponent?.setUbigeoByText(
            departamento,
            provincia,
            distrito);
        });
    }
  }

  buscarNombrePy() {

    const codSnip = (this.f_codigoSnip.value.trim()).replace(/\s+/g, '');


    if (codSnip.length > 7) {
      this.funcionesMtcService.mensajeError('El código no tiene la cantidad de caracteres permitidos');
      return;

    }
    //console.log("Codigo SNIP o CU: "+codSnip);
    //this.getNombreProyectoX(codSnip);

    this.funcionesMtcService.mostrarCargando();
    this.snipService.getSnip(codSnip).subscribe(
      (resp) => {
        this.funcionesMtcService.ocultarCargando();
        this.f_nombreProyecto.setValue(resp.nombreInversion);
        this.f_nombreProyecto.disable();
      },
      (err) => {
        this.f_nombreProyecto.setValue('');
        this.funcionesMtcService.ocultarCargando().mensajeError('No se encontró el código buscado, verificar y registrar manualmente el nombre del Proyecto.');
        this.f_nombreProyecto.enable();
      });

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
        const dataFormulario = await this.formularioTramiteService.get<Formulario001_16Response>(this.dataInput.tramiteReqId).toPromise();
        this.funcionesMtcService.ocultarCargando();
        const metaData = JSON.parse(dataFormulario.metaData);
        console.log(metaData);
        this.id = dataFormulario.formularioId;

        this.f_nombreProyecto.setValue(metaData.seccion1.nombreProyecto);

        (metaData.seccion1.nroResolucion) ? this.f_nroResolucion.setValue(metaData.seccion1.nroResolucion) : "";
        (metaData.seccion1.nroResHomologacion) ? this.f_nroResHomologacion.setValue(metaData.seccion1.nroResHomologacion) : "";
        (metaData.seccion1.marca) ? this.f_marca.setValue(metaData.seccion1.marca) : "";
        (metaData.seccion1.modelo) ? this.f_modelo.setValue(metaData.seccion1.modelo) : "";
        (metaData.seccion1.procedencia) ? this.f_procedencia.setValue(metaData.seccion1.procedencia) : "";
        (metaData.seccion1.anio) ? this.f_anio.setValue(metaData.seccion1.anio) : "";
        (metaData.seccion1.serie) ? this.f_serie.setValue(metaData.seccion1.serie) : "";
        (metaData.seccion1.usoEquipo) ? this.f_usoEquipo.setValue(metaData.seccion1.usoEquipo) : "";
        (metaData.seccion1.lugarOperacion) ? this.f_lugarOperacion.setValue(metaData.seccion1.lugarOperacion) : "";
        (metaData.seccion1.caracteristicas) ? this.f_caracteristicas.setValue(metaData.seccion1.caracteristicas) : "";

        (metaData.seccion2.modalidad) ? this.f_modalidad.setValue(metaData.seccion2.modalidad) : "";

        if (this.activarPN) {
          this.f_s3_pn_Nombres.setValue(metaData.seccion3.nombresApellidos);
          this.f_NroDocumentoSolicitante.setValue(metaData.seccion3.numeroDocumento);
          this.f_s3_pn_Telefono.setValue(metaData.seccion3.telefono);
          this.f_s3_pn_Celular.setValue(metaData.seccion3.celular);
          this.f_s3_pn_Correo.setValue(metaData.seccion3.email);
          this.f_s3_pn_Domicilio.setValue(metaData.seccion3.domicilioLegal);

          this.f_s3_pn_Departamento.setValue(metaData.seccion3.pn_departamento.id);
          this.f_s3_pn_Provincia.setValue(metaData.seccion3.pn_provincia.id);
          this.f_s3_pn_Distrito.setValue(metaData.seccion3.pn_distrito.id);

          //console.log(this.ubigeoPerNatComponent);
          await this.ubigeoPerNatComponent?.setUbigeoByText(
            metaData.seccion3.pn_departamento.descripcion,
            metaData.seccion3.pn_provincia.descripcion,
            metaData.seccion3.pn_distrito.descripcion
          );
        }

        if (this.activarPJ) {
          this.f_s3_pj_Ruc.setValue(metaData.seccion3.numeroDocumento);
          this.f_s3_pj_RazonSocial.setValue(metaData.seccion3.razonSocial);
          this.f_s3_pj_Domicilio.setValue(metaData.seccion3.domicilioLegal);

          this.f_s3_pj_Departamento.setValue(metaData.seccion3.departamento.trim());
          this.f_s3_pj_Provincia.setValue(metaData.seccion3.provincia.trim());
          this.f_s3_pj_Distrito.setValue(metaData.seccion3.distrito.trim());

          this.f_s3_rl_Telefono.setValue(metaData.seccion3.telefono);
          this.f_s3_rl_Celular.setValue(metaData.seccion3.celular);
          this.f_s3_rl_Correo.setValue(metaData.seccion3.email);
          this.f_s3_rl_TipoDocumento.setValue(metaData.seccion3.RepresentanteLegal.tipoDocumento.id);
          this.f_s3_rl_NumeroDocumento.setValue(metaData.seccion3.RepresentanteLegal.numeroDocumento);
          this.f_s3_rl_Nombre.setValue(metaData.seccion3.RepresentanteLegal.nombres);
          this.f_s3_rl_ApePaterno.setValue(metaData.seccion3.RepresentanteLegal.apellidoPaterno);
          this.f_s3_rl_ApeMaterno.setValue(metaData.seccion3.RepresentanteLegal.apellidoMaterno);
          this.f_s3_rl_Domicilio.setValue(metaData.seccion3.RepresentanteLegal.domicilioLegal);

          this.f_s3_rl_Oficina.setValue(metaData.seccion3.RepresentanteLegal.oficinaRegistral.id);
          this.f_s3_rl_Partida.setValue(metaData.seccion3.RepresentanteLegal.partida);
          this.f_s3_rl_Asiento.setValue(metaData.seccion3.RepresentanteLegal.asiento);

          this.f_s3_pj_RazonSocial.disable();
          this.f_s3_pj_Ruc.disable();
          this.f_s3_pj_Domicilio.disable();
          this.f_s3_pj_Distrito.disable({ emitEvent: false });
          this.f_s3_pj_Provincia.disable({ emitEvent: false });
          this.f_s3_pj_Departamento.disable({ emitEvent: false });

          this.f_s3_rl_Departamento.setValue(metaData.seccion3.RepresentanteLegal.departamento.id);
          this.f_s3_rl_Provincia.setValue(metaData.seccion3.RepresentanteLegal.provincia.id);
          this.f_s3_rl_Distrito.setValue(metaData.seccion3.RepresentanteLegal.distrito.id);
        }

        if (this.tipoSolicitante === 'PNR') {
          this.f_s3_rl_TipoDocumento.disable({ emitEvent: false });
          this.f_s3_rl_NumeroDocumento.disable({ emitEvent: false });

          this.f_s3_pj_Ruc.clearValidators();
          this.f_s3_pj_Ruc.updateValueAndValidity();
          this.f_s3_pj_Ruc.disable({ emitEvent: false });

          this.f_s3_pj_Departamento.clearValidators();
          this.f_s3_pj_Departamento.updateValueAndValidity({ emitEvent: false });
          this.f_s3_pj_Departamento.disable({ emitEvent: false });
          this.f_s3_pj_Provincia.clearValidators();
          this.f_s3_pj_Provincia.updateValueAndValidity({ emitEvent: false });
          this.f_s3_pj_Provincia.disable({ emitEvent: false });
          this.f_s3_pj_Distrito.clearValidators();
          this.f_s3_pj_Distrito.updateValueAndValidity({ emitEvent: false });
          this.f_s3_pj_Distrito.disable({ emitEvent: false });

          this.f_s3_rl_Nombre.disable({ emitEvent: false });
          this.f_s3_rl_ApePaterno.disable({ emitEvent: false });
          this.f_s3_rl_ApeMaterno.disable({ emitEvent: false });

          this.disableBtnBuscarRepLegal = true;
        }

        this.f_declaracion_1.setValue(metaData.seccion5.declaracion_1);
        this.f_declaracion_2.setValue(metaData.seccion5.declaracion_2);
      }
      catch (e) {
        console.error(e);
        this.funcionesMtcService.ocultarCargando().mensajeError('Problemas para recuperar los datos guardados');
      }

    } else {
      if (this.activarPN) {
        const response = await this.reniecService.getDni(this.nroDocumentoLogin).toPromise();
        try {
          this.funcionesMtcService.ocultarCargando();

          if (response.reniecConsultDniResponse.listaConsulta.coResultado !== '0000')
            return this.funcionesMtcService.mensajeError('Número de documento no registrado en Reniec');

          const datosPersona = response.reniecConsultDniResponse.listaConsulta.datosPersona;
          let ubigeo = datosPersona.ubigeo.split('/');
          this.f_NroDocumentoSolicitante.setValue(this.nroDocumentoLogin);
          this.f_s3_pn_Nombres.setValue(datosPersona.prenombres + ' ' + datosPersona.apPrimer + ' ' + datosPersona.apSegundo);
          this.f_s3_pn_Domicilio.setValue(datosPersona.direccion);

          await this.ubigeoPerNatComponent?.setUbigeoByText(
            ubigeo[0].trim(),
            ubigeo[1].trim(),
            ubigeo[2].trim());
        }
        catch (e) {
          console.error(e);
          this.funcionesMtcService.ocultarCargando().mensajeError('Error al consultar al servicio');
        }
      }
      if (this.activarPJ) {
        try {
          this.funcionesMtcService.mostrarCargando();
          const response = await this.sunatService.getDatosPrincipales(this.nroRuc).toPromise();
          console.log('SUNAT: ', response);
          this.f_s3_pj_RazonSocial.setValue(response.razonSocial.trim());
          this.f_s3_pj_Ruc.setValue(response.nroDocumento.trim());
          this.f_s3_pj_Domicilio.setValue(response.domicilioLegal.trim());

          this.f_s3_pj_Departamento.setValue(response.nombreDepartamento.trim());
          this.f_s3_pj_Provincia.setValue(response.nombreProvincia.trim());
          this.f_s3_pj_Distrito.setValue(response.nombreDistrito.trim());

          this.f_s3_rl_Telefono.setValue(response.telefono.trim());
          this.f_s3_rl_Celular.setValue(response.celular.trim());
          this.f_s3_rl_Correo.setValue(response.correo.trim());

          this.representanteLegal = response.representanteLegal;

          // Cargamos el Representante Legal
          for (const repLegal of this.representanteLegal) {
            if (repLegal.nroDocumento === this.nroDocumentoLogin) {
              if (repLegal.tipoDocumento === '01') {  // DNI
                this.f_s3_rl_TipoDocumento.setValue('01', { emitEvent: false });

                this.f_s3_rl_ApeMaterno.setValidators([Validators.required, noWhitespaceValidator(), Validators.maxLength(50)]);
                this.f_s3_rl_NumeroDocumento.setValidators([Validators.required, exactLengthValidator([8])]);

                this.f_s3_rl_NumeroDocumento.setValue(repLegal.nroDocumento, { emitEvent: false });
                this.buscarNumeroDocumentoRepLeg(true);
              }
              break;
            }
          }
          // Cargamos el Representante Legal

          // this.setDisableDefaultPerJur();

          this.funcionesMtcService.ocultarCargando();
        }
        catch (e) {
          console.error(e);
          this.funcionesMtcService.ocultarCargando().mensajeError('No se encuentra');

          this.formulario.disable();
          //this.disableGuardar = true;
        }
      }
    }
  }

  async buscarNumeroDocumentoRepLeg(cargarDatos = false): Promise<void> {
    const tipoDocumento: string = this.f_s3_rl_TipoDocumento.value.trim();
    const numeroDocumento: string = this.f_s3_rl_NumeroDocumento.value.trim();
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
      this.f_s3_rl_Nombre.setValue(nombres);
      this.f_s3_rl_ApePaterno.setValue(apPaterno);
      this.f_s3_rl_ApeMaterno.setValue(apMaterno);
      this.f_s3_rl_Domicilio.setValue(direccion);

      await this.ubigeoRepLegComponent?.setUbigeoByText(
        departamento,
        provincia,
        distrito);
    }
    else {
      this.funcionesMtcService
        .mensajeConfirmar(`Los datos ingresados fueron validados por ${tipoDocumento === '01' ? 'RENIEC' : 'MIGRACIONES'} corresponden a la persona ${nombres} ${apPaterno} ${apMaterno}. ¿Está seguro de agregarlo?`)
        .then(async () => {
          this.f_s3_rl_Nombre.setValue(nombres);
          this.f_s3_rl_ApePaterno.setValue(apPaterno);
          this.f_s3_rl_ApeMaterno.setValue(apMaterno);
          this.f_s3_rl_Domicilio.setValue(direccion);

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
    switch (tipoSolicitante) {
      case "PN": this.f_s3_pn_Ruc.clearValidators();
        this.f_s3_pn_Telefono.clearValidators();

        this.f_s3_pj_Ruc.clearValidators();
        this.f_s3_pj_RazonSocial.clearValidators();
        this.f_s3_pj_Departamento.clearValidators();
        this.f_s3_pj_Provincia.clearValidators();
        this.f_s3_pj_Distrito.clearValidators();
        this.f_s3_pj_Domicilio.clearValidators();

        this.f_s3_rl_TipoDocumento.clearValidators();
        this.f_s3_rl_NumeroDocumento.clearValidators();
        this.f_s3_rl_ApeMaterno.clearValidators();
        this.f_s3_rl_ApePaterno.clearValidators();
        this.f_s3_rl_Nombre.clearValidators();
        this.f_s3_rl_Domicilio.clearValidators();
        this.f_s3_rl_Departamento.clearValidators();
        this.f_s3_rl_Provincia.clearValidators();
        this.f_s3_rl_Distrito.clearValidators();
        this.f_s3_rl_Oficina.clearValidators();
        this.f_s3_rl_Partida.clearValidators();
        this.f_s3_rl_Asiento.clearValidators();
        this.f_s3_rl_Telefono.clearValidators();
        this.f_s3_rl_Celular.clearValidators();
        this.f_s3_rl_Correo.clearValidators();

        this.f_s3_pn_Nombres.disable();

        //this.formulario.updateValueAndValidity({ emitEvent: false });
        this.f_s3_pn_Ruc.updateValueAndValidity();
        this.f_s3_pn_Telefono.updateValueAndValidity();

        this.f_s3_rl_TipoDocumento.updateValueAndValidity();
        this.f_s3_rl_NumeroDocumento.updateValueAndValidity();
        this.f_s3_rl_ApeMaterno.updateValueAndValidity();
        this.f_s3_rl_ApePaterno.updateValueAndValidity();
        this.f_s3_rl_Nombre.updateValueAndValidity();
        this.f_s3_rl_Domicilio.updateValueAndValidity();
        this.f_s3_rl_Departamento.updateValueAndValidity();
        this.f_s3_rl_Provincia.updateValueAndValidity();
        this.f_s3_rl_Distrito.updateValueAndValidity();
        this.f_s3_rl_Oficina.updateValueAndValidity();
        this.f_s3_rl_Partida.updateValueAndValidity();
        this.f_s3_rl_Asiento.updateValueAndValidity();
        this.f_s3_rl_Telefono.updateValueAndValidity();
        this.f_s3_rl_Celular.updateValueAndValidity();
        this.f_s3_rl_Correo.updateValueAndValidity();
        break;

      case "PJ": this.f_s3_pn_Ruc.clearValidators();
        this.f_s3_pn_Nombres.clearValidators();
        this.f_s3_pn_Domicilio.clearValidators();
        this.f_s3_pn_Departamento.clearValidators();
        this.f_s3_pn_Provincia.clearValidators();
        this.f_s3_pn_Distrito.clearValidators();
        this.f_s3_pn_Telefono.clearValidators();
        this.f_s3_pn_Celular.clearValidators();
        this.f_s3_pn_Correo.clearValidators();

        this.f_s3_pn_Ruc.updateValueAndValidity();
        this.f_s3_pn_Nombres.updateValueAndValidity();
        this.f_s3_pn_Domicilio.updateValueAndValidity();
        this.f_s3_pn_Departamento.updateValueAndValidity();
        this.f_s3_pn_Provincia.updateValueAndValidity();
        this.f_s3_pn_Distrito.updateValueAndValidity();
        this.f_s3_pn_Telefono.updateValueAndValidity();
        this.f_s3_pn_Celular.updateValueAndValidity();
        this.f_s3_pn_Correo.updateValueAndValidity();

        //this.formulario.updateValueAndValidity({ emitEvent: false });

        this.f_s3_pj_RazonSocial.disable();
        this.f_s3_pj_Ruc.disable();
        this.f_s3_pj_Domicilio.disable();
        this.f_s3_pj_Distrito.disable();
        this.f_s3_pj_Provincia.disable();
        this.f_s3_pj_Departamento.disable();

        break;
    }

  }

  soloNumeros(event) {
    event.target.value = event.target.value.replace(/[^0-9]/g, '');
  }

  guardarFormulario() {

    //console.log(this.formulario); return;

    if (this.formulario.invalid === true)
      return this.funcionesMtcService.mensajeError('Debe ingresar todos los campos obligatorios');
    let oficinaRepresentante = this.f_s3_rl_Oficina.value;
    //let departamento = this.f_s3_pn_Departamento.filter(item => item.value == oficinaRepresentante)[0].text;

    let dataGuardar: Formulario001_16Request = new Formulario001_16Request();

    dataGuardar.id = this.id;
    dataGuardar.codigo = 'F001-16';
    dataGuardar.formularioId = 2;
    dataGuardar.codUsuario = this.nroDocumentoLogin;
    dataGuardar.idTramiteReq = this.dataInput.tramiteReqId,
      dataGuardar.estado = 1;

    //Seccion1
    dataGuardar.metaData.seccion1.codigoProcedimiento = this.codigoProcedimientoTupa;
    dataGuardar.metaData.seccion1.nombreProyecto = this.f_nombreProyecto.value;
    dataGuardar.metaData.seccion1.nroResolucion = this.f_nroResolucion.value;
    dataGuardar.metaData.seccion1.nroResHomologacion = this.f_nroResHomologacion.value;
    dataGuardar.metaData.seccion1.marca = this.f_marca.value;
    dataGuardar.metaData.seccion1.modelo = this.f_modelo.value;
    dataGuardar.metaData.seccion1.procedencia = this.f_procedencia.value;
    dataGuardar.metaData.seccion1.anio = this.f_anio.value;
    dataGuardar.metaData.seccion1.serie = this.f_serie.value;
    dataGuardar.metaData.seccion1.usoEquipo = this.f_usoEquipo.value;
    dataGuardar.metaData.seccion1.lugarOperacion = this.f_lugarOperacion.value;
    dataGuardar.metaData.seccion1.caracteristicas = this.f_caracteristicas.value;

    //Seccion2
    dataGuardar.metaData.seccion2.modalidad = this.f_modalidad.value;

    //Seccion3
    dataGuardar.metaData.seccion3.tipoSolicitante = this.tipoSolicitante;
    dataGuardar.metaData.seccion3.nombresApellidos = (this.tipoSolicitante === 'PN' || this.tipoSolicitante === 'PNR' || this.tipoSolicitante === 'PE' ? this.f_s3_pn_Nombres.value : '');
    dataGuardar.metaData.seccion3.tipoDocumento = (this.tipoSolicitante === "PJ" ? this.f_s3_rl_TipoDocumento.value : this.codTipoDocSolicitante); //codDocumento
    dataGuardar.metaData.seccion3.numeroDocumento = (this.tipoSolicitante === "PJ" ? this.f_s3_pj_Ruc.value : this.f_NroDocumentoSolicitante.value); //nroDocumento
    dataGuardar.metaData.seccion3.ruc = (this.tipoSolicitante === "PJ" ? this.f_s3_pj_Ruc.value : this.f_s3_pn_Ruc.value);
    dataGuardar.metaData.seccion3.razonSocial = (this.tipoSolicitante === 'PJ' ? this.f_s3_pj_RazonSocial.value : '');
    dataGuardar.metaData.seccion3.domicilioLegal = (this.tipoSolicitante === 'PJ' ? this.f_s3_pj_Domicilio.value : this.f_s3_pn_Domicilio.value);
    dataGuardar.metaData.seccion3.pn_departamento.id = (this.tipoSolicitante === 'PJ' ? "" : this.f_s3_pn_Departamento.value);
    dataGuardar.metaData.seccion3.pn_departamento.descripcion = (this.tipoSolicitante === 'PJ' ? "" : this.ubigeoPerNatComponent.getDepartamentoText());
    dataGuardar.metaData.seccion3.pn_provincia.id = (this.tipoSolicitante === 'PJ' ? "" : this.f_s3_pn_Provincia.value);
    dataGuardar.metaData.seccion3.pn_provincia.descripcion = (this.tipoSolicitante === 'PJ' ? "" : this.ubigeoPerNatComponent.getProvinciaText());
    dataGuardar.metaData.seccion3.pn_distrito.id = (this.tipoSolicitante === 'PJ' ? "" : this.f_s3_pn_Distrito.value);
    dataGuardar.metaData.seccion3.pn_distrito.descripcion = (this.tipoSolicitante === 'PJ' ? "" : this.ubigeoPerNatComponent.getDistritoText());
    dataGuardar.metaData.seccion3.departamento = (this.tipoSolicitante === 'PJ' ? this.f_s3_pj_Departamento.value : "");
    dataGuardar.metaData.seccion3.provincia = (this.tipoSolicitante === 'PJ' ? this.f_s3_pj_Provincia.value : "");
    dataGuardar.metaData.seccion3.distrito = (this.tipoSolicitante === 'PJ' ? this.f_s3_pj_Distrito.value : "");
    dataGuardar.metaData.seccion3.representanteLegal.nombres = this.f_s3_rl_Nombre.value;
    dataGuardar.metaData.seccion3.representanteLegal.apellidoPaterno = this.f_s3_rl_ApePaterno.value;
    dataGuardar.metaData.seccion3.representanteLegal.apellidoMaterno = this.f_s3_rl_ApeMaterno.value;
    dataGuardar.metaData.seccion3.representanteLegal.tipoDocumento.id = this.f_s3_rl_TipoDocumento.value;
    dataGuardar.metaData.seccion3.representanteLegal.tipoDocumento.documento = (this.tipoSolicitante === "PJ" ? this.listaTiposDocumentos.filter(item => item.id == this.f_s3_rl_TipoDocumento.value)[0].documento : "");
    dataGuardar.metaData.seccion3.representanteLegal.numeroDocumento = this.f_s3_rl_NumeroDocumento.value;
    dataGuardar.metaData.seccion3.representanteLegal.domicilioLegal = this.f_s3_rl_Domicilio.value;
    dataGuardar.metaData.seccion3.representanteLegal.oficinaRegistral.id = oficinaRepresentante;
    dataGuardar.metaData.seccion3.representanteLegal.oficinaRegistral.descripcion = (this.tipoSolicitante === "PJ" ? this.oficinasRegistral.filter(item => item.value == oficinaRepresentante)[0].text : "");
    dataGuardar.metaData.seccion3.representanteLegal.partida = this.f_s3_rl_Partida.value;
    dataGuardar.metaData.seccion3.representanteLegal.asiento = this.f_s3_rl_Asiento.value;
    dataGuardar.metaData.seccion3.representanteLegal.distrito.id = (this.tipoSolicitante === 'PJ' ? this.f_s3_rl_Distrito.value : "");
    dataGuardar.metaData.seccion3.representanteLegal.distrito.descripcion = (this.tipoSolicitante === 'PJ' ? this.ubigeoRepLegComponent.getDistritoText() : "");
    dataGuardar.metaData.seccion3.representanteLegal.provincia.id = (this.tipoSolicitante === 'PJ' ? this.f_s3_rl_Provincia.value : "");
    dataGuardar.metaData.seccion3.representanteLegal.provincia.descripcion = (this.tipoSolicitante === 'PJ' ? this.ubigeoRepLegComponent.getProvinciaText() : "");
    dataGuardar.metaData.seccion3.representanteLegal.departamento.id = (this.tipoSolicitante === 'PJ' ? this.f_s3_rl_Departamento.value : "");
    dataGuardar.metaData.seccion3.representanteLegal.departamento.descripcion = (this.tipoSolicitante === 'PJ' ? this.ubigeoRepLegComponent.getDepartamentoText() : "");
    dataGuardar.metaData.seccion3.telefono = (this.tipoSolicitante === 'PJ' ? this.f_s3_rl_Telefono.value : this.f_s3_pn_Telefono.value);
    dataGuardar.metaData.seccion3.celular = (this.tipoSolicitante === 'PJ' ? this.f_s3_rl_Celular.value : this.f_s3_pn_Celular.value);
    dataGuardar.metaData.seccion3.email = (this.tipoSolicitante === 'PJ' ? this.f_s3_rl_Correo.value : this.f_s3_pn_Correo.value);

    //Seccion5
    dataGuardar.metaData.seccion5.declaracion_1 = this.f_declaracion_1.value;
    dataGuardar.metaData.seccion5.declaracion_2 = this.f_declaracion_2.value;

    //Seccion6
    dataGuardar.metaData.seccion6.tipoDocumentoSolicitante = this.f_TipoDocumentoSolicitante.value;
    dataGuardar.metaData.seccion6.documento = this.listaTiposDocumentos.filter(item => item.id == this.codTipoDocSolicitante)[0].documento;
    dataGuardar.metaData.seccion6.numeroDocumentoSolicitante = this.f_NroDocumentoSolicitante.value;
    dataGuardar.metaData.seccion6.nombreSolicitante = this.nombreUsuario;

    console.log(JSON.stringify(dataGuardar), "---Meta");
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
          modalRef.componentInstance.titleModal = "Vista Previa - Formulario 001/16";

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
}
