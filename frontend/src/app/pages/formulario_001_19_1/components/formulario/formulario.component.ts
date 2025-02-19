/**
 * Formulario 001/19.01 utilizado por los procedimientos DGISTR-001, DGISTR-002, DGISTR-003
 * @author Alicia Toquila Quispe
 * @version 1.0 07.09.2022
*/
import { Component, OnInit, Input, ViewChild, AfterViewInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, AbstractControl, FormArray } from '@angular/forms';
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
import { Formulario001_19_1Request } from 'src/app/core/models/Formularios/Formulario001_19_1/Formulario001_19_1Request';
import { Formulario001_19_1Response } from 'src/app/core/models/Formularios/Formulario001_19_1/Formulario001_19_1Response';
import { Formulario001191Service } from '../../../../core/services/formularios/formulario001-19-1.service';
import { SunatService } from 'src/app/core/services/servicios/sunat.service';
import { exactLengthValidator, noWhitespaceValidator } from 'src/app/helpers/validator';
import { VisorPdfArchivosService } from '../../../../core/services/tramite/visor-pdf-archivos.service';
import { VistaPdfComponent } from '../../../../shared/components/vista-pdf/vista-pdf.component';
import { UbigeoComponent } from 'src/app/shared/components/forms/ubigeo/ubigeo.component';
import { defaultRadioGroupAppearanceProvider } from 'pdf-lib';

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css']
})
export class FormularioComponent implements OnInit, AfterViewInit  {

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
  txtTituloCompleto:string =  "FORMULARIO 001-19.01 INFRAESTRUCTURA Y TRANSPORTE FERROVIARIO";
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
  
  //Datos de Formulario
  tituloFormulario = 'FORMULARIO 001-19.01 INFRAESTRUCTURA Y TRANSPORTE FERROVIARIO';
  tipoPersona: number = 1 ;

  paDJ1: string[]=["DGISTR-001","DGISTR-002","DGISTR-003"];
  paDJ2: string[]=["DGISTR-001"];
  paDJ3: string[]=["DGISTR-002"];
  paDJ4: string[]=["DGISTR-001","DGISTR-002","DGISTR-003"];
  tipoAutorizacion: string[] = ["DGISTR-001"];
  
  activarDJ1: boolean=false;
  activarDJ2: boolean=false;
  activarDJ3: boolean=false;
  activarDJ4: boolean=false;
  activarTipoAutorizacion = false;

  activarPN: boolean=false;
  activarPJ: boolean=false;

  maxLengthNumeroDocumentoRepLeg: number;
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
    private formularioService: Formulario001191Service,
    private visorPdfArchivosService: VisorPdfArchivosService,
    private modalService: NgbModal,
    private sunatService: SunatService) {
  }

  async ngOnInit(): Promise<void> { 
    const tramiteSelected: any= JSON.parse(localStorage.getItem('tramite-selected'));
    this.codigoProcedimientoTupa =  tramiteSelected.codigo;
    this.descProcedimientoTupa = tramiteSelected.nombre;
    this.codigoTipoSolicitudTupa = (this.dataInput.tipoSolicitudTupaCod==""?"0":this.dataInput.tipoSolicitudTupaCod);
    this.descTipoSolicitudTupa = this.dataInput.tipoSolicitudTupaDesc;

    this.uriArchivo = this.dataInput.rutaDocumento;
    this.id = this.dataInput.movId;

    if(this.paDJ1.indexOf(this.codigoProcedimientoTupa)>-1) this.activarDJ1=true; else this.activarDJ1=false;
    if(this.paDJ2.indexOf(this.codigoProcedimientoTupa)>-1) this.activarDJ2=true; else this.activarDJ2=false;
    if(this.paDJ3.indexOf(this.codigoProcedimientoTupa)>-1) this.activarDJ3=true; else this.activarDJ3=false;
    if(this.paDJ4.indexOf(this.codigoProcedimientoTupa)>-1) this.activarDJ4=true; else this.activarDJ4=false;
    if(this.tipoAutorizacion.indexOf(this.codigoProcedimientoTupa)>-1) this.activarTipoAutorizacion=true; else this.activarTipoAutorizacion=false;

    this.formulario = this.fb.group({
      tipoAutorizacion : this.fb.control(""),
      notificacion  : this.fb.control(true,[Validators.requiredTrue]),
      tipoDocumentoSolicitante: ['',[Validators.required]],
      nroDocumentoSolicitante : ['',[Validators.required]],
      Seccion3 : this.fb.group({
          PersonaNatural : this.fb.group({
              pn_ruc          : ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(50)]],
              pn_nombres      : ['', [Validators.required, Validators.maxLength(50)]],
              pn_domicilio    : ['', [Validators.required, Validators.maxLength(50)]],
              pn_distrito     : ['', [Validators.required]],
              pn_provincia    : ['', [Validators.required]],
              pn_departamento : ['', [Validators.required]],
              pn_telefono     : ['', [Validators.required, Validators.maxLength(9)]],
              pn_celular      : ['', [Validators.required, exactLengthValidator([9])]],
              pn_correo       : ['', [Validators.required, Validators.email, noWhitespaceValidator(), Validators.maxLength(50)]]
          }),
          PersonaJuridica: this.fb.group({
            pj_ruc                     :['', [Validators.required, Validators.maxLength(11)]],
            pj_razonSocial             :['', [Validators.required, Validators.maxLength(80)]],
            pj_domicilio               :['', [Validators.required, Validators.maxLength(150)]],
            pj_distrito                :['', [Validators.required, Validators.maxLength(20)]],
            pj_provincia               :['', [Validators.required, Validators.maxLength(20)]],
            pj_departamento            :['', [Validators.required, Validators.maxLength(20)]],
          }),
          RepresentanteLegal: this.fb.group({
            rl_tipoDocumento   : ['', [Validators.required, Validators.maxLength(10)]],
            rl_numeroDocumento : ['', [Validators.required, Validators.maxLength(11)]],
            rl_nombre     : ['', [Validators.required, Validators.maxLength(30)]],
            rl_apePaterno : ['', [Validators.required, Validators.maxLength(30)]],
            rl_apeMaterno : ['', [Validators.required, Validators.maxLength(30)]],
            rl_domicilio  : ['', [Validators.required, Validators.maxLength(80)]],
            rl_telefono   : ['', [Validators.required, Validators.maxLength(20)]],
            rl_celular    : ['', [Validators.required, Validators.maxLength(9)]],
            rl_correo     : ['', [Validators.required, Validators.maxLength(50)]],
            rl_distrito   : ['', [Validators.required, Validators.maxLength(20)]],
            rl_provincia  : ['', [Validators.required, Validators.maxLength(20)]],
            rl_departamento:['', [Validators.required, Validators.maxLength(20)]],
            rl_oficina    : ['', [Validators.required, Validators.maxLength(20)]],
            rl_partida    : ['', [Validators.required, Validators.maxLength(9)]],
            rl_asiento    : ['', [Validators.required, Validators.maxLength(9)]],
          })
      }),
      Seccion5 : this.fb.group({
        declaracion_1          : this.fb.control({value:false,disabled:false},[Validators.requiredTrue]),
        declaracion_2          : this.fb.control({value:false,disabled:false},[Validators.requiredTrue]),
        declaracion_3          : this.fb.control({value:false,disabled:false},[Validators.requiredTrue]),
        declaracion_4          : this.fb.control({value:false,disabled:false},[Validators.requiredTrue]),
      })
    });
  }

  async ngAfterViewInit(): Promise<void> {
    
    this.nroRuc = this.seguridadService.getCompanyCode();
    this.nombreUsuario = this.seguridadService.getUserName();       //nombre de usuario login
    const tipoDocumento = this.seguridadService.getNameId();   //tipo de documento usuario login
    this.nroDocumentoLogin = this.seguridadService.getNumDoc();    //nro de documento usuario login
    this.tipoDocumentoValidForm = tipoDocumento;
    console.log("TIPO DOCUMENTO", tipoDocumento); //00001
    console.log("NUMERO", this.nroDocumentoLogin);

    switch (tipoDocumento){
      case "00001":
      case "00004":
      case "00005": //this.formulario.enable({emitEvent: false});
                    this.f_s3_PersonaNatural.enable({ emitEvent: false });
                    this.f_s3_PersonaJuridica.disable({ emitEvent: false });
                    this.f_s3_RepresentanteLegal.disable({ emitEvent: false });
                    this.f_TipoDocumentoSolicitante.disable();
                    this.f_NroDocumentoSolicitante.disable();
                    this.activarPN=true;
                    this.activarPJ=false;
                    break;

      case "00002": this.f_s3_PersonaNatural.disable({ emitEvent: false });
                    this.f_s3_PersonaJuridica.enable({ emitEvent: false });
                    this.f_s3_RepresentanteLegal.enable({ emitEvent: false });
                    this.activarPN=false;
                    this.activarPJ=true;
                    break;
    }

    await this.cargarOficinaRegistral();
    setTimeout(async () => {
      await this.cargarDatos();
    });
  }

  // GET FORM formularioFG
  get f_tipoAutorizacion():AbstractControl {return this.formulario.get(['tipoAutorizacion']);}
  get f_notificacion():AbstractControl {return this.formulario.get(['notificacion']); }
  get f_TipoDocumentoSolicitante():AbstractControl {return this.formulario.get(['tipoDocumentoSolicitante']); }
  get f_NroDocumentoSolicitante():AbstractControl {return this.formulario.get(['nroDocumentoSolicitante']); }
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
  get f_Seccion5(): UntypedFormGroup { return this.formulario.get('Seccion5') as UntypedFormGroup; }
  get f_declaracion_1(): AbstractControl { return this.f_Seccion5.get(['declaracion_1']); }
  get f_declaracion_2(): AbstractControl { return this.f_Seccion5.get(['declaracion_2']); }
  get f_declaracion_3(): AbstractControl { return this.f_Seccion5.get(['declaracion_3']); }
  get f_declaracion_4(): AbstractControl { return this.f_Seccion5.get(['declaracion_4']); }
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

  async cargarDatos(): Promise<void>{
    this.funcionesMtcService.mostrarCargando();
    
    switch (this.seguridadService.getNameId()){
      case '00001' :this.tipoSolicitante = 'PN'; //persona natural
                    this.f_TipoDocumentoSolicitante.setValue('DNI');
                    this.f_NroDocumentoSolicitante.setValue(this.nroDocumentoLogin);
                    this.codTipoDocSolicitante = '01';
                    this.actualizarValidaciones(this.tipoSolicitante);
                    break;

      case '00002' :this.tipoSolicitante = 'PJ'; // persona juridica
                    this.f_TipoDocumentoSolicitante.setValue('DNI');
                    this.codTipoDocSolicitante = '01';
                    this.f_NroDocumentoSolicitante.setValue(this.nroDocumentoLogin);
                    this.actualizarValidaciones(this.tipoSolicitante);
                    break;

      case '00004' :this.tipoSolicitante = 'PE'; // persona extranjera
                    this.f_TipoDocumentoSolicitante.setValue('CARNET DE EXTRANJERIA');
                    this.codTipoDocSolicitante = '04';
                    this.f_NroDocumentoSolicitante.setValue(this.nroDocumentoLogin);
                    break;

      case '00005' :this.tipoSolicitante = 'PNR'; // persona natural con ruc
                    this.f_TipoDocumentoSolicitante.setValue('DNI');
                    this.codTipoDocSolicitante = '01';
                    this.f_NroDocumentoSolicitante.setValue(this.nroDocumentoLogin);
                    break;
    }

    console.log(this.tipoSolicitante);

    if(this.dataInput != null && this.dataInput.movId > 0){
      try{
        const dataFormulario = await this.formularioTramiteService.get<Formulario001_19_1Response>(this.dataInput.tramiteReqId).toPromise();
        this.funcionesMtcService.ocultarCargando();
        const metaData = JSON.parse(dataFormulario.metaData);
        console.log(metaData);
        this.id = dataFormulario.formularioId;

        this.f_tipoAutorizacion.setValue(metaData.seccion1.tipoAutorizacion);
        this.f_notificacion.setValue(metaData.seccion2.notificacion);

        if (this.activarPN) {
          this.f_s3_pn_Nombres.setValue(metaData.seccion3.nombresApellidos);
          this.f_NroDocumentoSolicitante.setValue(metaData.seccion3.numeroDocumento);
          this.f_s3_pn_Telefono.setValue(metaData.seccion3.telefono);
          this.f_s3_pn_Celular.setValue(metaData.seccion3.celular);
          this.f_s3_pn_Correo.setValue(metaData.seccion3.email);
          this.f_s3_pn_Domicilio.setValue(metaData.seccion3.domicilioLegal);
          
          this.f_s3_pn_Departamento.setValue(metaData.seccion3.departamento);
          this.f_s3_pn_Provincia.setValue(metaData.seccion3.provincia);
          this.f_s3_pn_Distrito.setValue(metaData.seccion3.distrito);
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
        this.f_declaracion_3.setValue(metaData.seccion5.declaracion_3);
        this.f_declaracion_4.setValue(metaData.seccion5.declaracion_4);
      }
      catch(e){
        console.error(e);
        this.funcionesMtcService.ocultarCargando().mensajeError('Problemas para recuperar los datos guardados');
      }
      
    }else{
        if(this.activarPN){
          const response = await this.reniecService.getDni(this.nroDocumentoLogin).toPromise();
          try{
              this.funcionesMtcService.ocultarCargando();
    
              if (response.reniecConsultDniResponse.listaConsulta.coResultado !== '0000')
                return this.funcionesMtcService.mensajeError('Número de documento no registrado en Reniec');
    
              const datosPersona = response.reniecConsultDniResponse.listaConsulta.datosPersona;
              let ubigeo = datosPersona.ubigeo.split('/');
              this.f_NroDocumentoSolicitante.setValue(this.nroDocumentoLogin);
              this.f_s3_pn_Nombres.setValue(datosPersona.prenombres+' '+datosPersona.apPrimer+' '+datosPersona.apSegundo);
              this.f_s3_pn_Domicilio.setValue(datosPersona.direccion);
          }
          catch (e) {
            console.error(e);
            this.funcionesMtcService.ocultarCargando().mensajeError('Error al consultar al servicio');
          }
        }
        if(this.activarPJ){
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
    console.log("Numero Documento: "+numeroDocumento);
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

  actualizarValidaciones(tipoSolicitante){
    switch (tipoSolicitante){
      case "PN":  this.f_s3_pn_Ruc.clearValidators();
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

      case "PJ":  this.f_s3_pn_Ruc.clearValidators();
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

    if (this.formulario.invalid === true)
      return this.funcionesMtcService.mensajeError('Debe ingresar todos los campos obligatorios');
      let oficinaRepresentante=this.f_s3_rl_Oficina.value;
      //let departamento = this.f_s6_pn_Departamento.filter(item => item.value == oficinaRepresentante)[0].text;

      let dataGuardar: Formulario001_19_1Request = new Formulario001_19_1Request(); 
      
      dataGuardar.id = this.id;
      dataGuardar.codigo = 'F001-19-1';
      dataGuardar.formularioId =  2;
      dataGuardar.codUsuario =  this.nroDocumentoLogin;
      dataGuardar.idTramiteReq = this.dataInput.tramiteReqId,
      dataGuardar.estado =  1; 
      dataGuardar.metaData.seccion1.dgistr_001 = (this.codigoProcedimientoTupa==="DGISTR-001"?"1":"0");
      dataGuardar.metaData.seccion1.dgistr_002 = (this.codigoProcedimientoTupa==="DGISTR-002"?"1":"0");
      dataGuardar.metaData.seccion1.dgistr_003 = (this.codigoProcedimientoTupa==="DGISTR-003"?"1":"0");
      dataGuardar.metaData.seccion1.tipoAutorizacion = this.f_tipoAutorizacion.value;
      
      dataGuardar.metaData.seccion2.notificacion = this.f_notificacion.value;
      
      dataGuardar.metaData.seccion3.tipoSolicitante= this.tipoSolicitante;
      dataGuardar.metaData.seccion3.nombresApellidos = (this.tipoSolicitante ==='PN' || this.tipoSolicitante ==='PNR' || this.tipoSolicitante ==='PE' ? this.f_s3_pn_Nombres.value : '');
      dataGuardar.metaData.seccion3.tipoDocumento = (this.tipoSolicitante==="PJ"?this.f_s3_rl_TipoDocumento.value:this.codTipoDocSolicitante); //codDocumento
      dataGuardar.metaData.seccion3.numeroDocumento = (this.tipoSolicitante==="PJ"?this.f_s3_pj_Ruc.value:this.f_NroDocumentoSolicitante.value); //nroDocumento
      dataGuardar.metaData.seccion3.ruc = (this.tipoSolicitante==="PJ"?this.f_s3_pj_Ruc.value:this.f_s3_pn_Ruc.value);
      dataGuardar.metaData.seccion3.razonSocial = (this.tipoSolicitante ==='PJ' ? this.f_s3_pj_RazonSocial.value : '');
      dataGuardar.metaData.seccion3.domicilioLegal = (this.tipoSolicitante ==='PJ' ?this.f_s3_pj_Domicilio.value : this.f_s3_pn_Domicilio.value);
      dataGuardar.metaData.seccion3.departamento =  (this.tipoSolicitante ==='PJ' ? this.f_s3_pj_Departamento.value : this.f_s3_pn_Departamento.value);
      dataGuardar.metaData.seccion3.provincia = (this.tipoSolicitante ==='PJ' ? this.f_s3_pj_Provincia.value : this.f_s3_pn_Provincia.value);
      dataGuardar.metaData.seccion3.distrito = (this.tipoSolicitante ==='PJ' ? this.f_s3_pj_Distrito.value : this.f_s3_pn_Distrito.value);
      dataGuardar.metaData.seccion3.representanteLegal.nombres = this.f_s3_rl_Nombre.value;
      dataGuardar.metaData.seccion3.representanteLegal.apellidoPaterno = this.f_s3_rl_ApePaterno.value;
      dataGuardar.metaData.seccion3.representanteLegal.apellidoMaterno = this.f_s3_rl_ApeMaterno.value;
      dataGuardar.metaData.seccion3.representanteLegal.tipoDocumento.id = this.f_s3_rl_TipoDocumento.value;
      dataGuardar.metaData.seccion3.representanteLegal.tipoDocumento.documento = (this.tipoSolicitante==="PJ"?this.listaTiposDocumentos.filter(item => item.id == this.f_s3_rl_TipoDocumento.value)[0].documento:"");
      dataGuardar.metaData.seccion3.representanteLegal.numeroDocumento = this.f_s3_rl_NumeroDocumento.value;
      dataGuardar.metaData.seccion3.representanteLegal.domicilioLegal = this.f_s3_rl_Domicilio.value;
      dataGuardar.metaData.seccion3.representanteLegal.oficinaRegistral.id =  oficinaRepresentante;
      dataGuardar.metaData.seccion3.representanteLegal.oficinaRegistral.descripcion =  (this.tipoSolicitante==="PJ"?this.oficinasRegistral.filter(item => item.value == oficinaRepresentante)[0].text:"");
      dataGuardar.metaData.seccion3.representanteLegal.partida =  this.f_s3_rl_Partida.value;
      dataGuardar.metaData.seccion3.representanteLegal.asiento =  this.f_s3_rl_Asiento.value;
      dataGuardar.metaData.seccion3.representanteLegal.distrito.id =  (this.tipoSolicitante ==='PJ' ? this.f_s3_rl_Distrito.value:"");
      dataGuardar.metaData.seccion3.representanteLegal.distrito.descripcion =  (this.tipoSolicitante ==='PJ' ? this.ubigeoRepLegComponent.getDistritoText():"");
      dataGuardar.metaData.seccion3.representanteLegal.provincia.id =  (this.tipoSolicitante ==='PJ' ? this.f_s3_rl_Provincia.value:"");
      dataGuardar.metaData.seccion3.representanteLegal.provincia.descripcion =  (this.tipoSolicitante ==='PJ' ? this.ubigeoRepLegComponent.getProvinciaText():"");
      dataGuardar.metaData.seccion3.representanteLegal.departamento.id =  (this.tipoSolicitante ==='PJ' ? this.f_s3_rl_Departamento.value:"");
      dataGuardar.metaData.seccion3.representanteLegal.departamento.descripcion =  (this.tipoSolicitante ==='PJ' ? this.ubigeoRepLegComponent.getDepartamentoText():"");
      dataGuardar.metaData.seccion3.telefono =  (this.tipoSolicitante ==='PJ' ?this.f_s3_rl_Telefono.value:this.f_s3_pn_Telefono.value);
      dataGuardar.metaData.seccion3.celular = (this.tipoSolicitante ==='PJ' ?this.f_s3_rl_Celular.value:this.f_s3_pn_Celular.value);
      dataGuardar.metaData.seccion3.email = (this.tipoSolicitante ==='PJ' ?this.f_s3_rl_Correo.value:this.f_s3_pn_Correo.value);

      dataGuardar.metaData.seccion5.declaracion_1 = this.f_declaracion_1.value;
      dataGuardar.metaData.seccion5.declaracion_2 = this.f_declaracion_2.value;
      dataGuardar.metaData.seccion5.declaracion_3 = this.f_declaracion_3.value;
      dataGuardar.metaData.seccion5.declaracion_4 = this.f_declaracion_4.value;
      
      dataGuardar.metaData.seccion6.tipoDocumentoSolicitante = this.codTipoDocSolicitante; 
      dataGuardar.metaData.seccion6.nombreTipoDocumentoSolicitante = this.f_TipoDocumentoSolicitante.value;
      dataGuardar.metaData.seccion6.numeroDocumentoSolicitante = this.f_NroDocumentoSolicitante.value;
      dataGuardar.metaData.seccion6.nombresApellidosSolicitante = this.nombreUsuario;

      console.log(JSON.stringify(dataGuardar));  
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
          modalRef.componentInstance.titleModal = "Vista Previa - Formulario 002/28";

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