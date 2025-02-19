/**
 * Formulario 001/12 utilizado por los procedimientos DSA-001
 * @author Alicia Toquila Quispe
 * @version 1.0 10.12.2021
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
import { Formulario001_12Request } from 'src/app/core/models/Formularios/Formulario001_12/Formulario001_12Request';
import { Formulario001_12Response } from 'src/app/core/models/Formularios/Formulario001_12/Formulario001_12Response';
import { Formulario00112Service } from '../../../../core/services/formularios/formulario001-12.service';
import { SunatService } from 'src/app/core/services/servicios/sunat.service';
import { VisorPdfArchivosService } from '../../../../core/services/tramite/visor-pdf-archivos.service';
import { VistaPdfComponent } from '../../../../shared/components/vista-pdf/vista-pdf.component';
import { defaultRadioGroupAppearanceProvider } from 'pdf-lib';
import { exactLengthValidator, noWhitespaceValidator } from 'src/app/helpers/validator';
import { MetaData } from 'src/app/core/models/Formularios/Formulario001_12/MetaData';
import { DatosUsuarioLogin } from 'src/app/core/models/Autenticacion/DatosUsuarioLogin';
import { CONSTANTES } from 'src/app/enums/constants';


@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css']
})
export class FormularioComponent implements OnInit {

  @Input() public dataInput: any;
  @Input() public dataRequisitosInput: any;
  @Input() public dataTipoSolicitud: any;
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

  datosUsuarioLogin: DatosUsuarioLogin
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
  titulo = 'FORMULARIO 001/12 PERSONAL AERONAUTICO';
  tipoPersona: number = 1 ;

  paSeccion1: string[]=["DSA-001","DSA-003","DSA-005","S-DGAC-001","S-DSA-001"];
  paSeccion11:string[]=["DSA-001","DSA-003","DSA-005"];
  paSeccion2: string[]=["DSA-001","DSA-003","DSA-005","S-DGAC-001","S-DSA-001"];
  paSeccion3: string[]=["DSA-001","DSA-003","DSA-005","S-DGAC-001","S-DSA-001"];
  paSeccion4: string[]=["DSA-001","DSA-003","DSA-005","S-DGAC-001","S-DSA-001"];

  habilitarSeccion1:boolean=true;
  habilitarSeccion11:boolean=true;
  habilitarSeccion2:boolean=true;
  habilitarSeccion3:boolean=true;
  habilitarSeccion4:boolean=true;

  paDJ1: string[]=["DSA-001","DSA-003","DSA-005","S-DGAC-001","S-DSA-001"];
  paDJ2: string[]=["DSA-001","DSA-003","DSA-005","S-DGAC-001","S-DSA-001"];

  activarDJ1: boolean=true;
  activarDJ2: boolean=true;

  activarPN: boolean=true;
  activarPJ: boolean=false;

  servicio:string="1";

  constructor(
    private fb: UntypedFormBuilder,
    public activeModal: NgbActiveModal,
    public tramiteService: TramiteService,
    private funcionesMtcService: FuncionesMtcService,
    private seguridadService: SeguridadService,
    private reniecService: ReniecService,
    private extranjeriaService: ExtranjeriaService,
    private formularioTramiteService: FormularioTramiteService,
    private formularioService: Formulario00112Service,
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
      // tipoSolicitud           : this.fb.control({value:this.codigoTipoSolicitudTupa, disabled:true} ),

      tipoLicencia            : this.fb.control("",[Validators.required]),
      numeroEvalTeorica       : this.fb.control("",[Validators.required]),
      numeroEvalPractica      : this.fb.control("",[Validators.required]),
      numeroEvalCompetencia   : this.fb.control("",[Validators.required]),

      modalidadNotificacion   : ["", [Validators.required]],

      tipoDocumentoSolicitante: this.fb.control("",[Validators.required]),
      nroDocumentoSolicitante : this.fb.control("",[Validators.required, exactLengthValidator([8, 9])]),
      rucPersona              : this.fb.control(""),
      nombresPersona          : this.fb.control("",[Validators.required, noWhitespaceValidator(), Validators.maxLength(50)]),
      domicilioPersona        : this.fb.control("",[Validators.required, noWhitespaceValidator(), Validators.maxLength(200)]),
      distritoPersona         : this.fb.control("",[Validators.required]),
      provinciaPersona        : this.fb.control("",[Validators.required]),
      departamentoPersona     : this.fb.control("",[Validators.required]),
      telefonoPersona         : this.fb.control("",[Validators.maxLength(9)]),
      celularPersona          : this.fb.control("",[Validators.required, exactLengthValidator([9])]),
      correoPersona           : this.fb.control("",[Validators.required, Validators.email, noWhitespaceValidator(), Validators.maxLength(50)]),

      peso                    : this.fb.control("",[Validators.required]),
      estatura                : this.fb.control("",[Validators.required]),
      colorOjos               : this.fb.control("",[Validators.required]),
      colorCabello            : this.fb.control("",[Validators.required]),
      nacionalidad            : this.fb.control("",[Validators.required]),
      fechaNacimiento         : this.fb.control("",[Validators.required]),
      licencia                : this.fb.control("",[Validators.required]),
      numeroLicencia          : this.fb.control("",[Validators.required]),

      declaracion_1          : this.fb.control(false,[Validators.requiredTrue]),
      declaracion_2          : this.fb.control(false,[Validators.requiredTrue]),
    });
    //this.cargarOficinaRegistral();
    this.nroRuc = this.seguridadService.getCompanyCode();
    this.razonSocial = this.seguridadService.getUserName();       //nombre de usuario login
    const tipoDocumento = this.seguridadService.getNameId();   //tipo de documento usuario login
    this.nroDocumentoLogin = this.seguridadService.getNumDoc();    //nro de documento usuario login
    this.datosUsuarioLogin = this.seguridadService.getDatosUsuarioLogin();
    this.tipoDocumentoValidForm = tipoDocumento;

    this.cargarDatos();
    this.recuperarDatosUsuario();

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

  getMaxLengthNumeroDocumento() {
    const tipoDocumento: string = this.formulario.controls['tipoDocumento'].value.trim();

    if (tipoDocumento === '01')//N° de DNI
      return 8;
    else if (tipoDocumento === '04')//Carnet de extranjería
      return 12;
    return 0
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

    switch (this.seguridadService.getNameId()){
      case '00001' :this.tipoSolicitante = 'PN'; //persona natural
                    this.formulario.controls['tipoDocumentoSolicitante'].setValue('DNI');
                    this.codTipoDocSolicitante = '01';
                    break;

      case '00002' :this.tipoSolicitante = 'PJ'; // persona juridica
                    this.formulario.controls['tipoDocumentoSolicitante'].setValue('DNI');
                    break;

      case '00004' :this.tipoSolicitante = 'PE'; // persona extranjera
                    switch(this.datosUsuarioLogin.tipoDocumento){
                      case CONSTANTES.TipoDocPersonaExtranjera.CARNET_EXTRANJERIA: this.formulario.controls['tipoDocumentoSolicitante'].setValue("CARNET DE EXTRANJERÍA"); break;
                      case CONSTANTES.TipoDocPersonaExtranjera.CARNET_SOLICITANTE_REFUGIO: this.formulario.controls['tipoDocumentoSolicitante'].setValue("CARNET SOLIC. REFUGIO"); break;
                      case CONSTANTES.TipoDocPersonaExtranjera.CARNET_PERMISO_TEMPORAL_PERMANENCIA: this.formulario.controls['tipoDocumentoSolicitante'].setValue("CARNET PERMISO TEMP. PERMANENCIA"); break;
                      case CONSTANTES.TipoDocPersonaExtranjera.CARNET_IDENTIFICACION: this.formulario.controls['tipoDocumentoSolicitante'].setValue("CARNET DE IDENTIFICACIÓN"); break;
                      case CONSTANTES.TipoDocPersonaExtranjera.PASAPORTE: this.formulario.controls['tipoDocumentoSolicitante'].setValue("PASAPORTE"); break;
                    }
                    this.codTipoDocSolicitante = '04';
                    break;

      case '00005' :this.tipoSolicitante = 'PNR'; // persona natural con ruc
                    this.formulario.controls['tipoDocumentoSolicitante'].setValue('DNI');
                    this.codTipoDocSolicitante = '01';
                    break;
    }

    if(this.dataInput != null && this.dataInput.movId > 0){

      this.funcionesMtcService.mostrarCargando();
      this.formularioTramiteService.get<any>(this.dataInput.tramiteReqId).subscribe(
        (dataFormulario: Formulario001_12Response) => {
          this.funcionesMtcService.ocultarCargando();

          const metaData: MetaData = JSON.parse(dataFormulario.metaData);

          this.id = dataFormulario.formularioId;

          this.formulario.controls["tipoLicencia"].setValue(metaData.seccion1.TipoLicencia);

          if(this.codigoProcedimientoTupa=="DSA-001" || this.codigoProcedimientoTupa=="DSA-003" || this.codigoProcedimientoTupa=="DSA-005"){
            this.formulario.controls["numeroEvalTeorica"].setValue(metaData.seccion1.NroOficioEvalTeorica);
            this.formulario.controls["numeroEvalPractica"].setValue(metaData.seccion1.NroOficioEvalPractica);
            this.formulario.controls["numeroEvalCompetencia"].setValue(metaData.seccion1.NroOficioEvalCompetencia);
          }

          this.formulario.controls["modalidadNotificacion"].setValue(metaData.seccion2.modalidadNotificacion.toString());

          // this.formulario.controls["tipoDocumentoSolicitante"].setValue(metaData.seccion3.TipoDocumento);
          this.formulario.controls["nroDocumentoSolicitante"].setValue(metaData.seccion3.NumeroDocumento);
          this.formulario.controls["rucPersona"].setValue(metaData.seccion3.Ruc);
          this.formulario.controls["nombresPersona"].setValue(metaData.seccion3.NombresApellidos);
          this.formulario.controls["domicilioPersona"].setValue(metaData.seccion3.DomicilioLegal);
          this.formulario.controls["distritoPersona"].setValue(metaData.seccion3.Distrito);
          this.formulario.controls["provinciaPersona"].setValue(metaData.seccion3.Provincia);
          this.formulario.controls["departamentoPersona"].setValue(metaData.seccion3.Departamento);
          this.formulario.controls["telefonoPersona"].setValue(metaData.seccion3.Telefono);
          this.formulario.controls["celularPersona"].setValue(metaData.seccion3.Celular);
          this.formulario.controls["correoPersona"].setValue(metaData.seccion3.Email);

          this.formulario.controls["peso"].setValue(metaData.seccion3.Peso);
          this.formulario.controls["estatura"].setValue(metaData.seccion3.Estatura);
          this.formulario.controls["colorOjos"].setValue(metaData.seccion3.ColorOjos);
          this.formulario.controls["colorCabello"].setValue(metaData.seccion3.ColorCabello);
          this.formulario.controls["nacionalidad"].setValue(metaData.seccion3.Nacionalidad);
          this.formulario.controls["fechaNacimiento"].setValue(metaData.seccion3.FechaNacimiento);
          this.formulario.controls["licencia"].setValue(metaData.seccion3.RegistroLicencia);
          this.formulario.controls["numeroLicencia"].setValue(metaData.seccion3.NumeroLicencia);

          this.formulario.controls["declaracion_1"].setValue(metaData.seccion5.declaracion_1);
          this.formulario.controls["declaracion_2"].setValue(metaData.seccion5.declaracion_2);

        }, (error) => {
            this.funcionesMtcService.ocultarCargando().mensajeError('Problemas para recuperar los datos guardados');
        }
      );
    }else{

      this.formulario.controls['nroDocumentoSolicitante'].setValue(this.nroDocumentoLogin);
      this.formulario.controls['rucPersona'].setValue(this.seguridadService.getCompanyCode());
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

      if(this.tipoSolicitante == 'PE'){ // persona extranjera
        console.log("datosUsuarioLogin", this.datosUsuarioLogin)
        this.formulario.controls['nombresPersona'].setValue(`${this.datosUsuarioLogin.nombres} ${this.datosUsuarioLogin.apeMaterno} ${this.datosUsuarioLogin.apePaterno}`);

        this.formulario.controls['domicilioPersona'].setValue(this.datosUsuarioLogin.direccion);
        this.formulario.controls['distritoPersona'].setValue(this.datosUsuarioLogin.distrito);
        this.formulario.controls['provinciaPersona'].setValue(this.datosUsuarioLogin.provincia);
        this.formulario.controls['departamentoPersona'].setValue(this.datosUsuarioLogin.departamento);
        this.formulario.controls['telefonoPersona'].setValue(this.datosUsuarioLogin.telefono);
        this.formulario.controls['celularPersona'].setValue(this.datosUsuarioLogin.celular);
        this.formulario.controls['correoPersona'].setValue(this.datosUsuarioLogin.correo);
      }else{
        this.funcionesMtcService.mostrarCargando();
        this.reniecService.getDni(this.nroDocumentoLogin).subscribe(
          (respuesta) => {
            this.funcionesMtcService.ocultarCargando();

            if (respuesta.reniecConsultDniResponse.listaConsulta.coResultado !== '0000')
              return this.funcionesMtcService.mensajeError('Número de documento no registrado en Reniec');
            const datosPersona = respuesta.reniecConsultDniResponse.listaConsulta.datosPersona;

            const ubigeo = datosPersona.ubigeo.split("/");
            this.formulario.controls['nombresPersona'].setValue(datosPersona.prenombres+" "+datosPersona.apPrimer+" "+datosPersona.apSegundo);
            this.formulario.controls['domicilioPersona'].setValue(datosPersona.direccion);

            this.formulario.controls['distritoPersona'].setValue(ubigeo[2]);
            this.formulario.controls['provinciaPersona'].setValue(ubigeo[1]);
            this.formulario.controls['departamentoPersona'].setValue(ubigeo[0]);
          },
          (error) => {
            this.funcionesMtcService.ocultarCargando().mensajeError('Error al consultar al servicio de la RENIEC');
          }
        );
      }
    }

    if(this.tipoSolicitante == 'PNR'){
      this.formulario.controls['rucPersona'].setValidators([Validators.required, exactLengthValidator([11])]);
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

  soloNumerosDecimal(event) {
    event.target.value = event.target.value.replace(/[^0-9\.]/g, '');
  }

  soloTexto(event) {
    event.target.value = event.target.value.replace(/[^a-zA-Z]/g, '');
  }

  guardarFormulario() {

    if (this.formulario.invalid === true)
      return this.funcionesMtcService.mensajeError('Debe ingresar todos los campos obligatorios');

      let data: Formulario001_12Request = new Formulario001_12Request();
      let form = this.formulario.controls;

      data.id = this.id;
      data.codigo = "F001-12";
      data.formularioId = 1;
      data.codUsuario = this.nroDocumentoLogin;
      data.idTramiteReq = this.dataInput.tramiteReqId;
      data.estado = 1;
      data.metaData.seccion1.Dsa_001_1 = (this.codigoProcedimientoTupa==="DSA-001" && this.codigoTipoSolicitudTupa == "1" ?"1":"0");
      data.metaData.seccion1.Dsa_001_2 = (this.codigoProcedimientoTupa==="DSA-001" && this.codigoTipoSolicitudTupa == "2" ?"1":"0");
      data.metaData.seccion1.Dsa_003 = (this.codigoProcedimientoTupa==="DSA-003" ?"1":"0");
      data.metaData.seccion1.Dsa_005 = (this.codigoProcedimientoTupa==="DSA-005" ?"1":"0");
      data.metaData.seccion1.S_dgac_001 = (this.codigoProcedimientoTupa==="S-DGAC-001" ?"1":"0");
      data.metaData.seccion1.S_dsa_001 = (this.codigoProcedimientoTupa==="S-DSA-001" ?"1":"0");
      data.metaData.seccion1.TipoLicencia= form['tipoLicencia'].value;
      data.metaData.seccion1.NroOficioEvalTeorica= form['numeroEvalTeorica'].value;
      data.metaData.seccion1.NroOficioEvalPractica=form['numeroEvalPractica'].value;
      data.metaData.seccion1.NroOficioEvalCompetencia= form['numeroEvalCompetencia'].value;

      data.metaData.seccion2.modalidadNotificacion = this.formulario.controls['modalidadNotificacion'].value;

      data.metaData.seccion3.TipoSolicitante = this.tipoSolicitante;
      data.metaData.seccion3.NombresApellidos = this.formulario.controls['nombresPersona'].value;
      data.metaData.seccion3.TipoDocumento = this.codTipoDocSolicitante;
      data.metaData.seccion3.NumeroDocumento = this.formulario.controls['nroDocumentoSolicitante'].value;
      data.metaData.seccion3.Ruc =  this.formulario.controls['rucPersona'].value;
      data.metaData.seccion3.DomicilioLegal = this.formulario.controls['domicilioPersona'].value;
      data.metaData.seccion3.Distrito = this.formulario.controls['distritoPersona'].value;
      data.metaData.seccion3.Provincia = this.formulario.controls['provinciaPersona'].value;
      data.metaData.seccion3.Departamento = this.formulario.controls['departamentoPersona'].value;
      data.metaData.seccion3.Telefono = this.formulario.controls['telefonoPersona'].value;
      data.metaData.seccion3.Celular = this.formulario.controls['celularPersona'].value;
      data.metaData.seccion3.Email = this.formulario.controls['correoPersona'].value;
      data.metaData.seccion3.Peso = this.formulario.controls['peso'].value;
      data.metaData.seccion3.Estatura = this.formulario.controls['estatura'].value;
      data.metaData.seccion3.ColorOjos = this.formulario.controls['colorOjos'].value;
      data.metaData.seccion3.ColorCabello = this.formulario.controls['colorCabello'].value;
      data.metaData.seccion3.Nacionalidad = this.formulario.controls['nacionalidad'].value;
      data.metaData.seccion3.FechaNacimiento = this.formulario.controls['fechaNacimiento'].value;
      data.metaData.seccion3.RegistroLicencia = this.formulario.controls['licencia'].value;
      data.metaData.seccion3.NumeroLicencia = this.formulario.controls['numeroLicencia'].value;
      // data.metaData.seccion3.Notificacion = "S";
      data.metaData.seccion5.declaracion_1 = this.formulario.controls['declaracion_1'].value;
      data.metaData.seccion5.declaracion_2 = this.formulario.controls['declaracion_2'].value;
      data.metaData.seccion6.dni = this.formulario.controls['nroDocumentoSolicitante'].value;
      data.metaData.seccion6.nombre = this.formulario.controls['nombresPersona'].value;

      //const dataGuardar = this.funcionesMtcService.jsonToFormData(data);

      this.funcionesMtcService.mensajeConfirmar(`¿Está seguro de ${this.id === 0 ? 'guardar' : 'modificar'} los datos ingresados?`)
        .then(() => {
        if (this.id === 0) {
          this.funcionesMtcService.mostrarCargando();
          //GUARDAR:
          this.formularioService.post<any>(data)
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
                this.formularioService.put<any>(data)
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
              this.formularioService.put<any>(data)
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
          modalRef.componentInstance.titleModal = "Vista Previa - Formulario 001/12";

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
