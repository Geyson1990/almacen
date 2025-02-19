import { Component, OnInit, Injectable, ViewChild,  Input } from '@angular/core';
//import { NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { getDocIdentidad } from 'src/app/core/services/servicios/docidentidad.service';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbAccordionDirective , NgbModal, NgbDateStruct, NgbDatepickerI18n, NgbDateParserFormatter, NgbDateAdapter } from '@ng-bootstrap/ng-bootstrap';
import { Formulario00317Service } from 'src/app/core/services/formularios/formulario003-17.service';
import { Formulario003_17Response } from 'src/app/core/models/Formularios/Formulario003_17/Formulario003_17Response';
import { ActivatedRoute } from '@angular/router';
import { VisorPdfArchivosService } from 'src/app/core/services/tramite/visor-pdf-archivos.service';
import { VistaPdfComponent } from 'src/app/shared/components/vista-pdf/vista-pdf.component';
import { TramiteService } from 'src/app/core/services/tramite/tramite.service';
import { SeguridadService } from 'src/app/core/services/seguridad.service';
//import { parseDate } from 'pdf-lib';
import { ReniecService } from 'src/app/core/services/servicios/reniec.service';
import { ExtranjeriaService } from 'src/app/core/services/servicios/extranjeria.service';
import { SunatService } from 'src/app/core/services/servicios/sunat.service';
import { TipoDocumentoModel } from 'src/app/core/models/TipoDocumentoModel';
import { RepresentanteLegal } from 'src/app/core/models/SunatModel';
import { ReniecModel } from 'src/app/core/models/ReniecModel';
import { FormularioTramiteService } from 'src/app/core/services/tramite/formulario-tramite.service';
/*
////Configurar Fechas ///////////////////////////////////////////////////////
@Injectable()
export class CustomAdapter extends NgbDateAdapter<string> {

  readonly DELIMITER = '-';

  fromModel(value: string | null): NgbDateStruct | null {
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

  toModel(date: NgbDateStruct | null): string | null {
    return date ? date.day + this.DELIMITER + date.month + this.DELIMITER + date.year : null;
  }
}

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
    return date ? date.day + this.DELIMITER + date.month + this.DELIMITER + date.year : '';
  }
}


const I18N_VALUES = {
  'fr': {
    weekdays: ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'],
    months: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Set', 'Oct', 'Nov', 'Dic'],
  }
  // other languages you would support
};

// Define a service holding the language. You probably already have one if your app is i18ned. Or you could also
// use the Angular LOCALE_ID value
@Injectable()
export class I18n {
  language = 'fr';
}

// Define custom service providing the months and weekdays translations
// Define custom service providing the months and weekdays translations
@Injectable()
export class CustomDatepickerI18n extends NgbDatepickerI18n {



  constructor(private _i18n: I18n) {
    super();
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

///Fin de configurar Fechas//////////////////////////////////////////



declare var PDFLib: any;
declare var download: any;
const { degrees, PDFDocument, rgb, StandardFonts } = PDFLib
*/
@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css'],
 /* providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
    I18n, { provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n } // define custom NgbDatepickerI18n provider
  ]*/
})
export class FormularioComponent implements OnInit {

  @Input() public dataInput: any;
  @Input() public dataRequisitosInput: any;
  @ViewChild('acc') acc: NgbAccordionDirective ;

  graboUsuario: boolean = false;

  uriArchivo: string = ''; //nombre pdf (completo - adjuntos )
  formulario: UntypedFormGroup;

  //Datos Generales
  tipoDocumentoLogin: string;
  nroDocumentoLogin: String;
  nombresLogin: string;
  tipoPersonaLogin: string;
  ruc: string;
  razonsocial: string;
  direccion: string;
  celular: string;
  email:string;
  distrito: string;
  provincia: string;
  departamento: string;

  codigoTupa: string;
  descripcionTupa: string;
  tramiteReqId: number = 0;
  tramiteId: number = 0;

  //Datos de Formulario
  tituloFormulario = 'SOLICITUD DE SERVICIO DE TERMINALES TERRESTRES,TRANSPORTE TURÍSTICO Y TRABAJADORES';
  idFormularioMovimiento: number = 0;
  tipoPersona: number = 1 ;
  dniPersona: string = '45037010';
  active = 1;
  submitted = false;
  visibleSeccion2: boolean = false;
  disabledAcordion: boolean = true;
  //tiposDocIdentidad=getDocIdentidad;
  tiposDocIdentidad: any[] = [];

  errorAlCargarData: boolean = false;

  datosPersona: ReniecModel[] = [];
  representanteLegal: RepresentanteLegal[] = [];

  listaTiposDocumentos: TipoDocumentoModel[] = [
    { id: "1", documento: 'DNI' },
    { id: "2", documento: 'Carné de Extranjería' }
  ];

  selectedDateFechaPago: NgbDateStruct = undefined;
  fechaPago: string = "";
  nroRecibo = '';
  nroOperacion = '';

  //Datos a visualizar en el formulario
  public datos = {
    tipo_solicitante: '',
    nombres: '',
    razon_social: '',
    domicilio: '',
    distrito: '',
    provincia: '',
    departamento: '',
    doc_identidad: '',
    nro_documento: '',
    telefono: '',
    celular: '',
    correo: '',
    doc_identidad_representante: 'DNI',
    cod_identidad_representante: '1',
    nro_identidad_representante: '',
    nombre_representante: '',
    paterno_representante: '',
    materno_representante: '',
    cargo_representante:'',
    domicilio_representante: '_',
    nro_partida: '',
    oficina_registral: '',
    nro_recibo: '',
    nro_operacion: '',
    fecha_pago: '',
    procedimiento_notificacion: true,
    nro_solicitud: '',
    fecha_registro: '',
    autorizada: 'F',
    dni_autorizada: '',
    nombres_autorizada: '',
    check_dstt033: 0,
    check_dstt037: 0,
    check_dstt038: 0
  };

  paDeclaracionJurada: string[]=["DSTT-033","DSTT-037","DSTT-038"];
  activarDeclaracionJurada: boolean=false;

  constructor(
    private fb: UntypedFormBuilder,
    private funcionesMtcService: FuncionesMtcService,
    private modalService: NgbModal,
    private formularioService: Formulario00317Service,
    private _route: ActivatedRoute,
    private visorPdfArchivosService: VisorPdfArchivosService,
    public activeModal: NgbActiveModal,
    public tramiteService: TramiteService,
    private seguridadService: SeguridadService,
    private reniecService: ReniecService,
    private extranjeriaService: ExtranjeriaService,
    private sunatService: SunatService,
    private formularioTramiteService: FormularioTramiteService,

  ) {

    this.formulario = this.fb.group({
      tipo_solicitante: [this.datos.tipo_solicitante],
      nombres: [this.datos.nombres],
      domicilio: [this.datos.domicilio, [Validators.required, Validators.minLength(10), Validators.maxLength(180)]],
      distrito: [this.datos.distrito, [Validators.minLength(4), Validators.maxLength(30)]],
      provincia: [this.datos.provincia, [Validators.minLength(4), Validators.maxLength(30)]],
      departamento: [this.datos.departamento, [Validators.minLength(4), Validators.maxLength(50)]],
      doc_identidad: [this.datos.doc_identidad],
      nro_documento: [this.datos.nro_documento, [Validators.minLength(8), Validators.maxLength(20)]],
      correo: [this.datos.correo, [Validators.required, Validators.email, Validators.minLength(10), Validators.maxLength(180)]],
      telefono: [this.datos.telefono],
      celular: [this.datos.celular, [Validators.required, Validators.minLength(9), Validators.maxLength(9)]],
      procedimiento_notificacion: [true],
      declaracionJurada:[false],
      //representante
      cod_identidad_representante: [this.datos.cod_identidad_representante],
      nro_identidad_representante: [this.datos.nro_identidad_representante],
      nombre_representante: [this.datos.nombre_representante],
      paterno_representante: [this.datos.paterno_representante],
      materno_representante:[this.datos.materno_representante],
      cargo_representante:[this.datos.cargo_representante],
      domicilio_representante: [this.datos.nombre_representante],
      //fichas
      nro_partida: [this.datos.nro_partida],
      oficina_registral: [this.datos.oficina_registral],

      //SECCION 2
      check_dstt033: [this.datos.check_dstt033],
      check_dstt037: [this.datos.check_dstt037],
      check_dstt038: [this.datos.check_dstt038],

      //SECCION 3
      nro_recibo: [this.datos.nro_recibo, [Validators.minLength(0), Validators.maxLength(20)]],
      nro_operacion: [this.datos.nro_operacion, [Validators.minLength(0), Validators.maxLength(20)]],
      fecha_pago: [this.datos.fecha_pago, [Validators.minLength(0), Validators.maxLength(11)]],

      //SECCION 4
      autorizada:[0],
      dni_autorizada: [this.datos.dni_autorizada],
      nombres_autorizada: [this.datos.nombres_autorizada],
    })
  }

  ngOnInit(): void {
    this.tramiteReqId = this.dataInput.tramiteReqId;
    this.uriArchivo = this.dataInput.rutaDocumento;
    //this.tituloFormulario = this.dataInput.descripcion;

    const tramite: any= JSON.parse(localStorage.getItem('tramite-selected'));
    this.codigoTupa = tramite.codigo;
    this.descripcionTupa = tramite.nombre;
    this.tramiteId = JSON.parse(localStorage.getItem('tramite-id'));

    if(this.paDeclaracionJurada.indexOf(this.codigoTupa)>-1) this.activarDeclaracionJurada=true; else this.activarDeclaracionJurada=false;
    //this.validarPago();

    if(this.seguridadService.getNameId() === '00001'){
      //persona natural
      this.tipoPersona = 1;
      this.dniPersona = this.seguridadService.getNumDoc();
    }else if(this.seguridadService.getNameId() === '00002'){
        //persona juridica
        this.tipoPersona = 2;
        this.ruc = this.seguridadService.getCompanyCode();
        this.ruc = this.seguridadService.getNumDoc();
    }else {
        //persona natural con ruc
        this.tipoPersona = 3;
        this.ruc = this.seguridadService.getCompanyCode();
        this.ruc = this.seguridadService.getNumDoc();
    }

    setTimeout(() => {
      this.acc.expand('seccion-1');
      this.acc.expand('seccion-2');
      //this.acc.expand('seccion-3');
      this.acc.expand('seccion-4');
    });

    this.listaTiposDocIdentidad();
    //this.codigoTupa=parseInt(this._route.snapshot.paramMap.get('cod_tupa'))? parseInt(this._route.snapshot.paramMap.get('cod_tupa')): 33;
    this.traerDatos();
    //console.log("Recuperar Información");
    this.recuperarInformacion();
  }

  revisar(){
    console.log(this.formulario.invalid);
    console.log(this.formulario);
  }

  traerDatos() {
    this.nroDocumentoLogin = this.seguridadService.getNumDoc();    //nro de documento usuario login
    this.nombresLogin = this.seguridadService.getUserName();       //nombre de usuario login
    this.tipoDocumentoLogin = this.seguridadService.getNameId();   //tipo de documento usuario login
    this.ruc = this.seguridadService.getCompanyCode();
    console.log('RUC obtenido token'  + this.ruc);
    /*
    this.razonsocial='HYPER SYSTEM S.A.C.';
    this.direccion='PSJ. CLARK 104 DPTO. 403 URB. LOS PARRALES DE SURCO';
    this.celular = '985689885';
    this.email = 'marlonleandro@yahoo.com';
    this.distrito = 'SANTIAGO DE SURCO';
    this.provincia = 'LIMA';
    this.departamento = 'LIMA';

    //this.datos.tipo_solicitante = 'PJ';

    this.formulario.controls['domicilio'].setValue(this.direccion);
    this.formulario.controls['celular'].setValue(this.celular);
    this.formulario.controls['correo'].setValue(this.email);
    this.formulario.controls['distrito'].setValue(this.distrito);
    this.formulario.controls['provincia'].setValue(this.provincia);
    this.formulario.controls['departamento'].setValue(this.departamento);
*/
    this.formulario.controls['nombres'].setValue(this.nombresLogin);

    if (this.seguridadService.getNameId() === '00001') {
      this.tipoPersonaLogin = 'PERSONA NATURAL';
      this.datos.tipo_solicitante = 'PN';
      this.formulario.controls['tipo_solicitante'].setValue('PN');
      this.formulario.controls['doc_identidad'].setValue('01');
      this.formulario.controls['nro_documento'].setValue(this.nroDocumentoLogin);
      this.formulario.controls['nombres'].setValue(this.nombresLogin);
    } else if (this.seguridadService.getNameId() === '00002') {
      this.tipoPersonaLogin = 'PERSONA JURIDICA';
      this.datos.tipo_solicitante = 'PJ';
      this.formulario.controls['tipo_solicitante'].setValue('PJ');
      this.formulario.controls['doc_identidad'].setValue('06');
      this.formulario.controls['nro_documento'].setValue(this.ruc);
      //this.formulario.controls['nombres'].setValue(this.razonsocial);
    } else {
      this.tipoPersonaLogin = 'PERSONA NATURAL CON RUC';
      this.datos.tipo_solicitante = 'PN';
      this.formulario.controls['tipo_solicitante'].setValue('PN');
      this.formulario.controls['doc_identidad'].setValue('01');
    }


    //this.tupaId = Number(localStorage.getItem('tupa-id'));
    //this.codigoTupa = localStorage.getItem('tupa-codigo');    //'DSTT-033'
    //this.descripcionTupa = localStorage.getItem('tupa-nombre');

    console.log("Temas de datos");
    if (this.codigoTupa === 'DSTT-033') {
      this.datos.check_dstt033 = 1;
      this.formulario.controls['check_dstt033'].setValue(1);
    } else if (this.codigoTupa === 'DSTT-037') {
      this.datos.check_dstt037 = 1;
      this.formulario.controls['check_dstt037'].setValue(1);
    } else if (this.codigoTupa === 'DSTT-038') {
      this.datos.check_dstt038 = 1;
      this.formulario.controls['check_dstt038'].setValue(1);
    }
  }

  formInvalid(control: string) {
    return this.formulario.get(control).invalid &&
      (this.formulario.get(control).dirty || this.formulario.get(control).touched) ; //&& (this.formulario.controls['declaracionJurada']===true)
  }

  soloNumeros(event) {
    event.target.value = event.target.value.replace(/[^0-9]/g, '');
  }

 /*  buscarDNI(){
    const tipoDocumento: string = this.formulario.controls['cod_identidad_representante'].value.trim();
    const numeroDocumento: string = this.formulario.controls['nro_identidad_representante'].value.trim();
    console.log(tipoDocumento);
    console.log(numeroDocumento);

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
          //const nombre_aux=datosPersona.prenombres+' '+ datosPersona.apPrimer + ' ' + datosPersona.apSegundo;
          console.log(datosPersona);
          this.formulario.controls['nombre_representante'].setValue(datosPersona.prenombres);
          this.formulario.controls['paterno_representante'].setValue(datosPersona.apPrimer);
          this.formulario.controls['materno_representante'].setValue(datosPersona.apSegundo);
          this.formulario.controls['domicilio_representante'].setValue(datosPersona.direccion);
          
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

          const nombre_aux= respuesta.CarnetExtranjeria.nombres + ' ' + respuesta.CarnetExtranjeria.primerApellido + ' ' + respuesta.CarnetExtranjeria.segundoApellido
          this.formulario.controls['nombre_representante'].setValue(nombre_aux);
          this.datos.nombre_representante= nombre_aux;

        },
        error => {
          this.funcionesMtcService
            .ocultarCargando()
            .mensajeError('Error al consultar al servicio');
        }
      );
    }


  } */

  listaTiposDocIdentidad() {
    console.log(getDocIdentidad);
    this.tiposDocIdentidad = getDocIdentidad;
    /*for (let item in getDocIdentidad){
      this.tiposDocIdentidad.push(item);
      console.log(item);
        if(isNaN(Number(item))){
          this.tiposDocIdentidad.push({value:getDocIdentidad[item],text:item});
        }
    }*/
  }

  changeTipoDocumento() {
    this.formulario.controls['nro_identidad_representante'].setValue(' ');
    this.inputNumeroDocumento();
  }
  
  inputNumeroDocumento(event = undefined) {
    if (event)
      event.target.value = event.target.value.replace(/[^0-9]/g, '');

    this.formulario.controls['nombre_representante'].setValue('');
    this.formulario.controls['paterno_representante'].setValue('');
    this.formulario.controls['materno_representante'].setValue('');
    this.formulario.controls['cargo_representante'].setValue('');
    this.formulario.controls['domicilio_representante'].setValue('');

  }

  buscarNumeroDocumento() {

    const tipoDocumento: string = this.formulario.controls['cod_identidad_representante'].value.trim();
    const numeroDocumento: string = this.formulario.controls['nro_identidad_representante'].value.trim();

    if (tipoDocumento.length === 0 || numeroDocumento.length === 0)
      return this.funcionesMtcService.mensajeError('Debe ingresar Tipo de Documento y/o Número de Documento');
    if (tipoDocumento === '1' && numeroDocumento.length !== 8)
      return this.funcionesMtcService.mensajeError('DNI debe tener 8 caracteres');
    

    const resultado = this.representanteLegal.find( representante => representante.tipoDocumento === tipoDocumento && representante.nroDocumento.trim() === numeroDocumento );
    console.log(resultado);
    //console.log(resultado.cargo.trim());
    if(resultado){ 

      if (tipoDocumento === '1') {//DNI
        console.log('DATOS DE REPRESENTATE  LEGAL: ');
        console.log(this.representanteLegal);

        /* const resultado = this.representanteLegal.find( representante => representante.tipoDocumento === tipoDocumento && representante.nroDocumento.trim() === numeroDocumento );
        console.log(resultado);
        //console.log(resultado.cargo.trim());
        if(resultado){ */

          this.funcionesMtcService.mostrarCargando();

            this.reniecService.getDni(numeroDocumento).subscribe(
              respuesta => {

                  this.funcionesMtcService.ocultarCargando();

                  const datos = respuesta.reniecConsultDniResponse.listaConsulta.datosPersona;

                  console.log(JSON.stringify(datos, null, 10));

                  if (datos.prenombres === '')
                    return this.funcionesMtcService.mensajeError(respuesta.reniecConsultDniResponse.listaConsulta.deResultado);

                  this.formulario.controls['nombre_representante'].setValue(datos.prenombres.trim());
                  this.formulario.controls['paterno_representante'].setValue(datos.apPrimer.trim());
                  this.formulario.controls['materno_representante'].setValue(datos.apSegundo.trim());
                  this.formulario.controls['domicilio_representante'].setValue(datos.direccion.trim());
                  let cargo = resultado.cargo.split('-');  
                // let cargo = '024- gerente general'.split('-');  
                  console.log(cargo);
                  this.formulario.controls['cargo_representante'].setValue(cargo[cargo.length-1].trim());
              },
              error => {
                this.funcionesMtcService
                  .ocultarCargando()
                  .mensajeError('Error al consultar el Servicio Reniec');
              }
            );

        /* }else{
            return this.funcionesMtcService.mensajeError('El documento de identificación ingresado no corresponde a uno de la lista de representantes ');
        } */
      } else if (tipoDocumento === '2') {//CARNÉ DE EXTRANJERÍA
        this.extranjeriaService.getCE(numeroDocumento).subscribe(
          respuesta => {
            this.funcionesMtcService.ocultarCargando();

            if (respuesta.CarnetExtranjeria.numRespuesta !== '0000')
              return this.funcionesMtcService.mensajeError('Número de documento no registrado en Migraciones');

            this.formulario.controls['nombre_representante'].setValue(respuesta.CarnetExtranjeria.nombres.trim());
            this.formulario.controls['paterno_representante'].setValue(respuesta.CarnetExtranjeria.primerApellido.trim());
            this.formulario.controls['materno_representante'].setValue(respuesta.CarnetExtranjeria.segundoApellido.trim());
            this.formulario.controls['domicilio_representante'].setValue('*');        
            this.formulario.controls['cargo_representante'].setValue('*');
          },
          error => {
            this.funcionesMtcService
              .ocultarCargando()
              .mensajeError('Error al consultar al servicio');
          }
        );
      }

     }else{
      return this.funcionesMtcService.mensajeError('Representante legal no encontrado');
    } 

  }

  getMaxLengthNumeroDocumento() {
    const tipoDocumento: string = this.formulario.controls['cod_identidad_representante'].value.trim();

    if (tipoDocumento === '1')//DNI
      return 8;
    else if (tipoDocumento === '2')//CE
      return 12;
    return 0
  }

  descargarPdf() {
    if (this.idFormularioMovimiento === 0)
      return this.funcionesMtcService.mensajeError('Debe guardar previamente los datos ingresados');

    this.funcionesMtcService.mostrarCargando();

    this.visorPdfArchivosService.get(this.uriArchivo)
      //this.anexoService.readPostFie(this.idAnexo)
      .subscribe(
        (file: Blob) => {
          this.funcionesMtcService.ocultarCargando();

          const modalRef = this.modalService.open(VistaPdfComponent, { size: 'xl', scrollable: true });
          const urlPdf = URL.createObjectURL(file);
          modalRef.componentInstance.pdfUrl = urlPdf;
          modalRef.componentInstance.titleModal = "Vista Previa - Formulario 003/17";

        },
        error => {
          this.funcionesMtcService
            .ocultarCargando()
            .mensajeError('Problemas para descargar Pdf');
        }
      );

  }

  descargarPdf2() {
    if (this.idFormularioMovimiento === 0)
      return this.funcionesMtcService.mensajeError('Debe guardar previamente los datos ingresados');

    this.funcionesMtcService.mostrarCargando();

    this.visorPdfArchivosService.get(this.uriArchivo)
      //this.anexoService.readPostFie(this.idAnexo)
      .subscribe(
        (file: Blob) => {
          this.funcionesMtcService.ocultarCargando();

          //const modalRef = this.modalService.open(VistaPdfComponent, { size: 'xl', scrollable: true });
          const urlPdf = URL.createObjectURL(file);
          
          //modalRef.componentInstance.pdfUrl = urlPdf;
          //modalRef.componentInstance.titleModal = "Vista Previa - Formulario 003/17";

        },
        error => {
          this.funcionesMtcService
            .ocultarCargando()
            .mensajeError('Problemas para descargar Pdf');
        }
      );

  }

  guardarFormulario() {

    if (this.formulario.invalid === true)
      return this.funcionesMtcService.mensajeError('Debe ingresar todos los campos obligatorios');
    
      const fecha_pago_aux= this.formulario.controls['fecha_pago'].value;
      let representante=this.formulario.controls['nombre_representante'].value;
      let partida=this.formulario.controls['nro_partida'].value;
      let oficina=this.formulario.controls['oficina_registral'].value;

      if (this.tipoPersona===2 && (representante==="" || partida==="" || oficina==="")){
        //verificar que ingrese oficina, partida y representante
        return  this.funcionesMtcService.mensajeError('Debe ingresar todos los campos');
      }
      //const fecha_pago_aux= parseDate(this.formulario.controls['fecha_Pago'].value.toStringFecha());
      //const fecha_pago_aux= this.formulario.controls['fecha_pago'].value.toStringFecha();
      
      let dataGuardar = {
      id: this.idFormularioMovimiento,
      codigo: 'F003-17',
      formularioId: 2,
      codUsuario: "12345678",
      idTramiteReq: this.tramiteReqId,
      estado: 1,
      metaData: {
        seccion1: {
          tipoSolicitante: this.formulario.controls['tipo_solicitante'].value,
          nombresApellidos: this.formulario.controls['tipo_solicitante'].value ==='PN' ? this.formulario.controls['nombres'].value : '' ,
          razonSocial: this.formulario.controls['tipo_solicitante'].value ==='PJ' ? this.formulario.controls['nombres'].value : '' ,
          domicilioLegal: this.formulario.controls['domicilio'].value,
          distrito: this.formulario.controls['distrito'].value,
          provincia: this.formulario.controls['provincia'].value,
          departamento: this.formulario.controls['departamento'].value,
          tipodocumento: this.formulario.controls['doc_identidad'].value, //codDocumento
          numeroDocumento: this.formulario.controls['nro_documento'].value, //nroDocumento

          email: this.formulario.controls['correo'].value,
          telefono: this.formulario.controls['telefono'].value,
          celular: this.formulario.controls['celular'].value,
          notificacion: this.formulario.controls['procedimiento_notificacion'].value === true ? 'SI' : 'NO' ,
          tipoRepresentanteLegal: this.formulario.controls['cod_identidad_representante'].value,
          nroDocumentoRepresentanteLegal: this.formulario.controls['nro_identidad_representante'].value,
          nombreRepresentanteLegal: this.formulario.controls['nombre_representante'].value,
          apePaternoRepresentanteLegal: this.formulario.controls['paterno_representante'].value,
          apeMaternoRepresentanteLegal: this.formulario.controls['materno_representante'].value,
          cargoRepresentanteLegal: this.formulario.controls['cargo_representante'].value,
          domicilioRepresentanteLegal: this.formulario.controls['domicilio_representante'].value,

          partidaRepresentanteLegal: this.formulario.controls['nro_partida'].value,
          fechaPartida: '2020-11-16',
          oficinaRegistralRepresentanteLegal: oficina.toUpperCase(),
          declaracionJurada:this.formulario.controls["declaracionJurada"].value,
        },
        seccion2: {
          dstt_033: this.formulario.controls['check_dstt033'].value,
          dstt_037: this.formulario.controls['check_dstt037'].value,
          dstt_038: this.formulario.controls['check_dstt038'].value,

        },
        seccion3: {
          nroRecibo: this.formulario.controls['nro_recibo'].value,
          nroOperacion: this.formulario.controls['nro_operacion'].value,
          fechaPago: this.fechaPago,
        },
        seccion4: {
          autorizaPersona: this.formulario.controls['autorizada'].value,
          dni: this.formulario.controls['dni_autorizada'].value, // autorizaDni
          nombre: this.formulario.controls['nombres_autorizada'].value, //autorizaNombre
        }
      }
    }

    this.funcionesMtcService.mensajeConfirmar(`¿Está seguro de ${this.idFormularioMovimiento === 0 ? 'guardar' : 'modificar'} los datos ingresados?`)
      .then(() => {

        console.log(JSON.stringify(dataGuardar));        

        if (this.idFormularioMovimiento === 0) {
          this.funcionesMtcService.mostrarCargando();
          //GUARDAR:
          this.formularioService.post<any>(dataGuardar)
            .subscribe(
              data => {
                this.funcionesMtcService.ocultarCargando();
                this.idFormularioMovimiento = data.id;
                this.uriArchivo = data.uriArchivo;
                console.log(this.tramiteReqId);
                //this.idTramiteReq=data.idTramiteReq;
                this.graboUsuario = true;
                //this.funcionesMtcService.mensajeOk(`Los datos fueron guardados exitosamente (idFormularioMovimiento = ${this.idFormularioMovimiento})`);
                this.funcionesMtcService.mensajeOk('Los datos fueron guardados exitosamente ');
              },
              error => {
                this.funcionesMtcService.ocultarCargando().mensajeError('Problemas para realizar el guardado de datos');
              }
            );
        } else  {         
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

          if( cadenaAnexos.length > 0){
            //ACTUALIZA FORMULARIO Y ANEXOS
            this.funcionesMtcService.mensajeConfirmar("Deberá volver a grabar los anexos " + cadenaAnexos + "¿Desea continuar?")
            .then(() => {
                this.funcionesMtcService.mostrarCargando();
                this.formularioService.put<any>(dataGuardar)
                .subscribe(
                  data => {
                    this.funcionesMtcService.ocultarCargando();
                    this.idFormularioMovimiento = data.id;
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
                              data => {},
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
          }else{
            //actualiza formulario
              this.funcionesMtcService.mostrarCargando();
              this.formularioService.put<any>(dataGuardar)
                .subscribe(
                  data => {
                    this.funcionesMtcService.ocultarCargando();
                    this.idFormularioMovimiento = data.id;
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

  recuperarInformacion(){

      //si existe el documento
      console.log('Ruta del documento');
      console.log(this.dataInput.rutaDocumento);
      console.log(this.dataInput.movId);
      if (this.dataInput.movId>0) {
        //RECUPERAMOS LOS DATOS DEL FORMULARIO
        this.formularioTramiteService.get<any>(this.dataInput.tramiteReqId).subscribe(
          (dataFormulario: Formulario003_17Response) => {
            const metaData: any = JSON.parse(dataFormulario.metaData);

            this.idFormularioMovimiento = dataFormulario.formularioId;

            console.log(JSON.stringify(dataFormulario, null, 10));
            console.log(JSON.stringify(JSON.parse(dataFormulario.metaData), null, 10));
            if (this.tipoPersona !==1 ){
              this.recuperarDatosSunat();
            }

            if( this.tipoPersona === 1 ){

                this.formulario.get("nombres").setValue(metaData.seccion1.apellidoPaterno + " " + metaData.seccion1.apellidoMaterno + " " + metaData.seccion1.nombres);
                this.formulario.get("nro_documento").setValue(metaData.seccion1.numeroDocumento);

            }else{
                this.formulario.get("nombres").setValue(metaData.seccion1.razonSocial);
                this.formulario.get("nro_documento").setValue(metaData.seccion1.numeroDocumento);
            }

            this.formulario.get("domicilio").setValue(metaData.seccion1.domicilioLegal);
            this.formulario.get("distrito").setValue(metaData.seccion1.distrito);
            this.formulario.get("provincia").setValue(metaData.seccion1.provincia);
            this.formulario.get("departamento").setValue(metaData.seccion1.departamento);
            //this.formulario.get("s1_ce").setValue(metaData.seccion1.ce);
            //this.formulario.get("s1_ci").setValue(metaData.seccion1.ci);
            this.formulario.get("correo").setValue(metaData.seccion1.email);
            this.formulario.get("telefono").setValue(metaData.seccion1.telefono);
            this.formulario.get("celular").setValue(metaData.seccion1.celular);
            this.formulario.get("procedimiento_notificacion").setValue(metaData.seccion1.notificacion=== 'SI'? true:false);

            this.formulario.get("nro_identidad_representante").setValue(metaData.seccion1.nroDocumentoRepresentanteLegal);
            this.formulario.get("nombre_representante").setValue(metaData.seccion1.nombreRepresentanteLegal);
            this.formulario.get("paterno_representante").setValue(metaData.seccion1.apePaternoRepresentanteLegal);
            this.formulario.get("materno_representante").setValue(metaData.seccion1.apeMaternoRepresentanteLegal);            
            this.formulario.get("cargo_representante").setValue(metaData.seccion1.cargoRepresentanteLegal);
            this.formulario.get("domicilio_representante").setValue(metaData.seccion1.domicilioRepresentanteLegal);
            this.formulario.get("nro_partida").setValue(metaData.seccion1.partidaRepresentanteLegal);
            this.formulario.get("oficina_registral").setValue(metaData.seccion1.oficinaRegistralRepresentanteLegal);

            //SECCION 2
            this.formulario.get("check_dstt033").setValue(metaData.seccion2.dstt_033);
            this.formulario.get("check_dstt037").setValue(metaData.seccion2.dstt_037);
            this.formulario.get("check_dstt038").setValue(metaData.seccion2.dstt_038);
            
            //SECCION 3
            this.formulario.get("nro_recibo").setValue(metaData.seccion3.nrorecibo);
            this.formulario.get("nro_operacion").setValue(metaData.seccion3.nrooperacion);
            const fechaPagoaux = metaData.seccion3.fechaPago.split("-");
                this.selectedDateFechaPago = {
                    day: parseInt(fechaPagoaux[2]),
                    month: parseInt(fechaPagoaux[1]),
                    year: parseInt(fechaPagoaux[0])
                };
            this.formulario.get("fecha_pago").setValue(this.selectedDateFechaPago);
            
            //SECCION 4
            this.formulario.get("dni_autorizada").setValue(metaData.seccion4.dni);
            this.formulario.get("nombres_autorizada").setValue(metaData.seccion4.nombre);

            
            

            /*  fecha partida no utilziamos
            if( metaData.seccion1.fechaPartida.length > 0){
                this.fechaPartida = metaData.seccion1.fechaPartida;
                const fechaPartida = metaData.seccion1.fechaPartida.split("-");
                this.selectedDateFechaInscripcion = {
                  day: parseInt(fechaPartida[2]),
                  month: parseInt(fechaPartida[1]),
                  year: parseInt(fechaPartida[0])
                };
                this.formulario.get("s1_fechaPartida").setValue(this.selectedDateFechaInscripcion);
            }else{
                this.formulario.get("s1_fechaPartida").setValue(null);
            }

            */
            
            
           /* la fecha de pago corregir
            if( metaData.seccion3.fechaPago.length > 0 ){
                this.fechaPago = metaData.seccion3.fechaPago;
                const fechaPago = metaData.seccion3.fechaPago.split("-");
                this.selectedDateFechaPago = {
                    day: parseInt(fechaPago[2]),
                    month: parseInt(fechaPago[1]),
                    year: parseInt(fechaPago[0])
                };
                this.formulario.get("s3_fechaPago").setValue(this.selectedDateFechaPago);
            }else{
                this.formulario.get("s3_fechaPago").setValue(null);
            }
              */
            
          },
          error => {
            this.errorAlCargarData = true;
            this.funcionesMtcService
              .ocultarCargando()
              .mensajeError('Problemas para recuperar los datos guardados ');
          });
      }else{

          switch(this.tipoPersona){
              case 1:
                  //servicio reniec
                  this.recuperarDatosReniec();
              break;

              case 2:
                  //persona juridica
                  this.recuperarDatosSunat();
                  //console.log("Procedimiento Recuperar Datos Representante");
                  //this.recuperarDatosRepresentateLegal();
              break;

              case 3:
                  //persona natural con ruc
                  this.recuperarDatosSunat();
              break;
          }

      }

  }

  recuperarDatosReniec() {

    this.funcionesMtcService.mostrarCargando();

    this.reniecService.getDni(this.dniPersona).subscribe(
        respuesta => {

            this.funcionesMtcService.ocultarCargando();

            const datos = respuesta.reniecConsultDniResponse.listaConsulta.datosPersona;

            console.log(JSON.stringify(datos, null, 10));

            if (datos.prenombres === '')
              return this.funcionesMtcService.mensajeError(respuesta.reniecConsultDniResponse.listaConsulta.deResultado);

            this.formulario.controls['nombres'].setValue(datos.prenombres.trim() + ' ' + datos.apPrimer.trim() + ' ' + datos.apSegundo.trim());
            this.formulario.controls['domicilio'].setValue(datos.direccion.trim());

            let ubigeo = datos.ubigeo.split('/');
            this.formulario.controls['distrito'].setValue(ubigeo[2].trim());
            this.formulario.controls['provincia'].setValue(ubigeo[1].trim());
            this.formulario.controls['departamento'].setValue(ubigeo[0].trim());

            this.formulario.controls['nro_documento'].setValue(this.dniPersona.trim());

        },
        error => {
          this.funcionesMtcService
            .ocultarCargando()
            .mensajeError('Error al consultar el Servicio Reniec');
        }
      );

  }

  recuperarDatosSunat() {
    this.funcionesMtcService.mostrarCargando();
    this.sunatService.getDatosPrincipales(this.ruc).subscribe(
        respuesta => {
          this.funcionesMtcService.ocultarCargando();
          const datos = respuesta;
          console.log(JSON.stringify(datos, null, 10));

          if (this.dataInput.rutaDocumento) {
            this.representanteLegal = datos.representanteLegal;
          }else{  
          //console.log(JSON.stringify(datos, null, 10));
          this.formulario.controls['nombres'].setValue(datos.razonSocial.trim());
          this.formulario.controls['domicilio'].setValue(datos.domicilioLegal.trim());
          this.formulario.controls['distrito'].setValue(datos.nombreDistrito.trim());
          this.formulario.controls['provincia'].setValue(datos.nombreProvincia.trim());
          this.formulario.controls['departamento'].setValue(datos.nombreDepartamento.trim());
          this.formulario.controls['nro_documento'].setValue(datos.nroDocumento.trim());
          this.formulario.controls['correo'].setValue(datos.correo.trim());
          this.formulario.controls['telefono'].setValue(datos.telefono.trim());
          this.formulario.controls['celular'].setValue(datos.celular.trim());
          this.representanteLegal = datos.representanteLegal;
          //this.formulario.controls['nro_identidad_representante'].setValue(datos.representanteLegal[0].nroDocumento.trim());
          //this.buscarDNI();
          }

        },
        error => {
          this.funcionesMtcService
            .ocultarCargando()
            .mensajeError('Error al consultar el Servicio Reniec');
        }
      );
  }
  
  recuperarDatosRepresentateLegal() {

    this.funcionesMtcService.mostrarCargando();

    this.sunatService.getRepresentantesLegales(this.ruc).subscribe(
        respuesta => {

          this.funcionesMtcService.ocultarCargando();

          const datos = respuesta.getRepLegalesResponse;
          //console.log("Representantes legales");
          //console.log(JSON.stringify(datos, null, 10));

        },
        error => {
          this.funcionesMtcService
            .ocultarCargando()
            .mensajeError('Error al consultar el Servicio Reniec');
        }
      );

  }

  cambio() {
    console.log(this.datos.autorizada);
  }
  /*

    toggle(acc: NgbAccordionDirective ) {
      if (acc.activeIds.length) {
        acc.activeIds = [];
      }
      else {
        acc.activeIds = [0, 1, 2].map(i => 'ngb-panel-${i}');
      }
    } */

  get form() { return this.formulario.controls; }

  validarPago(){
    //si no existe el documento
    if (this.dataInput.movId === 0) {

        this.tramiteService.getPago(this.tramiteId).subscribe(
          respuesta => {
            this.funcionesMtcService.ocultarCargando();
            const datos = respuesta;
            console.log(JSON.stringify(datos, null, 10));
            //if(datos.obligatorio){
            if(datos==null){

                this.activeModal.close(this.graboUsuario);
                this.funcionesMtcService.mensajeError('Primero debe realizar el pago por derecho de trámite');
                return;

            }else{
                if(datos.numeroOperacion === null || datos.numeroOperacion === ''){
                  this.activeModal.close(this.graboUsuario);
                  this.funcionesMtcService.mensajeError('Primero debe realizar el pago por derecho de trámite');
                  return;
                }else{

                  this.nroRecibo = datos.codigoTributo + '-' + datos.codigoOficina;
                  this.nroOperacion = datos.numeroOperacion;
                  this.fechaPago = datos.fechaPago.substr(0,10);
        
                  this.cargarInformacionPago();

                }
            }

          },
          error => {
            this.funcionesMtcService
              .ocultarCargando()
              .mensajeError('Error al consultar el Servicio Tramite');
          }
        );
    }
  }

  cargarInformacionPago(){
    //si no existe el documento
    if (this.dataInput.movId === 0) {
        //cargar la fecha si es un nuevo registro

        const fechaPagoaux = this.fechaPago.split("-");

        this.selectedDateFechaPago = {
            day: parseInt(fechaPagoaux[2]),
            month: parseInt(fechaPagoaux[1]),
            year: parseInt(fechaPagoaux[0])
        };

        this.formulario.get("nro_recibo").setValue(this.nroRecibo);
        this.formulario.get("nro_operacion").setValue(this.nroOperacion);
        this.formulario.get("fecha_pago").setValue(this.selectedDateFechaPago);
    }
  }

  onChangeDeclaracionJurada(e){
    //this.toggle = e;
  }
}

