/**
 * Formulario 001/17.2 utilizado por los procedimientos DSTT-001, DSTT-002, DSTT-003, DSTT-004, DSTT-005
 * @author Alicia Toquila Quispe
  * @version 1.1 24.07.2021
*/
import { Component, OnInit, Injectable, ViewChild, AfterViewInit , Input } from '@angular/core';
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
import { Formulario001_17_2Request } from 'src/app/core/models/Formularios/Formulario001_17_2/Formulario001_17_2Request';
import { Formulario001_17_2Response } from 'src/app/core/models/Formularios/Formulario001_17_2/Formulario001_17_2Response';
import { Formulario001172Service } from '../../../../core/services/formularios/formulario001-17-2.service';
import { SunatService } from 'src/app/core/services/servicios/sunat.service';
import { VisorPdfArchivosService } from '../../../../core/services/tramite/visor-pdf-archivos.service';
import { VistaPdfComponent } from '../../../../shared/components/vista-pdf/vista-pdf.component';
import { defaultRadioGroupAppearanceProvider } from 'pdf-lib';
import { RenatService } from 'src/app/core/services/servicios/renat.service';
import { DatosPersona } from 'src/app/core/models/ReniecModel';
import { MtcService } from 'src/app/core/services/servicios/mtc.service';
import { Seccion1, Seccion3, Seccion5 } from '../../../../core/models/Formularios/Formulario001_17_2/Secciones';
import { DatosUsuarioLogin } from 'src/app/core/models/Autenticacion/DatosUsuarioLogin';
import { UI_SWITCH_OPTIONS } from 'ngx-ui-switch/ui-switch/ui-switch.token';

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css']
})
export class FormularioComponent implements OnInit, AfterViewInit {

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

  datosUsuarioLogin: DatosUsuarioLogin;

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
  //codTipoDocSolicitante: string = ""; // 01 DNI  03 CI  04 CE   
  
  //Datos de Formulario
  txtTituloCompleto = 'FORMULARIO 001-17.2 INFRAESTRUCURA DEL TRANSPORTE FERROVIARIO';
  tipoPersona: number = 1 
  paDJ2: string[]=["DSTT-001"];
  paDJ3: string[]=["DSTT-001"];
  paDJ4: string[]=["DSTT-001"];
  paDJ5: string[]=["DSTT-001"];
  paDJ6: string[]=["DSTT-001"];
  paDJ7: string[]=["DSTT-001"];
  paDJ8: string[]=["DSTT-001"];

  activarDJ2: boolean=false;
  activarDJ3: boolean=false;
  activarDJ4: boolean=false;
  activarDJ5: boolean=false;
  activarDJ6: boolean=false;
  activarDJ7: boolean=false;
  activarDJ8: boolean=false;

  activarPN: boolean=false;
  activarPJ: boolean=false;

  paAutorizacion: string[]=["DSTT-033","DSTT-038"];
  autorizacion = false;
  codigoEmpresaServicio: string = "";
  nombreEmpresaServicio: string = "";

  paTipoServicio : string[]=["DSTT-037","DSTT-038"];
  activarTipoServicio =false;
  servicio:string="1";

  CIIU : boolean=true;

  tipoDocumentoSolicitante: string = "";
  nombreTipoDocumentoSolicitante : string = "";
  numeroDocumentoSolicitante : string = "";
  nombreSolicitante : string = "";

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
    private formularioService: Formulario001172Service,
    private visorPdfArchivosService: VisorPdfArchivosService,
    private modalService: NgbModal,
    private sunatService: SunatService,
    private renatService :RenatService,
    private mtcService: MtcService) {

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
   

    if(this.paAutorizacion.indexOf(this.codigoProcedimientoTupa)>-1) this.autorizacion=true; else this.autorizacion=false;
    if(this.paTipoServicio.indexOf(this.codigoProcedimientoTupa)>-1) this.activarTipoServicio=true; else this.activarTipoServicio=false;
    if(this.paDJ2.indexOf(this.codigoProcedimientoTupa)>-1) this.activarDJ2=true; else this.activarDJ2=false;
    if(this.paDJ3.indexOf(this.codigoProcedimientoTupa)>-1) this.activarDJ3=true; else this.activarDJ3=false;
    if(this.paDJ4.indexOf(this.codigoProcedimientoTupa)>-1) this.activarDJ4=true; else this.activarDJ4=false;
    if(this.paDJ5.indexOf(this.codigoProcedimientoTupa)>-1) this.activarDJ5=true; else this.activarDJ5=false;
    if(this.paDJ6.indexOf(this.codigoProcedimientoTupa)>-1) this.activarDJ6=true; else this.activarDJ6=false;
    if(this.paDJ7.indexOf(this.codigoProcedimientoTupa)>-1) this.activarDJ7=true; else this.activarDJ7=false;
    if(this.paDJ8.indexOf(this.codigoProcedimientoTupa)>-1) this.activarDJ8=true; else this.activarDJ8=false;

    this.formulario = this.fb.group({
      tipoDocumentoSolicitante: this.fb.control(""),
      nroDocumentoSolicitante : this.fb.control(""),
      rucPersona              : this.fb.control(""),
      nombresPersona          : this.fb.control(""),
      domicilioPersona        : this.fb.control(""),
      distritoPersona         : this.fb.control(""),
      provinciaPersona        : this.fb.control(""),
      departamentoPersona     : this.fb.control(""),
      telefonoPersona         : this.fb.control(""),
      celularPersona          : this.fb.control("",[Validators.required]),
      correoPersona           : this.fb.control("",[Validators.required]),
      ruc                     : this.fb.control({value:'', disabled:true},[Validators.required]),
      razonSocial             : this.fb.control({value:'', disabled:true},[Validators.required]),
      domicilio               : this.fb.control("",[Validators.required]),
      distrito                : this.fb.control("",[Validators.required]),
      provincia               : this.fb.control("",[Validators.required]),
      departamento            : this.fb.control("",[Validators.required]),
      tipoDocumento           : this.fb.control("",[Validators.required]),
      numeroDocumento         : this.fb.control("",[Validators.required]),
      nombreRepresentante     : this.fb.control("",[Validators.required]),
      apePaternoRepresentante : this.fb.control("",[Validators.required]),
      apeMaternoRepresentante : this.fb.control("",[Validators.required]),
      domicilioRepresentante  : this.fb.control("",[Validators.required]),
      telefonoRepresentante   : this.fb.control(""),
      celularRepresentante    : this.fb.control(""),
      correoRepresentante     : this.fb.control(""),
      distritoRepresentante   : this.fb.control("",[Validators.required]),
      provinciaRepresentante  : this.fb.control("",[Validators.required]),
      departamentoRepresentante:this.fb.control("",[Validators.required]),
      oficinaRepresentante    : this.fb.control("",[Validators.required]),
      partidaRepresentante    : this.fb.control("",[Validators.required]),
      asientoRepresentante    : this.fb.control("",[Validators.required]),
      /*oficinaEmpresa          : this.fb.control("",[Validators.required]),
      partidaEmpresa          : this.fb.control("",[Validators.required]),
      asientoEmpresa          : this.fb.control("",[Validators.required]),
      tipoServicio            : this.fb.control({value:this.servicio,disabled:!this.activarTipoServicio},[Validators.required]),*/
      declaracion_1          : this.fb.control(false,[Validators.requiredTrue]),
      declaracion_2          : this.fb.control(false,[Validators.requiredTrue]),
      declaracion_3          : this.fb.control(false,[Validators.requiredTrue]),
      declaracion_4          : this.fb.control(false,[Validators.requiredTrue]),
      declaracion_5          : this.fb.control(false,[Validators.requiredTrue]),
      declaracion_6          : this.fb.control(false,[Validators.requiredTrue]),
      declaracion_7          : this.fb.control(false,[Validators.requiredTrue]),
      declaracion_8          : this.fb.control(false,[Validators.requiredTrue]),
      declaracion_9          : this.fb.control(false,[Validators.requiredTrue]),
      autorizacion           : this.fb.control(true,[Validators.requiredTrue]),

      declaracion_pasajeros  : this.fb.control(false),
      declaracion_mercancia  : this.fb.control(false),
      declaracion_ambos  : this.fb.control(false),
      partida_registral  : this.fb.control(''),
      asiento  : this.fb.control(''),

      pasajeros : this.fb.control(''),
      mercancia : this.fb.control(''),
      rutaFerroviaria: this.fb.control(''),
   });

    this.cargarOficinaRegistral();
    this.nroRuc = this.seguridadService.getCompanyCode();
    this.razonSocial = this.seguridadService.getUserName();       //nombre de usuario login
    const tipoDocumento = this.seguridadService.getNameId();      //tipo de documento usuario login
    this.nroDocumentoLogin = this.seguridadService.getNumDoc();   //nro de documento usuario login
    this.datosUsuarioLogin = this.seguridadService.getDatosUsuarioLogin(); // Datos personales del usuario
    this.tipoDocumentoValidForm = tipoDocumento;

    console.log("TIPO DOCUMENTO", tipoDocumento); //00001
    console.log("NUMERO", this.nroDocumentoLogin);
    console.log(this.seguridadService.getDatosUsuarioLogin());
    switch (tipoDocumento){
      case "00001":
      case "00004":
      case "00005": this.formulario.controls["ruc"].clearValidators();
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

      case "00002": this.formulario.controls["tipoDocumentoSolicitante"].clearValidators();
                    this.formulario.controls["nroDocumentoSolicitante"].clearValidators();
                    this.formulario.controls["rucPersona"].clearValidators();
                    this.formulario.controls["nombresPersona"].clearValidators();
                    this.formulario.controls["domicilioPersona"].clearValidators();
                    this.formulario.controls["distritoPersona"].clearValidators();
                    this.formulario.controls["provinciaPersona"].clearValidators();
                    this.formulario.controls["telefonoPersona"].clearValidators();
                    this.formulario.controls["celularPersona"].clearValidators();
                    this.formulario.controls["correoPersona"].clearValidators();
                    this.formulario.updateValueAndValidity();
                    
                    this.activarPN=false;
                    this.activarPJ=true;

                    break;
      
    }
    if(!this.activarDJ2){this.formulario.controls["declaracion_2"].clearValidators();}
    if(!this.activarDJ3){this.formulario.controls["declaracion_3"].clearValidators();}
    if(!this.activarDJ4){this.formulario.controls["declaracion_4"].clearValidators();}
    if(!this.activarDJ5){this.formulario.controls["declaracion_5"].clearValidators();}
    if(!this.activarDJ6){this.formulario.controls["declaracion_6"].clearValidators();}
    if(!this.activarDJ7){this.formulario.controls["declaracion_7"].clearValidators();}
    if(!this.activarDJ8){this.formulario.controls["declaracion_8"].clearValidators();}

    this.cargarDatos();
    this.recuperarDatosUsuario();
  }

  async ngAfterViewInit(): Promise<void> {
    
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
  
  onChangeTipoDocumento(opcion : string = 'RepresentanteLegal') {
    if(opcion=="RepresentanteLegal"){
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
  }

  onChangeNumeroDocumentoConductor(opcion : string = 'RepresentanteLegal') {
    if(opcion=="RepresentanteLegal"){
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
  }

  getMaxLengthNumeroDocumento(opcion:string='RepresentanteLegal') {
    let tipoDocumento: string=""; 
    if(opcion=="RepresentanteLegal"){
      tipoDocumento = this.formulario.controls['tipoDocumento'].value.trim();
    }
    else{
      tipoDocumento = this.formulario.controls['tipoDocumentoConductor'].value.trim();
    }

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

    if (tipoDocumento === '04' && numeroDocumento.length !== 9)
      return this.funcionesMtcService.mensajeError('Carnet de extranjería debe tener 9 caracteres');
      
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
                        this.tipoDocumentoSolicitante= '01';
                        this.nombreTipoDocumentoSolicitante = "DNI";
                        this.numeroDocumentoSolicitante = this.nroDocumentoLogin;
                        this.nombreSolicitante = this.seguridadService.getUserName();
                        break;

          case '00002' :this.tipoSolicitante = 'PJ'; // persona juridica
                        this.formulario.controls['tipoDocumentoSolicitante'].setValue('DNI');
                        break;

          case '00004' :this.tipoSolicitante = 'PE'; // persona extranjera
                        this.nombreSolicitante = this.seguridadService.getUserName();
            
                        switch(this.seguridadService.getTipoDocumento()){
                          case "00003": this.tipoDocumentoSolicitante = "04";
                                        this.nombreTipoDocumentoSolicitante = "CE";
                                        this.numeroDocumentoSolicitante = this.nroDocumentoLogin;
                                        this.formulario.controls['tipoDocumentoSolicitante'].setValue('CARNET DE EXTRANJERIA');
                                        break;
                          case "00101": this.tipoDocumentoSolicitante = "05";
                                        this.nombreTipoDocumentoSolicitante = "CARNÉ SOLICITANTE DE REFUGIO";
                                        this.numeroDocumentoSolicitante = this.nroDocumentoLogin;
                                        this.formulario.controls['tipoDocumentoSolicitante'].setValue('CARNÉ SOLICITANTE DE REFUGIO');
                                        break;
                          case "00102": this.tipoDocumentoSolicitante = "06";
                                        this.nombreTipoDocumentoSolicitante = "CARNÉ DE PERMISO TEMPORAL DE PERMANENCIA";
                                        this.numeroDocumentoSolicitante = this.nroDocumentoLogin;
                                        this.formulario.controls['tipoDocumentoSolicitante'].setValue('CARNÉ DE PERMISO TEMPORAL DE PERMANENCIA');
                                        break;
                          case "00103": this.tipoDocumentoSolicitante = "07";
                                        this.nombreTipoDocumentoSolicitante = "CARNÉ DE IDENTIFICACION";
                                        this.numeroDocumentoSolicitante = this.nroDocumentoLogin;
                                        this.formulario.controls['tipoDocumentoSolicitante'].setValue('CARNÉ DE IDENTIFICACION');
                                        break;
                        }
                        break;
                      
          case '00005' :this.tipoSolicitante = 'PNR'; // persona natural con ruc
                        this.tipoDocumentoSolicitante = "01";
                        this.nombreTipoDocumentoSolicitante = "DNI";
                        this.numeroDocumentoSolicitante = this.nroDocumentoLogin;
                        this.formulario.controls['tipoDocumentoSolicitante'].setValue('DNI');
                        this.nombreSolicitante = this.seguridadService.getUserName();
                        this.nroRuc = this.seguridadService.getCompanyCode();
                        break;
        }

        if(this.dataInput != null && this.dataInput.movId > 0){

          this.formularioTramiteService.get<any>(this.dataInput.tramiteReqId).subscribe(
            (dataFormulario: Formulario001_17_2Response) => {
              
              this.funcionesMtcService.ocultarCargando();
              const metaData: any = JSON.parse(dataFormulario.metaData);
              
              console.dir(metaData);
              this.id = dataFormulario.formularioId;
              this.filePdfPathName = metaData.pathName;

              if(this.activarPN){
                this.formulario.controls["nombresPersona"].setValue(metaData.seccion3.nombresApellidos);
                this.formulario.controls["tipoDocumentoSolicitante"].setValue(this.nombreTipoDocumentoSolicitante);
                this.formulario.controls["nroDocumentoSolicitante"].setValue(metaData.seccion3.numeroDocumento);
                this.formulario.controls["rucPersona"].setValue(metaData.seccion3.ruc);
                this.formulario.controls["domicilioPersona"].setValue(metaData.seccion3.domicilioLegal);
                this.formulario.controls["distritoPersona"].setValue(metaData.seccion3.distrito);
                this.formulario.controls["provinciaPersona"].setValue(metaData.seccion3.provincia);
                this.formulario.controls["departamentoPersona"].setValue(metaData.seccion3.departamento);
                this.formulario.controls["correoPersona"].setValue(metaData.seccion3.email);
                this.formulario.controls["celularPersona"].setValue(metaData.seccion3.celular);
                this.formulario.controls["telefonoPersona"].setValue(metaData.seccion3.telefono);


                this.formulario.controls["nroDocumentoSolicitante"].disable();
                this.formulario.controls["tipoDocumentoSolicitante"].disable();
                this.formulario.controls["rucPersona"].disable();
                this.formulario.controls["nombresPersona"].disable();
                this.formulario.controls["domicilioPersona"].disable();
                this.formulario.controls["distritoPersona"].disable();
                this.formulario.controls["provinciaPersona"].disable();
                this.formulario.controls["departamentoPersona"].disable();
              }

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
                   

              this.formulario.controls["declaracion_1"].setValue(metaData.seccion6.declaracion_1);
              this.formulario.controls["declaracion_2"].setValue(metaData.seccion6.declaracion_2);
              this.formulario.controls["declaracion_3"].setValue(metaData.seccion6.declaracion_3);
              this.formulario.controls["declaracion_4"].setValue(metaData.seccion6.declaracion_4);
              this.formulario.controls["declaracion_5"].setValue(metaData.seccion6.declaracion_5);
              this.formulario.controls["declaracion_6"].setValue(metaData.seccion6.declaracion_6);
              this.formulario.controls["declaracion_7"].setValue(metaData.seccion6.declaracion_7);
              this.formulario.controls["declaracion_8"].setValue(metaData.seccion6.declaracion_8);
              this.formulario.controls["declaracion_9"].setValue(metaData.seccion6.declaracion_9);
              if(metaData.DatosSolicitante !=null){
                setTimeout(() => {
                  this.formulario.controls["oficinaRegistral"].setValue(metaData.DatosSolicitante.RepresentanteLegal.OficinaRegistral.id);
                });
              }
            }, (error) => {
                this.funcionesMtcService.ocultarCargando().mensajeError('Problemas para recuperar los datos guardados');
            }
          );
        }else{

          switch(this.tipoSolicitante){
            case "PN":  
                this.funcionesMtcService.ocultarCargando();
                this.formulario.controls["nroDocumentoSolicitante"].setValue(this.numeroDocumentoSolicitante.trim());
                this.formulario.controls["rucPersona"].setValue('');
                this.formulario.controls["nombresPersona"].setValue(this.datosUsuarioLogin.nombres + " " + this.datosUsuarioLogin.apePaterno.trim() +" "+ this.datosUsuarioLogin.apeMaterno.trim());
                this.formulario.controls["domicilioPersona"].setValue(this.datosUsuarioLogin.direccion.trim());
                this.formulario.controls["distritoPersona"].setValue(this.datosUsuarioLogin.distrito.trim());
                this.formulario.controls["provinciaPersona"].setValue(this.datosUsuarioLogin.provincia.trim());
                this.formulario.controls["departamentoPersona"].setValue(this.datosUsuarioLogin.departamento.trim());
                this.formulario.controls['telefonoPersona'].setValue(this.datosUsuarioLogin.telefono.trim());
                this.formulario.controls['celularPersona'].setValue(this.datosUsuarioLogin.celular.trim());
                this.formulario.controls['correoPersona'].setValue(this.datosUsuarioLogin.correo.trim());

                this.formulario.controls["nroDocumentoSolicitante"].disable();
                this.formulario.controls["tipoDocumentoSolicitante"].disable();
                this.formulario.controls["rucPersona"].disable();
                this.formulario.controls["nombresPersona"].disable();
                this.formulario.controls["domicilioPersona"].disable();
                this.formulario.controls["distritoPersona"].disable();
                this.formulario.controls["provinciaPersona"].disable();
                this.formulario.controls["departamentoPersona"].disable();
                break;

            case "PJ": this.sunatService.getDatosPrincipales(this.nroRuc).subscribe(
                        (response) => {
                          this.funcionesMtcService.ocultarCargando();
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

                          this.representanteLegal = response.representanteLegal;
                        },(error) => {
                          this.funcionesMtcService.ocultarCargando().mensajeError('Error al consultar el Servicio de Sunat');
                          this.formulario.controls['razonSocial'].setValue(this.razonSocial);
                          this.formulario.controls['ruc'].setValue(this.nroRuc);
            
                          this.formulario.controls["domicilio"].enable();
                          this.formulario.controls["distrito"].enable();
                          this.formulario.controls["provincia"].enable();
                          this.formulario.controls["departamento"].enable();
                        });
                        break;

            case "PNR": this.funcionesMtcService.ocultarCargando();
                        this.formulario.controls["nroDocumentoSolicitante"].setValue(this.numeroDocumentoSolicitante);
                        this.formulario.controls["rucPersona"].setValue(this.nroRuc.trim());
                        this.formulario.controls["nombresPersona"].setValue(this.datosUsuarioLogin.nombres + " " + this.datosUsuarioLogin.apePaterno.trim() +" "+ this.datosUsuarioLogin.apeMaterno.trim());
                        this.formulario.controls["domicilioPersona"].setValue(this.datosUsuarioLogin.direccion.trim());
                        this.formulario.controls["distritoPersona"].setValue(this.datosUsuarioLogin.distrito.trim());
                        this.formulario.controls["provinciaPersona"].setValue(this.datosUsuarioLogin.provincia.trim());
                        this.formulario.controls["departamentoPersona"].setValue(this.datosUsuarioLogin.departamento.trim());
                        this.formulario.controls['telefonoPersona'].setValue(this.datosUsuarioLogin.telefono.trim());
                        this.formulario.controls['celularPersona'].setValue(this.datosUsuarioLogin.celular.trim());
                        this.formulario.controls['correoPersona'].setValue(this.datosUsuarioLogin.correo.trim());

                        this.formulario.controls["nroDocumentoSolicitante"].disable();
                        this.formulario.controls["tipoDocumentoSolicitante"].disable();
                        this.formulario.controls["rucPersona"].disable();
                        this.formulario.controls["nombresPersona"].disable();
                        this.formulario.controls["domicilioPersona"].disable();
                        this.formulario.controls["distritoPersona"].disable();
                        this.formulario.controls["provinciaPersona"].disable();
                        this.formulario.controls["departamentoPersona"].disable();
                        break;

            case "PE":  this.funcionesMtcService.ocultarCargando();
                        this.formulario.controls["nroDocumentoSolicitante"].setValue(this.numeroDocumentoSolicitante);
                        this.formulario.controls["rucPersona"].setValue(this.nroRuc.trim());
                        this.formulario.controls["nombresPersona"].setValue(this.datosUsuarioLogin.nombres + " " + this.datosUsuarioLogin.apePaterno.trim() +" "+ this.datosUsuarioLogin.apeMaterno.trim());
                        this.formulario.controls["domicilioPersona"].setValue(this.datosUsuarioLogin.direccion.trim());
                        this.formulario.controls["distritoPersona"].setValue(this.datosUsuarioLogin.distrito.trim());
                        this.formulario.controls["provinciaPersona"].setValue(this.datosUsuarioLogin.provincia.trim());
                        this.formulario.controls["departamentoPersona"].setValue(this.datosUsuarioLogin.departamento.trim());
                        this.formulario.controls['telefonoPersona'].setValue(this.datosUsuarioLogin.telefono.trim());
                        this.formulario.controls['celularPersona'].setValue(this.datosUsuarioLogin.celular.trim());
                        this.formulario.controls['correoPersona'].setValue(this.datosUsuarioLogin.correo.trim());

                        this.formulario.controls["nroDocumentoSolicitante"].disable();
                        this.formulario.controls["tipoDocumentoSolicitante"].disable();
                        this.formulario.controls["rucPersona"].disable();
                        this.formulario.controls["nombresPersona"].disable();
                        this.formulario.controls["domicilioPersona"].disable();
                        this.formulario.controls["distritoPersona"].disable();
                        this.formulario.controls["provinciaPersona"].disable();
                        this.formulario.controls["departamentoPersona"].disable();
                        break;
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
      //let oficinaEmpresa = this.formulario.controls['oficinaEmpresa'].value;
      /*
      if (this.tipoPersona===2 && (representante==="" || partida==="" || oficina==="")){
        //verificar que ingrese oficina, partida y representante
        return  this.funcionesMtcService.mensajeError('Debe ingresar todos los campos');
      }*/
      //const fecha_pago_aux= parseDate(this.formulario.controls['fecha_Pago'].value.toStringFecha());
      //const fecha_pago_aux= this.formulario.controls['fecha_pago'].value.toStringFecha();
      
      let dataGuardar: Formulario001_17_2Request = new Formulario001_17_2Request(); 
      
      dataGuardar.id = this.id;
      dataGuardar.codigo = 'F001-17.2';
      dataGuardar.formularioId =  2;
      dataGuardar.codUsuario =  this.nroDocumentoLogin;
      dataGuardar.idTramiteReq = this.dataInput.tramiteReqId,
      dataGuardar.estado =  1; 
      dataGuardar.metaData.seccion1.dstt_001 = (this.codigoProcedimientoTupa==="DSTT-001"?"1":"0");
      dataGuardar.metaData.seccion1.dstt_002 = (this.codigoProcedimientoTupa==="DSTT-002"?"1":"0");
      dataGuardar.metaData.seccion1.dstt_003 = (this.codigoProcedimientoTupa==="DSTT-003"?"1":"0");
      dataGuardar.metaData.seccion1.dstt_004 = (this.codigoProcedimientoTupa==="DSTT-004"?"1":"0");
      dataGuardar.metaData.seccion1.dstt_005 = (this.codigoProcedimientoTupa==="DSTT-005"?"1":"0");
      dataGuardar.metaData.seccion1.pasajeros = (this.formulario.controls['pasajeros'].value);
      dataGuardar.metaData.seccion1.mercancia = (this.formulario.controls['mercancia'].value);
      dataGuardar.metaData.seccion1.rutaFerroviaria = (this.formulario.controls['rutaFerroviaria'].value);
      dataGuardar.metaData.seccion3.tipoSolicitante= this.tipoSolicitante;
      dataGuardar.metaData.seccion3.nombresApellidos = (this.tipoSolicitante ==='PN' || this.tipoSolicitante ==='PNR' || this.tipoSolicitante ==='PE' ? this.formulario.controls['nombresPersona'].value : '');
      dataGuardar.metaData.seccion3.tipoDocumento = (this.tipoSolicitante==="PJ"?this.formulario.controls['tipoDocumento'].value:this.tipoDocumentoSolicitante); //codDocumento
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
      dataGuardar.metaData.seccion5.declaracion_3 = this.formulario.controls['declaracion_3'].value;
      dataGuardar.metaData.seccion5.declaracion_4 = this.formulario.controls['declaracion_4'].value;
      dataGuardar.metaData.seccion5.declaracion_5 = this.formulario.controls['declaracion_5'].value;
      dataGuardar.metaData.seccion5.declaracion_6 = this.formulario.controls['declaracion_6'].value;
      dataGuardar.metaData.seccion5.declaracion_7 = this.formulario.controls['declaracion_7'].value;
      dataGuardar.metaData.seccion5.declaracion_8 = this.formulario.controls['declaracion_8'].value;
      dataGuardar.metaData.seccion5.declaracion_9 = this.formulario.controls['declaracion_9'].value;
      dataGuardar.metaData.seccion5.declaracion_pasajeros = this.formulario.controls['declaracion_pasajeros'].value;
      dataGuardar.metaData.seccion5.declaracion_mercancia = this.formulario.controls['declaracion_mercancia'].value;
      dataGuardar.metaData.seccion5.declaracion_ambos = this.formulario.controls['declaracion_ambos'].value;
      dataGuardar.metaData.seccion5.partida_registral = this.formulario.controls['partida_registral'].value;
      dataGuardar.metaData.seccion5.asiento = this.formulario.controls['asiento'].value;


      dataGuardar.metaData.seccion6.tipoDocumentoSolicitante = (this.tipoSolicitante === 'PJ'?this.formulario.controls['tipoDocumento'].value:this.tipoDocumentoSolicitante);
      dataGuardar.metaData.seccion6.nombreTipoDocumentoSolicitante = (this.tipoSolicitante === 'PJ'?this.listaTiposDocumentos.filter(item => item.id == this.formulario.get('tipoDocumento').value)[0].documento:this.formulario.controls['tipoDocumentoSolicitante'].value);
      dataGuardar.metaData.seccion6.numeroDocumentoSolicitante = (this.tipoSolicitante === 'PJ'?this.formulario.controls['numeroDocumento'].value:this.formulario.controls['nroDocumentoSolicitante'].value);
      dataGuardar.metaData.seccion6.nombresApellidosSolicitante = (this.tipoSolicitante === 'PJ'?this.formulario.controls['nombreRepresentante'].value+' '+this.formulario.controls['apePaternoRepresentante'].value+' '+this.formulario.controls['apeMaternoRepresentante'].value:this.formulario.controls['nombresPersona'].value);

      const dataGuardarFormData = this.funcionesMtcService.jsonToFormData(dataGuardar);

      this.funcionesMtcService.mensajeConfirmar(`¿Está seguro de ${this.id === 0 ? 'guardar' : 'modificar'} los datos ingresados?`)
        .then(() => {

        console.log(JSON.stringify(dataGuardar));        

        if (this.id === 0) {
          this.funcionesMtcService.mostrarCargando();
          //GUARDAR:
          this.formularioService.post<any>(dataGuardarFormData)
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
                this.formularioService.put<any>(dataGuardarFormData)
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
              this.formularioService.put<any>(dataGuardarFormData)
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
          modalRef.componentInstance.titleModal = "Vista Previa - Formulario 001/17.2";

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