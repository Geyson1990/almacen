import { Component, OnInit, Input, ViewChild, Injectable  } from '@angular/core';
import { FormArray, UntypedFormBuilder, FormControl, UntypedFormGroup, RequiredValidator, Validators } from '@angular/forms';
import { NgbAccordionDirective , NgbModal,NgbActiveModal,NgbDateStruct, NgbDatepickerI18n, NgbDateParserFormatter, NgbDateAdapter  } from '@ng-bootstrap/ng-bootstrap';
import { Anexo003_B17Request } from 'src/app/core/models/Anexos/Anexo003_B17/Anexo003_B17Request';
import { Anexo003_B17Response } from 'src/app/core/models/Anexos/Anexo003_B17/Anexo003_B17Response';
import { Anexo003B17Service } from 'src/app/core/services/anexos/anexo003-b17.service';
import { FormularioTramiteService } from 'src/app/core/services/tramite/formulario-tramite.service';
import { AnexoTramiteService } from 'src/app/core/services/tramite/anexo-tramite.service';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { VisorPdfArchivosService } from 'src/app/core/services/tramite/visor-pdf-archivos.service';
import { VistaPdfComponent } from 'src/app/shared/components/vista-pdf/vista-pdf.component';
import { SeguridadService } from 'src/app/core/services/seguridad.service';
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
    const day = String(date.day).length > 1 ? date.day : "0"+ date.day;
    const month = String(date.month).length > 1 ? date.month : "0"+date.month;
    return date ? day + this.DELIMITER + month + this.DELIMITER + date.year : '';
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
///Fin de configurar Fechas//////////////////////////////////////////

@Component({
  selector: 'app-anexo003-b17',
  templateUrl: './anexo003-b17.component.html',
  styleUrls: ['./anexo003-b17.component.css'],
  providers: [
    // { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
    I18n, { provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n } // define custom NgbDatepickerI18n provider
  ]
})
//#endregion

export class Anexo003B17Component implements OnInit {

  ubicacionPlaceholder = "Avenida-Jirón-Calle / Nro.-Km. Mz. Lote / Localidad (Urbanización-P.J.-A.H.-Centro Poblado, etc.)";
  tipoSolicitante : string = "";
  disabledFechaVigencia : boolean = true;
  anexoFormulario: UntypedFormGroup;
  @Input() public dataInput: any;
  @Input() public dataRequisitosInput: any;

  codigoTupa: string = "" ;
  descripcionTupa: string;

  id: number = 0;
  uriArchivo: string = '';//PARA SABER EL NOMBRE DEL PDF (COMPLETO CON TODO Y ADJUNTOS)
  graboUsuario: boolean = false;
  dia:string = "";
  mes:string = "";
  anio:string = "";
  // fechaVigencia: NgbDateStruct = undefined;
  fechaVigencia:string = "";

  errorAlCargarData: boolean = false;//VARIABLE PARA CONTROLAR CUANDO OCURRE UN ERROR AL RECUPERAR LOS DATOS GUARDADOS DEL ANEXO

  visibleButtonS1Arrendado: boolean = false;
  filePdfS1ArrendadoSeleccionado: any = null;
  pathPdfS1ArrendadoSeleccionado: any = null;

  visibleButtonS2Arrendado: boolean = false;
  filePdfS2ArrendadoSeleccionado: any = null;
  pathPdfS2ArrendadoSeleccionado: any = null;

  @ViewChild('acc') acc: NgbAccordionDirective ;

  constructor(private fb: UntypedFormBuilder,
    private funcionesMtcService: FuncionesMtcService,
    private formularioTramiteService: FormularioTramiteService,
    private anexoTramiteService: AnexoTramiteService,
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private visorPdfArchivosService: VisorPdfArchivosService,
    private anexoService: Anexo003B17Service,
    private seguridadService: SeguridadService) { }

    ngOnInit(): void {

      this.uriArchivo = this.dataInput.rutaDocumento;
      this.id = this.dataInput.movId;

      if(this.seguridadService.getNameId() === '00001'){
          //persona natural
          this.tipoSolicitante = 'PN';
      }else if(this.seguridadService.getNameId() === '00002'){
          //persona juridica
          this.tipoSolicitante = 'PJ';
      }else {
          //persona natural con ruc
          this.tipoSolicitante = 'PN';
      }

      const tramite: any= JSON.parse(localStorage.getItem('tramite-selected'));

      this.codigoTupa = tramite.codigo;
      this.descripcionTupa = tramite.nombre;

      this.anexoFormulario = this.fb.group({
        s1_nombre: this.fb.control(""),
        s1_dni: this.fb.control(""),
        s1_nroRuc: this.fb.control(""),
        s1_domicilio: this.fb.control(""),
        s1_ubicacionInmueble: this.fb.control(""),
        s1_distrito: this.fb.control(""),
        s1_provincia: this.fb.control(""),
        s1_departamento: this.fb.control(""),
        s1_posesionPropio: [false],
        s1_posesionArrendado: [false],
        s1_fechaVigencia: this.fb.control(""),

        s2_nombre: this.fb.control(""),
        s2_dni: this.fb.control(""),
        s2_enCalidadDe : this.fb.control("Representante Legal"),
        s2_razonSocial : this.fb.control(""),
        s2_nroRuc:this.fb.control(""),
        s2_nroPartida: this.fb.control(""),
        s2_oficinaRegistral: this.fb.control(""),
        s2_domicilio: this.fb.control(""),
        s2_ubicacionInmueble: this.fb.control(""),
        s2_distrito:this.fb.control(""),
        s2_provincia: this.fb.control(""),
        s2_departamento:this.fb.control(""),
        s2_posesionPropio: [false],
        s2_posesionArrendado: [false],
        s2_fechaVigencia:this.fb.control(""),
        s2_usoPropio: [false],
        s2_usoCompartido: [false],
      });

      //VERIFICAMOS QUE EL FORMULARIO YA ESTÉ GRABADO
      for (let i = 0; i < this.dataRequisitosInput.length; i++) {
        if (this.dataInput.tramiteReqRefId === this.dataRequisitosInput[i].tramiteReqId) {
          if (this.dataRequisitosInput[i].movId === 0) {
            this.activeModal.close(this.graboUsuario);
            this.funcionesMtcService.mensajeError('Primero debe completar el primer registro');
            return;
          }
        }
      }

      setTimeout(() => {
          if(this.tipoSolicitante === "PN"){
              this.acc.expand('seccion-1');
          }else{
              this.acc.expand('seccion-2');
          }
      });

      this.cargarInformacion();
      this.loadPersona();

    }

    cargarInformacion(){

      this.funcionesMtcService.mostrarCargando();

        //si existe el documento pero no esta completo
        if (this.dataInput.movId > 0 && this.dataInput.completo === false) {
            this.heredarInformacionFormulario();
            //RECUPERAMOS Y CARGAMOS LOS DATOS DEL ANEXO A EXCEPCION DE LOS CAMPOS HEREDADOS DEL FORMULARIO
            this.anexoTramiteService.get<any>(this.dataInput.tramiteReqId).subscribe(
              (data: Anexo003_B17Response) => {

                this.funcionesMtcService.ocultarCargando();
                const metaData: any = JSON.parse(data.metaData);

                if(metaData.personaNatural){

                  this.tipoSolicitante = "PN";
                  this.anexoFormulario.controls['s1_posesionPropio'].setValue(metaData.seccion1.posesionPropio);
                  if(metaData.seccion1.posesionArrendado){
                    this.disabledFechaVigencia = false;
                    this.anexoFormulario.controls['s1_posesionArrendado'].setValue(true);
                    this.fechaVigencia = metaData.seccion1.fechaVigencia;
                    const fecha = this.fechaVigencia.split("/");
                    this.anexoFormulario.controls["s1_fechaVigencia"].setValue({ day: parseInt(fecha[0]), month: parseInt(fecha[1]), year: parseInt(fecha[2]) });
                    this.pathPdfS1ArrendadoSeleccionado = metaData.seccion1.pathNameArrendado;
                    this.visibleButtonS1Arrendado = true;
                  }

                }

                if(metaData.personaJuridica){
                  this.tipoSolicitante ="PJ";

                  this.anexoFormulario.controls['s2_enCalidadDe'].setValue(metaData.seccion2.enCalidadDe);
                  this.anexoFormulario.controls['s2_posesionPropio'].setValue(metaData.seccion2.posesionPropio);
                  if(metaData.seccion2.posesionArrendado){
                    this.disabledFechaVigencia = false;
                    this.anexoFormulario.controls['s2_posesionArrendado'].setValue(true);
                    this.fechaVigencia = metaData.seccion2.fechaVigencia;
                    const fecha = this.fechaVigencia.split("/");
                    this.anexoFormulario.controls["s2_fechaVigencia"].setValue({ day: parseInt(fecha[0]), month: parseInt(fecha[1]), year: parseInt(fecha[2]) });
                    this.pathPdfS2ArrendadoSeleccionado = metaData.seccion2.pathNameArrendado;
                    this.visibleButtonS2Arrendado = true;
                  }
                  this.anexoFormulario.controls['s2_usoPropio'].setValue(metaData.seccion2.usoPropio);
                  this.anexoFormulario.controls['s2_usoCompartido'].setValue(metaData.seccion2.usoCompartido);

                }

                this.dia = metaData.dia;
                this.mes = metaData.mes;
                this.anio = metaData.anio;

              },
              error => {
                this.errorAlCargarData = true;
                this.funcionesMtcService.ocultarCargando().mensajeError('Problemas para recuperar los datos guardados del anexo');
              }
            );
        }
        //si existe el documento y esta completo
        else if (this.dataInput.movId > 0 && this.dataInput.completo === true) {
          this.anexoTramiteService.get<any>(this.dataInput.tramiteReqId).subscribe(
            (data: Anexo003_B17Response) => {

              this.funcionesMtcService.ocultarCargando();
              const metaData: any = JSON.parse(data.metaData);
              if(metaData.personaNatural){
                this.tipoSolicitante = "PN";
                this.anexoFormulario.controls['s1_nombre'].setValue(metaData.seccion1.nombre);
                this.anexoFormulario.controls['s1_dni'].setValue(metaData.seccion1.dni);
                this.anexoFormulario.controls['s1_nroRuc'].setValue(metaData.seccion1.nroRuc);
                this.anexoFormulario.controls['s1_domicilio'].setValue(metaData.seccion1.domicilio);
                this.anexoFormulario.controls['s1_ubicacionInmueble'].setValue(metaData.seccion1.ubicacionInmueble);
                this.anexoFormulario.controls['s1_distrito'].setValue(metaData.seccion1.distrito);
                this.anexoFormulario.controls['s1_provincia'].setValue(metaData.seccion1.provincia);
                this.anexoFormulario.controls['s1_departamento'].setValue(metaData.seccion1.departamento);
                this.anexoFormulario.controls['s1_posesionPropio'].setValue(metaData.seccion1.posesionPropio);
                if(metaData.seccion1.posesionArrendado){
                  this.disabledFechaVigencia = false;
                  this.anexoFormulario.controls['s1_posesionArrendado'].setValue(true);
                  this.fechaVigencia = metaData.seccion1.fechaVigencia;
                  const fecha = this.fechaVigencia.split("/");
                  this.anexoFormulario.controls["s1_fechaVigencia"].setValue({ day: parseInt(fecha[0]), month: parseInt(fecha[1]), year: parseInt(fecha[2]) });
                  this.pathPdfS1ArrendadoSeleccionado = metaData.seccion1.pathNameArrendado;
                  this.visibleButtonS1Arrendado = true;

                }

              }

              if(metaData.personaJuridica){
                this.tipoSolicitante ="PJ";

                this.anexoFormulario.controls['s2_nombre'].setValue(metaData.seccion2.nombre);
                this.anexoFormulario.controls['s2_dni'].setValue(metaData.seccion2.dni);
                this.anexoFormulario.controls['s2_enCalidadDe'].setValue(metaData.seccion2.enCalidadDe);
                this.anexoFormulario.controls['s2_razonSocial'].setValue(metaData.seccion2.razonSocial);
                this.anexoFormulario.controls['s2_nroRuc'].setValue(metaData.seccion2.nroRuc);
                this.anexoFormulario.controls['s2_nroPartida'].setValue(metaData.seccion2.nroPartida);
                this.anexoFormulario.controls['s2_oficinaRegistral'].setValue(metaData.seccion2.oficinaRegistral);
                this.anexoFormulario.controls['s2_domicilio'].setValue(metaData.seccion2.domicilio);

                this.anexoFormulario.controls['s2_ubicacionInmueble'].setValue(metaData.seccion2.ubicacionInmueble);
                this.anexoFormulario.controls['s2_distrito'].setValue(metaData.seccion2.distrito);
                this.anexoFormulario.controls['s2_provincia'].setValue(metaData.seccion2.provincia);
                this.anexoFormulario.controls['s2_departamento'].setValue(metaData.seccion2.departamento);
                this.anexoFormulario.controls['s2_posesionPropio'].setValue(metaData.seccion2.posesionPropio);
                if(metaData.seccion2.posesionArrendado){
                  this.disabledFechaVigencia = false;
                  this.anexoFormulario.controls['s2_posesionArrendado'].setValue(true);
                  this.fechaVigencia = metaData.seccion2.fechaVigencia;
                  const fecha = this.fechaVigencia.split("/");
                  this.anexoFormulario.controls["s2_fechaVigencia"].setValue({ day: parseInt(fecha[0]), month: parseInt(fecha[1]), year: parseInt(fecha[2]) });
                  this.pathPdfS2ArrendadoSeleccionado = metaData.seccion2.pathNameArrendado;
                  this.visibleButtonS2Arrendado = true;
                }
                this.anexoFormulario.controls['s2_usoPropio'].setValue(metaData.seccion2.usoPropio);
                this.anexoFormulario.controls['s2_usoCompartido'].setValue(metaData.seccion2.usoCompartido);

              }

              this.dia = metaData.dia;
              this.mes = metaData.mes;
              this.anio = metaData.anio;

            },
            error => {
              this.errorAlCargarData = true;
              this.funcionesMtcService.ocultarCargando().mensajeError('Problemas para recuperar los datos guardados del anexo');
            }
          );

        }else{
            //si es un nuevo registro
            this.heredarInformacionFormulario();
        }
    }

    heredarInformacionFormulario(){
        this.formularioTramiteService.get(this.dataInput.tramiteReqRefId).subscribe(
          (data: any) =>{
            this.funcionesMtcService.ocultarCargando();
            const metaData: any = JSON.parse(data.metaData);
            const seccion1 = metaData.seccion1;

            this.dia = this.getDia();
            this.mes = this.getMes();
            this.anio = this.getAnio();

            if(seccion1.tipoSolicitante == "PN"){

              this.tipoSolicitante ="PN";
              this.anexoFormulario.controls['s1_nombre'].setValue(seccion1?.nombresApellidos?.toUpperCase().trim());
              this.anexoFormulario.controls['s1_dni'].setValue(seccion1?.numeroDocumento);
              this.anexoFormulario.controls['s1_nroRuc'].setValue("N/A");
              this.anexoFormulario.controls['s1_domicilio'].setValue(seccion1?.domicilioLegal);
              this.anexoFormulario.controls['s1_ubicacionInmueble'].setValue(seccion1.domicilioLegal);
              this.anexoFormulario.controls['s1_distrito'].setValue(seccion1.distrito);
              this.anexoFormulario.controls['s1_provincia'].setValue(seccion1.provincia);
              this.anexoFormulario.controls['s1_departamento'].setValue(seccion1.departamento);

            }

            if(seccion1.tipoSolicitante == "PJ"){

              this.tipoSolicitante ="PJ";

              this.anexoFormulario.controls['s2_nombre'].setValue(
                `${seccion1?.apePaternoRepresentanteLegal} ${seccion1?.apeMaternoRepresentanteLegal} ${seccion1?.nombreRepresentanteLegal}`);
              this.anexoFormulario.controls['s2_dni'].setValue(seccion1.nroDocumentoRepresentanteLegal);
              this.anexoFormulario.controls['s2_nroRuc'].setValue(seccion1.tipoDocumento == '06' ?  seccion1.numeroDocumento : "");
              this.anexoFormulario.controls['s2_razonSocial'].setValue(seccion1.razonSocial);
              this.anexoFormulario.controls['s2_nroPartida'].setValue(seccion1.partidaRepresentanteLegal);
              this.anexoFormulario.controls['s2_oficinaRegistral'].setValue(seccion1.oficinaRegistralRepresentanteLegal);
              this.anexoFormulario.controls['s2_domicilio'].setValue(seccion1.domicilioLegal);
              this.anexoFormulario.controls['s2_ubicacionInmueble'].setValue(seccion1.domicilioLegal);
              this.anexoFormulario.controls['s2_distrito'].setValue(seccion1.distrito);
              this.anexoFormulario.controls['s2_provincia'].setValue(seccion1.provincia);
              this.anexoFormulario.controls['s2_departamento'].setValue(seccion1.departamento);

            }

          },
          error => {
            this.funcionesMtcService
              .ocultarCargando().mensajeError('Problemas para recuperar los datos del Anexo 003-B/17');
          });
    }

    loadPersona(){
        if(this.tipoSolicitante === "PJ"){

            this.anexoFormulario.controls['s2_nombre'].setValidators([Validators.required]);
            this.anexoFormulario.controls['s2_dni'].setValidators([Validators.required]);
            this.anexoFormulario.controls['s2_enCalidadDe'].setValidators([Validators.required]);
            this.anexoFormulario.controls['s2_razonSocial'].setValidators([Validators.required]);
            this.anexoFormulario.controls['s2_nroRuc'].setValidators([Validators.required]);
            this.anexoFormulario.controls['s2_nroPartida'].setValidators([Validators.required]);
            this.anexoFormulario.controls['s2_oficinaRegistral'].setValidators([Validators.required]);
            this.anexoFormulario.controls['s2_domicilio'].setValidators([Validators.required]);
            this.anexoFormulario.controls['s2_ubicacionInmueble'].setValidators([Validators.required]);
            this.anexoFormulario.controls['s2_distrito'].setValidators([Validators.required]);
            this.anexoFormulario.controls['s2_provincia'].setValidators([Validators.required]);
            this.anexoFormulario.controls['s2_departamento'].setValidators([Validators.required]);

            this.anexoFormulario.controls['s2_nombre'].updateValueAndValidity();
            this.anexoFormulario.controls['s2_dni'].updateValueAndValidity();
            this.anexoFormulario.controls['s2_enCalidadDe'].updateValueAndValidity();
            this.anexoFormulario.controls['s2_razonSocial'].updateValueAndValidity();
            this.anexoFormulario.controls['s2_nroPartida'].updateValueAndValidity();
            this.anexoFormulario.controls['s2_oficinaRegistral'].updateValueAndValidity();
            this.anexoFormulario.controls['s2_domicilio'].updateValueAndValidity();
            this.anexoFormulario.controls['s2_ubicacionInmueble'].updateValueAndValidity();
            this.anexoFormulario.controls['s2_distrito'].updateValueAndValidity();
            this.anexoFormulario.controls['s2_provincia'].updateValueAndValidity();
            this.anexoFormulario.controls['s2_departamento'].updateValueAndValidity();

        }else{

            this.anexoFormulario.controls['s1_nombre'].setValidators([Validators.required]);
            this.anexoFormulario.controls['s1_dni'].setValidators([Validators.required]);
            this.anexoFormulario.controls['s1_domicilio'].setValidators([Validators.required]);
            this.anexoFormulario.controls['s1_ubicacionInmueble'].setValidators([Validators.required]);
            this.anexoFormulario.controls['s1_distrito'].setValidators([Validators.required]);
            this.anexoFormulario.controls['s1_provincia'].setValidators([Validators.required]);
            this.anexoFormulario.controls['s1_departamento'].setValidators([Validators.required]);

            this.anexoFormulario.controls['s1_nombre'].updateValueAndValidity();
            this.anexoFormulario.controls['s1_dni'].updateValueAndValidity();
            this.anexoFormulario.controls['s1_domicilio'].updateValueAndValidity();
            this.anexoFormulario.controls['s1_ubicacionInmueble'].updateValueAndValidity();
            this.anexoFormulario.controls['s1_distrito'].updateValueAndValidity();
            this.anexoFormulario.controls['s1_provincia'].updateValueAndValidity();
            this.anexoFormulario.controls['s1_departamento'].updateValueAndValidity();



        }
    }

    getMinDateVigencia(){
      const date = new Date();
      return {year: date.getFullYear(), month: date.getMonth() +1, day: date.getDate()}
    }
    getDia() {
      return ('0' + (new Date().getDate())).slice(-2);
    }
    getMes() {
      switch (new Date().getMonth()) {
        case 0: return 'Enero';
        case 1: return 'Febrero';
        case 2: return 'Marzo';
        case 3: return 'Abril';
        case 4: return 'Mayo';
        case 5: return 'Junio';
        case 6: return 'Julio';
        case 7: return 'Agosto';
        case 8: return 'Setiembre';
        case 9: return 'Octubre';
        case 10: return 'Noviembre';
        case 11: return 'Diciembre';
      }
    }
    getAnio() {
      return new Date().getFullYear().toString().substr(2);
    }

    onChangePosesion (ctrlChecked:string, ctrlNoChecked: string, seccion: number) : void {

      this.anexoFormulario.controls[ctrlChecked].setValue(true);
      this.anexoFormulario.controls[ctrlNoChecked].setValue(false);

      switch(seccion){
        case 1:
          if(ctrlChecked == "s1_posesionArrendado"){
            this.visibleButtonS1Arrendado = true;
            this.disabledFechaVigencia = false;
            if(this.filePdfS1ArrendadoSeleccionado === null && this.pathPdfS1ArrendadoSeleccionado === null){
              if (this.visibleButtonS1Arrendado === true) {
                this.funcionesMtcService.mensajeConfirmar('¿Declaro que la información adjunta en el archivo es verídica?', 'DECLARACIÓN').catch(() => {
                  this.visibleButtonS1Arrendado = false;
                  this.anexoFormulario.controls['s1_posesionArrendado'].setValue(false);
                });
              } else {
                this.filePdfS1ArrendadoSeleccionado = null;
                this.pathPdfS1ArrendadoSeleccionado = null;
              }
            }
          }else{
            this.disabledFechaVigencia = true;
            this.filePdfS1ArrendadoSeleccionado = null;
            this.pathPdfS1ArrendadoSeleccionado = null;
            this.visibleButtonS1Arrendado = false;
          }
          break;
        case 2:
          if(ctrlChecked == "s2_posesionArrendado"){
            this.visibleButtonS2Arrendado = true;
            this.disabledFechaVigencia = false;
            if(this.filePdfS2ArrendadoSeleccionado === null && this.pathPdfS2ArrendadoSeleccionado === null){
              if (this.visibleButtonS2Arrendado === true) {
                this.funcionesMtcService.mensajeConfirmar('¿Declaro que la información adjunta en el archivo es verídica?', 'DECLARACIÓN').catch(() => {
                  this.visibleButtonS2Arrendado = false;
                  this.anexoFormulario.controls['s2_posesionArrendado'].setValue(false);
                });
              } else {
                this.filePdfS2ArrendadoSeleccionado = null;
                this.pathPdfS2ArrendadoSeleccionado = null;
              }
            }
          }else{
            this.disabledFechaVigencia = true;
            this.filePdfS2ArrendadoSeleccionado = null;
            this.pathPdfS2ArrendadoSeleccionado = null;
            this.visibleButtonS2Arrendado = false;
          }
          break;
      }
    }

    onChangeUso (ctrlChecked:string, ctrlNoChecked: string) : void {
      this.anexoFormulario.controls[ctrlChecked].setValue(true);
      this.anexoFormulario.controls[ctrlNoChecked].setValue(false);
    }

    formInvalid(control: string) : boolean {
      return this.anexoFormulario.get(control).invalid && (this.anexoFormulario.get(control).dirty || this.anexoFormulario.get(control).touched);
    }

    onChangeInputS1Arrendado(event) {
      if (event.target.files.length === 0)
        return

      if (event.target.files[0].type !== 'application/pdf') {
        event.target.value = "";
        return this.funcionesMtcService.mensajeError("Solo puede adjuntar archivos PDF");
      }

      this.filePdfS1ArrendadoSeleccionado = event.target.files[0];
      event.target.value = "";
    }

    vistaPreviaS1Arrendado() {

      if (this.pathPdfS1ArrendadoSeleccionado === null){
          const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
          const urlPdf = URL.createObjectURL(this.filePdfS1ArrendadoSeleccionado);
          modalRef.componentInstance.pdfUrl = urlPdf;
          modalRef.componentInstance.titleModal = "Vista Previa - Contrato de Arrendamiento";
      }else{
        this.funcionesMtcService.mostrarCargando();

        this.visorPdfArchivosService.get(this.pathPdfS1ArrendadoSeleccionado)
          .subscribe(
            (file: Blob) => {
              this.funcionesMtcService.ocultarCargando();

              const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
              const urlPdf = URL.createObjectURL(file);
              modalRef.componentInstance.pdfUrl = urlPdf;
              modalRef.componentInstance.titleModal = "Vista Previa - Contrato de Arrendamiento";
            },
            error => {
              this.funcionesMtcService
                .ocultarCargando()
                .mensajeError('Problemas para descargar Pdf');
            }
          );
      }

    }

    onChangeInputS2Arrendado(event) {
      if (event.target.files.length === 0)
        return

      if (event.target.files[0].type !== 'application/pdf') {
        event.target.value = "";
        return this.funcionesMtcService.mensajeError("Solo puede adjuntar archivos PDF");
      }

      this.filePdfS2ArrendadoSeleccionado = event.target.files[0];
      event.target.value = "";
    }

    vistaPreviaS2Arrendado() {

      if (this.pathPdfS2ArrendadoSeleccionado === null){
          const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
          const urlPdf = URL.createObjectURL(this.filePdfS2ArrendadoSeleccionado);
          modalRef.componentInstance.pdfUrl = urlPdf;
          modalRef.componentInstance.titleModal = "Vista Previa - Contrato de Arrendamiento";
      }else{
        this.funcionesMtcService.mostrarCargando();

        this.visorPdfArchivosService.get(this.pathPdfS2ArrendadoSeleccionado)
          .subscribe(
            (file: Blob) => {
              this.funcionesMtcService.ocultarCargando();

              const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
              const urlPdf = URL.createObjectURL(file);
              modalRef.componentInstance.pdfUrl = urlPdf;
              modalRef.componentInstance.titleModal = "Vista Previa - Contrato de Arrendamiento";
            },
            error => {
              this.funcionesMtcService
                .ocultarCargando()
                .mensajeError('Problemas para descargar Pdf');
            }
          );
      }

    }

    verPdf() {
      if (this.id === 0)
        return this.funcionesMtcService.mensajeError('Debe guardar previamente los datos ingresados');

      if (!this.uriArchivo || this.uriArchivo == "" || this.uriArchivo == null)
        return this.funcionesMtcService.mensajeError('No se logró ubicar el archivo PDF');

      this.funcionesMtcService.mostrarCargando();

      this.visorPdfArchivosService.get(this.uriArchivo)
        .subscribe(
          (file: Blob) => {
            this.funcionesMtcService.ocultarCargando();

            const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
            const urlPdf = URL.createObjectURL(file);
            modalRef.componentInstance.pdfUrl = urlPdf;
            modalRef.componentInstance.titleModal = "Vista Previa - Anexo 003-B/17";
          },
          error => {
            this.funcionesMtcService
              .ocultarCargando()
              .mensajeError('Problemas para visualizar el archivo PDF');
          }
        );
    }

    onDateSelectVigenciaArrendamiento(event) :void {
      let year = event.year.toString();
      let month = ('0'+event.month).slice(-2);
      let day = ('0'+event.day).slice(-2);
      this.fechaVigencia = day + "/" + month + "/" + year;
  }

    guardarAnexo() {
      if (this.anexoFormulario.invalid)
        return this.funcionesMtcService.mensajeError('Debe ingresar todos los campos obligatorios');

      if(this.tipoSolicitante == "PN"){
        if(!this.anexoFormulario.get("s1_posesionPropio").value && !this.anexoFormulario.get("s1_posesionArrendado").value)
          return this.funcionesMtcService.mensajeError('Indique la posesión del inmueble');
        if(this.anexoFormulario.get("s1_posesionArrendado").value && this.fechaVigencia == "")
          return this.funcionesMtcService.mensajeError('Ingrese la vigencia del arrendamiento');

        if(!this.anexoFormulario.get("s1_posesionPropio") || this.anexoFormulario.get("s1_posesionArrendado").value){
          if (!this.filePdfS1ArrendadoSeleccionado && !this.pathPdfS1ArrendadoSeleccionado)
            return this.funcionesMtcService.mensajeError('Debe adjuntar el contrato de arrendamiento.');
        }

      }

      if(this.tipoSolicitante == "PJ"){
        if(!this.anexoFormulario.get("s2_posesionPropio").value && !this.anexoFormulario.get("s2_posesionArrendado").value)
          return this.funcionesMtcService.mensajeError('Indique la posesión del inmueble');
        if(this.anexoFormulario.get("s2_posesionArrendado").value && this.fechaVigencia == "")
          return this.funcionesMtcService.mensajeError('Ingrese la vigencia del arrendamiento');
        if(!this.anexoFormulario.get("s2_usoPropio").value && !this.anexoFormulario.get("s2_usoCompartido").value)
          return this.funcionesMtcService.mensajeError('Indique la posesión del inmueble');

        if(!this.anexoFormulario.get("s2_posesionPropio") || this.anexoFormulario.get("s2_posesionArrendado").value){
          if (!this.filePdfS2ArrendadoSeleccionado && !this.pathPdfS2ArrendadoSeleccionado)
            return this.funcionesMtcService.mensajeError('Debe adjuntar el contrato de arrendamiento.');
        }

      }

      const dataGuardar: Anexo003_B17Request = new Anexo003_B17Request();
      dataGuardar.id = this.id;
      dataGuardar.anexoId = 3;
      dataGuardar.codigo = "B";
      dataGuardar.movimientoFormularioId = 17;
      dataGuardar.tramiteReqId = this.dataInput.tramiteReqId;

      dataGuardar.metaData.personaNatural = this.tipoSolicitante == "PN" ? true : false;
      dataGuardar.metaData.personaJuridica = this.tipoSolicitante == "PJ" ? true : false;
      dataGuardar.metaData.dia = this.dia;
      dataGuardar.metaData.mes = this.mes;
      dataGuardar.metaData.anio = this.anio;

      dataGuardar.metaData.seccion1.nombre = this.anexoFormulario.controls['s1_nombre'].value;
      dataGuardar.metaData.seccion1.dni = this.anexoFormulario.controls['s1_dni'].value;
      dataGuardar.metaData.seccion1.nroRuc = this.anexoFormulario.controls['s1_nroRuc'].value;
      dataGuardar.metaData.seccion1.domicilio = this.anexoFormulario.controls['s1_domicilio'].value;
      dataGuardar.metaData.seccion1.ubicacionInmueble = this.anexoFormulario.controls['s1_ubicacionInmueble'].value;
      dataGuardar.metaData.seccion1.distrito = this.anexoFormulario.controls['s1_distrito'].value;
      dataGuardar.metaData.seccion1.provincia = this.anexoFormulario.controls['s1_provincia'].value;
      dataGuardar.metaData.seccion1.departamento = this.anexoFormulario.controls['s1_departamento'].value;
      dataGuardar.metaData.seccion1.posesionPropio = this.anexoFormulario.controls['s1_posesionPropio'].value;
      dataGuardar.metaData.seccion1.posesionArrendado = this.anexoFormulario.controls['s1_posesionArrendado'].value;
      dataGuardar.metaData.seccion1.fechaVigencia = this.anexoFormulario.controls['s1_posesionArrendado'].value ? this.fechaVigencia : "";
      dataGuardar.metaData.seccion1.fileArrendado = this.filePdfS1ArrendadoSeleccionado;
      dataGuardar.metaData.seccion1.pathNameArrendado = this.pathPdfS1ArrendadoSeleccionado;

      dataGuardar.metaData.seccion2.nombre = this.anexoFormulario.controls['s2_nombre'].value;
      dataGuardar.metaData.seccion2.dni = this.anexoFormulario.controls['s2_dni'].value;
      dataGuardar.metaData.seccion2.enCalidadDe = this.anexoFormulario.controls['s2_enCalidadDe'].value;
      dataGuardar.metaData.seccion2.razonSocial = this.anexoFormulario.controls['s2_razonSocial'].value;
      dataGuardar.metaData.seccion2.nroRuc = this.anexoFormulario.controls['s2_nroRuc'].value;
      dataGuardar.metaData.seccion2.nroPartida = this.anexoFormulario.controls['s2_nroPartida'].value;
      dataGuardar.metaData.seccion2.oficinaRegistral = this.anexoFormulario.controls['s2_oficinaRegistral'].value;
      dataGuardar.metaData.seccion2.domicilio = this.anexoFormulario.controls['s2_domicilio'].value;
      dataGuardar.metaData.seccion2.ubicacionInmueble = this.anexoFormulario.controls['s2_ubicacionInmueble'].value;
      dataGuardar.metaData.seccion2.distrito = this.anexoFormulario.controls['s2_distrito'].value;
      dataGuardar.metaData.seccion2.provincia = this.anexoFormulario.controls['s2_provincia'].value;
      dataGuardar.metaData.seccion2.departamento = this.anexoFormulario.controls['s2_departamento'].value;
      dataGuardar.metaData.seccion2.posesionPropio = this.anexoFormulario.controls['s2_posesionPropio'].value;
      dataGuardar.metaData.seccion2.posesionArrendado = this.anexoFormulario.controls['s2_posesionArrendado'].value;
      dataGuardar.metaData.seccion2.fechaVigencia = this.anexoFormulario.controls['s2_posesionArrendado'].value ? this.fechaVigencia : "";
      dataGuardar.metaData.seccion2.usoPropio = this.anexoFormulario.controls['s2_usoPropio'].value;
      dataGuardar.metaData.seccion2.usoCompartido = this.anexoFormulario.controls['s2_usoCompartido'].value;
      dataGuardar.metaData.seccion2.fileArrendado = this.filePdfS2ArrendadoSeleccionado;
      dataGuardar.metaData.seccion2.pathNameArrendado = this.pathPdfS2ArrendadoSeleccionado;

      const dataGuardarFormData = this.funcionesMtcService.jsonToFormData(dataGuardar);

      this.funcionesMtcService.mensajeConfirmar(`¿Está seguro de ${this.id === 0 ? 'guardar' : 'modificar'} los datos ingresados?`)
      .then(() => {

        this.funcionesMtcService.mostrarCargando();

        if (this.id === 0) {
          //GUARDAR:
          this.anexoService.post<any>(dataGuardarFormData)
            .subscribe(
              data => {
                this.funcionesMtcService.ocultarCargando();
                this.id = data.id;
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
          this.anexoService.put<any>(dataGuardarFormData)
            .subscribe(
              data => {
                this.funcionesMtcService.ocultarCargando();
                this.id = data.id;
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
}
