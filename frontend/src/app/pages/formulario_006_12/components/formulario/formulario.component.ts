/**
 * Formulario 006/12 utilizado por los procedimientos DGAC-018 Y S-DGAC-008
 * @author Alicia Toquila Quispe
 * @version 1.0 20.11.2021
*/
import { Component, OnInit, Injectable, ViewChild,  Input } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbAccordionDirective , NgbModal, NgbDateStruct, NgbDatepickerI18n, NgbDateParserFormatter, NgbDateAdapter } from '@ng-bootstrap/ng-bootstrap';
import { TramiteService } from 'src/app/core/services/tramite/tramite.service';
import { OficinaRegistralService } from '../../../../core/services/servicios/oficinaregistral.service';
import { FuncionesMtcService } from '../../../../core/services/funciones-mtc.service';
import { SeguridadService } from '../../../../core/services/seguridad.service';
import { TipoDocumentoModel } from 'src/app/core/models/TipoDocumentoModel';
import { RepresentanteLegal } from 'src/app/core/models/SunatModel';
import { ReniecService } from 'src/app/core/services/servicios/reniec.service';
import { ExtranjeriaService } from 'src/app/core/services/servicios/extranjeria.service';
import { FormularioTramiteService } from 'src/app/core/services/tramite/formulario-tramite.service';
import { Formulario006_12Request } from 'src/app/core/models/Formularios/Formulario006_12/Formulario006_12Request';
import { Formulario006_12Response } from 'src/app/core/models/Formularios/Formulario006_12/Formulario006_12Response';
import { Formulario00612Service } from '../../../../core/services/formularios/formulario006-12.service';
import { SunatService } from 'src/app/core/services/servicios/sunat.service';
import { VisorPdfArchivosService } from '../../../../core/services/tramite/visor-pdf-archivos.service';
import { VistaPdfComponent } from '../../../../shared/components/vista-pdf/vista-pdf.component';
import { defaultRadioGroupAppearanceProvider } from 'pdf-lib';
import { RenatService } from 'src/app/core/services/servicios/renat.service';
import { exactLengthValidator, noWhitespaceValidator } from 'src/app/helpers/validator';

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css']
})
export class FormularioComponent implements OnInit {

  @Input() public dataInput: any;
  @Input() public dataRequisitosInput: any;
  @ViewChild('acc') acc: NgbAccordionDirective ;

  disabled: boolean = true;
  graboUsuario: boolean = false;

  codigoProcedimientoTupa: string;
  descProcedimientoTupa: string;
  tramiteSelected: string;
  codigoTipoSolicitudTupa:string;
  descTipoSolicitudTupa:string;

  txtTitulo:string = '';
  id: number = 0;
  uriArchivo: string = '';//PARA SABER EL NOMBRE DEL PDF (COMPLETO CON TODO Y ADJUNTOS)
  tipoDocumentoValidForm: string;
  formulario: UntypedFormGroup;
  listaTiposDocumentos: TipoDocumentoModel[] = [
    { id: "01", documento: 'DNI' },
    { id: "04", documento: 'Carnet de Extranjería' },
  ];
  representanteLegal: RepresentanteLegal[] = [];
  activarDatosGenerales: boolean=false;
  esRepresentante: boolean = false;
  tipoDocumento: TipoDocumentoModel;
  oficinasRegistral: any = [];

  nroDocumentoLogin: string;
  nombreUsuario: string;
  personaJuridica: boolean = false;
  nroRuc:string = "";
  razonSocial: string;
  filePdfPathName: string = null;
  cargoRepresentanteLegal:string="";

  tipoSolicitante: string = "";
  codTipoDocSolicitante: string = ""; // 01 DNI  03 CI  04 CE

  visibleButtonMemoriaDescriptiva: boolean = false;
  filePdfMemoriaDescriptivaSeleccionado: any = null;
  pathPdfMemoriaDescriptivaSeleccionado: any = null;

  visibleButtonImpactoAmbiental: boolean = false;
  filePdfImpactoAmbientalSeleccionado: any = null;
  pathPdfImpactoAmbientalSeleccionado: any = null;

  //Datos de Formulario
  titulo = 'FORMULARIO 006/12 SERVICIOS ESPECIALIZADOS AEROPORTUARIOS';
  tipoPersona: number = 1 ;

  paSeccion1: string[]=["DGAC-018","S-DGAC-008"];
  paSeccion11:string[]=["DGAC-018"];
  paSeccion2: string[]=["DGAC-018","S-DGAC-008"];
  paSeccion3: string[]=["DGAC-018","S-DGAC-008"];
  paSeccion4: string[]=["DGAC-018","S-DGAC-008"];

  habilitarSeccion1:boolean=true;
  habilitarSeccion11:boolean=true;
  habilitarSeccion2:boolean=true;
  habilitarSeccion3:boolean=true;
  habilitarSeccion4:boolean=true;

  paDJ1: string[]=["DGAC-018","S-DGAC-008"];
  paDJ2: string[]=["DGAC-018","S-DGAC-008"];

  activarDJ1: boolean=true;
  activarDJ2: boolean=true;

  activarPN: boolean=false;
  activarPJ: boolean=false;

  servicio:string="1";

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
    private formularioService: Formulario00612Service,
    private visorPdfArchivosService: VisorPdfArchivosService,
    private modalService: NgbModal,
    private sunatService: SunatService) {
  }

  ngOnInit(): void {
    const tramiteSelected: any= JSON.parse(localStorage.getItem('tramite-selected'));
    this.codigoProcedimientoTupa =  tramiteSelected.codigo;
    this.descProcedimientoTupa = tramiteSelected.nombre;
    this.codigoTipoSolicitudTupa = (this.dataInput.tipoSolicitudTupaCod==""?"0":this.dataInput.tipoSolicitudTupaCod);
    this.descTipoSolicitudTupa = this.dataInput.tipoSolicitudTupaDesc;

    console.log("Codigo Tipo Solicitud: " + this.codigoTipoSolicitudTupa);
    console.log("Descripcion Tipo Solicitud: "+ this.descTipoSolicitudTupa);

    this.uriArchivo = this.dataInput.rutaDocumento;
    this.id = this.dataInput.movId;

    if(this.paSeccion1.indexOf(this.codigoProcedimientoTupa)>-1) this.habilitarSeccion1=true; else this.habilitarSeccion1=false;
    if(this.paSeccion11.indexOf(this.codigoProcedimientoTupa)>-1) this.habilitarSeccion11=true; else this.habilitarSeccion11=false;
    if(this.paSeccion2.indexOf(this.codigoProcedimientoTupa)>-1) this.habilitarSeccion2=true; else this.habilitarSeccion2=false;
    if(this.paSeccion3.indexOf(this.codigoProcedimientoTupa)>-1) this.habilitarSeccion3=true; else this.habilitarSeccion3=false;
    if(this.paSeccion4.indexOf(this.codigoProcedimientoTupa)>-1) this.habilitarSeccion4=true; else this.habilitarSeccion4=false;
    if(this.paDJ1.indexOf(this.codigoProcedimientoTupa)>-1) this.activarDJ1=true; else this.activarDJ1=false;
    if(this.paDJ2.indexOf(this.codigoProcedimientoTupa)>-1) this.activarDJ2=true; else this.activarDJ2=false;

    this.formulario = this.fb.group({
      procedimiento           : this.fb.control({value:this.codigoProcedimientoTupa, disabled:true} ),
      licencia                : this.fb.control("", [Validators.required]),
      municipalidad           : this.fb.control("", [Validators.required]),
      habilitaciones          : this.fb.control("", [Validators.required]),
      sedes                   : this.fb.control("", [Validators.required]),
      oficio_dgac             : this.fb.control("", [Validators.required]),

      modalidadNotificacion   : this.fb.control("", [Validators.required]),

      tipoDocumentoSolicitante: this.fb.control(""),
      nroDocumentoSolicitante : this.fb.control(""),
      rucPersona              : this.fb.control(""),
      nombresPersona          : this.fb.control(""),
      domicilioPersona        : this.fb.control(""),
      distritoPersona         : this.fb.control(""),
      provinciaPersona        : this.fb.control(""),
      departamentoPersona     : this.fb.control(""),
      telefonoPersona         : this.fb.control(""),
      celularPersona          : this.fb.control(""),
      correoPersona           : this.fb.control(""),

      ruc                     : this.fb.control({value:'', disabled:true}, [Validators.required, exactLengthValidator([11])]),
      razonSocial             : this.fb.control({value:'', disabled:true}, [Validators.required]),
      domicilio               : this.fb.control("", [Validators.required, noWhitespaceValidator(), Validators.maxLength(250)]),
      distrito                : this.fb.control("", [Validators.required]),
      provincia               : this.fb.control("", [Validators.required]),
      departamento            : this.fb.control("", [Validators.required]),
      tipoDocumento           : this.fb.control("", [Validators.required]),
      numeroDocumento         : this.fb.control("", [Validators.required, exactLengthValidator([8, 9])]),
      nombreRepresentante     : this.fb.control("", [Validators.required, noWhitespaceValidator(), Validators.maxLength(100)]),
      apePaternoRepresentante : this.fb.control("", [Validators.required, noWhitespaceValidator(), Validators.maxLength(50)]),
      apeMaternoRepresentante : this.fb.control("", [Validators.required, noWhitespaceValidator(), Validators.maxLength(50)]),
      domicilioRepresentante  : this.fb.control("", [Validators.required, noWhitespaceValidator(), Validators.maxLength(200)]),
      telefonoRepresentante   : this.fb.control("", [Validators.maxLength(11)]),
      celularRepresentante    : this.fb.control("", [Validators.required, exactLengthValidator([9])]),
      correoRepresentante     : this.fb.control("", [Validators.required, Validators.email, noWhitespaceValidator(), Validators.maxLength(50)]),
      distritoRepresentante   : this.fb.control("", [Validators.required]),
      provinciaRepresentante  : this.fb.control("", [Validators.required]),
      departamentoRepresentante:this.fb.control("", [Validators.required]),
      oficinaRepresentante    : this.fb.control("", [Validators.required]),
      partidaRepresentante    : this.fb.control("", [Validators.required, Validators.maxLength(15)]),
      asientoRepresentante    : this.fb.control("", [Validators.required, Validators.maxLength(15)]),

      declaracion_1          : this.fb.control(false,[Validators.requiredTrue]),
      declaracion_2          : this.fb.control(false,[Validators.requiredTrue]),
    });

    this.cargarOficinaRegistral();
    this.nroRuc = this.seguridadService.getCompanyCode();
    this.razonSocial = this.seguridadService.getUserName();       //nombre de usuario login
    const tipoDocumento = this.seguridadService.getNameId();   //tipo de documento usuario login
    this.nroDocumentoLogin = this.seguridadService.getNumDoc();    //nro de documento usuario login
    this.tipoDocumentoValidForm = tipoDocumento;
    console.log("TIPO DOCUMENTO", tipoDocumento); //00001
    console.log("NUMERO", this.nroDocumentoLogin);

    switch (tipoDocumento){
      case "00001":case "00004":case "00005":
        this.formulario.controls["ruc"].clearValidators();
        this.formulario.controls["razonSocial"].clearValidators();
        this.formulario.controls["domicilio"].clearValidators();
        this.formulario.controls["departamento"].clearValidators();
        this.formulario.controls["provincia"].clearValidators();
        this.formulario.controls["distrito"].clearValidators();
        this.formulario.controls["tipoDocumento"].clearValidators();
        this.formulario.controls["numeroDocumento"].clearValidators();
        this.formulario.controls["nombreRepresentante"].clearValidators();
        this.formulario.controls["apePaternoRepresentante"].clearValidators();
        this.formulario.controls["apeMaternoRepresentante"].clearValidators();
        this.formulario.controls["telefonoRepresentante"].clearValidators();
        this.formulario.controls["celularRepresentante"].clearValidators();
        this.formulario.controls["correoRepresentante"].clearValidators();
        this.formulario.controls['domicilioRepresentante'].clearValidators();
        this.formulario.controls['distritoRepresentante'].clearValidators();
        this.formulario.controls['provinciaRepresentante'].clearValidators();
        this.formulario.controls['departamentoRepresentante'].clearValidators();
        this.formulario.controls['oficinaRepresentante'].clearValidators();
        this.formulario.controls['partidaRepresentante'].clearValidators();
        this.formulario.controls['asientoRepresentante'].clearValidators();
        this.formulario.updateValueAndValidity();

        this.activarPN=true;
        this.activarPJ=false;
        break;

      case "00002":
        this.formulario.controls["tipoDocumentoSolicitante"].clearValidators();
        this.formulario.controls["nroDocumentoSolicitante"].clearValidators();
        this.formulario.controls["rucPersona"].clearValidators();
        this.formulario.controls["nombresPersona"].clearValidators();
        this.formulario.controls["domicilioPersona"].clearValidators();
        this.formulario.controls["distritoPersona"].clearValidators();
        this.formulario.controls["provinciaPersona"].clearValidators();
        this.formulario.controls["departamentoPersona"].clearValidators();
        this.formulario.controls["telefonoPersona"].clearValidators();
        this.formulario.controls["celularPersona"].clearValidators();
        this.formulario.controls["correoPersona"].clearValidators();
        this.formulario.updateValueAndValidity();

        this.activarPN=false;
        this.activarPJ=true;

        break;
    }

    if(this.codigoProcedimientoTupa=="S-DGAC-008"){
      this.formulario.controls["licencia"].clearValidators();
      this.formulario.controls["municipalidad"].clearValidators();
      this.formulario.controls["habilitaciones"].clearValidators();
      this.formulario.controls["sedes"].clearValidators();
    }

    this.cargarDatos();
    this.recuperarDatosUsuario();

    if(this.activarDatosGenerales){ //empresa extranjera
      if(tipoDocumento==="00002" || tipoDocumento==="00001")
      this.funcionesMtcService.mensajeError('Este procedimiento lo realiza una PERSONA NATURAL CON RUC.');
    }

    if(!this.activarDJ1){this.formulario.controls["declaracion_1"].clearValidators();}
    if(!this.activarDJ2){this.formulario.controls["declaracion_2"].clearValidators();}

    setTimeout(() => {
      if(this.habilitarSeccion1===true){
        this.acc.expand('seccion-1');
      }else{
        this.acc.collapse('seccion-1');
        document.querySelector('button[aria-controls=seccion-1]').parentElement.parentElement.classList.add('acordeon-bloqueado');
      }

      if(this.habilitarSeccion2===true){
        this.acc.expand('seccion-2');
      }else{
        this.acc.collapse('seccion-2');
        document.querySelector('button[aria-controls=seccion-2]').parentElement.parentElement.classList.add('acordeon-bloqueado');
      }

      if(this.habilitarSeccion3===true){
        this.acc.expand('seccion-3');
      }else{
        this.acc.collapse('seccion-3');
        document.querySelector('button[aria-controls=seccion-3]').parentElement.parentElement.classList.add('acordeon-bloqueado');
      }

      if(this.habilitarSeccion4===true){
        this.acc.expand('seccion-4');
      }else{
        this.acc.collapse('seccion-4');
        document.querySelector('button[aria-controls=seccion-4]').parentElement.parentElement.classList.add('acordeon-bloqueado');
      }
    });
  }

  cargarOficinaRegistral(){
    this._oficinaRegistral.oficinaRegistral().subscribe(
      (dataOficinaRegistral) => {
        this.oficinasRegistral = dataOficinaRegistral;
        this.funcionesMtcService.ocultarCargando();
      },
        error => {
          this.funcionesMtcService.ocultarCargando().mensajeError('Problemas para conectarnos con el servicio y recuperar datos de la oficina registral');
        });
  }

  onChangeTipoDocumento() {
    const tipoDocumento: string = this.formulario.controls['tipoDocumento'].value.trim();
    const apellMatR =   this.formulario.controls['apeMaternoRepresentante'];

    if(tipoDocumento ==='04'){

       this.disabled = false;
       apellMatR.setValidators(null);
       apellMatR.updateValueAndValidity();
    }else{
       apellMatR.setValidators([Validators.required]);
       apellMatR.updateValueAndValidity();
       this.disabled = true;
    }

    this.formulario.controls['numeroDocumento'].setValue('');
    this.inputNumeroDocumento();
  }

  getMaxLengthNumeroDocumento() {
    const tipoDocumento: string = this.formulario.controls['tipoDocumento'].value.trim();

    if (tipoDocumento === '01')//N° de DNI
      return 8;
    else if (tipoDocumento === '04')//Carnet de extranjería
      return 12;
    return 0
  }

  inputNumeroDocumento(event = undefined) {
    if (event)
      event.target.value = event.target.value.replace(/[^0-9]/g, '');

    this.formulario.controls['nombreRepresentante'].setValue('');
    this.formulario.controls['apePaternoRepresentante'].setValue('');
    this.formulario.controls['apeMaternoRepresentante'].setValue('');
    this.formulario.controls['nombreRepresentante'].disable();
    this.formulario.controls['apePaternoRepresentante'].disable();
    this.formulario.controls['apeMaternoRepresentante'].disable();
  }

  buscarNumeroDocumento() {

    const tipoDocumento: string = this.formulario.controls['tipoDocumento'].value.trim();
    const numeroDocumento: string = this.formulario.controls['numeroDocumento'].value.trim();

    if (tipoDocumento.length === 0 || numeroDocumento.length === 0)
      return this.funcionesMtcService.mensajeError('Debe ingresar Tipo de Documento y/o Número de Documento');
    if (tipoDocumento === '01' && numeroDocumento.length !== 8)
      return this.funcionesMtcService.mensajeError('DNI debe tener 8 caracteres');

    const resultado = this.representanteLegal.find( representante =>  ('0'+representante.tipoDocumento.trim()).toString() === tipoDocumento && representante.nroDocumento.trim() === numeroDocumento );
    if (resultado) {//DNI
     /* this.esRepresentante = false;
    }else{
      this.esRepresentante = true;
       // return this.funcionesMtcService.mensajeError('Representante legal no encontrado');
    }*/
    this.funcionesMtcService.mostrarCargando();

    if (tipoDocumento === '01') {//DNI
      this.reniecService.getDni(numeroDocumento).subscribe(
        (respuesta) => {
          this.funcionesMtcService.ocultarCargando();

          if (respuesta.reniecConsultDniResponse.listaConsulta.coResultado !== '0000')
            return this.funcionesMtcService.mensajeError('Número de documento no registrado en Reniec');

          const datosPersona = respuesta.reniecConsultDniResponse.listaConsulta.datosPersona;
          let ubigeo = datosPersona.ubigeo.split('/');
          let cargo = resultado.cargo.split('-');
          this.cargoRepresentanteLegal = cargo[cargo.length-1].trim();
          this.addPersona(tipoDocumento,
            datosPersona.prenombres,
            datosPersona.apPrimer,
            datosPersona.apSegundo,
            datosPersona.direccion,
            ubigeo[2],
            ubigeo[1],
            ubigeo[0]);
        },
        (error) => {
          this.funcionesMtcService.ocultarCargando().mensajeError('Error al consultar al servicio');
          this.formulario.controls["nombreRepresentante"].enable();
          this.formulario.controls["apePaternoRepresentante"].enable();
          this.formulario.controls["apeMaternoRepresentante"].enable();
        }
      );

    } else if (tipoDocumento === '04') {//CARNÉ DE EXTRANJERÍA
      console.log("=====>");
      this.extranjeriaService.getCE(numeroDocumento).subscribe(
        (respuesta) => {
          console.log("*****");
          this.funcionesMtcService.ocultarCargando();

          if (respuesta.CarnetExtranjeria.numRespuesta !== '0000')
            return this.funcionesMtcService.mensajeError('Número de documento no registrado en Migraciones');

            this.addPersona(tipoDocumento,
              respuesta.CarnetExtranjeria.nombres,
              respuesta.CarnetExtranjeria.primerApellido,
              respuesta.CarnetExtranjeria.segundoApellido,
              '',
              '',
              '',
              '');
        },
        (error) => {
          this.funcionesMtcService.ocultarCargando().mensajeError('Error al consultar al servicio');
          this.formulario.controls["nombreRepresentante"].enable();
          this.formulario.controls["apePaternoRepresentante"].enable();
          this.formulario.controls["apeMaternoRepresentante"].enable();
        }
      );
    }
    }else{
      this.esRepresentante = false;
      return this.funcionesMtcService.mensajeError('Representante legal no encontrado');
    }

  }

  addPersona(tipoDocumento: string, nombres: string, ap_paterno: string, ap_materno: string, direccion: string, distrito: string, provincia: string, departamento: string) {

    this.funcionesMtcService.mensajeConfirmar(`Los datos ingresados fueron validados por ${tipoDocumento === '01' ? 'RENIEC' : 'MIGRACIONES'} corresponden a la persona ${nombres} ${ap_paterno} ${ap_materno}. ¿Está seguro de agregarlo?`)
      .then(() => {
        this.formulario.controls['nombreRepresentante'].setValue(nombres);
        this.formulario.controls['apePaternoRepresentante'].setValue(ap_paterno);
        this.formulario.controls['apeMaternoRepresentante'].setValue(ap_materno);
        this.formulario.controls['domicilioRepresentante'].setValue(direccion);
        this.formulario.controls['distritoRepresentante'].setValue(distrito);
        this.formulario.controls['provinciaRepresentante'].setValue(provincia);
        this.formulario.controls['departamentoRepresentante'].setValue(departamento);
      });
  }

  cargarDatos(){
        this.funcionesMtcService.mostrarCargando();

        this.formulario.controls["nombreRepresentante"].disable();
        this.formulario.controls["apePaternoRepresentante"].disable();
        this.formulario.controls["apeMaternoRepresentante"].disable();

        switch (this.seguridadService.getNameId()){
          case '00001' :this.tipoSolicitante = 'PN'; //persona natural
                        this.formulario.controls['tipoDocumentoSolicitante'].setValue('DNI');
                        this.codTipoDocSolicitante = '01';
                        break;

          case '00002' :this.tipoSolicitante = 'PJ'; // persona juridica
                        this.formulario.controls['tipoDocumentoSolicitante'].setValue('DNI');
                        break;

          case '00004' :this.tipoSolicitante = 'PE'; // persona extranjera
                        this.formulario.controls['tipoDocumentoSolicitante'].setValue('CARNET DE EXTRANJERIA');
                        this.codTipoDocSolicitante = '04';
                        break;

          case '00005' :this.tipoSolicitante = 'PNR'; // persona natural con ruc
                        this.formulario.controls['tipoDocumentoSolicitante'].setValue('DNI');
                        this.codTipoDocSolicitante = '01';
                        break;
        }

        if(this.dataInput != null && this.dataInput.movId > 0){

          this.formularioTramiteService.get<any>(this.dataInput.tramiteReqId).subscribe(
            (dataFormulario: Formulario006_12Response) => {
              this.funcionesMtcService.ocultarCargando();
              const metaData: any = JSON.parse(dataFormulario.metaData);

              this.id = dataFormulario.formularioId;
              this.filePdfPathName = metaData.pathName;

              if(this.codigoProcedimientoTupa=="DGAC-018"){
                this.formulario.controls["licencia"].setValue(metaData.seccion1.licencia);
                this.formulario.controls["municipalidad"].setValue(metaData.seccion1.municipalidad);
              }

              this.formulario.controls["habilitaciones"].setValue(metaData.seccion1.habilitaciones);
              this.formulario.controls["sedes"].setValue(metaData.seccion1.sedes);
              this.formulario.controls["oficio_dgac"].setValue(metaData.seccion1.oficio_dgac);

              if(this.activarPN){
                this.formulario.controls["nombresPersona"].setValue(metaData.seccion3.nombresApellidos);
                this.formulario.controls["nroDocumentoSolicitante"].setValue(metaData.seccion3.numeroDocumento);
              }

              this.formulario.controls["modalidadNotificacion"].setValue(metaData.seccion2.modalidadNotificacion.toString());

              if(this.activarPJ){
                this.formulario.controls["ruc"].setValue(metaData.seccion3.numeroDocumento);
                this.formulario.controls["razonSocial"].setValue(metaData.seccion3.razonSocial);
                this.formulario.controls["domicilio"].setValue(metaData.seccion3.domicilioLegal);
                this.formulario.controls["distrito"].setValue(metaData.seccion3.distrito);
                this.formulario.controls["provincia"].setValue(metaData.seccion3.provincia);
                this.formulario.controls["departamento"].setValue(metaData.seccion3.departamento);
                this.formulario.controls["telefonoRepresentante"].setValue(metaData.seccion3.telefono);
                this.formulario.controls["celularRepresentante"].setValue(metaData.seccion3.celular);
                this.formulario.controls["correoRepresentante"].setValue(metaData.seccion3.email);
                //this.formulario.controls["marcadoObligatorio"].setValue(metaData.DatosSolicitante.MarcadoObligatorio);
                this.formulario.controls["tipoDocumento"].setValue(metaData.seccion3.RepresentanteLegal.tipoDocumento.id);
                this.formulario.controls["numeroDocumento"].setValue(metaData.seccion3.RepresentanteLegal.numeroDocumento);
                this.formulario.controls["nombreRepresentante"].setValue(metaData.seccion3.RepresentanteLegal.nombres);
                this.formulario.controls["apePaternoRepresentante"].setValue(metaData.seccion3.RepresentanteLegal.apellidoPaterno);
                this.formulario.controls["apeMaternoRepresentante"].setValue(metaData.seccion3.RepresentanteLegal.apellidoMaterno);
                this.formulario.controls["domicilioRepresentante"].setValue(metaData.seccion3.RepresentanteLegal.domicilioLegal);
                this.formulario.controls['distritoRepresentante'].setValue(metaData.seccion3.RepresentanteLegal.distrito);
                this.formulario.controls['provinciaRepresentante'].setValue(metaData.seccion3.RepresentanteLegal.provincia);
                this.formulario.controls['departamentoRepresentante'].setValue(metaData.seccion3.RepresentanteLegal.departamento);
                this.formulario.controls['oficinaRepresentante'].setValue(metaData.seccion3.RepresentanteLegal.oficinaRegistral.id);
                this.formulario.controls['partidaRepresentante'].setValue(metaData.seccion3.RepresentanteLegal.partida);
                this.formulario.controls['asientoRepresentante'].setValue(metaData.seccion3.RepresentanteLegal.asiento);
              }

              this.formulario.controls["declaracion_1"].setValue(metaData.seccion5.declaracion_1);
              this.formulario.controls["declaracion_2"].setValue(metaData.seccion5.declaracion_2);
              setTimeout(() => {
                this.formulario.controls["oficinaRegistral"].setValue(metaData.DatosSolicitante.RepresentanteLegal.OficinaRegistral.Id);
              });
            }, (error) => {
                this.funcionesMtcService.ocultarCargando().mensajeError('Problemas para recuperar los datos guardados');
            }
          );
        }else{
          if(this.activarPN){
            /*this.formulario.controls['razonSocial'].enable();
            this.formulario.controls['ruc'].enable();*/
            this.formulario.controls['nroDocumentoSolicitante'].setValue(this.nroDocumentoLogin);
            this.formulario.controls['nombresPersona'].disable();
            this.formulario.controls['tipoDocumentoSolicitante'].disable();
            this.formulario.controls['nroDocumentoSolicitante'].disable();
            this.formulario.controls['rucPersona'].disable();
            this.formulario.controls['domicilioPersona'].enable();
            this.formulario.controls['distritoPersona'].enable();
            this.formulario.controls['provinciaPersona'].enable();
            this.formulario.controls['departamentoPersona'].enable();
            this.formulario.controls['telefonoPersona'].enable();
            this.formulario.controls['celularPersona'].enable();
            this.formulario.controls['correoPersona'].enable();
            this.formulario.controls['tipoDocumento'].disable();
            this.formulario.controls['numeroDocumento'].disable();

            this.reniecService.getDni(this.nroDocumentoLogin).subscribe(
              (respuesta) => {
                this.funcionesMtcService.ocultarCargando();

                if (respuesta.reniecConsultDniResponse.listaConsulta.coResultado !== '0000')
                  return this.funcionesMtcService.mensajeError('Número de documento no registrado en Reniec');
                let ubigeo;
                const datosPersona = respuesta.reniecConsultDniResponse.listaConsulta.datosPersona;
                console.log(datosPersona);
                ubigeo = datosPersona.ubigeo.split("/");
                this.formulario.controls['nombresPersona'].setValue(datosPersona.prenombres+" "+datosPersona.apPrimer+" "+datosPersona.apSegundo);
                this.formulario.controls['domicilioPersona'].setValue(datosPersona.direccion);

                this.formulario.controls['distritoPersona'].setValue(ubigeo[2]);
                this.formulario.controls['provinciaPersona'].setValue(ubigeo[1]);
                this.formulario.controls['departamentoPersona'].setValue(ubigeo[0]);
              },
              (error) => {
                this.funcionesMtcService.ocultarCargando().mensajeError('Error al consultar al servicio de la RENIEC');
                /*this.formulario.controls["nombresPersona"].enable();
                this.formulario.controls["domicilioPersona"].enable();
                this.formulario.controls["apeMaternoRepresentante"].enable();*/
              }
            );
          }else{
            this.sunatService.getDatosPrincipales(this.nroRuc).subscribe(
              (response) => {
                this.funcionesMtcService.ocultarCargando();
                if(this.tipoSolicitante=="PJ"){
                  this.formulario.controls['razonSocial'].setValue(response.razonSocial.trim());
                  this.formulario.controls['ruc'].setValue(response.nroDocumento.trim());
                  this.formulario.controls['domicilio'].setValue(response.domicilioLegal.trim());
                  this.formulario.controls['distrito'].setValue(response.nombreDistrito.trim());
                  this.formulario.controls['provincia'].setValue(response.nombreProvincia.trim());
                  this.formulario.controls['departamento'].setValue(response.nombreDepartamento.trim());
                  this.formulario.controls['telefonoRepresentante'].setValue(response.telefono.trim());
                  this.formulario.controls['celularRepresentante'].setValue(response.celular.trim());
                  this.formulario.controls['correoRepresentante'].setValue(response.correo.trim());

                  this.formulario.controls['razonSocial'].disable();
                  this.formulario.controls['ruc'].disable();
                  this.formulario.controls['domicilio'].disable();
                  this.formulario.controls["distrito"].disable();
                  this.formulario.controls["provincia"].disable();
                  this.formulario.controls["departamento"].disable();
                }else{

                  this.formulario.controls["nroDocumentoSolicitante"].setValue(this.nroDocumentoLogin);
                  this.formulario.controls["rucPersona"].setValue(response.nroDocumento.trim());
                  this.formulario.controls["nombresPersona"].setValue(response.razonSocial.trim());
                  this.formulario.controls["domicilioPersona"].setValue(response.domicilioLegal.trim());
                  this.formulario.controls["distritoPersona"].setValue(response.nombreDistrito.trim());
                  this.formulario.controls["provinciaPersona"].setValue(response.nombreProvincia.trim());
                  this.formulario.controls["departamentoPersona"].setValue(response.nombreDepartamento.trim());
                  this.formulario.controls['telefonoPersona'].setValue(response.telefono.trim());
                  this.formulario.controls['celularPersona'].setValue(response.celular.trim());
                  this.formulario.controls['correoPersona'].setValue(response.correo.trim());
                }

                this.representanteLegal = response.representanteLegal;
              },
              (error) => {
                this.funcionesMtcService.ocultarCargando().mensajeError('Error al consultar el Servicio de Sunat');
                this.formulario.controls['razonSocial'].setValue(this.razonSocial);
                this.formulario.controls['ruc'].setValue(this.nroRuc);

                this.formulario.controls["domicilio"].enable();
                this.formulario.controls["distrito"].enable();
                this.formulario.controls["provincia"].enable();
                this.formulario.controls["departamento"].enable();
              }
            );
          }
        }
  }

  recuperarDatosUsuario(){
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

  soloNumeros(event) {
    event.target.value = event.target.value.replace(/[^0-9]/g, '');
  }

  guardarFormulario() {

    if (this.formulario.invalid === true)
      return this.funcionesMtcService.mensajeError('Debe ingresar todos los campos obligatorios');

      let oficinaRepresentante=this.formulario.controls['oficinaRepresentante'].value;

      let dataGuardar: Formulario006_12Request = new Formulario006_12Request();
      let form = this.formulario.controls;

      dataGuardar.id = this.id;
      dataGuardar.codigo = 'F006-12';
      dataGuardar.formularioId =  7;
      dataGuardar.codUsuario =  this.nroDocumentoLogin;
      dataGuardar.idTramiteReq = this.dataInput.tramiteReqId,
      dataGuardar.estado =  1;
      dataGuardar.metaData.seccion1.dgac_018 = (this.codigoProcedimientoTupa==="DGAC-018"?"1":"0");
      dataGuardar.metaData.seccion1.s_dgac_008 = (this.codigoProcedimientoTupa==="S-DGAC-008"?"1":"0");
      dataGuardar.metaData.seccion1.licencia = form['licencia'].value;
      dataGuardar.metaData.seccion1.municipalidad = form['municipalidad'].value;
      dataGuardar.metaData.seccion1.habilitaciones = form['habilitaciones'].value;
      dataGuardar.metaData.seccion1.sedes = form['sedes'].value;
      dataGuardar.metaData.seccion1.oficio_dgac = form['oficio_dgac'].value;

      dataGuardar.metaData.seccion2.modalidadNotificacion = this.formulario.controls['modalidadNotificacion'].value;

      dataGuardar.metaData.seccion3.tipoSolicitante= this.tipoSolicitante;
      dataGuardar.metaData.seccion3.nombresApellidos = (this.tipoSolicitante ==='PN' || this.tipoSolicitante ==='PNR' || this.tipoSolicitante ==='PE' ? this.formulario.controls['nombresPersona'].value : '');
      dataGuardar.metaData.seccion3.tipoDocumento = (this.tipoSolicitante==="PJ"?this.formulario.controls['tipoDocumento'].value:this.codTipoDocSolicitante); //codDocumento
      dataGuardar.metaData.seccion3.numeroDocumento = (this.tipoSolicitante==="PJ"?this.formulario.controls['ruc'].value:this.formulario.controls['nroDocumentoSolicitante'].value); //nroDocumento
      dataGuardar.metaData.seccion3.ruc = (this.tipoSolicitante==="PJ"?"":this.formulario.controls['rucPersona'].value);
      dataGuardar.metaData.seccion3.razonSocial = (this.tipoSolicitante ==='PJ' ? this.formulario.controls['razonSocial'].value : '');
      dataGuardar.metaData.seccion3.domicilioLegal = (this.tipoSolicitante ==='PJ' ?this.formulario.controls['domicilio'].value:this.formulario.controls['domicilioPersona'].value);
      dataGuardar.metaData.seccion3.distrito = (this.tipoSolicitante ==='PJ' ?this.formulario.controls['distrito'].value:this.formulario.controls['distritoPersona'].value);
      dataGuardar.metaData.seccion3.provincia = (this.tipoSolicitante ==='PJ' ?this.formulario.controls['provincia'].value:this.formulario.controls['provinciaPersona'].value);
      dataGuardar.metaData.seccion3.departamento =  (this.tipoSolicitante ==='PJ' ?this.formulario.controls['departamento'].value:this.formulario.controls['departamentoPersona'].value);
      dataGuardar.metaData.seccion3.representanteLegal.nombres = this.formulario.controls['nombreRepresentante'].value;
      dataGuardar.metaData.seccion3.representanteLegal.apellidoPaterno = this.formulario.controls['apePaternoRepresentante'].value;
      dataGuardar.metaData.seccion3.representanteLegal.apellidoMaterno = this.formulario.controls['apeMaternoRepresentante'].value;
      dataGuardar.metaData.seccion3.representanteLegal.tipoDocumento.id = this.formulario.controls['tipoDocumento'].value;
      dataGuardar.metaData.seccion3.representanteLegal.tipoDocumento.documento = (this.tipoSolicitante==="PJ"?this.listaTiposDocumentos.filter(item => item.id == this.formulario.get('tipoDocumento').value)[0].documento:"");
      dataGuardar.metaData.seccion3.representanteLegal.numeroDocumento = this.formulario.controls['numeroDocumento'].value;
      dataGuardar.metaData.seccion3.representanteLegal.domicilioLegal = this.formulario.controls['domicilioRepresentante'].value;
      dataGuardar.metaData.seccion3.representanteLegal.oficinaRegistral.id =  oficinaRepresentante;
      dataGuardar.metaData.seccion3.representanteLegal.oficinaRegistral.descripcion =  (this.tipoSolicitante==="PJ"?this.oficinasRegistral.filter(item => item.value == oficinaRepresentante)[0].text:"");
      dataGuardar.metaData.seccion3.representanteLegal.partida =  this.formulario.controls['partidaRepresentante'].value;
      dataGuardar.metaData.seccion3.representanteLegal.asiento =  this.formulario.controls['asientoRepresentante'].value;
      dataGuardar.metaData.seccion3.representanteLegal.distrito =  this.formulario.controls['distritoRepresentante'].value;
      dataGuardar.metaData.seccion3.representanteLegal.provincia =  this.formulario.controls['provinciaRepresentante'].value;
      dataGuardar.metaData.seccion3.representanteLegal.departamento =  this.formulario.controls['departamentoRepresentante'].value;
      dataGuardar.metaData.seccion3.representanteLegal.cargo =  this.cargoRepresentanteLegal;
      dataGuardar.metaData.seccion3.telefono =  (this.tipoSolicitante ==='PJ' ?this.formulario.controls['telefonoRepresentante'].value:this.formulario.controls['telefonoPersona'].value);
      dataGuardar.metaData.seccion3.celular = (this.tipoSolicitante ==='PJ' ?this.formulario.controls['celularRepresentante'].value:this.formulario.controls['celularPersona'].value);
      dataGuardar.metaData.seccion3.email = (this.tipoSolicitante ==='PJ' ?this.formulario.controls['correoRepresentante'].value:this.formulario.controls['correoPersona'].value);

      dataGuardar.metaData.seccion5.declaracion_1 = this.formulario.controls['declaracion_1'].value;
      dataGuardar.metaData.seccion5.declaracion_2 = this.formulario.controls['declaracion_2'].value;

      dataGuardar.metaData.seccion6.dni = (this.tipoSolicitante === 'PJ'?this.formulario.controls['numeroDocumento'].value:this.formulario.controls['nroDocumentoSolicitante'].value);
      dataGuardar.metaData.seccion6.nombre = (this.tipoSolicitante === 'PJ'?this.formulario.controls['nombreRepresentante'].value+' '+this.formulario.controls['apePaternoRepresentante'].value+' '+this.formulario.controls['apeMaternoRepresentante'].value:this.formulario.controls['nombresPersona'].value);

      //const dataGuardarFormData = this.funcionesMtcService.jsonToFormData(dataGuardar);

      this.funcionesMtcService.mensajeConfirmar(`¿Está seguro de ${this.id === 0 ? 'guardar' : 'modificar'} los datos ingresados?`)
        .then(() => {
        if (this.id === 0) {
          this.funcionesMtcService.mostrarCargando();
          //GUARDAR:
          this.formularioService.post<any>(dataGuardar)
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
          modalRef.componentInstance.titleModal = "Vista Previa - Formulario 006/12";

        },
        error => {
          this.funcionesMtcService
            .ocultarCargando()
            .mensajeError('Problemas para descargar Pdf');
        }
      );
  }

  formInvalid(control: string) : boolean {
    if(this.formulario.get(control))
    return this.formulario.get(control).invalid  && (this.formulario.get(control).dirty || this.formulario.get(control).touched);
  }
}
