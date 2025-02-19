/**
 * Formulario 007/12 utilizado por los procedimientos DGAC-021, DGAC-022, DGAC-023, S-DGAC-009
 * @author Alicia Toquila Quispe
 * @version 1.1 14.11.2021
 * updated at 07.03.2022
 * Andre Bernabe Perez
 */

import { Component, OnInit, Injectable, ViewChild, Input, AfterViewInit } from '@angular/core';
import { AbstractControlOptions, FormArray, UntypedFormBuilder, FormControl, UntypedFormGroup, Validators } from '@angular/forms';
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
import { Formulario007_12Request } from 'src/app/core/models/Formularios/Formulario007_12/Formulario007_12Request';
import { Formulario007_12Response } from 'src/app/core/models/Formularios/Formulario007_12/Formulario007_12Response';
import { Formulario00712Service } from '../../../../core/services/formularios/formulario007-12.service';
import { SunatService } from 'src/app/core/services/servicios/sunat.service';
import { VisorPdfArchivosService } from '../../../../core/services/tramite/visor-pdf-archivos.service';
import { VistaPdfComponent } from '../../../../shared/components/vista-pdf/vista-pdf.component';
import { defaultRadioGroupAppearanceProvider } from 'pdf-lib';
import { RenatService } from 'src/app/core/services/servicios/renat.service';
import { exactLengthValidator, noWhitespaceValidator, requireCheckboxesToBeCheckedValidator } from 'src/app/helpers/validator';
import { UbigeoComponent } from 'src/app/shared/components/forms/ubigeo/ubigeo.component';
import { MetaData } from 'src/app/core/models/Formularios/Formulario007_12/MetaData';
import { DatosUsuarioLogin } from 'src/app/core/models/Autenticacion/DatosUsuarioLogin';

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css']
})
export class FormularioComponent implements OnInit {

  @Input() public dataInput: any;
  @Input() public dataRequisitosInput: any;
  @ViewChild('acc') acc: NgbAccordionDirective ;

  @ViewChild('ubigeoCmpPerNat') ubigeoPerNatComponent: UbigeoComponent;
  @ViewChild('ubigeoCmpRepLeg') ubigeoRepLegComponent: UbigeoComponent;

  disabled = true;
  graboUsuario = false;

  codigoProcedimientoTupa: string;
  descProcedimientoTupa: string;
  tramiteSelected: string;
  codigoTipoSolicitudTupa: string;
  descTipoSolicitudTupa: string;

  datosUsuarioLogin: DatosUsuarioLogin;

  txtTitulo = '';
  id = 0;
  uriArchivo = ''; // PARA SABER EL NOMBRE DEL PDF (COMPLETO CON TODO Y ADJUNTOS)
  tipoDocumentoValidForm: string;

  formulario: UntypedFormGroup;

  listaTiposDocumentos: TipoDocumentoModel[] = [
    { id: '01', documento: 'DNI' },
    { id: '04', documento: 'Carnet de Extranjería' },
  ];
  representanteLegal: RepresentanteLegal[] = [];
  activarDatosGenerales = false;
  esRepresentante = false;
  tipoDocumento: TipoDocumentoModel;
  oficinasRegistral: any = [];

  nroDocumentoLogin: string;
  nombreUsuario: string;
  personaJuridica = false;
  nroRuc = '';
  razonSocial: string;
  filePdfPathName: string = null;
  cargoRepresentanteLegal = '';

  disableBtnBuscarRepLegal = false;

  tipoSolicitante = '';
  codTipoDocSolicitante = ''; // 01 DNI  03 CI  04 CE

  maxLengthNumeroDocumentoRepLeg: number;

  visibleButtonMemoriaDescriptiva = false;
  filePdfMemoriaDescriptivaSeleccionado: any = null;
  pathPdfMemoriaDescriptivaSeleccionado: any = null;

  visibleButtonImpactoAmbiental = false;
  filePdfImpactoAmbientalSeleccionado: any = null;
  pathPdfImpactoAmbientalSeleccionado: any = null;

  visibleButtonHabilidadProfesional = false;
  filePdfHabilidadProfesionalSeleccionado: any = null;
  pathPdfHabilidadProfesionalSeleccionado: any = null;
  // Datos de Formulario
  titulo = 'FORMULARIO 007/12 INFRAESTRUCTURA AEROPORTUARIA';
  tipoPersona = 1;

  paSeccion1: string[] = ['DGAC-020', 'DGAC-021', 'DGAC-022', 'DGAC-023', 'S-DGAC-009'];
  paSeccion11: string[] = ['DGAC-020', 'DGAC-021'];
  paSeccion12: string[] = ['DGAC-022', 'DGAC-023'];
  paSeccion3: string[] = ['DGAC-020', 'DGAC-021', 'DGAC-022', 'DGAC-023', 'S-DGAC-009'];

  habilitarSeccion1 = true;
  habilitarSeccion11 = true;
  habilitarSeccion12 = true;
  habilitarSeccion2 = true;
  habilitarSeccion3 = true;
  habilitarSeccion4 = true;

  paDJ1: string[] = ['DGAC-020', 'DGAC-021', 'DGAC-022', 'DGAC-023', 'S-DGAC-009'];
  paDJ2: string[] = ['DGAC-020', 'DGAC-021', 'DGAC-022', 'DGAC-023', 'S-DGAC-009'];

  activarDJ1 = true;
  activarDJ2 = true;

  activarPN = false;
  activarPJ = false;

  constructor(
    private fb: UntypedFormBuilder,
    public activeModal: NgbActiveModal,
    public tramiteService: TramiteService,
    private oficinaRegistralService: OficinaRegistralService,
    private funcionesMtcService: FuncionesMtcService,
    private seguridadService: SeguridadService,
    private reniecService: ReniecService,
    private extranjeriaService: ExtranjeriaService,
    private formularioTramiteService: FormularioTramiteService,
    private formularioService: Formulario00712Service,
    private visorPdfArchivosService: VisorPdfArchivosService,
    private modalService: NgbModal,
    private sunatService: SunatService) {
  }

  ngOnInit(): void {
    const tramiteSelected: any = JSON.parse(localStorage.getItem('tramite-selected'));
    this.codigoProcedimientoTupa = tramiteSelected.codigo;
    this.descProcedimientoTupa = tramiteSelected.nombre;
    this.codigoTipoSolicitudTupa = (this.dataInput.tipoSolicitudTupaCod == "" ? '0' : this.dataInput.tipoSolicitudTupaCod);
    this.descTipoSolicitudTupa = this.dataInput.tipoSolicitudTupaDesc;

    this.uriArchivo = this.dataInput.rutaDocumento;
    this.id = this.dataInput.movId;

    if(this.paSeccion11.indexOf(this.codigoProcedimientoTupa)>-1) this.habilitarSeccion11=true; else this.habilitarSeccion11=false;
    if(this.paSeccion12.indexOf(this.codigoProcedimientoTupa)>-1) this.habilitarSeccion12=true; else this.habilitarSeccion12=false;

    this.formulario = this.fb.group({
      procedimiento: this.fb.control({ value: this.codigoProcedimientoTupa, disabled: true }, [Validators.required]),

      memoriaDescriptiva: ['', [Validators.requiredTrue]],
      estudioImpactoAmbiental: ['', [Validators.requiredTrue]],
      certificadoHabilidadProfesional: ['', [Validators.requiredTrue]],
      profesionalHabilitadoNombre: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(100)]],
      profesionalHabilitadoProfesion: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(100)]],
      profesionalHabilitadoColegiatura: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(100)]],

      usoAerodromo: this.fb.group({ publico: [''], privado: [''] },{ validators: [requireCheckboxesToBeCheckedValidator()], } as AbstractControlOptions ),
      propietarioAerodromoOficina: ['', [Validators.required]],
      propietarioAerodromoPartida: ['', [Validators.required, Validators.maxLength(15)]],
      propietarioAerodromoAsiento: ['', [Validators.required, Validators.maxLength(15)]],
      oficio_dgac: ['', [Validators.required, Validators.maxLength(30)]],

      modalidadNotificacion: ["", [Validators.required]],

      tipoDocumentoSolicitante: this.fb.control("", [Validators.required, noWhitespaceValidator(), Validators.maxLength(20)]),
      nroDocumentoSolicitante: this.fb.control("", [Validators.required, exactLengthValidator([8, 9])]),
      rucPersona: this.fb.control("", [Validators.required, exactLengthValidator([11])]),
      nombresPersona: this.fb.control("", [Validators.required, noWhitespaceValidator(), Validators.maxLength(50)]),
      domicilioPersona: this.fb.control("", [Validators.required, noWhitespaceValidator(), Validators.maxLength(200)]),
      distritoPersona: this.fb.control("", [Validators.required]),
      provinciaPersona: this.fb.control("", [Validators.required]),
      departamentoPersona: this.fb.control("", [Validators.required]),
      telefonoPersona: this.fb.control("", [Validators.maxLength(9)]),
      celularPersona: this.fb.control("", [Validators.required, exactLengthValidator([9])]),
      correoPersona: this.fb.control("", [Validators.required, Validators.email, noWhitespaceValidator(), Validators.maxLength(50)]),

      ruc: this.fb.control({ value: '', disabled: true }, [Validators.required, exactLengthValidator([11])]),
      razonSocial: this.fb.control({ value: '', disabled: true }, [Validators.required]),
      domicilio: this.fb.control("", [Validators.required, noWhitespaceValidator(), Validators.maxLength(250)]),
      distrito: this.fb.control("", [Validators.required]),
      provincia: this.fb.control("", [Validators.required]),
      departamento: this.fb.control("", [Validators.required]),
      tipoDocumento: this.fb.control("", [Validators.required]),
      numeroDocumento: this.fb.control("", [Validators.required, exactLengthValidator([8, 9])]),
      nombreRepresentante: this.fb.control("", [Validators.required, noWhitespaceValidator(), Validators.maxLength(100)]),
      apePaternoRepresentante: this.fb.control("", [Validators.required, noWhitespaceValidator(), Validators.maxLength(50)]),
      apeMaternoRepresentante: this.fb.control("", [Validators.required, noWhitespaceValidator(), Validators.maxLength(50)]),
      domicilioRepresentante: this.fb.control("", [Validators.required, noWhitespaceValidator(), Validators.maxLength(200)]),
      telefonoRepresentante: this.fb.control("",[Validators.maxLength(9)]),
      celularRepresentante: this.fb.control("", [Validators.required, exactLengthValidator([9])]),
      correoRepresentante: this.fb.control("", [Validators.required, Validators.email, noWhitespaceValidator(), Validators.maxLength(50)]),
      distritoRepresentante: this.fb.control("", [Validators.required]),
      provinciaRepresentante: this.fb.control("", [Validators.required]),
      departamentoRepresentante: this.fb.control("", [Validators.required]),
      oficinaRepresentante: this.fb.control("", [Validators.required]),
      partidaRepresentante: this.fb.control("", [Validators.required, Validators.maxLength(15)]),
      asientoRepresentante: this.fb.control("", [Validators.required, Validators.maxLength(15)]),

      declaracion_1: this.fb.control(false, [Validators.requiredTrue]),
      declaracion_2: this.fb.control(false, [Validators.requiredTrue]),
    });

    this.cargarOficinaRegistral();
    this.nroRuc = this.seguridadService.getCompanyCode();
    this.razonSocial = this.seguridadService.getUserName();       //nombre de usuario login
    const tipoDocumento = this.seguridadService.getNameId();   //tipo de documento usuario login
    this.nroDocumentoLogin = this.seguridadService.getNumDoc();    //nro de documento usuario login
    this.datosUsuarioLogin = this.seguridadService.getDatosUsuarioLogin(); // Datos personales del usuario
    this.tipoDocumentoValidForm = tipoDocumento;

    console.log(this.seguridadService.getDatosUsuarioLogin());

    switch (tipoDocumento) {
      case "00001": case "00004": // PN, PE
        this.formulario.controls["rucPersona"].clearValidators();
        this.formulario.controls["ruc"].clearValidators();
        this.formulario.controls["razonSocial"].clearValidators();
        this.formulario.controls["domicilio"].clearValidators();
        this.formulario.controls["distrito"].clearValidators();
        this.formulario.controls["provincia"].clearValidators();
        this.formulario.controls["departamento"].clearValidators();
        this.formulario.controls["tipoDocumento"].clearValidators();
        this.formulario.controls["numeroDocumento"].clearValidators();
        this.formulario.controls["nombreRepresentante"].clearValidators();
        this.formulario.controls["apePaternoRepresentante"].clearValidators();
        this.formulario.controls["apeMaternoRepresentante"].clearValidators();
        this.formulario.controls['domicilioRepresentante'].clearValidators();
        this.formulario.controls["telefonoRepresentante"].clearValidators();
        this.formulario.controls["celularRepresentante"].clearValidators();
        this.formulario.controls["correoRepresentante"].clearValidators();
        this.formulario.controls['distritoRepresentante'].clearValidators();
        this.formulario.controls['provinciaRepresentante'].clearValidators();
        this.formulario.controls['departamentoRepresentante'].clearValidators();
        this.formulario.controls['oficinaRepresentante'].clearValidators();
        this.formulario.controls['partidaRepresentante'].clearValidators();
        this.formulario.controls['asientoRepresentante'].clearValidators();
        this.formulario.updateValueAndValidity();

        this.activarPN = true;
        this.activarPJ = false;
        break;

      case "00005": //PNR
        this.formulario.controls["ruc"].clearValidators();
        this.formulario.controls["razonSocial"].clearValidators();
        this.formulario.controls["domicilio"].clearValidators();
        this.formulario.controls["distrito"].clearValidators();
        this.formulario.controls["provincia"].clearValidators();
        this.formulario.controls["departamento"].clearValidators();
        this.formulario.controls["tipoDocumento"].clearValidators();
        this.formulario.controls["numeroDocumento"].clearValidators();
        this.formulario.controls["nombreRepresentante"].clearValidators();
        this.formulario.controls["apePaternoRepresentante"].clearValidators();
        this.formulario.controls["apeMaternoRepresentante"].clearValidators();
        this.formulario.controls['domicilioRepresentante'].clearValidators();
        this.formulario.controls["telefonoRepresentante"].clearValidators();
        this.formulario.controls["celularRepresentante"].clearValidators();
        this.formulario.controls["correoRepresentante"].clearValidators();
        this.formulario.controls['distritoRepresentante'].clearValidators();
        this.formulario.controls['provinciaRepresentante'].clearValidators();
        this.formulario.controls['departamentoRepresentante'].clearValidators();
        this.formulario.controls['oficinaRepresentante'].clearValidators();
        this.formulario.controls['partidaRepresentante'].clearValidators();
        this.formulario.controls['asientoRepresentante'].clearValidators();
        this.formulario.updateValueAndValidity();

        this.activarPN = true;
        this.activarPJ = false;
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

        this.activarPN = false;
        this.activarPJ = true;

        break;
    }

    this.cargarDatos();
    this.recuperarDatosUsuario();

    if (this.activarDatosGenerales) { //empresa extranjera
      if (tipoDocumento === "00002" || tipoDocumento === "00001")
        this.funcionesMtcService.mensajeError('Este procedimiento lo realiza una PERSONA NATURAL CON RUC.');
    }

    if(this.codigoProcedimientoTupa == "DGAC-020" || this.codigoProcedimientoTupa == "DGAC-021"){
      this.habilitarSeccion12 = false
      this.formulario.controls["usoAerodromo"].clearValidators();
      this.formulario.controls["propietarioAerodromoOficina"].clearValidators();
      this.formulario.controls["propietarioAerodromoPartida"].clearValidators();
      this.formulario.controls["propietarioAerodromoAsiento"].clearValidators();
      this.formulario.controls["oficio_dgac"].clearValidators();
      this.formulario.updateValueAndValidity();
    }

    if(this.codigoProcedimientoTupa== "DGAC-022" || this.codigoProcedimientoTupa == "DGAC-023"){
      this.habilitarSeccion11 = false
      this.formulario.controls["memoriaDescriptiva"].clearValidators();
      this.formulario.controls["estudioImpactoAmbiental"].clearValidators();
      this.formulario.controls["certificadoHabilidadProfesional"].clearValidators();
      this.formulario.controls["profesionalHabilitadoNombre"].clearValidators();
      this.formulario.controls["profesionalHabilitadoProfesion"].clearValidators();
      this.formulario.controls["profesionalHabilitadoColegiatura"].clearValidators();
      this.formulario.updateValueAndValidity();
    }

    if(this.codigoProcedimientoTupa== "S-DGAC-009"){
      this.habilitarSeccion11 = false
      this.formulario.controls["memoriaDescriptiva"].clearValidators();
      this.formulario.controls["estudioImpactoAmbiental"].clearValidators();
      this.formulario.controls["certificadoHabilidadProfesional"].clearValidators();
      this.formulario.controls["profesionalHabilitadoNombre"].clearValidators();
      this.formulario.controls["profesionalHabilitadoProfesion"].clearValidators();
      this.formulario.controls["profesionalHabilitadoColegiatura"].clearValidators();

      this.formulario.controls["usoAerodromo"].clearValidators();
      this.formulario.controls["propietarioAerodromoOficina"].clearValidators();
      this.formulario.controls["propietarioAerodromoPartida"].clearValidators();
      this.formulario.controls["propietarioAerodromoAsiento"].clearValidators();

      this.formulario.updateValueAndValidity();
    }
  }

  get UsoAerodromoFG(): UntypedFormGroup { return this.formulario.get('usoAerodromo') as UntypedFormGroup; }

  cargarOficinaRegistral() {
    this.oficinaRegistralService.oficinaRegistral().subscribe(
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
    const apellMatR = this.formulario.controls['apeMaternoRepresentante'];

    if (tipoDocumento === '04') {

      this.disabled = false;
      apellMatR.setValidators(null);
      apellMatR.updateValueAndValidity();
    } else {
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

    const resultado = this.representanteLegal.find(representante => ('0' + representante.tipoDocumento.trim()).toString() === tipoDocumento && representante.nroDocumento.trim() === numeroDocumento);
    if (resultado) {//DNI
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
            this.cargoRepresentanteLegal = cargo[cargo.length - 1].trim();
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
    } else {
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

  cargarDatos() {
    this.funcionesMtcService.mostrarCargando();

    this.formulario.controls["nombreRepresentante"].disable();
    this.formulario.controls["apePaternoRepresentante"].disable();
    this.formulario.controls["apeMaternoRepresentante"].disable();

    switch (this.seguridadService.getNameId()) {
      case '00001': this.tipoSolicitante = 'PN'; //persona natural
        this.formulario.controls['tipoDocumentoSolicitante'].setValue('DNI');
        this.codTipoDocSolicitante = '01';
        break;

      case '00002': this.tipoSolicitante = 'PJ'; // persona juridica
        this.formulario.controls['tipoDocumentoSolicitante'].setValue('DNI');
        break;

      case '00004': this.tipoSolicitante = 'PE'; // persona extranjera
        this.formulario.controls['tipoDocumentoSolicitante'].setValue('CARNET DE EXTRANJERIA');
        this.codTipoDocSolicitante = '04';
        break;

      case '00005': this.tipoSolicitante = 'PNR'; // persona natural con ruc
        this.formulario.controls['tipoDocumentoSolicitante'].setValue('DNI');
        this.codTipoDocSolicitante = '01';
        break;
    }

    if (this.dataInput != null && this.dataInput.movId > 0) {

      this.formularioTramiteService.get<any>(this.dataInput.tramiteReqId).subscribe(
        (dataFormulario: Formulario007_12Response) => {

          this.funcionesMtcService.ocultarCargando();
          const metaData: MetaData = JSON.parse(dataFormulario.metaData);
          console.log("metadata",metaData)
          this.id = dataFormulario.formularioId;

          if (this.codigoProcedimientoTupa == 'DGAC-020' || this.codigoProcedimientoTupa == 'DGAC-021') {
            this.formulario.controls["memoriaDescriptiva"].setValue(metaData.seccion1.memoria);
            this.formulario.controls["estudioImpactoAmbiental"].setValue(metaData.seccion1.estudio);
            this.formulario.controls["certificadoHabilidadProfesional"].setValue(metaData.seccion1.certificado);

            this.pathPdfMemoriaDescriptivaSeleccionado = metaData.seccion1.pathNameMemoriaDescriptiva;
            this.pathPdfImpactoAmbientalSeleccionado = metaData.seccion1.pathNameImpactoAmbiental;
            this.pathPdfHabilidadProfesionalSeleccionado = metaData.seccion1.pathNameHabilidadProfesional;

            this.formulario.controls["profesionalHabilitadoNombre"].setValue(metaData.seccion1.profesional_nombre);
            this.formulario.controls["profesionalHabilitadoProfesion"].setValue(metaData.seccion1.profesional_profesion);
            this.formulario.controls["profesionalHabilitadoColegiatura"].setValue(metaData.seccion1.profesional_colegiatura);
          }

          if (this.codigoProcedimientoTupa == 'DGAC-022' || this.codigoProcedimientoTupa == 'DGAC-023') {
            this.UsoAerodromoFG.get("publico").setValue(metaData.seccion1.aerodromo_publico);
            this.UsoAerodromoFG.get("privado").setValue(metaData.seccion1.aerodromo_privado);
            this.formulario.controls["propietarioAerodromoOficina"].setValue(metaData.seccion1.aerodromo_oficina.id);
            this.formulario.controls["propietarioAerodromoPartida"].setValue(metaData.seccion1.aerodromo_partida);
            this.formulario.controls["propietarioAerodromoAsiento"].setValue(metaData.seccion1.aerodromo_asiento);
          }

          

          this.formulario.controls["oficio_dgac"].setValue(metaData.seccion1.aerodromo_oficio);

          /*if(this.habilitarSeccion12){
            this.formulario.controls["oficio_dgac"].setValue(metaData.seccion1.aerodromo_oficio);
          }*/
          this.formulario.controls["modalidadNotificacion"].setValue(metaData.seccion2.modalidadNotificacion.toString());

          if (this.activarPN) {
            this.formulario.controls["nombresPersona"].setValue(metaData.seccion3.nombresApellidos);
            this.formulario.controls["nroDocumentoSolicitante"].setValue(metaData.seccion3.numeroDocumento);
            this.formulario.controls['rucPersona'].setValue(metaData.seccion3.ruc);
            this.formulario.controls["domicilioPersona"].setValue(metaData.seccion3.domicilioLegal);
            this.formulario.controls["distritoPersona"].setValue(metaData.seccion3.distrito);
            this.formulario.controls["provinciaPersona"].setValue(metaData.seccion3.provincia);
            this.formulario.controls["departamentoPersona"].setValue(metaData.seccion3.departamento);
            this.formulario.controls["telefonoPersona"].setValue(metaData.seccion3.telefono);
            this.formulario.controls["celularPersona"].setValue(metaData.seccion3.celular);
            this.formulario.controls["correoPersona"].setValue(metaData.seccion3.email);

            this.formulario.controls['nombresPersona'].disable();
            this.formulario.controls['tipoDocumentoSolicitante'].disable();
            this.formulario.controls['nroDocumentoSolicitante'].disable();
            this.formulario.controls['rucPersona'].disable();

          }

          if (this.activarPJ) {
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
            this.formulario.controls["tipoDocumento"].setValue(metaData.seccion3.representanteLegal.tipoDocumento.id);
            this.formulario.controls["numeroDocumento"].setValue(metaData.seccion3.representanteLegal.numeroDocumento);
            this.formulario.controls["nombreRepresentante"].setValue(metaData.seccion3.representanteLegal.nombres);
            this.formulario.controls["apePaternoRepresentante"].setValue(metaData.seccion3.representanteLegal.apellidoPaterno);
            this.formulario.controls["apeMaternoRepresentante"].setValue(metaData.seccion3.representanteLegal.apellidoMaterno);
            this.formulario.controls["domicilioRepresentante"].setValue(metaData.seccion3.representanteLegal.domicilioLegal);
            this.formulario.controls['distritoRepresentante'].setValue(metaData.seccion3.representanteLegal.distrito);
            this.formulario.controls['provinciaRepresentante'].setValue(metaData.seccion3.representanteLegal.provincia);
            this.formulario.controls['departamentoRepresentante'].setValue(metaData.seccion3.representanteLegal.departamento);
            this.formulario.controls['oficinaRepresentante'].setValue(metaData.seccion3.representanteLegal.oficinaRegistral.id);
            this.formulario.controls['partidaRepresentante'].setValue(metaData.seccion3.representanteLegal.partida);
            this.formulario.controls['asientoRepresentante'].setValue(metaData.seccion3.representanteLegal.asiento);
          }
          this.formulario.controls["declaracion_1"].setValue(metaData.seccion5.declaracion_1);
          this.formulario.controls["declaracion_2"].setValue(metaData.seccion5.declaracion_2);
        }, (error) => {
          this.funcionesMtcService.ocultarCargando().mensajeError('Problemas para recuperar los datos guardados');
        }
      );
    } else {
      if (this.activarPN) {
        console.log(this.datosUsuarioLogin.nombres);
        this.formulario.controls['nroDocumentoSolicitante'].setValue(this.nroDocumentoLogin.trim());
        this.formulario.controls['rucPersona'].setValue(this.seguridadService.getCompanyCode());
        this.formulario.controls['nombresPersona'].disable();
        this.formulario.controls['tipoDocumentoSolicitante'].disable();
        this.formulario.controls['nroDocumentoSolicitante'].disable();
        this.formulario.controls['rucPersona'].disable();
        this.formulario.controls['domicilioPersona'].disable();
        this.formulario.controls['distritoPersona'].disable();
        this.formulario.controls['provinciaPersona'].disable();
        this.formulario.controls['departamentoPersona'].disable();
        this.formulario.controls['telefonoPersona'].enable();
        this.formulario.controls['celularPersona'].enable();
        this.formulario.controls['correoPersona'].enable();
        this.formulario.controls['tipoDocumento'].disable();
        this.formulario.controls['numeroDocumento'].disable();

        this.formulario.controls['nombresPersona'].setValue(this.datosUsuarioLogin.nombres + " " + this.datosUsuarioLogin.apePaterno.trim() +" "+ this.datosUsuarioLogin.apeMaterno.trim());
        this.formulario.controls['domicilioPersona'].setValue(this.datosUsuarioLogin.direccion.trim());

        this.formulario.controls['distritoPersona'].setValue(this.datosUsuarioLogin.distrito.trim());
        this.formulario.controls['provinciaPersona'].setValue(this.datosUsuarioLogin.provincia.trim());
        this.formulario.controls['departamentoPersona'].setValue(this.datosUsuarioLogin.departamento.trim());

        this.formulario.controls['telefonoPersona'].setValue(this.datosUsuarioLogin.telefono.trim());
        this.formulario.controls['celularPersona'].setValue(this.datosUsuarioLogin.celular.trim());
        this.formulario.controls['correoPersona'].setValue(this.datosUsuarioLogin.correo.trim());
        
      } else {
        this.sunatService.getDatosPrincipales(this.nroRuc).subscribe(
          (response) => {
            this.funcionesMtcService.ocultarCargando();
            if (this.tipoSolicitante == "PJ") {
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
            } else {

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

  soloNumeros(event) {
    event.target.value = event.target.value.replace(/[^0-9]/g, '');
  }

  onChangeMemoriaDescriptiva(): void {
    this.visibleButtonMemoriaDescriptiva = this.formulario.controls["memoriaDescriptiva"].value;
    if (this.visibleButtonMemoriaDescriptiva === true) {
      this.funcionesMtcService
        .mensajeConfirmar('¿Declaro que la información adjunta en el archivo es verídica?', 'DECLARACIÓN')
        .catch(() => {
          this.visibleButtonMemoriaDescriptiva = false;
          this.formulario.controls["memoriaDescriptiva"].setValue(false);
        });
    } else {
      this.filePdfMemoriaDescriptivaSeleccionado = null;
      this.pathPdfMemoriaDescriptivaSeleccionado = null;
    }
  }

  onChangeImpactoAmbiental(): void {
    this.visibleButtonImpactoAmbiental = this.formulario.controls["estudioImpactoAmbiental"].value;
    if (this.visibleButtonImpactoAmbiental === true) {
      this.funcionesMtcService
        .mensajeConfirmar('¿Declaro que la información adjunta en el archivo es verídica?', 'DECLARACIÓN')
        .catch(() => {
          this.visibleButtonImpactoAmbiental = false;
          this.formulario.controls["estudioImpactoAmbiental"].setValue(false);
        });
    } else {
      this.filePdfImpactoAmbientalSeleccionado = null;
      this.pathPdfImpactoAmbientalSeleccionado = null;
    }
  }

  onChangeHabilidadProfesional(): void {
    this.visibleButtonHabilidadProfesional = this.formulario.controls["certificadoHabilidadProfesional"].value;
    if (this.visibleButtonHabilidadProfesional === true) {
      this.funcionesMtcService
        .mensajeConfirmar('¿Declaro que la información adjunta en el archivo es verídica?', 'DECLARACIÓN')
        .catch(() => {
          this.visibleButtonHabilidadProfesional = false;
          this.formulario.controls["certificadoHabilidadProfesional"].setValue(false);
        });
    } else {
      this.filePdfHabilidadProfesionalSeleccionado = null;
      this.pathPdfHabilidadProfesionalSeleccionado = null;
    }
  }

  onChangeInputMemoriaDescriptiva(event): void {
    if (event.target.files.length === 0) {
      return;
    }
    if (event.target.files[0].type !== 'application/pdf') {
      event.target.value = '';
      this.funcionesMtcService.mensajeError('Solo puede adjuntar archivos PDF');
      return;
    }
    this.filePdfMemoriaDescriptivaSeleccionado = event.target.files[0];
    event.target.value = '';
  }

  onChangeInputImpactoAmbiental(event): void {
    if (event.target.files.length === 0) {
      return;
    }
    if (event.target.files[0].type !== 'application/pdf') {
      event.target.value = '';
      this.funcionesMtcService.mensajeError('Solo puede adjuntar archivos PDF');
      return;
    }
    this.filePdfImpactoAmbientalSeleccionado = event.target.files[0];
    event.target.value = '';
  }

  onChangeInputHabilidadProfesional(event): void {
    if (event.target.files.length === 0) {
      return;
    }
    if (event.target.files[0].type !== 'application/pdf') {
      event.target.value = '';
      this.funcionesMtcService.mensajeError('Solo puede adjuntar archivos PDF');
      return;
    }
    this.filePdfHabilidadProfesionalSeleccionado = event.target.files[0];
    event.target.value = '';
  }

  vistaPreviaMemoriaDescriptiva(): void {
    if (this.pathPdfMemoriaDescriptivaSeleccionado === null || this.filePdfMemoriaDescriptivaSeleccionado !== null) {
      const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
      const urlPdf = URL.createObjectURL(this.filePdfMemoriaDescriptivaSeleccionado);
      modalRef.componentInstance.pdfUrl = urlPdf;
      modalRef.componentInstance.titleModal = 'Vista Previa - Memoria Descriptiva';
    } else {
      this.funcionesMtcService.mostrarCargando();

      this.visorPdfArchivosService.get(this.pathPdfMemoriaDescriptivaSeleccionado)
        .subscribe(
          (file: Blob) => {
            this.funcionesMtcService.ocultarCargando();
            const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
            const urlPdf = URL.createObjectURL(file);
            modalRef.componentInstance.pdfUrl = urlPdf;
            modalRef.componentInstance.titleModal = 'Vista Previa - Memoria Descriptiva';
          },
          error => {
            this.funcionesMtcService
              .ocultarCargando()
              .mensajeError('Problemas para descargar Pdf');
          }
        );
    }
  }

  vistaPreviaImpactoAmbiental(): void {
    if (this.pathPdfImpactoAmbientalSeleccionado === null || this.filePdfImpactoAmbientalSeleccionado !== null) {
      const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
      const urlPdf = URL.createObjectURL(this.filePdfImpactoAmbientalSeleccionado);
      modalRef.componentInstance.pdfUrl = urlPdf;
      modalRef.componentInstance.titleModal = 'Vista Previa - Impacto Ambiental';
    } else {
      this.funcionesMtcService.mostrarCargando();
      this.visorPdfArchivosService.get(this.pathPdfImpactoAmbientalSeleccionado)
        .subscribe(
          (file: Blob) => {
            this.funcionesMtcService.ocultarCargando();

            const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
            const urlPdf = URL.createObjectURL(file);
            modalRef.componentInstance.pdfUrl = urlPdf;
            modalRef.componentInstance.titleModal = 'Vista Previa - Impacto Ambiental';
          },
          error => {
            this.funcionesMtcService
              .ocultarCargando()
              .mensajeError('Problemas para descargar Pdf');
          }
        );
    }
  }

  vistaPreviaHabilidadProfesional(): void {
    if (this.pathPdfHabilidadProfesionalSeleccionado === null || this.filePdfHabilidadProfesionalSeleccionado !== null) {
      const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
      const urlPdf = URL.createObjectURL(this.filePdfHabilidadProfesionalSeleccionado);
      modalRef.componentInstance.pdfUrl = urlPdf;
      modalRef.componentInstance.titleModal = 'Vista Previa - Habilidad Profesional';
    } else {
      this.funcionesMtcService.mostrarCargando();

      this.visorPdfArchivosService.get(this.pathPdfHabilidadProfesionalSeleccionado)
        .subscribe(
          (file: Blob) => {
            this.funcionesMtcService.ocultarCargando();

            const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
            const urlPdf = URL.createObjectURL(file);
            modalRef.componentInstance.pdfUrl = urlPdf;
            modalRef.componentInstance.titleModal = 'Vista Previa - Habilidad Profesional';
          },
          error => {
            this.funcionesMtcService
              .ocultarCargando()
              .mensajeError('Problemas para descargar Pdf');
          }
        );
    }
  }

  guardarFormulario(): void {
    if (this.formulario.invalid === true) {
      this.funcionesMtcService.mensajeError('Debe ingresar todos los campos obligatorios');
      return;
    }

    if (this.codigoProcedimientoTupa === 'DGAC-021') {
      if (!this.filePdfMemoriaDescriptivaSeleccionado && !this.pathPdfMemoriaDescriptivaSeleccionado) {
        this.funcionesMtcService.mensajeError('Debe ingresar todos los documentos del expediente técnico.');
        return;
      }
      if (!this.filePdfImpactoAmbientalSeleccionado && !this.pathPdfImpactoAmbientalSeleccionado) {
        this.funcionesMtcService.mensajeError('Debe ingresar todos los documentos del expediente técnico.');
        return;
      }
      if (!this.filePdfHabilidadProfesionalSeleccionado && !this.pathPdfHabilidadProfesionalSeleccionado) {
        this.funcionesMtcService.mensajeError('Debe ingresar todos los documentos del expediente técnico.');
        return;
      }
    } else if (this.codigoProcedimientoTupa === 'DGAC-020') {
      if (!this.filePdfMemoriaDescriptivaSeleccionado && !this.pathPdfMemoriaDescriptivaSeleccionado) {
        this.funcionesMtcService.mensajeError('Debe ingresar todos los documentos del expediente técnico.');
        return;
      }
      if (!this.filePdfHabilidadProfesionalSeleccionado && !this.pathPdfHabilidadProfesionalSeleccionado) {
        this.funcionesMtcService.mensajeError('Debe ingresar todos los documentos del expediente técnico.');
        return;
      }
    }

    const dataGuardar: Formulario007_12Request = new Formulario007_12Request();
    dataGuardar.id = this.id;
    dataGuardar.codigo = 'F007-12';
    dataGuardar.formularioId = 7;
    dataGuardar.codUsuario = this.nroDocumentoLogin;
    dataGuardar.idTramiteReq = this.dataInput.tramiteReqId;
    dataGuardar.estado = 1;

    let oficinaRepresentante = this.formulario.controls['oficinaRepresentante'].value;

    // if (this.codigoProcedimientoTupa === 'DGAC-020' || this.codigoProcedimientoTupa === 'DGAC-021') {
    //   this.formulario.controls["memoriaDescriptiva"].setValue(metaData.seccion1.memoria);
    //   this.formulario.controls["estudioImpactoAmbiental"].setValue(metaData.seccion1.estudio);
    //   this.formulario.controls["certificadoHabilidadProfesional"].setValue(metaData.seccion1.certificado);

    //   this.pathPdfMemoriaDescriptivaSeleccionado = metaData.seccion1.pathNameMemoriaDescriptiva;
    //   this.pathPdfImpactoAmbientalSeleccionado = metaData.seccion1.pathNameImpactoAmbiental;
    //   this.pathPdfHabilidadProfesionalSeleccionado = metaData.seccion1.pathNameMemoriaDescriptiva;

    //   this.formulario.controls["profesionalHabilitadoNombre"].setValue(metaData.seccion1.profesional_nombre);
    //   this.formulario.controls["profesionalHabilitadoProfesion"].setValue(metaData.seccion1.profesional_profesion);
    //   this.formulario.controls["profesionalHabilitadoColegiatura"].setValue(metaData.seccion1.profesional_colegiatura);
    // }

    // if (this.codigoProcedimientoTupa === 'DGAC-022' || this.codigoProcedimientoTupa === 'DGAC-023') {
    //   this.formulario.controls["usoAerodromo.publico"].setValue(metaData.seccion1.aerodromo_publico);
    //   this.formulario.controls["usoAerodromo.privado"].setValue(metaData.seccion1.aerodromo_privado);

    //   this.formulario.controls["propietarioAerodromoOficina"].setValue(metaData.seccion1.aerodromo_oficina.id);
    //   this.formulario.controls["propietarioAerodromoPartida"].setValue(metaData.seccion1.aerodromo_partida);
    //   this.formulario.controls["propietarioAerodromoAsiento"].setValue(metaData.seccion1.aerodromo_asiento);

    //   this.formulario.controls["oficio_dgac"].setValue(metaData.seccion1.aerodromo_oficio);
    // }

    dataGuardar.metaData.seccion1.dgac_020 = (this.codigoProcedimientoTupa === 'DGAC-020' ? '1' : '0');
    dataGuardar.metaData.seccion1.dgac_021 = (this.codigoProcedimientoTupa === 'DGAC-021' ? '1' : '0');
    dataGuardar.metaData.seccion1.dgac_022 = (this.codigoProcedimientoTupa === 'DGAC-022' ? '1' : '0');
    dataGuardar.metaData.seccion1.dgac_023 = (this.codigoProcedimientoTupa === 'DGAC-023' ? '1' : '0');
    dataGuardar.metaData.seccion1.s_dgac_009 = (this.codigoProcedimientoTupa === 'S-DGAC-009' ? '1' : '0');

    dataGuardar.metaData.seccion1.memoria = this.formulario.controls["memoriaDescriptiva"].value;
    dataGuardar.metaData.seccion1.estudio = this.formulario.controls["estudioImpactoAmbiental"].value;
    dataGuardar.metaData.seccion1.certificado = this.formulario.controls["certificadoHabilidadProfesional"].value;

    dataGuardar.metaData.seccion1.fileMemoriaDescriptiva = this.filePdfMemoriaDescriptivaSeleccionado;
    dataGuardar.metaData.seccion1.fileImpactoAmbiental = this.filePdfImpactoAmbientalSeleccionado;
    dataGuardar.metaData.seccion1.fileHabilidadProfesional = this.filePdfHabilidadProfesionalSeleccionado;
    dataGuardar.metaData.seccion1.pathNameMemoriaDescriptiva = this.pathPdfMemoriaDescriptivaSeleccionado;
    dataGuardar.metaData.seccion1.pathNameImpactoAmbiental = this.pathPdfImpactoAmbientalSeleccionado;
    dataGuardar.metaData.seccion1.pathNameHabilidadProfesional = this.pathPdfHabilidadProfesionalSeleccionado;

    dataGuardar.metaData.seccion1.profesional_nombre = this.formulario.controls["profesionalHabilitadoNombre"].value;
    dataGuardar.metaData.seccion1.profesional_profesion = this.formulario.controls["profesionalHabilitadoProfesion"].value;
    dataGuardar.metaData.seccion1.profesional_colegiatura = this.formulario.controls["profesionalHabilitadoColegiatura"].value;

    dataGuardar.metaData.seccion1.aerodromo_publico = this.UsoAerodromoFG.get('publico').value
    dataGuardar.metaData.seccion1.aerodromo_privado = this.UsoAerodromoFG.get('privado').value
    const oficinaEmpresa = this.formulario.controls["propietarioAerodromoOficina"].value;
    dataGuardar.metaData.seccion1.aerodromo_oficina.id = oficinaEmpresa;
    dataGuardar.metaData.seccion1.aerodromo_oficina.descripcion = (oficinaEmpresa !== '' ? this.oficinasRegistral.filter(item => item.value === oficinaEmpresa)[0].text: '');
    console.log(dataGuardar.metaData.seccion1.aerodromo_oficina.descripcion);
    dataGuardar.metaData.seccion1.aerodromo_partida = this.formulario.controls["propietarioAerodromoPartida"].value;
    dataGuardar.metaData.seccion1.aerodromo_asiento = this.formulario.controls["propietarioAerodromoAsiento"].value;

    dataGuardar.metaData.seccion1.aerodromo_oficio = this.formulario.controls["oficio_dgac"].value;

    dataGuardar.metaData.seccion2.modalidadNotificacion = this.formulario.controls['modalidadNotificacion'].value;

    dataGuardar.metaData.seccion3.tipoSolicitante = this.tipoSolicitante;
    dataGuardar.metaData.seccion3.nombresApellidos = (this.tipoSolicitante === 'PN' || this.tipoSolicitante === 'PNR' || this.tipoSolicitante === 'PE' ? this.formulario.controls['nombresPersona'].value : '');
    dataGuardar.metaData.seccion3.tipoDocumento = (this.tipoSolicitante === "PJ" ? this.formulario.controls['tipoDocumento'].value : this.codTipoDocSolicitante); //codDocumento
    dataGuardar.metaData.seccion3.numeroDocumento = (this.tipoSolicitante === "PJ" ? this.formulario.controls['ruc'].value : this.formulario.controls['nroDocumentoSolicitante'].value); //nroDocumento
    dataGuardar.metaData.seccion3.ruc = (this.tipoSolicitante === "PJ" ? "" : this.formulario.controls['rucPersona'].value);
    dataGuardar.metaData.seccion3.razonSocial = (this.tipoSolicitante === 'PJ' ? this.formulario.controls['razonSocial'].value : '');
    dataGuardar.metaData.seccion3.domicilioLegal = (this.tipoSolicitante === 'PJ' ? this.formulario.controls['domicilio'].value : this.formulario.controls['domicilioPersona'].value);
    dataGuardar.metaData.seccion3.distrito = (this.tipoSolicitante === 'PJ' ? this.formulario.controls['distrito'].value : this.formulario.controls['distritoPersona'].value);
    dataGuardar.metaData.seccion3.provincia = (this.tipoSolicitante === 'PJ' ? this.formulario.controls['provincia'].value : this.formulario.controls['provinciaPersona'].value);
    dataGuardar.metaData.seccion3.departamento = (this.tipoSolicitante === 'PJ' ? this.formulario.controls['departamento'].value : this.formulario.controls['departamentoPersona'].value);
    dataGuardar.metaData.seccion3.representanteLegal.nombres = this.formulario.controls['nombreRepresentante'].value;
    dataGuardar.metaData.seccion3.representanteLegal.apellidoPaterno = this.formulario.controls['apePaternoRepresentante'].value;
    dataGuardar.metaData.seccion3.representanteLegal.apellidoMaterno = this.formulario.controls['apeMaternoRepresentante'].value;
    dataGuardar.metaData.seccion3.representanteLegal.tipoDocumento.id = this.formulario.controls['tipoDocumento'].value;
    dataGuardar.metaData.seccion3.representanteLegal.tipoDocumento.documento = (this.tipoSolicitante === "PJ" ? this.listaTiposDocumentos.filter(item => item.id == this.formulario.get('tipoDocumento').value)[0].documento : "");
    dataGuardar.metaData.seccion3.representanteLegal.numeroDocumento = this.formulario.controls['numeroDocumento'].value;
    dataGuardar.metaData.seccion3.representanteLegal.domicilioLegal = this.formulario.controls['domicilioRepresentante'].value;
    dataGuardar.metaData.seccion3.representanteLegal.oficinaRegistral.id = oficinaRepresentante;
    dataGuardar.metaData.seccion3.representanteLegal.oficinaRegistral.descripcion = (this.tipoSolicitante === "PJ" ? this.oficinasRegistral.filter(item => item.value == oficinaRepresentante)[0].text : "");
    dataGuardar.metaData.seccion3.representanteLegal.partida = this.formulario.controls['partidaRepresentante'].value;
    dataGuardar.metaData.seccion3.representanteLegal.asiento = this.formulario.controls['asientoRepresentante'].value;
    dataGuardar.metaData.seccion3.representanteLegal.distrito = this.formulario.controls['distritoRepresentante'].value;
    dataGuardar.metaData.seccion3.representanteLegal.provincia = this.formulario.controls['provinciaRepresentante'].value;
    dataGuardar.metaData.seccion3.representanteLegal.departamento = this.formulario.controls['departamentoRepresentante'].value;
    dataGuardar.metaData.seccion3.representanteLegal.cargo = this.cargoRepresentanteLegal;
    dataGuardar.metaData.seccion3.telefono = (this.tipoSolicitante === 'PJ' ? this.formulario.controls['telefonoRepresentante'].value : this.formulario.controls['telefonoPersona'].value);
    dataGuardar.metaData.seccion3.celular = (this.tipoSolicitante === 'PJ' ? this.formulario.controls['celularRepresentante'].value : this.formulario.controls['celularPersona'].value);
    dataGuardar.metaData.seccion3.email = (this.tipoSolicitante === 'PJ' ? this.formulario.controls['correoRepresentante'].value : this.formulario.controls['correoPersona'].value);

    dataGuardar.metaData.seccion5.declaracion_1 = this.formulario.controls['declaracion_1'].value;
    dataGuardar.metaData.seccion5.declaracion_2 = this.formulario.controls['declaracion_2'].value;

    dataGuardar.metaData.seccion6.dni = (this.tipoSolicitante === 'PJ' ? this.formulario.controls['numeroDocumento'].value : this.formulario.controls['nroDocumentoSolicitante'].value);
    dataGuardar.metaData.seccion6.nombre = (this.tipoSolicitante === 'PJ' ? this.formulario.controls['nombreRepresentante'].value + ' ' + this.formulario.controls['apePaternoRepresentante'].value + ' ' + this.formulario.controls['apeMaternoRepresentante'].value : this.formulario.controls['nombresPersona'].value);

    const dataGuardarFormData = this.funcionesMtcService.jsonToFormData(dataGuardar);

    console.log('dataGuardar: ', JSON.stringify(dataGuardar));

    this.funcionesMtcService.mensajeConfirmar(`¿Está seguro de ${this.id === 0 ? 'guardar' : 'modificar'} los datos ingresados?`)
      .then(() => {
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
          modalRef.componentInstance.titleModal = "Vista Previa - Formulario 004/12";

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
