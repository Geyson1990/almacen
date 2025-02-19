import { Component, Input, OnInit, Injectable, ViewChild  } from '@angular/core';
import { NgbActiveModal, NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { FormArray, UntypedFormBuilder, FormControl, UntypedFormGroup, RequiredValidator, Validators } from '@angular/forms';
import { DropdownService } from 'src/app/core/models/Formularios/Formulario006_17/dropdown.service';
import { NgbDateStruct, NgbDateParserFormatter, NgbDatepickerI18n, NgbAccordionDirective , NgbDateAdapter, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { Formulario00617Service } from 'src/app/core/services/formularios/Formulario006-17.service';
import { FormularioResponse } from 'src/app/core/models/Formularios/Formulario006_17/FormularioResponse';
import { VistaPdfComponent } from 'src/app/shared/components/vista-pdf/vista-pdf.component';
import { VisorPdfArchivosService } from 'src/app/core/services/tramite/visor-pdf-archivos.service';

import { FormularioTramiteService } from 'src/app/core/services/tramite/formulario-tramite.service';
import { TipoDocumentoSncModel } from 'src/app/core/models/TipoDocumentoSncModel';
import { SncService } from 'src/app/core/services/servicios/snc.service';
import { ExtranjeriaService } from 'src/app/core/services/servicios/extranjeria.service';
import { ReniecService } from 'src/app/core/services/servicios/reniec.service';
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
  templateUrl: './formulario06.component.html',
  styleUrls: ['./formulario06.component.css'],
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

  tipoCanje:string="";
  
  formulario: UntypedFormGroup;

  idFormularioMovimiento: number = 0;

  @ViewChild('acc') acc: NgbAccordionDirective ;

  tiposServicio:any[];
  tiposCanje:any[];
  tiposLicencia:any[];

  mensajeInicial:string = "";
  ingresarDataManualmente: boolean = false;
  
  listaTiposDocumentos: TipoDocumentoSncModel[] = [
    { id: "01", documento: 'DNI' },
    { id: "04", documento: 'Carnet de extranjería' },
  ];

  fechaRegistro: string = "";
  fechaES: string = "";
  fechaEC: string = "";
  fechaCE: string = "";

  contactForm = this.fb.group({
    nro_solicitud: this.fb.control('',[Validators.required]),
    fecha_registro:this.fb.control('',[Validators.required]),
    nro_licencia:this.fb.control('',[Validators.required]),
    centro_emision:this.fb.control('',[Validators.required]),
    
    tipoDocIdentidad:['', [Validators.required]],
    numeroDocIdentidad:['', [Validators.required, Validators.minLength(3)]],

    nombres: ['', [Validators.required, Validators.minLength(3)]],
    domicilio: this.fb.control('',[Validators.required]),
    correo:['', [Validators.required, Validators.email]],
    distrito:this.fb.control('',[Validators.required]),
    provincia:this.fb.control('',[Validators.required]),
    region:this.fb.control('',[Validators.required]),
    telefono: this.fb.control(''),

    tiposServicio: ['0'],
    tiposCanje: [this.tipoCanje],
    tiposLicencia: ['0'],

    nombreES: this.fb.control('',[Validators.required]),
    certificadoES: this.fb.control('',[Validators.required]),
    fechaES: this.fb.control('',[Validators.required]),
    nombreEC: this.fb.control('',[Validators.required]),
    certificadoEC: this.fb.control('',[Validators.required]),
    fechaEC: this.fb.control('',[Validators.required]),
    nombreCE: this.fb.control('',[Validators.required]),
    certificadoCE: this.fb.control('',[Validators.required]),
    fechaCE: this.fb.control('',[Validators.required]),

    acepto: this.fb.control(false),
  });

  constructor(    
    public fb:UntypedFormBuilder,
    private modalService: NgbModal,
    private dropdownService:DropdownService,
    private formularioService: Formulario00617Service,
    private SncService: SncService,
    private reniecService: ReniecService,
    private extranjeriaService: ExtranjeriaService,
    private formularioTramiteService: FormularioTramiteService,
    private funcionesMtcService: FuncionesMtcService,
    private visorPdfArchivosService: VisorPdfArchivosService,
    public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    this.uriArchivo = this.dataInput.rutaDocumento;

    this.tiposServicio = this.dropdownService.getTiposServicio();
    this.tiposCanje = this.dropdownService.getTipoasCanje();
    this.tiposLicencia = this.dropdownService.getTiposLicencia();

    this.recuperarInformacion();
    const tramite: any= JSON.parse(localStorage.getItem('tramite-selected'));
    this.codigoTupa = tramite.codigo;
    this.descripcionTupa = tramite.nombre;

    if(this.codigoTupa==="DCV-010") {  
      this.tipoCanje = "2";
      this.mensajeInicial= `Para iniciar el Trámite Correspondiente, debe haber cumplido con los requisitos establecidos por la Dirección de Circulación Vial`;
    }
    
    if(this.codigoTupa==="DCV-008") {
      this.tipoCanje = "4";
      this.mensajeInicial= `Para iniciar el Trámite Correspondiente, debe haber cumplido con los requisitos establecidos por la Dirección de Circulación Vial`;
    }

    if(this.codigoTupa==="DCV-009") {
      this.tipoCanje = "1";
      this.mensajeInicial= `Para iniciar el Trámite Correspondiente, debe haber cumplido con los requisitos establecidos por la Dirección de Circulación Vial`;
    }

    if(this.codigoTupa==="S-DCV-002") {
      this.tipoCanje = "3";
    }

    this.contactForm.get("tiposCanje").setValue(this.tipoCanje);
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

  buscarNumeroDocumento() {
    const tipoDocumento: string = this.contactForm.controls['tipoDocIdentidad'].value.trim();
    const numeroDocumento: string = this.contactForm.controls['numeroDocIdentidad'].value.trim();

    if (tipoDocumento.length === 0 || numeroDocumento.length === 0)
      return this.funcionesMtcService.mensajeError('Debe ingresar Tipo de Documento y/o Número de Documento');
    if (tipoDocumento === '01' && numeroDocumento.length !== 8)
      return this.funcionesMtcService.mensajeError('DNI debe tener 8 caracteres');

    this.funcionesMtcService.mostrarCargando();
    this.limpiarDatos();

    if(this.codigoTupa==="S-DCV-002") {
      if (tipoDocumento === '01') {//DNI
        this.reniecService.getDni(numeroDocumento).subscribe(
          (respuesta) => {
            this.funcionesMtcService.ocultarCargando();

            if (respuesta.reniecConsultDniResponse.listaConsulta.coResultado !== '0000')
              return this.funcionesMtcService.mensajeError('Número de documento no registrado en Reniec');

            const data = respuesta.reniecConsultDniResponse.listaConsulta.datosPersona;

            this.addTripulacion(data.prenombres, data.apPrimer+' '+data.apSegundo, data.direccion, data.ubigeo);
            this.habilitarCampos();
          },
          (error) => {
            this.funcionesMtcService.ocultarCargando()
            .mensajeErrorConfirmar(`Error al consultar el servicio. ¿Desea ingresar los datos manualmente?`, "Error")
            .then(() => {
              this.habilitarCampos();
            });
          }
        );
      } else if (tipoDocumento === '04') {//CARNÉ DE EXTRANJERÍA
        this.extranjeriaService.getCE(numeroDocumento).subscribe(
          (respuesta) => {
            this.funcionesMtcService.ocultarCargando();

            if (respuesta.CarnetExtranjeria.numRespuesta !== '0000')
              return this.funcionesMtcService.mensajeError('Número de documento no registrado en Migraciones');

            const data = respuesta.CarnetExtranjeria;

            this.addTripulacion1(data.nombres, data.primerApellido+ ' ' +data.segundoApellido,);
            this.habilitarCampos();
          },
          (error) => {
            this.funcionesMtcService.ocultarCargando()
            .mensajeErrorConfirmar(`Error al consultar el servicio. ¿Desea ingresar los datos manualmente?`, "Error")
            .then(() => {
              this.habilitarCampos();
            });
          }
        );
      }
    }else{
      if (tipoDocumento === '01') {//DNI
        this.SncService.getDni('2',numeroDocumento).subscribe( //"2" = "DNI"
          (res:any) => {
            this.funcionesMtcService.ocultarCargando();
            if(res===null) {
              this.funcionesMtcService.mensajeError(`No se Encontró Registro del Conductor`);
              this.deshabilitarCampos();

            }else{
              this.contactForm.get("nro_solicitud").setValue(res.CodFichaPos);
              this.fechaRegistro = this.dateFormatString(res.LicenciaFechaTransaccion);
              this.setDateValue("fecha_registro", this.fechaRegistro);
              this.contactForm.get("nro_licencia").setValue(res.LicenciaNroLicencia);
              this.contactForm.get("centro_emision").setValue(res.NombreLocalImpresion);

              this.contactForm.get("nombres").setValue(res.ConductorNombres+' '+res.ConductorApePaterno+' '+res.ConductorApeMaterno);
              this.contactForm.get("domicilio").setValue(res.ConductorDireccion);
              this.contactForm.get("distrito").setValue(res.ConductorDistrito);
              this.contactForm.get("provincia").setValue(res.ConductorProvincia);
              this.contactForm.get("region").setValue(res.ConductorDepartamento);
              this.contactForm.get("telefono").setValue(res.ConductorTelefono);
              this.contactForm.get("correo").setValue(res.ConductorEmail);

              switch(res.NombreTramite){
                case "Nuevo": this.contactForm.get("tiposServicio").setValue("1"); break;
                case "Revalidacion": this.contactForm.get("tiposServicio").setValue("2"); break;
                case "Recategorizacion": this.contactForm.get("tiposServicio").setValue("3"); break;
                case "Duplicado": this.contactForm.get("tiposServicio").setValue("4"); break;
                default: break;
              }

              if(res.CodCategoria){
                this.contactForm.get("tiposLicencia").setValue(res.CodCategoria.toString());
              }

              this.contactForm.get("nombreES").setValue(res.CentroMedicoNombre);
              this.contactForm.get("certificadoES").setValue(res.CentroMedicoMCertificado);
              this.fechaES = this.dateFormatString(res.CentroMedicoFecha);
              this.setDateValue("fechaES", this.fechaES);

              this.contactForm.get("nombreEC").setValue(res.EscuelaNombre);
              this.contactForm.get("certificadoEC").setValue(res.EscuelaCertificado );
              this.fechaEC = this.dateFormatString(res.EscuelaFecha);
              this.setDateValue("fechaEC", this.fechaEC);

              this.contactForm.get("nombreCE").setValue(res.ReglasNombre);
              this.contactForm.get("certificadoCE").setValue(res.ReglasCertificado);
              this.fechaCE = this.dateFormatString(res.ReglasFecha);
              this.setDateValue("fechaCE", this.fechaCE);

              this.habilitarCampos();
            }
          },
          (error) => {
            this.funcionesMtcService.ocultarCargando()
            .mensajeErrorConfirmar(`Error al consultar el servicio. ¿Desea ingresar los datos manualmente?`, "Error")
            .then(() => {
              this.habilitarCampos();
            });
          }
        );
      } else if (tipoDocumento === '04') {//CARNÉ DE EXTRANJERÍA
        this.SncService.getDni('13',numeroDocumento).subscribe( // "13" = CARNET DE ESTRANJERIA
          (res:any) => {
            this.funcionesMtcService.ocultarCargando();

            this.contactForm.get("nro_solicitud").setValue(res.CodFichaPos);
            this.fechaRegistro = this.dateFormatString(res.LicenciaFechaTransaccion);
            this.setDateValue("fecha_registro", this.fechaRegistro);
            this.contactForm.get("nro_licencia").setValue(res.LicenciaNroLicencia);
            this.contactForm.get("centro_emision").setValue(res.NombreLocalImpresion);
            
            this.contactForm.get("nombres").setValue(res.ConductorApePaterno+' '+res.ConductorApeMaterno+' '+res.ConductorNombres);
            this.contactForm.get("domicilio").setValue(res.ConductorDireccion);
            this.contactForm.get("correo").setValue(res.ConductorEmail);
            this.contactForm.get("distrito").setValue(res.ConductorDistrito);
            this.contactForm.get("provincia").setValue(res.ConductorProvincia);
            this.contactForm.get("region").setValue(res.ConductorDepartamento);
            this.contactForm.get("telefono").setValue(res.ConductorTelefono);

            switch(res.NombreTramite){
              case "Nuevo": this.contactForm.get("tiposServicio").setValue("1"); break;
              case "Revalidacion": this.contactForm.get("tiposServicio").setValue("2"); break;
              case "Recategorizacion": this.contactForm.get("tiposServicio").setValue("3"); break;
              case "Duplicado": this.contactForm.get("tiposServicio").setValue("4"); break;
              default: break;
            }

            if(res.CodCategoria){
              this.contactForm.get("tiposLicencia").setValue(res.CodCategoria.toString());
            }
            
            this.contactForm.get("nombreES").setValue(res.CentroMedicoNombre);
            this.contactForm.get("certificadoES").setValue(res.CentroMedicoMCertificado);
            this.fechaES = this.dateFormatString(res.CentroMedicoFecha);
            this.setDateValue("fechaES", this.fechaES);

            this.contactForm.get("nombreEC").setValue(res.EscuelaNombre);
            this.contactForm.get("certificadoEC").setValue(res.EscuelaCertificado);
            this.fechaEC = this.dateFormatString(res.EscuelaFecha);
            this.setDateValue("fechaEC", this.fechaEC);

            this.contactForm.get("nombreCE").setValue(res.ReglasNombre);
            this.contactForm.get("certificadoCE").setValue(res.ReglasCertificado);
            this.fechaCE = this.dateFormatString(res.ReglasFecha);
            this.setDateValue("fechaCE", this.fechaCE);

            this.habilitarCampos();
          },
          (error) => {
            this.funcionesMtcService.ocultarCargando()
            .mensajeErrorConfirmar(`Error al consultar el servicio. ¿Desea ingresar los datos manualmente?`, "Error")
            .then(() => {
              this.habilitarCampos();
            });
          }
        );
      }
    }
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
    this.contactForm.get("tiposLicencia").setValue("0");

    this.contactForm.get("nombreES").setValue("");
    this.contactForm.get("certificadoES").setValue("");
    this.contactForm.get("fechaES").setValue("");
    this.contactForm.get("nombreEC").setValue("");
    this.contactForm.get("certificadoEC").setValue("");
    this.contactForm.get("fechaEC").setValue("");
    this.contactForm.get("nombreCE").setValue("");
    this.contactForm.get("certificadoCE").setValue("");
    this.contactForm.get("fechaCE").setValue("");

    this.fechaRegistro = "";
    this.fechaES = "";
    this.fechaEC = "";
    this.fechaCE = "";
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

  onChangeCanje(){
    this.contactForm.controls['tiposCanje'].setValue(this.tipoCanje);
    this.funcionesMtcService.mensajeError('No se puede modificar esta opción.');
  }

  onChangeLicencia(){
    this.contactForm.controls['tiposCanje'].setValue(this.tipoCanje);
    this.funcionesMtcService.mensajeError('No se puede modificar esta opción.');
  }

  guardarFormulario() {
  if(this.contactForm.controls['tiposServicio'].value == null || this.contactForm.controls['tiposServicio'].value < 1)
    return this.funcionesMtcService.mensajeError("No ha seleccionado un servicio.");
  if(this.contactForm.controls['tiposLicencia'].value == null || this.contactForm.controls['tiposLicencia'].value < 1)
    return this.funcionesMtcService.mensajeError("No ha seleccionado una licencia de conducir");

  let dataGuardar = {
    id: this.idFormularioMovimiento,
    tramiteReqId: this.dataInput.tramiteReqId,
    codigo: "17",
    formularioId: 6,
    codUsuario: "USUARIO",
    estado: 1,
    metaData: {
      seccion1: {
        nro_solicitud : this.contactForm.controls['nro_solicitud'].value,
        fecha_registro : this.fechaRegistro,
        nro_licencia : this.contactForm.controls['nro_licencia'].value,
        centro_emision : this.contactForm.controls['centro_emision'].value,

        tipoDocIdentidad :  this.contactForm.controls['tipoDocIdentidad'].value,
        numeroDocIdentidad :  this.contactForm.controls['numeroDocIdentidad'].value,
        nombres : this.contactForm.controls['nombres'].value,
        domicilio : this.contactForm.controls['domicilio'].value,
        correo : this.contactForm.controls['correo'].value ,
        distrito :  this.contactForm.controls['distrito'].value ,
        provincia : this.contactForm.controls['provincia'].value ,
        region : this.contactForm.controls['region'].value ,
        telefono :  this.contactForm.controls['telefono'].value,
      },
      seccion2: {
        servicio :  this.contactForm.controls['tiposServicio'].value,
        canje :  this.contactForm.controls['tiposCanje'].value,
        categoria :  this.contactForm.controls['tiposLicencia'].value,
      },
      seccion3: {   
        nombreES : this.contactForm.controls['nombreES'].value,
        certificadoES :  this.contactForm.controls['certificadoES'].value,
        fechaES :  this.fechaES,
        nombreEC : this.contactForm.controls['nombreEC'].value,
        certificadoEC : this.contactForm.controls['certificadoEC'].value,
        fechaEC :  this.fechaEC,
        nombreCE : this.contactForm.controls['nombreCE'].value,
        certificadoCE :this.contactForm.controls['certificadoCE'].value,
        fechaCE :  this.fechaCE,
      },
      seccion4: {
        acepto : this.contactForm.controls['acepto'].value,
      }
    }
  }

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
          modalRef.componentInstance.titleModal = "Vista Previa - Formulario 006/17";
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
        (dataFormulario: FormularioResponse) => {
          this.habilitarCampos();
          const metaData: any = JSON.parse(dataFormulario.metaData);

          this.idFormularioMovimiento = dataFormulario.formularioId;

          this.contactForm.get("nro_solicitud").setValue(metaData.seccion1.nro_solicitud);
          this.fechaRegistro = metaData.seccion1.fecha_registro;
          if(this.fechaRegistro != ""){
            const fecha = this.fechaRegistro.split("/");
            this.contactForm.controls["fecha_registro"].setValue({ day: parseInt(fecha[0]), month: parseInt(fecha[1]), year: parseInt(fecha[2]) });
          }
          this.contactForm.get("nro_licencia").setValue(metaData.seccion1.nro_licencia);
          this.contactForm.get("centro_emision").setValue(metaData.seccion1.centro_emision);

          this.contactForm.get("nombres").setValue(metaData.seccion1.nombres);
          this.contactForm.get("domicilio").setValue(metaData.seccion1.domicilio);
          this.contactForm.get("distrito").setValue(metaData.seccion1.distrito);
          this.contactForm.get("provincia").setValue(metaData.seccion1.provincia);
          this.contactForm.get("region").setValue(metaData.seccion1.region);
          this.contactForm.get("tipoDocIdentidad").setValue(metaData.seccion1.tipoDocIdentidad);
          this.contactForm.get("numeroDocIdentidad").setValue(metaData.seccion1.numeroDocIdentidad);
          this.contactForm.get("correo").setValue(metaData.seccion1.correo);
          this.contactForm.get("telefono").setValue(metaData.seccion1.telefono);

          this.contactForm.get("tiposServicio").setValue(metaData.seccion2.servicio);
          this.contactForm.get("tiposLicencia").setValue(metaData.seccion2.categoria);

          this.contactForm.get("nombreES").setValue(metaData.seccion3.nombreES);
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

          this.contactForm.get("acepto").setValue(metaData.seccion4.acepto);
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
