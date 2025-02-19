/**
 * Formulario 004/17.03 utilizado por los procedimientos DCV-011, DCV-012, DCV-013, DCV-014, DCV-047, DCV-048, DCV-049, DCV-050, DCV-051, DCV-052, DCV-053
 * @author Alicia Toquila Quispe
 * @version 1.0 29.03.2023
 * Modificado 12.06.2023
*/

import { Component, Input, OnInit, Injectable, ViewChild  } from '@angular/core';
import { NgbActiveModal, NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { FormArray, UntypedFormBuilder, FormControl, UntypedFormGroup, RequiredValidator, Validators } from '@angular/forms';
import { DropdownService } from 'src/app/core/models/Formularios/Formulario012_17_3/dropdown.service';
import { NgbDateStruct, NgbDateParserFormatter, NgbDatepickerI18n, NgbAccordionDirective , NgbDateAdapter, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { Formulario012173Service } from 'src/app/core/services/formularios/formulario012-17-3.service';
import { Formulario012_17_3Response } from '../../../domain/formulario012_17_3/formulario012_17_3Response';
import { Formulario012_17_3Request, Seccion1, Seccion2, Seccion3, Seccion4 } from '../../../domain/formulario012_17_3/formulario012_17_3Request';
import { VistaPdfComponent } from 'src/app/shared/components/vista-pdf/vista-pdf.component';
import { VisorPdfArchivosService } from 'src/app/core/services/tramite/visor-pdf-archivos.service';

import { SeguridadService } from 'src/app/core/services/seguridad.service';
import { FormularioTramiteService } from 'src/app/core/services/tramite/formulario-tramite.service';
import { TipoDocumentoSncModel } from 'src/app/core/models/TipoDocumentoSncModel';
import { SncService } from 'src/app/core/services/servicios/snc.service';
import { ExtranjeriaService } from 'src/app/core/services/servicios/extranjeria.service';
import { ReniecService } from 'src/app/core/services/servicios/reniec.service';
import { DatosUsuarioLogin } from 'src/app/core/models/Autenticacion/DatosUsuarioLogin';
import { TranslationWidth } from '@angular/common';

//#region  CONSIGURACION DE FORMATO DE FECHA

@Injectable()
export class CustomDateParserFormatter extends NgbDateParserFormatter {

  readonly DELIMITER = '/';

  parse(value: string): NgbDateStruct | null {
    if (value) {
      let date = value.split(this.DELIMITER);
      return {
        day: parseInt(date[0], 10),
        month: parseInt(date[1], 10),
        year: parseInt(date[2], 10)
      };
    }
    return null;
  }

  format(date: NgbDateStruct | null): string {
    if(date){
      const day = String(date.day).length > 1 ? date.day : "0"+ date.day;
      const month = String(date.month).length > 1 ? date.month : "0"+date.month;
      return date ? day + this.DELIMITER + month + this.DELIMITER + date.year : '';
    }else{
      return "";
    }
  }
}

const I18N_VALUES = {
  'fr': {
    weekdays: ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'],
    months: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Set', 'Oct', 'Nov', 'Dic'],
  }
};

@Injectable()
export class I18n {
  language = 'fr';
}

@Injectable()
export class CustomDatepickerI18n extends NgbDatepickerI18n {

  constructor(private _i18n: I18n) {
    super();
  }

  getWeekdayLabel(weekday: number, width?: TranslationWidth): string {
    return I18N_VALUES[this._i18n.language].weekdays[weekday - 1];
  }
  getWeekdayShortName(weekday: number): string {
    return I18N_VALUES[this._i18n.language].weekdays[weekday - 1];
  }
  getMonthShortName(month: number): string {
    return I18N_VALUES[this._i18n.language].months[month - 1];
  }
  getMonthFullName(month: number): string {
    return this.getMonthShortName(month);
  }

  getDayAriaLabel(date: NgbDateStruct): string {
    return `${date.day}-${date.month}-${date.year}`;
  }
}
//#endregion

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css'],
  providers: [
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter},
    I18n, {provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n} // define custom NgbDatepickerI18n provider
  ]
})

export class FormularioComponent implements OnInit {

  @Input() public dataInput: any;
  graboUsuario: boolean = false;
  uriArchivo: string = '';//PARA SABER EL NOMBRE DEL PDF (COMPLETO CON TODO Y ADJUNTOS)
  errorAlCargarData: boolean = false;//VARIABLE PARA CONTROLAR CUANDO OCURRE UN ERROR AL RECUPERAR LOS DATOS GUARDADOS DEL FORMULARIO
  
  codigoTupa: string = "" ;
  descripcionTupa: String;

  codigoTipoSolicitudTupa: string;  //usado para las validaciones 
  descTipoSolicitudTupa: string;

  tipoCanje:string="";
  
  formulario: UntypedFormGroup;

  idFormularioMovimiento: number = 0;

  tipoDocumentoSolicitante:string;
  nombreTipoDocumentoSolicitante:string;
  numeroDocumentoSolicitante: string;
  nombresApellidosSolicitante:string;

  datosUsuarioLogin: DatosUsuarioLogin;

  @ViewChild('acc') acc: NgbAccordionDirective ;

  tiposServicio:any[];
  tiposCanjeMilitar:any[];
  tiposCanjeDiplomatico:any[];
  tiposCanjeExtranjero:any[];

  tiposModificacion:any[];


  mensajeInicial:string = "";
  ingresarDataManualmente: boolean = false;

  tipoSolicitante:string = "";
  nombreSolicitante:string = "";
  
  listaTiposDocumentos: TipoDocumentoSncModel[] = [
    { id: "01", documento: 'DNI' },
    { id: "04", documento: 'Carnet de extranjería' },
    { id: "05", documento: 'Carnet de solicitante de refugio' },
    { id: "06", documento: 'Carnet de permiso temporal de permanencia' },
    { id: "07", documento: 'Carnet de identidad' },
  ];

  listaEstablecimientosSalud : string[] = ["SANIDAD-PNP","Policlínico Militar Chorrillos","Otro"]
  OtroEstablecimiento : boolean=false;

  fechaRegistro: string = "";
  fechaES: string = "";
  fechaEC: string = "";
  fechaCE: string = "";
  fechaHC: string = "";

  nroDocumentoLogin: string;
  tipoDocumentoLogin: string;
  nroRuc = '';
  razonSocial: string;
  cargoRepresentanteLegal = '';

  activarES: boolean = false;  //Establecimiento de salud
  activarEC: boolean = false;  //Escuela de conductores
  activarCE: boolean = false;  //Evaluación de conocimientos
  activarHC: boolean = false;  //Habilidades en la conducción
  
  activarEquivalencias: boolean = false;

  contactForm = this.fb.group({
    nro_solicitud: this.fb.control(''),
    fecha_registro:this.fb.control(''),
    nro_licencia:this.fb.control(''),
    centro_emision:this.fb.control(''),
    
    tipoDocIdentidad:['', [Validators.required]],
    numeroDocIdentidad:['', [Validators.required, Validators.minLength(3)]],

    nombres: ['', [Validators.required, Validators.minLength(3)]],
    domicilio: this.fb.control('',[Validators.required]),
    correo:['', [Validators.required, Validators.email]],
    distrito:this.fb.control(''),
    provincia:this.fb.control(''),
    region:this.fb.control(''),
    telefono: this.fb.control(''),

    tiposServicio: ['0'],
    tiposCanjeMilitar: ['0'],
    tiposCanjeDiplomatico: ['0'],
    tiposCanjeExtranjero:['0'],
    tiposModificacion:['0'],
    tiposCategoria:['0'],

    nombreES: this.fb.control('',[Validators.required]),
    certificadoES: this.fb.control('',[Validators.maxLength(100)]),
    fechaES: this.fb.control('',[Validators.required]),
    otroEstablecimientoSalud: this.fb.control(''),

    nombreEC: this.fb.control('',[Validators.required]),
    certificadoEC: this.fb.control('',[Validators.required, Validators.maxLength(3)]),
    fechaEC: this.fb.control('',[Validators.required]),

    nombreCE: this.fb.control('',[Validators.required]),
    certificadoCE: this.fb.control('',[Validators.required, Validators.maxLength(3)]),
    fechaCE: this.fb.control('',[Validators.required]),

    nombreHC: this.fb.control('',[Validators.required]),
    notaHC: this.fb.control('',[Validators.required, Validators.maxLength(3)]),
    fechaHC: this.fb.control('',[Validators.required]),

    acepto: this.fb.control(false),
  });

  constructor(    
    public fb:UntypedFormBuilder,
    private modalService: NgbModal,
    private dropdownService:DropdownService,
    private formularioService: Formulario012173Service,
    private SncService: SncService,
    private reniecService: ReniecService,
    private extranjeriaService: ExtranjeriaService,
    private formularioTramiteService: FormularioTramiteService,
    private funcionesMtcService: FuncionesMtcService,
    private visorPdfArchivosService: VisorPdfArchivosService,
    private seguridadService: SeguridadService,
    public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    this.uriArchivo = this.dataInput.rutaDocumento;

    this.tiposServicio = this.dropdownService.getTipoClaseA();
    this.tiposCanjeMilitar = this.dropdownService.getTipoCanjeMilitar();
    this.tiposCanjeExtranjero = this.dropdownService.getTiposCanjeExtranjero();
    this.tiposCanjeDiplomatico = this.dropdownService.getTipoCanjeDiplomatico();
    this.tiposModificacion = this.dropdownService.getTiposModificacion();

    this.recuperarInformacion();
    const tramite: any= JSON.parse(localStorage.getItem('tramite-selected'));
    this.codigoTupa = tramite.codigo;
    this.descripcionTupa = tramite.nombre;
    this.codigoTipoSolicitudTupa = (this.dataInput.tipoSolicitudTupaCod === '' ? '0' : this.dataInput.tipoSolicitudTupaCod);
    this.descTipoSolicitudTupa = this.dataInput.tipoSolicitudTupaDesc;

    this.nroRuc = this.seguridadService.getCompanyCode();
    this.razonSocial = this.seguridadService.getUserName();       // nombre de usuario login
    const tipoDocumento = this.seguridadService.getNameId();   // tipo de documento usuario login
    this.nroDocumentoLogin = this.seguridadService.getNumDoc();    // nro de documento usuario login
    this.datosUsuarioLogin = this.seguridadService.getDatosUsuarioLogin(); // Datos personales del usuario

    switch (tipoDocumento) {
      case '00001': this.tipoSolicitante = 'PN';
                    this.tipoDocumentoLogin="01"; 
                    this.tipoDocumentoSolicitante = "01";
                    this.nombreTipoDocumentoSolicitante = "DNI";
                    this.numeroDocumentoSolicitante = this.datosUsuarioLogin.nroDocumento;
                    this.nombresApellidosSolicitante = this.datosUsuarioLogin.nombres + ' ' + this.datosUsuarioLogin.apePaterno + ' ' + this.datosUsuarioLogin.apePaterno;
                    break;
      case '00004' :this.tipoSolicitante = 'PE'; // persona extranjera
                    this.tipoDocumentoLogin="04"; 
                    this.nombreSolicitante = this.seguridadService.getUserName();
            
                        switch(this.seguridadService.getTipoDocumento()){
                          case "00003": this.tipoDocumentoSolicitante = "04";
                                        this.nombreTipoDocumentoSolicitante = "CE";
                                        this.numeroDocumentoSolicitante = this.nroDocumentoLogin;
                                        this.contactForm.controls['tipoDocIdentidad'].setValue('04');
                                        this.tipoDocumentoLogin="04"; 
                                        break;
                          case "00101": this.tipoDocumentoSolicitante = "05";
                                        this.nombreTipoDocumentoSolicitante = "CARNÉ SOLICITANTE DE REFUGIO";
                                        this.numeroDocumentoSolicitante = this.nroDocumentoLogin;
                                        this.contactForm.controls['tipoDocIdentidad'].setValue('05');
                                        this.tipoDocumentoLogin="05"; 
                                        break;
                          case "00102": this.tipoDocumentoSolicitante = "06";
                                        this.nombreTipoDocumentoSolicitante = "CARNÉ DE PERMISO TEMPORAL DE PERMANENCIA";
                                        this.numeroDocumentoSolicitante = this.nroDocumentoLogin;
                                        this.contactForm.controls['tipoDocIdentidad'].setValue('06');
                                        this.tipoDocumentoLogin="06"; 
                                        break;
                          case "00103": this.tipoDocumentoSolicitante = "07";
                                        this.nombreTipoDocumentoSolicitante = "CARNÉ DE IDENTIFICACION";
                                        this.numeroDocumentoSolicitante = this.nroDocumentoLogin;
                                        this.contactForm.controls['tipoDocIdentidad'].setValue('07');
                                        this.tipoDocumentoLogin="07"; 
                                        break;
                        }
                        break;
        
      case '00005': break;
      case '00002': break;
    }

    if(this.codigoTupa==="DCV-045") {  
      this.tipoCanje = "2";
      this.mensajeInicial= `Para iniciar el trámite correspondiente, debe haber cumplido con los requisitos establecidos por la Dirección de Circulación Vial`;
      
      this.contactForm.controls.nombreEC.clearValidators();
      this.contactForm.controls.certificadoEC.clearValidators();
      this.contactForm.controls.fechaEC.clearValidators();

      this.contactForm.controls.nombreCE.clearValidators();
      this.contactForm.controls.certificadoCE.clearValidators();
      this.contactForm.controls.fechaCE.clearValidators();
      
      this.contactForm.controls.nombreHC.clearValidators();
      this.contactForm.controls.notaHC.clearValidators();
      this.contactForm.controls.fechaHC.clearValidators();


      this.contactForm.controls.nombreEC.updateValueAndValidity();
      this.contactForm.controls.certificadoEC.updateValueAndValidity();
      this.contactForm.controls.fechaEC.updateValueAndValidity();
      
      this.contactForm.controls.nombreCE.updateValueAndValidity();
      this.contactForm.controls.certificadoCE.updateValueAndValidity();
      this.contactForm.controls.fechaCE.updateValueAndValidity();

      this.contactForm.controls.nombreHC.updateValueAndValidity();
      this.contactForm.controls.notaHC.updateValueAndValidity();
      this.contactForm.controls.fechaHC.updateValueAndValidity();

      this.activarES=true;
      this.activarEC=false;
      this.activarCE=false;
      this.activarHC=false;
      this.cargarDatos();
    }
    
    if(this.codigoTupa==="DCV-046") {
      this.tipoCanje = "4";
      this.mensajeInicial= `Para iniciar el trámite correspondiente, debe haber cumplido con los requisitos establecidos por la Dirección de Circulación Vial`;

      this.contactForm.controls.nombreEC.clearValidators();
      this.contactForm.controls.certificadoEC.clearValidators();
      this.contactForm.controls.fechaEC.clearValidators();

      this.contactForm.controls.nombreEC.updateValueAndValidity();
      this.contactForm.controls.certificadoEC.updateValueAndValidity();
      this.contactForm.controls.fechaEC.updateValueAndValidity();

      this.activarES=true;
      this.activarEC=true;
      this.activarCE=true;
      this.activarHC=true;

      this.cargarDatos();
    }

    if(this.codigoTupa==="DCV-051") {
      this.tipoCanje = "1";
      this.mensajeInicial= `Para iniciar el Trámite Correspondiente, debe haber cumplido con los requisitos establecidos por la Dirección de Circulación Vial`;

      this.contactForm.controls.nombreEC.clearValidators();
      this.contactForm.controls.certificadoEC.clearValidators();
      this.contactForm.controls.fechaEC.clearValidators();
      
      this.contactForm.controls.nombreCE.clearValidators();
      this.contactForm.controls.certificadoCE.clearValidators();
      this.contactForm.controls.fechaCE.clearValidators();

      this.contactForm.controls.nombreHC.clearValidators();
      this.contactForm.controls.notaHC.clearValidators();
      this.contactForm.controls.fechaHC.clearValidators();

      this.contactForm.controls.nombreEC.updateValueAndValidity();
      this.contactForm.controls.certificadoEC.updateValueAndValidity();
      this.contactForm.controls.fechaEC.updateValueAndValidity();
      
      this.contactForm.controls.nombreCE.updateValueAndValidity();
      this.contactForm.controls.certificadoCE.updateValueAndValidity();
      this.contactForm.controls.fechaCE.updateValueAndValidity();

      this.contactForm.controls.nombreHC.updateValueAndValidity();
      this.contactForm.controls.notaHC.updateValueAndValidity();
      this.contactForm.controls.fechaHC.updateValueAndValidity();

      this.activarES=true;
      this.activarEC=false;

      if(this.codigoTipoSolicitudTupa=="1" || this.codigoTipoSolicitudTupa=="2"){
        this.activarCE=true; //artivar centro de evaluación
        this.activarEquivalencias = false;
      }
      else{
        this.activarCE=false;
        this.activarEquivalencias = true;
      }
      
      this.activarHC=false;

      this.cargarDatos();
    }

    if(this.codigoTupa==="S-DCV-002") {
      this.tipoCanje = "3";
      this.activarES=true;
      this.activarEC=true;
      this.activarCE=true;
      this.activarHC=true;
      this.cargarDatos();
    }

    if(this.codigoTupa==="DCV-047") {
      this.tipoCanje = "3";

      this.contactForm.controls.nombreES.clearValidators();
      this.contactForm.controls.certificadoES.clearValidators();
      this.contactForm.controls.fechaES.clearValidators();

      this.contactForm.controls.nombreEC.clearValidators();
      this.contactForm.controls.certificadoEC.clearValidators();
      this.contactForm.controls.fechaEC.clearValidators();
     
      this.contactForm.controls.nombreCE.clearValidators();
      this.contactForm.controls.certificadoCE.clearValidators();
      this.contactForm.controls.fechaCE.clearValidators();
      
      this.contactForm.controls.nombreHC.clearValidators();
      this.contactForm.controls.notaHC.clearValidators();
      this.contactForm.controls.fechaHC.clearValidators();

      this.contactForm.controls.nombreES.updateValueAndValidity();
      this.contactForm.controls.certificadoES.updateValueAndValidity();
      this.contactForm.controls.fechaES.updateValueAndValidity();

      this.contactForm.controls.nombreEC.updateValueAndValidity();
      this.contactForm.controls.certificadoEC.updateValueAndValidity();
      this.contactForm.controls.fechaEC.updateValueAndValidity();

      this.contactForm.controls.nombreCE.updateValueAndValidity();
      this.contactForm.controls.certificadoCE.updateValueAndValidity();
      this.contactForm.controls.fechaCE.updateValueAndValidity();

      this.contactForm.controls.nombreHC.updateValueAndValidity();
      this.contactForm.controls.notaHC.updateValueAndValidity();
      this.contactForm.controls.fechaHC.updateValueAndValidity();

      this.activarES=false;
      this.activarEC=false;
      this.activarCE=false;
      this.activarHC=false;
      this.cargarDatos();
    }

    if(this.codigoTupa==="DCV-048") {
      this.tipoCanje = "3";
      
      this.contactForm.controls.nombreES.clearValidators();
      this.contactForm.controls.certificadoES.clearValidators();
      this.contactForm.controls.fechaES.clearValidators();

      this.contactForm.controls.nombreEC.clearValidators();
      this.contactForm.controls.certificadoEC.clearValidators();
      this.contactForm.controls.fechaEC.clearValidators();
     
      this.contactForm.controls.nombreCE.clearValidators();
      this.contactForm.controls.certificadoCE.clearValidators();
      this.contactForm.controls.fechaCE.clearValidators();
      
      this.contactForm.controls.nombreHC.clearValidators();
      this.contactForm.controls.notaHC.clearValidators();
      this.contactForm.controls.fechaHC.clearValidators();

      this.contactForm.controls.nombreES.updateValueAndValidity();
      this.contactForm.controls.certificadoES.updateValueAndValidity();
      this.contactForm.controls.fechaES.updateValueAndValidity();

      this.contactForm.controls.nombreEC.updateValueAndValidity();
      this.contactForm.controls.certificadoEC.updateValueAndValidity();
      this.contactForm.controls.fechaEC.updateValueAndValidity();

      this.contactForm.controls.nombreCE.updateValueAndValidity();
      this.contactForm.controls.certificadoCE.updateValueAndValidity();
      this.contactForm.controls.fechaCE.updateValueAndValidity();

      this.contactForm.controls.nombreHC.updateValueAndValidity();
      this.contactForm.controls.notaHC.updateValueAndValidity();
      this.contactForm.controls.fechaHC.updateValueAndValidity();

      this.activarES=true;
      this.activarEC=false;
      this.activarCE=true;
      this.activarHC=true;
      this.cargarDatos();
    }

    if(this.codigoTupa==="DCV-049") {
      this.tipoCanje = "3";
      this.activarES=true;
      this.activarEC=true;
      this.activarCE=true;
      this.activarHC=true;
      this.cargarDatos();
    }

    if(this.codigoTupa==="DCV-050") {
      this.tipoCanje = "3";
      this.activarES=true;
      this.activarEC=true;
      this.activarCE=true;
      this.activarHC=true;
      this.cargarDatos();
    }

    if(this.codigoTupa==="DCV-052") {
      this.mensajeInicial= `Se debe tener en cuenta que, de acuerdo con el artículo N° 51 del Decreto Supremo N° 021-2008- MTC, el solicitante de la autorización deberá contar con secundaria completa, como mínimo`;
      this.tipoCanje = "3";

      this.contactForm.controls.nombreCE.clearValidators();
      this.contactForm.controls.certificadoCE.clearValidators();
      this.contactForm.controls.fechaCE.clearValidators();
      
      this.contactForm.controls.nombreHC.clearValidators();
      this.contactForm.controls.notaHC.clearValidators();
      this.contactForm.controls.fechaHC.clearValidators();


      this.contactForm.controls.nombreCE.updateValueAndValidity();
      this.contactForm.controls.certificadoCE.updateValueAndValidity();
      this.contactForm.controls.fechaCE.updateValueAndValidity();

      this.contactForm.controls.nombreHC.updateValueAndValidity();
      this.contactForm.controls.notaHC.updateValueAndValidity();
      this.contactForm.controls.fechaHC.updateValueAndValidity();

      this.activarES=true;
      this.activarEC=true;
      this.activarCE=false;
      this.activarHC=false;
      this.cargarDatos();
    }

    if(this.codigoTupa==="DCV-053") {
      this.mensajeInicial="";
      this.tipoCanje = "3";

      this.contactForm.controls.nombreCE.clearValidators();
      this.contactForm.controls.certificadoCE.clearValidators();
      this.contactForm.controls.fechaCE.clearValidators();
      
      this.contactForm.controls.nombreHC.clearValidators();
      this.contactForm.controls.notaHC.clearValidators();
      this.contactForm.controls.fechaHC.clearValidators();

      this.contactForm.controls.nombreCE.updateValueAndValidity();
      this.contactForm.controls.certificadoCE.updateValueAndValidity();
      this.contactForm.controls.fechaCE.updateValueAndValidity();

      this.contactForm.controls.nombreHC.updateValueAndValidity();
      this.contactForm.controls.notaHC.updateValueAndValidity();
      this.contactForm.controls.fechaHC.updateValueAndValidity();

      this.activarES=true;
      this.activarEC=true;
      this.activarCE=false;
      this.activarHC=false;
      this.cargarDatos();
    }

    //this.contactForm.get("tiposCanje").setValue(this.tipoCanje);
  }

  isValidField(name: string): boolean {
    const fieldName = this.contactForm.get(name);
    return fieldName.invalid && fieldName.touched;
  }

  changeTipoDocumento() {
    this.contactForm.controls['numeroDocIdentidad'].setValue('');
    this.inputNumeroDocumento();
  }

  inputNumeroDocumento(event = undefined) {
    if (event)
      event.target.value = event.target.value.replace(/[^0-9]/g, '');
      this.limpiarDatos();
      this.deshabilitarCampos();
  }

  getMaxLengthNumeroDocumento() {
    const tipoDocumento: string = this.contactForm.controls['tipoDocIdentidad'].value.trim();

    if (tipoDocumento === '01')//DNI
      return 8;
    else if (tipoDocumento === '02')//RUC
      return 11;
    return 0
  }

  addTripulacion(nombres: string, apellidos: string, direccion:string, ubigeo:string) {
      this.contactForm.controls['nombres'].setValue( nombres+' '+apellidos);
      this.contactForm.controls['domicilio'].setValue(direccion);
      
      let toarray=ubigeo.split("/");
      
      this.contactForm.controls['distrito'].setValue(toarray[2]);
      this.contactForm.controls['provincia'].setValue(toarray[1]);
      this.contactForm.controls['region'].setValue(toarray[0]);
    }

  addTripulacion1(nombres: string, apellidos: string) {
    this.contactForm.controls['nombres'].setValue( nombres+' '+apellidos);
  }

  habilitarCampos(): void{
    this.ingresarDataManualmente = true;
    this.contactForm.controls['nro_solicitud'].enable();
    this.contactForm.controls['fecha_registro'].enable();
    this.contactForm.controls['nro_licencia'].enable();
    this.contactForm.controls['centro_emision'].enable();
    this.contactForm.controls['nombres'].enable();
    this.contactForm.controls['domicilio'].enable();
    this.contactForm.controls['distrito'].enable();
    this.contactForm.controls['provincia'].enable();
    this.contactForm.controls['region'].enable();
  }

  deshabilitarCampos(): void{
    this.ingresarDataManualmente = false;
    this.contactForm.controls['tipoDocIdentidad'].disable();
    this.contactForm.controls['numeroDocIdentidad'].disable();
    this.contactForm.controls['nro_solicitud'].disable();
    this.contactForm.controls['fecha_registro'].disable();
    this.contactForm.controls['nro_licencia'].disable();
    this.contactForm.controls['centro_emision'].disable();
    this.contactForm.controls['nombres'].disable();
    this.contactForm.controls['domicilio'].disable();
    this.contactForm.controls['distrito'].disable();
    this.contactForm.controls['provincia'].disable();
    this.contactForm.controls['region'].disable();
  }

  cargarDatos(){
    const tipoDocumento: string = this.tipoDocumentoLogin;
    const numeroDocumento: string = this.nroDocumentoLogin;
    this.funcionesMtcService.mostrarCargando();
    this.limpiarDatos();

    this.contactForm.get("tiposServicio").setValue(this.codigoTipoSolicitudTupa=="1" || this.codigoTipoSolicitudTupa=="3" ? "1":"2"); 

    if(this.codigoTipoSolicitudTupa == "0")
    this.contactForm.get("tiposServicio").enable();
    else
    this.contactForm.get("tiposServicio").disable();

    //if(this.codigoTupa==="S-DCV-002" || this.codigoTupa==="DCV-045" || this.codigoTupa==="DCV-046" || this.codigoTupa==="DCV-051") {

      if (tipoDocumento === '01') {//DNI

        this.contactForm.get("tipoDocIdentidad").setValue("01");
        this.contactForm.get("numeroDocIdentidad").setValue(numeroDocumento);
        this.funcionesMtcService.ocultarCargando();
        this.deshabilitarCampos();
        let direccion:string = this.datosUsuarioLogin.departamento.trim() + "/" + this.datosUsuarioLogin.provincia.trim() + "/" + this.datosUsuarioLogin.distrito.trim();
        this.addTripulacion(this.datosUsuarioLogin.nombres, this.datosUsuarioLogin.apePaterno.trim()+' '+this.datosUsuarioLogin.apeMaterno.trim(), this.datosUsuarioLogin.direccion.trim(), direccion);
        if(this.datosUsuarioLogin.telefono.trim()!="")
            this.contactForm.controls['telefono'].setValue(this.datosUsuarioLogin.telefono.trim() + " / " + this.datosUsuarioLogin.celular.trim());
            else
            this.contactForm.controls['telefono'].setValue(this.datosUsuarioLogin.celular.trim());
        this.contactForm.controls['correo'].setValue(this.datosUsuarioLogin.correo.trim());

      } else if (tipoDocumento === '04' || tipoDocumento === '05' || tipoDocumento === '06' || tipoDocumento === '07' ) {//CARNÉ DE EXTRANJERÍA
        this.funcionesMtcService.ocultarCargando();

        this.contactForm.get("tipoDocIdentidad").setValue(tipoDocumento);
        this.contactForm.get("numeroDocIdentidad").setValue(this.numeroDocumentoSolicitante);
        
        this.contactForm.controls["nombres"].setValue(this.datosUsuarioLogin.nombres + " " + this.datosUsuarioLogin.apePaterno.trim() +" "+ this.datosUsuarioLogin.apeMaterno.trim());
        this.contactForm.controls["domicilio"].setValue(this.datosUsuarioLogin.direccion.trim());
        this.contactForm.controls["region"].setValue(this.datosUsuarioLogin.departamento.trim());
        this.contactForm.controls["provincia"].setValue(this.datosUsuarioLogin.provincia.trim());
        this.contactForm.controls["distrito"].setValue(this.datosUsuarioLogin.distrito.trim());
       
        if(this.datosUsuarioLogin.telefono.trim()!="")
            this.contactForm.controls['telefono'].setValue(this.datosUsuarioLogin.telefono.trim() + " / " + this.datosUsuarioLogin.celular.trim());
            else
            this.contactForm.controls['telefono'].setValue(this.datosUsuarioLogin.celular.trim());
        //this.contactForm.controls['celular'].setValue(this.datosUsuarioLogin.celular.trim());
        this.contactForm.controls['correo'].setValue(this.datosUsuarioLogin.correo.trim());

        this.contactForm.get("tipoDocIdentidad").disable();
        this.contactForm.get("numeroDocIdentidad").disable();
      }
    //}
  }

  limpiarDatos(){
    this.contactForm.get("nro_solicitud").setValue("");
    this.contactForm.get("fecha_registro").setValue("");
    this.contactForm.get("centro_emision").setValue("");
    this.contactForm.get("nro_licencia").setValue("");

    this.contactForm.get("nombres").setValue("");  
    this.contactForm.get("domicilio").setValue("");
    this.contactForm.get("correo").setValue("");
    this.contactForm.get("distrito").setValue("");
    this.contactForm.get("provincia").setValue("");
    this.contactForm.get("region").setValue("");
    this.contactForm.get("telefono").setValue("");

    this.contactForm.get("tiposServicio").setValue("0");
    this.contactForm.get("tiposCanjeMilitar").setValue("0");
    this.contactForm.get("tiposCanjeExtranjero").setValue("0");
    this.contactForm.get("tiposCanjeDiplomatico").setValue("0");
    this.contactForm.get("tiposModificacion").setValue("0");

    this.contactForm.get("nombreES").setValue("");
    this.contactForm.get("certificadoES").setValue("");
    this.contactForm.get("fechaES").setValue("");
    this.contactForm.get("nombreEC").setValue("");
    this.contactForm.get("certificadoEC").setValue("");
    this.contactForm.get("fechaEC").setValue("");
    this.contactForm.get("nombreCE").setValue("");
    this.contactForm.get("certificadoCE").setValue("");
    this.contactForm.get("fechaCE").setValue("");
    this.contactForm.get("nombreHC").setValue("");
    this.contactForm.get("notaHC").setValue("");
    this.contactForm.get("fechaHC").setValue("");

    this.fechaRegistro = "";
    this.fechaES = "";
    this.fechaEC = "";
    this.fechaCE = "";
    this.fechaHC = "";
  }

  onSelectFechaRegistro(event): void {
    let year = event.year.toString();
    let month = ('0'+event.month).slice(-2);
    let day = ('0'+event.day).slice(-2);
    this.fechaRegistro = day + "/" + month + "/" + year;
  }

  onSelectFechaES(event): void {
    let year = event.year.toString();
    let month = ('0'+event.month).slice(-2);
    let day = ('0'+event.day).slice(-2);
    this.fechaES = day + "/" + month + "/" + year;
  }

  onSelectFechaEC(event): void {
    let year = event.year.toString();
    let month = ('0'+event.month).slice(-2);
    let day = ('0'+event.day).slice(-2);
    this.fechaEC = day + "/" + month + "/" + year;
  }

  onSelectFechaCE(event): void {
    let year = event.year.toString();
    let month = ('0'+event.month).slice(-2);
    let day = ('0'+event.day).slice(-2);
    this.fechaCE = day + "/" + month + "/" + year;
  }

  onSelectFechaHC(event): void {
    let year = event.year.toString();
    let month = ('0'+event.month).slice(-2);
    let day = ('0'+event.day).slice(-2);
    this.fechaHC = day + "/" + month + "/" + year;
  }

  onChangeCanje(){
    this.contactForm.controls['tiposCanje'].setValue(this.tipoCanje);
    this.funcionesMtcService.mensajeError('No se puede modificar esta opción.');
  }

  onChangeLicencia(){
    this.contactForm.controls['tiposCanje'].setValue(this.tipoCanje);
    this.funcionesMtcService.mensajeError('No se puede modificar esta opción.');
  }

  onChangeEstablecimientoSalud(event): void{
    if(this.contactForm.controls.nombreES.value=="Otro")
      this.OtroEstablecimiento=true;
    else
      this.OtroEstablecimiento=false;
    
  }

  onEquivalencias(flag:string){
    let eqEspana = "<div><b>Equivalencias España - Perú</b></div>";
    eqEspana += "<div><table class='table table-striped' width='98%' align='center'>";
    eqEspana += "<tr><td>B,B1</td><td align='left'>A-I</td></tr>";
    eqEspana += "<tr><td>C,C1</td><td align='left'>A-IIb</td></tr>";
    eqEspana += "<tr><td>BTP</td><td align='left'>A-IIa</td></tr>";
    eqEspana += "<tr><td>D, D1</td><td align='left'>A-IIIa</td></tr>";
    eqEspana += "<tr><td>CE, C1E</td><td align='left'>A-IIIb</td></tr>";
    eqEspana += "<tr><td colspan='2'>Todas las categorías vigentes son igual a una A-IIIc</td></tr>";
    eqEspana += "</table></div>";

    let eqChile = "<div><b>Equivalencias Chile - Perú</b></div>";
    eqChile += "<div><table class='table table-striped' width='98%' align='center'>";
    eqChile += "<tr><td align='center'>B</td><td align='left'>AI</td></tr>";
    eqChile += "<tr><td align='center'>A1</td><td align='left'>AIIa</td></tr>";
    eqChile += "<tr><td align='center'>A2</td><td align='left'>AIIa</td></tr>";
    eqChile += "<tr><td align='center'>A3</td><td align='left'>AIIa</td></tr>";
    eqChile += "<tr><td align='center'>A4</td><td align='left'>AIIb</td></tr>";
    eqChile += "<tr><td align='center'>A5</td><td align='left'>AIIIb</td></tr>";
    eqChile += "<tr><td align='center'>A3 + A5</td><td align='left'>AIIIc</td></tr>";
    eqChile += "</table></div>";

    let eqBolivia = "<div><b>Equivalencias Bolivia - Perú</b></div>";
    eqBolivia += "<div><table class='table table-striped' width='98%' align='center'>";
    eqBolivia += "<tr><td>Particular P</td><td align='left'>AI</td></tr>";
    eqBolivia += "<tr><td>Profesional A</td><td align='left'>AIIa</td></tr>";
    eqBolivia += "<tr><td>Profesional B</td><td align='left'>AIIb</td></tr>";
    eqBolivia += "<tr><td>Profesional C</td><td align='left'>AIIIc</td></tr>";
    eqBolivia += "</table></div>";

    let eqCorea = "<div><b>Equivalencias Corea - Perú</b></div>";
    eqCorea += "<div><table class='table table-striped' width='100%' align='center'>";
    eqCorea += "<tr><td width='80%' align='left'>Licencia de Conducir Especial de Primera Clase</td><td rowspan='4'>Licencia de conducir de la Clase A Categoria I</td></tr>";
    eqCorea += "<tr><td align='left'>Licencia de Conducir Grande de Primera Clase</td></tr>";
    eqCorea += "<tr><td align='left'>Licencia de Conducir Ordinaria de Primera Clase</td></tr>";
    eqCorea += "<tr><td align='left'>Licencia de Conducir Ordinaria de Segunda Clase</td></tr>";
    eqCorea += "</table></div>";

    let eqColombia = "<div><b>Equivalencias Colombia - Perú</b></div>";
    eqColombia += "<div><table class='table table-striped' width='100%' align='center'>";
    eqColombia += "<tr><td width='50%' align='center'>B1</td><td>A-I</td></tr>";
    eqColombia += "<tr><td align='center'>C1</td><td>AII-a</td></tr>";
    eqColombia += "<tr><td align='center'>B2-C2</td><td>AII-b</td></tr>";
    eqColombia += "<tr><td align='center'>B3-C3</td><td>AIII-c</td></tr>";
    eqColombia += "</table></div>";

    switch(flag){
      case "espana": this.funcionesMtcService.mensajeHtml(eqEspana); break;
      case "chile": this.funcionesMtcService.mensajeHtml(eqChile); break;
      case "bolivia": this.funcionesMtcService.mensajeHtml(eqBolivia); break;
      case "corea": this.funcionesMtcService.mensajeHtml(eqCorea); break;
      case "colombia": this.funcionesMtcService.mensajeHtml(eqColombia); break;
    }
  }

  guardarFormulario() {
  if(this.contactForm.controls['tiposServicio'].value == null || this.contactForm.controls['tiposServicio'].value < 1)
    return this.funcionesMtcService.mensajeError("No ha seleccionado un tipo de licencia A.");
  /*if(this.contactForm.controls['tiposCanjeMilitar'].value == null || this.contactForm.controls['tiposCanjeMilitar'].value < 1)
    return this.funcionesMtcService.mensajeError("No ha seleccionado una licencia de conducir");*/
  if(this.codigoTupa=="DCV-051"){
    if(this.contactForm.controls['tiposCanjeExtranjero'].value==0)
    return this.funcionesMtcService.mensajeError("No ha seleccionado el procedimiento de solicitar (Seccion III)");
  }

  let dataGuardar = {
    id: this.idFormularioMovimiento,
    tramiteReqId: this.dataInput.tramiteReqId,
    codigo: "17",
    formularioId: 6,
    codUsuario: "USUARIO",
    estado: 1,
    metaData: {
      seccion1: {
        nro_solicitud : '',
        fecha_registro : '',
        nro_licencia : '',
        centro_emision : '',

        tipoDocIdentidad :  this.contactForm.controls['tipoDocIdentidad'].value,
        numeroDocIdentidad :  this.contactForm.controls['numeroDocIdentidad'].value,
        nombres : this.contactForm.controls['nombres'].value,
        domicilio : this.contactForm.controls['domicilio'].value,
        correo : this.contactForm.controls['correo'].value ,
        distrito :  this.contactForm.controls['distrito'].value ,
        provincia : this.contactForm.controls['provincia'].value ,
        region : this.contactForm.controls['region'].value ,
        telefono :  this.contactForm.controls['telefono'].value,
        licenciaTipoA: this.contactForm.controls['tiposServicio'].value,
      },
      seccion2: {
        canjeMilitar :  this.contactForm.controls['tiposCanjeMilitar'].value,
        canjeExtranjero :  this.contactForm.controls['tiposCanjeExtranjero'].value,
        canjeDiplomatico :  this.contactForm.controls['tiposCanjeDiplomatico'].value,
        modificacion : this.contactForm.controls['tiposModificacion'].value,
        codigoProcedimiento: this.codigoTupa,
        categoria : (this.codigoTupa == "DCV-049" || this.codigoTupa == "DCV-050" || this.codigoTupa == "DCV-051") ? this.contactForm.controls['tiposCategoria'].value : "",
      },
      seccion3: {   
        nombreES : (this.contactForm.controls['nombreES'].value=="Otro"?this.contactForm.controls['otroEstablecimientoSalud'].value: this.contactForm.controls['nombreES'].value),
        certificadoES :  this.contactForm.controls['certificadoES'].value,
        fechaES :  this.fechaES,
        nombreEC : this.contactForm.controls['nombreEC'].value,
        certificadoEC : this.contactForm.controls['certificadoEC'].value,
        fechaEC :  this.fechaEC,
        nombreCE : this.contactForm.controls['nombreCE'].value,
        certificadoCE :this.contactForm.controls['certificadoCE'].value,
        fechaCE :  this.fechaCE,
        nombreHC : this.contactForm.controls['nombreHC'].value,
        notaHC :this.contactForm.controls['notaHC'].value,
        fechaHC :  this.fechaHC,
      },
      seccion4: {
        acepto : this.contactForm.controls['acepto'].value,
        tipoDocumentoSolicitante:this.tipoDocumentoLogin,
        nombreTipoDocumentoSolicitante:this.nombreTipoDocumentoSolicitante,
        numeroDocumentoSolicitante: this.numeroDocumentoSolicitante,
        nombresApellidosSolicitante: this.nombresApellidosSolicitante
      }
    }
  }
  console.log(JSON.stringify(dataGuardar));
  this.funcionesMtcService.mensajeConfirmar(`¿Está seguro de ${this.idFormularioMovimiento === 0 ? 'guardar' : 'modificar'} los datos ingresados?`)
    .then(() => {
      this.funcionesMtcService.mostrarCargando();

      if (this.idFormularioMovimiento === 0) {
        //GUARDAR:
        this.formularioService.post<any>(dataGuardar).subscribe(
          data => {
            this.funcionesMtcService.ocultarCargando();
            this.idFormularioMovimiento = data.id;
            this.uriArchivo = data.uriArchivo;
            this.graboUsuario = true;
            this.funcionesMtcService.mensajeOk(`Los datos fueron guardados exitosamente`);
          },
          error => {
            this.funcionesMtcService.ocultarCargando().mensajeError('Problemas para realizar el guardado de datos');
          }
        );
      } else {
        //MODIFICAR
        this.formularioService.put<any>(dataGuardar).subscribe(
          data => {
            this.funcionesMtcService.ocultarCargando();
            this.idFormularioMovimiento = data.id;
            this.uriArchivo = data.uriArchivo;
            this.graboUsuario = true;
            this.funcionesMtcService.mensajeOk(`Los datos fueron modificados exitosamente`);
          },
          error => {
            this.funcionesMtcService.ocultarCargando().mensajeError('Problemas para realizar la modificación de datos');
          }
        );
      }
    });
  }

  descargarPdf() {
    if (this.idFormularioMovimiento === 0)
      return this.funcionesMtcService.mensajeError('Debe guardar previamente los datos ingresados');

    this.funcionesMtcService.mostrarCargando();

    this.visorPdfArchivosService.get(this.uriArchivo)
      .subscribe(
        (file: Blob) => {
          this.funcionesMtcService.ocultarCargando();

          const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
          const urlPdf = URL.createObjectURL(file);
          modalRef.componentInstance.pdfUrl = urlPdf;
          modalRef.componentInstance.titleModal = "Vista Previa - Formulario 012/17.03";
        },
        error => {
          this.funcionesMtcService
            .ocultarCargando()
            .mensajeError('Problemas para descargar Pdf');
        }
      );
  }

  recuperarInformacion(){
    //si existe el documento
    if (this.dataInput.movId) {
      //RECUPERAMOS LOS DATOS DEL FORMULARIO
      this.formularioTramiteService.get<any>(this.dataInput.tramiteReqId).subscribe(
        (dataFormulario: Formulario012_17_3Response) => {
          this.habilitarCampos();
          const metaData: any = JSON.parse(dataFormulario.metaData);

          this.idFormularioMovimiento = dataFormulario.formularioId;

          this.contactForm.get("nombres").setValue(metaData.seccion1.nombres);
          this.contactForm.get("domicilio").setValue(metaData.seccion1.domicilio);
          this.contactForm.get("distrito").setValue(metaData.seccion1.distrito);
          this.contactForm.get("provincia").setValue(metaData.seccion1.provincia);
          this.contactForm.get("region").setValue(metaData.seccion1.region);
          this.contactForm.get("tipoDocIdentidad").setValue(metaData.seccion1.tipoDocIdentidad);
          this.contactForm.get("numeroDocIdentidad").setValue(metaData.seccion1.numeroDocIdentidad);
          this.contactForm.get("correo").setValue(metaData.seccion1.correo);
          this.contactForm.get("telefono").setValue(metaData.seccion1.telefono);

          this.contactForm.get("tiposServicio").setValue(metaData.seccion1.licenciaTipoA);
          this.contactForm.get("tiposCanjeMilitar").setValue(metaData.seccion2.canjeMilitar);
          this.contactForm.get("tiposCanjeDiplomatico").setValue(metaData.seccion2.canjeDiplomatico);
          this.contactForm.get("tiposCanjeExtranjero").setValue(metaData.seccion2.canjeExtranjero);
          this.contactForm.get("tiposModificacion").setValue(metaData.seccion2.modificacion);

          if(this.codigoTupa=="DCV-045"){
            if(metaData.seccion3.nombreES=="SANIDAD-PNP" || metaData.seccion3.nombreES=="Policlínico Militar Chorrillos") { //"SANIDAD-PNP","Policlínico Militar Chorrillos","Otro"
              this.OtroEstablecimiento=false;  
              this.contactForm.get("nombreES").setValue(metaData.seccion3.nombreES);
            }else{ 
              this.OtroEstablecimiento=true;
              this.contactForm.get("nombreES").setValue("Otro");
              this.contactForm.get("otroEstablecimientoSalud").setValue(metaData.seccion3.nombreES);
            }
          }else{
            this.OtroEstablecimiento=false;  
            this.contactForm.get("nombreES").setValue(metaData.seccion3.nombreES);
          }

          this.contactForm.get("certificadoES").setValue(metaData.seccion3.certificadoES);
          this.fechaES = metaData.seccion3.fechaES;
          this.setDateValue("fechaES", metaData.seccion3.fechaES);

          this.contactForm.get("nombreEC").setValue(metaData.seccion3.nombreEC);
          this.contactForm.get("certificadoEC").setValue(metaData.seccion3.certificadoEC);
          this.fechaEC = metaData.seccion3.fechaEC;
          this.setDateValue("fechaEC", metaData.seccion3.fechaEC);

          this.contactForm.get("nombreCE").setValue(metaData.seccion3.nombreCE);
          this.contactForm.get("certificadoCE").setValue(metaData.seccion3.certificadoCE);
          this.fechaCE = metaData.seccion3.fechaCE;
          this.setDateValue("fechaCE", metaData.seccion3.fechaCE);

          this.contactForm.get("nombreHC").setValue(metaData.seccion3.nombreHC);
          this.contactForm.get("notaHC").setValue(metaData.seccion3.notaHC);
          this.fechaHC = metaData.seccion3.fechaHC;
          this.setDateValue("fechaHC", metaData.seccion3.fechaHC);

          this.contactForm.get("acepto").setValue(metaData.seccion4.acepto);

          this.contactForm.get("nombres").disable();  
          this.contactForm.get("domicilio").disable(); 
          
          this.contactForm.get("distrito").disable(); 
          this.contactForm.get("provincia").disable(); 
          this.contactForm.get("region").disable(); 
          
        },
        (error) => {
          this.errorAlCargarData = true;
          this.funcionesMtcService.ocultarCargando().mensajeError('Problemas para recuperar los datos guardados del anexo');
        });
    }
  }

  setDateValue(control:string, date:string) : string {
    const fecha = date.trim().substring(0,10);
    const fec = fecha.split("/");
    this.contactForm.controls[control].setValue({ 
      day: parseInt(fec[0]),
      month: parseInt(fec[1]),
      year: parseInt(fec[2])
    });
    return fecha;
  }

  dateFormatString(date:string) : string {
    const fecha = date.trim();
    const fec = fecha.substring(0,10);
    return fec;
  }

}
